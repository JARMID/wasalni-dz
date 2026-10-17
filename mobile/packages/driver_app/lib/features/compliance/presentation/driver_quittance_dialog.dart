import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:naql_core/naql_core.dart';

/// Driver Taximeter Quittance dialog with QR inspection matrix and verification seal.
class DriverQuittanceDialog extends StatelessWidget {
  const DriverQuittanceDialog({
    super.key,
    required this.driver,
    required this.fareDzd,
    required this.distanceKm,
    this.originName,
    this.destinationName,
    this.spareChangeDzd = 0.0,
    required this.isArabic,
  });

  final DriverProfile driver;
  final double fareDzd;
  final double distanceKm;
  final String? originName;
  final String? destinationName;
  final double spareChangeDzd;
  final bool isArabic;

  static void show(
    BuildContext context, {
    required DriverProfile driver,
    required double fareDzd,
    required double distanceKm,
    String? originName,
    String? destinationName,
    double spareChangeDzd = 0.0,
    required bool isArabic,
  }) {
    showDialog(
      context: context,
      builder: (ctx) => DriverQuittanceDialog(
        driver: driver,
        fareDzd: fareDzd,
        distanceKm: distanceKm,
        originName: originName,
        destinationName: destinationName,
        spareChangeDzd: spareChangeDzd,
        isArabic: isArabic,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final tripFare = (fareDzd - 125.0).clamp(50.0, 5000.0);
    final quittance = TaximeterQuittance(
      quittanceId: 'QTX-16-2026-${(1000 + (driver.fullName.hashCode.abs() % 9000))}',
      issuedAt: DateTime.now(),
      driverName: driver.fullName,
      agrementNumber: driver.agrementNumber,
      livretDePlaceId: driver.livretDePlaceId,
      vehiclePlate: driver.vehiclePlate,
      vehicleModel: driver.vehicleModel,
      originName: originName ?? (isArabic ? 'القبة (الجزائر)' : 'Kouba (Alger)'),
      destinationName: destinationName ?? (isArabic ? 'البريد المركزي' : 'Grande Poste'),
      distanceKm: distanceKm,
      durationMinutes: (distanceKm * 2.2).round().clamp(5, 120),
      priseEnChargeDzd: 25.0,
      fraisApprocheDzd: 100.0,
      fareHorokilometriqueDzd: tripFare,
      totalFareDzd: fareDzd,
      spareChangeCreditedDzd: spareChangeDzd,
    );

    return Directionality(
      textDirection: isArabic ? TextDirection.rtl : TextDirection.ltr,
      child: AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        title: Column(
          children: [
            Text(
              isArabic
                  ? 'الجمهورية الجزائرية الديمقراطية الشعبية'
                  : 'RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.black87),
            ),
            const SizedBox(height: 2),
            Text(
              isArabic
                  ? 'مديرية النقل لولاية الجزائر (DTW)'
                  : 'Direction des Transports de la Wilaya d\'Alger (DTW)',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: Colors.black54),
            ),
            const SizedBox(height: 6),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: const Color(0xFF2563EB).withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                isArabic ? 'وصل العداد الرسمي مرسوم 12-230' : 'QUITTANCE TAXIMÈTRE DÉCRET 12-230',
                style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFF2563EB)),
              ),
            ),
          ],
        ),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                isArabic ? 'السائق: ${driver.fullName}' : 'Chauffeur: ${driver.fullName}',
                style: const TextStyle(color: Colors.black87, fontWeight: FontWeight.bold, fontSize: 13),
              ),
              Text(
                isArabic ? 'رخصة الاستغلال: ${driver.agrementNumber}' : 'Agrément DTW: ${driver.agrementNumber}',
                style: const TextStyle(color: Colors.black54, fontSize: 11),
              ),
              Text(
                isArabic ? 'دفتر المقاعد: ${driver.livretDePlaceId}' : 'Livret de Place: ${driver.livretDePlaceId}',
                style: const TextStyle(color: Colors.black54, fontSize: 11),
              ),
              Text(
                isArabic ? 'رقم اللوحة: ${driver.vehiclePlate}' : 'Immatriculation: ${driver.vehiclePlate}',
                style: const TextStyle(color: Colors.black87, fontSize: 11),
              ),
              const Divider(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      isArabic ? 'رسم الانطلاق (نهار):' : 'Prise en charge (Tarif 1 Jour):',
                      style: const TextStyle(color: Colors.black54, fontSize: 11),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Text('25.00 DA', style: TextStyle(color: Colors.black87, fontWeight: FontWeight.bold, fontSize: 11)),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      isArabic ? 'رسم الاقتراب (سجل تجاري 604103):' : 'Frais d\'approche (CNRC 604103):',
                      style: const TextStyle(color: Colors.black54, fontSize: 11),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Text('100.00 DA', style: TextStyle(color: Colors.black87, fontWeight: FontWeight.bold, fontSize: 11)),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      isArabic
                          ? 'مسافة الطريق (${distanceKm.toStringAsFixed(1)} كم):'
                          : 'Trajet horokilométrique (${distanceKm.toStringAsFixed(1)} km):',
                      style: const TextStyle(color: Colors.black54, fontSize: 11),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text('${tripFare.toStringAsFixed(2)} DA', style: const TextStyle(color: Colors.black87, fontWeight: FontWeight.bold, fontSize: 11)),
                ],
              ),
              const Divider(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      isArabic ? 'المجموع المدفوع:' : 'TOTAL RÉGLÉ:',
                      style: const TextStyle(color: Colors.black87, fontWeight: FontWeight.bold, fontSize: 13),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text('${fareDzd.toStringAsFixed(0)} DA', style: const TextStyle(color: Color(0xFF2563EB), fontWeight: FontWeight.bold, fontSize: 15)),
                ],
              ),
              const SizedBox(height: 12),
              Center(
                child: Column(
                  children: [
                    QuittanceQrWidget(
                      data: quittance.toQrInspectionPayload(),
                      size: 110.0,
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Sceau DTW: ${quittance.verificationHash}',
                      style: const TextStyle(fontSize: 9, fontFamily: 'monospace', fontWeight: FontWeight.bold, color: Colors.black54),
                    ),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        border: Border.all(color: const Color(0xFF2563EB)),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        isArabic ? '★ مطابق لمراقبة شرطة المرور DTW ★' : '★ CONFORME CONTRÔLE ROUTIER DTW ★',
                        style: const TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A)),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton.icon(
            icon: const Icon(Icons.share, size: 14),
            label: Text(isArabic ? 'مشاركة الوصل' : 'Partager'),
            onPressed: () {
              Clipboard.setData(ClipboardData(text: quittance.toShareableSummary(isArabic: isArabic)));
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  backgroundColor: const Color(0xFF2563EB),
                  content: Text(
                    isArabic
                        ? 'تم نسخ بيانات الوصل الرسمي إلى الحافظة.'
                        : 'Résumé officiel de la quittance copié dans le presse-papiers.',
                  ),
                ),
              );
            },
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF2563EB),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () => Navigator.pop(context),
            child: Text(isArabic ? 'إغلاق' : 'Fermer'),
          ),
        ],
      ),
    );
  }
}
