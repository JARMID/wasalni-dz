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
      title: 'NAQL DZ - Passager',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0A0F1D),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF0EA5E9), // Sky blue
          secondary: Color(0xFF10B981), // Emerald
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
                  color: Colors.white.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.white10),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.security, size: 20, color: Color(0xFF10B981)),
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
                backgroundColor: const Color(0xFF0EA5E9),
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
                    backgroundColor: const Color(0xFF10B981),
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
                color: const Color(0xFF0EA5E9),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Text('NAQL DZ', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
            ),
            const SizedBox(width: 8),
            const Flexible(
              child: Text('Passager', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold), overflow: TextOverflow.ellipsis),
            ),
          ],
        ),
        actions: [
          // TrustDesk Wallet Pill
          InkWell(
            onTap: () => setState(() => _currentTabIndex = 1),
            child: Container(
              margin: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFF10B981).withOpacity(0.15),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFF10B981).withOpacity(0.4)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.account_balance_wallet, size: 16, color: Color(0xFF10B981)),
                  const SizedBox(width: 6),
                  Text(
                    '${_riderWalletBalanceDzd.toStringAsFixed(0)} DA',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF10B981)),
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
        selectedItemColor: const Color(0xFF0EA5E9),
        unselectedItemColor: Colors.white54,
        onTap: (idx) => setState(() => _currentTabIndex = idx),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.local_taxi), label: 'Commander'),
          BottomNavigationBarItem(icon: Icon(Icons.wallet), label: 'Portefeuille TrustDesk'),
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
                border: Border.all(color: const Color(0xFF10B981).withOpacity(0.3)),
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
                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF10B981)),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(color: Colors.amber.withOpacity(0.2), borderRadius: BorderRadius.circular(6)),
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
          color: isSelected ? const Color(0xFF0EA5E9).withOpacity(0.12) : const Color(0xFF131D31),
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
                          color: Colors.white.withOpacity(0.08),
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
                colors: [Color(0xFF064E3B), Color(0xFF047857)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF10B981).withOpacity(0.3),
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
                    Text('PORTEFEUILLE TRUSTDESK DZ', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
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
            decoration: BoxDecoration(color: Colors.amber.withOpacity(0.15), borderRadius: BorderRadius.circular(6)),
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
