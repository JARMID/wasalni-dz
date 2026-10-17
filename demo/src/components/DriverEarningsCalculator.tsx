import React, { useState } from 'react';
import { 
  Calculator, 
  Coins, 
  Car, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  FileCheck2, 
  TrendingUp
} from 'lucide-react';
import type { AppLang } from '../utils/i18n';
import { soundEngine } from '../utils/audio';

interface DriverEarningsCalculatorProps {
  lang: AppLang;
  onOpenDriverModal: () => void;
}

export const DriverEarningsCalculator: React.FC<DriverEarningsCalculatorProps> = ({
  lang,
  onOpenDriverModal,
}) => {
  const isAr = lang === 'ar';

  const [ridesPerDay, setRidesPerDay] = useState<number>(14);
  const [avgFare, setAvgFare] = useState<number>(450);
  const [daysPerMonth, setDaysPerMonth] = useState<number>(24);
  const [commissionRate, setCommissionRate] = useState<number>(10);

  // Financial calculations
  const monthlyGross = ridesPerDay * avgFare * daysPerMonth;
  const foreignVtcCommission = Math.round(monthlyGross * 0.25);
  const foreignVtcNet = monthlyGross - foreignVtcCommission;

  const wasslaniCommission = Math.round(monthlyGross * (commissionRate / 100));
  const wasslaniNet = monthlyGross - wasslaniCommission;

  const monthlyGainAdvantage = wasslaniNet - foreignVtcNet;
  const dailyCcpPayout = Math.round(wasslaniNet / daysPerMonth);

  const applyPreset = (rides: number, fare: number, days: number) => {
    soundEngine.playSelection();
    setRidesPerDay(rides);
    setAvgFare(fare);
    setDaysPerMonth(days);
  };

  return (
    <div id="earnings" className="rounded-3xl p-6 sm:p-10 bg-slate-950 text-white border border-slate-800 shadow-2xl relative overflow-hidden space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 text-left">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Calculator className="w-3.5 h-3.5" />
            <span>{isAr ? 'حاسبة أرباح السائق الحرفي بالدينار' : 'Simulateur de Revenus Artisan Taxieur'}</span>
          </div>
          <h3 className="text-xl sm:text-3xl font-black text-white">
            {isAr ? 'كم ستربح شهرياً مع شبكة وصلني الرسمية ؟' : 'Calculez votre Gain Net avec WASSLANI'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            {isAr
              ? 'مقارنة شفافة ودقيقة بين عمولة وصلني المنصفة (8% إلى 12%) وعمولة التطبيقات الأجنبية غير المقننة (25%). أرباحك الصافية تحول يومياً إلى حسابك البريدي الجاري CCP.'
              : 'Comparez directement notre commission solidaire de 10% avec les 25% prélevés par les plateformes étrangères. Vos recettes sont versées chaque jour sur votre CCP.'}
          </p>
        </div>

        {/* Highlighted Monthly Advantage Badge */}
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-right shrink-0">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Gain Net Préservé</div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400">
            +{monthlyGainAdvantage.toLocaleString('fr-DZ')} <span className="text-xs text-white">DZD / mois</span>
          </div>
          <div className="text-[10px] text-amber-300 font-semibold">
            {isAr ? 'مبلغ إضافي في جيب السائق الحرفي' : 'Directement dans votre poche'}
          </div>
        </div>
      </div>

      {/* Preset Profiles */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-left">
        <span className="text-slate-400 font-bold mr-1">
          {isAr ? 'أمثلة نشاط جاهزة :' : 'Profils types d\'activité :'}
        </span>
        <button
          onClick={() => applyPreset(8, 420, 22)}
          className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
            ridesPerDay === 8
              ? 'bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-sm'
              : 'bg-slate-900 border-white/10 text-slate-300 hover:border-amber-400'
          }`}
        >
          {isAr ? 'نشاط جزئي (8 رحلات / يوم)' : 'Rythme Léger (8 courses / j)'}
        </button>

        <button
          onClick={() => applyPreset(14, 450, 24)}
          className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
            ridesPerDay === 14
              ? 'bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-sm'
              : 'bg-slate-900 border-white/10 text-slate-300 hover:border-amber-400'
          }`}
        >
          {isAr ? 'نشاط قياسي (14 رحلة / يوم)' : 'Standard Urbain (14 courses / j)'}
        </button>

        <button
          onClick={() => applyPreset(22, 500, 26)}
          className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
            ridesPerDay === 22
              ? 'bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-sm'
              : 'bg-slate-900 border-white/10 text-slate-300 hover:border-amber-400'
          }`}
        >
          {isAr ? 'فريق مزدوج (22 رحلة / يوم)' : 'Intensif / Double Équipe (22 courses / j)'}
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        
        {/* Slider 1: Courses par jour */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center space-x-1.5">
              <Car className="w-3.5 h-3.5 text-blue-400" />
              <span>{isAr ? 'عدد الرحلات اليومية :' : 'Courses par jour :'}</span>
            </span>
            <span className="text-lg font-black font-mono text-amber-400">
              {ridesPerDay}
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="28"
            step="1"
            value={ridesPerDay}
            onChange={(e) => setRidesPerDay(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>5 courses</span>
            <span>28 courses</span>
          </div>
        </div>

        {/* Slider 2: Tarif moyen par course */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center space-x-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'متوسط سعر الرحلة بالدينار :' : 'Tarif moyen par course :'}</span>
            </span>
            <span className="text-lg font-black font-mono text-amber-400">
              {avgFare} <span className="text-xs text-slate-400">DA</span>
            </span>
          </div>
          <input
            type="range"
            min="300"
            max="750"
            step="25"
            value={avgFare}
            onChange={(e) => setAvgFare(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>300 DA</span>
            <span>750 DA</span>
          </div>
        </div>

        {/* Slider 3: Jours travaillés par mois */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center space-x-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
              <span>{isAr ? 'أيام العمل شهرياً :' : 'Jours travaillés / mois :'}</span>
            </span>
            <span className="text-lg font-black font-mono text-amber-400">
              {daysPerMonth} <span className="text-xs text-slate-400">j</span>
            </span>
          </div>
          <input
            type="range"
            min="16"
            max="28"
            step="1"
            value={daysPerMonth}
            onChange={(e) => setDaysPerMonth(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>16 jours</span>
            <span>28 jours</span>
          </div>
        </div>

      </div>

      {/* Commission Rate Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-white/5 text-xs text-left">
        <span className="text-slate-300 font-bold">
          {isAr ? 'مستوى العمولة المطبق على الحرفي :' : 'Palier de commission WASSLANI :'}
        </span>
        <div className="flex gap-2">
          {[8, 10, 12].map(rate => (
            <button
              key={rate}
              onClick={() => {
                soundEngine.playSelection();
                setCommissionRate(rate);
              }}
              className={`px-3 py-1 rounded-lg font-mono font-bold border transition-colors cursor-pointer ${
                commissionRate === rate
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-800 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {rate}% {rate === 8 ? '(Fidélité)' : rate === 10 ? '(Standard)' : '(Occasionnel)'}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        
        {/* WASSLANI Official Network */}
        <div className="p-6 rounded-2xl bg-blue-950/40 border-2 border-blue-500/40 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-blue-400 uppercase tracking-wider">
            <span>Réseau Officiel WASSLANI</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-[10px]">Commission {commissionRate}%</span>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400">Revenu Net Mensuel Estimé :</div>
            <div className="text-3xl sm:text-4xl font-black font-mono text-blue-300">
              {wasslaniNet.toLocaleString('fr-DZ')} <span className="text-sm font-sans text-white">DZD</span>
            </div>
            <div className="text-[11px] text-blue-400 font-medium">
              Chiffre d'affaires brut : {monthlyGross.toLocaleString('fr-DZ')} DZD
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-white/10 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Versement quotidien garanti : ~{dailyCcpPayout.toLocaleString('fr-DZ')} DZD / jour</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Zéro risque de fourrière (Activité 100% légale avec Livret de Place)</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Restitution automatique de monnaie par BaridiMob sans litiges</span>
            </div>
          </div>
        </div>

        {/* Foreign Unregulated VTC */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4 opacity-85">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Applications VTC Étrangères</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-amber-400">Commission 25%</span>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400">Revenu Net Mensuel Restant :</div>
            <div className="text-3xl sm:text-4xl font-black font-mono text-slate-400 line-through">
              {foreignVtcNet.toLocaleString('fr-DZ')} <span className="text-sm font-sans text-slate-500">DZD</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Prélèvement plateforme étranger : -{foreignVtcCommission.toLocaleString('fr-DZ')} DZD
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-white/10 text-xs text-slate-400">
            <div className="flex items-center space-x-2 text-slate-400">
              <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0">!</span>
              <span>Perte mensuelle nette de {monthlyGainAdvantage.toLocaleString('fr-DZ')} DZD pour le chauffeur</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0">!</span>
              <span>Risque permanent de mise en fourrière (non agréé DTW)</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0">!</span>
              <span>Délais de virement variables et commissions non réinvesties en Algérie</span>
            </div>
          </div>
        </div>

      </div>

      {/* Call to Action Bar */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
        <div className="flex items-center space-x-2 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>
            {isAr 
              ? 'التسجيل مفتوح لكافة الحرفيين الحاملين لدفتر مكان بمديرية النقل لولاية الجزائر.' 
              : 'Affiliation réservée aux artisans titulaires d\'un Livret de Place valide (Wilaya d\'Alger).'}
          </span>
        </div>

        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenDriverModal();
          }}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <FileCheck2 className="w-4 h-4 text-slate-950" />
          <span>{isAr ? 'تقديم طلب الانضمام كشريك' : 'Déposer ma Candidature Artisan (Livret de Place)'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
