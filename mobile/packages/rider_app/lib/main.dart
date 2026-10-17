import 'package:flutter/material.dart';
import 'package:naql_core/naql_core.dart';

import 'features/booking/presentation/driver_chat_dialog.dart';
import 'features/booking/presentation/location_picker_sheet.dart';
import 'features/booking/presentation/rating_review_dialog.dart';
import 'features/booking/presentation/share_trip_dialog.dart';
import 'features/regulatory/presentation/quittance_dialog.dart';
import 'features/regulatory/presentation/regulatory_tab.dart';
import 'features/wallet/presentation/topup_dialog.dart';

void main() {
  runApp(const RiderApp());
}

class RiderApp extends StatelessWidget {
  const RiderApp({super.key, this.supabaseService});

  final SupabaseService? supabaseService;

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
      home: RiderHomeScreen(supabaseService: supabaseService),
    );
  }
}

class RiderHomeScreen extends StatefulWidget {
  const RiderHomeScreen({super.key, this.supabaseService});

  final SupabaseService? supabaseService;

  @override
  State<RiderHomeScreen> createState() => _RiderHomeScreenState();
}

class _RiderHomeScreenState extends State<RiderHomeScreen> {
  int _currentTabIndex = 0; // 0 = Booking, 1 = Wallet & History, 2 = Regulatory
  bool _isArabic = false;
  ServiceMode _selectedMode = ServiceMode.taxiIndividuel;
  double _riderWalletBalanceDzd = 1450.0;
  final double _accumulatedSpareChangeDzd = 350.0;
  bool _isSyncingBalance = false;
  late final SupabaseService _supabaseService;
  late final OfflineSyncQueue _offlineQueue;

  @override
  void initState() {
    super.initState();
    _supabaseService = widget.supabaseService ?? SupabaseService();
    _offlineQueue = OfflineSyncQueue(supabaseService: _supabaseService);
    _offlineQueue.addListener(_onQueueStateChanged);
    _loadSupabaseBalances();
  }

  void _onQueueStateChanged() {
    if (mounted) setState(() {});
  }

  Future<void> _loadSupabaseBalances() async {
    if (!mounted) return;
    setState(() => _isSyncingBalance = true);
    final balances = await _supabaseService.fetchWalletBalances();
    if (mounted) {
      setState(() {
        _isSyncingBalance = false;
        if (balances.containsKey('2010')) {
          _riderWalletBalanceDzd = balances['2010']!;
        }
      });
    }
  }

  @override
  void dispose() {
    _offlineQueue.removeListener(_onQueueStateChanged);
    _offlineQueue.dispose();
    if (widget.supabaseService == null) {
      _supabaseService.dispose();
    }
    super.dispose();
  }

  RideState _currentRide = const RideIdle();

  // Dynamic Algiers Hubs
  GeoHub _origin = GeoRoutingService.findHubById('kouba');
  GeoHub _destination = GeoRoutingService.findHubById('grande-poste');

  double get _currentDistanceKm => GeoRoutingService.distanceBetweenHubs(_origin, _destination);
  int get _currentDurationMin => GeoRoutingService.estimateDurationMinutes(_currentDistanceKm);
  double get _currentEstimatedFareDzd => GeoRoutingService.estimateFareForRoute(
        origin: _origin,
        destination: _destination,
        mode: _selectedMode,
      );

