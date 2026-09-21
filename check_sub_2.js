const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8');
const supabaseUrl = env.split('\n').find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_URL=')).split('=')[1].trim();
const supabaseKey = env.split('\n').find(l => l.startsWith('SUPABASE_SERVICE_ROLE_KEY=')).split('=')[1].trim();
const stripeKey = env.split('\n').find(l => l.startsWith('STRIPE_SECRET_KEY=')).split('=')[1].trim();

const { createClient } = require('@supabase/supabase-js');
const stripe = require('stripe')(stripeKey);
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: profiles } = await supabase.from('profiles').select('id, email').eq('email', 'test2@gmail.com').limit(1);
  if (!profiles || profiles.length === 0) return console.log("User not found");
  
  const userId = profiles[0].id;
  const { data: sub } = await supabase.from('subscriptions').select('*').eq('user_id', userId).single();
  
  console.log("Database Subscription for test2@gmail.com:");
  console.log("Stripe Subscription ID in DB:", sub.stripe_subscription_id);
  console.log("Status in DB:", sub.status);
}

run();
