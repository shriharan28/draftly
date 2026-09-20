const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8');
const key = env.split('\n').find(l => l.startsWith('STRIPE_SECRET_KEY=')).split('=')[1].trim();
const stripe = require('stripe')(key);
stripe.subscriptions.retrieve('sub_1UHrMGH09WqmRVKUwgvxe8Pq').then(sub => {
  console.log(JSON.stringify(sub, null, 2));
}).catch(console.error);
