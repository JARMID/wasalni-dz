import React, { useState, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, 
  MapPin, 
  Coins, 
  ArrowRight, 
  Smartphone, 
  Navigation, 
  Layers, 
  Video, 
  Download, 
  Clock, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  Lock, 
  Radio 
} from 'lucide-react';
import type { AppLang } from '../utils/i18n';
import type { ActiveTab } from './Header';
import { soundEngine } from '../utils/audio';

export interface LocationHub {
  id: string;
  nameFr: string;
  nameAr: string;
  commune: string;
  lat: number;
  lng: number;
}

export const ALGIERS_HUBS: LocationHub[] = [
  {
    id: 'aeroport',
    nameFr: 'Aéroport International Houari Boumediene (T4)',
    nameAr: 'مطار هواري بومدين الدولي (المحطة 4)',
    commune: 'Dar El Beïda',
    lat: 36.6961,
    lng: 3.2158,
  },
  {
    id: 'grande-poste',
    nameFr: 'Grande Poste (Alger Centre)',
    nameAr: 'البريد المركزي (الجزائر الوسطى)',
    commune: 'Alger-Centre',
    lat: 36.7729,
    lng: 3.0583,
  },
  {
    id: 'hydra',
    nameFr: 'Hydra (Place El Qods / Ambassades)',
    nameAr: 'حيدرة (ساحة القدس / السفارات)',
    commune: 'Hydra',
    lat: 36.7456,
    lng: 3.0417,
  },
  {
    id: 'kouba',
    nameFr: 'Kouba (Place Centrale / Mairie)',
    nameAr: 'القبة (الساحة المركزية / البلدية)',
    commune: 'Kouba',
    lat: 36.7262,
    lng: 3.0872,
  },
  {
    id: 'bab-ezzouar',
    nameFr: 'Bab Ezzouar (Université USTHB / Centre d\'Affaires)',
    nameAr: 'باب الزوار (جامعة هواري بومدين / حي الأعمال)',
    commune: 'Bab Ezzouar',
    lat: 36.7120,
    lng: 3.1810,
  },
  {
    id: 'cheraga',
    nameFr: 'Chéraga (Centre d\'Affaires Dounia)',
    nameAr: 'الشراقة (مركز الأعمال دنيا)',
    commune: 'Chéraga',
    lat: 36.7680,
    lng: 2.9550,
  },
  {
    id: 'bab-el-oued',
    nameFr: 'Bab El Oued (Place Triolet / Hôpital)',
    nameAr: 'باب الواد (ساحة تريولي / المستشفى)',
    commune: 'Bab El Oued',
    lat: 36.7865,
    lng: 3.0592,
  },
  {
    id: 'sidi-abdellah',
    nameFr: 'Sidi Abdellah (Pôle Technologique)',
    nameAr: 'سيدي عبد الله (القطب التكنولوجي)',
    commune: 'Mahelma',
    lat: 36.6710,
    lng: 2.8590,
  },
  {
    id: 'caroubier',
    nameFr: 'Gare Routière Centrale du Caroubier',
    nameAr: 'المحطة البرية المركزية الخروبة',
    commune: 'Hussein Dey',
    lat: 36.7388,
    lng: 3.1098,
  },
];

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const r = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLine = r * c;
  // Road network winding factor in Algiers terrain (avg 1.34x)
  return Math.max(2.5, Math.round(straightLine * 1.34 * 10) / 10);
}

interface HeroRealExperienceProps {
  lang: AppLang;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenAppModal: () => void;
  onOpenDriverModal: () => void;
}

export type StageTab = 'passenger' | 'cockpit' | 'telemetry';

