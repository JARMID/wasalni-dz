import React, { useState, useId } from 'react';
import { 
  Car, 
  ShieldCheck, 
  Coins, 
  ArrowRight, 
  CheckCircle2, 
  Calendar,
  QrCode,
  Download,
  Smartphone,
  Navigation,
  Sparkles,
  X,
  Building2,
  FileCheck2,
  Lock,
  BadgePercent,
  CloudRain,
  Sun,
  Zap,
  Quote,
  Check,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Receipt,
  Printer
} from 'lucide-react';
import type { AppLang } from '../utils/i18n';
import type { ActiveTab, BrandOption, GraphicsPalette } from './Header';
import { FluidShaderCanvas } from './FluidShaderCanvas';
import { FooterReveal } from './FooterReveal';
import { HorizontalShowcase } from './HorizontalShowcase';
import { StickyStack } from './StickyStack';
import { HeroRealExperience } from './HeroRealExperience';
import { soundEngine } from '../utils/audio';

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

  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [driverFormSubmitted, setDriverFormSubmitted] = useState(false);
  const [smsPhone, setSmsPhone] = useState('');
  const [smsSent, setSmsSent] = useState(false);

  // Bento Cell 1: Interactive Tariff Defense Simulator
  const [simDistance, setSimDistance] = useState<number>(7.8);
  const [isRainSurge, setIsRainSurge] = useState<boolean>(false);

  // Bento Cell 2: Interactive BaridiMob Change Calculator
  const [selectedBill, setSelectedBill] = useState<number>(1000);
  const [isTestingCcpRefund, setIsTestingCcpRefund] = useState<boolean>(false);

  // Bento Cell 3: Interactive DTW Verification Card
  const [showDtwCard, setShowDtwCard] = useState<boolean>(false);

  // Bento Cell 4: Family Reassurance Mode
  const [familyTab, setFamilyTab] = useState<'school' | 'parents' | 'legal'>('school');

  // Section 2.5: Interactive Official Taximeter Console
  const [taximeterKm, setTaximeterKm] = useState<number>(12.5);
  const [taximeterRushHour, setTaximeterRushHour] = useState<boolean>(false);
  const [showQuittanceModal, setShowQuittanceModal] = useState<boolean>(false);

  // Section 5.8: FAQ Accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Regulated Tariff (Executive Decree 12-230): 100 DA Flag Drop + 35 DA/km
  const wasslaniSimFare = Math.round(100 + simDistance * 35);
  // Unregulated VTC & Clandestins: 150 DA Base + 55 DA/km with dynamic rain multiplier (3.1x)
  const vtcBase = Math.round(150 + simDistance * 55);
  const vtcSimFare = isRainSurge ? Math.round(vtcBase * 3.1) : Math.round(vtcBase * 1.35);
  const directSavings = Math.max(0, vtcSimFare - wasslaniSimFare);

  // Dedicated Taximeter Console Calculations
  const taximeterWasslaniTotal = Math.round(100 + taximeterKm * 35);
  const taximeterVtcBase = Math.round(150 + taximeterKm * 55);
  const taximeterVtcTotal = taximeterRushHour ? Math.round(taximeterVtcBase * 3.1) : Math.round(taximeterVtcBase * 1.35);
  const taximeterSavings = Math.max(0, taximeterVtcTotal - taximeterWasslaniTotal);

  // BaridiMob refund calculation
  const simRideCost = 370;
  const refundAmount = Math.max(0, selectedBill - simRideCost);

  // Form field ID for accessibility
  const smsInputId = useId();

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsPhone.trim()) return;
    setSmsSent(true);
    setTimeout(() => {
      setSmsSent(false);
      setSmsPhone('');
    }, 4000);
  };

  const handleTestCcpRefund = () => {
    soundEngine.playCashRegisterDing();
    setIsTestingCcpRefund(true);
    setTimeout(() => {
      setIsTestingCcpRefund(false);
    }, 4500);
  };

  return (
    <div className="space-y-24 pb-20">

      {/* HERO SECTION: Dynamic WebGL Canvas + High-Converting Two-Column Marketing Grid */}
      <section className="relative pt-6 sm:pt-12 pb-16 overflow-hidden">
        
        {/* Three.js WebGL Fluid Shader Background Canvas */}
        <FluidShaderCanvas palette={selectedPalette} className="opacity-40 dark:opacity-85 pointer-events-none" />

        {/* Ambient Gradient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-r from-[var(--brand-primary)]/15 via-[var(--brand-accent)]/15 to-[var(--brand-primary)]/15 blur-3xl -z-10 pointer-events-none rounded-full" />

        {/* Main Hero Real Product Experience Component */}
        <HeroRealExperience
          lang={lang}
          onNavigateTab={onNavigateTab}
          onOpenAppModal={() => setIsAppModalOpen(true)}
          onOpenDriverModal={() => setIsDriverModalOpen(true)}
        />
      </section>

      {/* SECTION 2: POURQUOI WASSLANI (Master Bento Grid of Sovereign Algerian Mobility) */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'مطابقة قانونية كاملة وابتكار في خدمة المواطن' : 'Conformité Réglementaire & Innovation Citoyenne'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {isAr ? 'أربعة ركائز تغير واقع النقل اليومي في العاصمة' : 'Quatre Piliers qui Changent le Quotidien à Alger'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {isAr 
              ? 'حلول تقنية جذرية لحماية القدرة الشرائية للمواطن، ضمان الشفافية التامة في التسعيرة، وتوفير أقصى درجات الأمان للعائلات.'
              : 'Une plateforme conçue pour protéger le pouvoir d\'achat des citoyens, garantir la transparence totale des prix et assurer la sécurité des passagers.'}
          </p>
        </div>

        {/* Master Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Bento Cell 1 (Col-span 7): Official Regulated Taximeter (Executive Decree 12-230) with Live Interactive Simulator */}
          <div className="lg:col-span-7 rounded-2xl p-6 sm:p-8 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between group hover:border-blue-500/40 transition-all text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Navigation className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20">
                  Décret Exécutif 12-230
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {isAr ? 'تسعيرة العداد الرسمي : وداعاً للأسعار العشوائية تحت المطر' : 'Tarif Compteur Garanti : Fini l\'Arbitraire sous la Pluie'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                  {isAr
                    ? 'لا مفاوضات على الرصيف ولا مضاعفة للتسعيرة في أوقات الذروة أو سوء الأحوال الجوية. يطبق كل سائق في شبكتنا بدقة التعريفة الرسمية الصادرة عن ولاية الجزائر (100 دج انطلاق + 35 دج للكيلومتر).'
                    : 'Fini les prix fixés au hasard ou multipliés par trois dès qu\'il pleut. Chaque course applique scrupuleusement la formule homologuée par la Wilaya d\'Alger : 100 DA de prise en charge et 35 DA par kilomètre réel.'}
                </p>
              </div>

              {/* Interactive Distance & Rain Simulator Controls */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-blue-500" />
                    <span>{isAr ? 'مسافة الرحلة بالمحاكاة :' : 'Distance du trajet :'}</span>
                    <span className="font-mono font-black text-blue-600 dark:text-blue-400">{simDistance} km</span>
                  </span>

                  {/* Weather Toggle */}
                  <button
                    onClick={() => {
                      soundEngine.playSelection();
                      setIsRainSurge(prev => !prev);
                    }}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center space-x-1.5 cursor-pointer border ${
                      isRainSurge
                        ? 'bg-amber-500/20 text-amber-500 border-amber-500/40 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-white/10'
                    }`}
                  >
                    {isRainSurge ? <CloudRain className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                    <span>{isRainSurge ? 'Pluie & Heure de Pointe (3.1x VTC)' : 'Conditions Normales'}</span>
                  </button>
                </div>

                {/* Preset Hub Distance Buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: '3.5 km (Centre)', km: 3.5 },
                    { label: '7.8 km (Kouba)', km: 7.8 },
                    { label: '16 km (Aéroport T4)', km: 16 },
                    { label: '25 km (Zéralda)', km: 25 },
                  ].map(p => (
                    <button
                      key={p.label}
                      onClick={() => {
                        soundEngine.playClick();
                        setSimDistance(p.km);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border transition-colors cursor-pointer ${
                        simDistance === p.km
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white/60 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Side-by-Side Comparison Widget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                    <span>WASSLANI (Officiel)</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
                    {wasslaniSimFare} DZD
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    100 DA + 35 DA/km • Zéro surcoût météo
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl border space-y-1 transition-all ${
                  isRainSurge
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-white/5 opacity-80'
                }`}>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase">
                    <span>VTC & Clandestins</span>
                    <span className={`text-[10px] font-mono font-bold ${isRainSurge ? 'text-amber-500' : 'text-slate-400'}`}>
                      {isRainSurge ? 'Surtension 3.1x' : 'Tarif variable'}
                    </span>
                  </div>
                  <div className="text-2xl font-black font-mono text-slate-700 dark:text-slate-300 line-through">
                    {vtcSimFare} DZD
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {isRainSurge ? 'Multiplicateur appliqué par mauvais temps' : 'Algorithme dynamique non homologué'}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
              <span className="flex items-center space-x-1.5">
                <BadgePercent className="w-4 h-4 shrink-0" />
                <span>
                  {isAr 
                    ? `توفير مباشر للمواطن بقيمة ${directSavings} دج على هذا المسار` 
                    : `Économie citoyenne directe : +${directSavings} DZD préservés sur ce trajet`}
                </span>
              </span>
              <span className="font-mono text-[11px]">Wilaya d'Alger</span>
            </div>
          </div>

          {/* Bento Cell 2 (Col-span 5): BaridiMob Change Refund Flywheel with Interactive Banknote Picker */}
          <div className="lg:col-span-5 rounded-2xl p-6 sm:p-8 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-xl flex flex-col justify-between group hover:border-amber-500/40 transition-all text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                  <Coins className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
                  Algérie Poste CCP
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  {isAr ? 'استرجاع فكة الرد عبر بريدي موب' : 'Remboursement Immédiat de la Monnaie'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                  {isAr
                    ? 'انتهى مشكل البحث عن الصرف أو التنازل عن الباقي. إذا دفعتم بورقة 1000 أو 2000 دج ولم تتوفر القطع النقدية لدى السائق، يتم تحويل المبلغ المتبقي فوراً إلى حسابكم بريدي موب.'
                    : 'Plus jamais de litige pour une pièce de 50 ou 100 DA manquante. Payez en espèces : le reliquat exact est recrédité immédiatement sur votre compte BaridiMob via votre numéro RIP sans intermédiaire.'}
                </p>
              </div>

              {/* Interactive Banknote Picker */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                  {isAr ? 'اختر فئة الورقة النقدية المدفوعة :' : 'Sélectionnez le billet remis au chauffeur :'}
                </span>
                <div className="flex gap-2">
                  {[500, 1000, 2000].map(bill => (
                    <button
                      key={bill}
                      onClick={() => {
                        soundEngine.playSelection();
                        setSelectedBill(bill);
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                        selectedBill === bill
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md'
                          : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-amber-400'
                      }`}
                    >
                      {bill} DA
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Instant Quittance Receipt */}
              <div className="p-3.5 rounded-xl bg-black/90 border border-white/10 font-mono text-xs space-y-2">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>COURSE HOMOLOGUÉE : {simRideCost}.00 DZD</span>
                  <span>ESPÈCES : {selectedBill}.00 DZD</span>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-between text-amber-400 font-bold text-xs">
                  <span>VIREMENT EFFECTUÉ :</span>
                  <span>+{refundAmount}.00 DZD CCP</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>RIP: 007999990023456789 Clé 18</span>
                  <span className="text-blue-400 font-bold">
                    {isTestingCcpRefund ? 'CONFIRMATION SATIM...' : 'CONFIRMÉ EN 1.2s'}
                  </span>
                </div>
              </div>

              {/* Test Button */}
              <button
                onClick={handleTestCcpRefund}
                className="w-full py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>
                  {isTestingCcpRefund
                    ? (isAr ? 'تم تأكيد العملية بنجاح ✓' : 'Virement SATIM exécuté avec succès ✓')
                    : (isAr ? 'اختبر التحويل الفوري للرصيد' : 'Tester le Remboursement Immédiat CCP ⚡')}
                </span>
              </button>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-white/5 flex items-center text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>{isAr ? 'صفر دينار مهدور، شفافية مطلقة' : '0.00 DA de monnaie perdue pour le citoyen'}</span>
            </div>
          </div>

          {/* Bento Cell 3 (Col-span 5): Accredited DTW Artisans with Interactive Professional Card */}
          <div className="lg:col-span-5 rounded-2xl p-6 sm:p-8 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-xl flex flex-col justify-between group hover:border-blue-500/40 transition-all text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20">
                  Artisans Agréés DTW
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  {isAr ? 'سائقون مهنيون معتمدون ومركبات مفحوصة' : 'Chauffeurs Agréés & Véhicules Contrôlés'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                  {isAr
                    ? '100% من شركائنا هم حرفيون رسميون يحملون دفتر مكان معتمد صادر عن مديرية النقل لولاية الجزائر، مع فحص تقني دوري للمركبة وسجل تجاري نظامي.'
                    : '100% de nos conducteurs sont des artisans taxieurs titulaires d\'un Livret de Place valide délivré par la Direction des Transports. Zéro transport clandestin, zéro risque de mise en fourrière.'}
                </p>
              </div>

              {/* Digital Card Toggle or Bullet Checklist */}
              {showDtwCard ? (
                <div className="p-3.5 rounded-xl bg-slate-950 text-white border border-blue-500/40 space-y-2 text-xs font-mono animate-fadeIn">
                  <div className="flex justify-between items-center pb-1.5 border-b border-white/10 text-[10px]">
                    <span className="text-blue-400 font-bold">DIRECTION DES TRANSPORTS WILAYA D'ALGER</span>
                    <span className="text-amber-400">DTW 16</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Titulaire :</span>
                    <span className="font-bold text-white">Mourad Khelifi</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Livret de Place :</span>
                    <span className="text-blue-300 font-bold">LP-88392-16</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Véhicule & Plaque :</span>
                    <span>Peugeot 301 • 01842-120-16</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-white/10">
                    <span>Contrôle technique :</span>
                    <span className="text-blue-400 font-bold">À JOUR (ONML SCELLÉ)</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>{isAr ? 'دفتر مكان رسمي ساري المفعول (ولاية الجزائر)' : 'Livret de Place officiel valide (DTW 16)'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>{isAr ? 'مراقبة تقنية دورية ومطابقة معايير السلامة' : 'Contrôle technique périodique semestriel'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>{isAr ? 'سجل تجاري وطني CNRC 604103 معتمد' : 'Registre de commerce national CNRC 604103'}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setShowDtwCard(prev => !prev);
                }}
                className="w-full py-2 px-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>{showDtwCard ? 'Fermer la Carte' : 'Inspecter la Carte Professionnelle DTW 16'}</span>
              </button>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-white/5 flex items-center text-xs font-bold text-blue-600 dark:text-blue-400">
              <span>{isAr ? 'أمان قانوني كامل للراكب والسائق' : 'Sécurité juridique totale sur la voie publique'}</span>
            </div>
          </div>

          {/* Bento Cell 4 (Col-span 7): Law 25-11 Security, Black Box & Family Peace of Mind */}
          <div className="lg:col-span-7 rounded-2xl p-6 sm:p-8 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between group hover:border-indigo-500/40 transition-all text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                  <Lock className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20">
                  Loi 25-11 & Sécurité Famille
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {isAr ? 'كاميرا مراقبة مشفرة وراحة بال تامة للعائلات' : 'Boîte Noire Vidéo & Navettes Sécurisées pour Proches'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                  {isAr
                    ? 'كاميرا داخلية CameraX تسجل في حلقة دائرية مدتها 30 ثانية مشفرة بتقنية AES-256 وفق القانون 25-11. كما يمكن للأولياء حجز وتسديد رحلات أبنائهم أو والديهم عن بعد مع متابعة المسار الحي في الوقت الفعلي.'
                    : 'Chaque taxi est équipé d\'une caméra de bord chiffrée en boucle locale de 30 secondes sous séquestre judiciaire AES-256 avec quorum Shamir 2-sur-3. Réservez et payez à distance pour vos proches avec suivi en direct jusqu\'à bon port.'}
                </p>
              </div>

              {/* Family Reassurance Scenario Tabs */}
              <div className="flex gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5">
                {[
                  { id: 'school', label: 'Navettes Scolaires' },
                  { id: 'parents', label: 'Trajet Parents' },
                  { id: 'legal', label: 'Boîte Noire Loi 25-11' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      soundEngine.playSelection();
                      setFamilyTab(tab.id as 'school' | 'parents' | 'legal');
                    }}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      familyTab === tab.id
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Active Scenario Context */}
              <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-500/30 space-y-1 text-xs">
                {familyTab === 'school' && (
                  <>
                    <div className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center space-x-1.5">
                      <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Trajet quotidien scolaire ou universitaire avec chauffeur attitré</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Notifications directes à la montée et à la descente du véhicule. Facturation mensuelle sans manipulation d'argent liquide par les élèves.
                    </p>
                  </>
                )}
                {familyTab === 'parents' && (
                  <>
                    <div className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center space-x-1.5">
                      <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Réservation & paiement à distance pour proches et aînés</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Réglez la course depuis votre carte CIB ou compte BaridiMob. Suivez l'itinéraire en direct sur la carte jusqu'à l'arrivée à destination.
                    </p>
                  </>
                )}
                {familyTab === 'legal' && (
                  <>
                    <div className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center space-x-1.5">
                      <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Tampon judiciaire chiffré AES-256 avec quorum Shamir 2-sur-3</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Enregistrement en boucle locale de 30 secondes. Déchiffrement strictement conditionné à une réquisition judiciaire officielle (Loi 25-11).
                    </p>
                  </>
                )}
              </div>

              {/* Telemetry Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 text-center">
                  <div className="text-base font-black text-indigo-600 dark:text-indigo-400 font-mono">AES-256</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Chiffrement Loi 25-11</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 text-center">
                  <div className="text-base font-black text-blue-600 dark:text-blue-400 font-mono">&lt; 180 ms</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Télématique en Direct</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 text-center">
                  <div className="text-base font-black text-amber-500 font-mono">100% CIB</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Paiement à Distance</div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <span>{isAr ? 'متابعة مباشرة لمسار الأطفال والوالدين' : 'Suivi GPS parents et alertes d\'arrivée en temps réel'}</span>
              <span className="font-mono text-[11px]">57 Communes</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2.5: SIMULATEUR DE TAXIMÈTRE OFFICIEL (Décret Exécutif 12-230) */}
      <section id="taximeter" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl p-8 sm:p-12 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Car className="w-3.5 h-3.5" />
              <span>{isAr ? 'محاكي العداد الرسمي للدولة الجزائرية' : 'Taximètre Homologué • Wilaya d\'Alger'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {isAr ? 'احسب تسعيرة رحلتك بالعداد الرسمي بالدينار الجزائري' : 'Simulateur Officiel du Compteur Kilométrique'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr 
                ? 'وفق المرسوم التنفيذي 12-230 الصادر عن وزارة النقل: 100 دج انطلاق و35 دج لكل كيلومتر. قارن في ثوانٍ مع التطبيقات غير المقننة وشاهد الفارق لصالح جيبك.'
                : 'Conformément au Décret Exécutif 12-230: 100 DA de prise en charge et 35 DA par kilomètre réel. Constatez l\'écart direct avec les algorithmes VTC non homologués.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Controls: Sliders & Presets (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Distance Slider Control */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="taximeter-range" className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                    <Navigation className="w-4 h-4 text-blue-500" />
                    <span>{isAr ? 'مسافة المسار بالكيلومتر :' : 'Distance réelle du trajet :'}</span>
                  </label>
                  <span className="font-mono text-2xl font-black text-blue-600 dark:text-blue-400">
                    {taximeterKm.toFixed(1)} <span className="text-xs text-slate-500">KM</span>
                  </span>
                </div>

                <input
                  id="taximeter-range"
                  type="range"
                  min="1"
                  max="45"
                  step="0.5"
                  value={taximeterKm}
                  onChange={(e) => {
                    setTaximeterKm(parseFloat(e.target.value));
                  }}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />

                {/* Preset Hub Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  {[
                    { label: '3.5 km Centre', km: 3.5 },
                    { label: '8.5 km Kouba', km: 8.5 },
                    { label: '18 km Aéroport', km: 18.0 },
                    { label: '28.5 km Zéralda', km: 28.5 },
                  ].map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        soundEngine.playSelection();
                        setTaximeterKm(preset.km);
                      }}
                      className={`py-2 px-2.5 rounded-xl text-xs font-mono font-bold border transition-colors cursor-pointer text-center ${
                        taximeterKm === preset.km
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weather & Rush Hour Surge Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                    {taximeterRushHour ? <CloudRain className="w-4 h-4 text-amber-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    <span>{isAr ? 'حالة الطقس وساعات الذروة :' : 'Conditions Météo & Heure de Pointe :'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isAr 
                      ? 'التطبيقات العشوائية ترفع السعر حتى 3.1x في المطر، بينما عداد وصلني يبقى ثابتاً قانونياً.'
                      : 'Les VTC non régulés appliquent jusqu\'à 3.1x de surtension. WASSLANI garantit 0 DA de surcoût.'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    soundEngine.playSelection();
                    setTaximeterRushHour(prev => !prev);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center space-x-2 ${
                    taximeterRushHour
                      ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-white/10'
                  }`}
                >
                  <span>{taximeterRushHour ? 'Pluie & Forte Affluence (Actif)' : 'Conditions Normales'}</span>
                </button>
              </div>

              {/* Action: Print or View Official Digital Receipt */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    soundEngine.playCashRegisterDing();
                    setShowQuittanceModal(true);
                  }}
                  className="py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>{isAr ? 'معاينة القسيمة الجبائية الرسمية' : 'Consulter la Quittance Fiscale Homologuée'}</span>
                </button>

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setIsAppModalOpen(true);
                  }}
                  className="py-3 px-5 rounded-xl border border-slate-300 dark:border-white/15 bg-white/70 dark:bg-slate-800/80 hover:bg-slate-100 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-blue-500" />
                  <span>{isAr ? 'تثبيت التطبيق على هاتفك' : 'Installer WASSLANI'}</span>
                </button>
              </div>

            </div>

            {/* Right Display: Digital LED Taximeter HUD (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-slate-950 text-white border-2 border-slate-800 shadow-2xl relative overflow-hidden space-y-5 text-left">
              
              {/* Casing Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="font-bold text-amber-400 tracking-wider">ONML • FISCAL TAXIMETER</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold">DTW-16/092</span>
              </div>

              {/* Glowing Amber Horokilometric Display */}
              <div className="p-4 rounded-2xl bg-black border border-white/15 space-y-2">
                <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
                  <span>MONTANT TOTAL HOMOLOGUÉ :</span>
                  <span className="text-blue-400 font-bold">DÉCRET 12-230</span>
                </div>
                <div className="text-4xl sm:text-5xl font-black font-mono text-amber-400 tracking-wider">
                  {taximeterWasslaniTotal}.00 <span className="text-sm font-sans text-white">DZD</span>
                </div>
              </div>

              {/* Breakdown Matrix */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                  <span className="text-[10px] text-slate-400 block uppercase">Prise en Charge</span>
                  <span className="text-base font-bold text-blue-400">100.00 DA</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                  <span className="text-[10px] text-slate-400 block uppercase">Tarif Kilométrique</span>
                  <span className="text-base font-bold text-slate-200">35.00 DA / km</span>
                </div>
              </div>

              {/* VTC Comparison Box */}
              <div className={`p-3.5 rounded-xl border space-y-1.5 font-mono text-xs transition-all ${
                taximeterRushHour 
                  ? 'bg-amber-950/30 border-amber-500/40' 
                  : 'bg-slate-900/80 border-white/10'
              }`}>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>TARIF VTC SANS COMPTEUR :</span>
                  <span className={taximeterRushHour ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                    {taximeterRushHour ? 'Surtension Pluie (3.1x)' : 'Tarif non réglementé'}
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-400 line-through">
                  {taximeterVtcTotal}.00 DZD
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-blue-400 font-bold">
                  <span>ÉCONOMIE CITOYENNE :</span>
                  <span className="text-sm font-black text-blue-300">+{taximeterSavings}.00 DZD</span>
                </div>
              </div>

              {/* Certification Footer */}
              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>SCELLEMENT ONML : 2026/DZ</span>
                <span className="text-blue-400 font-bold">CONFORME WILAYA D'ALGER</span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* GSAP HORIZONTAL SHOWCASE: The 5 Decoupled Portals (Passager, Cockpit Chauffeur, DTW Dispatch, Grand Livre, Contrôle Routier) */}
      <HorizontalShowcase lang={lang} onNavigateTab={onNavigateTab} />

      {/* SECTION 3: COMMENT ÇA MARCHE (3 Simple Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl p-8 sm:p-12 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--brand-primary)]">
              {isAr ? 'خطوات بسيطة وسريعة' : 'Utilisation Intuitive'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {isAr ? 'كيف يعمل تطبيق وصلني ؟' : 'Votre Course en 3 Étapes'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {isAr ? 'تجربة حجز سلسة وشفافة من البداية حتى الوصول' : 'Une expérience fluide sans surprise du départ à l\'arrivée'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
            
            {/* Step 1 */}
            <div className="space-y-4 flex flex-col items-center p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-600/25">
                1
              </div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                {isAr ? 'حدد نقطة الانطلاق والوجهة' : 'Indiquez votre Destination'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs leading-relaxed">
                {isAr 
                  ? 'افتح التطبيق، اختر وجهتك، واطلع مسبقاً على التقدير الرسمي المعتمد للتكلفة.'
                  : 'Saisissez votre adresse de départ et d\'arrivée pour visualiser le tarif officiel calculé par le compteur homologué.'}
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 flex flex-col items-center p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-xl flex items-center justify-center shadow-lg">
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
            <div className="space-y-4 flex flex-col items-center p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                3
              </div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                {isAr ? 'الدفع براحة ودون قلق' : 'Paiement Transparent'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs leading-relaxed">
                {isAr 
                  ? 'ادفع نقداً مع استلام فكة الرد في حسابك، أو سدد مباشرة عبر بطاقتك البنكية أو بريدي موب.'
                  : 'Réglez en espèces avec restitution automatique de monnaie par BaridiMob, ou directement par carte CIB et Edahabia.'}
              </p>
            </div>

          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => setIsAppModalOpen(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
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
        <div className="rounded-2xl p-8 sm:p-12 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Driver Value Proposition */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-500/20">
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

              {/* Economic Gain Comparison Card */}
              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Commission Artisan Équitable : 8% à 12%</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Contre 25% sur les applications étrangères non agréées</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black font-mono text-amber-600 dark:text-amber-400">+45 000 DZD / mois</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Gain net moyen estimé</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{isAr ? 'حماية من المحشر (نشاط قانوني)' : 'Zéro risque de fourrière'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{isAr ? 'عمولة منصفة 8% إلى 12% فقط' : 'Commission artisan de 8% à 12%'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{isAr ? 'تحويل يومي للأرباح عبر CCP' : 'Virements quotidiens CCP'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{isAr ? 'كاميرا حماية للسيارة مهداة' : 'Boîte noire vidéo offerte'}</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => setIsDriverModalOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 transition-all cursor-pointer inline-flex items-center space-x-2"
                >
                  <FileCheck2 className="w-4 h-4 text-slate-950" />
                  <span>{isAr ? 'تقديم طلب الانضمام كشريك' : 'Déposer ma Candidature Chauffeur'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Driver Requirements Card */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-4 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-amber-400 font-mono font-bold">
                  {isAr ? 'شروط الانضمام الرسمية' : 'Critères d\'Admissibilité'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                  DTW 16
                </span>
              </div>

              <h4 className="text-lg font-black">
                {isAr ? 'الملف المطلوب للانضمام :' : 'Documents requis :'}
              </h4>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{isAr ? 'دفتر مكان ساري المفعول (ولاية الجزائر)' : 'Livret de Place valide (Wilaya d\'Alger)'}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{isAr ? 'رخصة سياقة صنف ب (أكثر من سنتين)' : 'Permis de conduire Catégorie B (> 2 ans)'}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{isAr ? 'شهادة المراقبة التقنية الدورية للمركبة' : 'Contrôle technique périodique à jour'}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{isAr ? 'رقم الحساب البريدي الجاري CCP' : 'Relevé d\'Identité Postale (RIP / CCP)'}</span>
                </li>
              </ul>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>{isAr ? 'معالجة الملف خلال 24 ساعة' : 'Dossier traité sous 24h'}</span>
                <span className="font-bold text-white font-mono">0550 12 34 56</span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: SOLUTIONS FAMILLES & ENTREPRISES (#enterprise) */}
      <section id="enterprise" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Navettes Scolaires & Quotidiennes */}
          <div className="rounded-2xl p-8 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-xl space-y-4 text-left hover:border-blue-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
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
          <div className="rounded-2xl p-8 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-xl space-y-4 text-left hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
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
            <div className="pt-2 flex items-center space-x-4 text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>{isAr ? 'فوترة شهرية قانونية' : 'Facturation mensuelle'}</span>
              <span>•</span>
              <span>{isAr ? 'خصم مالي متاح' : 'Gestion centralisée'}</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5.5: RETOURS DU TERRAIN WILAYA D'ALGER (Pilot Deployment Testimonials) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl p-8 sm:p-12 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {isAr ? 'شهادات حية من الميدان' : 'Retours du Terrain • Wilaya d\'Alger'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {isAr ? 'ماذا يقول السائقون الحرفيون والركاب في العاصمة' : 'L\'Expérience WASSLANI au Quotidien'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {isAr ? 'آراء شركائنا في المحطات المركزية والمستفيدين من الخدمة' : 'Témoignages recueillis auprès des artisans taxieurs et des usagers réguliers.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Testimonial 1: Chauffeur Artisan */}
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <Quote className="w-6 h-6 text-amber-500/60" />
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  {isAr
                    ? '"22 سنة وأنا سائق طاكسي في ساحة أول ماي. هذه أول منصة تحترم الحرفي الجزائري. عمولة 10% فقط، ولا مشكل للصرف مع الزبائن، والتحويل اليومي على حسابي CCP مضمون في الموعد."'
                    : '"Après 22 ans de métier à la station du 1er Mai, c\'est la première fois qu\'une application défend l\'artisan. Commission de 10% seulement, plus de dispute pour la monnaie et mes virements CCP arrivent chaque jour."'}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-white/5 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-500 font-bold text-xs flex items-center justify-center font-mono">
                  HR
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Hadj Rachid M.</div>
                  <div className="text-[10px] text-slate-500 font-mono">Artisan Taxieur • LP-16/0482</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2: Mère de Famille / Médecin */}
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <Quote className="w-6 h-6 text-blue-500/60" />
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  {isAr
                    ? '"أعمل في المناوبة الليلية بمستشفى مصطفى باشا. الأمان بالنسبة لي أساسي. سائق رسمي يحمل دفتر مكان، العداد القانوني دون زيادات، ومتابعة المسار مباشرة عبر التطبيق تمنحني طمأنينة تامة."'
                    : '"En garde de nuit au CHU Mustapha Pacha, la sécurité est primordiale. Savoir que le chauffeur a un Livret de Place vérifié et que le tarif compteur est respecté sans majoration arbitraire change tout."'}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-white/5 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-500 font-bold text-xs flex items-center justify-center font-mono">
                  KS
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Dr. Karima S.</div>
                  <div className="text-[10px] text-slate-500 font-mono">Médecin • Alger-Centre</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3: Gestionnaire PME */}
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <Quote className="w-6 h-6 text-indigo-500/60" />
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  {isAr
                    ? '"حولنا تنقلات مهندسينا في القطب التكنولوجي لسيدي عبد الله وحي الأعمال بباب الزوار إلى وصلني. الفاتورة الشهرية الرسمية متطابقة جبائياً والخدمة دقيقة ومنتظمة."'
                    : '"Nous gérons tous les trajets professionnels de nos ingénieurs entre Sidi Abdellah et Bab Ezzouar via WASSLANI. Facturation mensuelle conforme, traçabilité fiscale et ponctualité remarquable."'}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-white/5 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-500 font-bold text-xs flex items-center justify-center font-mono">
                  SL
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Sofiane L.</div>
                  <div className="text-[10px] text-slate-500 font-mono">Directeur d'Ingénierie • Bab Ezzouar</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5.8: FOIRE AUX QUESTIONS RÉGLEMENTAIRE & CITOYENNE (#faq) */}
      <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl p-8 sm:p-12 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isAr ? 'الأسئلة الشائعة والأجوبة الرسمية' : 'Foire Aux Questions • Cadre Officiel'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {isAr ? 'كل ما تحتاج معرفته عن خدمة وصلني' : 'Comprendre le Fonctionnement de WASSLANI'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr 
                ? 'إجابات واضحة ومباشرة حول التسعيرة القانونية، استرجاع فكة الرد عبر بريدي موب، ومعايير الأمان المعتمدة بولاية الجزائر.'
                : 'Des réponses précises sur la tarification légale, la restitution de monnaie par BaridiMob et la protection juridique de vos trajets.'}
            </p>
          </div>

          {/* Accordion List */}
          <div className="max-w-4xl mx-auto space-y-3 text-left">
            {[
              {
                qFr: 'Comment est calculé le tarif officiel d\'une course WASSLANI ?',
                qAr: 'كيف يتم حساب التسعيرة الرسمية لرحلة وصلني ؟',
                aFr: 'Chaque course applique strictement la tarification fixée par le Décret Exécutif 12-230 de la Wilaya d\'Alger: une prise en charge forfaitaire de 100 DA, augmentée de 35 DA par kilomètre réel mesuré par le taximètre. Contrairement aux VTC privés, aucun algorithme ne multiplie les tarifs sous la pluie, la nuit ou en heure de pointe.',
                aAr: 'تطبق كل رحلة بدقة التسعيرة الرسمية المحددة بموجب المرسوم التنفيذي 12-230 لولاية الجزائر: 100 دج عند الانطلاق يضاف إليها 35 دج لكل كيلومتر فعلي مسجل بالعداد. خلافاً للتطبيقات الخاصة، لا توجد أي خوارزمية تضاعف الأسعار تحت المطر أو في أوقات الذروة.'
              },
              {
                qFr: 'Comment fonctionne la restitution automatique de la monnaie sur BaridiMob ?',
                qAr: 'كيف يعمل الاسترجاع الفوري لفكة الرد عبر بريدي موب ؟',
                aFr: 'Lorsque vous payez votre course en espèces avec un billet de 1 000 ou 2 000 DA et que le chauffeur ne dispose pas de la monnaie exacte, le montant restant est immédiatement viré sur votre compte BaridiMob via votre numéro RIP. L\'opération prend moins de deux secondes et une quittance numérique certifiée est émise.',
                aAr: 'عند الدفع نقداً بورقة 1000 أو 2000 دج وعدم توفر القطع النقدية لدى السائق، يتم تحويل المبلغ المتبقي فوراً إلى حسابكم بريدي موب عبر رقم الحساب البريدي الجاري RIP في أقل من ثانيتين مع إصدار وصل رقمي معتمد.'
              },
              {
                qFr: 'Quelles sont les qualifications des chauffeurs et l\'état des véhicules ?',
                qAr: 'ما هي مؤهلات السائقين وكيف تتم مراقبة المركبات ؟',
                aFr: '100% de nos chauffeurs partenaires sont des artisans taxieurs professionnels titulaires d\'un Livret de Place (LP) délivré par la Direction des Transports de la Wilaya d\'Alger (DTW 16). Leurs véhicules font l\'objet d\'un contrôle technique semestriel rigoureux et d\'un étalonnage de taximètre scellé par l\'ONML.',
                aAr: '100% من السائقين الشركاء هم حرفيون نظاميون يحملون دفتر مكان رسمي صادر عن مديرية النقل لولاية الجزائر (DTW 16). تخضع مركباتهم لفحص تقني دوري كل ستة أشهر ومعايرة رسمية للعداد مختومة من طرف الديوان الوطني للقياسة القانونية ONML.'
              },
              {
                qFr: 'Quelles garanties de confidentialité offre la boîte noire vidéo (Loi 25-11) ?',
                qAr: 'ما هي ضمانات الخصوصية للعلبة السوداء الرقمية (القانون 25-11) ؟',
                aFr: 'La caméra de bord CameraX enregistre exclusivement en boucle locale de 30 secondes chiffrée selon le standard AES-256-GCM. Aucun flux n\'est transmis sur internet ni consultable par le chauffeur. En cas d\'accident grave (décélération supérieure à 2.84 G), le fichier est verrouillé sous séquestre judiciaire conformément à la Loi 25-11 et ne peut être ouvert qu\'avec un quorum Shamir 2-sur-3 par les autorités compétentes.',
                aAr: 'تسجل الكاميرا الداخلية حصرياً في حلقة دائرية مغلقة مدتها 30 ثانية مشفرة بتقنية AES-256-GCM. لا يتم بث أي فيديو عبر الإنترنت ولا يمكن للسائق مشاهدته. في حال وقوع حادث (تباطؤ يفوق 2.84 G)، يتم قفل المقطع تحت الحراسة القضائية وفق القانون 25-11 ولا يفتح إلا بقرار قضائي رسمي بنصاب شامير 2 من 3.'
              },
              {
                qFr: 'Peut-on commander et payer une course pour un proche à distance ?',
                qAr: 'هل يمكن حجز ودفع أجرة الرحلة للأقارب والأولاد عن بعد ؟',
                aFr: 'Oui. Grâce au module Famille & Proches, vous pouvez programmer une navette pour vos enfants vers l\'école ou commander un taxi pour vos parents âgés. Le paiement s\'effectue directement par carte CIB ou Edahabia, et vous suivez la trajectoire du véhicule en temps réel sur la carte avec notification d\'arrivée.',
                aAr: 'نعم. بفضل ميزة العائلات والأقارب، يمكنكم برمجة رحلات يومية لأبنائكم إلى المدارس أو طلب سيارة أجرة لوالديكم عن بعد. يتم الدفع مباشرة عبر بطاقة الدفع الذهبية أو CIB مع متابعة مسار المركبة حياً على الخريطة وتلقي إشعار فور الوصول.'
              },
              {
                qFr: 'Quels sont les avantages pour les artisans taxieurs par rapport aux plateformes VTC ?',
                qAr: 'ما هي مكاسب الحرفيين مقارنة بالتطبيقات الأجنبية ؟',
                aFr: 'Une commission réduite de 8% à 12% (contre 25% sur les applications étrangères non agréées), un gain mensuel moyen supérieur de 45 000 DZD, une protection juridique intégrale contre les mises en fourrière, et le versement quotidien de leurs recettes directement sur compte CCP.',
                aAr: 'عمولة منصفة تتراوح بين 8% و12% فقط (مقارنة بـ 25% لدى التطبيقات الأجنبية غير المعتمدة)، دخل شهري إضافي يفوق 45 000 دج، حماية قانونية تامة من المحشر، وتحويل يومي مضمون للمستحقات مباشرة في حسابهم البريدي الجاري CCP.'
              }
            ].map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={`faq-${index}`}
                  className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-slate-950/60 overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => {
                      soundEngine.playSelection();
                      setOpenFaqIndex(isOpen ? null : index);
                    }}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer transition-colors hover:bg-slate-100/80 dark:hover:bg-white/5"
                  >
                    <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white pr-4">
                      {isAr ? faq.qAr : faq.qFr}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-white/5 animate-fadeIn">
                      <p>{isAr ? faq.aAr : faq.aFr}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr ? 'هل لديكم استفسار إضافي ؟ اتصلوا بمركز التوجيه والمساعدة على الرقم الأخضر 1100' : 'Une question spécifique ? Contactez le centre d\'assistance citoyenne au numéro dédié de la DTW Alger.'}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: TÉLÉCHARGEMENT APPLICATION (#download) */}
      <section id="download" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl p-8 sm:p-12 border border-slate-800 bg-slate-950 text-white shadow-2xl">
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
          <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 space-y-1 shadow-sm">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Décret Exécutif 12-230</span>
            <p>Réglementation stricte de l'activité des taxis urbains et interurbains. Agrément préfectoral obligatoire.</p>
          </div>
          <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 space-y-1 shadow-sm">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Registre de Commerce CNRC 604103</span>
            <p>Plateforme numérique agréée pour l'intermédiation et la gestion de flottes de transport de personnes.</p>
          </div>
          <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 space-y-1 shadow-sm">
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
                <span>{isAr ? 'التعريفة القانونية الرسمية :' : 'Tarification officielle :'}</span>
                <span className="text-[var(--brand-primary)] font-black text-sm">Décret 12-230</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isAr ? 'حساب دقيق للمسافة مع التزام كامل بتسعيرة ولاية الجزائر واسترجاع فوري للباقي عبر بريدي موب.' : 'Calcul certifié au kilomètre, respect des tarifs de la Wilaya d’Alger et restitution de monnaie BaridiMob.'}
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

      {/* MODAL 3: QUITTANCE FISCALE NUMÉRIQUE HOMOLOGUÉE DIALOG */}
      {showQuittanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-2xl space-y-4 text-left font-mono">
            
            <button
              onClick={() => setShowQuittanceModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Header */}
            <div className="text-center pb-3 border-b-2 border-dashed border-slate-300 space-y-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE
              </div>
              <div className="text-xs font-black tracking-tight text-slate-900 uppercase">
                DIRECTION DES TRANSPORTS • WILAYA D'ALGER
              </div>
              <div className="text-[11px] font-extrabold text-blue-700 bg-blue-50 py-0.5 rounded border border-blue-200">
                QUITTANCE OFFICIELLE DE COURSE TAXI
              </div>
              <div className="text-[10px] text-slate-400">
                DÉCRET EXÉCUTIF N° 12-230 DU 24 MAI 2012
              </div>
            </div>

            {/* Receipt Data Body */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>N° Quittance :</span>
                <span className="font-bold text-slate-900">QT-2026-10-8842</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Date & Heure :</span>
                <span className="font-bold text-slate-900">17/10/2026 15:35:12</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Artisan Titulaire :</span>
                <span className="font-bold text-slate-900">Hadj Mourad Khelifi</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Livret de Place (LP) :</span>
                <span className="font-bold text-blue-700">LP-88392-16</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Véhicule & Plaque :</span>
                <span className="font-bold text-slate-900">Peugeot 301 • 01842-120-16</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Taximètre ONML :</span>
                <span className="font-bold text-slate-900">SCELLÉ N° 77481/DZ</span>
              </div>

              {/* Items Breakdown */}
              <div className="pt-2 pb-2 border-t border-b border-dashed border-slate-300 space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Prise en charge (Base) :</span>
                  <span>100.00 DZD</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Distance ({taximeterKm.toFixed(1)} km × 35.00 DA) :</span>
                  <span>{Math.round(taximeterKm * 35)}.00 DZD</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Surcoût Météo / Embouteillage :</span>
                  <span className="text-blue-700 font-bold">0.00 DZD (OFFICIEL)</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-center text-sm font-black pt-1 text-slate-950">
                <span>TOTAL HOMOLOGUÉ :</span>
                <span className="text-xl font-black text-blue-700 font-mono">
                  {taximeterWasslaniTotal}.00 DZD
                </span>
              </div>

              {/* Payment & BaridiMob Refund */}
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] space-y-1">
                <div className="flex justify-between text-amber-900 font-bold">
                  <span>Règlement Espèces :</span>
                  <span>1 000.00 DZD</span>
                </div>
                <div className="flex justify-between text-amber-800 font-extrabold">
                  <span>Rendu Automatique BaridiMob :</span>
                  <span className="text-amber-700 font-mono">+{1000 - taximeterWasslaniTotal}.00 DZD</span>
                </div>
                <div className="text-[10px] text-slate-500 pt-0.5">
                  Virement CCP instantané vers RIP : 007999990023456789 Clé 18
                </div>
              </div>

              {/* QR and Verification Hash */}
              <div className="pt-2 flex items-center justify-between">
                <div className="space-y-0.5 text-[9px] text-slate-400">
                  <div>SHA-256: 9f82a1b7e4c3d82a...</div>
                  <div>CONTRÔLE DTW / GENDARMERIE VALIDÉ</div>
                </div>
                <div className="w-12 h-12 bg-slate-100 p-1 border rounded flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-slate-900" />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center space-x-1.5 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer Quittance</span>
              </button>

              <button
                onClick={() => setShowQuittanceModal(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
