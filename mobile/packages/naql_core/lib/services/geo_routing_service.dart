import 'dart:math' as math;
import '../models/geo_hub.dart';
import '../models/route_maneuver.dart';
import '../models/service_mode.dart';
import 'tariff_service.dart';

/// GeoRoutingService provides distance, duration, and fare estimations
/// between recognized hubs across the Greater Algiers metropolitan territory.
class GeoRoutingService {
  static const List<GeoHub> algiersHubs = [
    GeoHub(
      id: 'aeroport',
      nameFr: 'Aéroport International Houari Boumediene (T4)',
      nameAr: 'مطار هواري بومدين الدولي (المحطة 4)',
      commune: 'Dar El Beïda',
      lat: 36.6969,
      lng: 3.2153,
    ),
    GeoHub(
      id: 'grande-poste',
      nameFr: 'Grande Poste d\'Alger (Alger Centre)',
      nameAr: 'البريد المركزي بالجزائر (الجزائر الوسطى)',
      commune: 'Alger Centre',
      lat: 36.7729,
      lng: 3.0583,
    ),
    GeoHub(
      id: 'hydra',
      nameFr: 'Hydra (Place El Qods / Ambassades)',
      nameAr: 'حيدرة (ساحة القدس / السفارات)',
      commune: 'Hydra',
      lat: 36.7456,
      lng: 3.0417,
    ),
    GeoHub(
      id: 'kouba',
      nameFr: 'Kouba (Place Centrale / Mairie)',
      nameAr: 'القبة (الساحة المركزية / البلدية)',
      commune: 'Kouba',
      lat: 36.7262,
      lng: 3.0872,
    ),
    GeoHub(
      id: 'bab-ezzouar',
      nameFr: 'Bab Ezzouar (Université USTHB / Centre d\'Affaires)',
      nameAr: 'باب الزوار (جامعة بومدين / حي الأعمال)',
      commune: 'Bab Ezzouar',
      lat: 36.7120,
      lng: 3.1810,
    ),
    GeoHub(
      id: 'cheraga',
      nameFr: 'Chéraga (Centre d\'Affaires Dounia)',
      nameAr: 'الشراقة (مركز الأعمال دنيا)',
      commune: 'Chéraga',
      lat: 36.7680,
      lng: 2.9550,
    ),
    GeoHub(
      id: 'bab-el-oued',
      nameFr: 'Bab El Oued (Place Triolet / Hôpital)',
      nameAr: 'باب الواد (ساحة تريولي / المستشفى)',
      commune: 'Bab El Oued',
      lat: 36.7865,
      lng: 3.0592,
    ),
    GeoHub(
      id: 'sidi-abdellah',
      nameFr: 'Sidi Abdellah (Pôle Technologique)',
      nameAr: 'سيدي عبد الله (القطب التكنولوجي)',
      commune: 'Mahelma',
      lat: 36.6710,
      lng: 2.8590,
    ),
    GeoHub(
      id: 'caroubier',
      nameFr: 'Gare Routière Centrale du Caroubier',
      nameAr: 'المحطة البرية المركزية الخروبة',
      commune: 'Hussein Dey',
      lat: 36.7388,
      lng: 3.1098,
    ),
  ];

  static GeoHub findHubById(String id) {
    return algiersHubs.firstWhere(
      (h) => h.id == id,
      orElse: () => algiersHubs.first,
    );
  }

  /// Calculates geodesic distance with Algiers road topography winding factor (1.34x).
  static double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
    const double earthRadiusKm = 6371.0;
    final dLat = (lat2 - lat1) * (math.pi / 180.0);
    final dLon = (lon2 - lon1) * (math.pi / 180.0);
    final a = math.sin(dLat / 2) * math.sin(dLat / 2) +
        math.cos(lat1 * (math.pi / 180.0)) *
            math.cos(lat2 * (math.pi / 180.0)) *
            math.sin(dLon / 2) *
            math.sin(dLon / 2);
    final c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a));
    final straightLineKm = earthRadiusKm * c;
    final roadDistanceKm = straightLineKm * 1.34;
    return math.max(2.5, (roadDistanceKm * 10).round() / 10.0);
  }

  /// Calculates distance between two defined GeoHubs.
  static double distanceBetweenHubs(GeoHub origin, GeoHub destination) {
    return calculateDistanceKm(origin.lat, origin.lng, destination.lat, destination.lng);
  }

  /// Estimates traffic duration in minutes in Greater Algiers (average 26 km/h urban speed).
  static int estimateDurationMinutes(double distanceKm) {
    final minutes = (distanceKm / 26.0 * 60).round();
    return math.max(6, minutes);
  }

  /// Estimates regulatory fare using official Executive Decree 12-230 rules.
  static double estimateFareForRoute({
    required GeoHub origin,
    required GeoHub destination,
    required ServiceMode mode,
    DateTime? requestTime,
    int waitingMinutes = 0,
  }) {
    final dist = distanceBetweenHubs(origin, destination);
    return TariffService.calculateFare(
      mode: mode,
      distanceKm: dist,
      waitingMinutes: waitingMinutes,
      requestTime: requestTime,
    );
  }

  /// Generates realistic turn-by-turn maneuvers for navigation between two hubs in Algiers.
  static List<RouteManeuver> generateRouteManeuvers(GeoHub origin, GeoHub destination) {
    return [
      RouteManeuver(
        instructionFr: 'Départ depuis ${origin.nameFr}',
        instructionAr: 'الانطلاق من ${origin.nameAr}',
        distanceMeters: 400,
        maneuverType: ManeuverType.straight,
        roadName: origin.commune,
        speedLimitKmh: 40,
      ),
      RouteManeuver(
        instructionFr: 'Rejoindre la Rocade Sud en direction d\'Alger Centre',
        instructionAr: 'الالتحاق بالطريق السريع الجنوبي باتجاه الجزائر الوسطى',
        distanceMeters: 3200,
        maneuverType: ManeuverType.slightRight,
        roadName: 'Rocade Sud (N5)',
        speedLimitKmh: 80,
      ),
      RouteManeuver(
        instructionFr: 'Continuer sur l\'Autoroute de l\'Est',
        instructionAr: 'مواصلة السير على الطريق السيار شرق-غرب',
        distanceMeters: 4500,
        maneuverType: ManeuverType.straight,
        roadName: 'Autoroute A1 / Rocade Nord',
        speedLimitKmh: 80,
      ),
      RouteManeuver(
        instructionFr: 'Prendre la sortie vers ${destination.commune}',
        instructionAr: 'اتخاذ المخرج باتجاه ${destination.commune}',
        distanceMeters: 800,
        maneuverType: ManeuverType.highwayExit,
        roadName: 'Bretelle de liaison',
        speedLimitKmh: 60,
      ),
      RouteManeuver(
        instructionFr: 'Arrivée à destination : ${destination.nameFr}',
        instructionAr: 'الوصول إلى الوجهة : ${destination.nameAr}',
        distanceMeters: 150,
        maneuverType: ManeuverType.destinationArrival,
        roadName: destination.nameFr,
        speedLimitKmh: 30,
      ),
    ];
  }
}
