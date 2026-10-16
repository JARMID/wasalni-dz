import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:naql_core/naql_core.dart';

void main() {
  group('SupabaseService Unit Tests', () {
    test('generateUuidV4 returns valid RFC 4122 v4 UUID string', () {
      final uuid1 = generateUuidV4();
      final uuid2 = generateUuidV4();

      expect(uuid1, isNot(equals(uuid2)));
      expect(
        RegExp(r'^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$')
            .hasMatch(uuid1),
        isTrue,
      );
    });

    test('fetchWalletBalances parses and returns system account balances correctly', () async {
      final mockClient = MockClient((request) async {
        expect(request.url.path, equals('/rest/v1/wallets'));
        expect(request.headers['apikey'], isNotNull);
        expect(request.headers['Authorization'], contains('Bearer'));

        final responsePayload = [
          {'system_account_code': '1010', 'balance_dzd': '0.00'},
          {'system_account_code': '1020', 'balance_dzd': '4300.00'},
          {'system_account_code': '2010', 'balance_dzd': '450.00'},
          {'system_account_code': '2020', 'balance_dzd': '3850.00'},
          {'system_account_code': '4010', 'balance_dzd': '0.00'},
        ];

        return http.Response(jsonEncode(responsePayload), 200, headers: {
          'content-type': 'application/json',
        });
      });

      final service = SupabaseService(client: mockClient);
      final balances = await service.fetchWalletBalances();

      expect(balances['2010'], equals(450.00));
      expect(balances['2020'], equals(3850.00));
      expect(balances['1020'], equals(4300.00));
      service.dispose();
    });

    test('recordLedgerEntry posts valid JSON payload with idempotency key and batch id', () async {
      final mockClient = MockClient((request) async {
        expect(request.url.path, equals('/rest/v1/ledger_entries'));
        expect(request.method, equals('POST'));

        final body = jsonDecode(request.body) as List<dynamic>;
        expect(body.length, equals(1));
        final row = body.first as Map<String, dynamic>;

        expect(row['amount_dzd'], equals(25.0));
        expect(row['entry_type'], equals('spare_change_credit'));
        expect(row['idempotency_key'], isNotNull);
        expect(row['batch_id'], isNotNull);

        return http.Response(jsonEncode([row]), 201, headers: {
          'content-type': 'application/json',
        });
      });

      final service = SupabaseService(client: mockClient);
      final entry = LedgerEntry(
        id: 'LEDGER-TEST-01',
        timestamp: DateTime.now().toIso8601String(),
        entryType: 'spare_change_credit',
        debitAccount: '2020_DRIVER_OPERATIONAL',
        creditAccount: '2010_RIDER_TRUSTDESK',
        amountDzd: 25.0,
        description: 'Spare cash change credited to rider wallet',
      );

      final success = await service.recordLedgerEntry(entry);
      expect(success, isTrue);
      service.dispose();
    });

    test('recordDashcamIncident posts compliant Law 25-11 judicial lockbox record', () async {
      final mockClient = MockClient((request) async {
        expect(request.url.path, equals('/rest/v1/dashcam_incidents'));
        expect(request.method, equals('POST'));

        final body = jsonDecode(request.body) as List<dynamic>;
        final row = body.first as Map<String, dynamic>;

        expect(row['driver_id'], equals(SupabaseService.driverOperationalWalletId));
        expect(row['trigger_type'], equals('g_sensor_impact'));
        expect(row['peak_g_force'], equals(3.2));
        expect(row['vehicle_speed_kmh'], equals(64.5));
        expect(row['storage_bucket'], equals('dashcam-judicial-lockbox'));
        expect(row['review_status'], equals('pending_review'));

        return http.Response(jsonEncode([row]), 201, headers: {
          'content-type': 'application/json',
        });
      });

      final service = SupabaseService(client: mockClient);
      final incident = DashcamIncident(
        id: 'INC-TEST-001',
        rideId: 'RIDE-TEST-100',
        driverId: SupabaseService.driverOperationalWalletId,
        triggerType: 'g_sensor_impact',
        peakGForce: 3.2,
        speedKmh: 64.5,
        triggeredAt: DateTime.now(),
        encryptionKeyId: 'SHA256-TEST-KEY-001',
        shamirSharesCount: 3,
        status: 'locked_on_device',
        videoBufferDurationSeconds: 60,
      );

      final success = await service.recordDashcamIncident(incident);
      expect(success, isTrue);
      service.dispose();
    });

    test('executeSpareChangeRpc calls RPC endpoint and returns decoded response', () async {
      final mockClient = MockClient((request) async {
        expect(request.url.path, equals('/rest/v1/rpc/execute_spare_change_credit'));
        expect(request.method, equals('POST'));

        final payload = jsonDecode(request.body) as Map<String, dynamic>;
        expect(payload['p_change_amount'], equals(50.0));

        return http.Response(
          jsonEncode({
            'success': true,
            'status': 'executed',
            'amount_credited': 50.0,
            'batch_id': '00000000-0000-0000-0000-000000009999',
          }),
          200,
          headers: {'content-type': 'application/json'},
        );
      });

      final service = SupabaseService(client: mockClient);
      final result = await service.executeSpareChangeRpc(
        rideId: '00000000-0000-0000-0000-000000000001',
        driverId: SupabaseService.driverOperationalWalletId,
        riderId: SupabaseService.riderTrustDeskWalletId,
        changeAmount: 50.0,
        idempotencyKey: 'IDEMP-TEST-001',
      );

      expect(result, isNotNull);
      expect(result!['success'], isTrue);
      expect(result['status'], equals('executed'));
      expect(result['amount_credited'], equals(50.0));
      service.dispose();
    });
  });
}
