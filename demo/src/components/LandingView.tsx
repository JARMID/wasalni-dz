import React, { useState, useId } from 'react';
import { 
  Car, 
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
  Sparkles,
  X,
  Building2,
  FileCheck2
} from 'lucide-react';
import type { AppLang } from '../utils/i18n';
import type { ActiveTab, BrandOption, GraphicsPalette } from './Header';
import { FluidShaderCanvas } from './FluidShaderCanvas';
import { FooterReveal } from './FooterReveal';
import { HeroScrollyStudio } from './HeroScrollyStudio';
import { HorizontalShowcase } from './HorizontalShowcase';
import { StickyStack } from './StickyStack';
import { HeroRealExperience } from './HeroRealExperience';

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

  return (
    <div className="space-y-24 pb-20">
      
      {/* HERO SECTION: Dynamic WebGL Canvas + High-Converting Two-Column Marketing Grid */}
      <section className="relative pt-6 sm:pt-12 pb-16 overflow-hidden">
        
        {/* Three.js WebGL Fluid Shader Background Canvas */}
        <FluidShaderCanvas palette={selectedPalette} className="opacity-70 dark:opacity-85 pointer-events-none" />

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

    </div>
  );
};
