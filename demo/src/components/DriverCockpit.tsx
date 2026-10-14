import React, { useState } from 'react';
import { 
  Power, 
  CreditCard,
  Banknote,
  Calendar,
  Clock,
  HeartHandshake,
  Car
} from 'lucide-react';
import type { 
  DriverProfile, 
  RideRequest, 
  DashcamIncident 
} from '../types';
import { DashcamHUD } from './DashcamHUD';
import { ChargilyTopupModal } from './ChargilyTopupModal';
import { BaridiMobModal } from './BaridiMobModal';
import { soundEngine } from '../utils/audio';
import type { AppLang } from '../utils/i18n';
import { getTranslation } from '../utils/i18n';

interface DriverCockpitProps {
  driver: DriverProfile;
  currentRide: RideRequest | null;
  onToggleOnline: () => void;
  onAcceptRide: () => void;
  onArrivedAtPickup: () => void;
  onStartTrip: (pin: string) => boolean;
  onArrivedDestination: () => void;
  onCompleteTrip: (meterAmount: number) => void;
  onIncidentTriggered: (incident: DashcamIncident) => void;
  onTopupDriverWallet: (amountDzd: number) => void;
  onOpenSpareChangeModal: () => void;
  lang?: AppLang;
  isDark?: boolean;
}

