import React, { useState } from 'react';
import { 
  Car, 
  Smartphone, 
  Monitor, 
  Wallet, 
  Layers, 
  RotateCcw,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Home
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import type { AppLang } from '../utils/i18n';
export type { AppLang };
import { getTranslation } from '../utils/i18n';

export type ActiveTab = 'home' | 'rider' | 'driver' | 'dispatch' | 'ledger' | 'sync';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang: AppLang;
  setLang: (lang: AppLang) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  isDark,
  setIsDark,
  onReset,
}) => {
  const [soundOn, setSoundOn] = useState(true);
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundEngine.setSoundEnabled(next);
    if (next) soundEngine.playClick();
  };

  const handleTabChange = (tab: ActiveTab) => {
    soundEngine.playClick();
    setActiveTab(tab);
  };

  const toggleTheme = () => {
    soundEngine.playClick();
    setIsDark(!isDark);
  };

  const changeLanguage = (newLang: AppLang) => {
    soundEngine.playClick();
    setLang(newLang);
    if (newLang === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = newLang;
    }
  };

  return (
    <header className="glass-panel border-b sticky top-0 z-50 shadow-xl backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => handleTabChange('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25 text-slate-950 font-black group-hover:scale-105 transition-transform">
              <Car className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-xl tracking-tight font-sans">
                  {t('brandTitle')}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-400/20 text-amber-600 dark:text-amber-300 border border-amber-400/30 rounded-full tracking-wider">
                  {t('dtwBadge')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                {t('brandSubtitle')}
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden lg:flex items-center space-x-1 p-1 rounded-2xl bg-slate-200/60 dark:bg-slate-900/80 border border-slate-300/60 dark:border-white/10 shadow-inner">
            <button
              onClick={() => handleTabChange('home')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>{t('navHome')}</span>
            </button>

            <button
              onClick={() => handleTabChange('rider')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'rider'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{t('navRider')}</span>
            </button>

            <button
              onClick={() => handleTabChange('driver')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'driver'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>{t('navDriver')}</span>
            </button>

            <button
              onClick={() => handleTabChange('dispatch')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dispatch'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>{t('navFleet')}</span>
            </button>

            <button
              onClick={() => handleTabChange('ledger')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ledger'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{t('navLedger')}</span>
            </button>

            <button
              onClick={() => handleTabChange('sync')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'sync'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t('navLiveDemo')}</span>
            </button>
          </nav>

          {/* Controls: Theme, Language, Audio & Reset */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            
            {/* Light / Dark Mode Switcher */}
            <button
              onClick={toggleTheme}
              title={isDark ? t('themeLight') : t('themeDark')}
              className="p-2 sm:p-2.5 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={soundOn ? t('soundMute') : t('soundUnmute')}
              className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer ${
                soundOn 
                  ? 'border-amber-500/40 text-amber-500 bg-amber-500/10' 
                  : 'border-slate-300 dark:border-white/10 text-slate-400'
              }`}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Working Trilingual Switcher */}
            <div className="flex items-center bg-slate-200/70 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 rounded-xl p-0.5 text-xs font-bold">
              <button
                onClick={() => changeLanguage('fr')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  lang === 'fr' 
                    ? 'bg-white dark:bg-white/15 text-amber-600 dark:text-amber-300 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => changeLanguage('ar')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  lang === 'ar' 
                    ? 'bg-white dark:bg-white/15 text-amber-600 dark:text-amber-300 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                عربي
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  lang === 'en' 
                    ? 'bg-white dark:bg-white/15 text-amber-600 dark:text-amber-300 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Reset Simulation State */}
            <button
              onClick={onReset}
              title={t('resetDemo')}
              className="p-2 sm:p-2.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors border border-slate-300 dark:border-white/10 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center justify-between py-2 border-t border-slate-200 dark:border-white/10 overflow-x-auto space-x-1 text-xs font-bold">
          <button
            onClick={() => handleTabChange('home')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${activeTab === 'home' ? 'bg-amber-400 text-slate-950' : 'text-slate-500'}`}
          >
            {t('navHome')}
          </button>
          <button
            onClick={() => handleTabChange('rider')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${activeTab === 'rider' ? 'bg-amber-400 text-slate-950' : 'text-slate-500'}`}
          >
            {t('navRider')}
          </button>
          <button
            onClick={() => handleTabChange('driver')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${activeTab === 'driver' ? 'bg-amber-400 text-slate-950' : 'text-slate-500'}`}
          >
            {t('navDriver')}
          </button>
          <button
            onClick={() => handleTabChange('dispatch')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${activeTab === 'dispatch' ? 'bg-amber-400 text-slate-950' : 'text-slate-500'}`}
          >
            {t('navFleet')}
          </button>
          <button
            onClick={() => handleTabChange('ledger')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${activeTab === 'ledger' ? 'bg-amber-400 text-slate-950' : 'text-slate-500'}`}
          >
            {t('navLedger')}
          </button>
          <button
            onClick={() => handleTabChange('sync')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${activeTab === 'sync' ? 'bg-amber-400 text-slate-950' : 'text-slate-500'}`}
          >
            {t('navLiveDemo')}
          </button>
        </div>

      </div>
    </header>
  );
};
