import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation2, 
  ShieldCheck, 
  Star, 
  Car, 
  Users, 
  Compass, 
  CreditCard, 
  Wallet, 
  Banknote, 
  Clock,
  PlusCircle,
  Copy,
  Check
} from 'lucide-react';
import type { 
  LocationPoint, 
  ServiceMode, 
  PaymentMethod, 
  RideRequest, 
  DriverProfile 
} from '../types';
import { ALGIERS_LOCATIONS } from '../data/mockData';
import { ChargilyTopupModal } from './ChargilyTopupModal';
import { soundEngine } from '../utils/audio';

interface RiderViewProps {
  currentRide: RideRequest | null;
  driver: DriverProfile;
  riderWalletBalanceDzd: number;
  onRequestRide: (mode: ServiceMode, origin: LocationPoint, dest: LocationPoint, payment: PaymentMethod) => void;
  onCancelRide: () => void;
  onTopupRiderWallet?: (amountDzd: number) => void;
  lang: 'fr' | 'ar' | 'en';
}

export const RiderView: React.FC<RiderViewProps> = ({
  currentRide,
  driver,
  riderWalletBalanceDzd,
  onRequestRide,
  onCancelRide,
  onTopupRiderWallet,
}) => {
  const [selectedMode, setSelectedMode] = useState<ServiceMode>('taxi_individuel_metered');
  const [origin, setOrigin] = useState<LocationPoint>(ALGIERS_LOCATIONS[2]); // Kouba
  const [destination, setDestination] = useState<LocationPoint>(ALGIERS_LOCATIONS[0]); // Grande Poste
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [selectedSeat, setSelectedSeat] = useState<number>(2);
  const [interWilayaLine, setInterWilayaLine] = useState('09_BLIDA');
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);

  const estimatedFare = selectedMode === 'taxi_individuel_metered' ? 850 : selectedMode === 'taxi_collectif_urbain' ? 50 : 350;

  const handleCopyPin = (pin: string) => {
    soundEngine.playClick();
    navigator.clipboard?.writeText(pin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  return (
    <div className="max-w-sm mx-auto glass-panel rounded-[38px] overflow-hidden shadow-2xl flex flex-col h-[740px] relative border border-white/10">
      
      {/* Smartphone Status Bar */}
      <div className="bg-slate-950/90 px-6 pt-3 pb-2 flex items-center justify-between text-xs text-slate-400 font-mono select-none border-b border-white/5">
        <span className="font-bold text-white">16:42</span>
        <div className="w-20 h-3.5 bg-black rounded-full mx-auto border border-white/10"></div>
        <div className="flex items-center space-x-1.5 text-[10px]">
          <span className="text-emerald-400 font-bold">4G Mobilis</span>
          <span>100%</span>
        </div>
      </div>

      {/* App Header */}
      <div className="bg-slate-950/80 border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-sm text-white flex items-center space-x-1.5">
            <span>Passager • Alger</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </h2>
          <p className="text-[10px] text-slate-400">Taxis agréés par la DTW Alger</p>
        </div>

        {/* Stored-Value Wallet Badge with Top-up Trigger */}
        <div className="flex items-center space-x-1">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span>{riderWalletBalanceDzd.toFixed(2)} DA</span>
          </div>
          {onTopupRiderWallet && (
            <button
              onClick={() => { soundEngine.playClick(); setIsTopupOpen(true); }}
              title="Recharger solde passager via Chargily Pay"
              className="p-1 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/30 hover:bg-sky-500/30 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* 1. STATE: IDLE (Choose Mode & Route) */}
        {(!currentRide || currentRide.status === 'idle') && (
          <div className="space-y-4">
            
            {/* Service Mode Selector (Décret 12-230) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Mode Réglementé (Décret 12-230)
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => { soundEngine.playSelection(); setSelectedMode('taxi_individuel_metered'); }}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    selectedMode === 'taxi_individuel_metered'
                      ? 'bg-amber-400/15 border-amber-400 shadow-lg shadow-amber-400/15'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <Car className={`w-5 h-5 mb-1 ${selectedMode === 'taxi_individuel_metered' ? 'text-amber-300' : 'text-slate-400'}`} />
                  <div>
                    <div className="font-bold text-xs text-white">Individuel</div>
                    <div className="text-[9px] text-slate-300">Compteur + 100 DA</div>
                  </div>
                </button>

                <button
                  onClick={() => { soundEngine.playSelection(); setSelectedMode('taxi_collectif_urbain'); }}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    selectedMode === 'taxi_collectif_urbain'
                      ? 'bg-amber-400/15 border-amber-400 shadow-lg shadow-amber-400/15'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <Users className={`w-5 h-5 mb-1 ${selectedMode === 'taxi_collectif_urbain' ? 'text-amber-300' : 'text-slate-400'}`} />
                  <div>
                    <div className="font-bold text-xs text-white">Collectif</div>
                    <div className="text-[9px] text-slate-300">Ligne: 50 DA/place</div>
                  </div>
                </button>

                <button
                  onClick={() => { soundEngine.playSelection(); setSelectedMode('taxi_collectif_inter_wilayas'); }}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    selectedMode === 'taxi_collectif_inter_wilayas'
                      ? 'bg-amber-400/15 border-amber-400 shadow-lg shadow-amber-400/15'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <Compass className={`w-5 h-5 mb-1 ${selectedMode === 'taxi_collectif_inter_wilayas' ? 'text-amber-300' : 'text-slate-400'}`} />
                  <div>
                    <div className="font-bold text-xs text-white">Inter-Wilaya</div>
                    <div className="text-[9px] text-slate-300">Gare Routière</div>
                  </div>
                </button>
              </div>
            </div>

            {/* COLLECTIVE SEAT PICKER (Mode 2) */}
            {selectedMode === 'taxi_collectif_urbain' && (
              <div className="bg-slate-950/90 p-3.5 rounded-2xl border border-white/10 space-y-2 animate-in fade-in">
                <label className="text-[10px] text-slate-400 font-bold uppercase block">
                  Sélection du Siège (Ligne Kouba ↔ 1er Mai)
                </label>
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-500 cursor-not-allowed">
                    <div className="font-bold">Place 1</div>
                    <div className="text-[9px] text-slate-600">Occupé</div>
                  </div>
                  <button
                    onClick={() => { soundEngine.playClick(); setSelectedSeat(2); }}
                    className={`p-2 rounded-xl border transition-all ${
                      selectedSeat === 2
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                        : 'bg-slate-900 border-white/10 text-slate-300'
                    }`}
                  >
                    <div>Place 2</div>
                    <div className="text-[9px] text-emerald-400">Choisi</div>
                  </button>
                  <button
                    onClick={() => { soundEngine.playClick(); setSelectedSeat(3); }}
                    className={`p-2 rounded-xl border transition-all ${
                      selectedSeat === 3
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                        : 'bg-slate-900 border-white/10 text-slate-300'
                    }`}
                  >
                    <div>Place 3</div>
                    <div className="text-[9px] text-slate-400">Libre</div>
                  </button>
                  <button
                    onClick={() => { soundEngine.playClick(); setSelectedSeat(4); }}
                    className={`p-2 rounded-xl border transition-all ${
                      selectedSeat === 4
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                        : 'bg-slate-900 border-white/10 text-slate-300'
                    }`}
                  >
                    <div>Place 4</div>
                    <div className="text-[9px] text-slate-400">Libre</div>
                  </button>
                </div>
              </div>
            )}

            {/* INTER-WILAYA ROUTE PICKER (Mode 3) */}
            {selectedMode === 'taxi_collectif_inter_wilayas' && (
              <div className="bg-slate-950/90 p-3.5 rounded-2xl border border-white/10 space-y-2 animate-in fade-in">
                <label className="text-[10px] text-slate-400 font-bold uppercase block">
                  Ligne Réglementée (Gare Routière Caroubier Alger)
                </label>
                <select
                  value={interWilayaLine}
                  onChange={(e) => { soundEngine.playClick(); setInterWilayaLine(e.target.value); }}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
                >
                  <option value="09_BLIDA">Alger (Caroubier) ↔ 09 Blida (Tarif: 250 DA)</option>
                  <option value="15_TIZI">Alger (Caroubier) ↔ 15 Tizi Ouzou (Tarif: 350 DA)</option>
                  <option value="35_BOUMERDES">Alger (Caroubier) ↔ 35 Boumerdes (Tarif: 150 DA)</option>
                  <option value="10_BOUIRA">Alger (Caroubier) ↔ 10 Bouira (Tarif: 400 DA)</option>
                </select>
              </div>
            )}

            {/* Origin & Destination Pickers */}
            <div className="bg-slate-950/90 p-3.5 rounded-2xl border border-white/10 space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center space-x-1 mb-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>Point de Prise en Charge</span>
                </label>
                <select
                  value={origin.id}
                  onChange={(e) => {
                    soundEngine.playClick();
                    const found = ALGIERS_LOCATIONS.find(l => l.id === e.target.value);
                    if (found) setOrigin(found);
                  }}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-amber-400"
                >
                  {ALGIERS_LOCATIONS.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center space-x-1 mb-1">
                  <Navigation2 className="w-3 h-3 text-rose-400" />
                  <span>Destination Finale</span>
                </label>
                <select
                  value={destination.id}
                  onChange={(e) => {
                    soundEngine.playClick();
                    const found = ALGIERS_LOCATIONS.find(l => l.id === e.target.value);
                    if (found) setDestination(found);
                  }}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-amber-400"
                >
                  {ALGIERS_LOCATIONS.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Mode de Paiement
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => { soundEngine.playSelection(); setPaymentMethod('cash'); }}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center space-y-1 transition-all ${
                    paymentMethod === 'cash'
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  <span>Espèces</span>
                </button>

                <button
                  onClick={() => { soundEngine.playSelection(); setPaymentMethod('edahabia'); }}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center space-y-1 transition-all ${
                    paymentMethod === 'edahabia'
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Edahabia/CIB</span>
                </button>

                <button
                  onClick={() => { soundEngine.playSelection(); setPaymentMethod('trustdesk_wallet'); }}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center space-y-1 transition-all ${
                    paymentMethod === 'trustdesk_wallet'
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  <span>TrustDesk</span>
                </button>
              </div>

              {paymentMethod === 'cash' && (
                <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/25 text-[10px] text-amber-300">
                  💡 <strong>Spare Change Flywheel:</strong> Si le chauffeur manque de petite monnaie physique, le reliquat est automatiquement viré sur votre solde TrustDesk.
                </div>
              )}
            </div>

            {/* Estimated Fare Card */}
            <div className="bg-slate-950/90 p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400">Tarif Réglementé Estimé</span>
                <div className="text-xl font-black text-amber-300 font-mono">
                  ~{estimatedFare.toFixed(2)} DZD
                </div>
              </div>
              <div className="text-right text-[10px] text-slate-400">
                <div>Distance: ~8.4 km</div>
                <div>Durée: ~18 mins</div>
              </div>
            </div>

            {/* Request Button */}
            <button
              onClick={() => {
                soundEngine.playSuccessChime();
                onRequestRide(selectedMode, origin, destination, paymentMethod);
              }}
              className="w-full min-h-[56px] rounded-2xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-black text-sm tracking-wide transition-all shadow-xl shadow-amber-400/25 flex items-center justify-center space-x-2"
            >
              <Car className="w-5 h-5 stroke-[2.5]" />
              <span>COMMANDER UN TAXI AGRÉÉ</span>
            </button>
          </div>
        )}

        {/* 2. STATE: ACTIVE RIDE */}
        {currentRide && currentRide.status !== 'idle' && (
          <div className="space-y-4">
            
            {/* Status Banner */}
            <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-center space-y-1">
              <span className="text-[10px] font-bold tracking-widest uppercase text-amber-300 block">
                {currentRide.status === 'requesting' && 'Recherche d\'un taxi dans le secteur H3...'}
                {currentRide.status === 'driver_assigned' && 'Chauffeur Agréé en Route'}
                {currentRide.status === 'driver_arrived' && 'Chauffeur Arrivé au Point de Prise'}
                {currentRide.status === 'in_progress' && 'Course en Cours vers Destination'}
                {currentRide.status === 'completed' && 'Course Terminée • Merci!'}
              </span>
              
              {currentRide.status !== 'completed' && (
                <div className="flex items-center justify-center space-x-2 text-xs font-mono font-bold text-white">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Code Course: {currentRide.rideCode}</span>
                </div>
              )}
            </div>

            {/* Boarding PIN Box */}
            <div className="bg-slate-950/90 p-4 rounded-2xl border border-white/10 text-center space-y-1.5 relative">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Code PIN d'Embarquement Sécurisé
              </span>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-3xl font-black font-mono tracking-widest text-emerald-400">
                  {currentRide.pickupPin}
                </span>
                <button
                  onClick={() => handleCopyPin(currentRide.pickupPin)}
                  title="Copier le code PIN"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  {copiedPin ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[9px] text-slate-400">
                Donnez ce code au chauffeur avant le démarrage du compteur fiscal.
              </p>
            </div>

            {/* Verified Driver Regulatory Card */}
            <div className="bg-slate-950/90 p-4 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center space-x-3">
                <img
                  src={driver.photoUrl}
                  alt={driver.fullName}
                  className="w-12 h-12 rounded-xl object-cover border border-amber-400/40"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <h4 className="font-extrabold text-sm text-white truncate">{driver.fullName}</h4>
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <span className="flex items-center text-amber-300 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 mr-0.5 text-amber-400" />
                      {driver.rating}
                    </span>
                    <span>• {driver.totalTrips} courses</span>
                  </div>
                </div>
              </div>

              {/* Regulatory Credentials */}
              <div className="pt-2 border-t border-white/10 text-[10px] font-mono space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Agrément DTW Alger:</span>
                  <span className="font-bold text-amber-300">{driver.agrementNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Livret de Place:</span>
                  <span className="font-bold text-white">{driver.livretDePlaceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Véhicule:</span>
                  <span className="font-bold text-white">{driver.vehicleMake} {driver.vehicleModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Immatriculation:</span>
                  <span className="font-bold text-amber-300">{driver.licensePlate}</span>
                </div>
              </div>
            </div>

            {/* Active Fare & Spare Change Info */}
            <div className="bg-slate-950/90 p-3 rounded-2xl border border-white/10 text-xs font-mono space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Frais d'Approche (Réglementé):</span>
                <span>{currentRide.fraisApprocheDzd.toFixed(2)} DZD</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Compteur Fiscal:</span>
                <span className="text-white font-bold">{currentRide.meterFinalDzd.toFixed(2)} DZD</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-1 border-t border-white/10 text-amber-300">
                <span>Total Course:</span>
                <span>{currentRide.totalFareDzd.toFixed(2)} DZD</span>
              </div>

              {currentRide.spareChangeCreditedDzd && (
                <div className="pt-2 border-t border-white/10 text-emerald-300 text-[11px] font-bold flex justify-between">
                  <span>Monnaie Créditée TrustDesk:</span>
                  <span>+{currentRide.spareChangeCreditedDzd.toFixed(2)} DZD</span>
                </div>
              )}
            </div>

            {/* Cancel Button */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onCancelRide();
              }}
              className="w-full py-2.5 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs font-bold transition-colors"
            >
              Annuler la Course
            </button>

          </div>
        )}

      </div>

      {/* Topup Modal */}
      {onTopupRiderWallet && (
        <ChargilyTopupModal
          isOpen={isTopupOpen}
          onClose={() => setIsTopupOpen(false)}
          onSuccess={(amt) => onTopupRiderWallet(amt)}
          targetAccountName="Compte 2010 Passager TrustDesk"
        />
      )}

    </div>
  );
};
