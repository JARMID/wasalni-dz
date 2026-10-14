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
}
