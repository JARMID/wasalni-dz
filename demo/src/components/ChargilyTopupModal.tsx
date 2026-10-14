import React, { useState } from 'react';
import { CreditCard, ShieldCheck, X, CheckCircle2, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';

interface ChargilyTopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amountDzd: number) => void;
  targetAccountName: string;
}

export const ChargilyTopupModal: React.FC<ChargilyTopupModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetAccountName,
}) => {
  const [amount, setAmount] = useState<number>(2000);
  const [step, setStep] = useState<'card' | 'otp' | 'success'>('card');
  const [cardNumber, setCardNumber] = useState('6038 9200 4812 3901');
  const [cardHolder, setCardHolder] = useState('MOHAMED BENALI');
  const [expiry, setExpiry] = useState('08/28');
  const [otpCode, setOtpCode] = useState('841920');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleProceedToOtp = () => {
    soundEngine.playClick();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('otp');
    }, 600);
  };

  const handleVerifyOtp = () => {
    soundEngine.playClick();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      soundEngine.playSuccessChime();

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#10b981', '#f59e0b'],
      });

      setTimeout(() => {
        onSuccess(amount);
        setStep('card');
        onClose();
      }, 1500);
    }, 800);
  };

  const handleClose = () => {
    soundEngine.playClick();
    setStep('card');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2500] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel max-w-md w-full p-6 rounded-3xl shadow-2xl relative border border-white/10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-400"></div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">Passerelle Chargily Pay V2</h3>
            <p className="text-[11px] text-slate-400">Paiement CIB & Edahabia sécurisé SATIM 3DS</p>
          </div>
        </div>

        {/* STEP 1: CARD DETAILS */}
        {step === 'card' && (
          <div className="space-y-4">
            
            {/* Amount Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Montant de recharge ({targetAccountName})
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[1000, 2000, 5000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => { soundEngine.playClick(); setAmount(val); }}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                      amount === val
                        ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/20'
                        : 'bg-slate-950 border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    {val} DZD
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Card Surface */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-2xl border border-white/10 space-y-3 shadow-inner">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-sky-400 font-mono tracking-widest">EDAHABIA / CIB</span>
                <span className="text-[10px] text-slate-400 font-mono">SATIM 3D-SECURE</span>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono">Numéro de Carte</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 font-mono text-sm text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-mono">Titulaire</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-mono">Expiration</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleProceedToOtp}
              disabled={isProcessing}
              className="w-full min-h-[52px] rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-slate-950 font-black text-sm tracking-wider transition-all shadow-xl shadow-sky-500/25 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isProcessing ? 'Connexion SATIM...' : `RÉGLER ${amount.toFixed(2)} DZD`}</span>
            </button>
          </div>
        )}

        {/* STEP 2: 3D-SECURE OTP */}
        {step === 'otp' && (
          <div className="space-y-4">
            <div className="bg-sky-500/10 border border-sky-400/30 p-3 rounded-2xl text-xs text-slate-300 space-y-1">
              <div className="font-bold text-sky-400 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Authentification SATIM 3D-Secure</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Un code de vérification SMS à 6 chiffres a été transmis à votre mobile (+213 550 *** **12).
              </p>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 uppercase font-mono block mb-1">Code SMS Reçu</label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full text-center bg-slate-950 border border-white/15 rounded-2xl py-2.5 font-mono text-xl tracking-widest text-sky-400 focus:outline-none focus:border-sky-400"
              />
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={isProcessing || otpCode.length < 6}
              className="w-full min-h-[52px] rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-sm tracking-wider transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              <span>{isProcessing ? 'Validation SATIM...' : 'CONFIRMER LE RECHARGEMENT'}</span>
            </button>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 'success' && (
          <div className="py-6 text-center space-y-3 animate-in fade-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="font-black text-white text-base">Rechargement Validé</h4>
            <p className="text-xs text-slate-300 font-mono">
              +{amount.toFixed(2)} DZD crédités instantanément sur le compte opérationnel.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
