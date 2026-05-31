import Stripe from 'stripe';

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables.');
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-03-25.dahlia',
    typescript: true,
  });
}

export const PLANS = {
  HOBBY: {
    id: 'hobby',
    name: 'Hobby',
    price: 0,
    features: ['1 App', 'Public Channels', 'Community Support'],
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 29,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: ['Up to 10 Apps', 'Presence & Encrypted Channels', 'Redis-backed Fanout', 'Email Support'],
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    features: ['SLA Guarantee', 'Dedicated WebSocket Nodes', 'Audit Trails', 'Priority Support'],
  },
};
