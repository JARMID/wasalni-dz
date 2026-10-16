import 'package:meta/meta.dart';

/// Navigation maneuver icon types for Algiers arterial roads
enum ManeuverType {
  straight,
  turnRight,
  turnLeft,
  slightRight,
  slightLeft,
  roundabout,
  highwayExit,
  destinationArrival,
}

/// A specific turn-by-turn navigation step for Algiers routes.
@immutable
class RouteManeuver {
  const RouteManeuver({
    required this.instructionFr,
    required this.instructionAr,
    required this.distanceMeters,
    required this.maneuverType,
    required this.roadName,
    this.speedLimitKmh = 50,
  });

  final String instructionFr;
  final String instructionAr;
  final int distanceMeters;
  final ManeuverType maneuverType;
  final String roadName;
  final int speedLimitKmh;

  String localizedInstruction(bool isArabic) => isArabic ? instructionAr : instructionFr;
}
