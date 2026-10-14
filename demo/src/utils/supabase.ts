import { createClient } from '@supabase/supabase-js';
import type { LedgerEntry, DashcamIncident, WalletBalances } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jgctorgztxwrgdkfkuxv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY3Rvcmd6dHh3cmdka2ZrdXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5OTU5MzMsImV4cCI6MjEwNzU3MTkzM30.kx7G0Oa5nkIfPKLt3D9c_MNbnwFiUAQY8CnSA94JdCo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseAnonKey);

// Fetch live GL balances from public.wallets
export async function syncLiveWallets(fallbackWallets: WalletBalances): Promise<WalletBalances> {
  try {
    const { data, error } = await supabase
      .from('wallets')
      .select('system_account_code, balance_dzd');

    if (error || !data || data.length === 0) {
      return fallbackWallets;
    }

    const updated = { ...fallbackWallets };
    data.forEach(row => {
      const code = row.system_account_code;
      const bal = parseFloat(row.balance_dzd) || 0;
      if (code === '1010') updated.cashInTransit_1010 = bal;
      if (code === '1020') updated.digitalEscrow_1020 = bal;
      if (code === '4010') updated.platformRevenue_4010 = bal;
    });

    return updated;
  } catch {
    return fallbackWallets;
  }
}

// Push ledger entry to Supabase
export async function persistLedgerEntry(entry: LedgerEntry) {
  try {
    await supabase.from('ledger_entries').insert([{
      entry_type: entry.entryType,
      debit_wallet_id: '00000000-0000-0000-0000-000000002020',
      credit_wallet_id: '00000000-0000-0000-0000-000000002010',
      amount_dzd: entry.amountDzd,
      description: entry.description,
    }]);
  } catch (err) {
    console.warn('[Supabase] Non-blocking offline ledger persistence error:', err);
  }
}

// Push incident to Supabase
export async function persistIncident(incident: DashcamIncident) {
  try {
    await supabase.from('dashcam_incidents').insert([{
      trigger_type: incident.triggerType,
      peak_g_force: incident.peakGForce,
      speed_at_trigger_kmh: incident.speedKmh,
      encryption_key_id: incident.encryptionKeyId,
      status: incident.status,
    }]);
  } catch (err) {
    console.warn('[Supabase] Non-blocking incident persistence error:', err);
  }
}

// Multi-Device Supabase Realtime Broadcast Channel
export type RealtimeFleetMessage = 
  | { type: 'DRIVER_LOCATION'; payload: { lat: number; lng: number; heading: number; speedKmh: number } }
  | { type: 'RIDE_REQUEST'; payload: any }
  | { type: 'RIDE_STATUS_CHANGE'; payload: { status: string; meterAmount?: number } }
  | { type: 'SPARE_CHANGE_SYNC'; payload: { changeAmount: number; tenderedAmount: number } }
  | { type: 'INCIDENT_ALERT'; payload: DashcamIncident };

let fleetChannel: ReturnType<typeof supabase.channel> | null = null;

export function initFleetRealtime(onMessage: (msg: RealtimeFleetMessage) => void) {
  if (fleetChannel) {
    fleetChannel.unsubscribe();
  }

  fleetChannel = supabase.channel('naql_fleet_room', {
    config: { broadcast: { self: false } }
  });

  fleetChannel
    .on('broadcast', { event: 'fleet_event' }, (payload) => {
      if (payload?.payload) {
        onMessage(payload.payload as RealtimeFleetMessage);
      }
    })
    .subscribe((status) => {
      console.log('[Supabase Realtime] Fleet Channel status:', status);
    });

  return () => {
    if (fleetChannel) {
      fleetChannel.unsubscribe();
      fleetChannel = null;
    }
  };
}

export function broadcastFleetEvent(msg: RealtimeFleetMessage) {
  if (fleetChannel) {
    fleetChannel.send({
      type: 'broadcast',
      event: 'fleet_event',
      payload: msg,
    }).catch(err => {
      console.warn('[Supabase Realtime] Broadcast failed:', err);
    });
  }
}

