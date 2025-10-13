import { IdGenerator } from './id-generator';
import { IdProvider } from './id-provider.interface';
import { UuidProvider } from './uuid-provider';

describe('IdGenerator', () => {
  beforeEach(() => {
    IdGenerator.reset();
  });

  describe('generate', () => {
    it('should generate a valid UUID by default', () => {
      const id = IdGenerator.generate();

      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
      expect(IdGenerator.isValid(id)).toBe(true);
    });

    it('should generate different IDs on each call', () => {
      const id1 = IdGenerator.generate();
      const id2 = IdGenerator.generate();

      expect(id1).not.toBe(id2);
    });

    it('should generate IDs matching UUID v4 format', () => {
      const id = IdGenerator.generate();
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      expect(id).toMatch(uuidRegex);
    });
  });

  describe('isValid', () => {
    it('should validate correct UUID v4', () => {
      const validUuid = '550e8400-e29b-41d4-a716-446655440000';

      expect(IdGenerator.isValid(validUuid)).toBe(true);
    });

    it('should reject invalid UUID format', () => {
      expect(IdGenerator.isValid('invalid-uuid')).toBe(false);
      expect(IdGenerator.isValid('123')).toBe(false);
      expect(IdGenerator.isValid('')).toBe(false);
    });

    it('should reject non-v4 UUID', () => {
      const uuidV1 = '550e8400-e29b-11d4-a716-446655440000'; // v1

      expect(IdGenerator.isValid(uuidV1)).toBe(false);
    });
  });

  describe('setProvider', () => {
    it('should allow setting a custom provider', () => {
      const customProvider: IdProvider = {
        generate: () => 'custom-id',
        isValid: (id: string) => id === 'custom-id',
      };

      IdGenerator.setProvider(customProvider);
      const id = IdGenerator.generate();

      expect(id).toBe('custom-id');
      expect(IdGenerator.isValid('custom-id')).toBe(true);
      expect(IdGenerator.isValid('other-id')).toBe(false);
    });

    it('should use custom provider for validation', () => {
      const customProvider: IdProvider = {
        generate: () => 'CUSTOM-123',
        isValid: (id: string) => id.startsWith('CUSTOM-'),
      };

      IdGenerator.setProvider(customProvider);

      expect(IdGenerator.isValid('CUSTOM-456')).toBe(true);
      expect(IdGenerator.isValid('OTHER-456')).toBe(false);
    });
  });

  describe('getProvider', () => {
    it('should return the current provider', () => {
      const provider = IdGenerator.getProvider();

      expect(provider).toBeInstanceOf(UuidProvider);
    });

    it('should return custom provider after setting it', () => {
      const customProvider: IdProvider = {
        generate: () => 'test',
        isValid: () => true,
      };

      IdGenerator.setProvider(customProvider);
      const provider = IdGenerator.getProvider();

      expect(provider).toBe(customProvider);
    });
  });

  describe('reset', () => {
    it('should reset to default UUID provider', () => {
      const customProvider: IdProvider = {
        generate: () => 'custom',
        isValid: () => false,
      };

      IdGenerator.setProvider(customProvider);
      expect(IdGenerator.generate()).toBe('custom');

      IdGenerator.reset();
      const id = IdGenerator.generate();

      expect(id).not.toBe('custom');
      expect(IdGenerator.isValid(id)).toBe(true);
    });
  });
});

describe('UuidProvider', () => {
  let provider: UuidProvider;

  beforeEach(() => {
    provider = new UuidProvider();
  });

  describe('generate', () => {
    it('should generate valid UUID v4', () => {
      const id = provider.generate();

      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
      expect(provider.isValid(id)).toBe(true);
    });

    it('should generate unique IDs', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(provider.generate());
      }

      expect(ids.size).toBe(100);
    });
  });

  describe('isValid', () => {
    it('should validate correct UUID v4 format', () => {
      const validUuids = [
        '550e8400-e29b-41d4-a716-446655440000',
        '6ba7b810-9dad-41d1-80b4-00c04fd430c8',
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      ];

      validUuids.forEach((uuid) => {
        expect(provider.isValid(uuid)).toBe(true);
      });
    });

    it('should reject invalid formats', () => {
      const invalidIds = [
        '',
        'not-a-uuid',
        '550e8400-e29b-11d4-a716-446655440000', // v1
        '550e8400-e29b-21d4-a716-446655440000', // v2
        '550e8400-e29b-31d4-a716-446655440000', // v3
        '550e8400-e29b-51d4-a716-446655440000', // v5
        '550e8400e29b41d4a716446655440000', // no hyphens
        '550e8400-e29b-41d4-a716', // incomplete
      ];

      invalidIds.forEach((id) => {
        expect(provider.isValid(id)).toBe(false);
      });
    });

    it('should handle null and undefined', () => {
      expect(provider.isValid(null as unknown as string)).toBe(false);
      expect(provider.isValid(undefined as unknown as string)).toBe(false);
    });

    it('should handle non-string values', () => {
      expect(provider.isValid(123 as unknown as string)).toBe(false);
      expect(provider.isValid({} as unknown as string)).toBe(false);
      expect(provider.isValid([] as unknown as string)).toBe(false);
    });
  });
});
