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
  ChevronDown,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Palette
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import type { AppLang } from '../utils/i18n';
export type { AppLang };
import { getTranslation } from '../utils/i18n';
import { LOGO_CONCEPTS } from './LogoShowcaseModal';

export type ActiveTab = 'home' | 'rider' | 'driver' | 'dispatch' | 'ledger' | 'sync' | 'inspector';

export interface BrandOption {
  id: string;
  name: string;
  nameAr: string;
  tag: string;
}

export const BRAND_OPTIONS: BrandOption[] = [
  { id: 'wasslani', name: 'WASSLANI', nameAr: 'وصلني', tag: 'Plateforme Officielle des Taxis Agréés' },
  { id: 'aman', name: 'AMAN', nameAr: 'أمان', tag: 'Sûreté & Boîte Noire Judiciaire' },
  { id: 'masar', name: 'MASAR', nameAr: 'مسار', tag: 'Télématique & Guidage H3' },
  { id: 'naql', name: 'NAQL', nameAr: 'نقل الجزائر', tag: 'Institutionnel & Réglementé' },
];

export type GraphicsPalette = 'mandarine' | 'carmin' | 'cyan' | 'monochrome';

export interface PaletteOption {
  id: GraphicsPalette;
  name: string;
  nameAr: string;
  dotColor: string;
  tagline: string;
}

