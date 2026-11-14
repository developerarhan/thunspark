import 'dotenv/config';
import dotenv from 'dotenv';
import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

dotenv.config({ path: '.env.local' });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
  }

  const adapter = new PrismaNeon({
    connectionString,
  });

  return new PrismaClient({
    adapter,
  });
}

const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}

export default db;
export { db };
