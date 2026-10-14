import React, { useState } from 'react';
import { 
  Car, 
  Smartphone, 
  Monitor, 
  Wallet, 
  SplitSquareVertical, 
  ShieldCheck, 
  RotateCcw,
  Volume2,
  VolumeX
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

export type ActiveTab = 'sync' | 'driver' | 'rider' | 'dispatch' | 'ledger';
export type AppLang = 'fr' | 'ar' | 'en';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang: AppLang;
  setLang: (lang: AppLang) => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  onReset,
}) => {
  const [soundOn, setSoundOn] = useState(true);

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

  const handleReset = () => {
    soundEngine.playClick();
    onReset();
  };

  return (
    <header className="glass-panel border-b border-white/10 sticky top-0 z-50 shadow-2xl backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25 text-slate-950 font-black">
              <Car className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-sans">
                  NAQL DZ
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 rounded-full tracking-wide">
                  DTW ALGER
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Décret 12-230 • Agrément Municipal • Dashcam Télématique • Chargily Pay
              </p>
            </div>
          </div>

          {/* Perspective View Switcher */}
          <div className="hidden md:flex items-center space-x-1 bg-slate-950/80 p-1 rounded-2xl border border-white/10 shadow-inner">
            <button
              onClick={() => handleTabChange('sync')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'sync'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>Multi-Device Sync</span>
            </button>

            <button
              onClick={() => handleTabChange('driver')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'driver'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Cockpit Driver</span>
            </button>

            <button
              onClick={() => handleTabChange('rider')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'rider'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>App Passager</span>
            </button>

            <button
              onClick={() => handleTabChange('dispatch')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'dispatch'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Dispatch & Sûreté</span>
            </button>

            <button
              onClick={() => handleTabChange('ledger')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'ledger'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>TrustDesk Grand Livre</span>
            </button>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={soundOn ? 'Couper les sons' : 'Activer les sons'}
              className={`p-2 rounded-xl border transition-all ${
                soundOn 
                  ? 'bg-amber-400/10 border-amber-400/30 text-amber-300' 
                  : 'bg-slate-900 border-white/10 text-slate-500'
              }`}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Live Dedicated Supabase Badge */}
            <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Supabase: jgctorgztxwrgdkfkuxv</span>
            </div>

            {/* Regulatory Badge */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Loi 25-11 Souveraineté</span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-950/80 border border-white/10 rounded-xl p-0.5 text-xs">
              <button
                onClick={() => { soundEngine.playClick(); setLang('fr'); }}
                className={`px-2 py-1 rounded-lg font-bold transition-colors ${
                  lang === 'fr' ? 'bg-white/10 text-amber-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => { soundEngine.playClick(); setLang('ar'); }}
                className={`px-2 py-1 rounded-lg font-bold transition-colors ${
                  lang === 'ar' ? 'bg-white/10 text-amber-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                عربي
              </button>
              <button
                onClick={() => { soundEngine.playClick(); setLang('en'); }}
                className={`px-2 py-1 rounded-lg font-bold transition-colors ${
                  lang === 'en' ? 'bg-white/10 text-amber-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Reset Demo State */}
            <button
              onClick={handleReset}
              title="Réinitialiser la simulation"
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors border border-white/10"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Perspective Navigation Tabs */}
      <div className="md:hidden flex items-center justify-around border-t border-white/10 bg-slate-950/90 px-2 py-2 overflow-x-auto">
        <button
          onClick={() => handleTabChange('sync')}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold ${
            activeTab === 'sync' ? 'bg-amber-400 text-slate-950' : 'text-slate-400'
          }`}
        >
          <SplitSquareVertical className="w-3.5 h-3.5" />
          <span>Sync</span>
        </button>
        <button
          onClick={() => handleTabChange('driver')}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold ${
            activeTab === 'driver' ? 'bg-amber-400 text-slate-950' : 'text-slate-400'
          }`}
        >
          <Car className="w-3.5 h-3.5" />
          <span>Driver</span>
        </button>
        <button
          onClick={() => handleTabChange('rider')}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold ${
            activeTab === 'rider' ? 'bg-amber-400 text-slate-950' : 'text-slate-400'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Rider</span>
        </button>
        <button
          onClick={() => handleTabChange('dispatch')}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold ${
            activeTab === 'dispatch' ? 'bg-amber-400 text-slate-950' : 'text-slate-400'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Dispatch</span>
        </button>
        <button
          onClick={() => handleTabChange('ledger')}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold ${
            activeTab === 'ledger' ? 'bg-amber-400 text-slate-950' : 'text-slate-400'
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>Ledger</span>
        </button>
      </div>
    </header>
  );
};
