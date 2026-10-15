import React from 'react';
import { 
  Car, 
  Smartphone, 
  ShieldCheck, 
  Video, 
  Coins, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  Lock, 
  Calendar,
  HeartHandshake,
  Layers
} from 'lucide-react';
import type { AppLang } from '../utils/i18n';
import { getTranslation } from '../utils/i18n';
import type { ActiveTab, BrandOption, GraphicsPalette } from './Header';
import { FluidShaderCanvas } from './FluidShaderCanvas';
import { HeroScrollyStudio } from './HeroScrollyStudio';
import { FooterReveal } from './FooterReveal';
import { StickyStack } from './StickyStack';
import { HorizontalShowcase } from './HorizontalShowcase';

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
  brand,
  onOpenLogoModal,
  selectedLogoId,
  selectedPalette,
  onSelectPalette,
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);
  const isAr = lang === 'ar';

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section with Interactive WebGL GLSL Fluid Shader & Realtime Dispatch HUD */}
      <section className="relative pt-10 sm:pt-16 pb-12 overflow-hidden text-center max-w-5xl mx-auto px-4 min-h-[520px] flex flex-col justify-center items-center">
        
        {/* Three.js 3D WebGL GLSL Fluid Shader Background Canvas */}
        <FluidShaderCanvas palette={selectedPalette} className="opacity-75 dark:opacity-90" />

        {/* Ambient Gradient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[340px] bg-gradient-to-r from-[var(--brand-accent)]/10 via-[var(--brand-primary)]/15 to-[var(--brand-accent)]/10 blur-3xl -z-10 pointer-events-none rounded-full" />

        {/* Content Container (elevated above Three.js canvas) */}
        <div className="relative z-10 w-full max-w-4xl mx-auto">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase mb-5 border transition-all glass-panel">
            <span className="w-2 h-2 rounded-full bg-[var(--brand-primary)] animate-pulse" />
            <span className="text-[var(--brand-primary)]">
              {brand ? `${brand.name} • ${brand.nameAr}` : 'WASSLANI • وصلني'} • {t('heroBadge')}
            </span>
          </div>

          {/* Main Headline (max 2 lines) */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.12] mb-5">
            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              {t('heroTitle')}
            </span>
          </h1>

          {/* Subtext (max 20 words) */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
            {t('heroDescription')}
          </p>

          {/* CTAs visible without scrolling */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
            <button
              onClick={() => onNavigateTab('rider')}
              className="flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-hover)] hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-[var(--brand-primary)]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>{t('heroCtaRider')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('driver')}
              className="flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[var(--brand-accent)] to-[var(--brand-accent-hover)] hover:opacity-95 text-white font-black text-sm shadow-xl shadow-[var(--brand-accent)]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>{t('heroCtaDriver')}</span>
            </button>

            <button
              onClick={() => onNavigateTab('sync')}
              className="flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl glass-panel-interactive font-bold text-sm text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-[var(--brand-primary)]" />
              <span>{t('navLiveDemo')}</span>
            </button>
          </div>

          {/* Operational Proof Points */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            <div className="glass-panel p-4 rounded-2xl border">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xl sm:text-2xl font-black text-[var(--brand-primary)]">{t('statFleet')}</span>
                <Car className="w-4 h-4 text-[var(--brand-primary)]/70" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('statFleetDesc')}</p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xl sm:text-2xl font-black text-[var(--brand-accent)]">{t('statResponse')}</span>
                <Activity className="w-4 h-4 text-[var(--brand-accent)]/70" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('statResponseDesc')}</p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xl sm:text-2xl font-black text-[var(--brand-primary-light)]">{t('statSpareChange')}</span>
                <Coins className="w-4 h-4 text-[var(--brand-primary-light)]/70" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('statSpareChangeDesc')}</p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xl sm:text-2xl font-black text-[var(--brand-accent-light)]">{t('statSecurity')}</span>
                <Lock className="w-4 h-4 text-[var(--brand-accent-light)]/70" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('statSecurityDesc')}</p>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Hero Scrollytelling Studio (3 Pillars: Dispatch H3, Boîte Noire 12-230, Split BaridiMob) */}
      <HeroScrollyStudio lang={lang} onNavigateTab={onNavigateTab} />

      {/* GSAP Horizontal Showcase: The 5 Decoupled Portals */}
      <HorizontalShowcase lang={lang} onNavigateTab={onNavigateTab} />

      {/* GSAP Sticky Stack: 3 Regulatory & Tech Pillars */}
      <StickyStack lang={lang} onNavigateTab={onNavigateTab} />

      {/* Dedicated Chauffeur & Family Sponsored Payment Section */}
      <section id="enterprise" className="max-w-5xl mx-auto px-4">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-300 font-bold text-xs mb-3">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>{t('landingSocialBadge')}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('landingSocialTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              {t('landingSocialSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: Chauffeur Titulaire & Navette Programmée */}
            <div className="p-6 rounded-2xl border border-blue-500/30 bg-white/40 dark:bg-slate-900/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-600 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                {t('landingCard1Title')}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('landingCard1Desc')}
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                <span>{t('landingCard1Tag1')}</span>
                <span>{t('landingCard1Tag2')}</span>
              </div>
            </div>

            {/* Card 2: Payer pour un Proche / Billet Sponsorisé */}
            <div className="p-6 rounded-2xl border border-amber-500/30 bg-white/40 dark:bg-slate-900/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                {t('landingCard2Title')}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('landingCard2Desc')}
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
                <span>{t('landingCard2Tag1')}</span>
                <span>{t('landingCard2Tag2')}</span>
              </div>
            </div>

          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigateTab('rider')}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-md"
            >
              <span>{t('landingTestDedicatedBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Driver Recruitment Funnel Section */}
      <section id="drivers" className="max-w-5xl mx-auto px-4">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-transparent to-blue-500/5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold text-xs">
                <Car className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAr ? 'فضاء الحرفيين وسائقي سيارات الأجرة (ولاية الجزائر)' : 'Espace Artisans Taxieurs Agréés (Wilaya 16)'}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {isAr ? 'هل تمتلك رخصة مكان واعتماد رسمي؟' : 'Vous possédez un Agrément & un Livret de Place ?'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {isAr
                  ? 'انضم إلى شبكة وصلني الرسمية. استفد من عمولة مخفضة (8% إلى 12%)، وحماية قانونية كاملة عبر كاميرا التسجيل، ودفع مباشر للأرباح عبر الحساب البريدي الجاري.'
                  : 'Rejoignez le réseau officiel WASSLANI. Bénéficiez d’une commission ultra-réduite (8% à 12%), de la protection juridique de votre boîte noire CameraX en cas d’accident, et de courses pré-payées par BaridiMob et cartes CIB.'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 pt-2">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{isAr ? 'حماية من المحشر' : 'Zéro risque de fourrière'}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{isAr ? 'كاميرا ذكية مجهزة' : 'Boîte Noire Offerte'}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{isAr ? 'مداخيل مضمونة' : 'Revenus Réguliers'}</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col items-center justify-center text-center space-y-3 p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-mono font-bold">Décret 12-230 Conforme</span>
              <span className="text-2xl font-black">100% Légal</span>
              <p className="text-[11px] text-slate-400">
                Accédez directement au cockpit chauffeur sur tablette ou smartphone
              </p>
              <button
                onClick={() => onNavigateTab('driver')}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-amber-500/20"
              >
                {isAr ? 'فتح مقصورة السائق' : 'Ouvrir le Cockpit Chauffeur'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Official Regulatory Compliance Footer Section */}
      <section id="safety" className="max-w-5xl mx-auto px-4 pt-6 border-t border-slate-200 dark:border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>{isAr ? 'الإطار القانوني والسيادة' : 'Cadre Légal & Souveraineté'}</span>
          </div>
          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            {t('legalTitle')}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="p-4 rounded-xl glass-panel border">
            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Décret Exécutif 12-230</span>
            <p>{t('legalDecret')}</p>
          </div>
          <div className="p-4 rounded-xl glass-panel border">
            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">CNRC 604103</span>
            <p>{t('legalCnrc')}</p>
          </div>
          <div className="p-4 rounded-xl glass-panel border">
            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Loi 25-11 Sécurité</span>
            <p>{t('legalLaw25')}</p>
          </div>
        </div>
      </section>

      {/* Architectural Revealing Sticky Footer */}
      <FooterReveal
        lang={lang}
        onNavigateTab={onNavigateTab}
        onOpenLogoModal={onOpenLogoModal}
        selectedLogoId={selectedLogoId}
        selectedPalette={selectedPalette}
        onSelectPalette={onSelectPalette}
      />

    </div>
  );
};
