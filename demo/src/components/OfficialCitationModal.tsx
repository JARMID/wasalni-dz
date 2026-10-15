import React, { useRef } from 'react';
import { X, Printer, ShieldAlert, QrCode } from 'lucide-react';
import type { OfficialCitationPV } from '../types';
import { soundEngine } from '../utils/audio';

interface OfficialCitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  citation: OfficialCitationPV;
}

export const OfficialCitationModal: React.FC<OfficialCitationModalProps> = ({
  isOpen,
  onClose,
  citation,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    soundEngine.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Controls Header (Hidden during print) */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <h3 className="font-extrabold text-sm text-slate-800">
              Procès-Verbal de Constat d'Infraction Routière (DTW)
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer PV</span>
            </button>
            <button
              onClick={() => { soundEngine.playClick(); onClose(); }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official PV Document Body */}
        <div ref={printRef} className="p-6 overflow-y-auto space-y-4 font-serif text-slate-900 leading-tight print:p-0">
          
          {/* Official Republic Header */}
          <div className="text-center space-y-1 pb-3 border-b-2 border-slate-900">
            <h4 className="font-bold text-xs uppercase tracking-widest text-slate-800">
              الجمهورية الجزائرية الديمقراطية الشعبية
            </h4>
            <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-700">
              République Algérienne Démocratique et Populaire
            </h4>
            <div className="text-[10px] text-slate-600 font-sans mt-1">
              Ministère des Transports • Wilaya d'Alger<br />
              Direction des Transports de la Wilaya (DTW) • Brigade de Contrôle Routier
            </div>
            <div className="inline-block mt-2 px-3 py-1 bg-rose-50 border border-rose-300 rounded font-sans text-xs font-black text-rose-700 uppercase tracking-wide">
              Procès-Verbal de Constat N° {citation.pvNumber}
            </div>
          </div>

          {/* Legal Authority Statement */}
          <div className="text-[10px] text-justify font-sans text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
            Vu la Loi N° 01-13 du 07 Août 2001 portant organisation et sécurité de la circulation routière ;<br />
            Vu le Décret Exécutif N° 12-230 du 24 Mai 2012 fixant les conditions d'exploitation des services de taxi ;<br />
            Nous, Agent de contrôle assermenté de la DTW d'Alger, Matricule <strong>{citation.officerBadge}</strong>, avons constaté l'infraction suivante :
          </div>

          {/* Offender and Vehicle Credentials */}
          <div className="font-sans text-xs space-y-2 border border-slate-300 p-3 rounded-lg">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Chauffeur / Contrevenant :</span>
                <span className="font-bold text-slate-900">{citation.driverName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Plaque d'Immatriculation :</span>
                <span className="font-mono font-black text-slate-900">{citation.licensePlate}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Agrément DTW :</span>
                <span className="font-mono font-bold text-slate-800">{citation.agrementNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Véhicule Contrôlé :</span>
                <span className="font-bold text-slate-800">{citation.vehicleModel}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Lieu du Contrôle :</span>
                <span className="font-bold text-slate-800">{citation.location}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Date & Heure :</span>
                <span className="font-mono text-slate-800">{citation.date} à {citation.time}</span>
              </div>
            </div>
          </div>

          {/* Violation Details & Legal Article */}
          <div className="font-sans text-xs p-3 rounded-lg bg-rose-50 border border-rose-200 space-y-1.5">
            <div className="flex items-center justify-between text-rose-800 font-bold">
              <span>Nature de l'Infraction Relevée :</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-200 text-rose-900">
                {citation.legalArticle}
              </span>
            </div>
            <p className="text-xs text-rose-950 font-bold">
              {citation.infractionType}
            </p>
            <div className="pt-2 border-t border-rose-200 flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-rose-900">Montant de l'Amende Forfaitaire :</span>
              <span className="text-base font-black font-mono text-rose-700">
                {citation.fineAmountDzd.toFixed(2)} DZD
              </span>
            </div>
          </div>

          {/* Payment Terms & Algérie Poste BaridiMob Settlement */}
          <div className="font-sans text-[10px] border border-slate-300 p-3 rounded-lg space-y-2">
            <div className="font-bold text-slate-800 uppercase">
              Modalités de Télépaiement & Recouvrement (Loi de Finances) :
            </div>
            <p className="text-slate-600">
              L'amende doit être réglée sous 15 jours francs auprès de la Recette des Impôts ou instantanément par télépaiement BaridiMob.
            </p>
            <div className="flex items-center justify-between p-2 rounded bg-slate-100 font-mono text-[10px]">
              <div>
                <span className="text-slate-500 block text-[9px]">RIP Trésor Public (Algérie Poste) :</span>
                <span className="font-bold text-slate-900">{citation.ripCcpTresor}</span>
              </div>
              <div className="w-12 h-12 bg-white p-1 rounded border border-slate-300 flex items-center justify-center">
                <QrCode className="w-10 h-10 text-slate-900" />
              </div>
            </div>
          </div>

          {/* Official Signatures & Stamp */}
          <div className="pt-3 flex items-center justify-between font-sans text-[10px] text-slate-600 border-t border-slate-300">
            <div className="text-center">
              <span className="block font-bold">L'Agent Verbalisateur DTW</span>
              <span className="italic block mt-4">Matricule {citation.officerBadge}</span>
            </div>

            {/* Official Circular Stamp Simulation */}
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-blue-900/60 p-1 flex flex-col items-center justify-center text-center text-[7px] font-black text-blue-900 rotate-[-12deg] select-none">
              <span className="uppercase leading-none">Wilaya d'Alger</span>
              <span className="uppercase text-[6px] my-0.5">Direction des</span>
              <span className="uppercase leading-none font-bold">Transports</span>
              <span className="text-[6px] mt-0.5">★ CONTRÔLE ★</span>
            </div>

            <div className="text-center">
              <span className="block font-bold">Le Contrevenant</span>
              <span className="italic block mt-4">Pour notification</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