  // Completed Trip History with DTW receipts
  final List<TripHistoryItem> _tripHistory = [
    TripHistoryItem(
      id: 'DZ-HIST-1001',
      date: DateTime.now().subtract(const Duration(hours: 4)),
      origin: GeoRoutingService.findHubById('kouba'),
      destination: GeoRoutingService.findHubById('grande-poste'),
      serviceMode: ServiceMode.taxiIndividuel,
      distanceKm: 14.2,
      fareDzd: 600.0,
      spareChangeDzd: 150.0,
      driverName: 'Mohamed Brahimi',
      vehiclePlate: '01842-120-16',
      agrementNumber: '16/AGR/2021/0894',
      paymentRail: 'cash_with_spare_change',
    ),
    TripHistoryItem(
      id: 'DZ-HIST-1002',
      date: DateTime.now().subtract(const Duration(days: 2)),
      origin: GeoRoutingService.findHubById('bab-ezzouar'),
      destination: GeoRoutingService.findHubById('aeroport'),
      serviceMode: ServiceMode.taxiIndividuel,
      distanceKm: 8.5,
      fareDzd: 450.0,
      spareChangeDzd: 50.0,
      driverName: 'Karim Belkacem',
      vehiclePlate: '00492-119-16',
      agrementNumber: '16/AGR/2019/0492',
      paymentRail: 'cash_with_spare_change',
    ),
    TripHistoryItem(
      id: 'DZ-HIST-1003',
      date: DateTime.now().subtract(const Duration(days: 5)),
      origin: GeoRoutingService.findHubById('hydra'),
      destination: GeoRoutingService.findHubById('cheraga'),
      serviceMode: ServiceMode.taxiIndividuel,
      distanceKm: 11.0,
      fareDzd: 720.0,
      spareChangeDzd: 80.0,
      driverName: 'Youcef Hamidi',
      vehiclePlate: '07812-122-16',
      agrementNumber: '16/AGR/2022/0781',
      paymentRail: 'wallet',
    ),
  ];

  void _requestRide() {
    AudioHapticService.onRideDispatched();
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
    AudioHapticService.onSelectionClick();
    setState(() {
      _currentRide = const RideIdle();
    });
  }

  void _showLocationPicker({required bool isOrigin}) {
    LocationPickerSheet.show(
      context,
      isOrigin: isOrigin,
      isArabic: _isArabic,
      onSelectHub: (hub) {
        setState(() {
          if (isOrigin) {
            _origin = hub;
          } else {
            _destination = hub;
          }
        });
      },
    );
  }

  void _showTopupDialog() {
    TopupDialog.show(
      context,
      isArabic: _isArabic,
      onSuccess: (amt) {
        setState(() {
          _riderWalletBalanceDzd += amt;
        });
      },
    );
  }

  void _showShareTripDialog(String rideCode) {
    ShareTripDialog.show(
      context,
      rideCode: rideCode,
      isArabic: _isArabic,
    );
  }

  void _showChatDialog(String driverName, String plate) {
    DriverChatDialog.show(
      context,
      driverName: driverName,
      vehiclePlate: plate,
      isArabic: _isArabic,
    );
  }

  void _showTripReceiptDialog({
    required String driverName,
    required String agrementNumber,
    required String vehiclePlate,
    required double fareDzd,
    required double distanceKm,
    String? originName,
    String? destinationName,
    double? spareChangeDzd,
  }) {
    QuittanceDialog.show(
      context,
      driverName: driverName,
      agrementNumber: agrementNumber,
      vehiclePlate: vehiclePlate,
      fareDzd: fareDzd,
      distanceKm: distanceKm,
      originName: originName ?? _origin.localizedName(_isArabic),
      destinationName: destinationName ?? _destination.localizedName(_isArabic),
      spareChangeDzd: spareChangeDzd ?? 0.0,
      isArabic: _isArabic,
    );
  }

  void _showOfficialReceiptDialog(RideDriverAssigned assigned) {
    _showTripReceiptDialog(
      driverName: assigned.driverName,
      agrementNumber: assigned.agrementNumber,
      vehiclePlate: assigned.vehiclePlate,
      fareDzd: _currentEstimatedFareDzd,
      distanceKm: _currentDistanceKm,
      originName: _origin.localizedName(_isArabic),
      destinationName: _destination.localizedName(_isArabic),
    );
  }

