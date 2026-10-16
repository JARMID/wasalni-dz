import 'package:flutter_test/flutter_test.dart';
import 'package:naql_core/naql_core.dart';

void main() {
  group('TaximeterQuittance Unit Tests (Executive Decree 12-230)', () {
    final testDate = DateTime(2026, 10, 16, 14, 30);

    test('generates compliant quittance and validates cryptographic hash', () {
      final quittance = TaximeterQuittance(
        quittanceId: 'QTX-16-2026-0099',
        issuedAt: testDate,
        driverName: 'Mohamed Brahimi',
        agrementNumber: '16/AGR/2021/0894',
        livretDePlaceId: 'LP-16-44021',
        vehiclePlate: '01842-120-16',
        vehicleModel: 'Peugeot 301 Taxi Jaune',
        originName: 'Kouba (Centre)',
        destinationName: 'Grande Poste (Alger Centre)',
        distanceKm: 8.4,
        durationMinutes: 18,
        priseEnChargeDzd: 25.0,
        fraisApprocheDzd: 100.0,
        fareHorokilometriqueDzd: 384.0,
        totalFareDzd: 509.0,
        spareChangeCreditedDzd: 91.0,
      );

      expect(quittance.quittanceId, equals('QTX-16-2026-0099'));
      expect(quittance.totalFareDzd, equals(509.0));
      expect(quittance.verificationHash.length, equals(16));

      // Validate cryptographic signature check helper
      final isValid = TaximeterQuittance.verifyQuittance(
        quittanceId: quittance.quittanceId,
        vehiclePlate: quittance.vehiclePlate,
        agrementNumber: quittance.agrementNumber,
        totalFareDzd: quittance.totalFareDzd,
        issuedAt: quittance.issuedAt,
        expectedHash: quittance.verificationHash,
      );
      expect(isValid, isTrue);

      // Mutated fare should fail verification
      final isTamperedValid = TaximeterQuittance.verifyQuittance(
        quittanceId: quittance.quittanceId,
        vehiclePlate: quittance.vehiclePlate,
        agrementNumber: quittance.agrementNumber,
        totalFareDzd: 999.0, // Tampered fare
        issuedAt: quittance.issuedAt,
        expectedHash: quittance.verificationHash,
      );
      expect(isTamperedValid, isFalse);
    });

    test('generates QR inspection payload formatted for roadside municipal verification', () {
      final quittance = TaximeterQuittance(
        quittanceId: 'QTX-16-2026-0042',
        issuedAt: testDate,
        driverName: 'Karim Belkacem',
        agrementNumber: '16/AGR/2019/0492',
        livretDePlaceId: 'LP-16-33910',
        vehiclePlate: '00492-119-16',
        vehicleModel: 'Renault Symbol Taxi',
        originName: 'Bab Ezzouar (Université)',
        destinationName: 'Aéroport Houari Boumediene',
        distanceKm: 6.2,
        durationMinutes: 12,
        fareHorokilometriqueDzd: 277.0,
        totalFareDzd: 402.0,
      );

      final qrPayload = quittance.toQrInspectionPayload();
      expect(qrPayload, startsWith('WASSLANI:DTW12-230|ID:QTX-16-2026-0042'));
      expect(qrPayload, contains('PLT:00492-119-16'));
      expect(qrPayload, contains('AGR:16/AGR/2019/0492'));
      expect(qrPayload, contains('AMT:402.00'));
      expect(qrPayload, contains('SIG:${quittance.verificationHash}'));
    });

    test('formats bilingual shareable quittance summaries', () {
      final quittance = TaximeterQuittance(
        quittanceId: 'QTX-16-2026-0042',
        issuedAt: testDate,
        driverName: 'Mohamed Brahimi',
        agrementNumber: '16/AGR/2021/0894',
        livretDePlaceId: 'LP-16-44021',
        vehiclePlate: '01842-120-16',
        vehicleModel: 'Peugeot 301',
        originName: 'Kouba',
        destinationName: 'Grande Poste',
        distanceKm: 8.0,
        durationMinutes: 15,
        fareHorokilometriqueDzd: 355.0,
        totalFareDzd: 480.0,
        spareChangeCreditedDzd: 20.0,
      );

      final frenchSummary = quittance.toShareableSummary(isArabic: false);
      expect(frenchSummary, contains('RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE'));
      expect(frenchSummary, contains('Direction des Transports de la Wilaya d\'Alger (DTW)'));
      expect(frenchSummary, contains('Flashe Monnaie Épargne: 20.00 DA'));
      expect(frenchSummary, contains('TOTAL RÉGLÉ: 480.00 DA'));

      final arabicSummary = quittance.toShareableSummary(isArabic: true);
      expect(arabicSummary, contains('الجمهورية الجزائرية الديمقراطية الشعبية'));
      expect(arabicSummary, contains('مديرية النقل لولاية الجزائر (DTW)'));
      expect(arabicSummary, contains('رصيد الفكة الرقمية المودع: 20.00 دج'));
      expect(arabicSummary, contains('الإجمالي المدفوع: 480.00 دج'));
    });

    test('serializes and deserializes from JSON accurately', () {
      final original = TaximeterQuittance(
        quittanceId: 'QTX-16-2026-0010',
        issuedAt: testDate,
        driverName: 'Youcef Hamidi',
        agrementNumber: '16/AGR/2022/0781',
        livretDePlaceId: 'LP-16-55901',
        vehiclePlate: '07812-122-16',
        vehicleModel: 'Dacia Logan Taxi',
        originName: 'Hydra',
        destinationName: 'Chéraga',
        distanceKm: 11.2,
        durationMinutes: 22,
        fareHorokilometriqueDzd: 502.0,
        totalFareDzd: 627.0,
      );

      final json = original.toJson();
      final revived = TaximeterQuittance.fromJson(json);

      expect(revived.quittanceId, equals(original.quittanceId));
      expect(revived.driverName, equals(original.driverName));
      expect(revived.totalFareDzd, equals(original.totalFareDzd));
      expect(revived.verificationHash, equals(original.verificationHash));
    });
  });
}
