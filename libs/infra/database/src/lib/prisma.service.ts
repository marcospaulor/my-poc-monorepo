import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env from workspace root
const envPath = resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });
console.log('DATABASE_URL:', process.env['DATABASE_URL']);

export class PrismaService extends PrismaClient {
  private static instance: PrismaService;

  private constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
      datasources: {
        db: {
          url: process.env['DATABASE_URL'],
        },
      },
    });
  }

  static getInstance(): PrismaService {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService();
    }
    return PrismaService.instance;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
