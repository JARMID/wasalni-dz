import 'dart:async';
import 'package:flutter/foundation.dart';
import '../models/dashcam_incident.dart';
import '../models/ledger_entry.dart';
import 'supabase_service.dart';

/// Represents a queued offline transaction awaiting cellular or Wi-Fi reconnect.
class QueuedOfflineItem {
  QueuedOfflineItem({
    required this.id,
    required this.type,
    required this.payload,
    required this.enqueuedAt,
    this.retryCount = 0,
    this.lastError,
  });

  final String id;
  final String type; // 'ledger_entry', 'dashcam_incident', 'spare_change_rpc'
  final Map<String, dynamic> payload;
  final DateTime enqueuedAt;
  int retryCount;
  String? lastError;

  Map<String, dynamic> toJson() => {
        'id': id,
        'type': type,
        'payload': payload,
        'enqueued_at': enqueuedAt.toIso8601String(),
        'retry_count': retryCount,
        'last_error': lastError,
      };

  factory QueuedOfflineItem.fromJson(Map<String, dynamic> json) {
    return QueuedOfflineItem(
      id: json['id'] as String,
      type: json['type'] as String,
      payload: Map<String, dynamic>.from(json['payload'] as Map),
      enqueuedAt: DateTime.parse(json['enqueued_at'] as String),
      retryCount: (json['retry_count'] as num?)?.toInt() ?? 0,
      lastError: json['last_error'] as String?,
    );
  }
}

/// Result summary of an offline queue synchronization pass.
class SyncPassResult {
  const SyncPassResult({
    required this.succeeded,
    required this.failed,
    required this.remaining,
  });

  final int succeeded;
  final int failed;
  final int remaining;

  bool get isClean => remaining == 0 && failed == 0;
}

/// Offline resilience service that buffers critical double-entry ledger settlements,
/// Law 25-11 dashcam incidents, and spare change micro-credits when cellular connectivity drops
/// in Algiers road tunnels or underground hubs.
class OfflineSyncQueue extends ChangeNotifier {
  OfflineSyncQueue({
    SupabaseService? supabaseService,
    bool initialOnlineState = true,
  })  : _supabaseService = supabaseService,
        _isOnline = initialOnlineState;

  SupabaseService? _supabaseService;
  final List<QueuedOfflineItem> _queue = [];
  bool _isOnline = true;
  bool _isSyncing = false;
  DateTime? _lastSyncTime;

  bool get isOnline => _isOnline;
  bool get isSyncing => _isSyncing;
  DateTime? get lastSyncTime => _lastSyncTime;
  int get pendingCount => _queue.length;
  List<QueuedOfflineItem> get items => List.unmodifiable(_queue);

  void attachSupabaseService(SupabaseService service) {
    _supabaseService = service;
  }

  /// Sets connectivity state and automatically flushes the queue when recovering from offline.
  Future<SyncPassResult?> setOnlineStatus(bool online) async {
    final previouslyOffline = !_isOnline;
    _isOnline = online;
    notifyListeners();

    if (previouslyOffline && online && _queue.isNotEmpty && _supabaseService != null) {
      return await flushQueue();
    }
    return null;
  }

  /// Enqueues a double-entry ledger transaction.
  String enqueueLedgerEntry(
    LedgerEntry entry, {
    String? debitWalletId,
    String? creditWalletId,
    String? batchId,
    String? idempotencyKey,
  }) {
    final itemId = generateUuidV4();
    final item = QueuedOfflineItem(
      id: itemId,
      type: 'ledger_entry',
      payload: {
        'entry_id': entry.id,
        'entry_type': entry.entryType,
        'timestamp': entry.timestamp,
        'amount_dzd': entry.amountDzd,
        'debit_account': entry.debitAccount,
        'credit_account': entry.creditAccount,
        'description': entry.description,
        'ride_id': entry.rideId,
        'debit_wallet_id': debitWalletId,
        'credit_wallet_id': creditWalletId,
        'batch_id': batchId ?? generateUuidV4(),
        'idempotency_key': idempotencyKey ?? '${entry.id}-$itemId',
      },
      enqueuedAt: DateTime.now(),
    );
    _queue.add(item);
    notifyListeners();
    return itemId;
  }

