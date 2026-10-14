import React, { useState } from 'react';
import { 
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  Download,
  CheckCircle2
} from 'lucide-react';
import type { WalletBalances, LedgerEntry } from '../types';
import { soundEngine } from '../utils/audio';

interface LedgerViewProps {
  wallets: WalletBalances;
  ledgerEntries: LedgerEntry[];
}

export const LedgerView: React.FC<LedgerViewProps> = ({
  wallets,
  ledgerEntries,
}) => {
  const [downloaded, setDownloaded] = useState(false);

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
    link.setAttribute('download', `journal_comptable_naql_dz_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    soundEngine.playSuccessChime();
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl p-6 space-y-6 max-w-5xl mx-auto border border-white/10">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2.5">
            <Building2 className="w-5 h-5 text-amber-400" />
            <h2 className="font-extrabold text-lg text-white">Grand Livre Comptable en Partie Double (Moteur TrustDesk)</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Comptes normalisés NUMERIC(12, 2) • Rails Chargily Pay & Portefeuille Monnaie Stored-Value
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-2 text-xs font-mono glass-pill px-3 py-1.5 rounded-xl border border-white/10 text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Équilibre Débit / Crédit: {isBalanced ? 'Parfait (Δ 0.00 DA)' : 'Déséquilibre'}</span>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-slate-200 transition-colors shadow-sm"
          >
            {downloaded ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5 text-amber-400" />}
            <span>{downloaded ? 'Exporté' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Account Balance Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        
        {/* Account 1010 */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">
            Cpt 1010: Espèces Chauffeurs
          </span>
          <div className="text-base font-black font-mono text-white">
            {wallets.cashInTransit_1010.toFixed(2)} DA
          </div>
          <p className="text-[9px] text-slate-400 font-mono">Liquidités physiques en circulation</p>
        </div>

        {/* Account 1020 */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">
            Cpt 1020: Escrow Chargily
          </span>
          <div className="text-base font-black font-mono text-sky-400">
            {wallets.digitalEscrow_1020.toFixed(2)} DA
          </div>
          <p className="text-[9px] text-slate-400 font-mono">Compensation CIB / Edahabia</p>
        </div>

        {/* Account 2010 (TrustDesk Rider) */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/5 space-y-1">
          <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block font-mono">
            Cpt 2010: Passager TrustDesk
          </span>
          <div className="text-base font-black font-mono text-emerald-300">
            {wallets.riderTrustDesk_2010.toFixed(2)} DA
          </div>
          <p className="text-[9px] text-emerald-400/80 font-mono">Monnaie créditée & dépôts</p>
        </div>

        {/* Account 2020 */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">
            Cpt 2020: Solde Chauffeur
          </span>
          <div className="text-base font-black font-mono text-amber-300">
            {wallets.driverOperational_2020.toFixed(2)} DA
          </div>
          <p className="text-[9px] text-slate-400 font-mono">Compte opérationnel digital</p>
        </div>

        {/* Account 4010 */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/10 space-y-1 col-span-2 md:col-span-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">
            Cpt 4010: Revenus Plateforme
          </span>
          <div className="text-base font-black font-mono text-amber-400">
            {wallets.platformRevenue_4010.toFixed(2)} DA
          </div>
          <p className="text-[9px] text-slate-400 font-mono">Frais d'approche (CNRC 604103)</p>
        </div>

      </div>

      {/* Immutable Ledger Journal */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            <span>Journal Général des Écritures Comptables (Immuable)</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">{ledgerEntries.length} écritures validées</span>
        </div>

        <div className="bg-slate-950/90 rounded-2xl border border-white/10 overflow-x-auto shadow-inner">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/5 text-slate-400 text-[10px] uppercase border-b border-white/10">
              <tr>
                <th className="py-2.5 px-3">Date / ID</th>
                <th className="py-2.5 px-3">Type d'Écriture</th>
                <th className="py-2.5 px-3">Débit (-)</th>
                <th className="py-2.5 px-3">Crédit (+)</th>
                <th className="py-2.5 px-3 text-right">Montant (DZD)</th>
                <th className="py-2.5 px-3">Libellé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300 text-[11px]">
              {ledgerEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-400">
                    <div>{entry.timestamp}</div>
                    <div className="text-[9px] text-slate-500">{entry.id}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                      entry.entryType === 'spare_change_credit'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : entry.entryType === 'wallet_topup'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        : entry.entryType === 'commission_debit'
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                        : 'bg-white/5 text-slate-300'
                    }`}>
                      {entry.entryType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-rose-400 whitespace-nowrap">{entry.debitAccount}</td>
                  <td className="py-2.5 px-3 text-emerald-400 whitespace-nowrap">{entry.creditAccount}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-white whitespace-nowrap">
                    {entry.amountDzd.toFixed(2)} DA
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[10px] max-w-xs truncate">
                    {entry.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
