const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8');
const supabaseUrl = env.split('\n').find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_URL=')).split('=')[1].trim();
const supabaseKey = env.split('\n').find(l => l.startsWith('SUPABASE_SERVICE_ROLE_KEY=')).split('=')[1].trim();
const stripeKey = env.split('\n').find(l => l.startsWith('STRIPE_SECRET_KEY=')).split('=')[1].trim();

const { createClient } = require('@supabase/supabase-js');
const stripe = require('stripe')(stripeKey);

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  // Get the user ID for regan.mit11@gmail.com
  const { data: profiles, error: pErr } = await supabase
    .from('profiles')
    .select('id, email')
    .eq('email', 'regan.mit11@gmail.com')
    .limit(1);

  if (pErr || !profiles || profiles.length === 0) {
    console.error("User not found!");
    return;
  }
  
  const userId = profiles[0].id;

  // Get the subscription ID
  const { data: sub, error: sErr } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id, status, current_period_end')
    .eq('user_id', userId)
    .single();

  if (sErr || !sub) {
    console.error("Subscription not found for this user in DB!");
    return;
  }

  console.log("Database Subscription:", sub);

  if (sub.stripe_subscription_id) {
    try {
      const stripeSub = await stripe.subscriptions.retrieve(sub.stripe_subscription_id);
      console.log("\nStripe Subscription Data:");
      console.log("- cancel_at_period_end:", stripeSub.cancel_at_period_end);
      console.log("- cancel_at:", stripeSub.cancel_at ? new Date(stripeSub.cancel_at * 1000).toISOString() : null);
      console.log("- current_period_end:", stripeSub.current_period_end ? new Date(stripeSub.current_period_end * 1000).toISOString() : null);
      console.log("- status:", stripeSub.status);
    } catch (err) {
      console.error("\nFailed to fetch from Stripe:", err.message);
    }
  }
}

run();
