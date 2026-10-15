import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Video, Coins, ChevronRight, CheckCircle2, Lock, Scale, Zap } from 'lucide-react';
import type { AppLang } from '../utils/i18n';
import type { ActiveTab } from './Header';

gsap.registerPlugin(ScrollTrigger);

interface StickyStackProps {
  lang: AppLang;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const StickyStack: React.FC<StickyStackProps> = ({ lang, onNavigateTab }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const cardEls = gsap.utils.toArray<HTMLElement>('.stack-card');
      cardEls.forEach((card, i) => {
        if (i === cardEls.length - 1) return;

        // Pin each card until the final card reaches the pin point
        ScrollTrigger.create({
          trigger: card,
          start: 'top 88px',
          endTrigger: cardEls[cardEls.length - 1],
          end: 'top 88px',
          pin: true,
          pinSpacing: false,
        });

        // Scale down and fade preceding card as the next one advances
        gsap.to(card, {
          scale: 0.92,
          opacity: 0.35,
          y: -15,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: cardEls[i + 1],
            start: 'top 85%',
            end: 'top 88px',
            scrub: 0.6,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const isAr = lang === 'ar';

  return (
    <div ref={containerRef} className="relative max-w-5xl mx-auto px-4 py-8 space-y-12">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-3">
          <Scale className="w-3.5 h-3.5" />
          <span>{isAr ? 'الأعمدة الثلاثة للسيادة' : 'Piliers Réglementaires & Technologiques'}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          {isAr ? 'منصة مصممة خصيصاً للقانون الجزائري' : 'Conçu Intégralement pour le Cadre Algérien'}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          {isAr 
            ? 'دمج مباشر بين الرقمنة العصرية والمتطلبات الرسمية لمديريات النقل والحماية القانونية'
            : 'Trois verrous technologiques garantissant la sécurité juridique des artisans et le confort des passagers'}
        </p>
      </div>

      {/* Card 1: Décret 12-230 & Agrément Wilaya */}
      <div className="stack-card will-change-transform rounded-3xl p-6 sm:p-10 border border-blue-500/30 bg-white/95 dark:bg-slate-900/95 shadow-2xl backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-blue-600/15 text-blue-600 dark:text-blue-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>{isAr ? 'المرسوم التنفيذي 12-230' : 'Décret Exécutif 12-230 & CNRC 604103'}</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isAr ? 'مطابقة قانونية كاملة وحماية من المحشر' : 'Légalité Totale & Zéro Risque de Fourrière'}
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? 'على عكس التطبيقات الموازية غير القانونية، تعمل وصلني حصرياً مع الحرفيين وسائقي الطاكسي الحائزين على رخصة المكان والاعتماد الرسمي لمديرية النقل الولائية.'
                : 'Contrairement aux applications clandestines exposant les véhicules à la saisie administrative, WASSLANI opère exclusivement avec les titulaires d’un Livret de Place et d’un Agrément DTW validé.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs font-medium text-slate-700 dark:text-slate-200">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{isAr ? 'تحقق رقمي فوري من رمز الولاية (01-58)' : 'Validation matricule et wilaya en direct'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{isAr ? 'عداد تاكسيمتر رسمي متطابق مع القانون' : 'Calcul tarifaire conforme au compteur légal'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{isAr ? 'رمز QR أمني لمعاينة الشرطة والدرك' : 'QR code d’inspection pour agents de police'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{isAr ? 'عمولة مخفضة من 8% إلى 12% فقط' : 'Commission artisan réduite à 8%-12%'}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigateTab('inspector')}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                <span>{isAr ? 'معاينة شاشة مفتش النقل' : 'Tester le Guichet Inspecteur DTW'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="md:col-span-5 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-2xl p-6 border border-blue-500/20 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 dark:text-white">100% Homologué</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Conformité stricte avec les arrêtés interministériels transport & intérieur
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-950/60 border text-[11px] text-left font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Wilaya:</span>
                <span className="font-bold text-blue-500">16 Alger</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Statut DTW:</span>
                <span className="font-bold text-blue-500">Actif & Vérifié</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Agrément:</span>
                <span className="font-bold">AGR-2026-16-0492</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: CameraX Dashcam & Loi 25-11 */}
      <div className="stack-card will-change-transform rounded-3xl p-6 sm:p-10 border border-amber-500/30 bg-white/95 dark:bg-slate-900/95 shadow-2xl backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 text-xs font-bold">
              <Video className="w-4 h-4 text-amber-500" />
              <span>{isAr ? 'الأمن الرقمي والقانون 25-11' : 'Sécurité & Boîte Noire Loi 25-11'}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isAr ? 'تسجيل ذكي مستمر مع ختم تشفيري فوري' : 'Preuve Numérique Chiffrée & Protection des Artisans'}
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? 'كاميرا ذكية مدمجة في شاشة السائق تحتفظ بآخر 30 دقيقة داخل الذاكرة المحلية المشفرة. يتم قفل التسجيل تلقائياً عند استشعار صدمة أو عبر زر الطوارئ لحماية السائق من التعديات.'
                : 'Tampon circulaire local de 30 minutes chiffré sur l’appareil. En cas de choc ou d’activation du bouton d’alerte, le clip est scellé cryptographiquement et envoyé aux autorités judiciaires sans violer la vie privée.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs font-medium text-slate-700 dark:text-slate-200">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{isAr ? 'تشفير محلي صارم AES-256' : 'Chiffrement local inviolable AES-256'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{isAr ? 'قفل تلقائي عند حدوث تصادم أو فرملة قوية' : 'Déclenchement automatique par choc G-Force'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{isAr ? 'حماية من البلاغات الكيدية والشبهات' : 'Protection contre les fausses accusations'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{isAr ? 'زر استغاثة صامت متصل بمركز الشرطة' : 'Bouton SOS silencieux relié au central'}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigateTab('driver')}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <span>{isAr ? 'تجربة مقصورة السائق' : 'Tester le Cockpit Chauffeur HUD'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="md:col-span-5 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/20 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Video className="w-8 h-8" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 dark:text-white">Tampon 30 Min</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Conformité Loi 18-07 sur la protection des données personnelles
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-950/60 border text-[11px] text-left font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Flux Caméra:</span>
                <span className="font-bold text-amber-500">CameraX 1080p 60fps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Scellement:</span>
                <span className="font-bold text-blue-500">SHA-256 Ledger</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Statut G-Sensor:</span>
                <span className="font-bold text-emerald-500">Veille Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Spare Change Cashless Flywheel */}
      <div className="stack-card will-change-transform rounded-3xl p-6 sm:p-10 border border-sky-500/30 bg-white/95 dark:bg-slate-900/95 shadow-2xl backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-sky-500/15 text-sky-700 dark:text-sky-300 text-xs font-bold">
              <Coins className="w-4 h-4 text-sky-500" />
              <span>{isAr ? 'حل أزمة الصرف والشمينتي' : 'Volant Cashless & Solution à la Monnaie'}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isAr ? 'تحويل بقية الصرف نقداً إلى رصيد رقمي فوري' : 'La Fin du Dilemme de Monnaie en Algérie'}
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? 'عند دفع ثمن الرحلة نقداً وعدم توفر الصرف لدى السائق (10، 20، 50، 100 دج)، يتم تحويل المبلغ المتبقي بضغطة زر واحدة إلى المحفظة الرقمية للزبون لاستخدامه في الرحلات القادمة.'
                : 'La pénurie chronique de petite monnaie métallique est éliminée. Le reliquat non rendu en espèces est instantanément crédité sur le portefeuille numérique du passager par simple confirmation QR.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs font-medium text-slate-700 dark:text-slate-200">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                <span>{isAr ? 'صفر توتر بين السائق والزبون حول الصرف' : 'Zéro conflit chauffeur-passager'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                <span>{isAr ? 'شحن فوري بالبطاقة الذهبية وبريدي موب' : 'Recharge CIB & BaridiMob sans intermédiaire'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                <span>{isAr ? 'تحويل رصيد العائلة والرحلات المسبقة' : 'Partage familial et billets sponsorisés'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                <span>{isAr ? 'سحب فوري للسائق نحو حسابه البريدي' : 'Reversement automatique sur CCP artisan'}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigateTab('ledger')}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
              >
                <span>{isAr ? 'فحص السجل المالي' : 'Inspecter le Grand Livre Financier'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="md:col-span-5 bg-gradient-to-br from-sky-500/10 to-blue-500/10 rounded-2xl p-6 border border-sky-500/20 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-500">
              <Coins className="w-8 h-8" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 dark:text-white">+150.00 DA</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Reliquat converti en solde numérique instantané
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-950/60 border text-[11px] text-left font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Course:</span>
                <span className="font-bold">850 DA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Espèces:</span>
                <span className="font-bold">1 000 DA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Portefeuille:</span>
                <span className="font-bold text-sky-500">Crédité en 400ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