export const PALETTE_OPTIONS: PaletteOption[] = [
  { id: 'mandarine', name: 'Mandarine & Titane', nameAr: 'برتقالي شمسي وتيتانيوم', dotColor: '#FF5C00', tagline: 'Mobilité cinétique & fort contraste' },
  { id: 'carmin', name: 'Carmin & Carbone', nameAr: 'قرمزي كربوني', dotColor: '#E11D48', tagline: 'Énergie souveraine & vitesse' },
  { id: 'cyan', name: 'Cyan & Nuit Abyssale', nameAr: 'سماوي فضائي وليل', dotColor: '#06B6D4', tagline: 'Précision télématique & satellite' },
  { id: 'monochrome', name: 'Monochrome & Champagne', nameAr: 'أحادي اللون وشامبانيا', dotColor: '#F4F4F5', tagline: 'Luxe discret & rigueur suisse' },
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
  selectedLogoId?: string;
  onOpenLogoShowcase?: () => void;
  selectedPalette?: GraphicsPalette;
  onSelectPalette?: (palette: GraphicsPalette) => void;
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
  selectedLogoId = 'logo-01',
  onOpenLogoShowcase,
  selectedPalette = 'mandarine',
  onSelectPalette,
}) => {
  const [soundOn, setSoundOn] = useState(true);
  const [isBrandMenuOpen, setIsBrandMenuOpen] = useState(false);
  const [isPaletteMenuOpen, setIsPaletteMenuOpen] = useState(false);
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  const activeLogo = LOGO_CONCEPTS.find(c => c.id === selectedLogoId) || LOGO_CONCEPTS[0];
  const activePaletteObj = PALETTE_OPTIONS.find(p => p.id === selectedPalette) || PALETTE_OPTIONS[0];

  const isMarketingMode = activeTab === 'home';

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundEngine.setSoundEnabled(next);
    if (next) soundEngine.playClick();
  };

  const handleTabChange = (tab: ActiveTab) => {
    soundEngine.playClick();
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab === 'home' ? '' : tab;
    }
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

  // Surface metadata for application view
  const surfaceInfo: Record<ActiveTab, { title: string; subtitle: string; icon: React.ReactNode; badge: string }> = {
    home: {
      title: lang === 'ar' ? selectedBrand.nameAr : selectedBrand.name,
      subtitle: t('brandSubtitle'),
      icon: <Car className="w-5 h-5 text-blue-500" />,
      badge: t('dtwBadge'),
    },
    rider: {
      title: lang === 'ar' ? `${selectedBrand.nameAr} - الراكب` : `${selectedBrand.name} Passager`,
      subtitle: 'Réservation immédiate & VTC réglementé à Alger',
      icon: <Smartphone className="w-5 h-5 text-sky-500" />,
      badge: 'APP CLIENT',
    },
    driver: {
      title: lang === 'ar' ? `${selectedBrand.nameAr} - السائق` : `${selectedBrand.name} Cockpit Chauffeur`,
      subtitle: 'Tablette embarquée • Boîte noire CameraX & Télématique',
      icon: <Car className="w-5 h-5 text-amber-500" />,
      badge: 'CHAUFFEUR AGRÉÉ',
    },
    dispatch: {
      title: 'Direction des Transports (DTW Alger)',
      subtitle: 'Salle des Opérations & Suivi Télématique de Flotte',
      icon: <Monitor className="w-5 h-5 text-blue-500" />,
      badge: 'POSTE DISPATCH',
    },
    ledger: {
      title: 'TrustDesk • Grand Livre & Trésorerie',
      subtitle: 'Comptabilité en partie double & Rendu de monnaie',
      icon: <Wallet className="w-5 h-5 text-indigo-500" />,
      badge: 'FINTECH REGULATED',
    },
    inspector: {
      title: 'Contrôle Routier Checkpoint DTW',
      subtitle: 'Audit de conformité & Vérification d\'agrément sur le terrain',
      icon: <ShieldCheck className="w-5 h-5 text-amber-500" />,
      badge: 'POLICE / DTW',
    },
    sync: {
      title: 'Laboratoire Multi-Appareils',
      subtitle: 'Simulation synchronisée en temps réel (Chauffeur + Passager + Carte)',
      icon: <Layers className="w-5 h-5 text-purple-500" />,
      badge: 'DÉMONSTRATEUR',
    },
  };

  const currentSurface = surfaceInfo[activeTab];

  return (
    <header className="glass-panel border-b sticky top-0 z-40 shadow-xl backdrop-blur-xl transition-colors font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ======================================================== */}
        {/* CASE A: PURE MARKETING & SHOWCASE WEBSITE HEADER */}
        {/* ======================================================== */}
        {isMarketingMode ? (
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
            
            {/* Logo & Brand Identity with Quick Name Switcher */}
            <div className="relative flex items-center space-x-3 group">
              <button
                onClick={() => handleTabChange('home')}
                className="flex items-center space-x-3 cursor-pointer text-left focus:outline-none"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-950 border border-blue-500/40 p-1 shadow-lg shadow-blue-600/25 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
                  <img 
                    src={`/logos/${activeLogo.fileName}`} 
                    alt={activeLogo.titleFr} 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 dark:text-white">
                      {lang === 'ar' ? selectedBrand.nameAr : selectedBrand.name}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600/15 text-blue-700 dark:text-blue-300 border border-blue-500/30 rounded-full tracking-wider flex items-center space-x-1">
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
                className="p-1 rounded-lg text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
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
                          ? 'bg-blue-600/15 text-blue-600 dark:text-blue-300 font-bold border border-blue-500/30'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <div>
                        <div className="font-extrabold">{b.name} <span className="text-[11px] font-normal text-slate-400">({b.nameAr})</span></div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{b.tag}</div>
                      </div>
                      {selectedBrand.id === b.id && <Sparkles className="w-3.5 h-3.5 text-blue-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Center Navigation Links (Consumer Marketing) */}
            <nav className="hidden lg:flex items-center space-x-6 text-xs font-bold text-slate-600 dark:text-slate-300">
              <a 
                href="#services" 
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {t('marketingNavServices')}
              </a>
              <a 
                href="#drivers" 
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {t('marketingNavDrivers')}
              </a>
              <a 
                href="#safety" 
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {t('marketingNavSafety')}
              </a>
              <a 
                href="#enterprise" 
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {t('marketingNavEnterprise')}
              </a>
            </nav>

            {/* Right Action Gates & Controls */}
            <div className="flex items-center space-x-2 sm:space-x-2.5">
              
              {/* Primary Call to Action: Book Ride */}
              {/* Secondary CTA: Driver Space */}
              <a
                href="#drivers"
                className="hidden md:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-200/60 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-300/70 dark:border-white/10 transition-all cursor-pointer"
              >
                <Car className="w-3.5 h-3.5 text-[var(--brand-accent)]" />
                <span>Devenir Chauffeur</span>
              </a>

              {/* Primary Call to Action: Download App */}
              <a
                href="#download"
                className="hidden sm:flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-hover)] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[var(--brand-primary)]/25 transition-all cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Télécharger l'App</span>
                <ArrowRight className="w-3 h-3" />
              </a>

              {/* Graphics Chart Palette Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsPaletteMenuOpen(!isPaletteMenuOpen)}
                  title="Changer la charte graphique et la palette de couleurs"
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5 transition-all cursor-pointer text-xs font-bold shadow-sm"
                >
                  <Palette className="w-3.5 h-3.5 text-slate-400" />
                  <div 
                    className="w-2.5 h-2.5 rounded-full border border-white/20 shadow-sm shrink-0" 
                    style={{ backgroundColor: activePaletteObj.dotColor }}
                  />
                  <span className="hidden xl:inline">{activePaletteObj.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isPaletteMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 p-2 z-[100] animate-fadeIn text-left">
                    <div className="px-3 py-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100 dark:border-white/5 mb-1">
                      Charte Graphique WASSLANI :
                    </div>
                    {PALETTE_OPTIONS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          soundEngine.playSelection();
                          if (onSelectPalette) onSelectPalette(p.id);
                          setIsPaletteMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                          selectedPalette === p.id
                            ? 'bg-blue-600/15 text-blue-600 dark:text-blue-300 font-bold border border-blue-500/30'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <div 
                            className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm shrink-0" 
                            style={{ backgroundColor: p.dotColor }}
                          />
                          <div>
                            <div className="font-extrabold text-xs">{p.name}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">{p.tagline}</div>
                          </div>
                        </div>
                        {selectedPalette === p.id && <Sparkles className="w-3 h-3 text-blue-500 shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Light / Dark Mode Switcher */}
              <button
                onClick={toggleTheme}
                title={isDark ? t('themeLight') : t('themeDark')}
                className="p-2 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5 transition-all cursor-pointer"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>

              {/* Audio Toggle */}
              <button
                onClick={toggleSound}
                title={soundOn ? t('soundMute') : t('soundUnmute')}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  soundOn 
                    ? 'border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-600/10' 
                    : 'border-slate-300 dark:border-white/10 text-slate-400'
                }`}
              >
                {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Language Switcher (FR / AR / EN) */}
              <div className="flex items-center bg-slate-200/70 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 rounded-xl p-0.5 text-xs font-bold">
                <button
                  onClick={() => changeLanguage('fr')}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    lang === 'fr' 
                      ? 'bg-white dark:bg-white/15 text-blue-600 dark:text-blue-300 shadow-sm font-bold' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  FR
                </button>
                <button
                  onClick={() => changeLanguage('ar')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    lang === 'ar' 
                      ? 'bg-white dark:bg-white/15 text-blue-600 dark:text-blue-300 shadow-sm font-bold' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  عربي
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    lang === 'en' 
                      ? 'bg-white dark:bg-white/15 text-blue-600 dark:text-blue-300 shadow-sm font-bold' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>

            </div>

          </div>
        ) : (
          /* ======================================================== */
          /* CASE B: DEDICATED INDEPENDENT APPLICATION SURFACE HEADER */
          /* ======================================================== */
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
            
            {/* Left: Back to Marketing Website Button & Active Surface Persona */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleTabChange('home')}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-200/70 dark:bg-white/5 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10 text-xs font-bold transition-all cursor-pointer shadow-sm group"
                title="Retourner au portail et à la présentation"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">{t('backToMarketing')}</span>
              </button>

              <div className="h-6 w-px bg-slate-300 dark:bg-white/10 hidden sm:block" />

              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/10">
                  {currentSurface.icon}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      {currentSurface.title}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 uppercase tracking-wider hidden md:inline">
                      {currentSurface.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                    {currentSurface.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Quick Application Utility Controls */}
            <div className="flex items-center space-x-2 sm:space-x-2.5">
              
              {/* 10 Logos Showcase Button */}
              {onOpenLogoShowcase && (
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onOpenLogoShowcase();
                  }}
                  title="Explorer et choisir parmi les 10 logos officiels WASSLANI"
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-500 dark:text-amber-400 text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span className="hidden sm:inline">10 Logos</span>
                </button>
              )}

              {/* AI Copilot */}
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onOpenCopilot();
                }}
                title="Copilote IA Réglementaire"
                className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/40 text-blue-700 dark:text-blue-300 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
              >
                <Bot className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="hidden md:inline text-[11px]">Copilote</span>
              </button>

              {/* Graphics Chart Palette Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsPaletteMenuOpen(!isPaletteMenuOpen)}
                  title="Changer la charte graphique et la palette de couleurs"
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5 transition-all cursor-pointer text-xs font-bold shadow-sm"
                >
                  <Palette className="w-3.5 h-3.5 text-slate-400" />
                  <div 
                    className="w-2.5 h-2.5 rounded-full border border-white/20 shadow-sm shrink-0" 
                    style={{ backgroundColor: activePaletteObj.dotColor }}
                  />
                  <span className="hidden xl:inline">{activePaletteObj.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isPaletteMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 p-2 z-[100] animate-fadeIn text-left">
                    <div className="px-3 py-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100 dark:border-white/5 mb-1">
                      Charte Graphique WASSLANI :
                    </div>
                    {PALETTE_OPTIONS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          soundEngine.playSelection();
                          if (onSelectPalette) onSelectPalette(p.id);
                          setIsPaletteMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                          selectedPalette === p.id
                            ? 'bg-blue-600/15 text-blue-600 dark:text-blue-300 font-bold border border-blue-500/30'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <div 
                            className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm shrink-0" 
                            style={{ backgroundColor: p.dotColor }}
                          />
                          <div>
                            <div className="font-extrabold text-xs">{p.name}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">{p.tagline}</div>
                          </div>
                        </div>
                        {selectedPalette === p.id && <Sparkles className="w-3 h-3 text-blue-500 shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Light / Dark Mode Switcher */}
              <button
                onClick={toggleTheme}
                title={isDark ? t('themeLight') : t('themeDark')}
                className="p-2 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5 transition-all cursor-pointer"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>

              {/* Audio Toggle */}
              <button
                onClick={toggleSound}
                title={soundOn ? t('soundMute') : t('soundUnmute')}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  soundOn 
                    ? 'border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-600/10' 
                    : 'border-slate-300 dark:border-white/10 text-slate-400'
                }`}
              >
                {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Language Switcher */}
              <div className="flex items-center bg-slate-200/70 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 rounded-xl p-0.5 text-xs font-bold">
                <button
                  onClick={() => changeLanguage('fr')}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    lang === 'fr' ? 'bg-white dark:bg-white/15 text-blue-600 dark:text-blue-300 shadow-sm font-bold' : 'text-slate-500'
                  }`}
                >
                  FR
                </button>
                <button
                  onClick={() => changeLanguage('ar')}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    lang === 'ar' ? 'bg-white dark:bg-white/15 text-blue-600 dark:text-blue-300 shadow-sm font-bold' : 'text-slate-500'
                  }`}
                >
                  عربي
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    lang === 'en' ? 'bg-white dark:bg-white/15 text-blue-600 dark:text-blue-300 shadow-sm font-bold' : 'text-slate-500'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Reset State */}
              <button
                onClick={onReset}
                title={t('resetDemo')}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors border border-slate-300 dark:border-white/10 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

            </div>

          </div>
        )}

      </div>
    </header>
  );
};
