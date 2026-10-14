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
import { BaridiMobModal } from './BaridiMobModal';
import { soundEngine } from '../utils/audio';
import type { AppLang } from '../utils/i18n';
import { getTranslation } from '../utils/i18n';

interface RiderViewProps {
  currentRide: RideRequest | null;
  driver: DriverProfile;
  riderWalletBalanceDzd: number;
  onRequestRide: (mode: ServiceMode, origin: LocationPoint, dest: LocationPoint, payment: PaymentMethod) => void;
  onCancelRide: () => void;
  onTopupRiderWallet?: (amountDzd: number) => void;
  lang?: AppLang;
}

export const RiderView: React.FC<RiderViewProps> = ({
  currentRide,
  driver,
  riderWalletBalanceDzd,
  onRequestRide,
  onCancelRide,
  onTopupRiderWallet,
  lang = 'fr',
}) => {
  const [selectedMode, setSelectedMode] = useState<ServiceMode>('taxi_individuel_metered');
  const [origin, setOrigin] = useState<LocationPoint>(ALGIERS_LOCATIONS[2]); // Kouba
  const [destination, setDestination] = useState<LocationPoint>(ALGIERS_LOCATIONS[0]); // Grande Poste
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [isBaridiMobOpen, setIsBaridiMobOpen] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  const estimatedFare = selectedMode === 'taxi_individuel_metered' ? 850 : selectedMode === 'taxi_collectif_urbain' ? 50 : 350;

  const handleCopyPin = (pin: string) => {
    soundEngine.playClick();
    navigator.clipboard?.writeText(pin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  return (
    <div className="smartphone-frame">
      <div className="smartphone-screen flex flex-col h-[740px] relative border transition-colors shadow-inner">
        
        {/* Smartphone Dynamic Island / Notch & Status Bar */}
        <div className="px-6 pt-3 pb-2 flex items-center justify-between text-xs text-slate-500 font-mono select-none border-b border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-slate-950/80">
          <span className="font-bold text-slate-800 dark:text-white">16:42</span>
          <div className="smartphone-notch">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-slate-800 border border-slate-700"></span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <div className="flex items-center space-x-1.5 text-[10px]">
            <span className="text-emerald-500 font-bold">4G Mobilis</span>
            <span>100%</span>
          </div>
        </div>

        {/* App Header */}
        <div className="border-b border-slate-200 dark:border-white/10 px-4 py-3 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div>
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
              <span>{t('riderPhoneHeader')}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{t('riderSubheader')}</p>
          </div>

          {/* Stored-Value Wallet Badge */}
          <div className="flex items-center space-x-1.5">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-mono font-bold">
              <Wallet className="w-3.5 h-3.5 text-emerald-500" />
              <span>{riderWalletBalanceDzd.toFixed(2)} DA</span>
            </div>
            {onTopupRiderWallet && (
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => { soundEngine.playClick(); setIsTopupOpen(true); }}
                  title="Recharge par Carte CIB / Edahabia"
                  className="px-2 py-1 rounded-xl bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-400/30 hover:bg-sky-500/30 transition-colors text-[10px] font-bold cursor-pointer"
                >
                  CIB
                </button>
                <button
                  onClick={() => { soundEngine.playClick(); setIsBaridiMobOpen(true); }}
                  title="Recharge BaridiMob"
                  className="px-2 py-1 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-400/30 hover:bg-amber-500/30 transition-colors text-[10px] font-bold cursor-pointer"
                >
                  Baridi
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* 1. STATE: IDLE (Choose Mode & Route) */}
          {(!currentRide || currentRide.status === 'idle') && (
            <div className="space-y-4">
              
              {/* Service Mode Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  {t('riderSelectMode')}
                </label>
                
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => { soundEngine.playSelection(); setSelectedMode('taxi_individuel_metered'); }}
                    className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      selectedMode === 'taxi_individuel_metered'
                        ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10'
                        : 'border-slate-200 dark:border-white/10 text-slate-500 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <Car className={`w-5 h-5 mb-1 ${selectedMode === 'taxi_individuel_metered' ? 'text-amber-500' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">Individuel</div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-300">+100 DA</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { soundEngine.playSelection(); setSelectedMode('taxi_collectif_urbain'); }}
                    className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      selectedMode === 'taxi_collectif_urbain'
                        ? 'bg-emerald-500/15 border-emerald-500 shadow-md shadow-emerald-500/10'
                        : 'border-slate-200 dark:border-white/10 text-slate-500 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <Users className={`w-5 h-5 mb-1 ${selectedMode === 'taxi_collectif_urbain' ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">Collectif</div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-300">50 DA/place</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { soundEngine.playSelection(); setSelectedMode('taxi_collectif_inter_wilayas'); }}
                    className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      selectedMode === 'taxi_collectif_inter_wilayas'
                        ? 'bg-indigo-500/15 border-indigo-500 shadow-md shadow-indigo-500/10'
                        : 'border-slate-200 dark:border-white/10 text-slate-500 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <Compass className={`w-5 h-5 mb-1 ${selectedMode === 'taxi_collectif_inter_wilayas' ? 'text-indigo-500' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">Inter-Wilaya</div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-300">Caroubier</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Origin & Destination Selectors */}
              <div className="space-y-2.5 p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/40">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-sky-500" />
                    <span>{t('riderPickup')}</span>
                  </label>
                  <select 
                    value={origin.id}
                    onChange={(e) => {
                      const loc = ALGIERS_LOCATIONS.find(l => l.id === e.target.value);
                      if (loc) setOrigin(loc);
                    }}
                    className="w-full text-xs font-semibold p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    {ALGIERS_LOCATIONS.map(loc => (
                      <option key={loc.id} value={loc.id}>
                        {lang === 'ar' ? loc.nameAr : loc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Navigation2 className="w-3 h-3 text-amber-500" />
                    <span>{t('riderDestination')}</span>
                  </label>
                  <select 
                    value={destination.id}
                    onChange={(e) => {
                      const loc = ALGIERS_LOCATIONS.find(l => l.id === e.target.value);
                      if (loc) setDestination(loc);
                    }}
                    className="w-full text-xs font-semibold p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    {ALGIERS_LOCATIONS.map(loc => (
                      <option key={loc.id} value={loc.id}>
                        {lang === 'ar' ? loc.nameAr : loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  {t('riderPaymentMethod')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      paymentMethod === 'cash' 
                        ? 'bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-300' 
                        : 'border-slate-200 dark:border-white/10 text-slate-500'
                    }`}
                  >
                    <Banknote className="w-3.5 h-3.5" />
                    <span>{t('riderCash')}</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('edahabia')}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      paymentMethod === 'edahabia' 
                        ? 'bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-300' 
                        : 'border-slate-200 dark:border-white/10 text-slate-500'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>CIB</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('trustdesk_wallet')}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      paymentMethod === 'trustdesk_wallet' 
                        ? 'bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-300' 
                        : 'border-slate-200 dark:border-white/10 text-slate-500'
                    }`}
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Wallet</span>
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-600 dark:text-amber-300 leading-snug">
                  💡 <strong>Spare Change Flywheel :</strong> Si le chauffeur manque de pièces, le reliquat est viré sur votre solde digital.
                </div>
              </div>

              {/* Fare Calculation & Order Button */}
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Tarif Réglementé Estimé</span>
                  <span className="text-base font-extrabold text-amber-500 font-mono">~{estimatedFare}.00 DZD</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Distance : ~8.4 km</span>
                  <span>Durée : ~18 mins</span>
                </div>
              </div>

              <button
                onClick={() => {
                  soundEngine.playSuccessChime();
                  onRequestRide(selectedMode, origin, destination, paymentMethod);
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 text-white font-extrabold text-sm shadow-xl shadow-sky-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                {t('riderOrderBtn')}
              </button>
            </div>
          )}

          {/* 2. STATE: REQUESTING / MATCHING */}
          {currentRide && (currentRide.status === 'requesting' || currentRide.status === 'matching') && (
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-sky-500/20 border-2 border-sky-400 mx-auto flex items-center justify-center animate-pulse">
                <Car className="w-8 h-8 text-sky-500 animate-bounce" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {t('riderSearching')}
              </h3>
              <p className="text-xs text-slate-500">
                Course {currentRide.rideCode} • Décret 12-230
              </p>
              <button
                onClick={() => { soundEngine.playClick(); onCancelRide(); }}
                className="text-xs text-rose-500 hover:underline font-bold pt-2 cursor-pointer"
              >
                {t('riderCancelTrip')}
              </button>
            </div>
          )}

          {/* 3. STATE: DRIVER ASSIGNED / ARRIVED */}
          {currentRide && (currentRide.status === 'driver_assigned' || currentRide.status === 'driver_arrived') && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-between text-xs font-bold">
                <span>{t('riderAssignedTitle')}</span>
                <span className="font-mono">Code : {currentRide.rideCode}</span>
              </div>

              {/* PIN Code Box */}
              <div className="p-4 rounded-2xl border-2 border-amber-500/40 bg-amber-500/5 text-center space-y-2">
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                  {t('riderPinTitle')}
                </span>
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-3xl font-black font-mono tracking-widest text-slate-900 dark:text-white">
                    {currentRide.pickupPin}
                  </span>
                  <button
                    onClick={() => handleCopyPin(currentRide.pickupPin)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                    title={t('riderCopyPin')}
                  >
                    {copiedPin ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {t('riderPinNotice')}
                </p>
              </div>

              {/* Driver Credentials Card */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/40 space-y-3">
                <div className="flex items-center space-x-3">
                  <img src={driver.photoUrl} alt={driver.fullName} className="w-12 h-12 rounded-xl object-cover border" />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{driver.fullName}</h4>
                    <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{driver.rating}</span>
                      <span className="text-slate-400 font-normal">• {driver.totalTrips} courses</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[9px]">Agrément DTW :</span>
                    <span className="font-mono font-bold">{driver.agrementNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Livret de Place :</span>
                    <span className="font-mono font-bold">{driver.livretDePlaceNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Véhicule :</span>
                    <span className="font-semibold">{driver.vehicleMake} {driver.vehicleModel}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Plaque :</span>
                    <span className="font-mono font-bold">{driver.licensePlate}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => { soundEngine.playClick(); onCancelRide(); }}
                className="w-full py-2.5 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-bold transition-all cursor-pointer"
              >
                {t('riderCancelTrip')}
              </button>
            </div>
          )}

          {/* 4. STATE: IN PROGRESS */}
          {currentRide && (currentRide.status === 'in_progress' || currentRide.status === 'fare_entry' || currentRide.status === 'spare_change_prompt') && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-300 text-xs font-bold flex items-center justify-between">
                <span>{t('riderTripInProgress')}</span>
                <span className="font-mono">{currentRide.rideCode}</span>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/40 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 mx-auto flex items-center justify-center">
                  <Navigation2 className="w-6 h-6 text-emerald-500 animate-spin" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Vers : {destination.name}
                </h4>
                <p className="text-xs text-slate-500">
                  Compteur fiscal et caméra de bord télématique en service
                </p>
              </div>
            </div>
          )}

          {/* 5. STATE: COMPLETED */}
          {currentRide && currentRide.status === 'completed' && (
            <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-center space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 mx-auto flex items-center justify-center">
                <Check className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="font-extrabold text-base text-emerald-600 dark:text-emerald-400">
                {t('riderTripCompleted')}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Total réglé : {currentRide.totalFareDzd.toFixed(2)} DZD
              </p>
              <button
                onClick={() => onCancelRide()}
                className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs cursor-pointer"
              >
                Nouvelle Course
              </button>
            </div>
          )}

        </div>

        {/* Top-up Modals */}
        {onTopupRiderWallet && (
          <>
            <ChargilyTopupModal
              isOpen={isTopupOpen}
              onClose={() => setIsTopupOpen(false)}
              onSuccess={(amt) => { onTopupRiderWallet(amt); setIsTopupOpen(false); }}
              targetAccountName="Portefeuille Passager (2010)"
            />
            <BaridiMobModal
              isOpen={isBaridiMobOpen}
              onClose={() => setIsBaridiMobOpen(false)}
              onSuccess={(amt) => { onTopupRiderWallet(amt); setIsBaridiMobOpen(false); }}
              targetAccountName="Portefeuille Passager (2010)"
            />
          </>
        )}

      </div>
    </div>
  );
};
