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
import type { DriverProfile, OfficialCitationPV } from '../types';
import { OfficialCitationModal } from './OfficialCitationModal';

export const WILAYAS_58: Record<string, string> = {
  '01': 'Adrar', '02': 'Chlef', '03': 'Laghouat', '04': 'Oum El Bouaghi', '05': 'Batna',
  '06': 'Béjaïa', '07': 'Biskra', '08': 'Béchar', '09': 'Blida', '10': 'Bouira',
  '11': 'Tamanrasset', '12': 'Tébessa', '13': 'Tlemcen', '14': 'Tiaret', '15': 'Tizi Ouzou',
  '16': 'Alger', '17': 'Djelfa', '18': 'Jijel', '19': 'Sétif', '20': 'Saïda',
  '21': 'Skikda', '22': 'Sidi Bel Abbès', '23': 'Annaba', '24': 'Guelma', '25': 'Constantine',
  '26': 'Médéa', '27': 'Mostaganem', '28': 'M\'Sila', '29': 'Mascara', '30': 'Ouargla',
  '31': 'Oran', '32': 'El Bayadh', '33': 'Illizi', '34': 'Bordj Bou Arréridj', '35': 'Boumerdès',
  '36': 'El Tarf', '37': 'Tindouf', '38': 'Tissemsilt', '39': 'El Oued', '40': 'Khenchela',
  '41': 'Souk Ahras', '42': 'Tipaza', '43': 'Mila', '44': 'Aïn Defla', '45': 'Naâma',
  '46': 'Aïn Témouchent', '47': 'Ghardaïa', '48': 'Relizane', '49': 'El M\'Ghair', '50': 'El Meniaa',
  '51': 'Ouled Djellal', '52': 'Bordj Baji Mokhtar', '53': 'Béni Abbès', '54': 'Timimoun',
  '55': 'Touggourt', '56': 'Djanet', '57': 'In Salah', '58': 'In Guezzam'
};

interface InspectorViewProps {
  driver: DriverProfile;
  lang: AppLang;
}

