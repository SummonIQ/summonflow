import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

declare global {
  var cachedDb: PrismaClient;
}

let db: PrismaClient;

function createPrismaClient() {
  let connectionString = process.env.DATABASE_URL;
  if (connectionString) {
    const url = new URL(connectionString);
    const sslmode = url.searchParams.get('sslmode');
    if (sslmode === 'prefer' || sslmode === 'require' || sslmode === 'verify-ca') {
      url.searchParams.set('sslmode', 'verify-full');
      connectionString = url.toString();
    }
  }

  const adapter = new PrismaPg({
    connectionString,
    ssl: { rejectUnauthorized: true },
  });
  return new PrismaClient({ adapter });
}

if (process.env.NODE_ENV === 'production') {
  db = createPrismaClient();
} else {
  if (!(global as any).cachedDb) {
    (global as any).cachedDb = createPrismaClient();
  }
  db = (global as any).cachedDb;
}

export { db };
