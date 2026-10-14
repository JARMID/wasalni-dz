import 'package:meta/meta.dart';
import 'service_mode.dart';

/// Dart 3 sealed class hierarchy for the complete ride lifecycle.
/// Enforces complete pattern matching and prevents impossible transitions.
@immutable
sealed class RideState {
  const RideState();
}

/// The system or driver is idle, waiting for assignments.
final class RideIdle extends RideState {
  const RideIdle();
}

/// Passenger has requested a ride; searching for nearby licensed taxi within H3 Res 8.
final class RideRequested extends RideState {
  const RideRequested({
    required this.rideId,
    required this.rideCode,
    required this.serviceMode,
    required this.originName,
    required this.originLat,
    required this.originLng,
    required this.destinationName,
    required this.destinationLat,
    required this.destinationLng,
    required this.pickupPin,
    required this.fraisApprocheDzd,
    required this.estimatedFareDzd,
    required this.createdAt,
    this.seatsBooked = 1,
  });

  final String rideId;
  final String rideCode;
  final ServiceMode serviceMode;
  final String originName;
  final double originLat;
  final double originLng;
  final String destinationName;
  final double destinationLat;
  final double destinationLng;
  final String pickupPin;
  final double fraisApprocheDzd;
  final double estimatedFareDzd;
  final DateTime createdAt;
  final int seatsBooked;
}

/// A certified municipal taxi driver has accepted the dispatch.
final class RideDriverAssigned extends RideState {
  const RideDriverAssigned({
    required this.rideId,
    required this.rideCode,
    required this.driverId,
    required this.driverName,
    required this.vehiclePlate,
    required this.agrementNumber,
    required this.pickupPin,
    required this.etaMinutes,
    required this.driverLat,
    required this.driverLng,
  });

  final String rideId;
  final String rideCode;
  final String driverId;
  final String driverName;
  final String vehiclePlate;
  final String agrementNumber;
  final String pickupPin;
  final int etaMinutes;
  final double driverLat;
  final double driverLng;
}

/// The driver has arrived at the pickup location and is awaiting the passenger.
final class RideDriverArrived extends RideState {
  const RideDriverArrived({
    required this.rideId,
    required this.rideCode,
    required this.pickupPin,
    required this.arrivedAt,
  });

  final String rideId;
  final String rideCode;
  final String pickupPin;
  final DateTime arrivedAt;
}

/// The pickup PIN has been validated and the trip is underway.
final class RideInProgress extends RideState {
  const RideInProgress({
    required this.rideId,
    required this.rideCode,
    required this.serviceMode,
    required this.startedAt,
    required this.fraisApprocheDzd,
    this.currentSpeedKmh = 0.0,
    this.distanceCoveredKm = 0.0,
  });

  final String rideId;
  final String rideCode;
  final ServiceMode serviceMode;
  final DateTime startedAt;
  final double fraisApprocheDzd;
  final double currentSpeedKmh;
  final double distanceCoveredKm;
}

/// Vehicle arrived at destination; driver enters final taximeter counter reading.
final class RideFareEntry extends RideState {
  const RideFareEntry({
    required this.rideId,
    required this.rideCode,
    required this.serviceMode,
    required this.fraisApprocheDzd,
    required this.suggestedMeterDzd,
  });

  final String rideId;
  final String rideCode;
  final ServiceMode serviceMode;
  final double fraisApprocheDzd;
  final double suggestedMeterDzd;
}

/// Final fare calculated; prompt driver with cash tendered and digital change credit.
final class RideSpareChangePrompt extends RideState {
  const RideSpareChangePrompt({
    required this.rideId,
    required this.rideCode,
    required this.meterFinalDzd,
    required this.fraisApprocheDzd,
    required this.totalFareDzd,
    required this.riderWalletId,
    required this.driverWalletId,
  });

  final String rideId;
  final String rideCode;
  final double meterFinalDzd;
  final double fraisApprocheDzd;
  final double totalFareDzd;
  final String riderWalletId;
  final String driverWalletId;
}

/// Ride completed, ledger journal posted, and wallets balanced.
final class RideCompleted extends RideState {
  const RideCompleted({
    required this.rideId,
    required this.rideCode,
    required this.totalFareDzd,
    required this.tenderedCashDzd,
    required this.spareChangeCreditedDzd,
    required this.completedAt,
  });

  final String rideId;
  final String rideCode;
  final double totalFareDzd;
  final double tenderedCashDzd;
  final double spareChangeCreditedDzd;
  final DateTime completedAt;
}

/// Ride cancelled prior to completion.
final class RideCancelled extends RideState {
  const RideCancelled({
    required this.rideId,
    required this.reason,
    required this.cancelledAt,
  });

  final String rideId;
  final String reason;
  final DateTime cancelledAt;
}