export const HeroRealExperience: React.FC<HeroRealExperienceProps> = ({
  lang,
  onNavigateTab,
  onOpenAppModal,
  onOpenDriverModal,
}) => {
  const isAr = lang === 'ar';
  const originSelectId = useId();
  const destSelectId = useId();

  // Selected Hubs
  const [originId, setOriginId] = useState<string>('kouba');
  const [destId, setDestId] = useState<string>('grande-poste');

  // Interactive Stage Tab: Passenger App, Cockpit & Dashcam, or Telemetry
  const [stageTab, setStageTab] = useState<StageTab>('passenger');

  // Interactive Live Trip Simulation State inside Passenger Mockup
  const [tripState, setTripState] = useState<'approaching' | 'en_route' | 'completed'>('approaching');

  // Interactive Dashcam Crash Simulation State inside Cockpit Mockup
  const [crashIncidentActive, setCrashIncidentActive] = useState<boolean>(false);

  // Selected Commune for Telematics Tab
  const [activeCommune, setActiveCommune] = useState<string>('Alger-Centre');

  // Interactive Live Vehicle Animation
  const [vehicleProgress, setVehicleProgress] = useState<number>(38);
  const [meterTicker, setMeterTicker] = useState<number>(450);

  const originHub = ALGIERS_HUBS.find(h => h.id === originId) || ALGIERS_HUBS[3];
  const destHub = ALGIERS_HUBS.find(h => h.id === destId) || ALGIERS_HUBS[1];
  const distanceKm = calculateDistanceKm(originHub.lat, originHub.lng, destHub.lat, destHub.lng);
  
  // Executive Decree 12-230 Formula: 100 DA Flag Drop + 35 DA / KM
  const calculatedFare = Math.round((100 + distanceKm * 35) / 10) * 10;
  const estimatedDuration = Math.round(distanceKm * 1.6 + 4);

  // Smooth vehicle loop along polyline
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicleProgress(prev => {
        if (tripState === 'completed') return 100;
        return prev >= 96 ? 4 : prev + 0.8;
      });
      if (tripState === 'en_route') {
        setMeterTicker(prev => prev + 1);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [tripState]);

  // Update meter ticker when fare changes or reset
  useEffect(() => {
    setMeterTicker(calculatedFare);
  }, [calculatedFare, tripState]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        {/* LEFT COLUMN: VALUE PROPOSITION, OFFICIAL TARIFF CALCULATOR & CONVERSION */}
        <div className="lg:col-span-6 text-left space-y-6">
          
          {/* Sovereign Regulatory Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-mono">
              {isAr ? 'الجمهورية الجزائرية • ولاية الجزائر • المرسوم التنفيذي 12-230' : 'Réglementation Wilaya d\'Alger • Décret Exécutif 12-230'}
            </span>
          </motion.div>

          {/* Main Headline: Solid, Bold, Razor-Sharp (Zero Gradient Text AI Trope) */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-[1.12] text-slate-900 dark:text-white"
          >
            {isAr ? (
              <>
                أول شبكة رسمية لسيارات الأجرة،{' '}
                <span className="text-blue-600 dark:text-blue-400">
                  بالتسعيرة المقننة
                </span>
              </>
            ) : (
              <>
                Le taxi officiel d'Alger,{' '}
                <span className="text-blue-600 dark:text-blue-400">
                  au tarif réglementé.
                </span>
              </>
            )}
          </motion.h1>

          {/* Subtitle in Clean Humanizer Prose (Zero AI Clichés) */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed"
          >
            {isAr ? (
              'احجز حرفي سيارة أجرة حائز على دفتر مقاعد رسمي في ثوانٍ. عداد كيلومتري مطابق للقانون، حماية كاملة للمسار، واسترجاع فوري لفكة الرد في حسابك بريدي موب دون وساطة.'
            ) : (
              'Commandez un artisan taxieur titulaire d\'un Livret de Place vérifié en quelques secondes. Compteur kilométrique homologué, zéro mauvaise surprise sous la pluie, et remboursement instantané de votre monnaie sur compte BaridiMob.'
            )}
          </motion.p>

          {/* REAL-TIME INTERACTIVE FARE ESTIMATOR CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="p-5 sm:p-6 rounded-2xl bg-white/85 dark:bg-slate-900/85 border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  {isAr ? 'حاسبة التسعيرة الرسمية الفورية' : 'Calculateur de Tarif Officiel en Direct'}
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20">
                100 DA + 35 DA/km
              </span>
            </div>

            {/* Quick Hub Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Departure */}
              <div className="space-y-1.5">
                <label htmlFor={originSelectId} className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span>{isAr ? 'نقطة الانطلاق :' : 'Lieu de départ :'}</span>
                </label>
                <select
                  id={originSelectId}
                  value={originId}
                  onChange={(e) => {
                    soundEngine.playSelection();
                    setOriginId(e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white/70 dark:bg-slate-950/70 text-slate-900 dark:text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {ALGIERS_HUBS.map(hub => (
                    <option key={`orig-${hub.id}`} value={hub.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {isAr ? hub.nameAr : hub.nameFr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination */}
              <div className="space-y-1.5">
                <label htmlFor={destSelectId} className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center space-x-1.5">
                  <Navigation className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isAr ? 'الوجهة المقصودة :' : 'Destination :'}</span>
                </label>
                <select
                  id={destSelectId}
                  value={destId}
                  onChange={(e) => {
                    soundEngine.playSelection();
                    setDestId(e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white/70 dark:bg-slate-950/70 text-slate-900 dark:text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {ALGIERS_HUBS.map(hub => (
                    <option key={`dest-${hub.id}`} value={hub.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {isAr ? hub.nameAr : hub.nameFr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Hub Shortcut Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                {isAr ? 'مسارات شائعة:' : 'Destinations directes:'}
              </span>
              {[
                { id: 'aeroport', label: 'Aéroport T4' },
                { id: 'grande-poste', label: 'Grande Poste' },
                { id: 'hydra', label: 'Hydra' },
                { id: 'kouba', label: 'Kouba' },
                { id: 'bab-ezzouar', label: 'Bab Ezzouar' },
              ].map(chip => (
                <button
                  key={chip.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setDestId(chip.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                    destId === chip.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Tariff Breakdown & Total Display */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-500/20 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
                  {isAr ? 'المسافة والوقت التقديري :' : 'Trajet & Durée Estimée :'}
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2 pt-0.5">
                  <span>{distanceKm} km</span>
                  <span>•</span>
                  <span>~{estimatedDuration} min</span>
                  <span>•</span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono text-[11px]">Rocade d'Alger</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
                  {isAr ? 'السعر المقنن (عداد رسمي) :' : 'Total Garanti Décret 12-230 :'}
                </div>
                <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400 tracking-tight">
                  {calculatedFare} <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">DZD</span>
                </div>
              </div>
            </div>

            {/* Estimator Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onOpenAppModal();
                }}
                className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Smartphone className="w-3.5 h-3.5 text-white" />
                <span>{isAr ? 'طلب التاكسي على هاتفك' : 'Commander sur Smartphone'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  onNavigateTab('sync');
                }}
                className="py-3 px-4 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
                title="Accéder au simulateur technique multi-écrans pour présentations"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isAr ? 'عرض المختبر المتزامن' : 'Démo Multi-Écrans'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              </button>
            </div>
          </motion.div>

          {/* Live Telemetry Metric Strip */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1"
          >
            <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md">
              <div className="text-lg font-black text-slate-900 dark:text-white font-mono">57 / 57</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {isAr ? 'بلدية مغطاة' : 'Communes Alger'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md">
              <div className="text-lg font-black text-amber-500 font-mono">1 420+</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {isAr ? 'سائق بدفتر مكان' : 'Artisans Agréés'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md">
              <div className="text-lg font-black text-blue-600 dark:text-blue-400 font-mono">100%</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {isAr ? 'مطابق للقانون' : 'Décret 12-230'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md">
              <div className="text-lg font-black text-cyan-500 font-mono">0.00 DA</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {isAr ? 'صرف مفقود' : 'Monnaie Perdue'}
              </div>
            </div>
          </motion.div>

          {/* App Stores & Direct APK Badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-2 flex flex-wrap items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400"
          >
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {isAr ? 'تحميل مباشر :' : 'Disponible sur smartphone :'}
            </span>

            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenAppModal();
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
              <span className="font-medium text-slate-800 dark:text-slate-200">Google Play</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenAppModal();
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
              <span className="font-medium text-slate-800 dark:text-slate-200">App Store</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenAppModal();
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>APK Direct Android (28 MB)</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenDriverModal();
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold transition-colors cursor-pointer"
            >
              <Car className="w-3.5 h-3.5" />
              <span>{isAr ? 'فضاء السائقين الحرفيين' : 'Espace Chauffeurs Agréés'}</span>
            </button>
          </motion.div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE 3D DUAL-DEVICE SHOWCASE STAGE */}
        <div className="lg:col-span-6 relative flex flex-col items-center py-4">
          
          {/* Interactive Stage Mode Switcher (Passenger Smartphone vs Cockpit Dashcam HUD vs Telemetry) */}
          <div className="w-full max-w-[480px] mb-4 p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-900/90 border border-slate-300 dark:border-white/10 backdrop-blur-xl flex items-center justify-between shadow-lg">
            <button
              onClick={() => {
                soundEngine.playSelection();
                setStageTab('passenger');
              }}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                stageTab === 'passenger'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{isAr ? 'تطبيق الراكب' : 'App Passager'}</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playSelection();
                setStageTab('cockpit');
              }}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                stageTab === 'cockpit'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'كاميرا وقمرة السائق' : 'Cockpit & Dashcam'}</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playSelection();
                setStageTab('telemetry');
              }}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                stageTab === 'telemetry'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isAr ? 'تغطية العاصمة' : 'Télématique'}</span>
            </button>
          </div>

          {/* SPATIAL STAGE DISPLAY */}
          <div 
            className="relative w-full max-w-[480px] min-h-[580px] flex items-center justify-center"
            style={{ perspective: '1200px' }}
          >
            
            <AnimatePresence mode="wait">
              {/* TAB 1: PASSENGER SMARTPHONE (IPHONE 16 PRO) */}
              {stageTab === 'passenger' && (
                <motion.div
                  key="stage-passenger"
                  initial={{ opacity: 0, scale: 0.96, rotateY: 8 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.96, rotateY: -8 }}
                  transition={{ duration: 0.4 }}
                  className="relative z-20 w-[300px] sm:w-[325px] rounded-[44px] p-3.5 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border-4 border-slate-700/80 shadow-2xl backdrop-blur-2xl"
                  style={{
                    boxShadow: '0 30px 60px -15px rgba(37, 99, 235, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.15)'
                  }}
                >
                  {/* Titanium Edge Glint */}
                  <div className="absolute inset-0 rounded-[40px] pointer-events-none border border-white/20" />

                  {/* Phone Display Screen */}
                  <div className="relative rounded-[32px] overflow-hidden bg-slate-950 text-white min-h-[560px] flex flex-col justify-between border border-slate-900">
                    
                    {/* Dynamic Island / Status Bar */}
                    <div className="pt-2 px-5 flex items-center justify-between text-[11px] font-semibold text-slate-400 z-30">
                      <span>12:30</span>
                      <div className="w-24 h-5 rounded-full bg-black flex items-center justify-center space-x-1.5 border border-white/10 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[8px] font-mono text-white">WASSLANI</span>
                      </div>
                      <div className="flex items-center space-x-1 text-[10px]">
                        <span>5G</span>
                        <span className="font-bold">98%</span>
                      </div>
                    </div>

                    {/* Simulated Algiers Map Graphic Area */}
                    <div className="relative flex-1 bg-slate-950 overflow-hidden flex flex-col justify-between p-3.5">
                      {/* Subtle Street Grid */}
                      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:18px_18px]" />
                      
                      {/* Vector Coastline Graphic */}
                      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 300 400">
                        <path 
                          d="M 0 120 Q 80 160, 160 140 T 300 180 L 300 0 L 0 0 Z" 
                          fill="#0369a1" 
                        />
                        <text x="180" y="80" fill="#38bdf8" fontSize="11" fontWeight="bold" letterSpacing="2">BAIE D'ALGER</text>
                      </svg>

                      {/* Top Floating Origin/Dest Pill */}
                      <div className="relative z-10 p-2.5 rounded-xl bg-slate-900/95 border border-white/10 shadow-lg backdrop-blur-md space-y-1 text-left">
                        <div className="flex items-center space-x-2 text-[10px]">
                          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                          <span className="text-slate-300 font-bold truncate">{originHub.nameFr.split('(')[0]}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px]">
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                          <span className="text-slate-100 font-bold truncate">{destHub.nameFr.split('(')[0]}</span>
                        </div>
                      </div>

                      {/* Glowing Animated Route Polyline */}
                      <div className="relative z-10 my-auto py-2">
                        <svg viewBox="0 0 260 180" className="w-full h-36 overflow-visible">
                          <defs>
                            <linearGradient id="heroStageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#2563EB" />
                              <stop offset="50%" stopColor="#06B6D4" />
                              <stop offset="100%" stopColor="#F59E0B" />
                            </linearGradient>
                          </defs>

                          {/* Route Path */}
                          <path 
                            d="M 30 140 C 60 80, 180 150, 230 40" 
                            fill="none" 
                            stroke="#1e293b" 
                            strokeWidth="8" 
                            strokeLinecap="round" 
                          />
                          <path 
                            d="M 30 140 C 60 80, 180 150, 230 40" 
                            fill="none" 
                            stroke="url(#heroStageGradient)" 
                            strokeWidth="5" 
                            strokeLinecap="round" 
                            strokeDasharray="8 4"
                          />

                          {/* Node Origin */}
                          <circle cx="30" cy="140" r="8" fill="#2563EB" stroke="#ffffff" strokeWidth="2" />

                          {/* Node Destination */}
                          <circle cx="230" cy="40" r="8" fill="#F59E0B" stroke="#ffffff" strokeWidth="2" />

                          {/* Moving Taxi Vehicle Marker with Radar Beacon */}
                          {(() => {
                            const t = vehicleProgress / 100;
                            const p0 = { x: 30, y: 140 };
                            const p1 = { x: 60, y: 80 };
                            const p2 = { x: 180, y: 150 };
                            const p3 = { x: 230, y: 40 };

                            const cx = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x;
                            const cy = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y;

                            return (
                              <g transform={`translate(${cx}, ${cy})`}>
                                <circle cx="0" cy="0" r="16" fill="rgba(245, 158, 11, 0.25)" className="animate-ping" />
                                <circle cx="0" cy="0" r="11" fill="#F59E0B" stroke="#0F172A" strokeWidth="2" />
                                <Car className="w-3.5 h-3.5 text-slate-950" x="-7" y="-7" />
                              </g>
                            );
                          })()}
                        </svg>
                      </div>

                      {/* Dynamic ETA / Status Float Badge */}
                      <div className="relative z-10 self-center px-3 py-1 rounded-full bg-slate-900/90 border border-blue-500/30 text-[11px] font-mono font-bold flex items-center space-x-1.5 shadow-md">
                        {tripState === 'approaching' && (
                          <>
                            <Clock className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-blue-400">Arrivée taxi : 3 min</span>
                          </>
                        )}
                        {tripState === 'en_route' && (
                          <>
                            <Activity className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                            <span className="text-amber-400">En course • Vitesse 52 km/h</span>
                          </>
                        )}
                        {tripState === 'completed' && (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-blue-400">Course terminée • Quittance émise</span>
                          </>
                        )}
                      </div>

                    </div>

                    {/* Bottom Slide-Up Ride Sheet */}
                    <div className="p-4 bg-slate-900 border-t border-white/10 rounded-t-[28px] space-y-3 text-left">
                      
                      {tripState === 'approaching' && (
                        <>
                          {/* Driver Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2.5">
                              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 font-black text-xs flex items-center justify-center">
                                MK
                              </div>
                              <div>
                                <div className="font-extrabold text-xs text-white flex items-center space-x-1">
                                  <span>Mourad Khelifi</span>
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold">DTW 16</span>
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  Peugeot 301 Taxi Jaune • ★ 4.98
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-[9px] text-slate-400 block uppercase font-mono">Code PIN</span>
                              <span className="text-xs font-mono font-black text-amber-400 bg-black/60 px-2 py-0.5 rounded border border-white/10">
                                7842
                              </span>
                            </div>
                          </div>

                          {/* Certified Fare Footer */}
                          <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 flex items-center justify-between">
                            <div>
                              <span className="text-[9px] text-slate-400 uppercase block">Tarif Compteur</span>
                              <span className="text-base font-mono font-black text-blue-400">
                                {calculatedFare} DA
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] text-slate-400 uppercase block">Monnaie BaridiMob</span>
                              <span className="text-xs font-bold text-amber-400">
                                Rendu Automatique
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                soundEngine.playClick();
                                setTripState('en_route');
                              }}
                              className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
                            >
                              <span>Simuler le Départ (PIN 7842) →</span>
                            </button>
                            <button
                              onClick={() => {
                                soundEngine.playClick();
                                onOpenAppModal();
                              }}
                              className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center cursor-pointer"
                              title="Télécharger l'Application"
                            >
                              <Smartphone className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}

                      {tripState === 'en_route' && (
                        <>
                          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase font-mono block">En direction de :</span>
                              <span className="text-xs font-black text-white">{destHub.nameFr.split('(')[0]}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 uppercase font-mono block">Taximètre en direct</span>
                              <span className="text-lg font-mono font-black text-amber-400">{meterTicker} DA</span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              soundEngine.playSuccessChime();
                              setTripState('completed');
                            }}
                            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-blue-600/30"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Simuler l'Arrivée à Destination →</span>
                          </button>
                        </>
                      )}

                      {tripState === 'completed' && (
                        <>
                          <div className="p-3 rounded-xl bg-black/90 border border-amber-500/30 space-y-2 text-xs font-mono">
                            <div className="flex justify-between text-slate-300">
                              <span>Total Décret 12-230 :</span>
                              <span className="font-bold text-white">{calculatedFare}.00 DZD</span>
                            </div>
                            <div className="flex justify-between text-slate-400 text-[11px]">
                              <span>Espèces Remises :</span>
                              <span>1 000.00 DZD</span>
                            </div>
                            <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 flex justify-between text-amber-400 font-bold">
                              <span>Rendu BaridiMob :</span>
                              <span>+{1000 - calculatedFare}.00 DZD CCP</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                soundEngine.playClick();
                                setTripState('approaching');
                              }}
                              className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
                            >
                              <span>Réinitialiser la course ↺</span>
                            </button>
                            <button
                              onClick={() => {
                                soundEngine.playClick();
                                onOpenAppModal();
                              }}
                              className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                            >
                              <Smartphone className="w-3.5 h-3.5" />
                              <span>Télécharger l'App</span>
                            </button>
                          </div>
                        </>
                      )}

                    </div>

                  </div>

                </motion.div>
              )}

              {/* TAB 2: DRIVER COCKPIT & CAMERAX DASHCAM HUD */}
              {stageTab === 'cockpit' && (
                <motion.div
                  key="stage-cockpit"
                  initial={{ opacity: 0, scale: 0.96, rotateY: -8 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.96, rotateY: 8 }}
                  transition={{ duration: 0.4 }}
                  className="relative z-20 w-full max-w-[440px] rounded-2xl p-4 bg-slate-950/95 border border-slate-700/80 shadow-2xl backdrop-blur-2xl text-left"
                >
                  {/* Cockpit Tablet Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/10 text-xs font-mono">
                    <span className="flex items-center space-x-1.5 text-amber-400 font-bold">
                      <Video className="w-3.5 h-3.5 animate-pulse" />
                      <span>CAMERAX 720P • BOÎTE NOIRE</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-blue-600/20 text-blue-300 font-bold border border-blue-500/30">
                      LOI 25-11 CONFORME
                    </span>
                  </div>

                  {/* Dashcam Optical Viewfinder Simulation */}
                  <div className={`h-44 my-3 rounded-xl bg-slate-900 border relative overflow-hidden flex flex-col justify-between p-3 transition-colors ${
                    crashIncidentActive ? 'border-amber-500 bg-amber-950/30 animate-pulse' : 'border-white/10'
                  }`}>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 pointer-events-none" />
                    
                    {/* Viewfinder Grid */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
                    
                    {/* Telemetry HUD Top */}
                    <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-300">
                      <span className="text-amber-400 flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span>REC 30 FPS • SHA-256</span>
                      </span>
                      <span>BUFFER CIRCULAIRE : 30s</span>
                    </div>

                    {/* Artificial Horizon / G-Force Crosshair or Emergency Box */}
                    <div className="relative z-10 my-auto text-center">
                      {crashIncidentActive ? (
                        <div className="p-2 rounded-xl bg-black/90 border border-amber-500 text-amber-400 font-mono text-[11px] space-y-0.5">
                          <div className="font-bold flex items-center justify-center space-x-1 text-xs">
                            <span>⚠️ DÉCÉLÉRATION 2.84 G DÉTECTÉE</span>
                          </div>
                          <div className="text-[9px] text-slate-300">SÉQUESTRE LOI 25-11 : BUFFER 30S SCELLÉ AES-256-GCM</div>
                          <div className="text-[9px] text-blue-400 font-bold">QUORUM SHAMIR 2-SUR-3 VERROUILLÉ</div>
                        </div>
                      ) : (
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black/70 border border-white/20 text-slate-200 font-mono text-[10px]">
                          <span>ALGER ROCHET SUD</span>
                          <span>•</span>
                          <span className="text-blue-400 font-bold">0.18 G LATÉRAL</span>
                        </div>
                      )}
                    </div>

                    {/* Telemetry HUD Bottom */}
                    <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-300">
                      <span>GPS: 36.7538°N, 3.0588°E</span>
                      <span className="text-amber-400 font-bold text-sm">
                        {crashIncidentActive ? '0 KM/H (ARRÊT)' : '48 KM/H'}
                      </span>
                    </div>
                  </div>

                  {/* Digital LED Taximeter Display */}
                  <div className="p-3 rounded-xl bg-black border border-white/15 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">
                        Compteur Fiscal Décret 12-230
                      </span>
                      <div className="text-2xl font-black font-mono text-amber-400 tracking-wider">
                        {calculatedFare}.00 <span className="text-xs text-white">DZD</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">
                        Prise en Charge
                      </span>
                      <div className="text-xs font-black font-mono text-blue-400">
                        +100.00 DA
                      </div>
                    </div>
                  </div>

                  {/* BaridiMob Instant Change Refund Pill */}
                  <div className="mt-3 p-2.5 rounded-xl bg-blue-900/30 border border-blue-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 text-blue-200">
                      <Coins className="w-4 h-4 text-blue-400" />
                      <span>Rendu sur billet 1000 DA :</span>
                    </div>
                    <span className="font-mono font-bold text-blue-400 text-sm">+{1000 - calculatedFare} DA CCP</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-3 pt-2 border-t border-white/10 flex gap-2">
                    <button
                      onClick={() => {
                        soundEngine.playCrashSonar();
                        setCrashIncidentActive(!crashIncidentActive);
                      }}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer ${
                        crashIncidentActive
                          ? 'bg-slate-800 text-white hover:bg-slate-700'
                          : 'bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30'
                      }`}
                    >
                      <span>{crashIncidentActive ? 'Réarmer la boîte noire ↺' : 'Simuler Décélération 2.84 G ⚠️'}</span>
                    </button>

                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        onNavigateTab('driver');
                      }}
                      className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
                    >
                      <Car className="w-3.5 h-3.5" />
                      <span>Cockpit Démo →</span>
                    </button>
                  </div>

                </motion.div>
              )}

              {/* TAB 3: TELEMETRY & NETWORK RADAR */}
              {stageTab === 'telemetry' && (
                <motion.div
                  key="stage-telemetry"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4 }}
                  className="relative z-20 w-full max-w-[440px] rounded-2xl p-4 bg-slate-950/95 border border-slate-700/80 shadow-2xl backdrop-blur-2xl text-left space-y-3.5"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-mono">
                    <span className="flex items-center space-x-1.5 text-cyan-400 font-bold">
                      <Radio className="w-3.5 h-3.5 animate-pulse" />
                      <span>RÉSEAU TÉLÉMATIQUE H3 • WILAYA D'ALGER</span>
                    </span>
                    <span className="text-slate-400 text-[10px]">DTW 16</span>
                  </div>

                  {/* Commune Selector Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {['Alger-Centre', 'Bab Ezzouar', 'Kouba', 'Hydra', 'Chéraga'].map(commune => (
                      <button
                        key={commune}
                        onClick={() => {
                          soundEngine.playClick();
                          setActiveCommune(commune);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-colors cursor-pointer border ${
                          activeCommune === commune
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {commune}
                      </button>
                    ))}
                  </div>

                  {/* Coverage Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                      <span className="text-[10px] text-slate-400 block uppercase">Flotte {activeCommune}</span>
                      <span className="text-lg font-bold text-white">
                        {activeCommune === 'Alger-Centre' ? '142 Taxis' : 
                         activeCommune === 'Bab Ezzouar' ? '118 Taxis' :
                         activeCommune === 'Kouba' ? '96 Taxis' :
                         activeCommune === 'Hydra' ? '84 Taxis' : '105 Taxis'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                      <span className="text-[10px] text-slate-400 block uppercase">Temps Réponse</span>
                      <span className="text-lg font-bold text-cyan-400">
                        {activeCommune === 'Alger-Centre' ? '< 3.2 min' : 
                         activeCommune === 'Bab Ezzouar' ? '< 3.8 min' :
                         activeCommune === 'Kouba' ? '< 4.1 min' :
                         activeCommune === 'Hydra' ? '< 3.5 min' : '< 4.4 min'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                      <span className="text-[10px] text-slate-400 block uppercase">Latence H3</span>
                      <span className="text-lg font-bold text-amber-400">180 ms</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                      <span className="text-[10px] text-slate-400 block uppercase">Chiffrement</span>
                      <span className="text-lg font-bold text-blue-400">AES-256 GCM</span>
                    </div>
                  </div>

                  {/* Shamir & Law 25-11 Status */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center space-x-1.5">
                        <Lock className="w-3.5 h-3.5 text-blue-400" />
                        <span>Clés Shamir 2-of-3 (Accréditation DTW)</span>
                      </span>
                      <span className="font-mono text-blue-400 font-bold">SCELLÉ</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>Hébergement Souverain Local (Loi 25-11)</span>
                      </span>
                      <span className="font-mono text-blue-400 font-bold">100% DZ</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      onNavigateTab('dispatch');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-blue-600/30"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Ouvrir la Salle des Opérations DTW →</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* PERMANENT DEMO & PRESENTATION LAUNCH CARD */}
          <div className="w-full max-w-[480px] mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-amber-950/40 border border-amber-500/30 text-left space-y-2 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {isAr ? 'المختبر التفاعلي المتزامن للتقييم' : 'Espace Évaluation & Présentation :'}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                3 ÉCRANS LIVE
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isAr 
                ? 'اختبر المحاكاة الشاملة المتزامنة في الوقت الفعلي (لوحة تحكم السائق مع الكاميرا، هاتف الزبون، وغرفة المراقبة المركزية).'
                : 'Testez la synchronisation en direct entre le Cockpit Chauffeur (avec dashcam CameraX), le Smartphone Passager et la Salle de Dispatching.'}
            </p>
            <button
              onClick={() => {
                soundEngine.playClick();
                onNavigateTab('sync');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Layers className="w-4 h-4 text-slate-950" />
              <span>{isAr ? 'فتح المحاكي المتزامن الكامل ←' : 'Lancer le Simulateur Multi-Écrans en Direct →'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
