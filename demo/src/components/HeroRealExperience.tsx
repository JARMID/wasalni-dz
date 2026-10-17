import React, { useState, useEffect, useId } from 'react';
import { motion } from 'motion/react';
import { 
  Car, 
  MapPin, 
  ShieldCheck, 
  Coins, 
  ArrowRight, 
  CheckCircle2, 
  Smartphone, 
  Navigation, 
  Layers, 
  Video, 
  Download, 
  AlertTriangle,
  RotateCcw,
  Award
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

  // Active showcase tab
  const [activeTab, setActiveTab] = useState<'rider' | 'driver' | 'baridimob' | 'decree'>('rider');

  // Rider Simulator State
  const [originId, setOriginId] = useState<string>('kouba');
  const [destId, setDestId] = useState<string>('grande-poste');
  const [rideState, setRideState] = useState<'idle' | 'searching' | 'assigned'>('idle');
  const [routeProgress, setRouteProgress] = useState<number>(0);

  // Driver Cockpit State
  const [meterValue, setMeterValue] = useState<number>(450);
  const [isCrashSimulated, setIsCrashSimulated] = useState<boolean>(false);

  // BaridiMob Calculator State
  const [cashBill, setCashBill] = useState<number>(1000);
  const rideFare = 450;
  const [baridiRefundStatus, setBaridiRefundStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const originHub = ALGIERS_HUBS.find(h => h.id === originId) || ALGIERS_HUBS[3];
  const destHub = ALGIERS_HUBS.find(h => h.id === destId) || ALGIERS_HUBS[1];
  const distanceKm = calculateDistanceKm(originHub.lat, originHub.lng, destHub.lat, destHub.lng);
  
  // Executive Decree 12-230 Formula: 100 DA Flag Drop + 35 DA / KM
  const calculatedFare = Math.round((100 + distanceKm * 35) / 10) * 10;
  const estimatedDuration = Math.round(distanceKm * 1.6 + 4);

  // Route animation effect when ride is assigned
  useEffect(() => {
    if (rideState === 'assigned') {
      const interval = setInterval(() => {
        setRouteProgress(prev => (prev >= 100 ? 0 : prev + 2));
      }, 120);
      return () => clearInterval(interval);
    } else {
      setRouteProgress(0);
    }
  }, [rideState]);

  const handleStartRide = () => {
    soundEngine.playClick();
    setRideState('searching');
    setTimeout(() => {
      soundEngine.playSuccessChime();
      setRideState('assigned');
    }, 900);
  };

  const handleCancelRide = () => {
    soundEngine.playClick();
    setRideState('idle');
  };

  const handleSimulateBaridiRefund = () => {
    soundEngine.playClick();
    setBaridiRefundStatus('sending');
    setTimeout(() => {
      soundEngine.playCashRegisterDing();
      setBaridiRefundStatus('success');
    }, 1000);
  };

  const handleSimulateCrash = () => {
    soundEngine.playCrashSonar();
    setIsCrashSimulated(true);
    setTimeout(() => {
      setIsCrashSimulated(false);
    }, 4500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        
        {/* LEFT COLUMN: REAL VALUE PROPOSITION & CONVERSION */}
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
              {isAr ? 'الجمهورية الجزائرية • ولاية الجزائر • المرسوم 12-230' : 'Réglementation Wilaya d\'Alger • Décret Exécutif 12-230'}
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
                أول شبكة سيارات أجرة معتمدة،{' '}
                <span className="text-blue-600 dark:text-blue-400">
                  بالتسعيرة الرسمية
                </span>
              </>
            ) : (
              <>
                Le taxi officiel d'Alger,{' '}
                <span className="text-blue-600 dark:text-blue-400">
                  au tarif réglementé
                </span>
              </>
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed"
          >
            {isAr ? (
              'احجز حرفي سيارة أجرة حائز على دفتر مكان رسمي في ثوانٍ. عداد كيلومتري مطابق للقانون، حماية كاملة للمسار، واسترجاع تلقائي لفكة الرد في حسابك بريدي موب.'
            ) : (
              'Commandez un artisan taxieur titulaire d\'un Livret de Place vérifié en quelques secondes. Compteur kilométrique homologué, zéro négociation sous la pluie, et remboursement instantané de votre monnaie sur compte BaridiMob.'
            )}
          </motion.p>

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

          {/* Action Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            {/* Primary CTA: Order or Open App */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onNavigateTab('rider');
              }}
              className="flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-white" />
              <span>{isAr ? 'طلب سيارة أجرة الآن' : 'Commander une Course'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Secondary CTA: Driver Recruitment */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenDriverModal();
              }}
              className="flex items-center space-x-2 px-5 py-3.5 rounded-2xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 font-bold text-sm text-amber-600 dark:text-amber-400 transition-all cursor-pointer"
            >
              <Car className="w-4 h-4" />
              <span>{isAr ? 'فضاء السائقين الحرفيين' : 'Espace Chauffeurs Agréés'}</span>
            </button>

            {/* Prominent Demo Switcher for Stakeholders & Presentations */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onNavigateTab('sync');
              }}
              className="flex items-center space-x-2 px-4 py-3 rounded-2xl border border-slate-300 dark:border-white/15 bg-white/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 transition-all cursor-pointer shadow-sm"
              title="Accéder au simulateur technique multi-écrans pour présentations"
            >
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              <span>{isAr ? 'مختبر العرض المتزامن' : 'Laboratoire Démo Multi-Écrans'}</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            </button>
          </motion.div>

          {/* App Stores & Direct APK Badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400"
          >
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {isAr ? 'تحميل مباشر :' : 'Disponible en téléchargement :'}
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
          </motion.div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE PRODUCT EXPERIENCE STAGE */}
        <div className="lg:col-span-6 relative">
          
          {/* Spatial Floating Badge 1 (Top-Left) */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            className="absolute -top-6 -left-4 z-20 hidden sm:flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-amber-500/40 shadow-xl backdrop-blur-xl"
          >
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-xs">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-left text-[11px]">
              <div className="font-bold text-slate-900 dark:text-white">Livret de Place N° 16/0894</div>
              <div className="text-amber-500 font-medium">Artisan Agréé DTW Alger</div>
            </div>
          </motion.div>

          {/* Spatial Floating Badge 2 (Top-Right) */}
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 5.2, ease: "easeInOut", delay: 0.5 }}
            className="absolute -top-5 -right-4 z-20 hidden sm:flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-blue-500/40 shadow-xl backdrop-blur-xl"
          >
            <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-xs">
              <Coins className="w-4 h-4" />
            </div>
            <div className="text-left text-[11px]">
              <div className="font-bold text-slate-900 dark:text-white">BaridiMob Monnaie Exacte</div>
              <div className="text-blue-500 font-medium">Recrédit Immédiat CCP</div>
            </div>
          </motion.div>

          {/* Main Stage Glass Box */}
          <div className="rounded-3xl p-5 sm:p-7 bg-white/85 dark:bg-slate-900/85 border border-slate-200/90 dark:border-white/10 shadow-2xl backdrop-blur-2xl relative">
            
            {/* 4-Tab Interactive Switcher Header */}
            <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-white/5 mb-5">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('rider');
                }}
                className={`flex-1 py-2 px-2 text-center rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 relative ${
                  activeTab === 'rider'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-md'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="truncate">{isAr ? 'حجز مسار' : 'Course Directe'}</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('driver');
                }}
                className={`flex-1 py-2 px-2 text-center rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 relative ${
                  activeTab === 'driver'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-md'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span className="truncate">{isAr ? 'لوحة القيادة' : 'Cockpit HUD'}</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('baridimob');
                }}
                className={`flex-1 py-2 px-2 text-center rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 relative ${
                  activeTab === 'baridimob'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-md'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span className="truncate">{isAr ? 'رد الفكة' : 'BaridiMob'}</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('decree');
                }}
                className={`flex-1 py-2 px-2 text-center rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 relative ${
                  activeTab === 'decree'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-md'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="truncate">{isAr ? 'المرسوم 12-230' : 'Tarifs DTW'}</span>
              </button>
            </div>

            {/* TAB CONTENT 1: RIDER DIRECT BOOKING INTERACTION */}
            {activeTab === 'rider' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 text-left"
              >
                {/* Route Selector Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor={originSelectId} className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span>{isAr ? 'نقطة الانطلاق' : 'Départ'}</span>
                    </label>
                    <select
                      id={originSelectId}
                      value={originId}
                      onChange={(e) => setOriginId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white/70 dark:bg-slate-950/70 text-slate-900 dark:text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      {ALGIERS_HUBS.map(hub => (
                        <option key={`orig-${hub.id}`} value={hub.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                          {isAr ? hub.nameAr : hub.nameFr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor={destSelectId} className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                      <Navigation className="w-3.5 h-3.5 text-amber-500" />
                      <span>{isAr ? 'الوجهة' : 'Destination'}</span>
                    </label>
                    <select
                      id={destSelectId}
                      value={destId}
                      onChange={(e) => setDestId(e.target.value)}
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

                {/* Animated Route Canvas Card */}
                <div className="h-44 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden flex flex-col justify-between p-4 shadow-inner">
                  {/* Grid background */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Top Status Header */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      <span>{rideState === 'assigned' ? (isAr ? 'الرحلة قيد التنفيذ' : 'Course En Cours') : (isAr ? 'مسار رسمي مباشر' : 'Tracé Réglementaire')}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded-md border border-white/10">
                      {distanceKm} km • ~{estimatedDuration} min
                    </span>
                  </div>

                  {/* SVG Route Trajectory Graphic */}
                  <div className="relative z-10 my-auto py-2">
                    <svg viewBox="0 0 400 60" className="w-full h-12 overflow-visible">
                      {/* Base Route Line */}
                      <path 
                        d="M 20 30 C 120 10, 260 50, 380 30" 
                        fill="none" 
                        stroke="#1e293b" 
                        strokeWidth="6" 
                        strokeLinecap="round" 
                      />
                      {/* Active Glowing Path */}
                      <path 
                        d="M 20 30 C 120 10, 260 50, 380 30" 
                        fill="none" 
                        stroke="url(#routeGradient)" 
                        strokeWidth="4" 
                        strokeLinecap="round" 
                        strokeDasharray="6 4"
                      />
                      <defs>
                        <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#2563EB" />
                          <stop offset="50%" stopColor="#F59E0B" />
                          <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>
                      </defs>

                      {/* Origin Node A */}
                      <circle cx="20" cy="30" r="10" fill="#2563EB" stroke="#ffffff" strokeWidth="2" />
                      <text x="20" y="34" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">A</text>

                      {/* Destination Node B */}
                      <circle cx="380" cy="30" r="10" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
                      <text x="380" y="34" fill="#F59E0B" fontSize="10" fontWeight="bold" textAnchor="middle">B</text>

                      {/* Moving Taxi Vehicle */}
                      <g transform={`translate(${20 + (360 * routeProgress) / 100}, ${30 + Math.sin((routeProgress / 100) * Math.PI) * -12})`}>
                        <circle cx="0" cy="0" r="12" fill="#F59E0B" />
                        <text x="0" y="3" fill="#0F172A" fontSize="10" fontWeight="black" textAnchor="middle">🚕</text>
                      </g>
                    </svg>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold px-1 mt-1">
                      <span className="truncate max-w-[140px]">{originHub.nameFr.split('(')[0]}</span>
                      <span className="truncate max-w-[140px] text-right">{destHub.nameFr.split('(')[0]}</span>
                    </div>
                  </div>

                  {/* Regulated Fare & Boarding PIN Footer */}
                  <div className="relative z-10 flex items-center justify-between pt-2 border-t border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 block">{isAr ? 'التسعيرة القانونية :' : 'Tarif officiel Décret 12-230 :'}</span>
                      <div className="font-mono font-black text-xl text-white">
                        {calculatedFare} <span className="text-xs text-blue-400 font-bold">DZD</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">{isAr ? 'رمز الركوب الأمني :' : 'Code PIN d\'embarquement :'}</span>
                      <span className="font-mono font-black text-amber-400 text-sm tracking-widest bg-slate-900 px-2 py-0.5 rounded border border-white/10">
                        4821
                      </span>
                    </div>
                  </div>

                </div>

                {/* Assigned Driver Card or Order Button */}
                {rideState === 'assigned' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-blue-500/30 flex items-center justify-between shadow-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-sm">
                        MB
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white flex items-center space-x-1.5">
                          <span>Mohamed Amine Benali</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">DTW 16-0814</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                          <span>★ 4.98</span>
                          <span>•</span>
                          <span>Peugeot 301 Taxi Jaune</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleCancelRide}
                      className="px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {isAr ? 'إلغاء' : 'Annuler'}
                    </button>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={handleStartRide}
                      disabled={rideState === 'searching'}
                      className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {rideState === 'searching' ? (
                        <>
                          <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>{isAr ? 'جارٍ تخصيص السائق...' : 'Recherche en cours...'}</span>
                        </>
                      ) : (
                        <>
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>{isAr ? 'تأكيد الحجز الفوري' : 'Confirmer la Réservation'}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onNavigateTab('rider')}
                      className="py-3 px-4 rounded-xl border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5 text-blue-500" />
                      <span>{isAr ? 'فتح التطبيق بالكامل' : 'Ouvrir l\'App Complète'}</span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB CONTENT 2: DRIVER COCKPIT & BLACK BOX */}
            {activeTab === 'driver' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 text-left"
              >
                {/* Simulated CameraX HUD Frame */}
                <div className="h-44 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden flex flex-col justify-between p-3.5 shadow-inner">
                  {/* Horizon / Road Vector Simulation */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                    <div className="w-full h-full bg-gradient-to-t from-slate-900 via-transparent to-slate-950" />
                    <div className="absolute w-2 h-20 bg-amber-400/80 -rotate-12 animate-pulse" />
                  </div>

                  {/* HUD Header */}
                  <div className="relative z-10 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-amber-400 flex items-center space-x-1 font-bold">
                      <Video className="w-3.5 h-3.5 animate-pulse" />
                      <span>REC • CameraX 720p@15fps</span>
                    </span>
                    <span className="text-slate-300 bg-slate-900/90 px-2 py-0.5 rounded border border-white/10">
                      GPS: 36.7538°N, 3.0588°E
                    </span>
                  </div>

                  {/* Center G-Force / Speed Readout */}
                  <div className="relative z-10 text-center my-auto">
                    <div className="text-3xl font-mono font-black text-white tracking-wider">
                      48 <span className="text-xs text-amber-400 font-bold">KM/H</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      ACCÉLÉRATION : {isCrashSimulated ? '2.84 G (CHOC DÉTECTÉ)' : '0.18 G (CONDUITE SOUPLE)'}
                    </div>
                  </div>

                  {/* Taximeter Overlay */}
                  <div className="relative z-10 flex items-center justify-between bg-black/80 px-3 py-2 rounded-xl border border-white/15">
                    <div>
                      <span className="text-[9px] text-slate-400 font-mono uppercase block">COMPTEUR DÉCRET 12-230</span>
                      <div className="font-mono font-black text-lg text-amber-400">
                        {meterValue}.00 <span className="text-xs text-white">DZD</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          setMeterValue(prev => prev + 50);
                        }}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-mono text-[10px] font-bold border border-white/10 cursor-pointer"
                      >
                        +50 DA
                      </button>
                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          setMeterValue(100);
                        }}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 font-mono text-[10px] border border-white/10 cursor-pointer"
                        title="Réinitialiser prise en charge"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Crash Simulation Feedback Banner */}
                {isCrashSimulated && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center space-x-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Boîte Noire Loi 25-11 : Séquence vidéo 30s scellée sous empreinte SHA-256 et transmise au serveur judiciaire.</span>
                  </motion.div>
                )}

                {/* Cockpit Actions */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={handleSimulateCrash}
                    className="py-2.5 px-3 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-bold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Simuler Choc 2.84G</span>
                  </button>

                  <button
                    onClick={() => onNavigateTab('driver')}
                    className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-blue-600/20"
                  >
                    <Car className="w-3.5 h-3.5" />
                    <span>Ouvrir Cockpit Plein Écran</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT 3: BARIDIMOB CASH REFUND INNOVATION */}
            {activeTab === 'baridimob' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 text-left"
              >
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>Montant de la course :</span>
                    <span className="font-mono text-base text-slate-900 dark:text-white font-black">{rideFare} DZD</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                      <span>Billet remis en espèces :</span>
                      <span className="font-mono font-bold text-amber-500">{cashBill} DZD</span>
                    </div>
                    <div className="flex gap-2">
                      {[500, 1000, 2000].map(val => (
                        <button
                          key={`bill-${val}`}
                          onClick={() => {
                            soundEngine.playClick();
                            setCashBill(val);
                            setBaridiRefundStatus('idle');
                          }}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                            cashBill === val
                              ? 'bg-amber-500 text-slate-950 border-amber-500'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-white/10'
                          }`}
                        >
                          {val} DA
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visual calculation box */}
                  <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-medium">
                        Reliquat rendu par BaridiMob :
                      </span>
                      <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
                        +{cashBill - rideFare} <span className="text-xs font-bold">DZD</span>
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                      <Coins className="w-5 h-5" />
                    </div>
                  </div>

                  {baridiRefundStatus === 'success' ? (
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-medium flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{cashBill - rideFare} DZD recrédités instantanément sur le compte BaridiMob du passager (Clé RIP validée).</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleSimulateBaridiRefund}
                      disabled={baridiRefundStatus === 'sending'}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {baridiRefundStatus === 'sending' ? (
                        <>
                          <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>Validation Algérie Poste...</span>
                        </>
                      ) : (
                        <>
                          <Coins className="w-3.5 h-3.5" />
                          <span>Simuler le Remboursement Immédiat</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT 4: EXECUTIVE DECREE 12-230 TARIFF GRID */}
            {activeTab === 'decree' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-3.5 text-left text-xs"
              >
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10 font-bold text-slate-800 dark:text-slate-200">
                    <span>Composante du Barème</span>
                    <span>Tarif Homologué</span>
                  </div>

                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Prise en charge officielle (Flag Drop)</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">100.00 DZD</span>
                  </div>

                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Tarif au kilomètre (Jour 06h - 20h)</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">35.00 DZD / km</span>
                  </div>

                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Tarif au kilomètre (Nuit 20h - 06h)</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">45.00 DZD / km</span>
                  </div>

                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Attente réglementaire (Heure creuse)</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">5.00 DZD / min</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-[11px] leading-relaxed">
                  <strong>Garantie Légalité :</strong> Aucun supplément non prévu par le Décret Exécutif 12-230 n'est autorisé. Les chauffeurs clandestins ou non agréés sont passibles de saisie administrative immédiate (mise en fourrière 30 jours).
                </div>
              </motion.div>
            )}

          </div>

          {/* Spatial Floating Badge 3 (Bottom-Left) */}
          <motion.div 
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-5 -left-4 z-20 hidden sm:flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-300 dark:border-white/10 shadow-xl backdrop-blur-xl"
          >
            <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-left text-[11px]">
              <div className="font-bold text-slate-900 dark:text-white">Boîte Noire Loi 25-11</div>
              <div className="text-slate-500 dark:text-slate-400">Chiffrement AES-256-GCM</div>
            </div>
          </motion.div>

          {/* Spatial Floating Badge 4 (Bottom-Right) */}
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 1.5 }}
            className="absolute -bottom-5 -right-4 z-20 hidden sm:flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-blue-500/30 shadow-xl backdrop-blur-xl"
          >
            <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-xs">
              <Navigation className="w-4 h-4" />
            </div>
            <div className="text-left text-[11px]">
              <div className="font-bold text-slate-900 dark:text-white">57 Communes Couvertes</div>
              <div className="text-blue-500 font-medium">Cadastre Wilaya d'Alger</div>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
};
