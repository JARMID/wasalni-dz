import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Volume2, CheckCheck } from 'lucide-react';
import type { ChatMessage, DriverProfile, RideRequest } from '../types';
import { soundEngine } from '../utils/audio';
import type { AppLang } from '../utils/i18n';

interface RideChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: DriverProfile;
  currentRide: RideRequest | null;
  userRole?: 'rider' | 'driver';
  lang?: AppLang;
}

const CANNED_MESSAGES: { fr: string; ar: string }[] = [
  { fr: "Je vous attends devant l'entrée principale", ar: "راني نستنى قدام المدخل الرئيسي" },
  { fr: "Je suis au feu rouge, j'arrive dans 3 minutes", ar: "راني في إشارة المرور، 3 دقائق ونكون عندك" },
  { fr: "Je porte une veste bleue", ar: "راني لابس كوستيم أزرق" },
  { fr: "Pouvez-vous allumer la climatisation s'il vous plaît ?", ar: "من فضلك شعل الكليماتيزور" },
  { fr: "C'est bon, j'ai repéré votre véhicule", ar: "خلاص راني شفت الطوموبيل تاعك" },
];

export const RideChatModal: React.FC<RideChatModalProps> = ({
  isOpen,
  onClose,
  driver,
  currentRide,
  userRole = 'rider',
  lang = 'fr',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'system',
      textFr: `Canal de messagerie sécurisé ouvert pour la course ${currentRide?.rideCode || 'DZ-10482'}. Chiffrement de bout en bout conforme Loi 18-07.`,
      textAr: `تم فتح قناة المراسلة الآمنة للرحلة. تشفير كامل متوافق مع القانون 18-07.`,
      timestamp: '14:22',
    },
    {
      id: 'msg-2',
      sender: 'driver',
      textFr: "Salam Alikoum ! Je suis en route, j'arrive dans environ 4 minutes avec ma Peugeot 301 blanche.",
      textAr: "السلام عليكم! راني في الطريق، نوصل في حوالي 4 دقائق بسيارة بيجو 301 بيضاء.",
      timestamp: '14:23',
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const isAr = lang === 'ar';

  const handleSendMessage = (textFr: string, textAr?: string) => {
    if (!textFr.trim()) return;
    soundEngine.playClick();

    const timeStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: userRole,
      textFr: textFr.trim(),
      textAr: textAr || textFr.trim(),
      timestamp: timeStr,
    };

    setMessages(prev => [...prev, newMsg]);
    setInputVal('');

    // Simulate driver reply after 2.5 seconds if sent by rider
    if (userRole === 'rider') {
      setTimeout(() => {
        soundEngine.playDispatchPing();
        const autoReply: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'driver',
          textFr: "Bien reçu ! Je serre sur le côté dès que j'arrive.",
          textAr: "مفهوم! نحبس على اليمين غير نوصل.",
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, autoReply]);
      }, 2500);
    }
  };

  const handleSpeak = (text: string) => {
    soundEngine.speakDispatch(text, isAr ? 'ar' : 'fr');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col h-[600px] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={driver.photoUrl}
                alt={driver.fullName}
                className="w-10 h-10 rounded-xl object-contain bg-slate-950 border border-blue-500/30 p-0.5"
              />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {userRole === 'rider' ? driver.fullName : 'Passager WASSLANI'}
                </h3>
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold">
                  {driver.licensePlate}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Course {currentRide?.rideCode || 'DZ-10482'} • {driver.vehicleMake} {driver.vehicleModel}
              </p>
            </div>
          </div>

          <button
            onClick={() => { soundEngine.playClick(); onClose(); }}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Canned Quick-Reply Chips */}
        <div className="p-2.5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/30 overflow-x-auto no-scrollbar flex items-center gap-1.5 text-xs">
          {CANNED_MESSAGES.map((msg, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(msg.fr, msg.ar)}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-300 font-medium text-[11px] border border-blue-500/20 cursor-pointer transition-colors"
            >
              {isAr ? msg.ar : msg.fr}
            </button>
          ))}
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30 dark:bg-slate-950/20">
          {messages.map((m) => {
            if (m.sender === 'system') {
              return (
                <div key={m.id} className="p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-[11px] text-center text-slate-500 dark:text-slate-400 font-mono">
                  {isAr ? m.textAr : m.textFr}
                </div>
              );
            }

            const isMine = m.sender === userRole;

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`max-w-[82%] p-3 rounded-2xl text-xs relative group ${
                    isMine
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-md shadow-blue-500/20'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="leading-relaxed font-sans">{isAr ? m.textAr : m.textFr}</p>
                  
                  <div className="flex items-center justify-end space-x-1 mt-1 text-[9px] opacity-75">
                    <span>{m.timestamp}</span>
                    {isMine && <CheckCheck className="w-3 h-3 ml-0.5" />}
                    <button
                      type="button"
                      onClick={() => handleSpeak(isAr ? m.textAr : m.textFr)}
                      className="opacity-0 group-hover:opacity-100 hover:text-amber-300 transition-opacity ml-1.5 cursor-pointer"
                      title="Écouter"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputVal);
          }}
          className="p-3 border-t border-slate-200 dark:border-white/10 flex items-center gap-2 bg-white dark:bg-slate-900"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={isAr ? "اكتب رسالتك للسائق..." : "Envoyer un message au chauffeur..."}
            className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-all cursor-pointer shadow-md shadow-blue-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
