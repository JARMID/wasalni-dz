import React, { useState, useEffect, useId } from 'react';
import { motion } from 'motion/react';
import { 
  Car, 
  MapPin, 
  ShieldCheck, 
  Coins, 
  ArrowRight, 
  Smartphone, 
  Navigation, 
  Layers, 
  Video, 
  Download, 
  Award,
  Clock,
  Sparkles
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
      setVehicleProgress(prev => (prev >= 96 ? 4 : prev + 0.8));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Update meter ticker when fare changes
  useEffect(() => {
    setMeterTicker(calculatedFare);
  }, [calculatedFare]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        
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

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-slate-900 dark:text-white"
          >
            {isAr ? (
              <>
                أول شبكة رسمية لسيارات الأجرة،{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-400 to-amber-500">
                  بالتسعيرة المقننة
                </span>
              </>
            ) : (
              <>
                Le taxi officiel d'Alger,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-400 to-amber-500">
                  au tarif réglementé
                </span>
              </>
            )}
          </motion.h1>

          {/* Subtitle in Clean Humanizer Prose */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed"
          >
            {isAr ? (
              'احجز حرفي سيارة أجرة حائز على دفتر مقاعد رسمي في ثوانٍ. عداد كيلومتري مطابق للقانون، حماية كاملة للمسار، واسترجاع تلقائي لفكة الرد في حسابك بريدي موب دون وساطة.'
            ) : (
              'Commandez un artisan taxieur titulaire d\'un Livret de Place vérifié en quelques secondes. Compteur kilométrique homologué, zéro surprise sous la pluie, et remboursement instantané de votre monnaie sur compte BaridiMob.'
            )}
          </motion.p>

          {/* REAL-TIME INTERACTIVE FARE ESTIMATOR CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="p-5 sm:p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
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
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
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
            <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-500/20 flex flex-wrap items-center justify-between gap-3">
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
                <span>{isAr ? 'عرض المختبر المتزامن' : 'Démo Multi-Écrans (Direct)'}</span>
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
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md">
              <div className="text-lg font-black text-slate-900 dark:text-white font-mono">57 / 57</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {isAr ? 'بلدية مغطاة' : 'Communes Alger'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md">
              <div className="text-lg font-black text-amber-500 font-mono">1 420+</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {isAr ? 'سائق بدفتر مكان' : 'Artisans Agréés'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md">
              <div className="text-lg font-black text-blue-600 dark:text-blue-400 font-mono">100%</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {isAr ? 'مطابق للقانون' : 'Décret 12-230'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md">
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

        {/* RIGHT COLUMN: TIER-1 ANTIGRAVITY DUAL-DEVICE SPATIAL STAGE */}
        <div className="lg:col-span-6 relative flex justify-center items-center py-6">
          
          {/* Spatial Floating Badge 1 (Top-Left) */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            className="absolute -top-4 left-0 sm:left-4 z-30 flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-amber-500/40 shadow-2xl backdrop-blur-xl"
          >
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-xs">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-left text-[11px]">
              <div className="font-bold text-slate-900 dark:text-white">Livret de Place LP-16-44021</div>
              <div className="text-amber-500 font-medium">Artisan Agréé Wilaya d'Alger</div>
            </div>
          </motion.div>

          {/* Spatial Floating Badge 2 (Top-Right) */}
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 5.2, ease: "easeInOut", delay: 0.5 }}
            className="absolute -top-3 right-0 sm:right-4 z-30 flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-blue-500/40 shadow-2xl backdrop-blur-xl"
          >
            <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-xs">
              <Coins className="w-4 h-4" />
            </div>
            <div className="text-left text-[11px]">
              <div className="font-bold text-slate-900 dark:text-white">Rendu de Monnaie CCP</div>
              <div className="text-blue-500 font-medium">Algérie Poste BaridiMob</div>
            </div>
          </motion.div>

          {/* PERSPECTIVE STAGE CONTAINER */}
          <div 
            className="relative w-full max-w-[460px] sm:max-w-[500px]"
            style={{ perspective: '1200px' }}
          >
            
            {/* LAYER 1 (BEHIND): FLOATING COCKPIT HUD TABLET CARD */}
            <motion.div
              animate={{ 
                y: [0, -6, 0],
                rotateZ: [0, 0.5, 0]
              }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute -right-2 sm:-right-8 top-12 z-10 w-[240px] sm:w-[280px] rounded-3xl p-4 bg-slate-950/95 border border-slate-700/80 shadow-2xl backdrop-blur-2xl text-left hidden sm:block"
              style={{
                transform: 'rotateY(-12deg) rotateX(6deg) translateZ(-40px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
              }}
            >
              {/* Cockpit Tablet Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[9px] font-mono text-slate-400">
                <span className="flex items-center space-x-1 text-amber-400 font-bold">
                  <Video className="w-3 h-3 animate-pulse" />
                  <span>CameraX 720p</span>
                </span>
                <span className="text-blue-400 font-bold">LOI 25-11</span>
              </div>

              {/* Viewfinder simulation */}
              <div className="h-20 my-2 rounded-xl bg-slate-900 border border-white/10 relative overflow-hidden flex flex-col justify-between p-2">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:12px_12px]" />
                <div className="relative z-10 flex justify-between text-[8px] font-mono text-slate-400">
                  <span>BUFFER: 30s SHA-256</span>
                  <span className="text-amber-400">REC ●</span>
                </div>
                <div className="relative z-10 text-center my-auto">
                  <span className="text-xs font-mono font-bold text-white tracking-widest">
                    ALGER ROCHET SUD
                  </span>
                </div>
                <div className="relative z-10 flex justify-between text-[8px] font-mono text-slate-400">
                  <span>GPS 36.7538°N</span>
                  <span>48 km/h</span>
                </div>
              </div>

              {/* Digital LED Taximeter Readout */}
              <div className="p-2.5 rounded-xl bg-black border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[8px] font-mono text-slate-400 block uppercase">Compteur Fiscal</span>
                  <div className="text-base font-black font-mono text-amber-400 tracking-wider">
                    {meterTicker}.00 <span className="text-[10px] text-white">DA</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-mono text-slate-400 block uppercase">Frais Approche</span>
                  <div className="text-xs font-black font-mono text-blue-400">
                    +100 DA
                  </div>
                </div>
              </div>

              {/* Instant BaridiMob Split Pill */}
              <div className="mt-2.5 p-2 rounded-xl bg-blue-900/30 border border-blue-500/30 flex items-center justify-between text-[10px]">
                <div className="flex items-center space-x-1.5 text-blue-300 font-medium">
                  <Coins className="w-3 h-3 text-blue-400" />
                  <span>Monnaie BaridiMob</span>
                </div>
                <span className="font-mono font-bold text-blue-400">+550 DA</span>
              </div>
            </motion.div>

            {/* LAYER 2 (FOREGROUND): ULTRA-REALISTIC SMARTPHONE MOCKUP (IPHONE 16 PRO) */}
            <motion.div
              animate={{ 
                y: [0, 6, 0]
              }}
              transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
              className="relative z-20 mx-auto w-[290px] sm:w-[320px] rounded-[48px] p-3.5 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border-4 border-slate-700/80 shadow-2xl backdrop-blur-2xl"
              style={{
                boxShadow: '0 30px 60px -15px rgba(37, 99, 235, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.15)'
              }}
            >
              {/* Titanium Edge Glint */}
              <div className="absolute inset-0 rounded-[44px] pointer-events-none border border-white/20" />

              {/* Phone Display Screen */}
              <div className="relative rounded-[36px] overflow-hidden bg-slate-950 text-white min-h-[580px] flex flex-col justify-between border border-slate-900">
                
                {/* Dynamic Island / Status Bar */}
                <div className="pt-2.5 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-400 z-30">
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
                <div className="relative flex-1 bg-slate-950 overflow-hidden flex flex-col justify-between p-4">
                  {/* Subtle Algiers Map Street Grid & Coastline */}
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
                  <div className="relative z-10 p-2.5 rounded-2xl bg-slate-900/90 border border-white/10 shadow-lg backdrop-blur-md space-y-1 text-left">
                    <div className="flex items-center space-x-2 text-[10px]">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-slate-300 font-bold truncate">{originHub.nameFr.split('(')[0]}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[10px]">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-slate-100 font-bold truncate">{destHub.nameFr.split('(')[0]}</span>
                    </div>
                  </div>

                  {/* Glowing Animated Route Polyline */}
                  <div className="relative z-10 my-auto py-2">
                    <svg viewBox="0 0 260 180" className="w-full h-36 overflow-visible">
                      <defs>
                        <linearGradient id="liveRouteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
                        stroke="url(#liveRouteGradient)" 
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
                        // Cubic bezier interpolation
                        const p0 = { x: 30, y: 140 };
                        const p1 = { x: 60, y: 80 };
                        const p2 = { x: 180, y: 150 };
                        const p3 = { x: 230, y: 40 };

                        const cx = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x;
                        const cy = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y;

                        return (
                          <g transform={`translate(${cx}, ${cy})`}>
                            {/* Pulsing Radar Ring */}
                            <circle cx="0" cy="0" r="16" fill="rgba(245, 158, 11, 0.25)" className="animate-ping" />
                            {/* Vehicle Dot */}
                            <circle cx="0" cy="0" r="11" fill="#F59E0B" stroke="#0F172A" strokeWidth="2" />
                            <Car className="w-3.5 h-3.5 text-slate-950" x="-7" y="-7" />
                          </g>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* ETA Float Badge */}
                  <div className="relative z-10 self-center px-3 py-1 rounded-full bg-slate-900/90 border border-blue-500/30 text-[11px] font-mono text-blue-400 font-bold flex items-center space-x-1.5 shadow-md">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Arrivée chauffeur : 3 min</span>
                  </div>

                </div>

                {/* Bottom Slide-Up Ride Sheet */}
                <div className="p-4 bg-slate-900 border-t border-white/10 rounded-t-[32px] space-y-3 text-left">
                  
                  {/* Driver Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 font-black text-xs flex items-center justify-center">
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
                  <div className="p-2.5 rounded-2xl bg-black/60 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">Tarif Compteur Fiscal</span>
                      <span className="text-lg font-mono font-black text-blue-400">
                        {calculatedFare} DA
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 uppercase block">Monnaie BaridiMob</span>
                      <span className="text-xs font-bold text-amber-400">
                        Automatique
                      </span>
                    </div>
                  </div>

                  {/* Primary Trigger */}
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      onOpenAppModal();
                    }}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-blue-600/25"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Ouvrir dans l'Application</span>
                  </button>

                </div>

              </div>

            </motion.div>

          </div>

          {/* Spatial Floating Badge 3 (Bottom-Left) */}
          <motion.div 
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-3 left-0 sm:left-4 z-30 flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-300 dark:border-white/10 shadow-2xl backdrop-blur-xl"
          >
            <div className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-left text-[11px]">
              <div className="font-bold text-slate-900 dark:text-white">Boîte Noire Judiciaire</div>
              <div className="text-slate-500 dark:text-slate-400">Chiffrement AES-256 Loi 25-11</div>
            </div>
          </motion.div>

          {/* Spatial Floating Badge 4 (Bottom-Right) */}
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 1.5 }}
            className="absolute -bottom-3 right-0 sm:right-4 z-30 flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-blue-500/30 shadow-2xl backdrop-blur-xl"
          >
            <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-xs">
              <Navigation className="w-4 h-4" />
            </div>
            <div className="text-left text-[11px]">
              <div className="font-bold text-slate-900 dark:text-white">57 Communes d'Alger</div>
              <div className="text-blue-500 font-medium">Cadastre Homologué DTW</div>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
};
