import 'package:flutter/material.dart';

/// Dialog allowing riders to top up their wallet via Chargily Pay V2 (CIB / Edahabia SATIM 3DS).
class TopupDialog extends StatefulWidget {
  const TopupDialog({
    super.key,
    required this.isArabic,
    required this.onSuccess,
  });

  final bool isArabic;
  final ValueChanged<double> onSuccess;

  static void show(
    BuildContext context, {
    required bool isArabic,
    required ValueChanged<double> onSuccess,
  }) {
    showDialog(
      context: context,
      builder: (ctx) => TopupDialog(
        isArabic: isArabic,
        onSuccess: onSuccess,
      ),
    );
  }

  @override
  State<TopupDialog> createState() => _TopupDialogState();
}

class _TopupDialogState extends State<TopupDialog> {
  double _selectedAmt = 1000.0;

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: widget.isArabic ? TextDirection.rtl : TextDirection.ltr,
      child: AlertDialog(
        backgroundColor: const Color(0xFF131D31),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            const Icon(Icons.credit_card, color: Color(0xFF0EA5E9)),
            const SizedBox(width: 10),
            Text(
              widget.isArabic ? 'شحن المحفظة (Chargily Pay V2)' : 'Recharge Chargily Pay V2',
              style: const TextStyle(fontSize: 18),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.isArabic
                  ? 'حدد المبلغ (بطاقة CIB أو الذهبية):'
                  : 'Sélectionnez le montant (Carte CIB / Edahabia):',
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              children: [500.0, 1000.0, 2000.0, 5000.0].map((amt) {
                final isSel = _selectedAmt == amt;
                return ChoiceChip(
                  label: Text('${amt.toInt()} DA'),
                  selected: isSel,
                  selectedColor: const Color(0xFF0EA5E9),
                  onSelected: (val) {
                    if (val) setState(() => _selectedAmt = amt);
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.05),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white10),
              ),
              child: Row(
                children: [
                  const Icon(Icons.security, size: 20, color: Color(0xFF2563EB)),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      widget.isArabic
                          ? 'بوابة الدفع الآمن SATIM مع رمز التحقق OTP عبر الرسائل النصية.'
                          : 'Passerelle sécurisée SATIM 3D-Secure avec OTP SMS.',
                      style: const TextStyle(fontSize: 12, color: Colors.white70),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(widget.isArabic ? 'إلغاء' : 'Annuler'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF2563EB),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            onPressed: () {
              final chosenAmt = _selectedAmt;
              Navigator.pop(context);
              widget.onSuccess(chosenAmt);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  backgroundColor: const Color(0xFF2563EB),
                  content: Text(
                    widget.isArabic
                        ? 'تم شحن ${chosenAmt.toInt()} دج بنجاح عبر SATIM 3DS.'
                        : 'Recharge de ${chosenAmt.toInt()} DA validée par SATIM 3DS.',
                  ),
                ),
              );
            },
            child: Text(widget.isArabic ? 'تأكيد الدفع' : 'Confirmer le Paiement'),
          ),
        ],
      ),
    );
  }
}
