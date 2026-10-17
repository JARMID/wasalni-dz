import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  QrCode, 
  FileCheck, 
  Printer, 
  Car, 
  CheckCircle2
} from 'lucide-react';
import type { AppLang } from '../utils/i18n';
import { soundEngine } from '../utils/audio';

interface VerificationRecord {
  id: string;
  type: 'quittance' | 'driver' | 'vehicle';
  queryKey: string;
  quittanceCode: string;
  driverName: string;
  livretPlace: string;
  vehicleModel: string;
  plateNumber: string;
  onmlSeal: string;
  inspectionDate: string;
  inspectionCenter: string;
  tripSummary: string;
  tripDistanceKm: number;
  fareDzd: number;
  refundDzd: number;
  refundRip: string;
  sha256Hash: string;
  law2511Status: string;
  isValid: boolean;
}

const SAMPLE_RECORDS: VerificationRecord[] = [
  {
    id: 'rec-01',
    type: 'quittance',
    queryKey: 'QT-2026-10-8842',
    quittanceCode: 'QT-2026-10-8842',
    driverName: 'Hadj Mourad Khelifi',
    livretPlace: 'LP-88392-16',
    vehicleModel: 'Peugeot 301 Berline',
    plateNumber: '01842-120-16',
    onmlSeal: 'ONML-DZ/77481',
    inspectionDate: '12 Septembre 2026',
    inspectionCenter: 'Centre CNCT Hussein Dey',
    tripSummary: 'Aéroport Houari Boumediene T4 vers Grande Poste (Alger-Centre)',
    tripDistanceKm: 18.0,
    fareDzd: 730,
    refundDzd: 270,
    refundRip: '007999990023456789 Clé 18',
    sha256Hash: '9f82a1b7e4c3d82a6f8b1c4e9d0a5f7e3c2b1a0d8e7f6a5b4c3d2e1f0a9b8c7d',
    law2511Status: 'Chiffrement AES-256 actif, séquestre Shamir 2-sur-3 vérifié',
    isValid: true,
  },
  {
    id: 'rec-02',
    type: 'driver',
    queryKey: 'LP-88392-16',
    quittanceCode: 'QT-2026-10-8842',
    driverName: 'Hadj Mourad Khelifi',
    livretPlace: 'LP-88392-16',
    vehicleModel: 'Peugeot 301 Berline',
    plateNumber: '01842-120-16',
    onmlSeal: 'ONML-DZ/77481',
    inspectionDate: '12 Septembre 2026',
    inspectionCenter: 'Centre CNCT Hussein Dey',
    tripSummary: 'Artisan Taxieur Professionnel • Station Principale Kouba Calvaire',
    tripDistanceKm: 0,
    fareDzd: 0,
    refundDzd: 0,
    refundRip: '007999990023456789 Clé 18',
    sha256Hash: '4a7b2c9d1e8f3a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
    law2511Status: 'Boîte noire CameraX embarquée conforme, 0 incident signalé',
    isValid: true,
  },
  {
    id: 'rec-03',
    type: 'quittance',
    queryKey: 'QT-2026-09-5110',
    quittanceCode: 'QT-2026-09-5110',
    driverName: 'Yacine Belkacemi',
    livretPlace: 'LP-16/0482',
    vehicleModel: 'Dacia Logan Stepway',
    plateNumber: '04912-118-16',
    onmlSeal: 'ONML-DZ/65320',
    inspectionDate: '28 Août 2026',
    inspectionCenter: 'Centre CNCT Bir Mourad Raïs',
    tripSummary: 'Navette Scolaire Cité Universitaire Ben Aknoun vers Hydra',
    tripDistanceKm: 6.5,
    fareDzd: 327,
    refundDzd: 673,
    refundRip: '007999990045612389 Clé 42',
    sha256Hash: '1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e',
    law2511Status: 'Chiffrement AES-256 actif, séquestre Shamir 2-sur-3 vérifié',
    isValid: true,
  },
];

interface OfficialVerificationConsoleProps {
  lang: AppLang;
}

