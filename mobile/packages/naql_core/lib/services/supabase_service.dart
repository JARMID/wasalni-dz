import 'dart:convert';
import 'dart:math';
import 'package:http/http.dart' as http;
import '../models/dashcam_incident.dart';
import '../models/ledger_entry.dart';

/// RFC 4122 compliant UUID v4 generator for idempotent transaction batching.
String generateUuidV4() {
  final rng = Random.secure();
  final bytes = List<int>.generate(16, (_) => rng.nextInt(256));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  final hex = bytes.map((b) => b.toRadixString(16).padLeft(2, '0')).join();
  return '${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20)}';
}

/// Service for communicating with the WASSLANI Supabase cloud database.
/// Provides real-time ledger accounting, wallet balance synchronization, and judicial lockbox storage.
class SupabaseService {
  SupabaseService({
    http.Client? client,
    String? baseUrl,
    String? anonKey,
  })  : _client = client ?? http.Client(),
        baseUrl = baseUrl ?? defaultBaseUrl,
        anonKey = anonKey ?? defaultAnonKey;

  static const String defaultBaseUrl = 'https://jgctorgztxwrgdkfkuxv.supabase.co';
  static const String defaultAnonKey =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY3Rvcmd6dHh3cmdka2ZrdXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5OTU5MzMsImV4cCI6MjEwNzU3MTkzM30.kx7G0Oa5nkIfPKLt3D9c_MNbnwFiUAQY8CnSA94JdCo';

  // System wallet UUIDs in public.wallets
  static const String driverOperationalWalletId = '00000000-0000-0000-0000-000000002020';
  static const String riderTrustDeskWalletId = '00000000-0000-0000-0000-000000002010';
  static const String escrowWalletId = '00000000-0000-0000-0000-000000001020';

  final http.Client _client;
  final String baseUrl;
  final String anonKey;

  Map<String, String> get _headers => {
        'apikey': anonKey,
        'Authorization': 'Bearer $anonKey',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      };

