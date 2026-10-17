import 'package:flutter/material.dart';
import 'package:naql_core/naql_core.dart';

/// Z-Report end-of-shift reconciliation dialog for municipal taxi drivers.
class ZReportDialog extends StatelessWidget {
  const ZReportDialog({
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
      builder: (ctx) => ZReportDialog(
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
            const Icon(Icons.receipt_long, color: Color(0xFFF59E0B)),
            const SizedBox(width: 10),
            Text(
              isArabic ? 'تقرير نهاية الوردية (Z-Report)' : 'Rapport de Quart (Z-Report)',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Chauffeur: ${driver.fullName} (${driver.agrementNumber})',
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
            ),
            Text(
              'Véhicule: ${driver.vehicleModel} • ${driver.vehiclePlate}',
              style: const TextStyle(fontSize: 11, color: Colors.white54),
            ),
            const Divider(height: 20, color: Colors.white10),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  isArabic ? 'الرحلات المنجزة اليوم:' : 'Courses réalisées aujourd\'hui:',
                  style: const TextStyle(fontSize: 12, color: Colors.white70),
                ),
                Text(
                  '${driver.totalTrips}',
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  isArabic ? 'إجمالي الكيلومترات:' : 'Kilométrage total parcouru:',
                  style: const TextStyle(fontSize: 12, color: Colors.white70),
                ),
                const Text('74.5 km', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  isArabic ? 'المداخيل الإجمالية للعداد:' : 'Recette brute taximètre:',
                  style: const TextStyle(fontSize: 12, color: Colors.white70),
                ),
                const Text('6 800.00 DA', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  isArabic ? 'رسوم الاقتراب (100 دج/رحلة):' : 'Frais d\'approche (100 DA/course):',
                  style: const TextStyle(fontSize: 12, color: Colors.white70),
                ),
                const Text('800.00 DA', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  isArabic ? 'باقي الصرف المحول للمحفظة:' : 'Reliquats Flywheel convertis:',
                  style: const TextStyle(fontSize: 12, color: Colors.white70),
                ),
                const Text(
                  '1 150.00 DA',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF60A5FA),
                  ),
                ),
              ],
            ),
            const Divider(height: 20, color: Colors.white10),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  isArabic ? 'الرصيد الصافي للمحفظة:' : 'Solde net portefeuille:',
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                ),
                Text(
                  '${driver.walletBalanceDzd.toStringAsFixed(0)} DA',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFFF59E0B),
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
}
