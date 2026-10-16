import 'package:flutter_test/flutter_test.dart';
import 'package:naql_core/naql_core.dart';

void main() {
  group('ThermalStateMachine Tests', () {
    test('transitions correctly through thermal thresholds', () {
      final sm = ThermalStateMachine(initialTemp: 32.0);
      expect(sm.currentLevel, equals(ThermalLevel.normal));
      expect(sm.currentLevel.targetFps, equals(15));

      // Heat to 40C (Elevated)
      final changedToElevated = sm.updateTemperature(40.0);
      expect(changedToElevated, isTrue);
      expect(sm.currentLevel, equals(ThermalLevel.elevated));
      expect(sm.currentLevel.targetFps, equals(10));

      // Heat to 47C (Critical)
      sm.updateTemperature(47.0);
      expect(sm.currentLevel, equals(ThermalLevel.critical));
      expect(sm.currentLevel.targetFps, equals(5));

      // Heat to 52C (Emergency)
      sm.updateTemperature(52.0);
      expect(sm.currentLevel, equals(ThermalLevel.emergency));
      expect(sm.currentLevel.targetFps, equals(1));
    });
  });

  group('EnvelopeEncryption Shamir 2-of-3 Tests', () {
    test('splits and reconstructs 256-bit secret from any 2 shares', () {
      final originalDek = EnvelopeEncryption.generateDek();
      expect(originalDek.length, equals(32));

      final shares = EnvelopeEncryption.splitShamir2of3(originalDek);
      expect(shares.length, equals(3));

      // Test combination of Share 1 and Share 2
      final recovered12 = EnvelopeEncryption.combineShamir2of3(shares[0], shares[1]);
      expect(recovered12, equals(originalDek));

      // Test combination of Share 2 and Share 3
      final recovered23 = EnvelopeEncryption.combineShamir2of3(shares[1], shares[2]);
      expect(recovered23, equals(originalDek));

      // Test combination of Share 1 and Share 3
      final recovered13 = EnvelopeEncryption.combineShamir2of3(shares[0], shares[2]);
      expect(recovered13, equals(originalDek));
    });

    test('calculates deterministic incident fingerprint', () {
      final ts = DateTime(2026, 10, 14, 18, 0, 0);
      final fp1 = EnvelopeEncryption.calculateFingerprint('INC-001', ts, 2.84);
      final fp2 = EnvelopeEncryption.calculateFingerprint('INC-001', ts, 2.84);
      expect(fp1, equals(fp2));
      expect(fp1.length, equals(64)); // SHA-256 hex string
    });
  });

  group('ServiceMode & Regulatory Pricing Tests', () {
    test('validates 100 DA approach fee for Taxi Individuel', () {
      const mode = ServiceMode.taxiIndividuel;
      expect(mode.approachFeeDzd, equals(100.0));
      expect(mode.baseSeatCount, equals(4));
    });

    test('validates 50 DA seat pricing for Taxi Collectif Urbain', () {
      const mode = ServiceMode.taxiCollectifUrbain;
      expect(mode.approachFeeDzd, equals(0.0));
      expect(mode.fixedSeatPriceDzd, equals(50.0));
      expect(mode.baseSeatCount, equals(4));
    });
  });

  group('TariffService Executive Decree 12-230 Tests', () {
    test('calculates daytime fare correctly (100 DA flag drop + 35 DA/km)', () {
      final dayTime = DateTime(2026, 10, 15, 14, 30); // 14:30 Day
      expect(TariffService.isNightTariff(dayTime), isFalse);

      // 10 km journey during the day: 100 + (10 * 35) = 450 DA
      final fare = TariffService.calculateFare(
        mode: ServiceMode.taxiIndividuel,
        distanceKm: 10.0,
        requestTime: dayTime,
      );
      expect(fare, equals(450.0));
    });

    test('calculates nighttime fare correctly (100 DA flag drop + 45 DA/km)', () {
      final nightTime = DateTime(2026, 10, 15, 22, 15); // 22:15 Night
      expect(TariffService.isNightTariff(nightTime), isTrue);

      // 10 km journey during the night: 100 + (10 * 45) = 550 DA
      final fare = TariffService.calculateFare(
        mode: ServiceMode.taxiIndividuel,
        distanceKm: 10.0,
        requestTime: nightTime,
      );
      expect(fare, equals(550.0));
    });

    test('applies waiting time surcharge (5 DA/min)', () {
      final dayTime = DateTime(2026, 10, 15, 10, 0);
      // 10 km + 10 mins waiting: 100 + 350 + (10 * 5) = 500 DA
      final fare = TariffService.calculateFare(
        mode: ServiceMode.taxiIndividuel,
        distanceKm: 10.0,
        waitingMinutes: 10,
        requestTime: dayTime,
      );
      expect(fare, equals(500.0));
    });

    test('returns fixed seat price for Taxi Collectif Urbain', () {
      final fare = TariffService.calculateFare(
        mode: ServiceMode.taxiCollectifUrbain,
        distanceKm: 15.0,
      );
      expect(fare, equals(50.0));
    });
  });

  group('SpareChangeEngine Double-Entry Tests', () {
    test('settles transaction with exact double-entry balance (Debit 1020 == Credit 2010)', () {
      final settlement = SpareChangeEngine.settle(
        rideId: 'RIDE-TEST-100',
        tenderedDzd: 1000.0,
        fareDzd: 780.0,
        cashReturnedDzd: 200.0, // Driver is short by 20 DA
      );

      expect(settlement.changeDueDzd, equals(220.0));
      expect(settlement.digitalCreditDzd, equals(20.0));

      // Accounting equation: Debit Account 1020 must equal Credit Account 2010
      expect(settlement.ledgerEntry.debitAccount, equals('1020_DIGITAL_ESCROW'));
      expect(settlement.ledgerEntry.creditAccount, equals('2010_RIDER_TRUSTDESK'));
      expect(settlement.ledgerEntry.amountDzd, equals(20.0));
      expect(settlement.ledgerEntry.rideId, equals('RIDE-TEST-100'));
    });

    test('yields zero digital credit when driver returns exact cash change', () {
      final settlement = SpareChangeEngine.settle(
        rideId: 'RIDE-TEST-101',
        tenderedDzd: 1000.0,
        fareDzd: 800.0,
        cashReturnedDzd: 200.0, // Exact cash returned
      );

      expect(settlement.changeDueDzd, equals(200.0));
      expect(settlement.digitalCreditDzd, equals(0.0));
      expect(settlement.ledgerEntry.amountDzd, equals(0.0));
    });
  });

  group('GeoRoutingService & Algiers Hubs Tests', () {
    test('contains all 9 major Algiers transportation hubs with coordinates', () {
      expect(GeoRoutingService.algiersHubs.length, equals(9));
      final aeroport = GeoRoutingService.findHubById('aeroport');
      expect(aeroport.nameFr, contains('Houari Boumediene'));
      expect(aeroport.nameAr, contains('مطار هواري بومدين'));
      expect(aeroport.commune, equals('Dar El Beïda'));
    });

    test('calculates distance and fare between Aeroport and Grande Poste accurately', () {
      final aeroport = GeoRoutingService.findHubById('aeroport');
      final grandePoste = GeoRoutingService.findHubById('grande-poste');
      final distance = GeoRoutingService.distanceBetweenHubs(aeroport, grandePoste);

      // Distance should be approximately 19-25 km including Algiers terrain factor
      expect(distance, greaterThan(18.0));
      expect(distance, lessThan(30.0));

      final duration = GeoRoutingService.estimateDurationMinutes(distance);
      expect(duration, greaterThan(30));

      final fareDay = GeoRoutingService.estimateFareForRoute(
        origin: aeroport,
        destination: grandePoste,
        mode: ServiceMode.taxiIndividuel,
        requestTime: DateTime(2026, 10, 15, 12, 0),
      );
      // Day fare: 100 + (~21km * 35) = ~835 rounded to 10s = 840 DA
      expect(fareDay, greaterThan(750.0));
      expect(fareDay, lessThan(1200.0));
    });

    test('respects localized names for French and Arabic', () {
      final kouba = GeoRoutingService.findHubById('kouba');
      expect(kouba.localizedName(false), contains('Kouba'));
      expect(kouba.localizedName(true), contains('القبة'));
    });
  });

  group('TripHistoryItem Tests', () {
    test('instantiates complete historical record with DTW credentials and spare change', () {
      final kouba = GeoRoutingService.findHubById('kouba');
      final grandePoste = GeoRoutingService.findHubById('grande-poste');
      final trip = TripHistoryItem(
        id: 'DZ-HIST-1001',
        date: DateTime(2026, 10, 15, 14, 30),
        origin: kouba,
        destination: grandePoste,
        serviceMode: ServiceMode.taxiIndividuel,
        distanceKm: 14.2,
        fareDzd: 600.0,
        spareChangeDzd: 150.0,
        driverName: 'Mohamed Brahimi',
        vehiclePlate: '01842-120-16',
        agrementNumber: '16/AGR/2021/0894',
        paymentRail: 'cash_with_spare_change',
      );

      expect(trip.id, equals('DZ-HIST-1001'));
      expect(trip.fareDzd, equals(600.0));
      expect(trip.spareChangeDzd, equals(150.0));
      expect(trip.paymentRail, equals('cash_with_spare_change'));
    });
  });

  group('DriverShift & Hours of Service Tests', () {
    test('calculates gross revenue, commission deduction, and net earnings accurately', () {
      final shift = DriverShift(
        shiftId: 'SHIFT-2026-10-16',
        driverId: 'DRV-16-0894',
        startedAt: DateTime.now().subtract(const Duration(hours: 5)),
        completedTrips: 8,
        totalDistanceKm: 64.0,
        grossMeterEarningsDzd: 5600.0,
        approachFeesDzd: 800.0, // 8 * 100 DA
        spareChangeConvertedDzd: 750.0,
        platformCommissionPercent: 10.0,
      );

      expect(shift.totalGrossRevenueDzd, equals(6400.0));
      expect(shift.commissionDeductionDzd, equals(640.0));
      expect(shift.netEarningsDzd, equals(5760.0));
      expect(shift.isFatigueCompliant, isTrue);
    });

    test('flags fatigue non-compliance when shift exceeds 8 hours continuous driving', () {
      final shift = DriverShift(
        shiftId: 'SHIFT-OVERTIME',
        driverId: 'DRV-16-0894',
        startedAt: DateTime.now().subtract(const Duration(hours: 9)),
      );

      expect(shift.isFatigueCompliant, isFalse);
    });
  });

  group('RouteManeuver & Navigation Tests', () {
    test('generates realistic Algiers maneuvers between Kouba and Grande Poste', () {
      final kouba = GeoRoutingService.findHubById('kouba');
      final grandePoste = GeoRoutingService.findHubById('grande-poste');
      final maneuvers = GeoRoutingService.generateRouteManeuvers(kouba, grandePoste);

      expect(maneuvers.length, equals(5));
      expect(maneuvers.first.maneuverType, equals(ManeuverType.straight));
      expect(maneuvers.last.maneuverType, equals(ManeuverType.destinationArrival));
      expect(maneuvers.first.localizedInstruction(true), contains('الانطلاق'));
      expect(maneuvers.first.localizedInstruction(false), contains('Départ'));
    });
  });

  group('RideRating & Compliance Tests', () {
    test('computes composite quality score with taximeter honesty factor', () {
      final honestRating = RideRating(
        rideId: 'RIDE-101',
        stars: 5,
        respectedTaximeter: true,
        cleanlinessRating: 5,
        safeDrivingRating: 4,
        ratedAt: DateTime.now(),
      );

      // (5 * 0.4) + (5 * 0.3) + (4 * 0.3) = 2.0 + 1.5 + 1.2 = 4.7
      expect(honestRating.compositeScore, closeTo(4.7, 0.01));

      final dishonestRating = RideRating(
        rideId: 'RIDE-102',
        stars: 5,
        respectedTaximeter: false, // Penalty applied
        cleanlinessRating: 5,
        safeDrivingRating: 4,
        ratedAt: DateTime.now(),
      );

      // 4.7 * 0.5 = 2.35
      expect(dishonestRating.compositeScore, closeTo(2.35, 0.01));
    });
  });
}


