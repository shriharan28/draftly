const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8');
const supabaseUrl = env.split('\n').find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_URL=')).split('=')[1].trim();
const supabaseKey = env.split('\n').find(l => l.startsWith('SUPABASE_SERVICE_ROLE_KEY=')).split('=')[1].trim();
const stripeKey = env.split('\n').find(l => l.startsWith('STRIPE_SECRET_KEY=')).split('=')[1].trim();

const { createClient } = require('@supabase/supabase-js');
const stripe = require('stripe')(stripeKey);
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const userId = 'e9b7e4f4-20bb-459e-b1e0-647659f681da'; // The user we just found

  // 1. Find customer in Stripe
  const customers = await stripe.customers.search({
    query: "email:'regan.mit11@gmail.com'"
  });

  if (customers.data.length === 0) {
    console.error("Stripe customer not found!");
    return;
  }
  const customerId = customers.data[0].id;
  console.log("Found Stripe Customer:", customerId);

  // 2. Get their subscriptions
  const subs = await stripe.subscriptions.list({
    customer: customerId,
    status: 'all'
  });

  if (subs.data.length === 0) {
    console.error("No subscriptions found in Stripe for this customer!");
    return;
  }

  const sub = subs.data[0];
  console.log("Found Stripe Subscription:", sub.id);
  console.log("Status:", sub.status);
  console.log("Cancel at period end:", sub.cancel_at_period_end);

  // 3. Update the database!
  const { error } = await supabase.from('subscriptions').update({
    stripe_subscription_id: sub.id,
    stripe_customer_id: customerId,
    status: sub.status,
    updated_at: new Date().toISOString()
  }).eq('user_id', userId);

  if (error) {
    console.error("Error updating DB:", error);
  } else {
    console.log("Successfully fixed the database!");
  }
}

run();
