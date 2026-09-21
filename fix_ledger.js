const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8');
const supabaseUrl = env.split('\n').find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_URL=')).split('=')[1].trim();
const supabaseKey = env.split('\n').find(l => l.startsWith('SUPABASE_SERVICE_ROLE_KEY=')).split('=')[1].trim();

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  // Insert a correction row
  const { error } = await supabase.from('credit_ledger').insert({
    user_id: 'e9b7e4f4-20bb-459e-b1e0-647659f681da',
    delta: -150,
    reason: 'admin_adjust',
    balance_after: 160,
    idempotency_key: 'admin_correction_double_grant'
  });
  
  if (error) console.error("Error inserting correction:", error);
  else console.log("Successfully corrected balance to 160!");
}

run();
