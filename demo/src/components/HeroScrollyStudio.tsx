import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles,
  CheckCircle2,
  Video, 
  CreditCard,
  ArrowRight
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { AppLang } from '../utils/i18n';
import type { ActiveTab } from './Header';
import { soundEngine } from '../utils/audio';

gsap.registerPlugin(ScrollTrigger);

interface HeroScrollyStudioProps {
  lang: AppLang;
  onNavigateTab: (tab: ActiveTab) => void;
}

interface StudioStage {
  id: number;
  badge: string;
  badgeAr: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  metricValue: string;
  metricLabel: string;
  metricLabelAr: string;
  tag1: string;
  tag2: string;
  screenBadge: string;
  screenTitle: string;
  screenHighlight: string;
  hotspots: {
    x: string;
    y: string;
    title: string;
    detail: string;
  }[];
}

const STAGES: StudioStage[] = [
  {
    id: 0,
    badge: 'Pillier 01 • Dispatch H3',
    badgeAr: 'الركيزة 01 • توجيه سداسي ذكي',
    title: 'Maillage Algorithmique & Dispatch Prédictif',
    titleAr: 'توزيع فوري بدون تسعير عشوائي',
    subtitle: 'Régulation en temps réel de la demande sur 57 communes d’Alger. Attribution au chauffeur agréé le plus proche en 180 millisecondes.',
    subtitleAr: 'توزيع فوري للطلبات عبر 57 بلدية في العاصمة لأقرب سائق معتمد في 180 ميلي ثانية.',
    metricValue: '4.2 min',
    metricLabel: 'Prise en charge moyenne',
    metricLabelAr: 'متوسط وقت الوصول',
    tag1: 'Latence 180 ms',
    tag2: '12 480 Artisans Géolocalisés',
    screenBadge: 'DISPATCH ACTIF • H3 RES 8',
    screenTitle: 'Bab El Oued ↔ Aéroport Houari Boumediene',
    screenHighlight: '1 450 DZD au Compteur Réglementaire',
    hotspots: [
      {
        x: '24%',
        y: '32%',
        title: 'Cluster Alger-Centre',
        detail: '14 taxis disponibles à moins de 600m'
      },
      {
        x: '76%',
        y: '65%',
        title: 'Borne Aéroport DTW',
        detail: 'File d’attente prioritaire certifiée'
      }
    ]
  },
  {
    id: 1,
    badge: 'Pillier 02 • Décret 12-230',
    badgeAr: 'الركيزة 02 • مرسوم 12-230',
    title: 'Sceau Réglementaire & Boîte Noire CameraX',
    titleAr: 'حماية قانونية كاملة وكاميرا تسجيل',
    subtitle: 'Chaque trajet dispose d’un horodatage cryptographique SHA-256 scellé, garantissant une protection juridique totale contre la fourrière.',
    subtitleAr: 'توثيق رقمي لكل رحلة ببصمة مشفرة لمنع المحشر وحماية حقوق السائق والزبون.',
    metricValue: '100% Légal',
    metricLabel: 'Conforme Décret 12-230',
    metricLabelAr: 'مطابق للقانون الجزائري',
    tag1: 'Hachage SHA-256',
    tag2: 'Séquestre Judiciaire',
    screenBadge: 'BOÎTE NOIRE ACTIVE • 1080P',
    screenTitle: 'Enregistrement Chiffré en Boucle',
    screenHighlight: 'Bande Vidéo Scellée Matériellement',
    hotspots: [
      {
        x: '30%',
        y: '28%',
        title: 'Capteur 2.8G',
        detail: 'Déclenchement automatique en cas de choc'
      },
      {
        x: '70%',
        y: '58%',
        title: 'Agrément Wilaya 16',
        detail: 'Livret de place validé numériquement'
      }
    ]
  },
  {
    id: 2,
    badge: 'Pillier 03 • Split Immédiat',
    badgeAr: 'الركيزة 03 • تحويل فوري للبريد',
    title: 'Double Livre Comptable & Split BaridiMob',
    titleAr: 'تحويل فوري للأرباح إلى الحساب البريدي',
    subtitle: 'Ventilation automatique instantanée: 88% crédités directement sur le compte CCP du chauffeur et 12% de redevance plateforme.',
    subtitleAr: 'توزيع فوري: 88% لحساب بريدي موب للسائق و 12% لخدمات المنصة دون تأخير شهري.',
    metricValue: '88% Net',
    metricLabel: 'Versement direct CCP',
    metricLabelAr: 'مباشرة في بريدي موب',
    tag1: 'Virement en 3 secondes',
    tag2: 'Zéro Litige Monnaie',
    screenBadge: 'SPLIT CASHLESS AUTOMATIQUE',
    screenTitle: 'Course 1 450 DZD • BaridiMob Pay',
    screenHighlight: '1 276 DZD virés sur CCP Chauffeur',
    hotspots: [
      {
        x: '28%',
        y: '45%',
        title: 'Portefeuille Monnaie',
        detail: 'Appoint arrondi reversé au passager'
      },
      {
        x: '72%',
        y: '48%',
        title: 'Rapprochement CCP',
        detail: 'Frais de virement 0 DZD'
      }
    ]
  }
];

