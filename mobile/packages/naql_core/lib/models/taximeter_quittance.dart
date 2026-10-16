import 'dart:convert';
import 'package:crypto/crypto.dart';

/// Official DTW Taximeter Quittance Model under Algerian Executive Decree 12-230.
/// Encapsulates legal proof of fare calculation, vehicle registration, and cryptographic verification.
class TaximeterQuittance {
  TaximeterQuittance({
    required this.quittanceId,
    required this.issuedAt,
    required this.driverName,
    required this.agrementNumber,
    required this.livretDePlaceId,
    required this.vehiclePlate,
    required this.vehicleModel,
    this.wilaya = '16 - Alger',
    required this.originName,
    required this.destinationName,
    required this.distanceKm,
    required this.durationMinutes,
    this.priseEnChargeDzd = 25.0,
    this.fraisApprocheDzd = 100.0,
    required this.fareHorokilometriqueDzd,
    required this.totalFareDzd,
    this.paymentMethod = 'cash_with_spare_change',
    this.spareChangeCreditedDzd = 0.0,
    String? verificationHash,
  }) : verificationHash = verificationHash ??
            _computeVerificationHash(
              quittanceId,
              vehiclePlate,
              agrementNumber,
              totalFareDzd,
              issuedAt,
            );

  final String quittanceId;
  final DateTime issuedAt;
  final String driverName;
  final String agrementNumber;
  final String livretDePlaceId;
  final String vehiclePlate;
  final String vehicleModel;
  final String wilaya;
  final String originName;
  final String destinationName;
  final double distanceKm;
  final int durationMinutes;
  final double priseEnChargeDzd;
  final double fraisApprocheDzd;
  final double fareHorokilometriqueDzd;
  final double totalFareDzd;
  final String paymentMethod;
  final double spareChangeCreditedDzd;
  final String verificationHash;

  static const String verificationSecretSalt = 'WASSLANI-DTW-ALGER-2026-LEGAL-SALT';

  static String _computeVerificationHash(
    String id,
    String plate,
    String agrement,
    double fare,
    DateTime time,
  ) {
    final raw = '$id|$plate|$agrement|${fare.toStringAsFixed(2)}|${time.toIso8601String()}|$verificationSecretSalt';
    return sha256.convert(utf8.encode(raw)).toString().substring(0, 16).toUpperCase();
  }

  /// Verifies if a given quittance signature is mathematically authentic.
  static bool verifyQuittance({
    required String quittanceId,
    required String vehiclePlate,
    required String agrementNumber,
    required double totalFareDzd,
    required DateTime issuedAt,
    required String expectedHash,
  }) {
    final calculated = _computeVerificationHash(
      quittanceId,
      vehiclePlate,
      agrementNumber,
      totalFareDzd,
      issuedAt,
    );
    return calculated == expectedHash.toUpperCase();
  }

  /// Compact payload for roadside inspection QR codes.
  String toQrInspectionPayload() {
    return 'WASSLANI:DTW12-230|ID:$quittanceId|PLT:$vehiclePlate|AGR:$agrementNumber|AMT:${totalFareDzd.toStringAsFixed(2)}|KM:${distanceKm.toStringAsFixed(1)}|SIG:$verificationHash';
  }

