import React, { useState } from 'react';
import { 
  Car, 
  Power, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  KeyRound, 
  Wallet, 
  DollarSign,
  Volume2
} from 'lucide-react';
import type { 
  DriverProfile, 
  RideRequest, 
  DashcamIncident 
} from '../types';
import { DashcamHUD } from './DashcamHUD';
import { ChargilyTopupModal } from './ChargilyTopupModal';
import { soundEngine } from '../utils/audio';

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
}) => {
  const [pinInput, setPinInput] = useState('');
  const [meterFareInput, setMeterFareInput] = useState<number>(750);
  const [pinError, setPinError] = useState(false);
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);

  const handleVerifyPin = () => {
    soundEngine.playClick();
    const success = onStartTrip(pinInput);
    if (!success) {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    } else {
      soundEngine.playSuccessChime();
      setPinInput('');
    }
  };

  const handleVoiceDispatch = () => {
    soundEngine.playClick();
    if (currentRide) {
      soundEngine.speakDispatch(
        `Taxi 16-0482. Assignation en cours. Destination: ${currentRide.destination.name}.`,
        'fr'
      );
    } else {
      soundEngine.speakDispatch(
        'Poste de commandement Alger. Aucun appel en attente pour votre secteur H3.',
        'fr'
      );
    }
  };

  return (
    <div className="cockpit-card rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full max-w-2xl mx-auto border border-white/10">
      
      {/* Cockpit Status Header */}
      <div className="bg-slate-950/95 p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <img
              src={driver.photoUrl}
              alt={driver.fullName}
              className="w-13 h-13 rounded-2xl object-cover border-2 border-amber-400 shadow-lg"
            />
            <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-950 ${
              driver.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
            }`}></span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-base text-white">{driver.fullName}</h3>
              <span className="px-2 py-0.5 rounded-lg bg-amber-400/15 text-amber-300 text-xs font-mono font-bold border border-amber-400/30">
                {driver.licensePlate}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              Agrément: <span className="text-slate-300 font-bold">{driver.agrementNumber}</span> • Livret: <span className="text-slate-300 font-bold">{driver.livretDePlaceNumber}</span>
            </div>
          </div>
        </div>

        {/* Operational Wallet Balance & Online Switch */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Solde Opérationnel</span>
            <div className="font-mono font-black text-amber-300 text-base">
              {driver.walletBalanceDzd.toFixed(2)} DZD
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onToggleOnline();
            }}
            title={driver.isOnline ? 'Passer hors-ligne' : 'Se connecter au réseau DTW'}
            className={`p-3 rounded-2xl border transition-all flex items-center justify-center ${
              driver.isOnline
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/25'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <Power className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Top-Up Quick Bar & Voice Assistance */}
        <div className="bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <Wallet className="w-4 h-4 text-amber-400" />
            <span>Recharge CIB / Edahabia:</span>
            <button
              onClick={() => { soundEngine.playClick(); setIsTopupModalOpen(true); }}
              className="px-2 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-400/30 font-bold text-[11px] hover:bg-sky-500/30 transition-colors"
            >
              Passerelle Chargily
            </button>
          </div>

          <button
            onClick={handleVoiceDispatch}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/25 hover:bg-amber-400/20 transition-colors font-bold text-[11px]"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Assistant Vocal</span>
          </button>
        </div>

        {/* 1. Integrated Dashcam Telematics HUD */}
        <DashcamHUD
          speedKmh={driver.speedKmh}
          driverLat={driver.currentLat}
          driverLng={driver.currentLng}
          rideId={currentRide?.id || 'STANDBY-NO-RIDE'}
          driverId={driver.id}
          onIncidentTriggered={onIncidentTriggered}
        />

        {/* 2. Cockpit Dispatch State Machine */}

        {/* A. STANDBY (Waiting for Dispatch) */}
        {(!currentRide || currentRide.status === 'idle') && (
          <div className="bg-slate-950/90 p-6 rounded-3xl border border-white/10 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-amber-400 flex items-center justify-center mx-auto">
              <Car className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="font-extrabold text-base text-white">Cockpit Chauffeur en Veille</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {driver.isOnline
                ? 'Prêt à recevoir les assignations de la Wilaya d\'Alger (Index H3 Résolution 8 actif).'
                : 'Passez en ligne pour recevoir les alertes de courses.'}
            </p>
          </div>
        )}

        {/* B. DISPATCH INCOMING ALERT */}
        {currentRide && currentRide.status === 'requesting' && (
          <div className="bg-amber-500/10 border-2 border-amber-400 rounded-3xl p-5 space-y-4 shadow-2xl shadow-amber-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-amber-300 font-extrabold text-sm">
                <Clock className="w-4 h-4 animate-spin text-amber-400" />
                <span>NOUVELLE DEMANDE DE COURSE • ALGER</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-black text-xs">
                15 SECONDES
              </span>
            </div>

            <div className="bg-slate-950/90 p-4 rounded-2xl border border-white/10 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Prise: <strong className="text-white">{currentRide.origin.name}</strong></span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Navigation className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>Destination: <strong className="text-white">{currentRide.destination.name}</strong></span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between font-mono text-amber-300 font-bold">
                <span>Frais d'approche garantis:</span>
                <span>+100.00 DZD</span>
              </div>
            </div>

            {/* 64dp Accept Button */}
            <button
              onClick={() => {
                soundEngine.playSuccessChime();
                onAcceptRide();
              }}
              className="w-full driver-touch-btn bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-black text-base tracking-wider transition-all shadow-xl shadow-amber-400/30 flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-6 h-6 stroke-[3]" />
              <span>ACCEPTER LA COURSE (15s)</span>
            </button>
          </div>
        )}

        {/* C. DRIVER ASSIGNED: EN ROUTE TO PICKUP */}
        {currentRide && currentRide.status === 'driver_assigned' && (
          <div className="bg-slate-950/90 p-5 rounded-3xl border border-white/10 space-y-4">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Guidage vers le point de prise en charge</span>
              <span className="font-mono text-emerald-400 font-bold">~4 mins • 1.6 km</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-3">
              <MapPin className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <div className="text-[11px] text-slate-400 uppercase font-bold">Client en attente</div>
                <div className="font-bold text-white text-sm">{currentRide.origin.name}</div>
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                onArrivedAtPickup();
              }}
              className="w-full driver-touch-btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base tracking-wider transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-6 h-6 stroke-[3]" />
              <span>JE SUIS ARRIVÉ AU POINT DE PRISE</span>
            </button>
          </div>
        )}

        {/* D. DRIVER ARRIVED: PIN ENTRY BEFORE METER START */}
        {currentRide && currentRide.status === 'driver_arrived' && (
          <div className="bg-slate-950/90 p-5 rounded-3xl border border-white/10 space-y-4">
            <div className="text-center space-y-1">
              <h4 className="font-extrabold text-base text-white">Embarquement du Passager</h4>
              <p className="text-xs text-slate-400">Demandez au passager son code PIN à 4 chiffres</p>
            </div>

            <div className="flex justify-center space-x-2">
              <input
                type="text"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Ex: 8492"
                className={`w-48 text-center bg-slate-900 border text-2xl font-mono font-black text-amber-300 rounded-2xl py-3 tracking-widest focus:outline-none ${
                  pinError ? 'border-rose-500' : 'border-white/15 focus:border-amber-400'
                }`}
              />
            </div>

            {pinError && (
              <p className="text-center text-xs text-rose-400 font-bold">
                Code PIN incorrect. Veuillez vérifier avec le passager.
              </p>
            )}

            <button
              onClick={handleVerifyPin}
              disabled={pinInput.length < 4}
              className="w-full driver-touch-btn bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base tracking-wider transition-all shadow-xl shadow-amber-400/25 flex items-center justify-center space-x-2 disabled:opacity-40"
            >
              <KeyRound className="w-6 h-6 stroke-[2.5]" />
              <span>DÉMARRER COMPTEUR & COURSE</span>
            </button>
          </div>
        )}

        {/* E. IN PROGRESS: TRIP ACTIVE TO DESTINATION */}
        {currentRide && currentRide.status === 'in_progress' && (
          <div className="bg-slate-950/90 p-5 rounded-3xl border border-white/10 space-y-4">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="flex items-center text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-2"></span>
                Course en cours • Dashcam active
              </span>
              <span className="font-mono text-white font-bold">{currentRide.rideCode}</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-3">
              <Navigation className="w-6 h-6 text-rose-400 flex-shrink-0" />
              <div>
                <div className="text-[11px] text-slate-400 uppercase font-bold">Destination</div>
                <div className="font-bold text-white text-sm">{currentRide.destination.name}</div>
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                onArrivedDestination();
              }}
              className="w-full driver-touch-btn bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base tracking-wider transition-all shadow-xl shadow-amber-400/25 flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-6 h-6 stroke-[3]" />
              <span>ARRIVÉ À DESTINATION • ENCAISSER</span>
            </button>
          </div>
        )}

        {/* F. FARE ENTRY & FLYWHEEL CONVERSION */}
        {currentRide && (currentRide.status === 'fare_entry' || currentRide.status === 'spare_change_prompt') && (
          <div className="bg-slate-950/90 p-5 rounded-3xl border border-white/10 space-y-4">
            <div className="text-center space-y-1">
              <h4 className="font-extrabold text-base text-white">Clôture de la Course</h4>
              <p className="text-xs text-slate-400">Saisissez le montant affiché sur votre compteur fiscal</p>
            </div>

            {/* Taximeter Input */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>Compteur Fiscal (DA):</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={meterFareInput}
                    onChange={(e) => setMeterFareInput(Number(e.target.value))}
                    className="w-28 text-right bg-slate-950 border border-white/20 text-amber-300 font-mono font-black text-lg px-2.5 py-1 rounded-xl focus:outline-none focus:border-amber-400"
                  />
                  <span className="font-bold text-white">DZD</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Frais d'Approche (Réglementé CNRC 604103):</span>
                <span className="font-mono font-bold text-white">+100.00 DZD</span>
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm font-bold">
                <span className="text-white">Total à Régler:</span>
                <span className="font-mono font-black text-2xl text-emerald-400">
                  {(meterFareInput + 100).toFixed(2)} DZD
                </span>
              </div>
            </div>

            {/* Spare Change Flywheel Launch Button */}
            <button
              onClick={() => {
                soundEngine.playCashRegisterDing();
                onCompleteTrip(meterFareInput);
                onOpenSpareChangeModal();
              }}
              className="w-full driver-touch-btn bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-base tracking-wider transition-all shadow-xl shadow-amber-400/25 flex items-center justify-center space-x-2"
            >
              <DollarSign className="w-6 h-6 stroke-[3]" />
              <span>ENCAISSER & CONVERTIR MONNAIE TRUSTDESK</span>
            </button>
          </div>
        )}

      </div>

      {/* Topup Modal */}
      <ChargilyTopupModal
        isOpen={isTopupModalOpen}
        onClose={() => setIsTopupModalOpen(false)}
        onSuccess={(amt) => onTopupDriverWallet(amt)}
        targetAccountName="Compte 2020 Chauffeur"
      />

    </div>
  );
};
