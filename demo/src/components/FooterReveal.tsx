import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Palette } from 'lucide-react';
import type { AppLang } from '../utils/i18n';
import type { ActiveTab, GraphicsPalette } from './Header';

import { LOGO_CONCEPTS } from './LogoShowcaseModal';

gsap.registerPlugin(ScrollTrigger);

interface FooterRevealProps {
  lang: AppLang;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenLogoModal?: () => void;
  selectedLogoId?: string;
  selectedPalette?: GraphicsPalette;
  onSelectPalette?: (palette: GraphicsPalette) => void;
}

export const FooterReveal: React.FC<FooterRevealProps> = ({
  lang,
  onNavigateTab,
  onOpenLogoModal,
  selectedLogoId = 'logo-01',
  selectedPalette = 'mandarine',
  onSelectPalette,
}) => {
  const isAr = lang === 'ar';
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const activeLogo = LOGO_CONCEPTS.find(l => l.id === selectedLogoId) || LOGO_CONCEPTS[0];

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Architectural curtain reveal: rises smoothly from behind the main upper content
      gsap.fromTo(
        contentRef.current,
        {
          y: -100,
          scale: 0.95,
          opacity: 0.45,
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 0.8,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={containerRef}
      className="relative z-10 w-full overflow-hidden bg-transparent"
    >
      {/* Top Edge Depth Cast-Shadow from the Main Curtain */}
      <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/60 via-black/25 to-transparent pointer-events-none z-20" />

      {/* Revealing Content Wrapper */}
      <div
        ref={contentRef}
        style={{ transformOrigin: '50% 100%' }}
        className="w-full pt-16 pb-12 px-4 sm:px-6 max-w-6xl mx-auto will-change-transform"
      >
        {/* Upper Brand & Quick Action Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 dark:bg-slate-950/95 border border-white/10 shadow-2xl backdrop-blur-xl mb-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Logo and Brand Presentation */}
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 p-2 flex items-center justify-center shrink-0 overflow-hidden">
                <img 
                  src={`/logos/${activeLogo.fileName}`} 
                  alt={activeLogo.titleFr} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-left">
                <div className="flex items-center space-x-2">
                  <h4 className="text-xl font-black text-white tracking-tight">WASSLANI</h4>
                  <span className="text-sm font-bold text-slate-400">وصلني</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Plateforme Nationale de Taxis et Mobilité Urbaine • Wilaya d'Alger
                </p>
              </div>
            </div>

            {/* Logo Showcase Trigger & Palette Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {onOpenLogoModal && (
                <button
                  onClick={onOpenLogoModal}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                  <span>{isAr ? 'عرض شعارات الهوية (10 نماذج)' : 'Galerie des 10 Logos Officiels'}</span>
                </button>
              )}

              {onSelectPalette && (
                <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
                  <Palette className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
                  {(['mandarine', 'carmin', 'cyan', 'monochrome'] as GraphicsPalette[]).map((pal) => (
                    <button
                      key={pal}
                      onClick={() => onSelectPalette(pal)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                        selectedPalette === pal
                          ? 'bg-[var(--brand-primary)] text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {pal === 'mandarine' ? 'Braise' : pal === 'carmin' ? 'Carmin' : pal === 'cyan' ? 'Cyan' : 'Titane'}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Multi-Column Directory */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-white/10 text-xs">
          
          {/* Column 1: Usagers */}
          <div className="space-y-3 text-left">
            <h5 className="font-extrabold text-white text-[11px] uppercase tracking-wider">
              {isAr ? 'المستخدمون والركاب' : 'Usagers & Mobilité'}
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => onNavigateTab('rider')}
                  className="hover:text-[var(--brand-primary)] transition-colors text-left cursor-pointer"
                >
                  Application Passager Web
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('rider')}
                  className="hover:text-[var(--brand-primary)] transition-colors text-left cursor-pointer"
                >
                  Tarifs Réglementés au Compteur
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('rider')}
                  className="hover:text-[var(--brand-primary)] transition-colors text-left cursor-pointer"
                >
                  Navettes Programmées Familles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('rider')}
                  className="hover:text-[var(--brand-primary)] transition-colors text-left cursor-pointer"
                >
                  Portefeuille Monnaie Épargne
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Artisans Taxieurs */}
          <div className="space-y-3 text-left">
            <h5 className="font-extrabold text-white text-[11px] uppercase tracking-wider">
              {isAr ? 'الحرفيون وسائقو الأجرة' : 'Chauffeurs Agréés'}
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => onNavigateTab('driver')}
                  className="hover:text-[var(--brand-primary)] transition-colors text-left cursor-pointer font-bold text-slate-300"
                >
                  Cockpit Dashcam Embarqué
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('driver')}
                  className="hover:text-[var(--brand-primary)] transition-colors text-left cursor-pointer"
                >
                  Conditions d'Adhésion DTW
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('ledger')}
                  className="hover:text-[var(--brand-primary)] transition-colors text-left cursor-pointer"
                >
                  Retrait Gains BaridiMob (0 DZD)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('driver')}
                  className="hover:text-[var(--brand-primary)] transition-colors text-left cursor-pointer"
                >
                  Sécurité Boîte Noire CameraX
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Régulation DTW */}
          <div className="space-y-3 text-left">
            <h5 className="font-extrabold text-white text-[11px] uppercase tracking-wider">
              {isAr ? 'مديرية النقل والرقابة' : 'Régulation & Sécurité'}
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => onNavigateTab('dispatch')}
                  className="hover:text-[var(--brand-primary)] transition-colors text-left cursor-pointer font-bold text-slate-300"
                >
                  Poste de Contrôle Flotte DTW
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('inspector')}
                  className="hover:text-[var(--brand-primary)] transition-colors text-left cursor-pointer"
                >
                  Scanner Contrôle Routier DTW
                </button>
              </li>
              <li>
                <span className="text-slate-400 block">
                  Décret Exécutif N° 12-230
                </span>
              </li>
              <li>
                <span className="text-slate-400 block">
                  Séquestre Judiciaire (Loi 25-11)
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Fintech & Souveraineté */}
          <div className="space-y-3 text-left">
            <h5 className="font-extrabold text-white text-[11px] uppercase tracking-wider">
              {isAr ? 'المالية والسيادة الرقمية' : 'Fintech & Souveraineté'}
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => onNavigateTab('ledger')}
                  className="hover:text-[var(--brand-primary)] transition-colors text-left cursor-pointer"
                >
                  Grand Livre TrustDesk
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('sync')}
                  className="hover:text-[var(--brand-primary)] transition-colors text-left cursor-pointer font-bold text-[var(--brand-primary)]"
                >
                  Simulateur Multi-Surfaces
                </button>
              </li>
              <li>
                <span className="text-slate-400 block">
                  Rapprochement Algérie Poste CCP
                </span>
              </li>
              <li>
                <span className="text-slate-400 block">
                  Serveurs Hébergés en Algérie
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Live DTW Network Ticker & Legal Baseline */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[var(--brand-primary)] animate-pulse" />
            <span className="text-slate-300 font-mono">
              DTW ALGER • 57 COMMUNES COUVERTES • NŒUD CENTRAL ACTIF
            </span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span>© 2026 WASSLANI. Tous droits réservés.</span>
            <span className="font-mono text-slate-500">
              Architecture Découplée 5 Portals
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