  /// Formatted text receipt for SMS, email, or messaging.
  String toShareableSummary({bool isArabic = false}) {
    final dateStr =
        '${issuedAt.year}-${issuedAt.month.toString().padLeft(2, '0')}-${issuedAt.day.toString().padLeft(2, '0')} ${issuedAt.hour.toString().padLeft(2, '0')}:${issuedAt.minute.toString().padLeft(2, '0')}';

    if (isArabic) {
      return '''
الجمهورية الجزائرية الديمقراطية الشعبية
مديرية النقل لولاية الجزائر (DTW)
وصل العداد الرسمي - مرسوم تنفيذي 12-230
رقم الوصل: $quittanceId
التاريخ: $dateStr

السائق: $driverName
رخصة الاستغلال: $agrementNumber
دفتر المقاعد: $livretDePlaceId
المركبة: $vehicleModel ($vehiclePlate)

الانطلاق: $originName
الوصول: $destinationName
المسافة: ${distanceKm.toStringAsFixed(1)} كم ($durationMinutes دقيقة)

تفاصيل التسعيرة:
- رسم الانطلاق (نهار): ${priseEnChargeDzd.toStringAsFixed(2)} دج
- رسم الاقتراب (سجل 604103): ${fraisApprocheDzd.toStringAsFixed(2)} دج
- المسافة والوقت: ${fareHorokilometriqueDzd.toStringAsFixed(2)} دج
الإجمالي المدفوع: ${totalFareDzd.toStringAsFixed(2)} دج
${spareChangeCreditedDzd > 0 ? 'رصيد الفكة الرقمية المودع: ${spareChangeCreditedDzd.toStringAsFixed(2)} دج\n' : ''}
رمز التحقق الأمني DTW: $verificationHash
★ مطابق للتنظيم والرقابة المرورية ★
''';
    }

    return '''
RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE
Direction des Transports de la Wilaya d'Alger (DTW)
QUITTANCE TAXIMÈTRE OFFICIELLE - DÉCRET EXÉCUTIF 12-230
Réf: $quittanceId
Date: $dateStr

Chauffeur: $driverName
Agrément DTW: $agrementNumber
Livret de Place: $livretDePlaceId
Véhicule: $vehicleModel ($vehiclePlate)

Trajet: $originName -> $destinationName
Distance: ${distanceKm.toStringAsFixed(1)} km ($durationMinutes min)

Décomposition du Tarif Réglementaire:
- Prise en charge: ${priseEnChargeDzd.toStringAsFixed(2)} DA
- Frais d'approche (CNRC 604103): ${fraisApprocheDzd.toStringAsFixed(2)} DA
- Horokilométrique: ${fareHorokilometriqueDzd.toStringAsFixed(2)} DA
TOTAL RÉGLÉ: ${totalFareDzd.toStringAsFixed(2)} DA
${spareChangeCreditedDzd > 0 ? 'Flashe Monnaie Épargne: ${spareChangeCreditedDzd.toStringAsFixed(2)} DA\n' : ''}
Sceau de Sécurité DTW: $verificationHash
★ Document officiel conforme aux contrôles routiers DTW ★
''';
  }

  Map<String, dynamic> toJson() => {
        'quittance_id': quittanceId,
        'issued_at': issuedAt.toIso8601String(),
        'driver_name': driverName,
        'agrement_number': agrementNumber,
        'livret_de_place_id': livretDePlaceId,
        'vehicle_plate': vehiclePlate,
        'vehicle_model': vehicleModel,
        'wilaya': wilaya,
        'origin_name': originName,
        'destination_name': destinationName,
        'distance_km': distanceKm,
        'duration_minutes': durationMinutes,
        'prise_en_charge_dzd': priseEnChargeDzd,
        'frais_approche_dzd': fraisApprocheDzd,
        'fare_horokilometrique_dzd': fareHorokilometriqueDzd,
        'total_fare_dzd': totalFareDzd,
        'payment_method': paymentMethod,
        'spare_change_credited_dzd': spareChangeCreditedDzd,
        'verification_hash': verificationHash,
      };

  factory TaximeterQuittance.fromJson(Map<String, dynamic> json) {
    return TaximeterQuittance(
      quittanceId: json['quittance_id'] as String,
      issuedAt: DateTime.parse(json['issued_at'] as String),
      driverName: json['driver_name'] as String,
      agrementNumber: json['agrement_number'] as String,
      livretDePlaceId: json['livret_de_place_id'] as String,
      vehiclePlate: json['vehicle_plate'] as String,
      vehicleModel: json['vehicle_model'] as String,
      wilaya: json['wilaya'] as String? ?? '16 - Alger',
      originName: json['origin_name'] as String,
      destinationName: json['destination_name'] as String,
      distanceKm: (json['distance_km'] as num).toDouble(),
      durationMinutes: (json['duration_minutes'] as num).toInt(),
      priseEnChargeDzd: (json['prise_en_charge_dzd'] as num?)?.toDouble() ?? 25.0,
      fraisApprocheDzd: (json['frais_approche_dzd'] as num?)?.toDouble() ?? 100.0,
      fareHorokilometriqueDzd: (json['fare_horokilometrique_dzd'] as num).toDouble(),
      totalFareDzd: (json['total_fare_dzd'] as num).toDouble(),
      paymentMethod: json['payment_method'] as String? ?? 'cash_with_spare_change',
      spareChangeCreditedDzd: (json['spare_change_credited_dzd'] as num?)?.toDouble() ?? 0.0,
      verificationHash: json['verification_hash'] as String?,
    );
  }
}
