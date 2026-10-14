import 'package:meta/meta.dart';

/// Incident lockbox record adhering to Law 25-11 on dashcam telemetry and privacy.
@immutable
class DashcamIncident {
  const DashcamIncident({
    required this.id,
    required this.rideId,
    required this.driverId,
    required this.triggerType,
    required this.peakGForce,
    required this.speedKmh,
    required this.triggeredAt,
    required this.encryptionKeyId,
    required this.shamirSharesCount,
    required this.status,
    this.videoBufferDurationSeconds = 60,
  });

  final String id;
  final String rideId;
  final String driverId;
  final String triggerType; // 'g_sensor_impact', 'manual_sos', 'thermal_override'
  final double peakGForce;
  final double speedKmh;
  final DateTime triggeredAt;
  final String encryptionKeyId;
  final int shamirSharesCount;
  final String status; // 'locked_on_device', 'uploading', 'archived_escrow'
  final int videoBufferDurationSeconds;
}
