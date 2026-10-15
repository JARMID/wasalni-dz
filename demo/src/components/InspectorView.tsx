import React, { useState } from 'react';
import { 
  ShieldCheck, 
  QrCode, 
  Camera, 
  CheckCircle2, 
  FileText, 
  Calendar, 
  Car, 
  Search, 
  Lock, 
  Sparkles
} from 'lucide-react';
import type { AppLang } from '../utils/i18n';
import type { DriverProfile } from '../types';

interface InspectorViewProps {
  driver: DriverProfile;
  lang: AppLang;
}

export const InspectorView: React.FC<InspectorViewProps> = ({ driver }) => {
  const [scannedPlate, setScannedPlate] = useState('04829-116-16');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'verified' | 'unverified' | null>('verified');
  const [offlineMode, setOfflineMode] = useState(false);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult('verified');
    }, 900);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn font-sans">
      
      {/* Inspector Top Identification Bar */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 border border-blue-400/30">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Contrôle Routier DTW & Sûreté Nationale
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600/15 text-blue-600 dark:text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                Décret 12-230
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Terminal mobile de vérification d'accréditation et conformité des taxis agréés (Wilaya 16 Alger)
            </p>
          </div>
        </div>

        {/* Offline Cryptographic Mode Toggle */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={() => setOfflineMode(!offlineMode)}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              offlineMode
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{offlineMode ? 'Mode Hors-Ligne (ECDSA P-256)' : 'Connecté Serveur DTW'}</span>
          </button>
        </div>
      </div>

      {/* Checkpoint Scanner Simulation Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: QR & License Plate Input */}
        <div className="md:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Lecture Badge Véhicule</span>
              <Camera className="w-4 h-4 text-blue-500" />
            </h3>

            {/* Medallion QR Camera Preview Box */}
            <div className="relative aspect-square rounded-2xl bg-slate-900 border-2 border-dashed border-blue-500/40 overflow-hidden flex flex-col items-center justify-center text-center p-4 group">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-pulse" />
              
              <div className="w-36 h-36 border-2 border-blue-400 rounded-2xl relative flex items-center justify-center p-2 mb-3 bg-black/40 backdrop-blur-xs">
                <QrCode className="w-28 h-28 text-blue-400 group-hover:scale-105 transition-transform" />
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-blue-400" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-blue-400" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-blue-400" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-blue-400" />
              </div>

              <span className="text-xs font-bold text-white mb-1">
                {isScanning ? 'Scan optique en cours...' : 'Visière Pare-Brise Taxi'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Agrément N° {driver.agrementNumber}
              </span>

              <button
                onClick={handleSimulateScan}
                disabled={isScanning}
                className="mt-3 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isScanning ? 'Vérification...' : 'Simuler Scan QR Medallion'}</span>
              </button>
            </div>

            {/* Manual Plate Search Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Numéro d'Immatriculation (Alger 16)
              </label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={scannedPlate}
                    onChange={(e) => setScannedPlate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-mono font-bold text-sm text-slate-900 dark:text-white uppercase focus:outline-none focus:border-blue-500"
                    placeholder="04829-116-16"
                  />
                  <Car className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
                </div>
                <button
                  onClick={handleSimulateScan}
                  className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Driver & Vehicle Official Compliance Card */}
        <div className="md:col-span-7 space-y-4">
          {scanResult === 'verified' && (
            <div className="glass-panel p-6 rounded-3xl border-2 border-blue-500/50 dark:border-blue-500/40 shadow-2xl space-y-5 animate-scaleUp">
              
              {/* Verdict Banner */}
              <div className="p-3.5 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-blue-500" />
                  <div>
                    <h4 className="font-extrabold text-sm text-blue-700 dark:text-blue-300">
                      CONFORME • TRANSPORT PUBLIC AUTORISÉ
                    </h4>
                    <p className="text-[11px] text-blue-600/90 dark:text-blue-400">
                      Agrément actif et conforme au Décret Exécutif N° 12-230
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-blue-600 text-white font-mono text-xs font-bold shadow-sm">
                  100% LÉGAL
                </span>
              </div>

              {/* Driver & Taxi Profile Header */}
              <div className="flex items-start space-x-4 border-b border-slate-200/80 dark:border-white/10 pb-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-blue-500 shadow-md bg-slate-100 dark:bg-slate-800">
                    <img 
                      src="/driver-avatar.svg" 
                      alt="Avatar Chauffeur Agréé" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-blue-600 text-white shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-base text-slate-900 dark:text-white">
                      {driver.fullName}
                    </h3>
                    <span className="text-xs font-mono font-bold text-amber-500">
                      ★ {driver.rating.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Artisan Taxieur Professionnel • Wilaya d'Alger (16)
                  </p>
                  <div className="flex items-center space-x-2 mt-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                      Matricule: {driver.licensePlate}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                      {driver.vehicleMake} {driver.vehicleModel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Regulatory Audit Checklist Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                {/* 1. Agrément de Transport */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="font-bold flex items-center space-x-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                      <span>Agrément de Transport</span>
                    </span>
                    <span className="text-blue-500 font-bold">Actif</span>
                  </div>
                  <div className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    N° {driver.agrementNumber}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Délivré par DTW Alger
                  </div>
                </div>

                {/* 2. Livret de Place */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="font-bold flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      <span>Livret de Place</span>
                    </span>
                    <span className="text-blue-500 font-bold">Valide</span>
                  </div>
                  <div className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    N° {driver.livretDePlaceNumber}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Validité: 31 Décembre 2026
                  </div>
                </div>

                {/* 3. Contrôle Technique */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="font-bold flex items-center space-x-1.5">
                      <Car className="w-3.5 h-3.5 text-blue-500" />
                      <span>Contrôle Technique</span>
                    </span>
                    <span className="text-blue-500 font-bold">&lt; 6 mois</span>
                  </div>
                  <div className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    PV N° CT-2026-98124
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Organisme: ENACTA Kouba
                  </div>
                </div>

                {/* 4. Assurance Commerciale */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="font-bold flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                      <span>Assurance Voyageurs</span>
                    </span>
                    <span className="text-blue-500 font-bold">À jour</span>
                  </div>
                  <div className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    Police CAAT N° 8812-B
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Couverture Personnes Transportées
                  </div>
                </div>

              </div>

              {/* Dashcam & Judicial Black Box Telemetry Heartbeat */}
              <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-2 border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="font-bold text-slate-200">Boîte Noire Télématique (Loi 25-11)</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    ENREGISTREMENT ACTIF (720p@15fps)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                  <div>Vitesse Actuelle: <span className="text-white font-bold">{driver.speedKmh} km/h</span></div>
                  <div>G-Force Capteur: <span className="text-white font-bold">0.98 G (Normal)</span></div>
                  <div>Position: <span className="text-white font-bold">{driver.currentLat.toFixed(4)}, {driver.currentLng.toFixed(4)}</span></div>
                </div>
              </div>

              {/* Cryptographic Seal */}
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
                <span>Certificat DTW ECDSA: 4f8a92...b71c0d (Signé électroniquement)</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">Anti-Fraude Garanti</span>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