export const HeroScrollyStudio: React.FC<HeroScrollyStudioProps> = ({
  lang,
  onNavigateTab,
}) => {
  const isAr = lang === 'ar';
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Auto-tour progression timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % STAGES.length);
      soundEngine.playSelection();
    }, 4200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Scroll-linked progression via GSAP ScrollTrigger
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 75%',
        end: 'bottom 25%',
        onUpdate: (self) => {
          if (isPlaying) return;
          const p = self.progress;
          const stageIdx = p < 0.35 ? 0 : p < 0.70 ? 1 : 2;
          setActiveStage(stageIdx);
        },
      });
    }, el);

    return () => ctx.revert();
  }, [isPlaying]);

  // Subtle 3D perspective mouse tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setMouseTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  const currentStage = STAGES[activeStage];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 my-10">
      
      {/* Studio Glass Console */}
      <div 
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative rounded-3xl p-6 sm:p-10 border border-white/10 dark:border-white/5 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-2xl shadow-2xl overflow-hidden"
      >
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--brand-primary)] to-transparent opacity-80" />

        {/* Studio Header Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          
          {/* Stage Selector Pills */}
          <div className="flex items-center space-x-2">
            {STAGES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveStage(idx);
                  setIsPlaying(false);
                  soundEngine.playClick();
                }}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeStage === idx
                    ? 'bg-[var(--brand-primary)] text-white shadow-lg shadow-[var(--brand-primary)]/25 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <span>{isAr ? s.badgeAr : s.badge}</span>
              </button>
            ))}
          </div>

          {/* Interactive Playback & Reset Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setIsPlaying(!isPlaying);
                soundEngine.playClick();
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
              title={isPlaying ? 'Pause' : 'Lecture automatique'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-[var(--brand-primary)]" />}
              <span>{isPlaying ? (isAr ? 'إيقاف' : 'Pause') : (isAr ? 'عرض آلي' : 'Visite Guidée')}</span>
            </button>

            <button
              onClick={() => {
                setActiveStage(0);
                setIsPlaying(false);
                soundEngine.playClick();
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="Réinitialiser à l'étape 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Studio Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
          
          {/* Left Column: Descriptive Dossier */}
          <div className="lg:col-span-6 space-y-5 text-left">
            
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? currentStage.badgeAr : currentStage.badge}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              {isAr ? currentStage.titleAr : currentStage.title}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {isAr ? currentStage.subtitleAr : currentStage.subtitle}
            </p>

            {/* Stage Performance Metrics Banner */}
            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-[var(--brand-primary)] block">
                  {currentStage.metricValue}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {isAr ? currentStage.metricLabelAr : currentStage.metricLabel}
                </span>
              </div>
              <div className="h-10 w-[1px] bg-white/10" />
              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--brand-accent)] shrink-0" />
                  <span>{currentStage.tag1}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--brand-accent)] shrink-0" />
                  <span>{currentStage.tag2}</span>
                </div>
              </div>
            </div>

            {/* Direct Action Link */}
            <div className="pt-2 flex items-center space-x-3">
              <button
                onClick={() => onNavigateTab(activeStage === 0 ? 'rider' : activeStage === 1 ? 'driver' : 'ledger')}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[var(--brand-primary)] hover:opacity-90 text-white font-bold text-xs transition-all shadow-lg cursor-pointer"
              >
                <span>{isAr ? 'اختبار الواجهة الحية' : 'Tester ce module en direct'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Right Column: 3D Perspective Device Mockup with Realtime Telemetry */}
          <div className="lg:col-span-6 flex justify-center">
            
            <div 
              style={{
                transform: `perspective(1000px) rotateX(${mouseTilt.y}deg) rotateY(${mouseTilt.x}deg)`,
                transition: 'transform 0.15s ease-out'
              }}
              className="relative w-full max-w-[340px] sm:max-w-[360px] aspect-[9/16] rounded-[40px] p-3 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 border-4 border-slate-600 shadow-2xl shadow-black/80 flex flex-col justify-between overflow-hidden"
            >
              
              {/* Dynamic Island / Speaker Notch */}
              <div className="absolute top-4 inset-x-0 mx-auto w-24 h-4 rounded-full bg-black z-30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-500/40 animate-pulse mr-2" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              </div>

              {/* Screen Inner Viewport */}
              <div className="relative w-full h-full rounded-[30px] bg-slate-950 overflow-hidden flex flex-col justify-between p-4 pt-10 text-white border border-white/5">
                
                {/* Background Radar or Grid Texture */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--brand-primary)_0%,_transparent_70%)] pointer-events-none" />

                {/* Top Status Header */}
                <div className="relative z-10 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
                    <span>DTW ALGER • 16</span>
                    <span className="flex items-center space-x-1 text-[var(--brand-primary)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] animate-ping" />
                      <span>GPS FIX</span>
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <span className="text-[10px] font-bold text-[var(--brand-accent)] uppercase tracking-wider block">
                      {currentStage.screenBadge}
                    </span>
                    <h5 className="text-xs font-black text-white mt-0.5">
                      {currentStage.screenTitle}
                    </h5>
                    <p className="text-[11px] text-[var(--brand-primary)] font-bold mt-1">
                      {currentStage.screenHighlight}
                    </p>
                  </div>
                </div>

                {/* Interactive Hotspot Overlay System */}
                <div className="relative z-10 flex-1 my-4 flex items-center justify-center">
                  
                  {/* Visual Map / Graphic Centerpiece */}
                  <div className="relative w-full h-44 rounded-2xl bg-slate-900/90 border border-white/10 overflow-hidden flex items-center justify-center">
                    
                    {/* Concentric Radar Rings */}
                    <div className="absolute w-36 h-36 rounded-full border border-[var(--brand-primary)]/20 animate-ping" />
                    <div className="absolute w-24 h-24 rounded-full border border-white/10" />
                    <div className="absolute w-12 h-12 rounded-full border border-[var(--brand-accent)]/30" />
                    
                    {/* Central Target Icon */}
                    <div className="relative z-10 w-9 h-9 rounded-xl bg-[var(--brand-primary)] flex items-center justify-center shadow-lg shadow-[var(--brand-primary)]/40">
                      {activeStage === 0 && <Activity className="w-4 h-4 text-white" />}
                      {activeStage === 1 && <Video className="w-4 h-4 text-white" />}
                      {activeStage === 2 && <CreditCard className="w-4 h-4 text-white" />}
                    </div>

                    {/* Interactive Hotspot Pins */}
                    {currentStage.hotspots.map((hs, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setActiveHotspot(activeHotspot === i ? null : i);
                          soundEngine.playSelection();
                        }}
                        style={{ top: hs.y, left: hs.x }}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                        title={hs.title}
                      >
                        <span className="relative flex h-5 w-5 items-center justify-center">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--brand-accent)] opacity-60" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--brand-accent)]" />
                        </span>

                        {/* Tooltip Card */}
                        {(activeHotspot === i || activeHotspot === null) && (
                          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-36 p-2 rounded-lg bg-slate-900/95 border border-[var(--brand-accent)]/40 text-[10px] shadow-xl backdrop-blur-md pointer-events-none text-left">
                            <span className="font-bold text-[var(--brand-accent)] block">{hs.title}</span>
                            <span className="text-slate-300 text-[9px] leading-tight block">{hs.detail}</span>
                          </div>
                        )}
                      </button>
                    ))}

                  </div>

                </div>

                {/* Bottom Screen Card */}
                <div className="relative z-10 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--brand-accent)]" />
                    <span className="text-[10px] text-slate-300 font-medium">Liaison DTW 16 Active</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">99.8% SLA</span>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Stage Progress Bar Footer */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span>Progression:</span>
            <div className="w-32 sm:w-48 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div 
                style={{ width: `${((activeStage + 1) / STAGES.length) * 100}%` }}
                className="h-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] transition-all duration-300"
              />
            </div>
          </div>
          <span className="font-mono text-[11px] text-slate-400">
            {activeStage + 1} / {STAGES.length} Modules Validés
          </span>
        </div>

      </div>

    </div>
  );
};
