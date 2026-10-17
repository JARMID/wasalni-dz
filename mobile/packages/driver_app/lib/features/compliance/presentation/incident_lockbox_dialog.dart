import 'package:flutter/material.dart';
import 'package:naql_core/naql_core.dart';

/// Judicial Black Box Incident Lockbox Dialog under Algerian Law 25-11.
class IncidentLockboxDialog extends StatelessWidget {
  const IncidentLockboxDialog({
    super.key,
    required this.incidents,
    required this.isArabic,
    required this.onTestSensor,
  });

  final List<DashcamIncident> incidents;
  final bool isArabic;
  final VoidCallback onTestSensor;

  static void show(
    BuildContext context, {
    required List<DashcamIncident> incidents,
    required bool isArabic,
    required VoidCallback onTestSensor,
  }) {
    showDialog(
      context: context,
      builder: (ctx) => IncidentLockboxDialog(
        incidents: incidents,
        isArabic: isArabic,
        onTestSensor: onTestSensor,
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
            const Icon(Icons.shield_sharp, color: Color(0xFF2563EB)),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                isArabic
                    ? 'السجل العدلي للصدمات (قانون 25-11)'
                    : 'Boîte Noire Judiciaire (Loi 25-11)',
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
            IconButton(
              icon: const Icon(Icons.close, size: 18),
              onPressed: () => Navigator.pop(context),
            ),
          ],
        ),
        content: SizedBox(
          width: 500,
          height: 380,
          child: incidents.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.check_circle_outline, size: 48, color: Colors.white24),
                      const SizedBox(height: 12),
                      Text(
                        isArabic
                            ? 'لا توجد حوادث مسجلة حاليًا'
                            : 'Aucun incident enregistré sur cet appareil',
                        style: const TextStyle(color: Colors.white54, fontSize: 13),
                      ),
                    ],
                  ),
                )
              : ListView.separated(
                  itemCount: incidents.length,
                  separatorBuilder: (_, __) => const Divider(color: Colors.white10),
                  itemBuilder: (ctx, i) {
                    final inc = incidents[i];
                    return Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.black38,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.white10),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                '${inc.triggerType} • ${inc.speedKmh.toStringAsFixed(0)} km/h',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 13,
                                  color: Colors.redAccent,
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF2563EB).withValues(alpha: 0.2),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  isArabic ? 'مشفر محليًا' : 'LOCKED AES-256',
                                  style: const TextStyle(
                                    fontSize: 9,
                                    color: Color(0xFF60A5FA),
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Text(
                            'ID: ${inc.id} • Ride: ${inc.rideId} • Date: ${inc.triggeredAt.toIso8601String().substring(0, 19).replaceAll("T", " ")}',
                            style: const TextStyle(
                              fontSize: 10,
                              color: Colors.white54,
                              fontFamily: 'monospace',
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Key Fingerprint: ${inc.encryptionKeyId} • Shamir 2/3: ${inc.shamirSharesCount} shares',
                            style: const TextStyle(
                              fontSize: 10,
                              color: Colors.amber,
                              fontFamily: 'monospace',
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
        ),
        actions: [
          TextButton.icon(
            icon: const Icon(Icons.sensors, size: 14, color: Color(0xFFF59E0B)),
            label: Text(
              isArabic ? 'اختبار الحساس (2.84G)' : 'Test Capteur (2.84G)',
              style: const TextStyle(color: Color(0xFFF59E0B)),
            ),
            onPressed: () {
              Navigator.pop(context);
              onTestSensor();
            },
          ),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(isArabic ? 'إغلاق' : 'Fermer'),
          ),
        ],
      ),
    );
  }
}
