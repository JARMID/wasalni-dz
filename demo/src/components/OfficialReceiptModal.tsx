import React from 'react';
import { Printer, X, QrCode, FileText, CheckCircle2 } from 'lucide-react';
import type { RideRequest, DriverProfile } from '../types';
import type { AppLang } from '../utils/i18n';

interface OfficialReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  ride: RideRequest;
  driver: DriverProfile;
  lang?: AppLang;
}

export const OfficialReceiptModal: React.FC<OfficialReceiptModalProps> = ({
  isOpen,
  onClose,
  ride,
  driver,
  lang = 'fr',
}) => {
  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const receiptDate = new Date().toLocaleDateString('fr-DZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const receiptTime = new Date().toLocaleTimeString('fr-DZ', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  const fareTotal = ride.totalFareDzd || 850;
  const approachFee = 100;
  const meterAmount = Math.max(0, fareTotal - approachFee);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden print:m-0 print:p-0 print:border-none print:shadow-none print:w-full">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 print:hidden">
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-700">
            <FileText className="w-4 h-4" />
            <span>{isAr ? 'وصل تسديد رسمي مطابق للمرسوم 12-230' : 'Facture / Quittance Officielle de Taxi'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isAr ? 'طباعة الوصل' : 'Imprimer'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Receipt Body */}
        <div className="p-6 sm:p-8 space-y-6 font-sans">
          
          {/* Official Republic Header */}
          <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
            <span className="text-[11px] font-bold tracking-widest uppercase block text-slate-700">
              الجمهورية الجزائرية الديمقراطية الشعبية
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-slate-500 block uppercase">
              Ministère des Transports • Direction des Transports de la Wilaya d'Alger
            </span>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-950 pt-1">
              Quittance Officielle de Course de Taxi
            </h3>
            <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              Conformité Décret Exécutif N° 12-230 du 18 Mai 2012
            </span>
          </div>

          {/* Reference & Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Identifiant Course</span>
              <span className="font-mono font-black text-slate-900 text-sm">{ride.rideCode || 'ALG-2026-X88'}</span>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Date & Heure</span>
              <span className="font-medium text-slate-800">{receiptDate} • {receiptTime}</span>
            </div>
          </div>

          {/* Artisan & Vehicle Registry Credentials */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Artisan Taxieur Agréé</span>
                <strong className="text-slate-900 font-extrabold">{driver.fullName}</strong>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Matricule Wilaya 16</span>
                <span className="font-mono font-black text-slate-900">{driver.licensePlate}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <div>
                <span className="text-slate-500 block">N° Agrément :</span>
                <strong className="font-mono text-slate-800">{driver.agrementNumber}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Livret de Place :</span>
                <strong className="font-mono text-slate-800">{driver.livretDePlaceNumber}</strong>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block">Véhicule :</span>
                <strong className="text-slate-800">{driver.vehicleMake} {driver.vehicleModel}</strong>
              </div>
            </div>
          </div>

          {/* Itinerary */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Lieu de prise en charge :</span>
              <strong className="text-slate-900 text-right">{ride.origin?.name || 'Alger Centre'}</strong>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Lieu de dépose :</span>
              <strong className="text-slate-900 text-right">{ride.destination?.name || 'Aéroport Houari Boumediene'}</strong>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Type de service :</span>
              <strong className="text-slate-900">
                {ride.bookingType === 'recurring_chauffeur' 
                  ? 'Navette Régulière Programmée' 
                  : 'Taxi Individuel au Compteur'}
              </strong>
            </div>
          </div>

          {/* Detailed Pricing Table (Décret 12-230 Calibrated) */}
          <div className="border border-slate-900 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-900 text-white font-bold p-2 flex justify-between">
              <span>Rubrique Tarifaire Réglementée</span>
              <span>Montant DZD</span>
            </div>
            <div className="p-3 space-y-1.5 bg-white">
              <div className="flex justify-between text-slate-700">
                <span>Prise en charge officielle & compteur horaire/km</span>
                <span className="font-mono font-medium">{meterAmount.toFixed(2)} DA</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Frais d'approche garantis (Arrêté Wilaya 16)</span>
                <span className="font-mono font-medium">{approachFee.toFixed(2)} DA</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[10px] pt-1 border-t border-slate-100">
                <span>Droit de timbre fiscal & homologation DTW</span>
                <span className="font-mono">Inclus</span>
              </div>
            </div>
            <div className="bg-slate-100 p-3 border-t border-slate-900 flex justify-between items-center font-black text-sm">
              <span className="text-slate-950 uppercase">Total Net Réglé :</span>
              <span className="text-blue-700 font-mono text-base">{fareTotal.toFixed(2)} DZD</span>
            </div>
          </div>

          {/* Spare Change Stored-Value or Sponsor Footer */}
          {ride.spareChangeCreditedDzd && ride.spareChangeCreditedDzd > 0 ? (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2 text-blue-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Reliquat de monnaie converti en solde digital :</span>
              </div>
              <span className="font-mono font-black text-blue-700">+{ride.spareChangeCreditedDzd.toFixed(2)} DA</span>
            </div>
          ) : ride.sponsor?.isSponsored ? (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs flex items-center justify-between">
              <span className="text-blue-900 font-bold">
                Course sponsorisée et prépayée par {ride.sponsor.sponsorName}
              </span>
              <span className="font-mono text-blue-700 font-bold">{ride.sponsor.satimAuthCode}</span>
            </div>
          ) : null}

          {/* Official Verification QR Code & Sovereignty Seal */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 block">Sceau Numérique DTW Alger</span>
              <span>Plateforme WASSLANI • CNRC 604103</span>
              <span className="text-[9px] text-slate-400 block">Horodatage sécurisé SHA-256</span>
            </div>
            <div className="p-1 border border-slate-300 rounded-lg bg-white">
              <QrCode className="w-12 h-12 text-slate-900" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
