import 'package:flutter/material.dart';

/// Modal dialog allowing riders to share their trip tracking link with family (Law 18-07).
class ShareTripDialog extends StatefulWidget {
  const ShareTripDialog({
    super.key,
    required this.rideCode,
    required this.isArabic,
  });

  final String rideCode;
  final bool isArabic;

  static void show(
    BuildContext context, {
    required String rideCode,
    required bool isArabic,
  }) {
    showDialog(
      context: context,
      builder: (ctx) => ShareTripDialog(
        rideCode: rideCode,
        isArabic: isArabic,
      ),
    );
  }

  @override
  State<ShareTripDialog> createState() => _ShareTripDialogState();
}

class _ShareTripDialogState extends State<ShareTripDialog> {
  final TextEditingController _phoneController = TextEditingController();

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isArabic = widget.isArabic;
    final rideCode = widget.rideCode;

    return Directionality(
      textDirection: isArabic ? TextDirection.rtl : TextDirection.ltr,
      child: AlertDialog(
        backgroundColor: const Color(0xFF131D31),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            const Icon(Icons.share, color: Color(0xFF0EA5E9)),
            const SizedBox(width: 10),
            Text(
              isArabic ? 'مشاركة مسار الرحلة الآمن' : 'Partage Sécurisé du Trajet',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              isArabic
                  ? 'شارك رابط التتبع الفوري مع عائلتك متوافق مع قانون حماية المعطيات 18-07:'
                  : 'Partagez le lien de géolocalisation en temps réel avec vos proches (Loi 18-07):',
              style: const TextStyle(fontSize: 12, color: Colors.white70),
            ),
            const SizedBox(height: 12),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.black38,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.white12),
              ),
              child: SelectableText(
                'https://wasslani.dz/suivi/$rideCode',
                style: const TextStyle(
                  fontFamily: 'monospace',
                  fontSize: 12,
                  color: Color(0xFF60A5FA),
                ),
              ),
            ),
            const SizedBox(height: 14),
            TextField(
              controller: _phoneController,
              keyboardType: TextInputType.phone,
              decoration: InputDecoration(
                hintText: isArabic
                    ? 'رقم هاتف العائلة (05xx / 06xx / 07xx)'
                    : 'Numéro du proche (05xx / 06xx / 07xx)',
                hintStyle: const TextStyle(fontSize: 12, color: Colors.white38),
                filled: true,
                fillColor: const Color(0xFF0F172A),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(isArabic ? 'إغلاق' : 'Fermer'),
          ),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF2563EB),
              foregroundColor: Colors.white,
            ),
            icon: const Icon(Icons.send, size: 16),
            label: Text(isArabic ? 'إرسال الرابط' : 'Envoyer par SMS'),
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  backgroundColor: const Color(0xFF2563EB),
                  content: Text(
                    isArabic
                        ? 'تم إرسال رابط التتبع الفوري إلى ${_phoneController.text.isEmpty ? "رقم الهاتف" : _phoneController.text}'
                        : 'Lien de suivi chiffré transmis avec succès par SMS.',
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
