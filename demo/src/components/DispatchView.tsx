import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  ShieldCheck, 
  Radio, 
  FileKey,
  KeyRound,
  Send,
  Server
} from 'lucide-react';
import type { DashcamIncident, DriverProfile, RideRequest } from '../types';
import { soundEngine } from '../utils/audio';

interface DispatchViewProps {
  incidents: DashcamIncident[];
  driver: DriverProfile;
  currentRide: RideRequest | null;
}

export const DispatchView: React.FC<DispatchViewProps> = ({
  incidents,
  driver,
  currentRide: _currentRide,
}) => {
  const [selectedIncident, setSelectedIncident] = useState<DashcamIncident | null>(
    incidents.length > 0 ? incidents[0] : null
  );
  const [requisitionSent, setRequisitionSent] = useState(false);

  const handleSelectIncident = (inc: DashcamIncident) => {
    soundEngine.playSelection();
    setSelectedIncident(inc);
    setRequisitionSent(false);
  };

  const handleSendRequisition = () => {
    soundEngine.playClick();
    setRequisitionSent(true);
    soundEngine.playSuccessChime();
    setTimeout(() => setRequisitionSent(false), 4000);
  };

  return (
    <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl p-6 space-y-6 max-w-5xl mx-auto border border-white/10">
      
      {/* Dispatch Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2.5">
            <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
            <h2 className="font-extrabold text-lg text-white">Centre de Contrôle & Sûreté • Wilaya d'Alger</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Supervision télématique 1Hz • Cadastre H3 Résolution 8 • Lockbox Judiciaire Chiffrée Loi 25-11
          </p>
        </div>

        {/* System KPIs */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="glass-pill px-3 py-1.5 rounded-xl border border-white/10 flex items-center space-x-2">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">MinIO Alger:</span>
            <span className="text-emerald-300 font-bold">Tier-3 Local</span>
          </div>

          <div className="glass-pill px-3 py-1.5 rounded-xl border border-white/10">
            <span className="text-slate-400">Taxis en Ligne:</span>{' '}
            <span className="text-emerald-300 font-bold">42 Véhicules</span>
          </div>

          <div className="glass-pill px-3 py-1.5 rounded-xl border border-white/10">
            <span className="text-slate-400">Incidents Verrouillés:</span>{' '}
            <span className={incidents.length > 0 ? 'text-rose-400 font-bold' : 'text-slate-300 font-bold'}>
              {incidents.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Incident Lockbox Evidence Panel (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Lockbox Évidences Dashcam (Chiffrement AES-256-GCM)</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Stockage Souverain Ben Aknoun</span>
          </div>

          {incidents.length === 0 ? (
            <div className="bg-slate-950/80 p-8 rounded-3xl border border-white/10 text-center space-y-2">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="font-bold text-white text-sm">Aucun Incident Actif dans le Registre</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                La télématique surveille en continu les capteurs accélérométriques G-Sensor (déclenchement automatique à 2.5G) et les signaux SOS.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {incidents.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => handleSelectIncident(inc)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedIncident?.id === inc.id
                      ? 'bg-rose-500/15 border-rose-500/60 shadow-xl shadow-rose-500/10'
                      : 'bg-slate-950/80 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-rose-500 text-white shadow-md">
                        {inc.triggerType === 'g_sensor_impact' ? 'CHOC 2.84G' : 'ALERTE SOS'}
                      </span>
                      <span className="font-mono text-xs font-bold text-white">{inc.id}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{inc.timestamp.slice(11, 19)} UTC</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                    <div>Chauffeur: <span className="font-bold text-white">{driver.fullName}</span></div>
                    <div>Agrément: <span className="text-amber-300">{driver.agrementNumber}</span></div>
                    <div>Véhicule: {driver.vehicleMake} ({driver.licensePlate})</div>
                    <div>Vitesse au choc: <span className="font-bold text-rose-400">{inc.speedKmh} km/h</span></div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <div className="flex items-center space-x-1.5 truncate">
                      <Lock className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                      <span className="truncate">Clé DEK: {inc.encryptionKeyId}</span>
                    </div>
                    <span className="text-emerald-300 font-bold flex-shrink-0 ml-2">Loi 25-11 Conforme</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Judicial Requisition Details Modal Card */}
          {selectedIncident && (
            <div className="bg-slate-950/90 p-5 rounded-3xl border border-white/10 space-y-3.5 text-xs font-mono">
              <div className="flex items-center justify-between text-amber-300 font-bold">
                <div className="flex items-center space-x-2">
                  <FileKey className="w-4 h-4 text-amber-400" />
                  <span>Protocole de Réquisition Judiciaire (Gendarmerie / DGSN)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-400/15 text-amber-300 border border-amber-400/30">
                  Shamir 2-sur-3
                </span>
              </div>

              {/* Shamir 2-of-3 Split Status */}
              <div className="grid grid-cols-3 gap-2 text-[10px] text-center">
                <div className="p-2 rounded-xl bg-white/5 border border-emerald-500/30 text-emerald-300">
                  <div className="font-bold flex items-center justify-center space-x-1">
                    <KeyRound className="w-3 h-3" />
                    <span>Part 1: Police DTW</span>
                  </div>
                  <div className="text-[9px] text-emerald-400 mt-0.5">Authentifié</div>
                </div>

                <div className="p-2 rounded-xl bg-white/5 border border-emerald-500/30 text-emerald-300">
                  <div className="font-bold flex items-center justify-center space-x-1">
                    <KeyRound className="w-3 h-3" />
                    <span>Part 2: DPO Plateforme</span>
                  </div>
                  <div className="text-[9px] text-emerald-400 mt-0.5">Scellé</div>
                </div>

                <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400">
                  <div className="font-bold flex items-center justify-center space-x-1">
                    <KeyRound className="w-3 h-3" />
                    <span>Part 3: Magistrat</span>
                  </div>
                  <div className="text-[9px] text-slate-500 mt-0.5">Sur Mandat</div>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                Le flux vidéo scellé (SHA-256) est conservé sur infrastructure locale algérienne. L'accès aux images non floutées requiert l'association de 2 parts cryptographiques conformément à l'article 31 de la Loi 25-11.
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-[10px] text-slate-400">Dossier d'Incident: {selectedIncident.id}</span>
                <button
                  onClick={handleSendRequisition}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-sans font-bold text-xs transition-colors shadow-lg shadow-amber-400/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{requisitionSent ? 'Dossier Transmis au Parquet' : 'Notifier le Parquet'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Fleet Compliance & DTW Registry (1 col) */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Fiche Réglementaire Chauffeur</span>
          </h3>

          <div className="bg-slate-950/90 p-4 rounded-3xl border border-white/10 space-y-3">
            <div className="text-center pb-3 border-b border-white/10">
              <img
                src={driver.photoUrl}
                alt={driver.fullName}
                className="w-16 h-16 rounded-2xl object-cover mx-auto mb-2 border-2 border-amber-400 shadow-lg"
              />
              <h4 className="font-extrabold text-sm text-white">{driver.fullName}</h4>
              <p className="text-[11px] text-slate-400 font-mono">Agrément Municipal DTW Alger</p>
            </div>

            <div className="text-xs font-mono space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Numéro d'Agrément:</span>
                <span className="font-bold text-amber-300">{driver.agrementNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Livret de Place:</span>
                <span className="font-bold text-white">{driver.livretDePlaceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Immatriculation:</span>
                <span className="font-bold text-amber-300">{driver.licensePlate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Casier Judiciaire:</span>
                <span className="font-bold text-emerald-300">Bulletin N° 3 Conforme</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Contrôle Technique:</span>
                <span className="font-bold text-emerald-300">Valide (Jusqu'en 2027)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assurance Taxi:</span>
                <span className="font-bold text-emerald-300">Tous Risques Commerciale</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 text-center">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                100% CONFORME DÉCRET 12-230
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
