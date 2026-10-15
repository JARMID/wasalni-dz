import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Scale, 
  Camera, 
  ShieldCheck, 
  CloudSun, 
  Zap,
  Cpu
} from 'lucide-react';
import { queryAiCopilot } from '../utils/publicApis';
import type { AiCopilotMessage } from '../utils/publicApis';
import { soundEngine } from '../utils/audio';
import type { AppLang } from '../utils/i18n';

interface AiCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: AppLang;
}

export const AiCopilotModal: React.FC<AiCopilotModalProps> = ({
  isOpen,
  onClose,
  lang = 'fr',
}) => {
  const [messages, setMessages] = useState<AiCopilotMessage[]>([
    {
      role: 'assistant',
      content: lang === 'ar'
        ? 'مرحباً بك. أنا المساعد القانوني والتقني لمنصة WASSLANI. يمكنك سؤالي عن المراسيم التنفيذية، تسعيرة سيارات الأجرة، كاميرات المراقبة، أو تدقيق أمان البيانات.'
        : 'Bienvenue. Je suis le Copilote Réglementaire et Sécurité de WASSLANI. Posez-moi vos questions sur le Décret 12-230, les tarifs réglementés, la preuve vidéo Loi 25-11, ou la météo routière.',
      provider: 'Groq LPU • Qwen 2.5 Coder 27B',
      latencyMs: 120,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    soundEngine.playClick();
    const userMsg: AiCopilotMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await queryAiCopilot(text, lang as 'fr' | 'ar' | 'en');
      soundEngine.playSuccessChime();
      setMessages(prev => [...prev, response]);
    } catch (_) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Erreur temporaire de connexion au routeur. Le moteur de secours reste opérationnel.',
          provider: 'Secours Local',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    {
      icon: Scale,
      label: lang === 'ar' ? 'تعريفة المرسوم 12-230' : 'Tarifs Décret 12-230',
      prompt: lang === 'ar' 
        ? 'ما هي تعريفة الانطلاق وسعر الكيلومتر المحددة في المرسوم 12-230؟'
        : 'Quels sont les tarifs officiels de prise en charge et au kilomètre fixés par le Décret 12-230 ?',
    },
    {
      icon: Camera,
      label: lang === 'ar' ? 'حجية فيديو القانون 25-11' : 'Preuve Vidéo Loi 25-11',
      prompt: lang === 'ar'
        ? 'كيف تضمن المنصة حجية تسجيلات Dashcam طبقا للقانون 25-11؟'
        : 'Comment la plateforme garantit-elle la valeur probante des vidéos dashcam selon la Loi 25-11 ?',
    },
    {
      icon: ShieldCheck,
      label: lang === 'ar' ? 'تدقيق k-Anonymity HIBP' : 'Audit PIN HIBP (Loi 18-07)',
      prompt: lang === 'ar'
        ? 'كيف يحمي تدقيق HIBP k-Anonymity رموز PIN دون إرسالها؟'
        : 'Comment l\'audit k-Anonymity HIBP protège-t-il les codes PIN passagers selon la Loi 18-07 ?',
    },
    {
      icon: CloudSun,
      label: lang === 'ar' ? 'أمان الطريق والمطر' : 'Adhérence & Pluie (Météo)',
      prompt: lang === 'ar'
        ? 'ما هي مسافة الأمان الإلزامية عند هطول الأمطار على ساحل الجزائر؟'
        : 'Quel est l\'impact de la pluie côtière à Alger sur les distances de freinage des taxis ?',
    },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        
        {/* Header with Router Badges */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base text-white">
                  {lang === 'ar' ? 'المساعد الذكي للرقابة والمطابقة' : 'Copilote IA Réglementaire & Sécurité'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  EN LIGNE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {lang === 'ar' ? 'موجّه النماذج المتعددة: Groq LPU • NVIDIA NIM • Cloudflare AI' : 'Routeur Unifié : Groq LPU • NVIDIA NIM • Cloudflare AI'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry Hardware Banner */}
        <div className="px-4 py-2 bg-black/40 border-b border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-300 overflow-x-auto">
          <div className="flex items-center space-x-2">
            <Cpu className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Moteur Principal : <strong className="text-amber-300">Qwen 2.5 Coder 27B (Groq LPU)</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Débit : <strong className="text-blue-400">~800 t/s</strong> (&lt;250ms)</span>
          </div>
          <div className="text-slate-400 hidden sm:block">
            0 Clé Requise (Quota Libre)
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 min-h-[280px]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-amber-500 text-slate-950 font-semibold rounded-br-none shadow-lg'
                    : 'bg-slate-800/90 text-slate-100 border border-white/10 rounded-bl-none shadow-md'
                }`}
              >
                {m.content}
              </div>

              {m.provider && (
                <div className="mt-1 flex items-center space-x-2 text-[9px] font-mono text-slate-400 px-1">
                  <span>{m.provider}</span>
                  {m.latencyMs && (
                    <>
                      <span>•</span>
                      <span className="text-blue-400">{m.latencyMs}ms</span>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-300 p-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Génération de la réponse juridique et opérationnelle...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-3 bg-slate-950/40 border-t border-white/5 flex gap-2 overflow-x-auto">
          {quickPrompts.map((qp, qIdx) => {
            const Icon = qp.icon;
            return (
              <button
                key={qIdx}
                onClick={() => handleSend(qp.prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-slate-300 hover:text-white flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Icon className="w-3.5 h-3.5 text-amber-400" />
                <span>{qp.label}</span>
              </button>
            );
          })}
        </div>

        {/* Prompt Input Bar */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-slate-950/80 flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={
              lang === 'ar'
                ? 'اطرح سؤالاً حول التسعيرة، القوانين، الكاميرات...'
                : 'Posez une question sur le Décret 12-230, Loi 25-11, tarifs...'
            }
            className="flex-1 bg-slate-900 border border-white/10 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center space-x-1.5 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-40 cursor-pointer"
          >
            <span>{lang === 'ar' ? 'إرسال' : 'Envoyer'}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
