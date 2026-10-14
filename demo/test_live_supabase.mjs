import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jgctorgztxwrgdkfkuxv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY3Rvcmd6dHh3cmdka2ZrdXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5OTU5MzMsImV4cCI6MjEwNzU3MTkzM30.kx7G0Oa5nkIfPKLt3D9c_MNbnwFiUAQY8CnSA94JdCo';

async function runLiveSupabaseTests() {
  console.log('==================================================================');
  console.log('  TEST 1: LIVE SUPABASE CLOUD CONNECTION & SCHEMA AUDIT');
  console.log('==================================================================');
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // 1. Query public.wallets for seeded GL accounts
  console.log('[Test 1.1] Querying seeded GL accounts in public.wallets...');
  const { data: wallets, error: wError } = await supabase
    .from('wallets')
    .select('id, account_type, system_account_code, balance_dzd, currency');

  if (wError) {
    console.error('FAILED to query wallets:', wError.message);
    process.exit(1);
  }
  console.log(`  -> SUCCESS: Retrieved ${wallets.length} system GL wallet records from live cloud DB:`);
  wallets.forEach(w => {
    console.log(`     * Account ${w.system_account_code}: ${w.account_type} = ${w.balance_dzd} ${w.currency}`);
  });

  // 2. Query public.vehicles to check schema integrity
  console.log('\n[Test 1.2] Checking public.vehicles table schema & columns...');
  const { data: vehicles, error: vError } = await supabase
    .from('vehicles')
    .select('id, make, model, license_plate, category, total_passenger_seats')
    .limit(5);

  if (vError) {
    console.error('FAILED to query vehicles:', vError.message);
    process.exit(1);
  }
  console.log(`  -> SUCCESS: Table public.vehicles accessible with correct columns (${vehicles.length} rows).`);

  // 3. Query public.rides
  console.log('\n[Test 1.3] Checking public.rides table schema...');
  const { data: rides, error: rError } = await supabase
    .from('rides')
    .select('id, ride_code, service_type, status, fare_estimated')
    .limit(3);

  if (rError) {
    console.error('FAILED to query rides:', rError.message);
    process.exit(1);
  }
  console.log(`  -> SUCCESS: Table public.rides accessible with correct columns (${rides.length} records returned).`);


  // 4. Query public.dashcam_incidents
  console.log('\n[Test 1.4] Checking public.dashcam_incidents table schema...');
  const { data: incidents, error: incError } = await supabase
    .from('dashcam_incidents')
    .select('id, trigger_type, peak_g_force, review_status, aes_encryption_key_id')
    .limit(3);

  if (incError) {
    console.error('FAILED to query dashcam_incidents:', incError.message);
    process.exit(1);
  }
  console.log(`  -> SUCCESS: Table public.dashcam_incidents accessible (${incidents.length} records returned).`);


  console.log('\n==================================================================');
  console.log('  RESULT: ALL LIVE CLOUD SUPABASE DB INTEGRITY TESTS PASSED (100%)');
  console.log('==================================================================\n');
}

runLiveSupabaseTests().catch(err => {
  console.error('FATAL DB TEST ERROR:', err);
  process.exit(1);
});
