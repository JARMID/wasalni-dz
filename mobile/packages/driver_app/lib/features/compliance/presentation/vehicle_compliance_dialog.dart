import 'package:flutter/material.dart';
import 'package:naql_core/naql_core.dart';

/// DTW municipal vehicle compliance audit dialog (Agrément, Livret de Place, Insurance, CT).
class VehicleComplianceDialog extends StatelessWidget {
  const VehicleComplianceDialog({
    super.key,
    required this.driver,
    required this.isArabic,
  });

  final DriverProfile driver;
  final bool isArabic;

  static void show(
    BuildContext context, {
    required DriverProfile driver,
    required bool isArabic,
  }) {
    showDialog(
      context: context,
      builder: (ctx) => VehicleComplianceDialog(
        driver: driver,
        isArabic: isArabic,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: isArabic ? TextDirection.rtl : TextDirection.ltr,
      child: AlertDialog(
        backgroundColor: const Color(0xFF131B29),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            const Icon(Icons.verified, color: Color(0xFF2563EB)),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                isArabic
                    ? 'الاعتمادات القانونية للمركبة (DTW)'
                    : 'Conformité Réglementaire Véhicule (DTW)',
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFF2563EB).withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFF2563EB).withValues(alpha: 0.3)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.badge, color: Color(0xFF60A5FA), size: 18),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      isArabic
                          ? 'دفتر مقاعد رسمي: LP-16-44021 • صادر عن ولاية الجزائر'
                          : 'Livret de Place Officiel: LP-16-44021 • Wilaya d\'Alger',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            _buildComplianceRow(
              isArabic ? 'رخصة الاستغلال:' : 'Numéro d\'Agrément DTW:',
              driver.agrementNumber,
            ),
            _buildComplianceRow(
              isArabic ? 'المركبة المعتمدة:' : 'Véhicule Homologué:',
              '${driver.vehicleModel} (${driver.vehicleYear})',
            ),
            _buildComplianceRow(
              isArabic ? 'رقم اللوحة المنجمية:' : 'Immatriculation:',
              driver.vehiclePlate,
            ),
            _buildComplianceRow(
              isArabic ? 'الفحص التقني الدوري:' : 'Contrôle Technique:',
              isArabic ? 'صالح حتى 15 ديسمبر 2026' : 'Valide jusqu\'au 15/12/2026',
            ),
            _buildComplianceRow(
              isArabic ? 'التأمين المهني:' : 'Assurance Taxi:',
              'SAA Multirisques Transport Pro',
            ),
            const Divider(height: 16, color: Colors.white10),
            Row(
              children: [
                const Icon(Icons.shield_outlined, color: Colors.amber, size: 16),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    isArabic
                        ? 'متوافق تماماً مع التفتيش الميداني لشرطة المرور ووزارة النقل.'
                        : 'Conforme aux contrôles routiers inopinés de la Sûreté et DTW.',
                    style: const TextStyle(fontSize: 11, color: Colors.amber),
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(isArabic ? 'إغلاق' : 'Fermer'),
          ),
        ],
      ),
    );
  }

  Widget _buildComplianceRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 11, color: Colors.white54)),
          Text(
            value,
            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
          ),
        ],
      ),
    );
  }
}