export const DriverCockpit: React.FC<DriverCockpitProps> = ({
  driver,
  currentRide,
  onToggleOnline,
  onAcceptRide,
  onArrivedAtPickup,
  onStartTrip,
  onArrivedDestination,
  onCompleteTrip,
  onIncidentTriggered,
  onTopupDriverWallet,
  onOpenSpareChangeModal,
  lang = 'fr',
  isDark: _isDark,
}) => {
  // Cockpit View Sub-Tab: Live View vs Weekly Shuttle Planning
  const [activeSubTab, setActiveSubTab] = useState<'live' | 'schedule'>('live');

  const [pinInput, setPinInput] = useState('');
  const [meterFareInput, setMeterFareInput] = useState<number>(750);
  const [pinError, setPinError] = useState(false);
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [isBaridiMobModalOpen, setIsBaridiMobModalOpen] = useState(false);

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  const handleVerifyPin = () => {
    soundEngine.playClick();
    const success = onStartTrip(pinInput);
    if (!success) {
      setPinError(true);
      soundEngine.playCrashSonar();
      setTimeout(() => setPinError(false), 2000);
    } else {
      setPinInput('');
      soundEngine.playSuccessChime();
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-4 sm:p-6 border transition-colors shadow-2xl space-y-4">
      
      {/* Driver Tablet Header & Profile Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center space-x-3">
          <img 
            src={driver.photoUrl} 
            alt={driver.fullName} 
            className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400/40 shadow-md"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                {driver.fullName}
              </h3>
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-bold">
                {driver.licensePlate}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Agrément : {driver.agrementNumber} • Livret : {driver.livretDePlaceNumber}
            </p>
          </div>
        </div>

        {/* Operational Balance & Online Toggle */}
        <div className="flex items-center space-x-2.5">
          <div className="text-right">
            <span className="block text-[10px] text-slate-500 uppercase font-bold">Solde Opérationnel (2020)</span>
            <span className="text-sm sm:text-base font-black font-mono text-emerald-500">
              {driver.walletBalanceDzd.toFixed(2)} DZD
            </span>
          </div>

          <button
            onClick={() => { soundEngine.playClick(); onToggleOnline(); }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              driver.isOnline
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{driver.isOnline ? t('driverOnlineBtn') : t('driverOfflineBtn')}</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar & Wallet Recharge Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        
        {/* Sub-tabs: Live Cockpit vs Weekly Shuttles */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 font-bold">
          <button
            onClick={() => { soundEngine.playSelection(); setActiveSubTab('live'); }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'live'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('driverTabImmediate')}</span>
          </button>

          <button
            onClick={() => { soundEngine.playSelection(); setActiveSubTab('schedule'); }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'schedule'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t('driverTabSchedule')}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-900/20 dark:bg-white/20 text-[9px] font-mono">
              3
            </span>
          </button>
        </div>

        {/* Top-up Buttons */}
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-400 text-[10px] uppercase font-bold mr-1">{t('driverRechargeTitle')}</span>
          <button
            onClick={() => setIsTopupModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-500/30 font-bold flex items-center gap-1 cursor-pointer"
          >
            <CreditCard className="w-3 h-3" />
            <span>CIB</span>
          </button>
          <button
            onClick={() => setIsBaridiMobModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Banknote className="w-3 h-3" />
            <span>Baridi</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: LIVE COCKPIT HUD & DISPATCH */}
      {activeSubTab === 'live' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* CameraX Viewfinder & OSD Telemetry HUD */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg">
            <DashcamHUD
              speedKmh={driver.speedKmh}
              driverLat={driver.currentLat}
              driverLng={driver.currentLng}
              rideId={currentRide?.id || 'IDLE'}
              driverId={driver.id}
              onIncidentTriggered={onIncidentTriggered}
            />
          </div>

          {/* Dynamic State Machine Display */}
          {(!currentRide || currentRide.status === 'idle') && (
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/40 text-center space-y-1">
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{t('driverStandby')}</h4>
              <p className="text-xs text-slate-500">{t('driverStandbyDesc')}</p>
            </div>
          )}

          {/* RIDE DISPATCH ALERT */}
          {currentRide && currentRide.status === 'requesting' && (
            <div className="p-5 rounded-2xl border-2 border-amber-500 bg-amber-500/10 space-y-3 animate-pulse">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-amber-600 dark:text-amber-400">
                  {currentRide.bookingType === 'recurring_chauffeur' 
                    ? 'NOUVELLE DEMANDE D\'ABONNEMENT NAVETTE'
                    : t('driverNewRide')}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                  15 SECONDES
                </span>
              </div>

              {/* Recurring Schedule or Third-Party Notice */}
              {currentRide.sponsor?.isSponsored && (
                <div className="p-2.5 rounded-xl bg-sky-500/20 border border-sky-500/30 text-xs text-sky-800 dark:text-sky-200 font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4 text-sky-500" />
                    <span>{t('driverSponsoredBadge')}</span>
                  </span>
                  <span className="text-[10px] font-mono">Payé par {currentRide.sponsor.sponsorName}</span>
                </div>
              )}

              {currentRide.bookingType === 'recurring_chauffeur' && currentRide.recurringSchedule && (
                <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <div className="font-bold">
                    Navette Dédiée : {currentRide.recurringSchedule.days.map(d => d.toUpperCase()).join(', ')}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300">
                    Départ : {currentRide.recurringSchedule.pickupTime} {currentRide.recurringSchedule.hasReturnTrip ? `• Retour : ${currentRide.recurringSchedule.returnTime}` : ''} ({currentRide.recurringSchedule.durationWeeks} semaines)
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Prise :</span>
                  <strong className="text-slate-900 dark:text-white">{currentRide.origin.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Destination :</span>
                  <strong className="text-slate-900 dark:text-white">{currentRide.destination.name}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-amber-500/30 text-xs">
                <span className="text-slate-500">{t('driverApproachGuaranteed')}</span>
                <span className="font-bold text-amber-500 font-mono">+100.00 DZD</span>
              </div>

              <button
                onClick={() => { soundEngine.playSuccessChime(); onAcceptRide(); }}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
              >
                {t('driverAcceptBtn')}
              </button>
            </div>
          )}

          {/* DRIVER ASSIGNED: NAVIGATE TO PICKUP */}
          {currentRide && currentRide.status === 'driver_assigned' && (
            <div className="p-4 rounded-2xl border border-sky-500/30 bg-sky-500/10 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-300">
                <span>{t('driverNavToPickup')}</span>
                <span>~4 mins • 1.6 km</span>
              </div>
              <div className="p-3 rounded-xl bg-white/50 dark:bg-slate-900/60 border text-xs">
                <span className="text-slate-400 block text-[10px]">Client en attente</span>
                <strong className="text-slate-900 dark:text-white">{currentRide.origin.name}</strong>
              </div>
              <button
                onClick={() => { soundEngine.playClick(); onArrivedAtPickup(); }}
                className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                {t('driverArrivedBtn')}
              </button>
            </div>
          )}

          {/* DRIVER ARRIVED: PIN VERIFICATION KEYPAD */}
          {currentRide && currentRide.status === 'driver_arrived' && (
            <div className="p-5 rounded-2xl border-2 border-amber-500/40 bg-amber-500/5 space-y-3 animate-fadeIn">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{t('driverBoardingTitle')}</h4>
                <p className="text-xs text-slate-500">{t('driverBoardingDesc')}</p>
              </div>

              {currentRide.sponsor?.isSponsored && (
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  ℹ️ {t('driverNoCashToCollect')}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="Ex: 5410"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className={`flex-1 p-3 rounded-xl border text-center font-mono font-black text-xl tracking-widest bg-white dark:bg-slate-950 text-slate-900 dark:text-white ${
                    pinError ? 'border-rose-500 animate-shake' : 'border-slate-300 dark:border-white/20'
                  }`}
                />
                <button
                  onClick={handleVerifyPin}
                  disabled={pinInput.length !== 4}
                  className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-black text-xs cursor-pointer"
                >
                  {t('driverStartMeterBtn')}
                </button>
              </div>
            </div>
          )}

          {/* TRIP IN PROGRESS */}
          {currentRide && currentRide.status === 'in_progress' && (
            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span>{t('driverTripLive')}</span>
                <span>{currentRide.rideCode}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/50 dark:bg-slate-900/60 border text-xs">
                <span className="text-slate-400 block text-[10px]">Destination</span>
                <strong className="text-slate-900 dark:text-white">{currentRide.destination.name}</strong>
              </div>
              <button
                onClick={() => { soundEngine.playClick(); onArrivedDestination(); }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs cursor-pointer shadow-lg"
              >
                {t('driverFinishBtn')}
              </button>
            </div>
          )}

          {/* FARE CLOSING */}
          {currentRide && (currentRide.status === 'fare_entry' || currentRide.status === 'spare_change_prompt') && (
            <div className="p-5 rounded-2xl border-2 border-amber-500 bg-amber-500/10 space-y-4 animate-fadeIn">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{t('driverFareClosing')}</h4>
                <p className="text-xs text-slate-500">{t('driverEnterMeter')}</p>
              </div>

              {/* Special Sponsored Display */}
              {currentRide.sponsor?.isSponsored ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-sky-500/15 border border-sky-500/30 text-xs space-y-1">
                    <span className="font-bold text-sky-700 dark:text-sky-300 block">
                      ✅ {t('driverSponsoredBadge')}
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                      {t('driverNoCashToCollect')}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Transaction SATIM : {currentRide.sponsor.satimAuthCode || 'SATIM-839201'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm font-black pt-1">
                    <span>Montant Crédité sur Solde Chauffeur (2020) :</span>
                    <span className="font-mono text-xl text-emerald-500 font-black">+850.00 DZD</span>
                  </div>

                  <button
                    onClick={() => {
                      soundEngine.playSuccessChime();
                      onCompleteTrip(meterFareInput);
                    }}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all cursor-pointer"
                  >
                    VALIDER & CLÔTURER LA COURSE PRÉPAYÉE
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border">
                      <span className="text-slate-500 block text-[10px]">{t('driverMeterAmount')}</span>
                      <div className="flex items-center space-x-1 mt-1">
                        <input
                          type="number"
                          value={meterFareInput}
                          onChange={(e) => setMeterFareInput(Number(e.target.value))}
                          className="w-20 p-1 font-mono font-bold text-base bg-transparent border-b border-amber-500 text-slate-900 dark:text-white"
                        />
                        <span className="font-bold text-slate-500">DZD</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border">
                      <span className="text-slate-500 block text-[10px]">{t('driverApproachFee')}</span>
                      <span className="font-mono font-bold text-base text-amber-500 mt-1 block">+100.00 DZD</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm font-black pt-2 border-t border-amber-500/30">
                    <span>{t('driverTotalDue')}</span>
                    <span className="font-mono text-xl text-amber-500">{(meterFareInput + 100).toFixed(2)} DZD</span>
                  </div>

                  <button
                    onClick={() => {
                      onCompleteTrip(meterFareInput);
                      onOpenSpareChangeModal();
                    }}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all cursor-pointer"
                  >
                    {t('driverCollectBtn')}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: WEEKLY SHUTTLE PLANNING & DEDICATED CHAUFFEUR ROSTER */}
      {activeSubTab === 'schedule' && (
        <div className="space-y-4 animate-fadeIn">
          
          <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>{t('driverScheduleTitle')}</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t('driverScheduleSubtitle')}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Revenu Garanti / Semaine</span>
              <span className="text-base font-black font-mono text-emerald-500">32 700.00 DZD</span>
            </div>
          </div>

          {/* Roster of 3 Pre-Scheduled Contracts */}
          <div className="space-y-3">
            
            {/* Contract 1: Ramassage Scolaire */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-[10px]">
                      Scolaire • 10 Trajets / sem.
                    </span>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      Ramassage Kouba ➔ Hydra (Lycée)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-sky-500" />
                    <span>Dimanche au Jeudi • Aller 07:45 & Retour 16:30</span>
                  </p>
                </div>
                <span className="font-mono font-black text-emerald-500 text-xs">
                  14 000.00 DA / sem.
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10 text-[11px]">
                <span className="text-slate-500">Bénéficiaires : Famille Benali (2 élèves)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                  Prépayé CIB (Karim Benali)
                </span>
              </div>
            </div>

            {/* Contract 2: Corporate Commute */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-700 dark:text-sky-300 font-bold text-[10px]">
                      Corporate • 10 Trajets / sem.
                    </span>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      Navette Cadre Alger Centre ➔ Bab Ezzouar
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-sky-500" />
                    <span>Dimanche au Jeudi • Aller 08:15 & Retour 17:30</span>
                  </p>
                </div>
                <span className="font-mono font-black text-emerald-500 text-xs">
                  16 500.00 DA / sem.
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10 text-[11px]">
                <span className="text-slate-500">Passager : Amine K. (Dir. Financière)</span>
                <span className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold text-[10px]">
                  Facturé Entreprise TrustDesk
                </span>
              </div>
            </div>

            {/* Contract 3: Medical Regular */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold text-[10px]">
                      Médical • 2 Trajets / sem.
                    </span>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      Navette Soins El Biar ➔ CHU Mustapha
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-sky-500" />
                    <span>Lundi & Mercredi • Départ 09:30</span>
                  </p>
                </div>
                <span className="font-mono font-black text-emerald-500 text-xs">
                  2 200.00 DA / sem.
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10 text-[11px]">
                <span className="text-slate-500">Passagère : Mme Zahia M.</span>
                <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-600 dark:text-purple-400 font-bold text-[10px]">
                  Sponsorisé BaridiMob
                </span>
              </div>
            </div>

          </div>

          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            🛡️ <strong>Garantie Décret 12-230 :</strong> Les navettes programmées constituent des courses réservées prioritaires. Les fonds sont prélevés auprès des sponsors ou employeurs et garantis sur votre compte opérationnel 2020.
          </div>
        </div>
      )}

      {/* Modals */}
      <ChargilyTopupModal
        isOpen={isTopupModalOpen}
        onClose={() => setIsTopupModalOpen(false)}
        onSuccess={(amt) => { onTopupDriverWallet(amt); setIsTopupModalOpen(false); }}
        targetAccountName="Compte Opérationnel Chauffeur (2020)"
      />
      <BaridiMobModal
        isOpen={isBaridiMobModalOpen}
        onClose={() => setIsBaridiMobModalOpen(false)}
        onSuccess={(amt) => { onTopupDriverWallet(amt); setIsBaridiMobModalOpen(false); }}
        targetAccountName="Compte Opérationnel Chauffeur (2020)"
      />

    </div>
  );
};
