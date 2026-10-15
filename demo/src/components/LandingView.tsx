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
  ChevronRight, 
  Gauge, 
  Layers,
  Calendar,
  HeartHandshake
} from 'lucide-react';
import type { AppLang } from '../utils/i18n';
import { getTranslation } from '../utils/i18n';
import type { ActiveTab, BrandOption } from './Header';

interface LandingViewProps {
  lang: AppLang;
  onNavigateTab: (tab: ActiveTab) => void;
  isDark?: boolean;
  brand?: BrandOption;
}

export const LandingView: React.FC<LandingViewProps> = ({
  lang,
  onNavigateTab,
  isDark: _isDark,
  brand,
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  return (
    <div className="space-y-16 pb-20 animate-fadeIn">
      
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 pb-8 overflow-hidden text-center max-w-5xl mx-auto px-4">
        
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-amber-500/10 via-blue-500/15 to-indigo-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

        {/* Official Wilaya Badge with Dynamic Brand Name */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase mb-6 border transition-all glass-panel">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-blue-600 dark:text-blue-300">
            {brand ? `${brand.name} • ${brand.nameAr}` : 'WASSLANI • وصلني'} • {t('heroBadge')}
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] mb-6">
          <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            {t('heroTitle')}
          </span>
        </h1>

        {/* Value Subtitle */}
        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
          {t('heroDescription')}
        </p>

        {/* Direct Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-14">
          <button
            onClick={() => onNavigateTab('rider')}
            className="flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            <span>{t('heroCtaRider')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigateTab('driver')}
            className="flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>{t('heroCtaDriver')}</span>
          </button>

          <button
            onClick={() => onNavigateTab('sync')}
            className="flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl glass-panel-interactive font-bold text-sm text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-blue-500" />
            <span>{t('navLiveDemo')}</span>
          </button>
        </div>

        {/* Key Operational Proof Points */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left">
          <div className="glass-panel p-4 rounded-2xl border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl sm:text-2xl font-black text-amber-500 dark:text-amber-400">{t('statFleet')}</span>
              <Car className="w-4 h-4 text-amber-500/70" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('statFleetDesc')}</p>
          </div>

          <div className="glass-panel p-4 rounded-2xl border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">{t('statResponse')}</span>
              <Activity className="w-4 h-4 text-blue-500/70" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('statResponseDesc')}</p>
          </div>

          <div className="glass-panel p-4 rounded-2xl border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl sm:text-2xl font-black text-sky-500 dark:text-sky-400">{t('statSpareChange')}</span>
              <Coins className="w-4 h-4 text-sky-500/70" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('statSpareChangeDesc')}</p>
          </div>

          <div className="glass-panel p-4 rounded-2xl border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl sm:text-2xl font-black text-indigo-500 dark:text-indigo-400">{t('statSecurity')}</span>
              <Lock className="w-4 h-4 text-indigo-500/70" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('statSecurityDesc')}</p>
          </div>
        </div>
      </section>


      {/* Three Pillars Section */}
      <section id="services" className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {t('landingPillarsHeader')}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            {t('landingPillarsSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1: Passager */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between border relative group hover:border-blue-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-blue-600/10 text-blue-600 dark:text-blue-300 mb-3">
                {t('pillar1Badge')}
              </span>
              <h3 className="text-xl font-bold mb-2">{t('pillar1Title')}</h3>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{t('pillar1Subtitle')}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                {t('pillar1Desc')}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('rider')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-300 text-xs font-bold transition-all cursor-pointer"
            >
              <span>{t('heroCtaRider')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pillar 2: Chauffeur & Dashcam */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between border relative group hover:border-amber-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-300 mb-3">
                {t('pillar2Badge')}
              </span>
              <h3 className="text-xl font-bold mb-2">{t('pillar2Title')}</h3>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{t('pillar2Subtitle')}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                {t('pillar2Desc')}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('driver')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-300 text-xs font-bold transition-all cursor-pointer"
            >
              <span>{t('heroCtaDriver')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pillar 3: Flotte & Wilaya */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between border relative group hover:border-indigo-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-500 mb-6 group-hover:scale-110 transition-transform">
                <Gauge className="w-6 h-6" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-600/10 text-indigo-600 dark:text-indigo-300 mb-3">
                {t('pillar3Badge')}
              </span>
              <h3 className="text-xl font-bold mb-2">{t('pillar3Title')}</h3>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{t('pillar3Subtitle')}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                {t('pillar3Desc')}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('dispatch')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold transition-all cursor-pointer"
            >
              <span>{t('heroCtaFleet')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>


      {/* How the Flywheel Solves Algeria's Cash Dilemma */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-transparent to-amber-500/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-blue-600/15 text-blue-600 dark:text-blue-300 font-bold text-xs mb-4">
                <Coins className="w-3.5 h-3.5" />
                <span>{t('flywheelBadge')}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
                {t('flywheelTitle')}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {t('flywheelDesc')}
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>{t('flywheelStep1')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>{t('flywheelStep2')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>{t('flywheelStep3')}</span>
                </li>
              </ul>
            </div>

            <div className="glass-panel p-6 rounded-2xl border space-y-4 text-center">
              <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">{t('flywheelExampleBadge')}</span>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/10 dark:bg-slate-900/60 border text-xs">
                <span>{t('flywheelTripLabel')}</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">850 DA</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/10 dark:bg-slate-900/60 border text-xs">
                <span>{t('flywheelCashGiven')}</span>
                <span className="font-bold">1 000 DA</span>
              </div>
              <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-600 dark:text-blue-400">
                <span className="block text-xs font-semibold mb-1">{t('flywheelCreditReceived')}</span>
                <span className="text-2xl font-black">+150.00 DA</span>
              </div>
              <button
                onClick={() => onNavigateTab('ledger')}
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs hover:opacity-90 transition-all cursor-pointer"
              >
                {t('flywheelInspectLedger')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Dedicated Chauffeur & Third-Party Sponsored Payment Section */}
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
                <span>Espace Artisans Taxieurs Agréés (Wilaya 16)</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Vous possédez un Agrément & un Livret de Place ?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Rejoignez le réseau officiel WASSLANI. Bénéficiez d'une commission ultra-réduite (8% à 12%), de la protection juridique de votre boîte noire CameraX en cas d'accident, et de courses pré-payées par BaridiMob et cartes CIB.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 pt-2">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Zéro risque de fourrière</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Boîte Noire Offerte</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Revenus Garantis</span>
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
                Ouvrir le Cockpit Chauffeur
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
            <span>Cadre Légal & Souveraineté</span>
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

      {/* Portals Directory Navigation Footer */}
      <footer className="max-w-5xl mx-auto px-4 pt-10 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pb-8">
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Usagers & Passagers
            </h5>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigateTab('rider')} 
                  className="hover:text-blue-500 transition-colors text-left cursor-pointer"
                >
                  Application Passager Web
                </button>
              </li>
              <li>
                <a href="#services" className="hover:text-blue-500 transition-colors">
                  Tarifs Réglementés (Compteur)
                </a>
              </li>
              <li>
                <a href="#enterprise" className="hover:text-blue-500 transition-colors">
                  Navettes Programmées Familles
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Chauffeurs Agréés
            </h5>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigateTab('driver')} 
                  className="hover:text-blue-500 transition-colors text-left cursor-pointer"
                >
                  Cockpit Dashcam Embarqué
                </button>
              </li>
              <li>
                <a href="#drivers" className="hover:text-blue-500 transition-colors">
                  Conditions d'Adhésion DTW
                </a>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateTab('ledger')} 
                  className="hover:text-blue-500 transition-colors text-left cursor-pointer"
                >
                  Retrait Gains BaridiMob
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Régulation & Sécurité
            </h5>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigateTab('dispatch')} 
                  className="hover:text-blue-500 transition-colors text-left cursor-pointer"
                >
                  Poste de Contrôle Flotte DTW
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateTab('inspector')} 
                  className="hover:text-blue-500 transition-colors text-left cursor-pointer text-blue-600 dark:text-blue-400 font-bold"
                >
                  Scanner Contrôle Routier DTW
                </button>
              </li>
              <li>
                <a href="#safety" className="hover:text-blue-500 transition-colors">
                  Séquestre Judiciaire (Loi 25-11)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Fintech & Écosystème
            </h5>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigateTab('ledger')} 
                  className="hover:text-blue-500 transition-colors text-left cursor-pointer"
                >
                  Grand Livre TrustDesk
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateTab('sync')} 
                  className="hover:text-blue-500 transition-colors text-left cursor-pointer"
                >
                  Simulateur Multi-Surfaces
                </button>
              </li>
              <li className="pt-2 text-[10px] text-slate-400">
                Souveraineté Numérique Algérienne • Wilaya 16
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200/60 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <span>© 2026 WASSLANI. Tous droits réservés. Décret Exécutif N° 12-230.</span>
          <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
            Architecture Découplée 5 Surfaces
          </span>
        </div>
      </footer>

    </div>
  );
};
