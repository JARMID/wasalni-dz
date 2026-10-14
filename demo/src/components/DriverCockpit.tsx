import React, { useState } from 'react';
import { 
  Power, 
  CreditCard,
  Banknote
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

        {/* Operational Balance & State */}
        <div className="flex items-center space-x-2.5">
          <div className="text-right">
            <span className="block text-[10px] text-slate-500 uppercase font-bold">Solde Opérationnel</span>
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

      {/* Recharges & Quick Actions */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-500 font-semibold">{t('driverRechargeTitle')}</span>
          <button
            onClick={() => setIsTopupModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-500/30 font-bold flex items-center gap-1 cursor-pointer"
          >
            <CreditCard className="w-3 h-3" />
            <span>CIB / Edahabia</span>
          </button>
          <button
            onClick={() => setIsBaridiMobModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Banknote className="w-3 h-3" />
            <span>BaridiMob</span>
          </button>
        </div>
      </div>

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
              {t('driverNewRide')}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
              15 SECONDES
            </span>
          </div>

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

          <div className="flex items-center space-x-2">
            <input
              type="text"
              maxLength={4}
              placeholder="Ex: 8492"
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
