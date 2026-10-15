import '../models/service_mode.dart';

/// Regulatory Tariff Calculator conforming strictly to Algerian Executive Decree 12-230.
class TariffService {
  static const double flagDropFeeDzd = 100.0;
  static const double dayRatePerKmDzd = 35.0;
  static const double nightRatePerKmDzd = 45.0;
  static const double waitRatePerMinDzd = 5.0;
  static const double collectiveUrbanSeatDzd = 50.0;

  /// Determines whether the given time falls under the official nighttime tariff (20:00 - 06:00).
  static bool isNightTariff(DateTime time) {
    final hour = time.hour;
    return hour >= 20 || hour < 6;
  }

  /// Calculates the official regulatory fare in Algerian Dinars (DZD).
  static double calculateFare({
    required ServiceMode mode,
    required double distanceKm,
    int waitingMinutes = 0,
    DateTime? requestTime,
  }) {
    final effectiveTime = requestTime ?? DateTime.now();

    switch (mode) {
      case ServiceMode.taxiIndividuel:
        final kmRate = isNightTariff(effectiveTime) ? nightRatePerKmDzd : dayRatePerKmDzd;
        final rawFare = flagDropFeeDzd + (distanceKm * kmRate) + (waitingMinutes * waitRatePerMinDzd);
        // Round to nearest 10 DZD
        return (rawFare / 10).round() * 10.0;

      case ServiceMode.taxiCollectifUrbain:
        return collectiveUrbanSeatDzd;

      case ServiceMode.taxiInterWilaya:
        // Regional line base calculation (Dar El Beïda / Caroubier corridor)
        final base = 350.0 + (distanceKm * 18.0);
        return (base / 50).round() * 50.0;
    }
  }
}
