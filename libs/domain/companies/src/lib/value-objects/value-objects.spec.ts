import { randomUUID } from 'crypto';
import { CompanyId } from './company-id.value-object';
import { CompanyName } from './company-name.value-object';
import { CompanyAddress } from './company-address.value-object';

describe('Value Objects', () => {
  describe('CompanyId', () => {
    it('should create, restore and compare identifiers', () => {
      const id1 = new CompanyId(randomUUID());
      const id2 = new CompanyId(randomUUID());
      expect(id1.value).not.toBe(id2.value);
      const validId = '123e4567-e89b-12d3-a456-426614174000';
      const restored = new CompanyId(validId);
      expect(restored.value).toBe(validId);
      const sameId = new CompanyId(validId);
      expect(restored.value).toBe(sameId.value);
      expect(restored.value).not.toBe(id1.value);
    });

    it('should reject invalid identifiers', () => {
      expect(() => new CompanyId('')).toThrow();
      expect(() => new CompanyId('invalid-id')).toThrow();
      expect(() => new CompanyId('123')).toThrow();
    });
  });

  describe('CompanyName', () => {
    it('should create, normalize and compare names with valid boundaries', () => {
      const name = new CompanyName('Valid Company Name');
      expect(name.value).toBe('Valid Company Name');
      const withSpaces = new CompanyName('  Spaced Name  ');
      expect(withSpaces.value).toBe('Spaced Name');
      const minValid = new CompanyName('AB');
      expect(minValid.value).toBe('AB');
      const maxValid = new CompanyName('A'.repeat(255));
      expect(maxValid.value).toBe('A'.repeat(255));
      const name1 = new CompanyName('Company A');
      const name2 = new CompanyName('  Company A  ');
      const name3 = new CompanyName('Company B');
      expect(name1.value).toBe(name2.value);
      expect(name1.value).not.toBe(name3.value);
    });

    it('should reject invalid names', () => {
      expect(() => new CompanyName('')).toThrow();
      expect(() => new CompanyName('   ')).toThrow();
      expect(() => new CompanyName('A')).toThrow();
      expect(() => new CompanyName('A'.repeat(256))).toThrow();
    });
  });

  describe('CompanyAddress', () => {
    it('should create, normalize and compare addresses with valid boundaries', () => {
      const address = new CompanyAddress('123 Main Street, City, State');
      expect(address.value).toBe('123 Main Street, City, State');
      const withSpaces = new CompanyAddress('  123 Main St  ');
      expect(withSpaces.value).toBe('123 Main St');
      const minValid = new CompanyAddress('12345');
      expect(minValid.value).toBe('12345');
      const maxValid = new CompanyAddress('A'.repeat(500));
      expect(maxValid.value).toBe('A'.repeat(500));
      const addr1 = new CompanyAddress('123 Main Street');
      const addr2 = new CompanyAddress('  123 Main Street  ');
      const addr3 = new CompanyAddress('456 Oak Avenue');
      expect(addr1.value).toBe(addr2.value);
      expect(addr1.value).not.toBe(addr3.value);
    });

    it('should reject invalid addresses', () => {
      expect(() => new CompanyAddress('')).toThrow();
      expect(() => new CompanyAddress('   ')).toThrow();
      expect(() => new CompanyAddress('1234')).toThrow();
      expect(() => new CompanyAddress('A'.repeat(501))).toThrow();
    });
  });
});