  /// Enqueues an encrypted dashcam incident for judicial compliance (Law 25-11).
  String enqueueDashcamIncident(
    DashcamIncident incident, {
    String? locationWkt,
  }) {
    final itemId = generateUuidV4();
    final item = QueuedOfflineItem(
      id: itemId,
      type: 'dashcam_incident',
      payload: {
        'incident_id': incident.id,
        'ride_id': incident.rideId,
        'driver_id': incident.driverId,
        'trigger_type': incident.triggerType,
        'peak_g_force': incident.peakGForce,
        'speed_kmh': incident.speedKmh,
        'triggered_at': incident.triggeredAt.toIso8601String(),
        'video_buffer_seconds': incident.videoBufferDurationSeconds,
        'encryption_key_id': incident.encryptionKeyId,
        'shamir_shares_count': incident.shamirSharesCount,
        'status': incident.status,
        'location_wkt': locationWkt,
      },
      enqueuedAt: DateTime.now(),
    );
    _queue.add(item);
    notifyListeners();
    return itemId;
  }

  /// Enqueues an atomic spare change credit stored procedure call.
  String enqueueSpareChangeRpc({
    required String rideId,
    required String driverId,
    required String riderId,
    required double changeAmount,
    required String idempotencyKey,
  }) {
    final itemId = generateUuidV4();
    final item = QueuedOfflineItem(
      id: itemId,
      type: 'spare_change_rpc',
      payload: {
        'ride_id': rideId,
        'driver_id': driverId,
        'rider_id': riderId,
        'change_amount': changeAmount,
        'idempotency_key': idempotencyKey,
      },
      enqueuedAt: DateTime.now(),
    );
    _queue.add(item);
    notifyListeners();
    return itemId;
  }

  /// Flushes all pending items using the provided or attached SupabaseService.
  Future<SyncPassResult> flushQueue([SupabaseService? customSupabase]) async {
    final service = customSupabase ?? _supabaseService;
    if (service == null || _queue.isEmpty) {
      return SyncPassResult(succeeded: 0, failed: 0, remaining: _queue.length);
    }

    _isSyncing = true;
    notifyListeners();

    int succeeded = 0;
    int failed = 0;

    final List<QueuedOfflineItem> remainingItems = [];

    for (final item in _queue) {
      bool ok = false;
      try {
        if (item.type == 'ledger_entry') {
          final p = item.payload;
          final entry = LedgerEntry(
            id: p['entry_id'] as String,
            timestamp: (p['timestamp'] as String?) ?? item.enqueuedAt.toIso8601String(),
            entryType: p['entry_type'] as String,
            debitAccount: (p['debit_account'] as String?) ?? (p['debit_wallet_id'] as String?) ?? '2020',
            creditAccount: (p['credit_account'] as String?) ?? (p['credit_wallet_id'] as String?) ?? '2010',
            amountDzd: (p['amount_dzd'] as num).toDouble(),
            description: p['description'] as String,
            rideId: p['ride_id'] as String?,
          );
          ok = await service.recordLedgerEntry(
            entry,
            debitWalletId: p['debit_wallet_id'] as String?,
            creditWalletId: p['credit_wallet_id'] as String?,
            batchId: p['batch_id'] as String?,
            idempotencyKey: p['idempotency_key'] as String?,
          );
        } else if (item.type == 'dashcam_incident') {
          final p = item.payload;
          final incident = DashcamIncident(
            id: p['incident_id'] as String,
            rideId: p['ride_id'] as String,
            driverId: p['driver_id'] as String,
            triggerType: p['trigger_type'] as String,
            peakGForce: (p['peak_g_force'] as num).toDouble(),
            speedKmh: (p['speed_kmh'] as num).toDouble(),
            triggeredAt: DateTime.parse(p['triggered_at'] as String),
            encryptionKeyId: p['encryption_key_id'] as String,
            shamirSharesCount: (p['shamir_shares_count'] as num?)?.toInt() ?? 3,
            status: (p['status'] as String?) ?? 'locked_on_device',
            videoBufferDurationSeconds: (p['video_buffer_seconds'] as num?)?.toInt() ?? 60,
          );
          ok = await service.recordDashcamIncident(
            incident,
            locationWkt: p['location_wkt'] as String?,
          );
        } else if (item.type == 'spare_change_rpc') {
          final p = item.payload;
          final res = await service.executeSpareChangeRpc(
            rideId: p['ride_id'] as String,
            driverId: p['driver_id'] as String,
            riderId: p['rider_id'] as String,
            changeAmount: (p['change_amount'] as num).toDouble(),
            idempotencyKey: p['idempotency_key'] as String,
          );
          ok = res != null;
        }
      } catch (e) {
        ok = false;
        item.lastError = e.toString();
      }

      if (ok) {
        succeeded++;
      } else {
        failed++;
        item.retryCount++;
        remainingItems.add(item);
      }
    }

    _queue.clear();
    _queue.addAll(remainingItems);
    _isSyncing = false;
    _lastSyncTime = DateTime.now();
    notifyListeners();

    return SyncPassResult(
      succeeded: succeeded,
      failed: failed,
      remaining: _queue.length,
    );
  }

  void clearQueue() {
    _queue.clear();
    notifyListeners();
  }
}
