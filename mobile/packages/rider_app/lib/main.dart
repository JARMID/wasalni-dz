import 'package:flutter/material.dart';
import 'package:naql_core/naql_core.dart';

void main() {
  runApp(const RiderApp());
}

class RiderApp extends StatelessWidget {
  const RiderApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'WASSLANI - Passager',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0A0F1D),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF2563EB), // Royal Sapphire Blue
          secondary: Color(0xFFF59E0B), // Taxi Amber / Gold
          surface: Color(0xFF131D31),
        ),
        fontFamily: 'Roboto',
      ),
      home: const RiderHomeScreen(),
    );
  }
}

class RiderHomeScreen extends StatefulWidget {
  const RiderHomeScreen({super.key});

  @override
  State<RiderHomeScreen> createState() => _RiderHomeScreenState();
}

class _RiderHomeScreenState extends State<RiderHomeScreen> {
  int _currentTabIndex = 0; // 0 = Booking, 1 = Wallet, 2 = About
  ServiceMode _selectedMode = ServiceMode.taxiIndividuel;
  double _riderWalletBalanceDzd = 1450.0;
  double _accumulatedSpareChangeDzd = 350.0;


  RideState _currentRide = const RideIdle();

  // Locations
  String _origin = 'Kouba (Centre)';
  String _destination = 'Grande Poste d\'Alger';

  void _requestRide() {
    final now = DateTime.now();
    final pickupPin = (1000 + (now.millisecondsSinceEpoch % 9000)).toString();

    setState(() {
      _currentRide = RideDriverAssigned(
        rideId: 'DZ-RIDE-${now.millisecondsSinceEpoch.toString().substring(8)}',
        rideCode: 'DZ-${now.millisecondsSinceEpoch.toString().substring(7)}',
        driverId: 'DRV-16-0894',
        driverName: 'Mohamed Brahimi',
        vehiclePlate: '01842-120-16',
        agrementNumber: '16/AGR/2021/0894',
        pickupPin: pickupPin,
        etaMinutes: 5,
        driverLat: 36.7538,
        driverLng: 3.0588,
      );
    });
  }

  void _cancelRide() {
    setState(() {
      _currentRide = const RideIdle();
    });
  }

