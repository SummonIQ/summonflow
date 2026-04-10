import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

async function setupStripe() {
  console.log('🚀 Setting up Stripe products and prices...');

  // 1. Create Pro Plan
  const proProduct = await stripe.products.create({
    name: 'SummonStream Pro',
    description: 'Managed production-grade realtime infrastructure.',
    features: [
      { name: 'Unlimited Applications' },
      { name: 'Presence & Encrypted Channels' },
      { name: 'Redis-backed Fanout' },
    ],
  });

  const proPrice = await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 2900, // $29.00
    currency: 'usd',
    recurring: {
      interval: 'month',
    },
  });

  console.log('✅ Created Pro Product:', proProduct.id);
  console.log('✅ Created Pro Price:', proPrice.id);
  console.log('\nAdd this to your .env:');
  console.log(`STRIPE_PRO_PRICE_ID=${proPrice.id}`);
}

setupStripe().catch(console.error);
