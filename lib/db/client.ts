import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

declare global {
  var cachedDb: PrismaClient;
}

let db: PrismaClient;

function createPrismaClient() {
  let connectionString = process.env.DATABASE_URL;

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