  void _showTopupDialog() {
    double selectedAmt = 1000.0;
    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDlgState) => AlertDialog(
          backgroundColor: const Color(0xFF131D31),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Row(
            children: [
              Icon(Icons.credit_card, color: Color(0xFF0EA5E9)),
              SizedBox(width: 10),
              Text('Recharge Chargily Pay V2', style: TextStyle(fontSize: 18)),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Sélectionnez le montant (Carte CIB / Edahabia):'),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                children: [500.0, 1000.0, 2000.0, 5000.0].map((amt) {
                  final isSel = selectedAmt == amt;
                  return ChoiceChip(
                    label: Text('${amt.toInt()} DA'),
                    selected: isSel,
                    selectedColor: const Color(0xFF0EA5E9),
                    onSelected: (val) {
                      if (val) setDlgState(() => selectedAmt = amt);
                    },
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.05),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.white10),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.security, size: 20, color: Color(0xFF2563EB)),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Passerelle sécurisée SATIM 3D-Secure avec OTP SMS.',
                        style: TextStyle(fontSize: 12, color: Colors.white70),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Annuler'),
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
                  _riderWalletBalanceDzd += selectedAmt;
                });
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    backgroundColor: const Color(0xFF2563EB),
                    content: Text('Recharge de ${selectedAmt.toInt()} DA validée par SATIM 3DS.'),
                  ),
                );
              },
              child: const Text('Confirmer le Paiement'),
            ),
          ],
        ),
      ),
    );
  }

  void _showChatDialog(String driverName, String plate) {
    final TextEditingController chatController = TextEditingController();
    final List<Map<String, String>> chatMessages = [
      {
        'sender': 'driver',
        'text': 'Salam Alikoum ! Je suis en route avec ma Peugeot 301.',
        'time': '16:42'
      }
    ];

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDlgState) => AlertDialog(
          backgroundColor: const Color(0xFF131D31),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          titlePadding: const EdgeInsets.fromLTRB(20, 16, 16, 12),
          title: Row(
            children: [
              const CircleAvatar(
                backgroundColor: Color(0xFF2563EB),
                radius: 18,
                child: Icon(Icons.person, color: Colors.white, size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(driverName, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                    Text(plate, style: const TextStyle(fontSize: 11, color: Colors.white54)),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close, size: 20),
                onPressed: () => Navigator.pop(ctx),
              ),
            ],
          ),
          content: SizedBox(
            width: double.maxFinite,
            height: 360,
            child: Column(
              children: [
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      'راني نستنى قدام الباب',
                      'Je suis devant l\'entrée',
                      'راني في إشارة المرور',
                      'Climatisation svp',
                    ].map((chip) => Padding(
                      padding: const EdgeInsets.only(right: 6),
                      child: ActionChip(
                        backgroundColor: const Color(0xFF2563EB).withValues(alpha: 0.15),
                        side: BorderSide(color: const Color(0xFF2563EB).withValues(alpha: 0.3)),
                        label: Text(chip, style: const TextStyle(fontSize: 10, color: Color(0xFF60A5FA))),
                        onPressed: () {
                          setDlgState(() {
                            chatMessages.add({
                              'sender': 'rider',
                              'text': chip,
                              'time': '16:43',
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
                      final isRider = msg['sender'] == 'rider';
                      return Align(
                        alignment: isRider ? Alignment.centerRight : Alignment.centerLeft,
                        child: Container(
                          margin: const EdgeInsets.symmetric(vertical: 4),
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          decoration: BoxDecoration(
                            color: isRider ? const Color(0xFF2563EB) : const Color(0xFF1E293B),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Text(
                            msg['text'] ?? '',
                            style: const TextStyle(fontSize: 13, color: Colors.white),
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
                          hintText: 'Écrire un message...',
                          hintStyle: const TextStyle(fontSize: 12, color: Colors.white38),
                          filled: true,
                          fillColor: const Color(0xFF0F172A),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    IconButton(
                      icon: const Icon(Icons.send, color: Color(0xFF2563EB)),
                      onPressed: () {
                        if (chatController.text.trim().isNotEmpty) {
                          setDlgState(() {
                            chatMessages.add({
                              'sender': 'rider',
                              'text': chatController.text.trim(),
                              'time': '16:44',
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

  void _showOfficialReceiptDialog(RideDriverAssigned assigned) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Column(
          children: [
            const Text(
              'RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.black87),
            ),
            const SizedBox(height: 2),
            const Text(
              'Direction des Transports de la Wilaya d\'Alger (DTW)',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: Colors.black54),
            ),
            const SizedBox(height: 6),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(color: const Color(0xFF2563EB).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(4)),
              child: const Text('QUITTANCE TAXIMÈTRE DÉCRET 12-230', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFF2563EB))),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Chauffeur: ${assigned.driverName}', style: const TextStyle(color: Colors.black87, fontWeight: FontWeight.bold, fontSize: 13)),
            Text('Agrément DTW: ${assigned.agrementNumber}', style: const TextStyle(color: Colors.black54, fontSize: 11)),
            Text('Immatriculation: ${assigned.vehiclePlate}', style: const TextStyle(color: Colors.black87, fontSize: 11)),
            const Divider(height: 20),
            const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Prise en charge (Tarif 1 Jour):', style: TextStyle(color: Colors.black54, fontSize: 12)),
                Text('25.00 DA', style: TextStyle(color: Colors.black87, fontWeight: FontWeight.bold, fontSize: 12)),
              ],
            ),
            const SizedBox(height: 4),
            const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Frais d\'approche (CNRC 604103):', style: TextStyle(color: Colors.black54, fontSize: 12)),
                Text('100.00 DA', style: TextStyle(color: Colors.black87, fontWeight: FontWeight.bold, fontSize: 12)),
              ],
            ),
            const SizedBox(height: 4),
            const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Trajet horokilométrique:', style: TextStyle(color: Colors.black54, fontSize: 12)),
                Text('725.00 DA', style: TextStyle(color: Colors.black87, fontWeight: FontWeight.bold, fontSize: 12)),
              ],
            ),
            const Divider(height: 20),
            const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('TOTAL RÉGLÉ:', style: TextStyle(color: Colors.black87, fontWeight: FontWeight.bold, fontSize: 14)),
                Text('850.00 DA', style: TextStyle(color: Color(0xFF2563EB), fontWeight: FontWeight.bold, fontSize: 16)),
              ],
            ),
            const SizedBox(height: 12),
            Center(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.blue.shade900),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text('★ CONFORME CONTRÔLE ROUTIER DTW ★', style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A))),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Fermer'),
          ),
        ],
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
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFF2563EB),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Text('WASSLANI', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
            ),
            const SizedBox(width: 8),
            const Flexible(
              child: Text('Passager', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold), overflow: TextOverflow.ellipsis),
            ),
          ],
        ),
        actions: [
          // WASSLANI Wallet Pill
          InkWell(
            onTap: () => setState(() => _currentTabIndex = 1),
            child: Container(
              margin: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFF2563EB).withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFF2563EB).withValues(alpha: 0.4)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.account_balance_wallet, size: 16, color: Color(0xFF2563EB)),
                  const SizedBox(width: 6),
                  Text(
                    '${_riderWalletBalanceDzd.toStringAsFixed(0)} DA',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF2563EB)),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
      body: IndexedStack(
        index: _currentTabIndex,
        children: [
          _buildBookingTab(),
          _buildWalletTab(),
          _buildRegulatoryTab(),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentTabIndex,
        backgroundColor: const Color(0xFF0F172A),
        selectedItemColor: const Color(0xFF2563EB),
        unselectedItemColor: Colors.white54,
        onTap: (idx) => setState(() => _currentTabIndex = idx),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.local_taxi), label: 'Commander'),
          BottomNavigationBarItem(icon: Icon(Icons.wallet), label: 'Portefeuille WASSLANI'),
          BottomNavigationBarItem(icon: Icon(Icons.verified_user), label: 'Réglementation'),
        ],
      ),
    );
  }

  Widget _buildBookingTab() {
    if (_currentRide is RideDriverAssigned) {
      final assigned = _currentRide as RideDriverAssigned;
      return Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF131D31),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFF2563EB).withValues(alpha: 0.3)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          'Chauffeur en route (${assigned.etaMinutes} min)',
                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF60A5FA)),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(color: Colors.amber.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(6)),
                        child: const Text('DÉCRET 12-230', style: TextStyle(fontSize: 10, color: Colors.amber, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(assigned.driverName, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  Text('${assigned.vehiclePlate} • Agrément ${assigned.agrementNumber}', style: const TextStyle(color: Colors.white70, fontSize: 13)),
                  const Divider(height: 24, color: Colors.white10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Flexible(
                        child: Text('Code PIN d\'embarquement:'),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: Colors.black,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: Colors.amber),
                        ),
                        child: Text(
                          assigned.pickupPin,
                          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, letterSpacing: 4, color: Colors.amber),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF2563EB),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          icon: const Icon(Icons.chat, size: 16),
                          label: const Text('Chat Chauffeur', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                          onPressed: () => _showChatDialog(assigned.driverName, assigned.vehiclePlate),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: OutlinedButton.icon(
                          style: OutlinedButton.styleFrom(
                            foregroundColor: const Color(0xFFF59E0B),
                            side: const BorderSide(color: Color(0xFFF59E0B)),
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          icon: const Icon(Icons.receipt_long, size: 16),
                          label: const Text('Quittance DTW', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                          onPressed: () => _showOfficialReceiptDialog(assigned),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  SizedBox(
                    width: double.infinity,
                    child: TextButton.icon(
                      style: TextButton.styleFrom(
                        foregroundColor: Colors.redAccent,
                        padding: const EdgeInsets.symmetric(vertical: 6),
                      ),
                      icon: const Icon(Icons.shield_outlined, size: 16, color: Colors.redAccent),
                      label: const Text('SOS 1548 Sûreté Nationale (Urgence)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            backgroundColor: Colors.redAccent,
                            content: Text('Alerte SOS 1548 transmise à la Sûreté Nationale avec géolocalisation active.'),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.redAccent,
                  side: const BorderSide(color: Colors.redAccent),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                onPressed: _cancelRide,
                child: const Text('Annuler la Course'),
              ),
            ),
          ],
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Sélectionnez votre mode de transport réglementé:', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),

          // Mode 1: Taxi Individuel
          _buildModeCard(
            mode: ServiceMode.taxiIndividuel,
            title: 'Taxi Individuel (Compteur)',
            subtitle: 'Compteur fiscal horokilométrique + 100 DA approche obligatoire',
            icon: Icons.local_taxi,
            badge: '+100 DA Approche',
          ),
          const SizedBox(height: 12),

          // Mode 2: Taxi Collectif Urbain
          _buildModeCard(
            mode: ServiceMode.taxiCollectifUrbain,
            title: 'Taxi Collectif Urbain (Ligne)',
            subtitle: 'Tarif fixe 50 DA la place. Ligne urbaine partagée (4 places max)',
            icon: Icons.groups,
            badge: '50 DA / Place',
          ),
          const SizedBox(height: 12),

          // Mode 3: Inter-Wilaya
          _buildModeCard(
            mode: ServiceMode.taxiInterWilaya,
            title: 'Taxi Inter-Wilaya (Gare Caroubier)',
            subtitle: 'Liaisons régionales depuis la gare routière du Caroubier',
            icon: Icons.alt_route,
            badge: 'Gare Routière',
          ),
          const SizedBox(height: 24),

          // Origin and Destination Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF131D31),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white10),
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    const Icon(Icons.my_location, size: 20, color: Color(0xFF0EA5E9)),
                    const SizedBox(width: 12),
                    Expanded(child: Text(_origin, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600))),
                  ],
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 8),
                  child: Divider(color: Colors.white10),
                ),
                Row(
                  children: [
                    const Icon(Icons.location_on, size: 20, color: Colors.redAccent),
                    const SizedBox(width: 12),
                    Expanded(child: Text(_destination, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600))),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Action Button
          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0EA5E9),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              onPressed: _requestRide,
              child: const Text('Commander un Taxi Certifié', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildModeCard({
    required ServiceMode mode,
    required String title,
    required String subtitle,
    required IconData icon,
    required String badge,
  }) {
    final isSelected = _selectedMode == mode;
    return InkWell(
      onTap: () => setState(() => _selectedMode = mode),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF0EA5E9).withValues(alpha: 0.12) : const Color(0xFF131D31),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? const Color(0xFF0EA5E9) : Colors.white10,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isSelected ? const Color(0xFF0EA5E9) : Colors.white10,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: isSelected ? Colors.white : Colors.white70),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold), overflow: TextOverflow.ellipsis),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.08),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(badge, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Colors.amber)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(subtitle, style: const TextStyle(fontSize: 12, color: Colors.white60)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWalletTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Wallet Balance Hero Card
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF1E3A8A), Color(0xFF2563EB)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF2563EB).withValues(alpha: 0.3),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('PORTEFEUILLE WASSLANI', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
                    Icon(Icons.shield, color: Colors.white70, size: 20),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  '${_riderWalletBalanceDzd.toStringAsFixed(0)} DA',
                  style: const TextStyle(color: Colors.white, fontSize: 36, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(8)),
                      child: Text(
                        'Flywheel Monnaie: +${_accumulatedSpareChangeDzd.toStringAsFixed(0)} DA',
                        style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Top-Up Actions
          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0EA5E9),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              icon: const Icon(Icons.add_card),
              label: const Text('Recharger via CIB / Edahabia (Chargily)', style: TextStyle(fontWeight: FontWeight.bold)),
              onPressed: _showTopupDialog,
            ),
          ),
          const SizedBox(height: 28),

          const Text('Principe du Spare Change Flywheel:', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF131D31),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white10),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Lorsque vous réglez une course en espèces (ex. billet de 1000 DA pour 850 DA de course), le chauffeur crédite vos 150 DA de reliquat directement sur votre compte TrustDesk via son application en un clic.',
                  style: TextStyle(fontSize: 13, height: 1.5, color: Colors.white70),
                ),
                SizedBox(height: 12),
                Text(
                  'Ce solde s\'accumule sans friction et peut être utilisé pour de futures courses ou transféré.',
                  style: TextStyle(fontSize: 13, height: 1.5, color: Colors.white70),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRegulatoryTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Cadre Réglementaire Algérien', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          _buildLawItem(
            code: 'DÉCRET EXÉCUTIF 12-230',
            title: 'Exploitation des Taxis Municipaux',
            description: 'Seuls les chauffeurs détenteurs d\'un Agrément communal et d\'un Livret de Place valide sont autorisés sur la plateforme, éliminant tout risque de mise en fourrière.',
          ),
          const SizedBox(height: 12),
          _buildLawItem(
            code: 'CODE CNRC 604103',
            title: 'Centrale de Réservation & Frais d\'Approche',
            description: 'Régule la mise en relation et fixe les frais d\'approche légaux de 100 DA ajoutés au montant du taximètre horokilométrique.',
          ),
          const SizedBox(height: 12),
          _buildLawItem(
            code: 'LOI 18-07 & LOI 25-11',
            title: 'Souveraineté des Données & Vidéosurveillance',
            description: 'Les données de géolocalisation et les enregistrements vidéo de sécurité sont chiffrés en boîte noire locale et stockés sur des serveurs hébergés en Algérie.',
          ),
        ],
      ),
    );
  }

  Widget _buildLawItem({required String code, required String title, required String description}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF131D31),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(color: Colors.amber.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(6)),
            child: Text(code, style: const TextStyle(fontSize: 10, color: Colors.amber, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(height: 8),
          Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          Text(description, style: const TextStyle(fontSize: 12, height: 1.4, color: Colors.white70)),
        ],
      ),
    );
  }
}
