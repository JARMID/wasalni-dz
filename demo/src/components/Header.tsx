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
  Bot,
  Globe,
  ChevronDown,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import type { AppLang } from '../utils/i18n';
export type { AppLang };
import { getTranslation } from '../utils/i18n';

export type ActiveTab = 'home' | 'rider' | 'driver' | 'dispatch' | 'ledger' | 'sync';

export interface BrandOption {
  id: string;
  name: string;
  nameAr: string;
  tag: string;
}

export const BRAND_OPTIONS: BrandOption[] = [
  { id: 'wasalni', name: 'WASALNI DZ', nameAr: 'وصلني', tag: 'Populaire & Convivial (Darija)' },
  { id: 'aman', name: 'AMAN DZ', nameAr: 'أمان', tag: 'Sûreté & Boîte Noire Judiciaire' },
  { id: 'masar', name: 'MASAR DZ', nameAr: 'مسار', tag: 'Télématique & Guidage H3' },
  { id: 'naql', name: 'NAQL DZ', nameAr: 'نقل الجزائر', tag: 'Institutionnel & Réglementé' },
];

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang: AppLang;
  setLang: (lang: AppLang) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  onReset: () => void;
  onOpenCopilot: () => void;
  selectedBrand?: BrandOption;
  onSelectBrand?: (brand: BrandOption) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  isDark,
  setIsDark,
  onReset,
  onOpenCopilot,
  selectedBrand = BRAND_OPTIONS[0],
  onSelectBrand,
}) => {
  const [soundOn, setSoundOn] = useState(true);
  const [isBrandMenuOpen, setIsBrandMenuOpen] = useState(false);
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  const isPortalMode = activeTab === 'home';

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
        
        {/* Main Header Bar */}
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Logo & Brand Identity with Quick Name Switcher */}
          <div className="relative flex items-center space-x-3 group">
            <button
              onClick={() => handleTabChange('home')}
              className="flex items-center space-x-3 cursor-pointer text-left focus:outline-none"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/25 text-white font-black group-hover:scale-105 transition-transform border border-emerald-400/40">
                <Car className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 dark:text-white font-sans">
                    {lang === 'ar' ? selectedBrand.nameAr : selectedBrand.name}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 rounded-full tracking-wider flex items-center space-x-1">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    <span>{t('dtwBadge')}</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  {t('brandSubtitle')}
                </p>
              </div>
            </button>

            {/* Brand Name Picker Trigger */}
            <button
              onClick={() => setIsBrandMenuOpen(!isBrandMenuOpen)}
              title="Choisir le nom officiel de la marque"
              className="p-1 rounded-lg text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Brand Dropdown Menu */}
            {isBrandMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 p-2 z-[100] animate-fadeIn">
                <div className="px-3 py-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100 dark:border-white/5 mb-1">
                  Sélection du Nom Officiel :
                </div>
                {BRAND_OPTIONS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      soundEngine.playSelection();
                      if (onSelectBrand) onSelectBrand(b);
                      setIsBrandMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                      selectedBrand.id === b.id
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 font-bold border border-emerald-500/30'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold">{b.name} <span className="text-[11px] font-normal text-slate-400">({b.nameAr})</span></div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{b.tag}</div>
                    </div>
                    {selectedBrand.id === b.id && <Sparkles className="w-3.5 h-3.5 text-emerald-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center: Clean Two-Tier Mode Switcher (Portal vs Live Apps) */}
          <div className="hidden md:flex items-center p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-900/90 border border-slate-300/70 dark:border-white/10 shadow-inner">
            <button
              onClick={() => handleTabChange('home')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isPortalMode
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{t('modePortal')}</span>
            </button>

            <button
              onClick={() => handleTabChange(isPortalMode ? 'rider' : activeTab)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                !isPortalMode
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t('modeApps')}</span>
            </button>
          </div>

          {/* Right Controls: AI Copilot, Theme, Audio & Languages */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            
            {/* AI Copilot Button */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenCopilot();
              }}
              title="Copilote IA Réglementaire (Décret 12-230 & Loi 25-11)"
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all shadow-md cursor-pointer group"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden lg:inline">Copilote IA</span>
              <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[9px] font-mono">Qwen</span>
            </button>

            {/* Light / Dark Mode Switcher */}
            <button
              onClick={toggleTheme}
              title={isDark ? t('themeLight') : t('themeDark')}
              className="p-2 sm:p-2.5 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-emerald-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={soundOn ? t('soundMute') : t('soundUnmute')}
              className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer ${
                soundOn 
                  ? 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' 
                  : 'border-slate-300 dark:border-white/10 text-slate-400'
              }`}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Working Trilingual Switcher (FR / AR / EN) */}
            <div className="flex items-center bg-slate-200/70 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 rounded-xl p-0.5 text-xs font-bold">
              <button
                onClick={() => changeLanguage('fr')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  lang === 'fr' 
                    ? 'bg-white dark:bg-white/15 text-emerald-600 dark:text-emerald-300 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => changeLanguage('ar')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  lang === 'ar' 
                    ? 'bg-white dark:bg-white/15 text-emerald-600 dark:text-emerald-300 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                عربي
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  lang === 'en' 
                    ? 'bg-white dark:bg-white/15 text-emerald-600 dark:text-emerald-300 shadow-sm' 
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

        {/* Secondary Application Dock (Visible when in Live Apps mode) */}
        {!isPortalMode && (
          <div className="py-2.5 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between overflow-x-auto gap-2 animate-fadeIn">
            <div className="flex items-center space-x-1 sm:space-x-1.5 text-xs font-bold">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mr-2 hidden md:inline">
                Applications :
              </span>
              
              <button
                onClick={() => handleTabChange('rider')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'rider'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{t('navRider')}</span>
              </button>

              <button
                onClick={() => handleTabChange('driver')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'driver'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>{t('navDriver')}</span>
              </button>

              <button
                onClick={() => handleTabChange('dispatch')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'dispatch'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>{t('navFleet')}</span>
              </button>

              <button
                onClick={() => handleTabChange('ledger')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'ledger'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>{t('navLedger')}</span>
              </button>

              <button
                onClick={() => handleTabChange('sync')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'sync'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{t('navLiveDemo')}</span>
              </button>
            </div>

            <button
              onClick={() => handleTabChange('home')}
              className="text-xs text-slate-500 hover:text-emerald-500 flex items-center space-x-1 font-semibold whitespace-nowrap cursor-pointer"
            >
              <span>← {t('modePortal')}</span>
            </button>
          </div>
        )}

        {/* Mobile Fast Mode Switcher (Visible on small screens) */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-200 dark:border-white/10 text-xs font-bold">
          <button
            onClick={() => handleTabChange('home')}
            className={`px-3 py-1 rounded-xl cursor-pointer ${isPortalMode ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}
          >
            {t('modePortal')}
          </button>
          <button
            onClick={() => handleTabChange(isPortalMode ? 'rider' : activeTab)}
            className={`px-3 py-1 rounded-xl cursor-pointer ${!isPortalMode ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}
          >
            {t('modeApps')}
          </button>
        </div>

      </div>
    </header>
  );
};
