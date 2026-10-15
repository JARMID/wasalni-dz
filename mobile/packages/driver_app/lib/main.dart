import 'package:flutter/material.dart';
import 'package:naql_core/naql_core.dart';

void main() {
  runApp(const DriverCockpitApp());
}

class DriverCockpitApp extends StatelessWidget {
  const DriverCockpitApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'WASSLANI - Cockpit Chauffeur',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0B0F17),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFFF59E0B), // Municipal Taxi Yellow/Amber
          secondary: Color(0xFF2563EB), // Royal Sapphire Blue
          surface: Color(0xFF131B29),
        ),
        fontFamily: 'Roboto',
      ),
      home: const CockpitHomeScreen(),
    );
  }
}

class CockpitHomeScreen extends StatefulWidget {
  const CockpitHomeScreen({super.key});

  @override
  State<CockpitHomeScreen> createState() => _CockpitHomeScreenState();
}

class _CockpitHomeScreenState extends State<CockpitHomeScreen> {
  // Regulatory Driver Profile (Executive Decree 12-230)
  DriverProfile driver = const DriverProfile(
    id: 'DRV-16-0894',
    fullName: 'Mohamed Brahimi',
    phone: '0550 12 34 56',
    agrementNumber: '16/AGR/2021/0894',
    livretDePlaceId: 'LP-16-44021',
    wilayaCode: '16',
    communeName: 'Sidi M\'Hamed (Alger)',
    vehicleModel: 'Peugeot 301 Taxi Jaune',
    vehiclePlate: '01842-120-16',
    vehicleYear: 2021,
    walletBalanceDzd: 4250.0,
    currentLat: 36.7538,
    currentLng: 3.0588,
  );

  final ThermalStateMachine thermalState = ThermalStateMachine(initialTemp: 34.0);
  RideState currentRide = const RideIdle();
  final List<DashcamIncident> incidents = [];

  // Controllers
  final TextEditingController _pinController = TextEditingController();
  final TextEditingController _meterController = TextEditingController(text: '750');

  // Taximeter live simulation
  double _meterKm = 4.2;
  int _meterWaitMins = 6;
  double get _computedMeterDzd => 25.0 + (_meterKm * 35.0) + (_meterWaitMins * 5.0);

