import 'geo_hub.dart';
import 'service_mode.dart';

/// Represents a finalized historical trip for passenger receipts and fiscal accounting.
class TripHistoryItem {
  final String id;
  final DateTime date;
  final GeoHub origin;
  final GeoHub destination;
  final ServiceMode serviceMode;
  final double distanceKm;
  final double fareDzd;
  final double spareChangeDzd;
  final String driverName;
  final String vehiclePlate;
  final String agrementNumber;
  final String paymentRail; // 'cash_with_spare_change', 'cib_edahabia', 'wallet'

  const TripHistoryItem({
    required this.id,
    required this.date,
    required this.origin,
    required this.destination,
    required this.serviceMode,
    required this.distanceKm,
    required this.fareDzd,
    required this.spareChangeDzd,
    required this.driverName,
    required this.vehiclePlate,
    required this.agrementNumber,
    required this.paymentRail,
  });
}
