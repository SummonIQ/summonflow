const isClient = typeof window !== 'undefined';
if (isClient) {
  console.warn('Auth server module should not be imported directly on the client');
}

import { betterAuth, BetterAuthOptions } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { passkey } from '@better-auth/passkey';

import { db } from '@/lib/db/client';

export const config: BetterAuthOptions = {
  appName: 'SummonFlow',
  advanced: {
    disableCSRFCheck: false,
    useSecureCookies: process.env.NODE_ENV === 'production',
  },
  database: prismaAdapter(db, {
    provider: 'postgresql',
  }),
  logger: {
    disabled: process.env.NODE_ENV === 'production',
    level: process.env.NODE_ENV === 'production' ? 'error' : 'info',
  },
  emailAndPassword: {
    autoSignIn: true,
    enabled: true,
    maxPasswordLength: 128,
    minPasswordLength: 8,
  },
  plugins: [
    passkey(),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 7 * 24 * 60 * 60,
    },
    expiresIn: 7 * 24 * 60 * 60,
    freshAge: 7 * 24 * 60 * 60,
    preserveSessionInDatabase: false,
    updateAge: 24 * 60 * 60,
  },
  trustedOrigins: [
    process.env.BETTER_AUTH_URL ?? 'http://localhost:30220',
    ...(process.env.NODE_ENV !== 'production'
      ? ['http://localhost:30220', 'http://127.0.0.1:30220']
      : []),
    'https://console.summonflow.com',
  ],
  user: {
    modelName: 'user',
    additionalFields: {
      firstName: {
        type: 'string',
        required: true,
      },
      lastName: {
        type: 'string',
        required: true,
      },
    },
  },
};

export const auth = betterAuth(config);
