/// Thermal operating states for in-cabin tablet and dashcam hardware
/// under Algerian extreme summer field conditions (38°C to 52°C).
enum ThermalLevel {
  normal(
    name: 'NORMAL',
    maxTempCelsius: 38.0,
    targetFps: 15,
    description: 'Plein débit 720p @ 15fps. Télématique nominale 1Hz.',
  ),
  elevated(
    name: 'ELEVATED',
    maxTempCelsius: 44.0,
    targetFps: 10,
    description: 'Température modérée. Réduction de fréquence à 10fps.',
  ),
  critical(
    name: 'CRITICAL',
    maxTempCelsius: 50.0,
    targetFps: 5,
    description: 'Surchauffe détectée. Vidéo limitée à 5fps. Écran assombri.',
  ),
  emergency(
    name: 'EMERGENCY',
    maxTempCelsius: 85.0,
    targetFps: 1,
    description: 'Arrêt d\'urgence encodeur vidéo. Sauvegarde télématique seule.',
  );

  const ThermalLevel({
    required this.name,
    required this.maxTempCelsius,
    required this.targetFps,
    required this.description,
  });

  final String name;
  final double maxTempCelsius;
  final int targetFps;
  final String description;

  static ThermalLevel fromTemperature(double tempCelsius) {
    if (tempCelsius < 38.0) return ThermalLevel.normal;
    if (tempCelsius < 45.0) return ThermalLevel.elevated;
    if (tempCelsius <= 50.0) return ThermalLevel.critical;
    return ThermalLevel.emergency;
  }
}

/// State machine evaluating hardware temperature sensors.
class ThermalStateMachine {
  ThermalStateMachine({double initialTemp = 32.0}) 
      : _currentTempCelsius = initialTemp,
        _currentLevel = ThermalLevel.fromTemperature(initialTemp);

  double _currentTempCelsius;
  ThermalLevel _currentLevel;

  double get currentTempCelsius => _currentTempCelsius;
  ThermalLevel get currentLevel => _currentLevel;

  /// Update temperature and return true if level shifted.
  bool updateTemperature(double newTempCelsius) {
    _currentTempCelsius = newTempCelsius;
    final newLevel = ThermalLevel.fromTemperature(newTempCelsius);
    if (newLevel != _currentLevel) {
      _currentLevel = newLevel;
      return true;
    }
    return false;
  }
}
