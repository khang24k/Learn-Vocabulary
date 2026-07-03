import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL || '';

// Initialize pg Pool
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Initialize Prisma Client
export const prisma = new PrismaClient({ adapter });
