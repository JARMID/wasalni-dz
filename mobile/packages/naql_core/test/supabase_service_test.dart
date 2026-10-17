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

    test('createRideRequest posts valid ride payload and returns created record', () async {
      final mockClient = MockClient((request) async {
        expect(request.url.path, equals('/rest/v1/rides'));
        expect(request.method, equals('POST'));

        final body = jsonDecode(request.body) as List<dynamic>;
        expect(body.length, equals(1));
        final row = body.first as Map<String, dynamic>;

        expect(row['ride_code'], equals('ALG-9021'));
        expect(row['origin_address'], equals('Kouba'));
        expect(row['destination_address'], equals('Grande Poste'));
        expect(row['fare_estimated'], equals(450.0));
        expect(row['pin_code'], equals('4821'));
        expect(row['origin_location'], contains('POINT(3.0872 36.7262)'));

        final returnedRow = Map<String, dynamic>.from(row)
          ..['id'] = '00000000-0000-0000-0000-000000000101';

        return http.Response(jsonEncode([returnedRow]), 201, headers: {
          'content-type': 'application/json',
        });
      });

      final service = SupabaseService(client: mockClient);
      final result = await service.createRideRequest(
        rideCode: 'ALG-9021',
        originAddress: 'Kouba',
        originLat: 36.7262,
        originLng: 3.0872,
        destinationAddress: 'Grande Poste',
        destinationLat: 36.7729,
        destinationLng: 3.0583,
        estimatedFareDzd: 450.0,
        pinCode: '4821',
      );

      expect(result, isNotNull);
      expect(result!['id'], equals('00000000-0000-0000-0000-000000000101'));
      expect(result['ride_code'], equals('ALG-9021'));
      service.dispose();
    });

    test('fetchPendingRides queries requested rides with limit', () async {
      final mockClient = MockClient((request) async {
        expect(request.url.path, equals('/rest/v1/rides'));
        expect(request.url.queryParameters['status'], equals('eq.requested'));
        expect(request.url.queryParameters['limit'], equals('5'));

        final sampleRides = [
          {
            'id': '00000000-0000-0000-0000-000000000101',
            'ride_code': 'ALG-9021',
            'status': 'requested',
            'fare_estimated': 450.0,
          },
          {
            'id': '00000000-0000-0000-0000-000000000102',
            'ride_code': 'ALG-9022',
            'status': 'requested',
            'fare_estimated': 600.0,
          },
        ];

        return http.Response(jsonEncode(sampleRides), 200, headers: {
          'content-type': 'application/json',
        });
      });

      final service = SupabaseService(client: mockClient);
      final rides = await service.fetchPendingRides(limit: 5);

      expect(rides.length, equals(2));
      expect(rides.first['ride_code'], equals('ALG-9021'));
      expect(rides.last['fare_estimated'], equals(600.0));
      service.dispose();
    });

    test('acceptRide sends PATCH with driver ID and accepted status', () async {
      final mockClient = MockClient((request) async {
        expect(request.url.path, equals('/rest/v1/rides'));
        expect(request.url.queryParameters['id'], equals('eq.00000000-0000-0000-0000-000000000101'));
        expect(request.method, equals('PATCH'));

        final body = jsonDecode(request.body) as Map<String, dynamic>;
        expect(body['status'], equals('accepted'));
        expect(body['driver_id'], equals('00000000-0000-0000-0000-000000002020'));
        expect(body['accepted_at'], isNotNull);

        return http.Response(jsonEncode([body]), 200, headers: {
          'content-type': 'application/json',
        });
      });

      final service = SupabaseService(client: mockClient);
      final success = await service.acceptRide(
        rideId: '00000000-0000-0000-0000-000000000101',
        driverId: '00000000-0000-0000-0000-000000002020',
      );

      expect(success, isTrue);
      service.dispose();
    });

    test('updateRideStatus sends PATCH with updated status and custom fields', () async {
      final mockClient = MockClient((request) async {
        expect(request.url.path, equals('/rest/v1/rides'));
        expect(request.url.queryParameters['id'], equals('eq.00000000-0000-0000-0000-000000000101'));
        expect(request.method, equals('PATCH'));

        final body = jsonDecode(request.body) as Map<String, dynamic>;
        expect(body['status'], equals('in_progress'));
        expect(body['started_at'], isNotNull);
        expect(body['current_speed_kmh'], equals(48.5));

        return http.Response(jsonEncode([body]), 200, headers: {
          'content-type': 'application/json',
        });
      });

      final service = SupabaseService(client: mockClient);
      final success = await service.updateRideStatus(
        rideId: '00000000-0000-0000-0000-000000000101',
        status: 'in_progress',
        additionalFields: {'current_speed_kmh': 48.5},
      );

      expect(success, isTrue);
      service.dispose();
    });

    test('completeRide calculates commission and payout with final meter value', () async {
      final mockClient = MockClient((request) async {
        expect(request.url.path, equals('/rest/v1/rides'));
        expect(request.url.queryParameters['id'], equals('eq.00000000-0000-0000-0000-000000000101'));
        expect(request.method, equals('PATCH'));

        final body = jsonDecode(request.body) as Map<String, dynamic>;
        expect(body['status'], equals('completed'));
        expect(body['meter_final_amount'], equals(380.0));
        expect(body['fare_final'], equals(480.0));
        expect(body['platform_commission_rate'], equals(10.0));
        expect(body['platform_commission_amount'], equals(48.0));
        expect(body['driver_payout_amount'], equals(432.0));
        expect(body['completed_at'], isNotNull);

        return http.Response(jsonEncode([body]), 200, headers: {
          'content-type': 'application/json',
        });
      });

      final service = SupabaseService(client: mockClient);
      final success = await service.completeRide(
        rideId: '00000000-0000-0000-0000-000000000101',
        meterFinalAmount: 380.0,
        fareFinal: 480.0,
      );

      expect(success, isTrue);
      service.dispose();
    });
  });
}
