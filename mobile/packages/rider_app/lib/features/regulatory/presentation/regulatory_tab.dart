import 'package:flutter/material.dart';

/// Tab presenting Algerian transport regulations and legal anchors
/// (Executive Decree 12-230, CNRC 604103, Law 18-07, and Law 25-11).
class RegulatoryTab extends StatelessWidget {
  const RegulatoryTab({
    super.key,
    required this.isArabic,
  });

  final bool isArabic;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            isArabic ? 'الإطار القانوني والتنظيمي الجزائري' : 'Cadre Réglementaire Algérien',
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          _buildLawItem(
            code: isArabic ? 'المرسوم التنفيذي 12-230' : 'DÉCRET EXÉCUTIF 12-230',
            title: isArabic ? 'استغلال سيارات الأجرة البلدية' : 'Exploitation des Taxis Municipaux',
            description: isArabic
                ? 'يسمح فقط للسائقين الحائزين على رخصة استغلال بلدية ودفتر مقاعد صالح بالعمل على المنصة.'
                : 'Seuls les chauffeurs détenteurs d\'un Agrément communal et d\'un Livret de Place valide sont autorisés sur la plateforme, éliminant tout risque de mise en fourrière.',
          ),
          const SizedBox(height: 12),
          _buildLawItem(
            code: isArabic ? 'رمز السجل التجاري 604103' : 'CODE CNRC 604103',
            title: isArabic ? 'مركز الحجز ورسم الاقتراب' : 'Centrale de Réservation & Frais d\'Approche',
            description: isArabic
                ? 'ينظم الربط وتحديد رسم الاقتراب القانوني 100 دج المضاف إلى قيمة العداد الرسمي.'
                : 'Régule la mise en relation et fixe les frais d\'approche légaux de 100 DA ajoutés au montant du taximètre horokilométrique.',
          ),
          const SizedBox(height: 12),
          _buildLawItem(
            code: isArabic ? 'القانون 18-07 والقانون 25-11' : 'LOI 18-07 & LOI 25-11',
            title: isArabic ? 'سيادة البيانات والمراقبة المرئية' : 'Souveraineté des Données & Vidéosurveillance',
            description: isArabic
                ? 'تخزين بيانات تحديد المواقع وتسجيلات الكاميرا مشفرة محليًا على خوادم داخل التراب الوطني الجزائري.'
                : 'Les données de géolocalisation et les enregistrements vidéo de sécurité sont chiffrés en boîte noire locale et stockés sur des serveurs hébergés en Algérie.',
          ),
        ],
      ),
    );
  }

  Widget _buildLawItem({
    required String code,
    required String title,
    required String description,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF131D31),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.amber.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(
              code,
              style: const TextStyle(
                fontSize: 10,
                color: Colors.amber,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          Text(
            description,
            style: const TextStyle(fontSize: 12, height: 1.4, color: Colors.white70),
          ),
        ],
      ),
    );
  }
}