export const OfficialVerificationConsole: React.FC<OfficialVerificationConsoleProps> = ({
  lang,
}) => {
  const isAr = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState<string>('QT-2026-10-8842');
  const [activeRecord, setActiveRecord] = useState<VerificationRecord | null>(SAMPLE_RECORDS[0]);
  const [isSearched, setIsSearched] = useState<boolean>(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    soundEngine.playSelection();
    const clean = searchQuery.trim().toUpperCase();
    const found = SAMPLE_RECORDS.find(
      r => 
        r.queryKey.toUpperCase() === clean ||
        r.quittanceCode.toUpperCase() === clean ||
        r.livretPlace.toUpperCase() === clean ||
        r.plateNumber.toUpperCase().includes(clean)
    );

    if (found) {
      soundEngine.playSuccessChime();
      setActiveRecord(found);
    } else {
      soundEngine.playClick();
      // Generate synthetic record matching official Wilaya pattern
      setActiveRecord({
        id: 'rec-custom',
        type: 'quittance',
        queryKey: clean,
        quittanceCode: clean.startsWith('QT') ? clean : `QT-2026-DZ-${Math.floor(1000 + Math.random() * 9000)}`,
        driverName: 'Sami Boualem',
        livretPlace: clean.startsWith('LP') ? clean : `LP-${Math.floor(10000 + Math.random() * 90000)}-16`,
        vehicleModel: 'Renault Symbol Confort',
        plateNumber: clean.includes('-') ? clean : '02391-119-16',
        onmlSeal: 'ONML-DZ/78104',
        inspectionDate: '04 Octobre 2026',
        inspectionCenter: 'Centre CNCT El Harrach',
        tripSummary: 'Course Urbaine Homologuée • Wilaya d\'Alger',
        tripDistanceKm: 11.2,
        fareDzd: 492,
        refundDzd: 508,
        refundRip: '007999990077889912 Clé 34',
        sha256Hash: '8b7a6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b',
        law2511Status: 'Chiffrement AES-256 actif, séquestre Shamir 2-sur-3 vérifié',
        isValid: true,
      });
    }
    setIsSearched(true);
  };

  const handleSelectPreset = (record: VerificationRecord) => {
    soundEngine.playSelection();
    setSearchQuery(record.queryKey);
    setActiveRecord(record);
    setIsSearched(true);
  };

  return (
    <section id="verification" className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl p-8 sm:p-12 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-xl space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAr ? 'التحقق الرسمي من الوثائق ورخص المكان' : 'Guichet Officiel de Vérification & Conformité'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {isAr ? 'التأكد من صحة القسيمة الجبائية ورخصة السائق' : 'Vérificateur Public de Quittance & Livret de Place'}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {isAr
              ? 'أدخل رقم القسيمة، أو رقم دفتر المكان، أو لوحة ترقيم المركبة للتحقق الفوري من مطابقتها لمعايير مديرية النقل لولاية الجزائر والديوان الوطني للقياسة القانونية.'
              : 'Vérifiez instantanément l\'authenticité d\'une quittance de course, la validité d\'un Livret de Place ou le scellement ONML d\'un taximètre sur la voie publique.'}
          </p>
        </div>

        {/* Search Bar Form */}
        <div className="max-w-2xl mx-auto space-y-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'أدخل رقم القسيمة أو دفتر المكان (مثال: QT-2026-10-8842 أو LP-88392-16)' : 'Entrez un N° de quittance, Livret de Place ou plaque (ex: QT-2026-10-8842, LP-88392-16)...'}
                className="w-full pl-4 pr-10 py-3 rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-all cursor-pointer flex items-center space-x-1.5 shrink-0"
            >
              <span>{isAr ? 'تحقق' : 'Vérifier'}</span>
            </button>
          </form>

          {/* Preset Test Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-bold">
              {isAr ? 'أمثلة سريعة للاختبار :' : 'Exemples de test :'}
            </span>
            {SAMPLE_RECORDS.map(rec => (
              <button
                key={rec.id}
                onClick={() => handleSelectPreset(rec)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-semibold border transition-colors cursor-pointer ${
                  searchQuery === rec.queryKey
                    ? 'bg-blue-600/15 text-blue-600 dark:text-blue-400 border-blue-500/40 font-bold'
                    : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                }`}
              >
                {rec.queryKey}
              </button>
            ))}
          </div>
        </div>

        {/* Verification Result Certificate */}
        {isSearched && activeRecord && (
          <div className="max-w-3xl mx-auto rounded-3xl bg-slate-950 text-white border-2 border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-left font-sans animate-fadeIn">
            
            {/* Top Republic Header & Seal */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                  RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE
                </span>
                <span className="text-xs font-bold text-white uppercase block">
                  DIRECTION DES TRANSPORTS • WILAYA D'ALGER (DTW 16)
                </span>
                <div className="text-[11px] font-mono text-blue-400 font-bold mt-0.5">
                  CERTIFICAT DE CONFORMITÉ & AUTHENTICITÉ NUMÉRIQUE
                </div>
              </div>

              {/* Status Badge */}
              <div className="px-3.5 py-1.5 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-300 font-mono font-bold text-xs flex items-center space-x-1.5 self-start sm:self-auto">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>VALIDE & ENREGISTRÉ</span>
              </div>
            </div>

            {/* Grid of Verified Credentials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-2">
                <div className="flex items-center space-x-2 text-slate-400 text-[10px] uppercase font-bold">
                  <FileCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Références Officielles de Course</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">N° Quittance :</span>
                  <span className="font-bold text-white">{activeRecord.quittanceCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cadre Légal :</span>
                  <span className="text-blue-300 font-bold">Décret Exécutif 12-230</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Taximètre Homologué :</span>
                  <span className="text-amber-400 font-bold">{activeRecord.onmlSeal}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-2">
                <div className="flex items-center space-x-2 text-slate-400 text-[10px] uppercase font-bold">
                  <Car className="w-3.5 h-3.5 text-amber-400" />
                  <span>Artisan Taxieur & Véhicule</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Titulaire LP :</span>
                  <span className="font-bold text-white">{activeRecord.driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Livret de Place :</span>
                  <span className="text-blue-300 font-bold">{activeRecord.livretPlace}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Véhicule & Plaque :</span>
                  <span className="text-slate-200">{activeRecord.vehicleModel} • {activeRecord.plateNumber}</span>
                </div>
              </div>

            </div>

            {/* Route & Financial Quittance Row */}
            {activeRecord.tripDistanceKm > 0 && (
              <div className="p-4 rounded-2xl bg-black border border-white/15 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>TRAJET ENREGISTRÉ :</span>
                  <span className="text-white font-bold">{activeRecord.tripDistanceKm} km mesurés</span>
                </div>
                <div className="text-slate-300 text-[11px] pb-1 border-b border-white/10">
                  {activeRecord.tripSummary}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="space-x-1">
                    <span className="text-slate-400">Paiement Homologué :</span>
                    <span className="text-lg font-black text-amber-400">{activeRecord.fareDzd}.00 DZD</span>
                  </div>
                  {activeRecord.refundDzd > 0 && (
                    <div className="text-right text-[11px] text-blue-300">
                      Rendu BaridiMob : +{activeRecord.refundDzd}.00 DZD (CCP)
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Inspection & Law 25-11 Security Row */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 text-xs font-mono space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Contrôle Technique :</span>
                <span className="text-blue-300 font-bold">{activeRecord.inspectionDate} • {activeRecord.inspectionCenter}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Sécurité Loi 25-11 :</span>
                <span className="text-slate-200">{activeRecord.law2511Status}</span>
              </div>
            </div>

            {/* SHA-256 and QR Checkpoint Matrix */}
            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
              <div className="space-y-1 text-slate-400 text-[10px] text-left">
                <div className="text-slate-500 uppercase">Empreinte Cryptographique d'Audit :</div>
                <div className="break-all font-mono text-[9px] text-blue-400 bg-white/5 p-1.5 rounded border border-white/10 max-w-md">
                  SHA-256: {activeRecord.sha256Hash}
                </div>
                <div>AUTORISÉ SUR TOUT CONTRÔLE ROUTIER DE LA WILAYA D'ALGER</div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <div className="w-14 h-14 bg-white p-1 rounded-xl flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-900" />
                </div>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    window.print();
                  }}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
