import 'package:meta/meta.dart';

/// Represents a driver's active daily shift conforming to municipal taxi regulations.
/// Enforces road safety driving hour caps and real-time revenue accounting.
@immutable
class DriverShift {
  const DriverShift({
    required this.shiftId,
    required this.driverId,
    required this.startedAt,
    this.endedAt,
    this.isOnline = true,
    this.completedTrips = 0,
    this.totalDistanceKm = 0.0,
    this.grossMeterEarningsDzd = 0.0,
    this.approachFeesDzd = 0.0,
    this.spareChangeConvertedDzd = 0.0,
    this.platformCommissionPercent = 10.0,
  });

  final String shiftId;
  final String driverId;
  final DateTime startedAt;
  final DateTime? endedAt;
  final bool isOnline;
  final int completedTrips;
  final double totalDistanceKm;
  final double grossMeterEarningsDzd;
  final double approachFeesDzd;
  final double spareChangeConvertedDzd;
  final double platformCommissionPercent;

  /// Total gross revenue earned during this shift
  double get totalGrossRevenueDzd => grossMeterEarningsDzd + approachFeesDzd;

  /// Platform commission deducted based on agreed tier
  double get commissionDeductionDzd => totalGrossRevenueDzd * (platformCommissionPercent / 100.0);

  /// Net driver earnings before personal fuel/maintenance expenses
  double get netEarningsDzd => totalGrossRevenueDzd - commissionDeductionDzd;

  /// Elapsed shift duration in minutes
  int get elapsedMinutes {
    final end = endedAt ?? DateTime.now();
    return end.difference(startedAt).inMinutes;
  }

  /// Whether the driver is within the legal 8-hour driving limit without mandatory rest
  bool get isFatigueCompliant => elapsedMinutes <= 480;

  DriverShift copyWith({
    String? shiftId,
    String? driverId,
    DateTime? startedAt,
    DateTime? endedAt,
    bool? isOnline,
    int? completedTrips,
    double? totalDistanceKm,
    double? grossMeterEarningsDzd,
    double? approachFeesDzd,
    double? spareChangeConvertedDzd,
    double? platformCommissionPercent,
  }) {
    return DriverShift(
      shiftId: shiftId ?? this.shiftId,
      driverId: driverId ?? this.driverId,
      startedAt: startedAt ?? this.startedAt,
      endedAt: endedAt ?? this.endedAt,
      isOnline: isOnline ?? this.isOnline,
      completedTrips: completedTrips ?? this.completedTrips,
      totalDistanceKm: totalDistanceKm ?? this.totalDistanceKm,
      grossMeterEarningsDzd: grossMeterEarningsDzd ?? this.grossMeterEarningsDzd,
      approachFeesDzd: approachFeesDzd ?? this.approachFeesDzd,
      spareChangeConvertedDzd: spareChangeConvertedDzd ?? this.spareChangeConvertedDzd,
      platformCommissionPercent: platformCommissionPercent ?? this.platformCommissionPercent,
    );
  }
}
