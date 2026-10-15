import React, { useState } from 'react';
import { 
  Globe, 
  Smartphone, 
  Car, 
  Monitor, 
  Wallet, 
  ShieldCheck, 
  Layers, 
  ChevronUp, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import type { ActiveTab } from './Header';
import { soundEngine } from '../utils/audio';

interface SurfaceSwitcherProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  lang: string;
}

export const SurfaceSwitcher: React.FC<SurfaceSwitcherProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const surfaces: { id: ActiveTab; label: string; labelShort: string; icon: React.ReactNode; category: string }[] = [
    {
      id: 'home',
      label: 'Site Public & Réglementation',
      labelShort: 'Marketing',
      icon: <Globe className="w-3.5 h-3.5" />,
      category: 'Vitrine Web'
    },
    {
      id: 'rider',
      label: 'Application Passager',
      labelShort: 'Passager',
      icon: <Smartphone className="w-3.5 h-3.5" />,
      category: 'Client Mobile'
    },
    {
      id: 'driver',
      label: 'Cockpit Chauffeur & Boîte Noire',
      labelShort: 'Chauffeur',
      icon: <Car className="w-3.5 h-3.5" />,
      category: 'Tablette Pro'
    },
    {
      id: 'dispatch',
      label: 'Direction des Transports (DTW)',
      labelShort: 'Admin DTW',
      icon: <Monitor className="w-3.5 h-3.5" />,
      category: 'Poste Desktop'
    },
    {
      id: 'ledger',
      label: 'Grand Livre & Trésorerie',
      labelShort: 'Finances',
      icon: <Wallet className="w-3.5 h-3.5" />,
      category: 'TrustDesk'
    },
    {
      id: 'inspector',
      label: 'Contrôle Routier Checkpoint',
      labelShort: 'Inspecteur DTW',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      category: 'Police / DTW'
    },
    {
      id: 'sync',
      label: 'Démonstrateur Sync Multi-Appareils',
      labelShort: 'Vue Démo',
      icon: <Layers className="w-3.5 h-3.5" />,
      category: 'Laboratoire'
    },
  ];

  const handleSwitch = (tab: ActiveTab) => {
    soundEngine.playClick();
    onSelectTab(tab);
    // Sync to window hash
    if (typeof window !== 'undefined') {
      window.location.hash = tab === 'home' ? '' : tab;
    }
  };

  return (
    <aside 
      aria-label="Sélecteur d'application et de portail"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all font-sans"
    >
      <div className="glass-panel p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-300 dark:border-white/15 backdrop-blur-2xl flex items-center space-x-1 sm:space-x-1.5 bg-white/90 dark:bg-slate-900/95 max-w-[95vw] overflow-x-auto">
        
        {/* Toggle Collapse on Mobile */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer hidden sm:flex items-center space-x-1"
          title={isExpanded ? "Réduire le sélecteur" : "Afficher toutes les surfaces"}
        >
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        {/* Current Active Pill when collapsed */}
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portail Actif: {surfaces.find(s => s.id === activeTab)?.labelShort}</span>
          </button>
        )}

        {/* Full Surface List */}
        {isExpanded && (
          <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-0.5">
            {surfaces.map((surface) => {
              const isActive = activeTab === surface.id;
              return (
                <button
                  key={surface.id}
                  onClick={() => handleSwitch(surface.id)}
                  title={surface.label}
                  className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-400/50'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-emerald-500'}>
                    {surface.icon}
                  </span>
                  <span>{surface.labelShort}</span>
                </button>
              );
            })}
          </div>
        )}

      </div>
    </aside>
  );
};
