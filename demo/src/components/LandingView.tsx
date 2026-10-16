import React, { useState, useId } from 'react';
import { 
  Car, 
  MapPin, 
  ShieldCheck, 
  Coins, 
  ArrowRight, 
  CheckCircle2, 
  Calendar,
  HeartHandshake,
  QrCode,
  Download,
  Smartphone,
  Navigation,
  Clock,
  Sparkles,
  X,
  Building2,
  FileCheck2,
  ChevronDown,
  Layers,
  Video
} from 'lucide-react';
import type { AppLang } from '../utils/i18n';
import type { ActiveTab, BrandOption, GraphicsPalette } from './Header';
import { FluidShaderCanvas } from './FluidShaderCanvas';
import { FooterReveal } from './FooterReveal';
import { HeroScrollyStudio } from './HeroScrollyStudio';
import { HorizontalShowcase } from './HorizontalShowcase';
import { StickyStack } from './StickyStack';

interface LocationHub {
  id: string;
  nameFr: string;
  nameAr: string;
  commune: string;
  lat: number;
  lng: number;
}

const ALGIERS_HUBS: LocationHub[] = [
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

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

interface LandingViewProps {
  lang: AppLang;
  onNavigateTab: (tab: ActiveTab) => void;
  isDark?: boolean;
  brand?: BrandOption;
  onOpenLogoModal?: () => void;
  selectedLogoId?: string;
  selectedPalette?: GraphicsPalette;
  onSelectPalette?: (palette: GraphicsPalette) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  lang,
  onNavigateTab,
  isDark: _isDark,
  brand: _brand,
  onOpenLogoModal,
  selectedLogoId,
  selectedPalette,
  onSelectPalette,
}) => {
  const isAr = lang === 'ar';

  // Online Fare Estimator State
  const [originId, setOriginId] = useState<string>('aeroport');
  const [destinationId, setDestinationId] = useState<string>('grande-poste');
  const [serviceType, setServiceType] = useState<'compteur' | 'confort' | 'navette'>('compteur');
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [driverFormSubmitted, setDriverFormSubmitted] = useState(false);
  const [smsPhone, setSmsPhone] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [heroInteractiveTab, setHeroInteractiveTab] = useState<'passenger' | 'driver' | 'estimator'>('passenger');

  // Form field IDs for accessibility
  const originSelectId = useId();
  const destSelectId = useId();
  const smsInputId = useId();

  const originHub = ALGIERS_HUBS.find(h => h.id === originId) || ALGIERS_HUBS[0];
  const destHub = ALGIERS_HUBS.find(h => h.id === destinationId) || ALGIERS_HUBS[1];

  const estimatedDistance = calculateDistanceKm(
    originHub.lat, originHub.lng,
    destHub.lat, destHub.lng
  );

  // Regulatory Pricing Engine (Decret 12-230)
  // Flag drop (Prise en charge officielle): 100 DZD
  // Rate per KM: 35 DZD for standard taxi, 48 DZD for confort, 40 DZD for scheduled shuttle
  const flagDropDzd = 100;
  const ratePerKm = serviceType === 'compteur' ? 35 : serviceType === 'confort' ? 48 : 40;
  const rawFare = flagDropDzd + (estimatedDistance * ratePerKm);
  const estimatedFareDzd = Math.round(rawFare / 10) * 10;
  const estimatedDurationMin = Math.round(estimatedDistance * 1.6 + 4);

  const handleSwapLocations = () => {
    setOriginId(destinationId);
    setDestinationId(originId);
  };

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsPhone.trim()) return;
    setSmsSent(true);
    setTimeout(() => {
      setSmsSent(false);
      setSmsPhone('');
    }, 4000);
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* HERO SECTION: Dynamic WebGL Canvas + High-Converting Two-Column Marketing Grid */}
      <section className="relative pt-6 sm:pt-12 pb-16 overflow-hidden">
        
        {/* Three.js WebGL Fluid Shader Background Canvas */}
        <FluidShaderCanvas palette={selectedPalette} className="opacity-70 dark:opacity-85 pointer-events-none" />

        {/* Ambient Gradient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-r from-[var(--brand-primary)]/15 via-[var(--brand-accent)]/15 to-[var(--brand-primary)]/15 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Consumer Marketing Proposition & Direct Conversion */}
            <div className="lg:col-span-7 text-left space-y-6">
              
              {/* Official Algerian Regulatory Badge */}
              <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border glass-panel">
                <span className="w-2 h-2 rounded-full bg-[var(--brand-primary)] animate-pulse" />
                <span className="text-slate-800 dark:text-slate-200">
                  {isAr ? 'الجمهورية الجزائرية الديمقراطية الشعبية • ولاية الجزائر' : 'Réglementation Wilaya d\'Alger • Décret 12-230'}
                </span>
              </div>

              {/* Main Compelling Consumer Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-slate-900 dark:text-white">
                {isAr ? (
                  <>
                    سيارات الأجرة المعتمدة بالجزائر،{' '}
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
              </h1>

              {/* Subtitle with Zero Clichés, Authentic Consumer Value */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {isAr ? (
                  'احجز سيارة أجرة مرخصة في ثوانٍ. تسعيرة عداد واضحة، حماية كاملة، وسداد فوري للرصيد المتبقي عبر بريدي موب عند الدفع نقداً.'
                ) : (
                  'Commandez un artisan taxieur titulaire d\'un livret de place en quelques secondes. Compteur réglementaire certifié, zéro négociation de trottoir, et rendu automatique de votre monnaie par BaridiMob.'
                )}
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {/* Primary: Launch Live Synchronized Multi-Screen Demo */}
                <button
                  onClick={() => onNavigateTab('sync')}
                  className="flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  title="Ouvrir la démo multi-écrans en temps réel"
                >
                  <Layers className="w-4 h-4 text-white" />
                  <span>{isAr ? 'عرض المنصة التفاعلية المباشرة' : 'Lancer la Démo Multi-Appareils'}</span>
                  <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
                </button>

                {/* Secondary: Download App Modal */}
                <button
                  onClick={() => setIsAppModalOpen(true)}
                  className="flex items-center space-x-2 px-5 py-3.5 rounded-2xl border border-slate-300 dark:border-white/15 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 font-bold text-sm text-slate-800 dark:text-slate-200 transition-all cursor-pointer shadow-sm"
                >
                  <Smartphone className="w-4 h-4 text-blue-500" />
                  <span>{isAr ? 'تحميل التطبيق' : 'Télécharger l\'App'}</span>
                </button>

                {/* Tertiary: Driver Space */}
                <a
                  href="#drivers"
                  className="flex items-center space-x-2 px-5 py-3.5 rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-100/70 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 font-bold text-sm text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                >
                  <Car className="w-4 h-4 text-amber-500" />
                  <span>{isAr ? 'فضاء السائقين' : 'Espace Chauffeurs'}</span>
                </a>
              </div>

              {/* App Stores & Direct APK Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {isAr ? 'متوفر على:' : 'Disponible sur:'}
                  </span>
                </div>
                
                <button
                  onClick={() => setIsAppModalOpen(true)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                  <span className="font-medium text-slate-800 dark:text-slate-200">Google Play</span>
                </button>

                <button
                  onClick={() => setIsAppModalOpen(true)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                  <span className="font-medium text-slate-800 dark:text-slate-200">App Store</span>
                </button>

                <button
                  onClick={() => setIsAppModalOpen(true)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                  <span className="font-medium text-[var(--brand-primary)]">APK Direct Android</span>
                </button>
              </div>

              {/* 3 Core Trust Guarantees */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="glass-panel p-3.5 rounded-2xl border flex items-start space-x-2.5">
                  <ShieldCheck className="w-5 h-5 text-[var(--brand-primary)] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      {isAr ? 'مطابق للمرسوم 12-230' : '100% Réglementé'}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isAr ? 'عداد قانوني معتمد' : 'Barème officiel DTW'}
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-3.5 rounded-2xl border flex items-start space-x-2.5">
                  <Coins className="w-5 h-5 text-[var(--brand-accent)] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      {isAr ? 'فكة الرد مضمونة' : 'Monnaie Exacte'}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isAr ? 'عبر حساب بريدي موب' : 'Recréditée BaridiMob'}
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-3.5 rounded-2xl border flex items-start space-x-2.5">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      {isAr ? 'سائقون محترفون' : 'Chauffeurs Agréés'}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isAr ? 'دفتر مكان رسمي' : 'Livret de place vérifié'}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Antigravity 3D Device Showcase (Passenger Smartphone, Driver Cockpit HUD, Fare Estimator) */}
            <div id="estimate" className="lg:col-span-5 relative">
              <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl">
                
                {/* 3-Tab Segmented Selector Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                  <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-white/5 w-full">
                    <button
                      onClick={() => setHeroInteractiveTab('passenger')}
                      className={`flex-1 py-1.5 px-2 text-center rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                        heroInteractiveTab === 'passenger'
                          ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تطبيق الراكب' : 'Passager'}</span>
                    </button>

                    <button
                      onClick={() => setHeroInteractiveTab('driver')}
                      className={`flex-1 py-1.5 px-2 text-center rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                        heroInteractiveTab === 'driver'
                          ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                      }`}
                    >
                      <Car className="w-3.5 h-3.5" />
                      <span>{isAr ? 'لوحة السائق' : 'Cockpit'}</span>
                    </button>

                    <button
                      onClick={() => setHeroInteractiveTab('estimator')}
                      className={`flex-1 py-1.5 px-2 text-center rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                        heroInteractiveTab === 'estimator'
                          ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                      }`}
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{isAr ? 'حاسبة التسعيرة' : 'Tarifs'}</span>
                    </button>
                  </div>
                </div>

                {/* TAB 1: PASSENGER SMARTPHONE 3D FRAME */}
                {heroInteractiveTab === 'passenger' && (
                  <div className="space-y-3.5 text-left animate-fadeIn">
                    <div className="rounded-[2.2rem] p-3.5 bg-slate-950 border-4 border-slate-800 shadow-2xl relative overflow-hidden">
                      
                      {/* Top Phone Speaker / Dynamic Notch */}
                      <div className="flex items-center justify-between px-3 py-1 mb-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400">14:32</span>
                        <div className="w-20 h-4 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse mr-1" />
                          <span className="text-[8px] font-mono text-slate-300">WASSLANI</span>
                        </div>
                        <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
                          <span>5G</span>
                          <span className="text-[9px]">100%</span>
                        </div>
                      </div>

                      {/* Simulated Interactive Map Mini-View */}
                      <div className="h-44 rounded-2xl bg-slate-900 border border-white/10 relative overflow-hidden flex flex-col justify-between p-3">
                        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:14px_14px]" />
                        
                        {/* Status Chip */}
                        <div className="relative z-10 flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-600/30 text-blue-300 border border-blue-500/40 flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                            <span>{isAr ? 'سائق معتمد في الطريق' : 'Chauffeur Agréé en approche'}</span>
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded-md border border-white/10">
                            ~ 4 min
                          </span>
                        </div>

                        {/* Route Line & Taxi Marker Simulation */}
                        <div className="relative z-10 my-auto flex items-center justify-between px-4">
                          <div className="flex flex-col items-center">
                            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shadow-lg shadow-blue-600/50">
                              A
                            </div>
                            <span className="text-[9px] text-slate-300 font-bold mt-1">Kouba</span>
                          </div>

                          <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-600 via-amber-400 to-sky-400 mx-2 relative flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md animate-bounce">
                              <Car className="w-3.5 h-3.5" />
                            </div>
                          </div>

                          <div className="flex flex-col items-center">
                            <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-200 border border-white/20 flex items-center justify-center text-[10px] font-bold">
                              B
                            </div>
                            <span className="text-[9px] text-slate-300 font-bold mt-1">G. Poste</span>
                          </div>
                        </div>

                        {/* Passenger Boarding PIN */}
                        <div className="relative z-10 flex items-center justify-between bg-slate-950/90 p-2 rounded-xl border border-white/10">
                          <span className="text-[10px] text-slate-400">{isAr ? 'رمز الركوب الأمني :' : 'Code PIN d\'embarquement :'}</span>
                          <span className="font-mono font-black text-amber-400 text-xs tracking-widest">4821</span>
                        </div>
                      </div>

                      {/* Driver Card */}
                      <div className="mt-3 p-3 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-xs">
                            KM
                          </div>
                          <div>
                            <div className="font-bold text-xs text-white flex items-center space-x-1.5">
                              <span>Karim M.</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">DTW 16-0814</span>
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                              <span>★ 4.96</span>
                              <span>•</span>
                              <span>Peugeot 301</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-mono font-black text-sm text-white">450 <span className="text-[10px] text-blue-400 font-bold">DZD</span></div>
                          <div className="text-[9px] text-slate-400">{isAr ? 'تسعيرة العداد' : 'Au compteur'}</div>
                        </div>
                      </div>

                    </div>

                    {/* Direct Launch Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => onNavigateTab('rider')}
                        className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-blue-600/25 cursor-pointer"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>{isAr ? 'فتح تطبيق الراكب' : 'Ouvrir l\'App Passager'}</span>
                      </button>

                      <button
                        onClick={() => onNavigateTab('sync')}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold text-xs transition-all flex items-center justify-center space-x-1.5 border border-slate-300 dark:border-white/10 cursor-pointer"
                      >
                        <Layers className="w-3.5 h-3.5 text-blue-500" />
                        <span>{isAr ? 'عرض الشاشات المتزامنة' : 'Démo Multi-Écrans'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: DRIVER TABLET COCKPIT & DASHCAM */}
                {heroInteractiveTab === 'driver' && (
                  <div className="space-y-3.5 text-left animate-fadeIn">
                    <div className="rounded-2xl p-3.5 bg-slate-950 border-4 border-slate-800 shadow-2xl relative overflow-hidden">
                      
                      {/* Tablet Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                          <span className="font-mono font-bold text-white text-[11px]">COCKPIT DTW 16-0814</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-blue-600/30 text-blue-300 border border-blue-500/30">
                          COMPTEUR HOMOLOGUÉ
                        </span>
                      </div>

                      {/* Simulated CameraX Dashcam Feed */}
                      <div className="h-44 my-2.5 rounded-xl bg-slate-900 border border-white/10 relative overflow-hidden flex flex-col justify-between p-3">
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 pointer-events-none" />
                        
                        {/* Dashcam Telemetry HUD Overlays */}
                        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-amber-400 flex items-center space-x-1">
                            <Video className="w-3 h-3" />
                            <span>REC • CameraX 720p</span>
                          </span>
                          <span className="text-white">48 KM/H</span>
                        </div>

                        {/* Artificial Horizon / G-Force Crosshair */}
                        <div className="relative z-10 my-auto text-center">
                          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/20 text-slate-300 font-mono text-[10px]">
                            <span>ACCÉLÉRATION : 0.18 G</span>
                            <span className="text-blue-400">(SEUIL SÉCURISÉ)</span>
                          </div>
                        </div>

                        {/* Taximeter Horokilométrique Readout */}
                        <div className="relative z-10 flex items-center justify-between bg-black/80 p-2.5 rounded-xl border border-white/15">
                          <div>
                            <div className="text-[9px] text-slate-400 font-mono uppercase">COMPTEUR DÉCRET 12-230</div>
                            <div className="font-mono font-black text-xl text-amber-400">790.00 <span className="text-xs text-white">DZD</span></div>
                          </div>
                          <div className="text-right text-[10px] font-mono text-slate-300">
                            <div>TARIF 1 (JOUR)</div>
                            <div className="text-blue-400">19.8 KM • 22 MIN</div>
                          </div>
                        </div>
                      </div>

                      {/* Sensor & Regulatory Status Bar */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                        <div className="p-2 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-between">
                          <span>THERMIQUE :</span>
                          <span className="text-blue-400 font-bold">36.4°C (NORMAL)</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-between">
                          <span>SHAMIR 2-OF-3 :</span>
                          <span className="text-blue-400 font-bold">VERROUILLÉ</span>
                        </div>
                      </div>

                    </div>

                    {/* Direct Launch Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => onNavigateTab('driver')}
                        className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-blue-600/25 cursor-pointer"
                      >
                        <Car className="w-3.5 h-3.5" />
                        <span>{isAr ? 'فتح قمرة السائق' : 'Ouvrir Cockpit Chauffeur'}</span>
                      </button>

                      <button
                        onClick={() => onNavigateTab('sync')}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold text-xs transition-all flex items-center justify-center space-x-1.5 border border-slate-300 dark:border-white/10 cursor-pointer"
                      >
                        <Layers className="w-3.5 h-3.5 text-blue-500" />
                        <span>{isAr ? 'عرض الشاشات المتزامنة' : 'Démo Multi-Écrans'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 3: LIVE FARE ESTIMATOR FORM */}
                {heroInteractiveTab === 'estimator' && (
                  <div className="space-y-4 text-left animate-fadeIn">
                    
                    {/* Estimator Card Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
                          {isAr ? 'حاسبة الأجرة الفورية' : 'Simulateur Officiel de Course'}
                        </span>
                        <h3 className="text-base font-black text-slate-900 dark:text-white">
                          {isAr ? 'احسب تسعيرة رحلتك بالجزائر' : 'Estimez votre trajet'}
                        </h3>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Navigation className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Service Mode Selector */}
                    <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5">
                      <button
                        onClick={() => setServiceType('compteur')}
                        className={`py-1.5 px-1.5 text-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          serviceType === 'compteur'
                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                        }`}
                      >
                        <span>{isAr ? 'تاكسي فردي' : 'Compteur'}</span>
                      </button>

                      <button
                        onClick={() => setServiceType('confort')}
                        className={`py-1.5 px-1.5 text-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          serviceType === 'confort'
                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                        }`}
                      >
                        <span>{isAr ? 'برلين راحة' : 'Confort'}</span>
                      </button>

                      <button
                        onClick={() => setServiceType('navette')}
                        className={`py-1.5 px-1.5 text-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          serviceType === 'navette'
                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                        }`}
                      >
                        <span>{isAr ? 'رحلة مبرمجة' : 'Navette'}</span>
                      </button>
                    </div>

                    {/* Origin Selector */}
                    <div className="space-y-1">
                      <label htmlFor={originSelectId} className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        <span>{isAr ? 'نقطة الانطلاق' : 'Point de départ'}</span>
                      </label>
                      <div className="relative">
                        <select
                          id={originSelectId}
                          value={originId}
                          onChange={(e) => setOriginId(e.target.value)}
                          className="w-full appearance-none px-3 py-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white/70 dark:bg-slate-950/70 text-slate-900 dark:text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                        >
                          {ALGIERS_HUBS.map(hub => (
                            <option key={`orig-${hub.id}`} value={hub.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                              {isAr ? hub.nameAr : hub.nameFr} ({hub.commune})
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Swap Hubs Button */}
                    <div className="flex justify-center -my-1.5 relative z-10">
                      <button
                        onClick={handleSwapLocations}
                        title="Inverser départ et arrivée"
                        className="p-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all cursor-pointer border border-slate-300 dark:border-white/10 shadow"
                      >
                        <ArrowRight className="w-3 h-3 rotate-90" />
                      </button>
                    </div>

                    {/* Destination Selector */}
                    <div className="space-y-1">
                      <label htmlFor={destSelectId} className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>{isAr ? 'الوجهة المقصودة' : 'Destination'}</span>
                      </label>
                      <div className="relative">
                        <select
                          id={destSelectId}
                          value={destinationId}
                          onChange={(e) => setDestinationId(e.target.value)}
                          className="w-full appearance-none px-3 py-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white/70 dark:bg-slate-950/70 text-slate-900 dark:text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                        >
                          {ALGIERS_HUBS.map(hub => (
                            <option key={`dest-${hub.id}`} value={hub.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                              {isAr ? hub.nameAr : hub.nameFr} ({hub.commune})
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Dynamic Calculated Fare Card */}
                    <div className="p-3.5 rounded-2xl bg-blue-600/10 dark:bg-blue-950/30 border border-blue-500/25 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                            {isAr ? 'الأجرة التقديرية الرسمية' : 'Tarif Légal Estimé'}
                          </span>
                          <div className="text-2xl font-black text-slate-900 dark:text-white flex items-baseline space-x-1">
                            <span>{estimatedFareDzd}</span>
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">DZD</span>
                          </div>
                        </div>

                        <div className="text-right space-y-0.5 text-xs">
                          <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-300 font-semibold justify-end text-xs">
                            <Navigation className="w-3 h-3 text-blue-500" />
                            <span>{estimatedDistance} km</span>
                          </div>
                          <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 justify-end text-xs">
                            <Clock className="w-3 h-3 text-amber-500" />
                            <span>~{estimatedDurationMin} min</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-slate-200/60 dark:border-white/10 text-[10px] text-slate-500 dark:text-slate-400">
                        {isAr 
                          ? 'يشمل رسم الانطلاق القانوني (100 دج) + التسعيرة الكيلومترية المعتمدة لولاية الجزائر.'
                          : 'Inclut la prise en charge légale (100 DZD) et le barème officiel au kilomètre selon le Décret 12-230.'}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => onNavigateTab('rider')}
                        className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-blue-600/25 cursor-pointer"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>{isAr ? 'طلب التاكسي الآن' : 'Commander en direct'}</span>
                      </button>

                      <button
                        onClick={() => onNavigateTab('sync')}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold text-xs transition-all flex items-center justify-center space-x-1.5 border border-slate-300 dark:border-white/10 cursor-pointer"
                      >
                        <Layers className="w-3.5 h-3.5 text-blue-500" />
                        <span>{isAr ? 'المنصة المتكاملة' : 'Démo Multi-Écrans'}</span>
                      </button>
                    </div>

                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: POURQUOI WASSLANI (4 Consumer Pillars) */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'مزايا الركاب والمواطنين' : 'Des Trajets Clairs et Sécurisés'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {isAr ? 'لماذا يفضل سكان العاصمة تطبيق وصلني ؟' : 'Le Transport Urbain Repensé pour Alger'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {isAr 
              ? 'حل جذري لمشاكل النقل اليومية : لا مساومة على السعر، لا أزمة في فكة الرد، وحماية قانونية كاملة.'
              : 'Une réponse concrète aux défis du quotidien : prix transparents au compteur, fin des soucis de monnaie, et chauffeurs professionnels déclarés.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1: Compteur Garanti */}
          <div className="glass-panel p-6 rounded-3xl border space-y-3 flex flex-col justify-between hover:border-[var(--brand-primary)]/40 transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center font-bold">
                <Navigation className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {isAr ? 'تسعيرة العداد القانوني' : 'Compteur Officiel Garanti'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isAr
                  ? 'لا مفاوضات ولا أسعار مفروضة على الرصيف. يطبق كل سائق التسعيرة المقننة بدقة وفق المرسوم التنفيذي 12-230.'
                  : 'Fini les prix fixés au hasard ou négociés sous la pluie. Chaque course applique strictement le barème kilométrique officiel homologué par la Wilaya d\'Alger.'}
              </p>
            </div>
            <div className="pt-2 flex items-center text-[11px] font-bold text-[var(--brand-primary)]">
              <span>{isAr ? '100 دج انطلاق + عداد' : 'Zéro surprise au tarif'}</span>
            </div>
          </div>

          {/* Pillar 2: Monnaie Exacte BaridiMob */}
          <div className="glass-panel p-6 rounded-3xl border space-y-3 flex flex-col justify-between hover:border-[var(--brand-accent)]/40 transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--brand-accent)]/10 text-[var(--brand-accent)] flex items-center justify-center font-bold">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {isAr ? 'استرجاع فوري لفكة الرد' : 'Monnaie Exacte BaridiMob'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isAr
                  ? 'إذا دفعتم بورقة نقدية ولم تتوفر القطع لدى السائق، يتم تحويل المبلغ المتبقي آلياً إلى حسابكم بريدي موب في ثوانٍ.'
                  : 'Si le chauffeur manque de pièces sur votre billet de 1000 ou 2000 DZD, le reliquat exact est recrédité directement sur votre compte BaridiMob sans friction.'}
              </p>
            </div>
            <div className="pt-2 flex items-center text-[11px] font-bold text-[var(--brand-accent)]">
              <span>{isAr ? 'وداعاً لمشكل الصرف' : 'Fini le manque de pièces'}</span>
            </div>
          </div>

          {/* Pillar 3: Chauffeurs Professionnels Agréés */}
          <div className="glass-panel p-6 rounded-3xl border space-y-3 flex flex-col justify-between hover:border-blue-500/40 transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {isAr ? 'سائقون معتمدون رسمياً' : 'Artisans Déclarés DTW'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isAr
                  ? 'جميع شركائنا حائزون على دفتر المكان والاعتماد الصادر عن مديرية النقل لولاية الجزائر. لا وجود للنقل السري غير المرخص.'
                  : 'Tous nos conducteurs sont des artisans taxieurs titulaires d\'un Livret de Place valide, vérifié par la Direction des Transports. Zéro clandestin, sécurité totale.'}
              </p>
            </div>
            <div className="pt-2 flex items-center text-[11px] font-bold text-blue-500">
              <span>{isAr ? 'فحص دوري للمركبات' : 'Livret de place vérifié'}</span>
            </div>
          </div>

          {/* Pillar 4: Paiement Proches & Navettes */}
          <div className="glass-panel p-6 rounded-3xl border space-y-3 flex flex-col justify-between hover:border-indigo-500/40 transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {isAr ? 'الدفع عن بعد للعائلة' : 'Paiement pour un Proche'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isAr
                  ? 'احجز وسدد رحلة والديك أو أبنائك عن بعد عبر البطاقة الذهبية أو بريدي موب، وتابع تنقلاتهم مباشرة على الخريطة.'
                  : 'Réglez à distance la course de vos parents ou de vos enfants depuis votre smartphone via CIB ou BaridiMob. Suivez leur déplacement en direct jusqu\'à bon port.'}
              </p>
            </div>
            <div className="pt-2 flex items-center text-[11px] font-bold text-indigo-500">
              <span>{isAr ? 'أمان واطمئنان للعائلة' : 'Sérénité familiale'}</span>
            </div>
          </div>

        </div>
      </section>

      {/* GSAP HORIZONTAL SHOWCASE: The 5 Decoupled Portals (Passager, Cockpit Chauffeur, DTW Dispatch, Grand Livre, Contrôle Routier) */}
      <HorizontalShowcase lang={lang} onNavigateTab={onNavigateTab} />

      {/* SCROLLYTELLING STUDIO: 3 Core Pillars with GSAP ScrollTrigger & Hotspots */}
      <HeroScrollyStudio lang={lang} onNavigateTab={onNavigateTab} />

      {/* SECTION 3: COMMENT ÇA MARCHE (3 Simple Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--brand-primary)]">
              {isAr ? 'خطوات بسيطة وسريعة' : 'Utilisation Intuitive'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {isAr ? 'كيف يعمل تطبيق وصلني ؟' : 'Votre Course en 3 Étapes'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
            
            {/* Step 1 */}
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-[var(--brand-primary)] text-white font-black text-xl flex items-center justify-center shadow-lg shadow-[var(--brand-primary)]/20">
                1
              </div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                {isAr ? 'حدد نقطة الانطلاق والوجهة' : 'Indiquez votre Destination'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs leading-relaxed">
                {isAr 
                  ? 'افتح التطبيق، اختر وجهتك، واطلع مسبقاً على التقدير الرسمي المعتمد للتكلفة.'
                  : 'Saisissez votre adresse de départ et d\'arrivée pour visualiser le tarif officiel calculé par le compteur.'}
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                2
              </div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                {isAr ? 'تأكيد السائق المعتمد' : 'Un Chauffeur Agréé Arrive'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs leading-relaxed">
                {isAr 
                  ? 'يقبل أقرب حرفي طاكسي طلبكم، وتتابعون مسار قدومه بالدقائق ورقم لوحته واسمه.'
                  : 'L\'artisan taxieur le plus proche accepte votre appel. Vous visualisez son identité, son véhicule et son heure d\'arrivée.'}
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-[var(--brand-accent)] text-white font-black text-xl flex items-center justify-center shadow-lg shadow-[var(--brand-accent)]/20">
                3
              </div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                {isAr ? 'الدفع براحة ودون قلق' : 'Paiement Transparent'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs leading-relaxed">
                {isAr 
                  ? 'ادفع نقداً مع استلام فكة الرد في حسابك، أو سدد مباشرة عبر بطاقتك البنكية أو بريدي موب.'
                  : 'Réglez en espèces avec rendu automatique de monnaie par BaridiMob, ou directement par carte CIB et Edahabia.'}
              </p>
            </div>

          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => setIsAppModalOpen(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-md"
            >
              <Smartphone className="w-4 h-4" />
              <span>{isAr ? 'ابدأ تجربتك الأولى الآن' : 'Essayer l\'Application WASSLANI'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* GSAP STICKY STACK: 3 Sovereign & Technological Pillars */}
      <StickyStack lang={lang} onNavigateTab={onNavigateTab} />

      {/* SECTION 4: ESPACE CHAUFFEURS ET ARTISANS TAXIEURS (#drivers) */}
      <section id="drivers" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-[var(--brand-primary)]/30 bg-gradient-to-br from-[var(--brand-primary)]/5 via-transparent to-[var(--brand-accent)]/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Driver Value Proposition */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] font-bold text-xs">
                <Car className="w-3.5 h-3.5" />
                <span>{isAr ? 'فضاء الحرفيين وسائقي الطاكسي (ولاية الجزائر)' : 'Espace Chauffeurs et Artisans Taxieurs'}</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                {isAr 
                  ? 'هل تمتلك رخصة مكان واعتماد رسمي؟ ضاعف دخلك في أمان تام' 
                  : 'Vous possédez un Agrément et un Livret de Place ?'}
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {isAr
                  ? 'انضم إلى شبكة وصلني الرسمية. استفد من عمولة منصفة (8% إلى 12%)، وحماية قانونية كاملة من المحشر، وتحويل أرباحك اليومية مباشرة إلى حسابك البريدي الجاري CCP.'
                  : 'Rejoignez le réseau officiel WASSLANI. Bénéficiez d\'une commission réduite de 8% à 12%, d\'une activité 100% légale sans risque de mise en fourrière, et du versement quotidien garanti de vos courses sur votre compte CCP.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
                  <span>{isAr ? 'حماية من المحشر (نشاط قانوني)' : 'Zéro risque de fourrière'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
                  <span>{isAr ? 'عمولة منصفة 8% إلى 12% فقط' : 'Commission artisan de 8% à 12%'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
                  <span>{isAr ? 'تحويل يومي للأرباح عبر CCP' : 'Virements quotidiens CCP'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
                  <span>{isAr ? 'كاميرا حماية للسيارة مهداة' : 'Boîte noire vidéo offerte'}</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => setIsDriverModalOpen(true)}
                  className="px-6 py-3.5 rounded-2xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold text-xs shadow-xl shadow-[var(--brand-primary)]/20 transition-all cursor-pointer inline-flex items-center space-x-2"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>{isAr ? 'تقديم طلب الانضمام كشريك' : 'Déposer ma Candidature Chauffeur'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Driver Requirements Card */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-4 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[var(--brand-primary)] font-mono font-bold">
                  {isAr ? 'شروط الانضمام الرسمية' : 'Critères d\'Admissibilité'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold">
                  DTW 16
                </span>
              </div>

              <h4 className="text-lg font-black">
                {isAr ? 'الملف المطلوب للانضمام :' : 'Documents requis :'}
              </h4>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--brand-primary)] shrink-0" />
                  <span>{isAr ? 'دفتر مكان ساري المفعول (ولاية الجزائر)' : 'Livret de Place valide (Wilaya d\'Alger)'}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--brand-primary)] shrink-0" />
                  <span>{isAr ? 'رخصة سياقة صنف ب (أكثر من سنتين)' : 'Permis de conduire Catégorie B (> 2 ans)'}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--brand-primary)] shrink-0" />
                  <span>{isAr ? 'شهادة المراقبة التقنية الدورية للمركبة' : 'Contrôle technique périodique à jour'}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--brand-primary)] shrink-0" />
                  <span>{isAr ? 'رقم الحساب البريدي الجاري CCP' : 'Relevé d\'Identité Postale (RIP / CCP)'}</span>
                </li>
              </ul>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>{isAr ? 'معالجة الملف خلال 24 ساعة' : 'Dossier traité sous 24h'}</span>
                <span className="font-bold text-white">0550 12 34 56</span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: SOLUTIONS FAMILLES & ENTREPRISES (#enterprise) */}
      <section id="enterprise" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Navettes Scolaires & Quotidiennes */}
          <div className="glass-panel rounded-3xl p-8 border space-y-4 text-left hover:border-blue-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {isAr ? 'الاشتراكات المدرسية والجامعية' : 'Navettes Programmées Familles'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? 'خصص سائقاً موثوقاً لنقل أطفالك يومياً إلى المدرسة أو الجامعة بتوقيت مضبوط ومسار مؤمن مع إشعارات فورية عند الوصول.'
                : 'Assurez les trajets scolaires ou universitaires de vos enfants avec un artisan taxieur attitré. Horaires fixes, itinéraire sécurisé et notifications directes à chaque arrivée.'}
            </p>
            <div className="pt-2 flex items-center space-x-4 text-xs font-bold text-blue-600 dark:text-blue-400">
              <span>{isAr ? 'سائق مخصص وموثوق' : 'Chauffeur fixe attitré'}</span>
              <span>•</span>
              <span>{isAr ? 'إشعارات مباشرة' : 'Suivi GPS parents'}</span>
            </div>
          </div>

          {/* Card 2: Comptes Entreprises & Facturation */}
          <div className="glass-panel rounded-3xl p-8 border space-y-4 text-left hover:border-[var(--brand-accent)]/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[var(--brand-accent)]/10 text-[var(--brand-accent)] flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {isAr ? 'حلول الشركات والمؤسسات' : 'Comptes Entreprises et Déplacements Pro'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? 'إدارة متكاملة لنقل موظفيكم وزواركم داخل ولاية الجزائر. فوترة شهرية موحدة، دفع عبر التحويل البنكي، وتتبع النفقات بسهولة.'
                : 'Simplifiez la mobilité de vos collaborateurs et invités à Alger. Facturation mensuelle centralisée, paiement par virement bancaire et conformité fiscale complète.'}
            </p>
            <div className="pt-2 flex items-center space-x-4 text-xs font-bold text-[var(--brand-accent)]">
              <span>{isAr ? 'فوترة شهرية قانونية' : 'Facturation mensuelle'}</span>
              <span>•</span>
              <span>{isAr ? 'خصم مالي متاح' : 'Gestion centralisée'}</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 6: TÉLÉCHARGEMENT APPLICATION (#download) */}
      <section id="download" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-white/10 bg-slate-950 text-white shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-8 space-y-5 text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-white/10 text-[var(--brand-primary)] font-bold text-xs">
                <Smartphone className="w-3.5 h-3.5" />
                <span>{isAr ? 'وصلني على هاتفك' : 'Application Mobile WASSLANI'}</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                {isAr ? 'تنقل في الجزائر العاصمة بنقرة زر واحدة' : 'Commandez votre premier taxi en quelques secondes'}
              </h3>

              <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                {isAr
                  ? 'حمل تطبيق وصلني مجاناً على هاتفك بنظام أندرويد أو آيفون واستمتع برحلات مريحة بالعداد الرسمي في أي وقت.'
                  : 'Téléchargez l\'application WASSLANI sur Android ou iOS pour estimer vos trajets, payer en toute tranquillité et voyager en sécurité.'}
              </p>

              {/* SMS Direct Link Sender Form */}
              <form onSubmit={handleSendSms} className="pt-2 max-w-md space-y-2">
                <label htmlFor={smsInputId} className="text-xs text-slate-400 block font-medium">
                  {isAr ? 'أدخل رقم هاتفك لتلقي رابط التحميل عبر رسالة قصيرة :' : 'Recevez le lien d\'installation par SMS :'}
                </label>
                <div className="flex gap-2">
                  <input
                    id={smsInputId}
                    type="tel"
                    placeholder="05 / 06 / 07 XX XX XX"
                    value={smsPhone}
                    onChange={(e) => setSmsPhone(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
                  >
                    {isAr ? 'إرسال' : 'Envoyer'}
                  </button>
                </div>
                {smsSent && (
                  <p className="text-xs text-[var(--brand-primary)] font-semibold flex items-center space-x-1 animate-fadeIn">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تم إرسال الرابط إلى هاتفك بنجاح !' : 'Lien de téléchargement envoyé avec succès !'}</span>
                  </p>
                )}
              </form>

              {/* Stores row */}
              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => setIsAppModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center space-x-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-300" />
                  <span>Google Play</span>
                </button>

                <button
                  onClick={() => setIsAppModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center space-x-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-300" />
                  <span>App Store</span>
                </button>

                <button
                  onClick={() => setIsAppModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[var(--brand-primary)]/20 hover:bg-[var(--brand-primary)]/30 border border-[var(--brand-primary)]/40 text-[var(--brand-primary)] font-bold text-xs flex items-center space-x-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger APK Direct (28 MB)</span>
                </button>
              </div>

            </div>

            {/* QR Code Presentation Box */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-white text-slate-900 text-center space-y-3 shadow-xl">
              <div className="w-36 h-36 bg-slate-100 p-2 rounded-xl border border-slate-200 flex items-center justify-center">
                <QrCode className="w-32 h-32 text-slate-900" />
              </div>
              <div className="space-y-0.5">
                <span className="font-extrabold text-xs block text-slate-900">
                  {isAr ? 'امسح الرمز بكاميرا هاتفك' : 'Scannez avec votre téléphone'}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {isAr ? 'تثبيت فوري ومباشر' : 'Installation instantanée'}
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 7: CADRE LÉGAL ET SÉCURITÉ (#safety) */}
      <section id="safety" className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 border-t border-slate-200 dark:border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-1">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>{isAr ? 'الإطار القانوني والسيادة الوطنية' : 'Cadre Légal & Souveraineté'}</span>
          </div>
          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            {isAr ? 'منصة وطنية متطابقة مع النصوص القانونية السارية' : 'Conformité Rigoureuse aux Textes de la République'}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-500 dark:text-slate-400 text-left">
          <div className="p-4 rounded-xl glass-panel border space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Décret Exécutif 12-230</span>
            <p>Réglementation stricte de l'activité des taxis urbains et interurbains. Agrément préfectoral obligatoire.</p>
          </div>
          <div className="p-4 rounded-xl glass-panel border space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Registre de Commerce CNRC 604103</span>
            <p>Plateforme numérique agréée pour l'intermédiation et la gestion de flottes de transport de personnes.</p>
          </div>
          <div className="p-4 rounded-xl glass-panel border space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Loi 25-11 Sécurité Numérique</span>
            <p>Protection intégrale des données personnelles et hébergement souverain des serveurs sur le sol national.</p>
          </div>
        </div>
      </section>

      {/* ARCHITECTURAL REVEALING FOOTER (with discrete demo link at the bottom) */}
      <FooterReveal
        lang={lang}
        onNavigateTab={onNavigateTab}
        onOpenLogoModal={onOpenLogoModal}
        selectedLogoId={selectedLogoId}
        selectedPalette={selectedPalette}
        onSelectPalette={onSelectPalette}
      />

      {/* MODAL 1: APP DOWNLOAD & QR CODE DIALOG */}
      {isAppModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl text-left space-y-5">
            
            <button
              onClick={() => setIsAppModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center font-bold">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {isAr ? 'تثبيت تطبيق وصلني' : 'Télécharger WASSLANI'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isAr ? 'اختر الطريقة الأنسب لهاتفك :' : 'Disponible pour Android et iOS'}
                </p>
              </div>
            </div>

            {/* Route Summary if coming from Estimator */}
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 space-y-1.5 text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>{isAr ? 'الرحلة المختارة :' : 'Trajet sélectionné :'}</span>
                <span className="text-[var(--brand-primary)] font-black text-sm">{estimatedFareDzd} DZD</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {originHub.nameFr} → {destHub.nameFr} (~{estimatedDistance} km)
              </p>
            </div>

            {/* QR Code and Stores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border flex flex-col items-center justify-center space-y-2">
                <QrCode className="w-28 h-28 text-slate-900 dark:text-white" />
                <span className="text-[10px] text-slate-500 font-medium">
                  {isAr ? 'امسح للتثبيت الفوري' : 'Scannez avec votre mobile'}
                </span>
              </div>

              <div className="space-y-2">
                <a
                  href="#download"
                  onClick={() => setIsAppModalOpen(false)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center space-x-2 transition-opacity hover:opacity-90 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Google Play Store</span>
                </a>

                <a
                  href="#download"
                  onClick={() => setIsAppModalOpen(false)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center space-x-2 transition-opacity hover:opacity-90 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Apple App Store</span>
                </a>

                <a
                  href="#download"
                  onClick={() => setIsAppModalOpen(false)}
                  className="w-full py-2.5 px-3 rounded-xl border border-[var(--brand-primary)] text-[var(--brand-primary)] font-bold text-xs flex items-center justify-center space-x-2 hover:bg-[var(--brand-primary)]/10 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>APK Direct Android (28 MB)</span>
                </a>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center pt-2">
              {isAr ? 'تطبيق آمن ومعتمد وفق الشروط التقنية الوطنية' : 'Application certifiée conforme aux normes de la DTW Alger'}
            </p>

          </div>
        </div>
      )}

      {/* MODAL 2: DRIVER SIGNUP APPLICATION DIALOG */}
      {isDriverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl text-left space-y-5">
            
            <button
              onClick={() => {
                setIsDriverModalOpen(false);
                setDriverFormSubmitted(false);
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center font-bold">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {isAr ? 'طلب انضمام سائق مهني' : 'Candidature Artisan Taxieur'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isAr ? 'شبكة سيارات الأجرة المعتمدة بولاية الجزائر' : 'Réseau officiel des taxis agréés Wilaya d\'Alger'}
                </p>
              </div>
            </div>

            {driverFormSubmitted ? (
              <div className="py-8 text-center space-y-3 animate-fadeIn">
                <div className="w-14 h-14 mx-auto rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {isAr ? 'تم استلام طلبكم بنجاح' : 'Candidature enregistrée avec succès'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  {isAr 
                    ? 'سيتصل بكم فريق الرقابة والتسجيل في غضون 24 ساعة لاستكمال التحقق من دفتر المكان.'
                    : 'Notre équipe d\'affiliation prendra contact avec vous sous 24 heures pour finaliser l\'activation de votre cockpit.'}
                </p>
                <button
                  onClick={() => {
                    setIsDriverModalOpen(false);
                    setDriverFormSubmitted(false);
                  }}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs"
                >
                  {isAr ? 'إغلاق النافذة' : 'Fermer'}
                </button>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setDriverFormSubmitted(true);
                }} 
                className="space-y-3.5 text-xs"
              >
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isAr ? 'الاسم واللقب الكامل :' : 'Nom et Prénom :'}
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="ex: Mohamed Amine Benali"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white/70 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'رقم الهاتف المحمول :' : 'Téléphone :'}
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="0550 XX XX XX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white/70 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'رقم دفتر المكان (LP) :' : 'N° Livret de Place (LP) :'}
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="ex: LP-88392-16"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white/70 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isAr ? 'بلدية الإقامة / محطة التوقف :' : 'Commune de stationnement habituelle :'}
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="ex: Alger-Centre, Kouba, Hydra, Chéraga..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white/70 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold text-xs shadow-lg shadow-[var(--brand-primary)]/20 transition-all cursor-pointer"
                  >
                    {isAr ? 'إرسال الملف للمراجعة' : 'Soumettre mon Dossier Artisan'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