export const InspectorView: React.FC<InspectorViewProps> = ({ driver }) => {
  const [scannedPlate, setScannedPlate] = useState('10482-116-16');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'verified' | 'unverified' | null>('verified');
  const [offlineMode, setOfflineMode] = useState(false);
  const [inspectionIssued, setInspectionIssued] = useState(false);
  const [isCitationModalOpen, setIsCitationModalOpen] = useState(false);
  const [citationData, setCitationData] = useState<OfficialCitationPV>({
    pvNumber: 'PV-2026-16-0492',
    date: new Date().toLocaleDateString('fr-FR'),
    time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    wilayaCode: '16',
    wilayaName: 'Alger',
    location: 'Barrage Fixe DTW - Chevalley / Rocade Sud, Alger',
    driverName: driver.fullName,
    agrementNumber: driver.agrementNumber,
    licensePlate: scannedPlate,
    vehicleModel: `${driver.vehicleMake} ${driver.vehicleModel}`,
    infractionType: 'Défaut d\'étalonnage périodique du taximètre (Sceau ONML)',
    legalArticle: 'Décret 12-230 Art. 45 & Loi 01-13',
    fineAmountDzd: 5000.00,
    officerBadge: '16-BR-402',
    qrPayload: 'https://baridimob.poste.dz/pay?rip=00799999000123456789&amount=5000',
    ripCcpTresor: '007 99999 0001234567 89 (Recette des Impôts Alger)',
  });

  // Extract Wilaya Code from plate suffix
  const extractedWilayaCode = scannedPlate.trim().slice(-2);
  const resolvedWilayaName = WILAYAS_58[extractedWilayaCode] || 'Wilaya Non Reconnue';
  const isWilaya16 = extractedWilayaCode === '16';

  const handleSimulateScan = (plateOverride?: string) => {
    const targetPlate = plateOverride || scannedPlate;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const isKnown = targetPlate.includes('16') || targetPlate.includes('31') || targetPlate.includes('09');
      setScanResult(isKnown ? 'verified' : 'unverified');
    }, 600);
  };

  const handleIssueClearance = () => {
    setInspectionIssued(true);
    setTimeout(() => setInspectionIssued(false), 3000);
  };

  const handleOpenCitation = (type: string, article: string, fine: number) => {
    setCitationData({
      pvNumber: `PV-2026-16-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('fr-FR'),
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      wilayaCode: extractedWilayaCode,
      wilayaName: resolvedWilayaName,
      location: 'Point de Contrôle DTW - Rocade Sud, Chevalley, Alger',
      driverName: scanResult === 'verified' ? driver.fullName : 'Conducteur Clandestin Non Homologué',
      agrementNumber: scanResult === 'verified' ? driver.agrementNumber : 'NÉANT / FRAUDE DTW',
      licensePlate: scannedPlate,
      vehicleModel: scanResult === 'verified' ? `${driver.vehicleMake} ${driver.vehicleModel}` : 'Véhicule Particulier',
      infractionType: type,
      legalArticle: article,
      fineAmountDzd: fine,
      officerBadge: '16-BR-402',
      qrPayload: `https://baridimob.poste.dz/pay?rip=00799999000123456789&amount=${fine}`,
      ripCcpTresor: '007 99999 0001234567 89 (Recette des Impôts Alger)',
    });
    setIsCitationModalOpen(true);
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
                onClick={() => handleSimulateScan()}
                disabled={isScanning}
                className="mt-3 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isScanning ? 'Vérification...' : 'Simuler Scan QR Medallion'}</span>
              </button>
            </div>

            {/* Manual Plate Search Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Immatriculation & Wilaya</span>
                <span className="font-mono text-[10px] text-blue-500 font-bold">58 Wilayas</span>
              </label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={scannedPlate}
                    onChange={(e) => setScannedPlate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-mono font-bold text-sm text-slate-900 dark:text-white uppercase focus:outline-none focus:border-blue-500"
                    placeholder="10482-116-16"
                  />
                  <Car className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
                </div>
                <button
                  onClick={() => handleSimulateScan()}
                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Resolved Territorial Jurisdiction Badge */}
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs flex items-center justify-between">
                <span className="text-slate-500 font-mono text-[10px]">Territoire Décret 12-230 :</span>
                <span className={`font-mono font-bold text-[11px] ${
                  isWilaya16 ? 'text-blue-600 dark:text-blue-400' : 'text-amber-500'
                }`}>
                  Wilaya {extractedWilayaCode} ({resolvedWilayaName})
                </span>
              </div>

              {/* Quick Test Presets */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold block">Plaques d'essai rapide :</span>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                  <button
                    type="button"
                    onClick={() => { setScannedPlate('10482-116-16'); handleSimulateScan('10482-116-16'); }}
                    className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/20 text-left truncate cursor-pointer"
                  >
                    16 Alger (Urbain)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setScannedPlate('04829-122-31'); handleSimulateScan('04829-122-31'); }}
                    className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/20 text-left truncate cursor-pointer"
                  >
                    31 Oran (Inter-Wilaya)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setScannedPlate('08912-120-09'); handleSimulateScan('08912-120-09'); }}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 text-left truncate cursor-pointer"
                  >
                    09 Blida (Mitidja)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setScannedPlate('99999-000-00'); handleSimulateScan('99999-000-00'); }}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-left truncate cursor-pointer"
                  >
                    00 Inconnu (Alerte)
                  </button>
                </div>
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

              {/* Clearance Action Button */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleIssueClearance}
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md ${
                    inspectionIssued
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:opacity-90'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {inspectionIssued
                      ? 'Quittance Délivrée & Enregistrée au Fichier DTW'
                      : 'Délivrer Quittance de Contrôle Conforme'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenCitation('Défaut d\'étalonnage périodique du taximètre (Sceau ONML)', 'Décret 12-230 Art. 45 & Loi 01-13', 5000)}
                  className="w-full py-2.5 rounded-xl border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Dresser PV d'Infraction Forfaitaire (5 000 DA)</span>
                </button>
              </div>

              {/* Cryptographic Seal */}
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
                <span>Certificat DTW ECDSA: 4f8a92...b71c0d (Signé électroniquement)</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">Anti-Fraude Garanti</span>
              </div>

            </div>
          )}

          {scanResult === 'unverified' && (
            <div className="glass-panel p-6 rounded-3xl border-2 border-rose-500/50 shadow-2xl space-y-4 animate-scaleUp">
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center space-x-3 text-rose-600 dark:text-rose-400">
                <Car className="w-6 h-6 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-sm uppercase">Véhicule Non Homologué • Alerte Fourrière</h4>
                  <p className="text-[11px] text-rose-500">
                    Aucun agrément municipal ni livret de place valide dans la base DTW Alger
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Plaque Contrôlée :</span>
                  <span className="font-bold text-rose-400">{scannedPlate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Statut Juridique :</span>
                  <span className="font-bold text-rose-400">Clandestin / Non Agréé</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mesure Réglementaire :</span>
                  <span className="font-bold text-amber-400">Mise en Fourrière (Décret 12-230 Art. 62)</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleOpenCitation('Activité de transport rémunéré sans agrément municipal préalable (Clandestin)', 'Loi 01-13 Art. 62 & Décret 12-230 Art. 62', 10000)}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Dresser Procès-Verbal & Mise en Fourrière (10 000 DA)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleIssueClearance()}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer"
                >
                  Transmettre Signalement au Poste Central
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Printable Official DTW Citation PV Modal */}
      <OfficialCitationModal
        isOpen={isCitationModalOpen}
        onClose={() => setIsCitationModalOpen(false)}
        citation={citationData}
      />

    </div>
  );
};

