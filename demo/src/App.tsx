import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import type { ActiveTab, AppLang } from './components/Header';
import { RiderView } from './components/RiderView';
import { DriverCockpit } from './components/DriverCockpit';
import { DispatchView } from './components/DispatchView';
import { LedgerView } from './components/LedgerView';
import { InteractiveMap } from './components/InteractiveMap';
import { SpareChangeModal } from './components/SpareChangeModal';
import type { 
  DriverProfile, 
  RideRequest, 
  LocationPoint, 
  ServiceMode, 
  PaymentMethod, 
  DashcamIncident, 
  LedgerEntry, 
  WalletBalances 
} from './types';
import { 
  INITIAL_DRIVER, 
  INITIAL_WALLETS, 
  INITIAL_LEDGER, 
  ALGIERS_LOCATIONS 
} from './data/mockData';
import { soundEngine } from './utils/audio';
import { 
  syncLiveWallets, 
  persistLedgerEntry, 
  persistIncident,
  initFleetRealtime,
  broadcastFleetEvent
} from './utils/supabase';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('sync');
  const [lang, setLang] = useState<AppLang>('fr');

  // Master Reactive State
  const [driver, setDriver] = useState<DriverProfile>(INITIAL_DRIVER);
  const [currentRide, setCurrentRide] = useState<RideRequest | null>(null);
  const [wallets, setWallets] = useState<WalletBalances>(INITIAL_WALLETS);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(INITIAL_LEDGER);
  const [incidents, setIncidents] = useState<DashcamIncident[]>([]);
  const [isSpareChangeModalOpen, setIsSpareChangeModalOpen] = useState(false);

  // Active Origin & Destination (Default: Kouba to Grande Poste)
  const [origin, setOrigin] = useState<LocationPoint>(ALGIERS_LOCATIONS[2]);
  const [destination, setDestination] = useState<LocationPoint>(ALGIERS_LOCATIONS[0]);

  // Synchronize live GL balances from dedicated Supabase project & Realtime Fleet
  useEffect(() => {
    syncLiveWallets(INITIAL_WALLETS).then(live => {
      setWallets(live);
    });

    const unsubscribe = initFleetRealtime((msg) => {
      switch (msg.type) {
        case 'DRIVER_LOCATION':
          setDriver(prev => ({
            ...prev,
            currentLat: msg.payload.lat,
            currentLng: msg.payload.lng,
            heading: msg.payload.heading,
            speedKmh: msg.payload.speedKmh,
          }));
          break;
        case 'RIDE_REQUEST':
          setCurrentRide(msg.payload);
          soundEngine.playDispatchPing();
          break;
        case 'RIDE_STATUS_CHANGE':
          setCurrentRide(prev => prev ? {
            ...prev,
            status: msg.payload.status as any,
            ...(msg.payload.meterAmount ? { meterFinalDzd: msg.payload.meterAmount } : {})
          } : null);
          break;
        case 'SPARE_CHANGE_SYNC':
          soundEngine.playCashRegisterDing();
          break;
        case 'INCIDENT_ALERT':
          setIncidents(prev => [msg.payload, ...prev]);
          soundEngine.playCrashSonar();
          break;
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);


  // Handle Driver Movement Animation during Active Ride
  useEffect(() => {
    if (!currentRide || currentRide.status === 'idle') return;

    const interval = setInterval(() => {
      setDriver(prev => {
        let targetLat = origin.lat;
        let targetLng = origin.lng;

        if (currentRide.status === 'in_progress') {
          targetLat = destination.lat;
          targetLng = destination.lng;
        } else if (currentRide.status !== 'driver_assigned') {
          return prev;
        }

        const deltaLat = (targetLat - prev.currentLat) * 0.15;
        const deltaLng = (targetLng - prev.currentLng) * 0.15;

        // Calculate heading in degrees
        const headingDeg = Math.round((Math.atan2(deltaLng, deltaLat) * 180) / Math.PI);
        const newLat = prev.currentLat + deltaLat;
        const newLng = prev.currentLng + deltaLng;
        const newSpeed = Math.floor(35 + Math.random() * 25);
        const newHeading = (headingDeg + 360) % 360;

        broadcastFleetEvent({
          type: 'DRIVER_LOCATION',
          payload: {
            lat: newLat,
            lng: newLng,
            heading: newHeading,
            speedKmh: newSpeed,
          }
        });

        return {
          ...prev,
          currentLat: newLat,
          currentLng: newLng,
          heading: newHeading,
          speedKmh: newSpeed,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentRide, origin, destination]);

  // Request Ride Handler
  const handleRequestRide = (
    mode: ServiceMode,
    newOrigin: LocationPoint,
    newDest: LocationPoint,
    paymentMethod: PaymentMethod
  ) => {
    setOrigin(newOrigin);
    setDestination(newDest);

    const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();
    const newRide: RideRequest = {
      id: `DZ-RIDE-${Date.now().toString().slice(-5)}`,
      rideCode: `DZ-${Math.floor(10000 + Math.random() * 90000)}`,
      serviceMode: mode,
      origin: newOrigin,
      destination: newDest,
      status: 'requesting',
      pickupPin: generatedPin,
      seatsBooked: 1,
      totalSeats: mode === 'taxi_individuel_metered' ? 4 : 1,
      estimatedDistanceKm: 8.4,
      estimatedDurationMins: 18,
      fraisApprocheDzd: 100.00,
      meterFinalDzd: 750.00,
      totalFareDzd: 850.00,
      paymentMethod,
      createdAt: new Date().toISOString(),
    };

    setCurrentRide(newRide);
    broadcastFleetEvent({ type: 'RIDE_REQUEST', payload: newRide });
  };

  // Driver Accepts Ride
  const handleAcceptRide = () => {
    if (!currentRide) return;
    setCurrentRide(prev => prev ? { ...prev, status: 'driver_assigned' } : null);
    broadcastFleetEvent({ type: 'RIDE_STATUS_CHANGE', payload: { status: 'driver_assigned' } });
  };

  // Driver Arrives at Pickup
  const handleArrivedAtPickup = () => {
    if (!currentRide) return;
    setCurrentRide(prev => prev ? { ...prev, status: 'driver_arrived' } : null);
    broadcastFleetEvent({ type: 'RIDE_STATUS_CHANGE', payload: { status: 'driver_arrived' } });
  };

  // Driver Enters PIN and Starts Trip
  const handleStartTrip = (pin: string): boolean => {
    if (!currentRide) return false;
    if (pin.trim() === currentRide.pickupPin) {
      setCurrentRide(prev => prev ? { ...prev, status: 'in_progress' } : null);
      broadcastFleetEvent({ type: 'RIDE_STATUS_CHANGE', payload: { status: 'in_progress' } });
      return true;
    }
    return false;
  };

  // Driver Arrives at Destination
  const handleArrivedDestination = () => {
    if (!currentRide) return;
    setCurrentRide(prev => prev ? { ...prev, status: 'fare_entry' } : null);
    broadcastFleetEvent({ type: 'RIDE_STATUS_CHANGE', payload: { status: 'fare_entry' } });
  };

  // Driver Submits Taximeter Fare
  const handleCompleteTrip = (meterAmount: number) => {
    if (!currentRide) return;
    const finalFare = meterAmount + currentRide.fraisApprocheDzd;
    setCurrentRide(prev => prev ? { 
      ...prev, 
      meterFinalDzd: meterAmount, 
      totalFareDzd: finalFare,
      status: 'spare_change_prompt'
    } : null);
    broadcastFleetEvent({ 
      type: 'RIDE_STATUS_CHANGE', 
      payload: { status: 'spare_change_prompt', meterAmount } 
    });
  };


  // Execute Spare Change Credit Flywheel
  const handleCreditSpareChange = (changeAmount: number, tenderedAmount: number) => {
    if (!currentRide) return;
    soundEngine.playCashRegisterDing();

    const commissionDzd = 100.00; // CNRC 604103 regulated fee
    const timestampStr = new Date().toISOString().replace('T', ' ').slice(0, 19);

    // 1. Update Double-Entry Wallets Atomically
    setWallets(prev => ({
      ...prev,
      cashInTransit_1010: prev.cashInTransit_1010 + tenderedAmount,
      driverOperational_2020: prev.driverOperational_2020 - changeAmount - commissionDzd,
      riderTrustDesk_2010: prev.riderTrustDesk_2010 + changeAmount,
      platformRevenue_4010: prev.platformRevenue_4010 + commissionDzd,
    }));

    // Update Driver Operational Wallet locally
    setDriver(prev => ({
      ...prev,
      walletBalanceDzd: prev.walletBalanceDzd - changeAmount - commissionDzd,
      totalTrips: prev.totalTrips + 1,
    }));

    // 2. Append Immutable Journal Entries
    const newEntries: LedgerEntry[] = [
      {
        id: `LEDG-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: timestampStr,
        entryType: 'spare_change_credit',
        debitAccount: '2020 (Compte Opérationnel Chauffeur)',
        creditAccount: '2010 (Portefeuille Passager TrustDesk)',
        amountDzd: changeAmount,
        description: `Reliquat de monnaie physique crédité sur compte TrustDesk (Course ${currentRide.rideCode})`,
      },
      {
        id: `LEDG-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: timestampStr,
        entryType: 'commission_debit',
        debitAccount: '2020 (Compte Opérationnel Chauffeur)',
        creditAccount: '4010 (Revenus Plateforme)',
        amountDzd: commissionDzd,
        description: `Frais d'approche réglementés prélevés selon CNRC 604103 (Course ${currentRide.rideCode})`,
      },
      {
        id: `LEDG-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: timestampStr,
        entryType: 'fare_settlement',
        debitAccount: '1010 (Espèces Chauffeurs)',
        creditAccount: '2020 (Compte Opérationnel Chauffeur)',
        amountDzd: currentRide.meterFinalDzd,
        description: `Encaissement espèces du tarif compteur fiscal (Course ${currentRide.rideCode})`,
      },
    ];

    setLedgerEntries(prev => [...newEntries, ...prev]);
    newEntries.forEach(entry => persistLedgerEntry(entry));

    // 3. Mark Ride Completed
    setCurrentRide(prev => prev ? {
      ...prev,
      status: 'completed',
      tenderedCashDzd: tenderedAmount,
      spareChangeCreditedDzd: changeAmount,
    } : null);

    broadcastFleetEvent({
      type: 'SPARE_CHANGE_SYNC',
      payload: { changeAmount, tenderedAmount },
    });
    broadcastFleetEvent({
      type: 'RIDE_STATUS_CHANGE',
      payload: { status: 'completed' },
    });
  };

  // Top-Up Driver Wallet via Chargily Pay Simulator
  const handleTopupDriverWallet = (amountDzd: number) => {
    const timestampStr = new Date().toISOString().replace('T', ' ').slice(0, 19);

    setWallets(prev => ({
      ...prev,
      digitalEscrow_1020: prev.digitalEscrow_1020 + amountDzd,
      driverOperational_2020: prev.driverOperational_2020 + amountDzd,
    }));

    setDriver(prev => ({
      ...prev,
      walletBalanceDzd: prev.walletBalanceDzd + amountDzd,
    }));

    const topupEntry: LedgerEntry = {
      id: `TOPUP-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: timestampStr,
      entryType: 'wallet_topup',
      debitAccount: '1020 (Escrow Chargily)',
      creditAccount: '2020 (Compte Opérationnel Chauffeur)',
      amountDzd,
      description: `Recharge solde chauffeur par carte CIB / Edahabia (SATIM 3DS)`,
    };

    setLedgerEntries(prev => [topupEntry, ...prev]);
    persistLedgerEntry(topupEntry);
  };

  // Top-Up Rider Wallet via Chargily Pay Simulator
  const handleTopupRiderWallet = (amountDzd: number) => {
    const timestampStr = new Date().toISOString().replace('T', ' ').slice(0, 19);

    setWallets(prev => ({
      ...prev,
      digitalEscrow_1020: prev.digitalEscrow_1020 + amountDzd,
      riderTrustDesk_2010: prev.riderTrustDesk_2010 + amountDzd,
    }));

    const topupEntry: LedgerEntry = {
      id: `TOPUP-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: timestampStr,
      entryType: 'wallet_topup',
      debitAccount: '1020 (Escrow Chargily)',
      creditAccount: '2010 (Portefeuille Passager TrustDesk)',
      amountDzd,
      description: `Recharge portefeuille passager TrustDesk par carte CIB / Edahabia (SATIM 3DS)`,
    };

    setLedgerEntries(prev => [topupEntry, ...prev]);
    persistLedgerEntry(topupEntry);
  };

  // Incident Trigger Handler
  const handleIncidentTriggered = (incident: DashcamIncident) => {
    setIncidents(prev => [incident, ...prev]);
    persistIncident(incident);
    broadcastFleetEvent({
      type: 'INCIDENT_ALERT',
      payload: incident,
    });
  };


  // Reset Demo to Initial State
  const handleResetDemo = () => {
    setDriver(INITIAL_DRIVER);
    setCurrentRide(null);
    setWallets(INITIAL_WALLETS);
    setLedgerEntries(INITIAL_LEDGER);
    setIncidents([]);
    setIsSpareChangeModalOpen(false);
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        onReset={handleResetDemo}
      />

      {/* Main Content Arena */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        
        {/* VIEW 1: MULTI-DEVICE SYNC VIEW */}
        {activeTab === 'sync' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Driver Cockpit (5 cols) */}
            <div className="lg:col-span-5">
              <div className="flex items-center space-x-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-xs font-mono font-bold tracking-wider text-amber-300 uppercase">
                  Tablette Chauffeur (Cockpit HUD)
                </span>
              </div>
              <DriverCockpit
                driver={driver}
                currentRide={currentRide}
                onToggleOnline={() => setDriver(prev => ({ ...prev, isOnline: !prev.isOnline }))}
                onAcceptRide={handleAcceptRide}
                onArrivedAtPickup={handleArrivedAtPickup}
                onStartTrip={handleStartTrip}
                onArrivedDestination={handleArrivedDestination}
                onCompleteTrip={handleCompleteTrip}
                onIncidentTriggered={handleIncidentTriggered}
                onTopupDriverWallet={handleTopupDriverWallet}
                onOpenSpareChangeModal={() => setIsSpareChangeModalOpen(true)}
              />
            </div>

            {/* Center / Right: Interactive Map & Live Passenger App (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Center Map (7 cols) */}
              <div className="md:col-span-7 flex flex-col h-[740px]">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span className="text-xs font-mono font-bold tracking-wider text-emerald-300 uppercase">
                    Cartographie & Télématique Alger (H3 Res 8)
                  </span>
                </div>
                <div className="flex-1 glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                  <InteractiveMap
                    origin={origin}
                    destination={destination}
                    driverLat={driver.currentLat}
                    driverLng={driver.currentLng}
                    driverHeading={driver.heading}
                    rideStatus={currentRide?.status || 'idle'}
                  />
                </div>
              </div>

              {/* Right: Rider Smartphone (5 cols) */}
              <div className="md:col-span-5">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                  <span className="text-xs font-mono font-bold tracking-wider text-sky-300 uppercase">
                    Smartphone Passager
                  </span>
                </div>
                <RiderView
                  currentRide={currentRide}
                  driver={driver}
                  riderWalletBalanceDzd={wallets.riderTrustDesk_2010}
                  onRequestRide={handleRequestRide}
                  onCancelRide={() => setCurrentRide(null)}
                  onTopupRiderWallet={handleTopupRiderWallet}
                  lang={lang}
                />
              </div>

            </div>

          </div>
        )}

        {/* VIEW 2: DRIVER COCKPIT FULL VIEW */}
        {activeTab === 'driver' && (
          <div className="py-4">
            <DriverCockpit
              driver={driver}
              currentRide={currentRide}
              onToggleOnline={() => setDriver(prev => ({ ...prev, isOnline: !prev.isOnline }))}
              onAcceptRide={handleAcceptRide}
              onArrivedAtPickup={handleArrivedAtPickup}
              onStartTrip={handleStartTrip}
              onArrivedDestination={handleArrivedDestination}
              onCompleteTrip={handleCompleteTrip}
              onIncidentTriggered={handleIncidentTriggered}
              onTopupDriverWallet={handleTopupDriverWallet}
              onOpenSpareChangeModal={() => setIsSpareChangeModalOpen(true)}
            />
          </div>
        )}

        {/* VIEW 3: RIDER SMARTPHONE FULL VIEW */}
        {activeTab === 'rider' && (
          <div className="py-4 flex justify-center">
            <RiderView
              currentRide={currentRide}
              driver={driver}
              riderWalletBalanceDzd={wallets.riderTrustDesk_2010}
              onRequestRide={handleRequestRide}
              onCancelRide={() => setCurrentRide(null)}
              onTopupRiderWallet={handleTopupRiderWallet}
              lang={lang}
            />
          </div>
        )}

        {/* VIEW 4: FLEET DISPATCH & COMPLIANCE CONTROL ROOM */}
        {activeTab === 'dispatch' && (
          <div className="py-4 space-y-6">
            <DispatchView
              incidents={incidents}
              driver={driver}
              currentRide={currentRide}
            />
            
            {/* Interactive Algiers Fleet Map with H3 Hexes */}
            <div className="h-[480px] glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <InteractiveMap
                origin={origin}
                destination={destination}
                driverLat={driver.currentLat}
                driverLng={driver.currentLng}
                driverHeading={driver.heading}
                rideStatus={currentRide?.status || 'idle'}
                showH3Hexes={true}
              />
            </div>
          </div>
        )}

        {/* VIEW 5: DOUBLE-ENTRY LEDGER & TRUSTDESK */}
        {activeTab === 'ledger' && (
          <div className="py-4">
            <LedgerView
              wallets={wallets}
              ledgerEntries={ledgerEntries}
            />
          </div>
        )}

      </main>

      {/* Spare Change Flywheel Modal */}
      <SpareChangeModal
        isOpen={isSpareChangeModalOpen}
        onClose={() => setIsSpareChangeModalOpen(false)}
        fareTotalDzd={currentRide?.totalFareDzd || 850}
        driverBalanceDzd={driver.walletBalanceDzd}
        riderCurrentBalanceDzd={wallets.riderTrustDesk_2010}
        onCreditSpareChange={handleCreditSpareChange}
      />

    </div>
  );
}

export default App;
