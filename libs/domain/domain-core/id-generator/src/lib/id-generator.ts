import { IdProvider } from './id-provider.interface';
import { UuidProvider } from './uuid-provider';

export class IdGenerator {
  private static provider: IdProvider = new UuidProvider();

  static setProvider(provider: IdProvider): void {
    IdGenerator.provider = provider;
  }

  static getProvider(): IdProvider {
    return IdGenerator.provider;
  }

  static generate(): string {
    return IdGenerator.provider.generate();
  }

  static isValid(id: string): boolean {
    return IdGenerator.provider.isValid(id);
  }

  static reset(): void {
    IdGenerator.provider = new UuidProvider();
  }
}
