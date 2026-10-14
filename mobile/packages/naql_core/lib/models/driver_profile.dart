import 'package:meta/meta.dart';

/// Regulated municipal taxi driver profile adhering to Executive Decree 12-230.
@immutable
class DriverProfile {
  const DriverProfile({
    required this.id,
    required this.fullName,
    required this.phone,
    required this.agrementNumber,
    required this.livretDePlaceId,
    required this.wilayaCode,
    required this.communeName,
    required this.vehicleModel,
    required this.vehiclePlate,
    required this.vehicleYear,
    required this.walletBalanceDzd,
    required this.currentLat,
    required this.currentLng,
    this.heading = 0,
    this.speedKmh = 0,
    this.isOnline = true,
    this.rating = 4.92,
    this.totalTrips = 1420,
  });

  final String id;
  final String fullName;
  final String phone;
  final String agrementNumber;
  final String livretDePlaceId;
  final String wilayaCode;
  final String communeName;
  final String vehicleModel;
  final String vehiclePlate;
  final int vehicleYear;
  final double walletBalanceDzd;
  final double currentLat;
  final double currentLng;
  final int heading;
  final int speedKmh;
  final bool isOnline;
  final double rating;
  final int totalTrips;

  DriverProfile copyWith({
    String? fullName,
    String? phone,
    double? walletBalanceDzd,
    double? currentLat,
    double? currentLng,
    int? heading,
    int? speedKmh,
    bool? isOnline,
    double? rating,
    int? totalTrips,
  }) {
    return DriverProfile(
      id: id,
      fullName: fullName ?? this.fullName,
      phone: phone ?? this.phone,
      agrementNumber: agrementNumber,
      livretDePlaceId: livretDePlaceId,
      wilayaCode: wilayaCode,
      communeName: communeName,
      vehicleModel: vehicleModel,
      vehiclePlate: vehiclePlate,
      vehicleYear: vehicleYear,
      walletBalanceDzd: walletBalanceDzd ?? this.walletBalanceDzd,
      currentLat: currentLat ?? this.currentLat,
      currentLng: currentLng ?? this.currentLng,
      heading: heading ?? this.heading,
      speedKmh: speedKmh ?? this.speedKmh,
      isOnline: isOnline ?? this.isOnline,
      rating: rating ?? this.rating,
      totalTrips: totalTrips ?? this.totalTrips,
    );
  }
}
