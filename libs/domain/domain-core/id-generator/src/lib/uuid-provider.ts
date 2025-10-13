import { IdProvider } from './id-provider.interface';
import { randomUUID } from 'crypto';

export class UuidProvider implements IdProvider {
  private static readonly UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  generate(): string {
    return randomUUID();
  }

  isValid(id: string): boolean {
    if (!id || typeof id !== 'string') {
      return false;
    }
    return UuidProvider.UUID_REGEX.test(id);
  }
}
