/// Represents a major transportation hub in the Algiers metropolitan area.
class GeoHub {
  final String id;
  final String nameFr;
  final String nameAr;
  final String commune;
  final double lat;
  final double lng;

  const GeoHub({
    required this.id,
    required this.nameFr,
    required this.nameAr,
    required this.commune,
    required this.lat,
    required this.lng,
  });

  String localizedName(bool isArabic) => isArabic ? nameAr : nameFr;
}
