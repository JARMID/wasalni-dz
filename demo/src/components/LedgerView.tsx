import React, { useState } from 'react';
import { 
  Building2, 
  Download, 
  CheckCircle2,
  ShieldCheck,
  Receipt
} from 'lucide-react';
import type { WalletBalances, LedgerEntry } from '../types';
import { soundEngine } from '../utils/audio';
import type { AppLang } from '../utils/i18n';
import { getTranslation } from '../utils/i18n';

interface LedgerViewProps {
  wallets: WalletBalances;
  ledgerEntries: LedgerEntry[];
  lang?: AppLang;
}

export const LedgerView: React.FC<LedgerViewProps> = ({
  wallets,
  ledgerEntries,
  lang = 'fr',
}) => {
  const [downloaded, setDownloaded] = useState(false);
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  // Verification of double-entry equation: Assets = Liabilities + Revenue
  const totalAssets = wallets.cashInTransit_1010 + wallets.digitalEscrow_1020;
  const totalLiabilities = wallets.riderTrustDesk_2010 + wallets.driverOperational_2020;
  const totalRevenue = wallets.platformRevenue_4010;
  const isBalanced = Math.abs(totalAssets - (totalLiabilities + totalRevenue)) < 0.01;

  const exportCSV = () => {
    soundEngine.playClick();
    const headers = ['ID', 'Horodatage', 'Type_Ecriture', 'Compte_Debit', 'Compte_Credit', 'Montant_DZD', 'Libelle'];
    const rows = ledgerEntries.map(e => [
      e.id,
      e.timestamp,
      e.entryType,
      `"${e.debitAccount}"`,
      `"${e.creditAccount}"`,
      e.amountDzd.toFixed(2),
      `"${e.description.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `journal_comptable_wasslani_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    soundEngine.playSuccessChime();
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-6 space-y-6 max-w-5xl mx-auto border transition-colors">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center space-x-2.5">
            <Building2 className="w-5 h-5 text-amber-500" />
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
              {t('ledgerTitle')}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('ledgerSubtitle')}
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-1.5 text-xs font-mono px-3 py-1.5 rounded-xl border border-blue-500/30 bg-blue-600/10 text-blue-600 dark:text-blue-300 font-bold">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>{isBalanced ? t('ledgerBalanced') : t('ledgerUnbalanced')}</span>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shadow-sm cursor-pointer"
          >
            {downloaded ? <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> : <Download className="w-3.5 h-3.5 text-amber-500" />}
            <span>{downloaded ? 'Exporté' : t('ledgerExportCsv')}</span>
          </button>
        </div>
      </div>

      {/* Account Balance Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        
        {/* Account 1010 */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 space-y-1">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block font-mono">
            Cpt 1010 : Espèces Chauffeurs
          </span>
          <div className="text-base font-black font-mono text-slate-900 dark:text-white">
            {wallets.cashInTransit_1010.toFixed(2)} DA
          </div>
          <p className="text-[9px] text-slate-400 font-mono">Liquidités en circulation</p>
        </div>

        {/* Account 1020 */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 space-y-1">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block font-mono">
            Cpt 1020 : Escrow Chargily
          </span>
          <div className="text-base font-black font-mono text-sky-500">
            {wallets.digitalEscrow_1020.toFixed(2)} DA
          </div>
          <p className="text-[9px] text-slate-400 font-mono">Compensation CIB / Edahabia</p>
        </div>

        {/* Account 2010 (TrustDesk Rider) */}
        <div className="p-4 rounded-2xl border border-blue-500/40 bg-blue-600/10 space-y-1">
          <span className="text-[10px] text-blue-600 dark:text-blue-300 font-bold uppercase tracking-wider block font-mono">
            Cpt 2010 : Passager TrustDesk
          </span>
          <div className="text-base font-black font-mono text-blue-600 dark:text-blue-300">
            {wallets.riderTrustDesk_2010.toFixed(2)} DA
          </div>
          <p className="text-[9px] text-blue-600/80 dark:text-blue-400/80 font-mono">Monnaie créditée & dépôts</p>
        </div>

        {/* Account 2020 */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 space-y-1">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block font-mono">
            Cpt 2020 : Solde Chauffeur
          </span>
          <div className="text-base font-black font-mono text-amber-600 dark:text-amber-300">
            {wallets.driverOperational_2020.toFixed(2)} DA
          </div>
          <p className="text-[9px] text-slate-400 font-mono">Compte opérationnel digital</p>
        </div>

        {/* Account 4010 */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 space-y-1 col-span-2 md:col-span-1">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block font-mono">
            Cpt 4010 : Revenus Plateforme
          </span>
          <div className="text-base font-black font-mono text-amber-500">
            {wallets.platformRevenue_4010.toFixed(2)} DA
          </div>
          <p className="text-[9px] text-slate-400 font-mono">Frais d'approche réglementés</p>
        </div>

      </div>

      {/* Immutable Ledger Journal */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
            <Receipt className="w-4 h-4 text-amber-500" />
            <span>Journal Général des Écritures Comptables (Immuable)</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">{ledgerEntries.length} écritures validées</span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-50 dark:bg-slate-950/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/10 text-[10px] uppercase font-bold">
                <tr>
                  <th className="py-2.5 px-3">Date / ID</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Débit (-)</th>
                  <th className="py-2.5 px-3">Crédit (+)</th>
                  <th className="py-2.5 px-3 text-right">Montant (DZD)</th>
                  <th className="py-2.5 px-3">Libellé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-[11px]">
                {ledgerEntries.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-100/60 dark:hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 dark:text-slate-400">
                      <div>{e.timestamp.slice(0, 10)}</div>
                      <div className="text-[9px] text-slate-400">{e.id}</div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        e.entryType === 'spare_change_credit'
                          ? 'bg-blue-600/20 text-blue-600 dark:text-blue-300'
                          : e.entryType === 'commission_debit'
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300'
                          : e.entryType === 'sponsored_cib_prepayment'
                          ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300'
                          : e.entryType === 'recurring_subscription_escrow'
                          ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300'
                          : 'bg-sky-500/20 text-sky-600 dark:text-sky-300'
                      }`}>
                        {e.entryType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-rose-500 dark:text-rose-400 font-semibold">{e.debitAccount}</td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-blue-600 dark:text-blue-400 font-semibold">{e.creditAccount}</td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-right font-black text-slate-900 dark:text-white">
                      {e.amountDzd.toFixed(2)} DA
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 max-w-xs truncate" title={e.description}>
                      {e.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
