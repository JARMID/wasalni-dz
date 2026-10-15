import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Wallet, ArrowRight, CheckCircle2, ShieldCheck, X, Banknote } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import type { AppLang } from '../utils/i18n';
import { getTranslation } from '../utils/i18n';

interface SpareChangeModalProps {
  fareTotalDzd: number;
  driverBalanceDzd: number;
  riderCurrentBalanceDzd: number;
  isOpen: boolean;
  onClose: () => void;
  onCreditSpareChange: (changeAmount: number, tenderedAmount: number) => void;
  lang?: AppLang;
}

export const SpareChangeModal: React.FC<SpareChangeModalProps> = ({
  fareTotalDzd,
  driverBalanceDzd,
  riderCurrentBalanceDzd,
  isOpen,
  onClose,
  onCreditSpareChange,
  lang = 'fr',
}) => {
  if (!isOpen) return null;

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);
  const defaultTendered = fareTotalDzd > 500 ? 1000 : 500;
  const [tenderedAmount, setTenderedAmount] = useState<number>(defaultTendered);
  const [isProcessing, setIsProcessing] = useState(false);

  const changeDue = Math.max(0, tenderedAmount - fareTotalDzd);
  const isCapped = changeDue > 200;
  const isDriverBalanceSufficient = driverBalanceDzd >= changeDue;

  const handleConfirm = () => {
    if (changeDue <= 0 || isCapped || !isDriverBalanceSufficient) return;

    soundEngine.playClick();
    setIsProcessing(true);

    soundEngine.playCashRegisterDing();

    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#2563eb', '#38bdf8'],
    });

    setTimeout(() => {
      onCreditSpareChange(changeDue, tenderedAmount);
      setIsProcessing(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel max-w-md w-full p-6 rounded-3xl shadow-2xl relative border border-slate-200 dark:border-white/10 animate-in fade-in zoom-in-95 duration-200 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white">
        
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600 rounded-t-3xl"></div>

        {/* Close Button */}
        <button
          onClick={() => { soundEngine.playClick(); onClose(); }}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Flywheel Concept */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-500 dark:text-amber-300">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">{t('modalTitle')}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('modalSubtitle')}</p>
          </div>
        </div>

        {/* Calculation Box */}
        <div className="bg-slate-50 dark:bg-slate-950/90 p-4 rounded-2xl border border-slate-200 dark:border-white/10 mb-5 space-y-3 shadow-inner">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 dark:text-slate-400">{t('modalFareLabel')}</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-base">{fareTotalDzd.toFixed(2)} DZD</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <Banknote className="w-4 h-4 text-blue-500" />
              <span>{t('modalTenderedLabel')}</span>
            </span>
            <div className="flex items-center space-x-1.5">
              {[500, 1000, 2000].map(val => (
                <button
                  key={val}
                  onClick={() => { soundEngine.playClick(); setTenderedAmount(val); }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                    tenderedAmount === val
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                      : 'bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-white/10'
                  }`}
                >
                  {val} DA
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-between items-center">
            <span className="text-amber-600 dark:text-amber-300 font-bold text-sm">{t('modalChangeDue')}</span>
            <span className="font-mono font-black text-2xl text-blue-600 dark:text-blue-400">+{changeDue.toFixed(2)} DZD</span>
          </div>
        </div>

        {/* WASSLANI Wallet Stored-Value Conversion */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 mb-5 text-xs text-slate-700 dark:text-slate-300 space-y-2">
          <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-300 font-bold">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>Crédit Instantané Portefeuille WASSLANI</span>
          </div>
          <p className="leading-relaxed">
            {t('modalExplanation')}
          </p>
          <div className="pt-2 flex items-center justify-between font-mono text-[11px] text-slate-600 dark:text-slate-300 border-t border-blue-500/20">
            <span>Solde Passager: {riderCurrentBalanceDzd.toFixed(2)} DA</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-blue-600 dark:text-blue-300 font-bold">{(riderCurrentBalanceDzd + changeDue).toFixed(2)} DA</span>
          </div>
        </div>

        {/* Cap & Balance Validations */}
        {isCapped && (
          <p className="text-rose-400 text-xs font-semibold mb-3">
            Plafond de sécurité: Le crédit de monnaie est limité à 200.00 DZD par course.
          </p>
        )}

        {!isDriverBalanceSufficient && (
          <p className="text-rose-400 text-xs font-semibold mb-3">
            Solde chauffeur insuffisant: Le solde opérationnel doit être supérieur à {changeDue} DZD.
          </p>
        )}

        {/* Action Button */}
        <button
          onClick={handleConfirm}
          disabled={changeDue <= 0 || isCapped || !isDriverBalanceSufficient || isProcessing}
          className="w-full min-h-[56px] rounded-2xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-black text-base transition-all flex items-center justify-center space-x-2 shadow-xl shadow-amber-400/25 cursor-pointer"
        >
          {isProcessing ? (
            <span>Validation comptable en partie double...</span>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              <span>{t('modalConfirmBtn')} {changeDue.toFixed(2)} DZD</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
};
