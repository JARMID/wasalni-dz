import 'package:flutter/services.dart';

/// Audio and haptic orchestration service for WASSLANI mobile and web applications.
/// Coordinates subtle, communicative tactile and acoustic cues across ride lifecycle events.
class AudioHapticService {
  AudioHapticService._();

  static bool isAudioEnabled = true;
  static bool isHapticEnabled = true;

  /// Triggered when a new ride booking is dispatched or accepted.
  static Future<void> onRideDispatched() async {
    if (isHapticEnabled) {
      await HapticFeedback.mediumImpact();
    }
    if (isAudioEnabled) {
      await SystemSound.play(SystemSoundType.click);
    }
  }

  /// Triggered when the driver arrives at the pickup curb or meeting point.
  static Future<void> onDriverArrived() async {
    if (isHapticEnabled) {
      await HapticFeedback.heavyImpact();
      await Future<void>.delayed(const Duration(milliseconds: 120));
      await HapticFeedback.mediumImpact();
    }
    if (isAudioEnabled) {
      await SystemSound.play(SystemSoundType.alert);
    }
  }

  /// Triggered when a spare change flywheel digital credit is confirmed.
  static Future<void> onSpareChangeCredited() async {
    if (isHapticEnabled) {
      await HapticFeedback.lightImpact();
      await Future<void>.delayed(const Duration(milliseconds: 80));
      await HapticFeedback.selectionClick();
    }
    if (isAudioEnabled) {
      await SystemSound.play(SystemSoundType.click);
    }
  }

  /// Triggered during 2.84G crash lockbox engagement or manual SOS trigger (Law 25-11).
  static Future<void> onCrashLockboxTriggered() async {
    if (isHapticEnabled) {
      await HapticFeedback.vibrate();
      await Future<void>.delayed(const Duration(milliseconds: 150));
      await HapticFeedback.heavyImpact();
      await Future<void>.delayed(const Duration(milliseconds: 150));
      await HapticFeedback.vibrate();
    }
    if (isAudioEnabled) {
      await SystemSound.play(SystemSoundType.alert);
    }
  }

  /// Light tactile feedback on standard UI control clicks and mode selector shifts.
  static Future<void> onSelectionClick() async {
    if (isHapticEnabled) {
      await HapticFeedback.selectionClick();
    }
  }
}
