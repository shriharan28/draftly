const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8');
const supabaseUrl = env.split('\n').find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_URL=')).split('=')[1].trim();
const supabaseKey = env.split('\n').find(l => l.startsWith('SUPABASE_SERVICE_ROLE_KEY=')).split('=')[1].trim();
const stripeKey = env.split('\n').find(l => l.startsWith('STRIPE_SECRET_KEY=')).split('=')[1].trim();

const { createClient } = require('@supabase/supabase-js');
const stripe = require('stripe')(stripeKey);
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: subs } = await supabase.from('subscriptions').select('*').is('stripe_subscription_id', null).eq('status', 'active');
  
  if (!subs || subs.length === 0) {
    console.log("No corrupted subscriptions found!");
    return;
  }

  for (const sub of subs) {
    console.log("Fixing corrupted subscription for customer:", sub.stripe_customer_id);
    const stripeSubs = await stripe.subscriptions.list({
      customer: sub.stripe_customer_id,
      status: 'all'
    });

    if (stripeSubs.data.length > 0) {
      const activeSub = stripeSubs.data[0];
      await supabase.from('subscriptions').update({
        stripe_subscription_id: activeSub.id,
        status: activeSub.status,
        updated_at: new Date().toISOString()
      }).eq('id', sub.id);
      console.log("Fixed!", activeSub.id);
    } else {
      console.log("Could not find Stripe subscription for", sub.stripe_customer_id);
    }
  }
}

run();
