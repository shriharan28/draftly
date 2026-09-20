const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf-8').split('\n').reduce((acc, line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) acc[match[1]] = match[2];
  return acc;
}, {});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: users, error: userError } = await supabase.auth.admin.listUsers();
  if (userError) return console.error(userError);

  const testUser = users.users.sort((a,b) => new Date(b.created_at) - new Date(a.created_at))[0];
  console.log("Latest user:", testUser.email, testUser.id);

  const { data: subs, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', testUser.id);
  
  if (error) console.error(error);
  else console.log("Subscriptions for user:", subs);
}

main();
