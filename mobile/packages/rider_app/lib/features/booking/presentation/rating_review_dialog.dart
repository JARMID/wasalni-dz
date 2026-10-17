import 'package:flutter/material.dart';
import 'package:naql_core/naql_core.dart';

/// Rating and review dialog for riders after completing a trip.
class RatingReviewDialog extends StatefulWidget {
  const RatingReviewDialog({
    super.key,
    required this.assigned,
    required this.isArabic,
    required this.onSubmit,
  });

  final RideDriverAssigned assigned;
  final bool isArabic;
  final ValueChanged<RideRating> onSubmit;

  static void show(
    BuildContext context, {
    required RideDriverAssigned assigned,
    required bool isArabic,
    required ValueChanged<RideRating> onSubmit,
  }) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => RatingReviewDialog(
        assigned: assigned,
        isArabic: isArabic,
        onSubmit: onSubmit,
      ),
    );
  }

  @override
  State<RatingReviewDialog> createState() => _RatingReviewDialogState();
}

class _RatingReviewDialogState extends State<RatingReviewDialog> {
  int _stars = 5;
  bool _respectedMeter = true;
  int _cleanliness = 5;
  int _safeDriving = 5;
  final TextEditingController _commentController = TextEditingController();

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final assigned = widget.assigned;
    final isArabic = widget.isArabic;

    return Directionality(
      textDirection: isArabic ? TextDirection.rtl : TextDirection.ltr,
      child: AlertDialog(
        backgroundColor: const Color(0xFF131D31),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            const Icon(Icons.star, color: Color(0xFFF59E0B)),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                isArabic ? 'تقييم الرحلة وجودة الخدمة' : 'Évaluation de la Course (DTW)',
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
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
                isArabic
                    ? 'السائق: ${assigned.driverName} • ${assigned.vehiclePlate}'
                    : 'Chauffeur: ${assigned.driverName} • ${assigned.vehiclePlate}',
                style: const TextStyle(color: Colors.white70, fontSize: 13),
              ),
              const SizedBox(height: 14),
              Text(
                isArabic ? 'التقييم العام:' : 'Note Globale:',
                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 6),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(5, (i) {
                  final s = i + 1;
                  return IconButton(
                    icon: Icon(
                      s <= _stars ? Icons.star : Icons.star_border,
                      color: const Color(0xFFF59E0B),
                      size: 28,
                    ),
                    onPressed: () => setState(() => _stars = s),
                  );
                }),
              ),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.black26,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: Colors.white10),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        isArabic ? 'احترام تسعيرة العداد القانوني' : 'Respect du compteur légal',
                        style: const TextStyle(fontSize: 12),
                      ),
                    ),
                    Switch(
                      value: _respectedMeter,
                      activeThumbColor: const Color(0xFF2563EB),
                      onChanged: (val) => setState(() => _respectedMeter = val),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 10),
              Text(
                isArabic ? 'نظافة المركبة:' : 'Propreté du Véhicule:',
                style: const TextStyle(fontSize: 12),
              ),
              const SizedBox(height: 4),
              Row(
                children: [3, 4, 5]
                    .map((val) => Padding(
                          padding: const EdgeInsets.only(right: 6),
                          child: ChoiceChip(
                            label: Text('$val ★'),
                            selected: _cleanliness == val,
                            selectedColor: const Color(0xFF2563EB),
                            onSelected: (sel) => sel ? setState(() => _cleanliness = val) : null,
                          ),
                        ))
                    .toList(),
              ),
              const SizedBox(height: 10),
              Text(
                isArabic ? 'سلامة القيادة والسرعة:' : 'Conduite Sécurisée:',
                style: const TextStyle(fontSize: 12),
              ),
              const SizedBox(height: 4),
              Row(
                children: [3, 4, 5]
                    .map((val) => Padding(
                          padding: const EdgeInsets.only(right: 6),
                          child: ChoiceChip(
                            label: Text('$val ★'),
                            selected: _safeDriving == val,
                            selectedColor: const Color(0xFF2563EB),
                            onSelected: (sel) => sel ? setState(() => _safeDriving = val) : null,
                          ),
                        ))
                    .toList(),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _commentController,
                decoration: InputDecoration(
                  hintText: isArabic
                      ? 'ملاحظات إضافية (اختياري)...'
                      : 'Remarques éventuelles (facultatif)...',
                  hintStyle: const TextStyle(fontSize: 11, color: Colors.white38),
                  filled: true,
                  fillColor: const Color(0xFF0F172A),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: BorderSide.none,
                  ),
                  contentPadding: const EdgeInsets.all(10),
                ),
                maxLines: 2,
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(isArabic ? 'تخطي' : 'Passer'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF2563EB),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            onPressed: () {
              final rating = RideRating(
                rideId: assigned.rideId,
                stars: _stars,
                respectedTaximeter: _respectedMeter,
                cleanlinessRating: _cleanliness,
                safeDrivingRating: _safeDriving,
                ratedAt: DateTime.now(),
                comment: _commentController.text.trim(),
              );
              Navigator.pop(context);
              widget.onSubmit(rating);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  backgroundColor: const Color(0xFF2563EB),
                  content: Text(
                    isArabic
                        ? 'شكراً لك! تم تسجيل التقييم (${rating.compositeScore.toStringAsFixed(1)}/5) بنجاح.'
                        : 'Merci ! Évaluation enregistrée (${rating.compositeScore.toStringAsFixed(1)}/5).',
                  ),
                ),
              );
            },
            child: Text(isArabic ? 'إرسال التقييم' : 'Envoyer l\'Avis'),
          ),
        ],
      ),
    );
  }
}
