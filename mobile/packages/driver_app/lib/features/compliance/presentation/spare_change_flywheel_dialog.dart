import 'package:flutter/material.dart';
import 'package:naql_core/naql_core.dart';

/// Interactive Flywheel spare change restitution dialog for drivers.
class SpareChangeFlywheelDialog extends StatefulWidget {
  const SpareChangeFlywheelDialog({
    super.key,
    required this.prompt,
    required this.isArabic,
    required this.onReturnCash,
    required this.onCreditDigital,
  });

  final RideSpareChangePrompt prompt;
  final bool isArabic;
  final ValueChanged<double> onReturnCash;
  final void Function(double tenderedCash, double changeAmount) onCreditDigital;

  static void show(
    BuildContext context, {
    required RideSpareChangePrompt prompt,
    required bool isArabic,
    required ValueChanged<double> onReturnCash,
    required void Function(double tenderedCash, double changeAmount) onCreditDigital,
  }) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => SpareChangeFlywheelDialog(
        prompt: prompt,
        isArabic: isArabic,
        onReturnCash: onReturnCash,
        onCreditDigital: onCreditDigital,
      ),
    );
  }

  @override
  State<SpareChangeFlywheelDialog> createState() => _SpareChangeFlywheelDialogState();
}

class _SpareChangeFlywheelDialogState extends State<SpareChangeFlywheelDialog> {
  double _tenderedCash = 1000.0;
  late double _changeAmount;

  @override
  void initState() {
    super.initState();
    _changeAmount = _tenderedCash - widget.prompt.totalFareDzd;
  }

  @override
  Widget build(BuildContext context) {
    final prompt = widget.prompt;
    final isArabic = widget.isArabic;

    return Directionality(
      textDirection: isArabic ? TextDirection.rtl : TextDirection.ltr,
      child: AlertDialog(
        backgroundColor: const Color(0xFF131B29),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            const Icon(Icons.monetization_on, color: Color(0xFFF59E0B)),
            const SizedBox(width: 10),
            Text(
              isArabic ? 'تحويل باقي الصرف الرقمي' : 'Flywheel Reliquat de Monnaie',
              style: const TextStyle(fontSize: 18),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              isArabic
                  ? 'المجموع القانوني: ${prompt.totalFareDzd.toStringAsFixed(0)} دج (العداد ${prompt.meterFinalDzd.toStringAsFixed(0)} دج + الاقتراب 100 دج)'
                  : 'Total course fiscal: ${prompt.totalFareDzd.toStringAsFixed(0)} DA (Compteur ${prompt.meterFinalDzd.toStringAsFixed(0)} DA + Approche 100 DA)',
            ),
            const SizedBox(height: 16),
            Text(
              isArabic ? 'المبلغ النقدي المسلم من الراكب:' : 'Espèces remises par le passager:',
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: [1000.0, 1500.0, 2000.0].map((amt) {
                final selected = _tenderedCash == amt;
                return ChoiceChip(
                  label: Text('${amt.toInt()} DA'),
                  selected: selected,
                  selectedColor: const Color(0xFFF59E0B),
                  onSelected: (val) {
                    if (val) {
                      setState(() {
                        _tenderedCash = amt;
                        _changeAmount = _tenderedCash - prompt.totalFareDzd;
                      });
                    }
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFF2563EB).withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF2563EB).withValues(alpha: 0.3)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    isArabic ? 'التحويل لمحفظة وصلني:' : 'Crédit Portefeuille WASSLANI:',
                    style: const TextStyle(fontSize: 13),
                  ),
                  Text(
                    '+${_changeAmount.toStringAsFixed(0)} DA',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF2563EB),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              widget.onReturnCash(_tenderedCash);
            },
            child: Text(isArabic ? 'إرجاع نقدًا' : 'Rendu en Espèces'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF2563EB),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            onPressed: () {
              Navigator.pop(context);
              widget.onCreditDigital(_tenderedCash, _changeAmount);
            },
            child: Text(isArabic ? 'تحويل لمحفظة وصلني' : 'Créditer sur WASSLANI'),
          ),
        ],
      ),
    );
  }
}
