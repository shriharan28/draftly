const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8');
const supabaseUrl = env.split('\n').find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_URL=')).split('=')[1].trim();
const supabaseKey = env.split('\n').find(l => l.startsWith('SUPABASE_SERVICE_ROLE_KEY=')).split('=')[1].trim();

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('credit_ledger')
    .select('id, delta, reason, balance_after, idempotency_key, created_at')
    .order('id', { ascending: false })
    .limit(5);
  
  if (error) console.error(error);
  else console.log(data);
}

run();