  void _showDriverChatDialog() {
    final TextEditingController chatController = TextEditingController();
    final List<Map<String, String>> chatMessages = [
      {
        'sender': 'driver',
        'text': 'Salam Alikoum ! Je suis en route avec ma Peugeot 301.',
        'time': '16:42'
      },
      {
        'sender': 'rider',
        'text': 'Salam, parfait je vous attends devant la sortie.',
        'time': '16:43'
      }
    ];

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDlgState) => AlertDialog(
          backgroundColor: const Color(0xFF131B29),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Row(
            children: [
              const CircleAvatar(
                backgroundColor: Color(0xFFF59E0B),
                radius: 16,
                child: Icon(Icons.person, color: Colors.black, size: 18),
              ),
              const SizedBox(width: 10),
              const Expanded(
                child: Text('Chat Passager en Direct', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
              IconButton(
                icon: const Icon(Icons.close, size: 18),
                onPressed: () => Navigator.pop(ctx),
              ),
            ],
          ),
          content: SizedBox(
            width: 400,
            height: 340,
            child: Column(
              children: [
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      'راني في الطريق',
                      'راني قدام الباب',
                      'زحمة سير في باش جراح',
                      'J\'arrive dans 2 minutes',
                    ].map((chip) => Padding(
                      padding: const EdgeInsets.only(right: 6),
                      child: ActionChip(
                        backgroundColor: const Color(0xFFF59E0B).withValues(alpha: 0.15),
                        side: BorderSide(color: const Color(0xFFF59E0B).withValues(alpha: 0.3)),
                        label: Text(chip, style: const TextStyle(fontSize: 10, color: Color(0xFFF59E0B))),
                        onPressed: () {
                          setDlgState(() {
                            chatMessages.add({
                              'sender': 'driver',
                              'text': chip,
                              'time': '16:44',
                            });
                          });
                        },
                      ),
                    )).toList(),
                  ),
                ),
                const SizedBox(height: 10),
                Expanded(
                  child: ListView.builder(
                    itemCount: chatMessages.length,
                    itemBuilder: (ctx, idx) {
                      final msg = chatMessages[idx];
                      final isDriver = msg['sender'] == 'driver';
                      return Align(
                        alignment: isDriver ? Alignment.centerRight : Alignment.centerLeft,
                        child: Container(
                          margin: const EdgeInsets.symmetric(vertical: 4),
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          decoration: BoxDecoration(
                            color: isDriver ? const Color(0xFF2563EB) : const Color(0xFF1E293B),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: Text(
                            msg['text'] ?? '',
                            style: const TextStyle(fontSize: 12, color: Colors.white),
                          ),
                        ),
                      );
                    },
                  ),
                ),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: chatController,
                        decoration: InputDecoration(
                          hintText: 'Message au passager...',
                          hintStyle: const TextStyle(fontSize: 12, color: Colors.white38),
                          filled: true,
                          fillColor: const Color(0xFF0F172A),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                        ),
                      ),
                    ),
                    const SizedBox(width: 6),
                    IconButton(
                      icon: const Icon(Icons.send, color: Color(0xFFF59E0B)),
                      onPressed: () {
                        if (chatController.text.trim().isNotEmpty) {
                          setDlgState(() {
                            chatMessages.add({
                              'sender': 'driver',
                              'text': chatController.text.trim(),
                              'time': '16:45',
                            });
                            chatController.clear();
                          });
                        }
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _triggerCrashLockbox() {
    final now = DateTime.now();
    final dek = EnvelopeEncryption.generateDek();
    final shares = EnvelopeEncryption.splitShamir2of3(dek);
    final fingerprint = EnvelopeEncryption.calculateFingerprint('INC-LOC-01', now, 2.84);

    final incident = DashcamIncident(
      id: 'INC-${now.millisecondsSinceEpoch.toString().substring(7)}',
      rideId: currentRide is RideInProgress ? (currentRide as RideInProgress).rideId : 'PATROL-16',
      driverId: driver.id,
      triggerType: 'g_sensor_impact (2.84G)',
      peakGForce: 2.84,
      speedKmh: 48.0,
      triggeredAt: now,
      encryptionKeyId: fingerprint.substring(0, 16),
      shamirSharesCount: shares.length,
      status: 'locked_on_device',
    );

    setState(() {
      incidents.insert(0, incident);
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: Colors.red.shade900,
        content: Text(
          'ALERTE 2.84G: Buffer 60s verrouillé sous AES-256-GCM (Shamir 2/3: ${shares.length} parts)',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
    );
  }

  void _simulateRideRequest() {
    setState(() {
      currentRide = RideRequested(
        rideId: 'DZ-RIDE-9901',
        rideCode: 'DZ-74021',
        serviceMode: ServiceMode.taxiIndividuel,
        originName: 'Place du 1er Mai, Sidi M\'Hamed',
        originLat: 36.7525,
        originLng: 3.0560,
        destinationName: 'Grande Poste d\'Alger',
        destinationLat: 36.7729,
        destinationLng: 3.0594,
        pickupPin: '4821',
        fraisApprocheDzd: 100.0,
        estimatedFareDzd: 850.0,
        createdAt: DateTime.now(),
      );
    });
  }

  void _showSpareChangeDialog(RideSpareChangePrompt prompt) {
    double tenderedCash = 1000.0;
    double changeAmount = tenderedCash - prompt.totalFareDzd;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDlgState) => AlertDialog(
          backgroundColor: const Color(0xFF131B29),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Row(
            children: [
              Icon(Icons.monetization_on, color: Color(0xFFF59E0B)),
              SizedBox(width: 10),
              Text('Flywheel Reliquat de Monnaie', style: TextStyle(fontSize: 18)),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Total course fiscal: ${prompt.totalFareDzd.toStringAsFixed(0)} DA (Compteur ${prompt.meterFinalDzd.toStringAsFixed(0)} DA + Approche 100 DA)'),
              const SizedBox(height: 16),
              const Text('Espèces remises par le passager:'),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                children: [1000.0, 1500.0, 2000.0].map((amt) {
                  final selected = tenderedCash == amt;
                  return ChoiceChip(
                    label: Text('${amt.toInt()} DA'),
                    selected: selected,
                    selectedColor: const Color(0xFFF59E0B),
                    onSelected: (val) {
                      if (val) {
                        setDlgState(() {
                          tenderedCash = amt;
                          changeAmount = tenderedCash - prompt.totalFareDzd;
                        });
                      }
                    },
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF2563EB).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF2563EB).withValues(alpha: 0.3)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Crédit Portefeuille WASSLANI:', style: TextStyle(fontSize: 13)),
                    Text(
                      '+${changeAmount.toStringAsFixed(0)} DA',
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF2563EB)),
                    ),
                  ],
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(ctx);
                setState(() {
                  currentRide = RideCompleted(
                    rideId: prompt.rideId,
                    rideCode: prompt.rideCode,
                    totalFareDzd: prompt.totalFareDzd,
                    tenderedCashDzd: tenderedCash,
                    spareChangeCreditedDzd: 0,
                    completedAt: DateTime.now(),
                  );
                });
              },
              child: const Text('Rendu en Espèces'),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF2563EB),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () {
                Navigator.pop(ctx);
                setState(() {
                  driver = driver.copyWith(
                    walletBalanceDzd: driver.walletBalanceDzd - changeAmount - 100.0,
                    totalTrips: driver.totalTrips + 1,
                  );
                  currentRide = RideCompleted(
                    rideId: prompt.rideId,
                    rideCode: prompt.rideCode,
                    totalFareDzd: prompt.totalFareDzd,
                    tenderedCashDzd: tenderedCash,
                    spareChangeCreditedDzd: changeAmount,
                    completedAt: DateTime.now(),
                  );
                });
              },
              child: const Text('Créditer sur WASSLANI'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        elevation: 0,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFFF59E0B),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Text('WASSLANI', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 14)),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(driver.fullName, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                Text('${driver.agrementNumber} • ${driver.vehiclePlate}', style: const TextStyle(fontSize: 11, color: Colors.white70)),
              ],
            ),
          ],
        ),
        actions: [
          // Thermal Gauge
          Container(
            margin: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.black45,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.white24),
            ),
            child: Row(
              children: [
                const Icon(Icons.thermostat, size: 16, color: Color(0xFFF59E0B)),
                const SizedBox(width: 4),
                Text('${thermalState.currentTempCelsius.toInt()}°C (${thermalState.currentLevel.targetFps} fps)', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          Switch(
            value: driver.isOnline,
            activeThumbColor: const Color(0xFF2563EB),
            onChanged: (val) => setState(() => driver = driver.copyWith(isOnline: val)),
          ),
        ],
      ),
      body: Row(
        children: [
          // Left Column: Cockpit Telematics & Dashcam
          Expanded(
            flex: 5,
            child: Container(
              margin: const EdgeInsets.all(12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF131B29),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white10),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Regulatory Badge
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.amber.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.amber.withValues(alpha: 0.2)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('DÉCRET EXÉCUTIF 12-230 / CNRC 604103', style: TextStyle(fontSize: 10, color: Colors.amber, fontWeight: FontWeight.bold)),
                              Text('Agrément Wilaya d\'Alger • Livret de Place Validé', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600), overflow: TextOverflow.ellipsis),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(color: const Color(0xFF2563EB).withValues(alpha: 0.2), borderRadius: BorderRadius.circular(6)),
                          child: const Text('CONFORME', style: TextStyle(fontSize: 10, color: Color(0xFF60A5FA), fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Dashcam Viewfinder & Telematics Overlay
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.black,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.white24),
                      ),
                      child: Stack(
                        children: [
                          Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(Icons.videocam, size: 48, color: Colors.white24),
                                const SizedBox(height: 8),
                                Text(
                                  'CameraX Circular Buffer [${thermalState.currentLevel.targetFps} fps]',
                                  style: const TextStyle(color: Colors.white54, fontSize: 12, fontFamily: 'monospace'),
                                ),
                              ],
                            ),
                          ),
                          Positioned(
                            top: 10,
                            left: 10,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(color: Colors.red.withValues(alpha: 0.8), borderRadius: BorderRadius.circular(6)),
                              child: const Row(
                                children: [
                                  CircleAvatar(radius: 3, backgroundColor: Colors.white),
                                  SizedBox(width: 6),
                                  Text('REC 720p', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                          ),
                          Positioned(
                            bottom: 10,
                            left: 10,
                            right: 10,
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                ElevatedButton.icon(
                                  style: ElevatedButton.styleFrom(backgroundColor: Colors.red.shade800),
                                  icon: const Icon(Icons.warning, size: 16),
                                  label: const Text('Crash 2.84G', style: TextStyle(fontSize: 11)),
                                  onPressed: _triggerCrashLockbox,
                                ),
                                Text('Solde Chauffeur: ${driver.walletBalanceDzd.toStringAsFixed(0)} DA', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.amber)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Right Column: Ride Operations & State Machine
          Expanded(
            flex: 6,
            child: Container(
              margin: const EdgeInsets.all(12),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF131B29),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white10),
              ),
              child: _buildRideStateView(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRideStateView() {
    return switch (currentRide) {
      RideIdle() => Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.local_taxi, size: 64, color: Colors.white24),
            const SizedBox(height: 16),
            const Text('En attente de courses...', style: TextStyle(fontSize: 18, color: Colors.white70)),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFF59E0B),
                foregroundColor: Colors.black,
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              ),
              icon: const Icon(Icons.notification_add),
              label: const Text('Simuler une Demande Passager', style: TextStyle(fontWeight: FontWeight.bold)),
              onPressed: _simulateRideRequest,
            ),
          ],
        ),
      ),
      RideRequested(:final originName, :final destinationName, :final estimatedFareDzd) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(color: Colors.amber.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(6)),
            child: const Text('NOUVELLE COURSE RÉGLEMENTÉE', style: TextStyle(color: Colors.amber, fontWeight: FontWeight.bold, fontSize: 11)),
          ),
          const SizedBox(height: 12),
          Text(originName, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const Icon(Icons.arrow_downward, size: 16, color: Colors.white54),
          Text(destinationName, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const Spacer(),
          Text('Estimation: ${estimatedFareDzd.toStringAsFixed(0)} DA (dont 100 DA approche)', style: const TextStyle(fontSize: 14, color: Colors.white70)),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () => setState(() => currentRide = const RideIdle()),
                  child: const Text('Refuser'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF2563EB)),
                  onPressed: () {
                    final req = currentRide as RideRequested;
                    setState(() {
                      currentRide = RideDriverAssigned(
                        rideId: req.rideId,
                        rideCode: req.rideCode,
                        driverId: driver.id,
                        driverName: driver.fullName,
                        vehiclePlate: driver.vehiclePlate,
                        agrementNumber: driver.agrementNumber,
                        pickupPin: req.pickupPin,
                        etaMinutes: 4,
                        driverLat: driver.currentLat,
                        driverLng: driver.currentLng,
                      );
                    });
                  },
                  child: const Text('Accepter la Course', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ],
      ),
      RideDriverAssigned(:final pickupPin) => Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.directions_car, size: 48, color: Colors.amber),
          const SizedBox(height: 16),
          const Text('En route vers le point de prise en charge', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text('Code PIN requis à l\'embarquement: $pickupPin', style: const TextStyle(fontSize: 14, color: Colors.white70)),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2563EB),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                icon: const Icon(Icons.chat, size: 16, color: Colors.white),
                label: const Text('Chat Passager', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                onPressed: _showDriverChatDialog,
              ),
              const SizedBox(width: 12),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFF59E0B),
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                onPressed: () {
                  final assigned = currentRide as RideDriverAssigned;
                  setState(() {
                    currentRide = RideDriverArrived(
                      rideId: assigned.rideId,
                      rideCode: assigned.rideCode,
                      pickupPin: assigned.pickupPin,
                      arrivedAt: DateTime.now(),
                    );
                  });
                },
                child: const Text('Je suis Arrivé sur Place', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ],
      ),
      RideDriverArrived(:final pickupPin) => Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text('Validation du Passager (Code PIN)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          SizedBox(
            width: 200,
            child: TextField(
              controller: _pinController,
              keyboardType: TextInputType.number,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 24, letterSpacing: 8, fontWeight: FontWeight.bold),
              decoration: const InputDecoration(hintText: 'PIN', border: OutlineInputBorder()),
            ),
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF2563EB)),
            onPressed: () {
              if (_pinController.text.trim() == pickupPin || _pinController.text.isEmpty) {
                final arrived = currentRide as RideDriverArrived;
                setState(() {
                  currentRide = RideInProgress(
                    rideId: arrived.rideId,
                    rideCode: arrived.rideCode,
                    serviceMode: ServiceMode.taxiIndividuel,
                    startedAt: DateTime.now(),
                    fraisApprocheDzd: 100.0,
                  );
                });
              }
            },
            child: const Text('Démarrer la Course', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
      RideInProgress(:final fraisApprocheDzd) => Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.speed, size: 28, color: Color(0xFF2563EB)),
              SizedBox(width: 8),
              Text('Taximètre Réglementaire Actif', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 4),
          const Text('Prise en charge: 25 DA • Trajet: 35 DA/km • Attente: 5 DA/min', style: TextStyle(fontSize: 11, color: Colors.white54)),
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.black45,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: Colors.white12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                Column(
                  children: [
                    const Text('DISTANCE', style: TextStyle(fontSize: 10, color: Colors.white54, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text('${_meterKm.toStringAsFixed(1)} km', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                  ],
                ),
                Container(height: 28, width: 1, color: Colors.white12),
                Column(
                  children: [
                    const Text('ATTENTE', style: TextStyle(fontSize: 10, color: Colors.white54, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text('$_meterWaitMins min', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                  ],
                ),
                Container(height: 28, width: 1, color: Colors.white12),
                Column(
                  children: [
                    const Text('COMPTEUR', style: TextStyle(fontSize: 10, color: Color(0xFFF59E0B), fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text('${_computedMeterDzd.toStringAsFixed(0)} DA', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFFF59E0B))),
                  ],
                ),
                Container(height: 28, width: 1, color: Colors.white12),
                Column(
                  children: [
                    const Text('TOTAL AVEC APPROCHE', style: TextStyle(fontSize: 10, color: Color(0xFF60A5FA), fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text('${(_computedMeterDzd + fraisApprocheDzd).toStringAsFixed(0)} DA', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF60A5FA))),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFF60A5FA),
                  side: const BorderSide(color: Color(0xFF2563EB)),
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                ),
                icon: const Icon(Icons.add_road, size: 14),
                label: const Text('+1.0 km (+35 DA)', style: TextStyle(fontSize: 11)),
                onPressed: () => setState(() => _meterKm += 1.0),
              ),
              const SizedBox(width: 8),
              OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFFF59E0B),
                  side: const BorderSide(color: Color(0xFFF59E0B)),
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                ),
                icon: const Icon(Icons.timer, size: 14),
                label: const Text('+2 min (+10 DA)', style: TextStyle(fontSize: 11)),
                onPressed: () => setState(() => _meterWaitMins += 2),
              ),
              const SizedBox(width: 8),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2563EB),
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                ),
                icon: const Icon(Icons.chat, size: 14, color: Colors.white),
                label: const Text('Chat', style: TextStyle(fontSize: 11, color: Colors.white)),
                onPressed: _showDriverChatDialog,
              ),
            ],
          ),
          const SizedBox(height: 14),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFF59E0B),
              foregroundColor: Colors.black,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            ),
            onPressed: () {
              final inProg = currentRide as RideInProgress;
              final finalMeter = _computedMeterDzd;
              _meterController.text = finalMeter.toStringAsFixed(0);
              setState(() {
                currentRide = RideFareEntry(
                  rideId: inProg.rideId,
                  rideCode: inProg.rideCode,
                  serviceMode: inProg.serviceMode,
                  fraisApprocheDzd: inProg.fraisApprocheDzd,
                  suggestedMeterDzd: finalMeter,
                );
              });
            },
            child: const Text('Destination Atteinte (Saisie Compteur)', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
      RideFareEntry(:final fraisApprocheDzd) => Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text('Relevé du Compteur Fiscal (Taximètre)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          SizedBox(
            width: 220,
            child: TextField(
              controller: _meterController,
              keyboardType: TextInputType.number,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              decoration: const InputDecoration(labelText: 'Montant Compteur (DA)', border: OutlineInputBorder()),
            ),
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF2563EB)),
            onPressed: () {
              final meterAmt = double.tryParse(_meterController.text) ?? 750.0;
              final entry = currentRide as RideFareEntry;
              final prompt = RideSpareChangePrompt(
                rideId: entry.rideId,
                rideCode: entry.rideCode,
                meterFinalDzd: meterAmt,
                fraisApprocheDzd: fraisApprocheDzd,
                totalFareDzd: meterAmt + fraisApprocheDzd,
                riderWalletId: 'WLT-RIDER-01',
                driverWalletId: 'WLT-DRIVER-01',
              );
              setState(() => currentRide = prompt);
              _showSpareChangeDialog(prompt);
            },
            child: const Text('Valider le Tarif & Monnaie', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
      RideSpareChangePrompt() => Center(
        child: ElevatedButton(
          onPressed: () => _showSpareChangeDialog(currentRide as RideSpareChangePrompt),
          child: const Text('Ouvrir Dialogue Reliquat'),
        ),
      ),
      RideCompleted(:final totalFareDzd, :final spareChangeCreditedDzd) => Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.check_circle, size: 56, color: const Color(0xFF2563EB)),
          const SizedBox(height: 12),
          const Text('Course Clôturée avec Succès', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text('Total payé: ${totalFareDzd.toStringAsFixed(0)} DA • Reliquat crédité: ${spareChangeCreditedDzd.toStringAsFixed(0)} DA', style: const TextStyle(color: Colors.white70)),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => setState(() => currentRide = const RideIdle()),
            child: const Text('Prêt pour la Prochaine Course'),
          ),
        ],
      ),
      RideCancelled(:final reason) => Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.cancel, size: 48, color: Colors.red),
            const SizedBox(height: 12),
            Text('Course annulée: $reason'),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => setState(() => currentRide = const RideIdle()),
              child: const Text('Retour'),
            ),
          ],
        ),
      ),
    };
  }
}
