import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Bell, 
  Navigation, 
  Share2
} from 'lucide-react';
import type { AppLang } from '../utils/i18n';
import { soundEngine } from '../utils/audio';

interface FamilyTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: AppLang;
}

export const FamilyTrackingModal: React.FC<FamilyTrackingModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  if (!isOpen) return null;

  const isAr = lang === 'ar';

  const [tripStage, setTripStage] = useState<'pickup' | 'enroute' | 'arrived'>('enroute');
  const [smsNotificationActive, setSmsNotificationActive] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const stageData = {
    pickup: {
      statusTextFr: 'Chauffeur arrivé au point de prise en charge',
      statusTextAr: 'وصل السائق إلى نقطة الركوب المحددة',
      progressPercent: 15,
      remainingKm: 6.8,
      remainingMinutes: 14,
      currentRoad: 'Place de Kouba Calvaire',
      speedKmH: 0,
    },
    enroute: {
      statusTextFr: 'Course en cours vers la destination scolaire',
      statusTextAr: 'الرحلة جارية نحو الوجهة المدرسية المحددة',
      progressPercent: 72,
      remainingKm: 1.8,
      remainingMinutes: 4,
      currentRoad: 'Rocade Nord • Trémie Tafourah',
      speedKmH: 52,
    },
    arrived: {
      statusTextFr: 'Arrivée confirmée • Élève déposé en toute sécurité',
      statusTextAr: 'تأكيد الوصول • تم إنزال التلميذ بأمان تام',
      progressPercent: 100,
      remainingKm: 0,
      remainingMinutes: 0,
      currentRoad: 'Entrée Principale Établissement',
      speedKmH: 0,
    },
  }[tripStage];

  const handleShareLink = () => {
    soundEngine.playSelection();
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl text-left space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Header */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {isAr ? 'متابعة مسار الرحلة للأولياء والعائلات' : 'Suivi en Direct • Familles & Scolaires'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                TRK-7842
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr ? 'مسار مشفر ومحمي وفق معايير القانون 18-07 لحماية المعطيات' : 'Partage sécurisé de trajet en temps réel • Wilaya d\'Alger'}
            </p>
          </div>
        </div>

        {/* Stage Simulator Selector */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5 text-xs">
          {[
            { id: 'pickup', labelFr: '1. Prise en charge', labelAr: '1. الركوب' },
            { id: 'enroute', labelFr: '2. En route (Rocade)', labelAr: '2. في الطريق' },
            { id: 'arrived', labelFr: '3. Arrivé à bon port', labelAr: '3. الوصول' },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => {
                soundEngine.playSelection();
                setTripStage(s.id as 'pickup' | 'enroute' | 'arrived');
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer text-center ${
                tripStage === s.id
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isAr ? s.labelAr : s.labelFr}
            </button>
          ))}
        </div>

        {/* Live Trip Telemetry Card */}
        <div className="p-5 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-4">
          
          {/* Status and Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-blue-400 font-bold flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>{isAr ? stageData.statusTextAr : stageData.statusTextFr}</span>
              </span>
              <span className="font-mono text-slate-400 font-bold">{stageData.progressPercent}%</span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-amber-400 transition-all duration-500 rounded-full"
                style={{ width: `${stageData.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Real-Time Metrics Strip */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase">Distance Restante</div>
              <div className="text-base font-black text-amber-400">{stageData.remainingKm} KM</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase">Temps Estimé</div>
              <div className="text-base font-black text-blue-400">{stageData.remainingMinutes} MIN</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase">Vitesse Réelle</div>
              <div className="text-base font-black text-slate-200">{stageData.speedKmH} KM/H</div>
            </div>
          </div>

          {/* Current Location Road */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center space-x-2 text-xs">
            <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-slate-400">Position actuelle :</span>
            <span className="font-bold text-white font-mono">{stageData.currentRoad}</span>
          </div>

        </div>

        {/* Driver and Safety PIN Verification */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold font-mono">
                MK
              </div>
              <div>
                <div className="font-black text-slate-900 dark:text-white">Hadj Mourad Khelifi</div>
                <div className="text-[11px] text-slate-500 font-mono">Peugeot 301 • LP-88392-16</div>
              </div>
            </div>

            {/* Safety Boarding PIN */}
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 text-center">
              <div className="text-[9px] font-mono text-blue-600 dark:text-blue-400 uppercase font-bold">Code Sécurité</div>
              <div className="text-sm font-black font-mono text-blue-700 dark:text-blue-300">7842</div>
            </div>
          </div>

          {/* Automatic SMS Notification Checkbox */}
          <div className="pt-2 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={smsNotificationActive}
                onChange={(e) => setSmsNotificationActive(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {isAr ? 'تنبيه الرسائل القصيرة SMS للأولياء عند النزول' : 'Alerte SMS automatique aux parents dès la descente'}
              </span>
            </label>
            <Bell className="w-4 h-4 text-amber-500" />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={handleShareLink}
            className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>
              {copiedLink 
                ? (isAr ? 'تم نسخ الرابط المشفر بنجاح ✓' : 'Lien de suivi copié ✓') 
                : (isAr ? 'مشاركة رابط التتبع مع العائلة' : 'Partager le Lien Sécurisé')}
            </span>
          </button>

          <button
            onClick={onClose}
            className="py-3 px-5 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            {isAr ? 'إغلاق' : 'Fermer'}
          </button>
        </div>

      </div>
    </div>
  );
};
