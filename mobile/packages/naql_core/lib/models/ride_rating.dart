import 'package:meta/meta.dart';

/// Multi-criteria quality and regulatory evaluation for completed taxi rides.
/// Assesses tariff honesty, vehicle hygiene, courtesy, and safe driving.
@immutable
class RideRating {
  const RideRating({
    required this.rideId,
    required this.stars,
    required this.respectedTaximeter,
    required this.cleanlinessRating,
    required this.safeDrivingRating,
    required this.ratedAt,
    this.comment = '',
  });

  final String rideId;
  final int stars; // 1 to 5
  final bool respectedTaximeter; // DTW compliance check
  final int cleanlinessRating; // 1 to 5
  final int safeDrivingRating; // 1 to 5
  final DateTime ratedAt;
  final String comment;

  /// Overall composite score out of 5.0
  double get compositeScore {
    final base = (stars * 0.4) + (cleanlinessRating * 0.3) + (safeDrivingRating * 0.3);
    // Severe penalty if taximeter was not respected
    return respectedTaximeter ? base : (base * 0.5);
  }
}
