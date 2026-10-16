import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:naql_core/naql_core.dart';

void main() {
  group('OfflineSyncQueue Unit Tests', () {
    test('enqueues ledger entries, incidents, and spare change RPCs properly', () {
      final queue = OfflineSyncQueue();
      expect(queue.pendingCount, equals(0));
      expect(queue.isOnline, isTrue);

      final entry = LedgerEntry(
        id: 'TX-101',
        timestamp: DateTime.now().toIso8601String(),
        amountDzd: 150.0,
        entryType: 'spare_change_credit',
        debitAccount: '2020',
        creditAccount: '2010',
        description: 'Spare change conversion',
      );

      final entryId = queue.enqueueLedgerEntry(entry);
      expect(entryId, isNotEmpty);
      expect(queue.pendingCount, equals(1));

      final incident = DashcamIncident(
        id: 'INC-201',
        rideId: 'RIDE-1',
        driverId: 'DRV-1',
        triggerType: 'g_sensor_impact',
        peakGForce: 2.84,
        speedKmh: 42.0,
        triggeredAt: DateTime.now(),
        encryptionKeyId: 'K-AES-01',
        shamirSharesCount: 3,
        status: 'locked_on_device',
      );

      final incId = queue.enqueueDashcamIncident(incident);
      expect(incId, isNotEmpty);
      expect(queue.pendingCount, equals(2));

      final rpcId = queue.enqueueSpareChangeRpc(
        rideId: 'RIDE-1',
        driverId: 'DRV-1',
        riderId: 'RDR-1',
        changeAmount: 50.0,
        idempotencyKey: 'IDEMP-100',
      );
      expect(rpcId, isNotEmpty);
      expect(queue.pendingCount, equals(3));
    });

    test('flushQueue succeeds and flushes items when network is online', () async {
      final mockClient = MockClient((request) async {
        if (request.url.path.contains('ledger_entries')) {
          return http.Response('[{"id":"ok"}]', 201, headers: {'content-type': 'application/json'});
        }
        if (request.url.path.contains('dashcam_incidents')) {
          return http.Response('[{"id":"ok"}]', 201, headers: {'content-type': 'application/json'});
        }
        if (request.url.path.contains('execute_spare_change_credit')) {
          return http.Response('{"status":"success"}', 200, headers: {'content-type': 'application/json'});
        }
        return http.Response('Not Found', 404);
      });

      final supabase = SupabaseService(client: mockClient);
      final queue = OfflineSyncQueue(supabaseService: supabase);

      queue.enqueueLedgerEntry(LedgerEntry(
        id: 'TX-01',
        timestamp: DateTime.now().toIso8601String(),
        amountDzd: 25.0,
        entryType: 'fare_settlement',
        debitAccount: '2020',
        creditAccount: '2010',
        description: 'Settlement test',
      ));

      queue.enqueueDashcamIncident(DashcamIncident(
        id: 'INC-01',
        rideId: 'RIDE-1',
        driverId: 'DRV-1',
        triggerType: 'g_sensor_impact',
        peakGForce: 2.84,
        speedKmh: 50.0,
        triggeredAt: DateTime.now(),
        encryptionKeyId: 'KEY-01',
        shamirSharesCount: 3,
        status: 'locked_on_device',
      ));

      expect(queue.pendingCount, equals(2));

      final result = await queue.flushQueue();

      expect(result.succeeded, equals(2));
      expect(result.failed, equals(0));
      expect(result.remaining, equals(0));
      expect(queue.pendingCount, equals(0));
      expect(queue.lastSyncTime, isNotNull);

      supabase.dispose();
    });

    test('retains failed transactions in queue and increments retryCount', () async {
      final mockClient = MockClient((request) async {
        return http.Response('Internal Server Error', 500);
      });

      final supabase = SupabaseService(client: mockClient);
      final queue = OfflineSyncQueue(supabaseService: supabase);

      queue.enqueueLedgerEntry(LedgerEntry(
        id: 'TX-FAIL',
        timestamp: DateTime.now().toIso8601String(),
        amountDzd: 70.0,
        entryType: 'fare_settlement',
        debitAccount: '2020',
        creditAccount: '2010',
        description: 'Failing settlement',
      ));

      expect(queue.pendingCount, equals(1));
      final result = await queue.flushQueue();

      expect(result.succeeded, equals(0));
      expect(result.failed, equals(1));
      expect(result.remaining, equals(1));
      expect(queue.pendingCount, equals(1));
      expect(queue.items.first.retryCount, equals(1));

      supabase.dispose();
    });

    test('setOnlineStatus automatically triggers flush on recovery from offline', () async {
      final mockClient = MockClient((request) async {
        return http.Response('[{"id":"synced"}]', 201, headers: {'content-type': 'application/json'});
      });

      final supabase = SupabaseService(client: mockClient);
      final queue = OfflineSyncQueue(supabaseService: supabase, initialOnlineState: false);

      queue.enqueueLedgerEntry(LedgerEntry(
        id: 'TX-OFFLINE-SYNC',
        timestamp: DateTime.now().toIso8601String(),
        amountDzd: 80.0,
        entryType: 'spare_change_credit',
        debitAccount: '2020',
        creditAccount: '2010',
        description: 'Offline tunnel credit',
      ));

      expect(queue.isOnline, isFalse);
      expect(queue.pendingCount, equals(1));

      // Network comes back online
      final res = await queue.setOnlineStatus(true);

      expect(queue.isOnline, isTrue);
      expect(res, isNotNull);
      expect(res!.succeeded, equals(1));
      expect(queue.pendingCount, equals(0));

      supabase.dispose();
    });
  });
}