  void _showRatingReviewDialog(RideDriverAssigned assigned) {
    RatingReviewDialog.show(
      context,
      assigned: assigned,
      isArabic: _isArabic,
      onSubmit: (rating) {
        setState(() {
          _tripHistory.insert(
            0,
            TripHistoryItem(
              id: assigned.rideId,
              date: DateTime.now(),
              origin: _origin,
              destination: _destination,
              serviceMode: _selectedMode,
              distanceKm: _currentDistanceKm,
              fareDzd: _currentEstimatedFareDzd,
              spareChangeDzd: 100.0,
              driverName: assigned.driverName,
              vehiclePlate: assigned.vehiclePlate,
              agrementNumber: assigned.agrementNumber,
              paymentRail: 'cash_with_spare_change',
            ),
          );
          _currentRide = const RideIdle();
        });
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: _isArabic ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
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
              Flexible(
                child: Text(
                  _isArabic ? 'الراكب' : 'Passager',
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          actions: [
            // Offline/Network Simulation Toggle
            IconButton(
              icon: Icon(
                _offlineQueue.isOnline ? Icons.wifi : Icons.cloud_off,
                size: 18,
                color: _offlineQueue.isOnline ? const Color(0xFF60A5FA) : const Color(0xFFF59E0B),
              ),
              tooltip: _isArabic ? 'حالة الشبكة (نفق / متصل)' : 'Connectivité (Tunnel / En ligne)',
              onPressed: () {
                _offlineQueue.setOnlineStatus(!_offlineQueue.isOnline);
              },
            ),
            // Language Toggle (FR / عربي)
            TextButton.icon(
              style: TextButton.styleFrom(
                foregroundColor: Colors.white70,
                padding: const EdgeInsets.symmetric(horizontal: 8),
              ),
              icon: const Icon(Icons.language, size: 16, color: Color(0xFFF59E0B)),
              label: Text(_isArabic ? 'FR' : 'عربي', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
              onPressed: () => setState(() => _isArabic = !_isArabic),
            ),
            // WASSLANI Wallet Pill
            InkWell(
              onTap: () => setState(() => _currentTabIndex = 1),
              child: Container(
                margin: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFF2563EB).withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFF2563EB).withValues(alpha: 0.4)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.account_balance_wallet, size: 15, color: Color(0xFF2563EB)),
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
        body: Column(
          children: [
            _buildOfflineStatusBanner(),
            Expanded(
              child: IndexedStack(
                index: _currentTabIndex,
                children: [
                  _buildBookingTab(),
                  _buildWalletTab(),
                  _buildRegulatoryTab(),
                ],
              ),
            ),
          ],
        ),
        bottomNavigationBar: BottomNavigationBar(
          currentIndex: _currentTabIndex,
          backgroundColor: const Color(0xFF0F172A),
          selectedItemColor: const Color(0xFF2563EB),
          unselectedItemColor: Colors.white54,
          onTap: (idx) => setState(() => _currentTabIndex = idx),
          items: [
            BottomNavigationBarItem(
              icon: const Icon(Icons.local_taxi),
              label: _isArabic ? 'طلب سيارة' : 'Commander',
            ),
            BottomNavigationBarItem(
              icon: const Icon(Icons.wallet),
              label: _isArabic ? 'المحفظة والرحلات' : 'Portefeuille & Courses',
            ),
            BottomNavigationBarItem(
              icon: const Icon(Icons.verified_user),
              label: _isArabic ? 'التشريعات' : 'Réglementation',
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOfflineStatusBanner() {
    if (_offlineQueue.isOnline && _offlineQueue.pendingCount == 0) {
      return const SizedBox.shrink();
    }
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B), // Midnight Slate (strictly ZERO GREEN)
        border: Border(
          bottom: BorderSide(
            color: const Color(0xFFF59E0B).withValues(alpha: 0.4),
          ),
        ),
      ),
      child: Row(
        children: [
          Icon(
            _offlineQueue.isOnline ? Icons.sync : Icons.cloud_off,
            size: 16,
            color: const Color(0xFFF59E0B),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              !_offlineQueue.isOnline
                  ? (_isArabic
                      ? 'وضع عدم الاتصال نشط (نفق أو مرآب) • العمليات محفوظة محلياً'
                      : 'Mode Hors-Ligne (Tunnels / Sous-sol) • Données sécurisées localement')
                  : (_isArabic
                      ? '${_offlineQueue.pendingCount} معاملة في انتظار المزامنة مع السحابة'
                      : '${_offlineQueue.pendingCount} transaction(s) en attente de synchronisation cloud'),
              style: const TextStyle(fontSize: 11, color: Colors.white, fontWeight: FontWeight.w600),
            ),
          ),
          if (!_offlineQueue.isOnline)
            TextButton(
              style: TextButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                minimumSize: Size.zero,
                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
              ),
              onPressed: () async {
                await _offlineQueue.setOnlineStatus(true);
              },
              child: Text(
                _isArabic ? 'إعادة الاتصال' : 'Reconnecter',
                style: const TextStyle(color: Color(0xFF60A5FA), fontSize: 11, fontWeight: FontWeight.bold),
              ),
            )
          else
            TextButton(
              style: TextButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                minimumSize: Size.zero,
                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
              ),
              onPressed: () async {
                await _offlineQueue.flushQueue();
              },
              child: Text(
                _isArabic ? 'مزامنة الآن' : 'Synchroniser',
                style: const TextStyle(color: Color(0xFF60A5FA), fontSize: 11, fontWeight: FontWeight.bold),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildBookingTab() {
    if (_currentRide is RideDriverAssigned) {
      final assigned = _currentRide as RideDriverAssigned;
      return SingleChildScrollView(
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
                          _isArabic
                              ? 'السائق في الطريق (${assigned.etaMinutes} دقيقة)'
                              : 'Chauffeur en route (${assigned.etaMinutes} min)',
                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF60A5FA)),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(color: Colors.amber.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(6)),
                        child: Text(
                          _isArabic ? 'مرسوم 12-230' : 'DÉCRET 12-230',
                          style: const TextStyle(fontSize: 10, color: Colors.amber, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(assigned.driverName, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  Text(
                    _isArabic
                        ? '${assigned.vehiclePlate} • رخصة ${assigned.agrementNumber}'
                        : '${assigned.vehiclePlate} • Agrément ${assigned.agrementNumber}',
                    style: const TextStyle(color: Colors.white70, fontSize: 13),
                  ),
                  const Divider(height: 24, color: Colors.white10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Flexible(
                        child: Text(
                          _isArabic ? 'رمز التحقق عند الركوب:' : 'Code PIN d\'embarquement:',
                          style: const TextStyle(fontSize: 14),
                        ),
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
                          label: Text(_isArabic ? 'محادثة' : 'Chat', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                          onPressed: () => _showChatDialog(assigned.driverName, assigned.vehiclePlate),
                        ),
                      ),
                      const SizedBox(width: 6),
                      Expanded(
                        child: OutlinedButton.icon(
                          style: OutlinedButton.styleFrom(
                            foregroundColor: const Color(0xFFF59E0B),
                            side: const BorderSide(color: Color(0xFFF59E0B)),
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          icon: const Icon(Icons.receipt_long, size: 16),
                          label: Text(_isArabic ? 'وصل DTW' : 'Quittance', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                          onPressed: () => _showOfficialReceiptDialog(assigned),
                        ),
                      ),
                      const SizedBox(width: 6),
                      Expanded(
                        child: OutlinedButton.icon(
                          style: OutlinedButton.styleFrom(
                            foregroundColor: const Color(0xFF0EA5E9),
                            side: const BorderSide(color: Color(0xFF0EA5E9)),
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          icon: const Icon(Icons.share, size: 16),
                          label: Text(_isArabic ? 'مشاركة' : 'Partager', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                          onPressed: () => _showShareTripDialog(assigned.rideCode),
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
                      label: Text(
                        _isArabic ? 'طوارئ 1548 الأمن الوطني' : 'SOS 1548 Sûreté Nationale (Urgence)',
                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
                      ),
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            backgroundColor: Colors.redAccent,
                            content: Text(
                              _isArabic
                                  ? 'تم إرسال إنذار الطوارئ 1548 للأمن الوطني مع تحديد الموقع بدقة.'
                                  : 'Alerte SOS 1548 transmise à la Sûreté Nationale avec géolocalisation active.',
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF131D31),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white10),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          _isArabic ? 'إرشادات المسار (ولاية الجزائر):' : 'Itinéraire & Manœuvres (Wilaya d\'Alger):',
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0EA5E9)),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '${_currentDistanceKm.toStringAsFixed(1)} km',
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white70),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  ...GeoRoutingService.generateRouteManeuvers(_origin, _destination).map((maneuver) {
                    IconData icon = Icons.straight;
                    switch (maneuver.maneuverType) {
                      case ManeuverType.turnRight:
                      case ManeuverType.slightRight:
                        icon = Icons.turn_right;
                        break;
                      case ManeuverType.turnLeft:
                      case ManeuverType.slightLeft:
                        icon = Icons.turn_left;
                        break;
                      case ManeuverType.roundabout:
                        icon = Icons.rotate_right;
                        break;
                      case ManeuverType.highwayExit:
                        icon = Icons.ramp_right;
                        break;
                      case ManeuverType.destinationArrival:
                        icon = Icons.flag;
                        break;
                      default:
                        icon = Icons.straight;
                    }
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Row(
                        children: [
                          Icon(icon, size: 16, color: const Color(0xFFF59E0B)),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              maneuver.localizedInstruction(_isArabic),
                              style: const TextStyle(fontSize: 12, color: Colors.white),
                            ),
                          ),
                          Text(
                            '${maneuver.distanceMeters} m',
                            style: const TextStyle(fontSize: 10, color: Colors.white38, fontFamily: 'monospace'),
                          ),
                        ],
                      ),
                    );
                  }),
                ],
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2563EB),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                icon: const Icon(Icons.check_circle_outline, size: 18),
                label: Text(
                  _isArabic ? 'الوصول إلى الوجهة وتقييم الرحلة' : 'Arrivée à Destination & Évaluer',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                onPressed: () => _showRatingReviewDialog(assigned),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.redAccent,
                  side: const BorderSide(color: Colors.redAccent),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: _cancelRide,
                child: Text(_isArabic ? 'إلغاء الرحلة' : 'Annuler la Course'),
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
          // Favorite Destinations Quick Chips
          Text(
            _isArabic ? 'وجهات مفضلة سريعة:' : 'Destinations favorites rapides:',
            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.white70),
          ),
          const SizedBox(height: 8),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                {'hubId': 'aeroport', 'fr': 'Aéroport T4', 'ar': 'مطار ت4', 'icon': Icons.flight},
                {'hubId': 'grande-poste', 'fr': 'Alger Centre', 'ar': 'البريد المركزي', 'icon': Icons.account_balance},
                {'hubId': 'kouba', 'fr': 'Kouba', 'ar': 'القبة', 'icon': Icons.home},
                {'hubId': 'bab-ezzouar', 'fr': 'USTHB', 'ar': 'جامعة بومدين', 'icon': Icons.school},
                {'hubId': 'hydra', 'fr': 'Hydra Ambassades', 'ar': 'حيدرة السفارات', 'icon': Icons.location_city},
              ].map((fav) {
                final hub = GeoRoutingService.findHubById(fav['hubId'] as String);
                final isSelected = _destination.id == hub.id;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ActionChip(
                    avatar: Icon(fav['icon'] as IconData, size: 14, color: isSelected ? Colors.white : const Color(0xFFF59E0B)),
                    backgroundColor: isSelected ? const Color(0xFF2563EB) : const Color(0xFF131D31),
                    side: BorderSide(color: isSelected ? const Color(0xFF2563EB) : Colors.white10),
                    label: Text(
                      _isArabic ? (fav['ar'] as String) : (fav['fr'] as String),
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: isSelected ? Colors.white : Colors.white70,
                      ),
                    ),
                    onPressed: () {
                      setState(() {
                        _destination = hub;
                      });
                    },
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            _isArabic ? 'اختر نمط النقل المعتمد:' : 'Sélectionnez votre mode de transport réglementé:',
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),

          // Mode 1: Taxi Individuel
          _buildModeCard(
            mode: ServiceMode.taxiIndividuel,
            title: _isArabic ? 'تاكسي فردي (عداد رسمي)' : 'Taxi Individuel (Compteur)',
            subtitle: _isArabic
                ? 'عداد كيلومتري قانوني + 100 دج رسم اقتراب الزامي'
                : 'Compteur fiscal horokilométrique + 100 DA approche obligatoire',
            icon: Icons.local_taxi,
            badge: _isArabic ? '+100 دج اقتراب' : '+100 DA Approche',
          ),
          const SizedBox(height: 12),

          // Mode 2: Taxi Collectif Urbain
          _buildModeCard(
            mode: ServiceMode.taxiCollectifUrbain,
            title: _isArabic ? 'تاكسي جماعي حضري (خط منتظم)' : 'Taxi Collectif Urbain (Ligne)',
            subtitle: _isArabic
                ? 'تسعيرة محددة 50 دج للمقعد (4 مقاعد كحد أقصى)'
                : 'Tarif fixe 50 DA la place. Ligne urbaine partagée (4 places max)',
            icon: Icons.groups,
            badge: _isArabic ? '50 دج / مقعد' : '50 DA / Place',
          ),
          const SizedBox(height: 12),

          // Mode 3: Inter-Wilaya
          _buildModeCard(
            mode: ServiceMode.taxiInterWilaya,
            title: _isArabic ? 'تاكسي ما بين الولايات (محطة الخروبة)' : 'Taxi Inter-Wilaya (Gare Caroubier)',
            subtitle: _isArabic
                ? 'رحلات جهوية مباشرة من المحطة المركزية بالخروبة'
                : 'Liaisons régionales depuis la gare routière du Caroubier',
            icon: Icons.alt_route,
            badge: _isArabic ? 'محطة الخروبة' : 'Gare Routière',
          ),
          const SizedBox(height: 24),

          // Origin and Destination Card with Dynamic Routing
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF131D31),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white10),
            ),
            child: Column(
              children: [
                InkWell(
                  onTap: () => _showLocationPicker(isOrigin: true),
                  borderRadius: BorderRadius.circular(8),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 4),
                    child: Row(
                      children: [
                        const Icon(Icons.my_location, size: 20, color: Color(0xFF0EA5E9)),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _origin.localizedName(_isArabic),
                                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                              ),
                              Text(
                                _origin.commune,
                                style: const TextStyle(fontSize: 11, color: Colors.white54),
                              ),
                            ],
                          ),
                        ),
                        const Icon(Icons.keyboard_arrow_down, size: 18, color: Colors.white54),
                      ],
                    ),
                  ),
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 8),
                  child: Divider(color: Colors.white10),
                ),
                InkWell(
                  onTap: () => _showLocationPicker(isOrigin: false),
                  borderRadius: BorderRadius.circular(8),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 4),
                    child: Row(
                      children: [
                        const Icon(Icons.location_on, size: 20, color: Color(0xFFF59E0B)),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _destination.localizedName(_isArabic),
                                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                              ),
                              Text(
                                _destination.commune,
                                style: const TextStyle(fontSize: 11, color: Colors.white54),
                              ),
                            ],
                          ),
                        ),
                        const Icon(Icons.keyboard_arrow_down, size: 18, color: Colors.white54),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Dynamic Route Estimation Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.black26,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF2563EB).withValues(alpha: 0.2)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.route, size: 16, color: Color(0xFF0EA5E9)),
                    const SizedBox(width: 6),
                    Text(
                      '${_currentDistanceKm.toStringAsFixed(1)} km',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                    const SizedBox(width: 12),
                    const Icon(Icons.schedule, size: 16, color: Color(0xFFF59E0B)),
                    const SizedBox(width: 6),
                    Text(
                      '$_currentDurationMin min',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFF2563EB).withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    '${_currentEstimatedFareDzd.toStringAsFixed(0)} DA',
                    style: const TextStyle(color: Color(0xFF60A5FA), fontWeight: FontWeight.bold, fontSize: 13),
                  ),
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
              child: Text(
                _isArabic
                    ? 'طلب سيارة أجرة معتمدة (${_currentEstimatedFareDzd.toStringAsFixed(0)} دج)'
                    : 'Commander un Taxi Certifié',
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
              ),
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
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      _isArabic ? 'محفظة وصلني الرقمية' : 'PORTEFEUILLE WASSLANI',
                      style: const TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.5),
                    ),
                    Row(
                      children: [
                        IconButton(
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                          icon: _isSyncingBalance
                              ? const SizedBox(
                                  width: 14,
                                  height: 14,
                                  child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white70),
                                )
                              : const Icon(Icons.sync, color: Colors.white70, size: 18),
                          tooltip: _isArabic ? 'تحديث الرصيد' : 'Actualiser le solde',
                          onPressed: _isSyncingBalance ? null : _loadSupabaseBalances,
                        ),
                        const SizedBox(width: 8),
                        const Icon(Icons.shield, color: Colors.white70, size: 18),
                      ],
                    ),
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
                        _isArabic
                            ? 'باقي الصرف المجمع: +${_accumulatedSpareChangeDzd.toStringAsFixed(0)} دج'
                            : 'Flywheel Monnaie: +${_accumulatedSpareChangeDzd.toStringAsFixed(0)} DA',
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
              label: Text(
                _isArabic ? 'شحن عبر الذهبية / CIB (شارجيلي)' : 'Recharger via CIB / Edahabia (Chargily)',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              onPressed: _showTopupDialog,
            ),
          ),
          const SizedBox(height: 28),

          // Trip History Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  _isArabic ? 'سجل الرحلات الرسمية المنجزة:' : 'Historique des Courses Fiscale DTW:',
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                '${_tripHistory.length} ${_isArabic ? "رحلات" : "trajets"}',
                style: const TextStyle(fontSize: 12, color: Colors.white54),
              ),
            ],
          ),
          const SizedBox(height: 12),

          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _tripHistory.length,
            separatorBuilder: (_, __) => const SizedBox(height: 10),
            itemBuilder: (ctx, idx) {
              final item = _tripHistory[idx];
              return Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFF131D31),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: Colors.white10),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            '${item.origin.localizedName(_isArabic)} → ${item.destination.localizedName(_isArabic)}',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          '${item.fareDzd.toStringAsFixed(0)} DA',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF60A5FA)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            '${item.driverName} • ${item.distanceKm.toStringAsFixed(1)} km',
                            style: const TextStyle(color: Colors.white54, fontSize: 11),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        if (item.spareChangeDzd > 0)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF59E0B).withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              '+${item.spareChangeDzd.toStringAsFixed(0)} DA Flywheel',
                              style: const TextStyle(color: Color(0xFFF59E0B), fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Align(
                      alignment: _isArabic ? Alignment.centerLeft : Alignment.centerRight,
                      child: TextButton.icon(
                        style: TextButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          foregroundColor: const Color(0xFFF59E0B),
                        ),
                        icon: const Icon(Icons.receipt_long, size: 14),
                        label: Text(
                          _isArabic ? 'عرض وصل DTW' : 'Voir Quittance DTW',
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                        onPressed: () => _showTripReceiptDialog(
                          driverName: item.driverName,
                          agrementNumber: item.agrementNumber,
                          vehiclePlate: item.vehiclePlate,
                          fareDzd: item.fareDzd,
                          distanceKm: item.distanceKm,
                          originName: item.origin.localizedName(_isArabic),
                          destinationName: item.destination.localizedName(_isArabic),
                          spareChangeDzd: item.spareChangeDzd,
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
          const SizedBox(height: 24),

          Text(
            _isArabic ? 'مبدأ تحويل باقي الصرف الرقمي (Flywheel):' : 'Principe du Spare Change Flywheel:',
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF131D31),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white10),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _isArabic
                      ? 'عند دفع ثمن الرحلة نقدًا (مثال ورقة 1000 دج لأجرة قدرها 850 دج)، يقوم السائق بتحويل الباقي (150 دج) مباشرة إلى محفظتك بنقرة واحدة.'
                      : 'Lorsque vous réglez une course en espèces (ex. billet de 1000 DA pour 850 DA de course), le chauffeur crédite vos 150 DA de reliquat directement sur votre compte TrustDesk via son application en un clic.',
                  style: const TextStyle(fontSize: 13, height: 1.5, color: Colors.white70),
                ),
                const SizedBox(height: 12),
                Text(
                  _isArabic
                      ? 'يتراكم رصيدك تلقائيًا دون عناء الصرف ويمكنك استعماله في رحلاتك القادمة بكل سهولة.'
                      : 'Ce solde s\'accumule sans friction et peut être utilisé pour de futures courses ou transféré.',
                  style: const TextStyle(fontSize: 13, height: 1.5, color: Colors.white70),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRegulatoryTab() {
    return RegulatoryTab(isArabic: _isArabic);
  }
}
