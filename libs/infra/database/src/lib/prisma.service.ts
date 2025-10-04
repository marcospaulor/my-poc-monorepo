import { PrismaClient } from '@prisma/client';

export class PrismaService extends PrismaClient {
  private static instance: PrismaService;

  private constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
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