  /// Fetches system and user wallet balances from public.wallets
  Future<Map<String, double>> fetchWalletBalances() async {
    try {
      final uri = Uri.parse('$baseUrl/rest/v1/wallets?select=system_account_code,balance_dzd');
      final response = await _client.get(uri, headers: _headers);

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body) as List<dynamic>;
        final Map<String, double> balances = {};
        for (final item in data) {
          final code = item['system_account_code'] as String?;
          final balStr = item['balance_dzd']?.toString() ?? '0.0';
          if (code != null) {
            balances[code] = double.tryParse(balStr) ?? 0.0;
          }
        }
        return balances;
      }
      return {};
    } catch (_) {
      return {};
    }
  }

  /// Inserts an immutable double-entry ledger record into public.ledger_entries
  Future<bool> recordLedgerEntry(
    LedgerEntry entry, {
    String? debitWalletId,
    String? creditWalletId,
    String? idempotencyKey,
    String? batchId,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl/rest/v1/ledger_entries');
      final payload = {
        'idempotency_key': idempotencyKey ?? '${entry.id}-${DateTime.now().millisecondsSinceEpoch}',
        'batch_id': batchId ?? generateUuidV4(),
        'debit_wallet_id': debitWalletId ?? driverOperationalWalletId,
        'credit_wallet_id': creditWalletId ?? riderTrustDeskWalletId,
        'amount_dzd': entry.amountDzd,
        'entry_type': entry.entryType,
        'description': entry.description,
      };

      final response = await _client.post(
        uri,
        headers: _headers,
        body: jsonEncode([payload]),
      );

      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (_) {
      return false;
    }
  }

  /// Persists a judicial black box incident record under Law 25-11
  Future<bool> recordDashcamIncident(
    DashcamIncident incident, {
    String? locationWkt,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl/rest/v1/dashcam_incidents');
      final payload = {
        'driver_id': driverOperationalWalletId,
        'trigger_type': incident.triggerType == 'manual_sos' ? 'manual_sos' : 'g_sensor_impact',
        'peak_g_force': incident.peakGForce,
        'vehicle_speed_kmh': incident.speedKmh,
        'incident_location': locationWkt ?? 'SRID=4326;POINT(3.0588 36.7538)',
        'storage_bucket': 'dashcam-judicial-lockbox',
        'storage_file_path': 'incidents/${incident.id}.mp4.enc',
        'video_duration_seconds': incident.videoBufferDurationSeconds,
        'file_size_bytes': 15728640,
        'sha256_checksum': incident.encryptionKeyId,
        'aes_encryption_key_id': incident.encryptionKeyId,
        'review_status': 'pending_review',
      };

      final response = await _client.post(
        uri,
        headers: _headers,
        body: jsonEncode([payload]),
      );

      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (_) {
      return false;
    }
  }

  /// Executes atomic spare change digital credit via the secure database stored procedure
  Future<Map<String, dynamic>?> executeSpareChangeRpc({
    required String rideId,
    required String driverId,
    required String riderId,
    required double changeAmount,
    required String idempotencyKey,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl/rest/v1/rpc/execute_spare_change_credit');
      final payload = {
        'p_ride_id': rideId,
        'p_driver_id': driverId,
        'p_rider_id': riderId,
        'p_change_amount': changeAmount,
        'p_idempotency_key': idempotencyKey,
      };

      final response = await _client.post(
        uri,
        headers: _headers,
        body: jsonEncode(payload),
      );

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      }
      return null;
    } catch (_) {
      return null;
    }
  }

  /// Creates a ride request in public.rides with Executive Decree 12-230 parameters
  Future<Map<String, dynamic>?> createRideRequest({
    required String rideCode,
    required String originAddress,
    required double originLat,
    required double originLng,
    required String destinationAddress,
    required double destinationLat,
    required double destinationLng,
    required double estimatedFareDzd,
    required String pinCode,
    String? riderId,
    String? originCommune,
    String? destinationCommune,
    int distanceMeters = 0,
    int durationSeconds = 0,
    String serviceType = 'taxi_individuel_metered',
    double fraisApprocheDzd = 100.0,
    String paymentMethod = 'cash',
  }) async {
    try {
      final uri = Uri.parse('$baseUrl/rest/v1/rides');
      final payload = {
        'ride_code': rideCode,
        'rider_id': riderId ?? riderTrustDeskWalletId,
        'service_type': serviceType,
        'status': 'requested',
        'origin_address': originAddress,
        'origin_commune': originCommune ?? 'Alger',
        'origin_wilaya_code': 16,
        'origin_location': 'SRID=4326;POINT($originLng $originLat)',
        'destination_address': destinationAddress,
        'destination_commune': destinationCommune ?? 'Alger',
        'destination_wilaya_code': 16,
        'destination_location': 'SRID=4326;POINT($destinationLng $destinationLat)',
        'distance_meters': distanceMeters,
        'duration_seconds': durationSeconds,
        'frais_approche_amount': fraisApprocheDzd,
        'fare_estimated': estimatedFareDzd,
        'payment_method': paymentMethod,
        'payment_state': 'pending',
        'pin_code': pinCode,
        'requested_at': DateTime.now().toUtc().toIso8601String(),
      };

      final response = await _client.post(
        uri,
        headers: _headers,
        body: jsonEncode([payload]),
      );

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final List<dynamic> data = jsonDecode(response.body) as List<dynamic>;
        if (data.isNotEmpty) {
          return data.first as Map<String, dynamic>;
        }
      }
      return null;
    } catch (_) {
      return null;
    }
  }

  /// Fetches pending ride requests from public.rides ordered by most recent
  Future<List<Map<String, dynamic>>> fetchPendingRides({int limit = 10}) async {
    try {
      final uri = Uri.parse(
        '$baseUrl/rest/v1/rides?status=eq.requested&order=requested_at.desc&limit=$limit',
      );
      final response = await _client.get(uri, headers: _headers);

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body) as List<dynamic>;
        return data.cast<Map<String, dynamic>>();
      }
      return [];
    } catch (_) {
      return [];
    }
  }

  /// Marks a pending ride as accepted by a municipal driver
  Future<bool> acceptRide({
    required String rideId,
    required String driverId,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl/rest/v1/rides?id=eq.$rideId');
      final payload = {
        'status': 'accepted',
        'driver_id': driverId,
        'accepted_at': DateTime.now().toUtc().toIso8601String(),
      };

      final response = await _client.patch(
        uri,
        headers: _headers,
        body: jsonEncode(payload),
      );

      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (_) {
      return false;
    }
  }

  /// Updates the status and optional telemetry of an active ride
  Future<bool> updateRideStatus({
    required String rideId,
    required String status,
    Map<String, dynamic>? additionalFields,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl/rest/v1/rides?id=eq.$rideId');
      final payload = <String, dynamic>{
        'status': status,
        if (status == 'driver_arrived') 'arrived_at': DateTime.now().toUtc().toIso8601String(),
        if (status == 'in_progress') 'started_at': DateTime.now().toUtc().toIso8601String(),
        if (status == 'cancelled') 'cancelled_at': DateTime.now().toUtc().toIso8601String(),
        ...?additionalFields,
      };

      final response = await _client.patch(
        uri,
        headers: _headers,
        body: jsonEncode(payload),
      );

      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (_) {
      return false;
    }
  }

  /// Finalizes a trip with Executive Decree 12-230 taximeter meter value and quittance
  Future<bool> completeRide({
    required String rideId,
    required double meterFinalAmount,
    required double fareFinal,
    double platformCommissionRate = 10.0,
    String paymentState = 'settled',
    String? taximeterPhotoUrl,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl/rest/v1/rides?id=eq.$rideId');
      final commissionAmount = (fareFinal * platformCommissionRate) / 100.0;
      final driverPayout = fareFinal - commissionAmount;

      final payload = {
        'status': 'completed',
        'meter_final_amount': meterFinalAmount,
        'fare_final': fareFinal,
        'platform_commission_rate': platformCommissionRate,
        'platform_commission_amount': commissionAmount,
        'driver_payout_amount': driverPayout,
        'payment_state': paymentState,
        'completed_at': DateTime.now().toUtc().toIso8601String(),
        if (taximeterPhotoUrl != null) 'taximeter_photo_url': taximeterPhotoUrl,
      };

      final response = await _client.patch(
        uri,
        headers: _headers,
        body: jsonEncode(payload),
      );

      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (_) {
      return false;
    }
  }

  void dispose() {
    _client.close();
  }
}
