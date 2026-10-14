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
  Layers 
} from 'lucide-react';
import type { AppLang } from '../utils/i18n';
import { getTranslation } from '../utils/i18n';
import type { ActiveTab } from './Header';

interface LandingViewProps {
  lang: AppLang;
  onNavigateTab: (tab: ActiveTab) => void;
  isDark?: boolean;
}

export const LandingView: React.FC<LandingViewProps> = ({
  lang,
  onNavigateTab,
  isDark: _isDark,
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  return (
    <div className="space-y-16 pb-20 animate-fadeIn">
      
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 pb-8 overflow-hidden text-center max-w-5xl mx-auto px-4">
        
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-sky-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

        {/* Official Wilaya Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase mb-6 border transition-all glass-panel">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-amber-500 dark:text-amber-300">{t('heroBadge')}</span>
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
            className="flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-bold text-sm shadow-xl shadow-sky-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            <span>{t('heroCtaRider')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigateTab('driver')}
            className="flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>{t('heroCtaDriver')}</span>
          </button>

          <button
            onClick={() => onNavigateTab('sync')}
            className="flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl glass-panel-interactive font-bold text-sm text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-emerald-500" />
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
              <span className="text-xl sm:text-2xl font-black text-emerald-500 dark:text-emerald-400">{t('statResponse')}</span>
              <Activity className="w-4 h-4 text-emerald-500/70" />
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
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Une Solution Intégrée pour Chaque Acteur du Transport
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Conçue pour répondre aux réalités du terrain algérien : monnaie physique, réglementation et sécurité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1: Passager */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between border relative group hover:border-sky-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-500 mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-sky-500/10 text-sky-500 dark:text-sky-300 mb-3">
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
              className="w-full flex items-center justify-between p-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-300 text-xs font-bold transition-all cursor-pointer"
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
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-500 dark:text-amber-300 mb-3">
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
          <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between border relative group hover:border-emerald-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                <Gauge className="w-6 h-6" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-500 dark:text-emerald-300 mb-3">
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
              className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-xs font-bold transition-all cursor-pointer"
            >
              <span>{t('heroCtaFleet')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>


      {/* How the Flywheel Solves Algeria's Cash Dilemma */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-transparent to-emerald-500/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-amber-400/15 text-amber-500 dark:text-amber-300 font-bold text-xs mb-4">
                <Coins className="w-3.5 h-3.5" />
                <span>INNOVATION FINTECH ALGÉRIE</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
                Le "Spare Change Flywheel" : Zéro Conflit de Monnaie
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                En Algérie, 94% des règlements de taxis s'effectuent en espèces, ce qui engendre des frictions quotidiennes lors des rendus de monnaie sur les coupures de 1 000 DA ou 2 000 DA.
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Le chauffeur conserve le billet complet en espèces dans sa poche.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Le reliquat exact (ex. 150 DA) est transféré numériquement depuis son compte vers le passager.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Le passager réutilise ce solde immédiatement pour payer ses prochaines courses.</span>
                </li>
              </ul>
            </div>

            <div className="glass-panel p-6 rounded-2xl border space-y-4 text-center">
              <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Exemple Concret</span>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/10 dark:bg-slate-900/60 border text-xs">
                <span>Course Alger Centre → Kouba :</span>
                <span className="font-bold text-amber-500">850 DA</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/10 dark:bg-slate-900/60 border text-xs">
                <span>Billet remis en espèces :</span>
                <span className="font-bold">1 000 DA</span>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                <span className="block text-xs font-semibold mb-1">Crédit Immédiat au Portefeuille :</span>
                <span className="text-2xl font-black">+150.00 DA</span>
              </div>
              <button
                onClick={() => onNavigateTab('ledger')}
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs hover:opacity-90 transition-all cursor-pointer"
              >
                Inspecter le Grand Livre Comptable
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Official Regulatory Compliance Footer Section */}
      <section className="max-w-5xl mx-auto px-4 pt-6 border-t border-slate-200 dark:border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">
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

    </div>
  );
};
