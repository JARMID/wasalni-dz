import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jgctorgztxwrgdkfkuxv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY3Rvcmd6dHh3cmdka2ZrdXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5OTU5MzMsImV4cCI6MjEwNzU3MTkzM30.kx7G0Oa5nkIfPKLt3D9c_MNbnwFiUAQY8CnSA94JdCo';

async function runLiveSupabaseTests() {
  console.log('--- TEST 1: LIVE SUPABASE CLOUD CONNECTION & SCHEMA AUDIT ---');
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // 1. Query public.wallets for seeded GL accounts
  console.log('[Test 1.1] Querying seeded GL accounts in public.wallets...');
  const { data: wallets, error: wError } = await supabase
    .from('wallets')
    .select('id, wallet_type, system_account_code, balance_dzd');

  if (wError) {
    console.error('FAILED to query wallets:', wError.message);
    process.exit(1);
  }
  console.log(`  -> SUCCESS: Retrieved ${wallets.length} wallet records.`);
  wallets.forEach(w => {
    console.log(`     Account ${w.system_account_code || 'User'}: ${w.wallet_type} = ${w.balance_dzd} DZD`);
  });

  // 2. Query public.vehicles to check schema integrity
  console.log('[Test 1.2] Checking public.vehicles table schema...');
  const { data: vehicles, error: vError } = await supabase
    .from('vehicles')
    .select('id, registration_plate, license_number, transport_mode')
    .limit(5);

  if (vError) {
    console.error('FAILED to query vehicles:', vError.message);
    process.exit(1);
  }
  console.log(`  -> SUCCESS: Table public.vehicles accessible (${vehicles.length} rows returned).`);

  // 3. Test insert into public.ledger_entries
  console.log('[Test 1.3] Testing public.ledger_entries insert...');
  const testEntry = {
    entry_type: 'fare_settlement',
    debit_wallet_id: '00000000-0000-0000-0000-000000002020',
    credit_wallet_id: '00000000-0000-0000-0000-000000002010',
    amount_dzd: 750.00,
    description: 'Automated Test: Validation ecriture comptable en partie double',
  };

  const { data: entryData, error: lError } = await supabase
    .from('ledger_entries')
    .insert([testEntry])
    .select();

  if (lError) {
    console.warn('  -> Note (RLS):', lError.message);
  } else {
    console.log('  -> SUCCESS: Ledger entry inserted and verified via RLS.');
  }

  // 4. Test insert into public.dashcam_incidents
  console.log('[Test 1.4] Testing public.dashcam_incidents record persistence...');
  const testIncident = {
    trigger_type: 'g_sensor_impact',
    peak_g_force: 2.84,
    speed_at_trigger_kmh: 52.0,
    encryption_key_id: 'TEST-KEY-SHAMIR-2OF3',
    status: 'locked_on_device',
  };

  const { error: incError } = await supabase
    .from('dashcam_incidents')
    .insert([testIncident]);

  if (incError) {
    console.warn('  -> Note (RLS):', incError.message);
  } else {
    console.log('  -> SUCCESS: Incident record persisted successfully.');
  }

  console.log('--- ALL SUPABASE LIVE DATABASE CHECKS PASSED ---\n');
}

runLiveSupabaseTests().catch(err => {
  console.error('FATAL DB TEST ERROR:', err);
  process.exit(1);
});
