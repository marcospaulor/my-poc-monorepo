import { CompanyName } from './company-name.value-object';

describe('CompanyName', () => {
  describe('create', () => {
    it('should create a CompanyName with valid value', () => {
      const name = CompanyName.create('Valid Company Name');

      expect(name).toBeInstanceOf(CompanyName);
      expect(name.value).toBe('Valid Company Name');
    });

    it('should trim whitespace from the name', () => {
      const name = CompanyName.create('  Valid Company Name  ');

      expect(name.value).toBe('Valid Company Name');
    });

    it('should accept name with minimum valid length', () => {
      const name = CompanyName.create('AB');

      expect(name.value).toBe('AB');
    });

    it('should accept name with maximum valid length', () => {
      const longName = 'A'.repeat(255);
      const name = CompanyName.create(longName);

      expect(name.value).toBe(longName);
    });

    it('should reject empty string', () => {
      expect(() => CompanyName.create('')).toThrow();
    });

    it('should reject string with only whitespace', () => {
      expect(() => CompanyName.create('   ')).toThrow();
    });

    it('should reject name that is too short', () => {
      expect(() => CompanyName.create('A')).toThrow();
    });

    it('should reject name that is too long', () => {
      const tooLongName = 'A'.repeat(256);
      expect(() => CompanyName.create(tooLongName)).toThrow();
    });
  });

  describe('equals', () => {
    it('should return true for equal CompanyNames', () => {
      const name1 = CompanyName.create('Test Company');
      const name2 = CompanyName.create('Test Company');

      expect(name1.equals(name2)).toBe(true);
    });

    it('should return false for different CompanyNames', () => {
      const name1 = CompanyName.create('Company A');
      const name2 = CompanyName.create('Company B');

      expect(name1.equals(name2)).toBe(false);
    });

    it('should handle trimmed equality', () => {
      const name1 = CompanyName.create('  Test Company  ');
      const name2 = CompanyName.create('Test Company');

      expect(name1.equals(name2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return the string representation of the name', () => {
      const name = CompanyName.create('Test Company');

      expect(name.toString()).toBe('Test Company');
    });
  });
});
