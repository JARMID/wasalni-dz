import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Smartphone, 
  Video, 
  Layers, 
  ShieldCheck, 
  Wallet, 
  ArrowRight, 
  Check, 
  Compass
} from 'lucide-react';
import type { AppLang } from '../utils/i18n';
import type { ActiveTab } from './Header';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalShowcaseProps {
  lang: AppLang;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const HorizontalShowcase: React.FC<HorizontalShowcaseProps> = ({ lang, onNavigateTab }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const getDistance = () => track.scrollWidth - window.innerWidth + 80;

      gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top 72px',
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  const isAr = lang === 'ar';

  const slides = [
    {
      id: 'rider' as ActiveTab,
      badge: isAr ? 'الزبائن والركاب' : 'Passager Mobile Web',
      icon: Smartphone,
      accent: 'blue',
      title: isAr ? 'تطبيق الركاب العصري' : 'Expérience Passager Sans Friction',
      desc: isAr 
        ? 'طلب سريع بالذكاء الاصطناعي، تتبع مباشر للسيارة، وحساب تسعيرة دقيق مطابق لعداد ولاية الجزائر.'
        : 'Réservation géolocalisée, estimation instantanée, options de paiement BaridiMob ou espèces avec retour monnaie.',
      bullets: [
        isAr ? 'حجز مباشر أو مجدول للرحلات' : 'Réservation immédiate ou planifiée',
        isAr ? 'دفع آمن بالبطاقة الذهبية وبريدي موب' : 'Paiement sans contact CIB & BaridiMob',
        isAr ? 'مشاركة المسار الحي مع العائلة' : 'Partage de trajet en temps réel avec un proche',
      ],
      cta: isAr ? 'افتح تطبيق الركاب' : 'Lancer le Portail Passager',
    },
    {
      id: 'driver' as ActiveTab,
      badge: isAr ? 'السائقون المحترفون' : 'Cockpit Chauffeur HUD',
      icon: Video,
      accent: 'amber',
      title: isAr ? 'مقصورة السائق واللوحة الذكية' : 'Poste de Conduite & Boîte Noire',
      desc: isAr
        ? 'تسجيل آلي معتمد على كاميرا الهاتف، قبول الطلبات بلمسة واحدة، وحساب الأرباح اليومية فورا.'
        : 'Interface optimisée pour support tableau de bord, enregistrement continu CameraX et gestion du reliquat.',
      bullets: [
        isAr ? 'كاميرا حماية دائمة تسجل آخر 30 دقيقة' : 'Boîte noire locale avec buffer 30 minutes',
        isAr ? 'تحويل الفكة المتبقية إلى رصيد الزبون' : 'Crédit monnaie sans espèces d’un geste',
        isAr ? 'سحب المداخيل نحو الحساب البريدي الجاري' : 'Virement direct vers le compte CCP',
      ],
      cta: isAr ? 'افتح مقصورة السائق' : 'Ouvrir le Cockpit Chauffeur',
    },
    {
      id: 'dispatch' as ActiveTab,
      badge: isAr ? 'إدارة الأساطيل' : 'Console Dispatch Flotte',
      icon: Layers,
      accent: 'indigo',
      title: isAr ? 'المراقبة الحية والذكاء الاصطناعي' : 'Supervision Temps Réel Wilaya 16',
      desc: isAr
        ? 'متابعة شاملة لسيارات الأجرة المعتمدة في الجزائر العاصمة، توزيع ديناميكي على نقاط الذروة.'
        : 'Cartographie télématique haute fréquence, détection des goulets d’étranglement et dispatching automatisé.',
      bullets: [
        isAr ? 'خريطة تفاعلية لأسطول سيارات الأجرة' : 'Flotte active avec statuts en direct',
        isAr ? 'تحليل ذكي لطلب الرحلات في البلديات' : 'Heatmap de demande sur les 57 communes',
        isAr ? 'تنبيهات فورية للطوارئ والحوادث' : 'Gestion des alarmes et alertes de détresse',
      ],
      cta: isAr ? 'افتح شاشة الإدارة' : 'Accéder au Dispatch Flotte',
    },
    {
      id: 'inspector' as ActiveTab,
      badge: isAr ? 'الرقابة والتفتيش' : 'Guichet Contrôle DTW',
      icon: ShieldCheck,
      accent: 'blue',
      title: isAr ? 'التدقيق الميداني الرسمي' : 'Vérification Officielle de Terrain',
      desc: isAr
        ? 'أداة رقابية مخصصة لمفتشي مديرية النقل وأعوان الأمن للتحقق السريع من رخص المكان والاعتمادات.'
        : 'Contrôle instantané de conformité réglementaire par scan QR pour la police et les inspecteurs des transports.',
      bullets: [
        isAr ? 'فحص سريع لرقم الاعتماد وبطاقة السائق' : 'Vérification agrément et livret de place',
        isAr ? 'تأكيد التسجيل في السجل التجاري' : 'Contrôle CNRC 604103 en temps réel',
        isAr ? 'سجل للمخالفات والمعاينات الميدانية' : 'Journal des contrôles sur voie publique',
      ],
      cta: isAr ? 'افتح بوابة التفتيش' : 'Ouvrir l’Espace Inspecteur',
    },
    {
      id: 'ledger' as ActiveTab,
      badge: isAr ? 'السجل المالي' : 'Grand Livre Comptable',
      icon: Wallet,
      accent: 'sky',
      title: isAr ? 'الشفافية المصرفية والمالية' : 'Traçabilité & Flux Satim / CCP',
      desc: isAr
        ? 'تدقيق دقيق لجميع التعاملات المالية، من شحن المحفظة إلى تحويل مستحقات السائقين واقتطاع العمولة.'
        : 'Audit cryptographique à double entrée pour chaque transaction, commission artisan et solde monnaie.',
      bullets: [
        isAr ? 'سجل غير قابل للتعديل لكل رحلة' : 'Grand livre à double entrée audité',
        isAr ? 'مطابقة مع نظام بريدي موب وSatim' : 'Rapprochement direct BaridiMob / Satim',
        isAr ? 'تصدير التقارير الضريبية والمحاسبية' : 'Exportation des bilans pour expert-comptable',
      ],
      cta: isAr ? 'افتح السجل المالي' : 'Consulter le Grand Livre',
    },
  ];

  return (
    <section ref={wrapRef} className="relative overflow-hidden py-10 bg-slate-100/50 dark:bg-slate-950/50 border-y border-slate-200 dark:border-white/5">
      
      {/* Intro Header */}
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>{isAr ? 'معمارية متعددة الواجهات' : '5 Portails Indépendants Découplés'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isAr ? 'استكشف واجهات منصة وصلني' : 'Parcourez l’Écosystème WASSLANI'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            {isAr
              ? 'تصفح أفقي متزامن لجميع التطبيقات المتصلة بنفس قاعدة البيانات اللحظية'
              : 'Faites défiler horizontalement pour inspecter les surfaces spécialisées métier'}
          </p>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div ref={trackRef} className="flex gap-6 px-8 items-center h-[520px] will-change-transform">
        {slides.map((slide, idx) => {
          const Icon = slide.icon;
          return (
            <div
              key={slide.id}
              className="w-[340px] sm:w-[400px] shrink-0 rounded-3xl p-7 border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 shadow-xl backdrop-blur-md flex flex-col justify-between h-[460px] transition-all hover:border-blue-500/40"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-slate-200/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300">
                    PORTAL 0{idx + 1}
                  </span>
                </div>

                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
                  {slide.badge}
                </span>

                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                  {slide.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                  {slide.desc}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
                  {slide.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="truncate">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onNavigateTab(slide.id)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer group"
                >
                  <span>{slide.cta}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
