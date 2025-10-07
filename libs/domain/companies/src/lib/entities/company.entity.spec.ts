import { Company } from './company.entity';
import { CompanyValidationError } from './company.errors'; // Assumindo que existe

describe('Company Entity', () => {
  let mockId: string;
  let mockName: string;
  let mockAddress: string;

  beforeEach(() => {
    mockId = '123e4567-e89b-12d3-a456-426614174000';
    mockName = 'Test Company';
    mockAddress = 'Rua das Flores, 123 - São Paulo/SP';
  });

  describe('restore', () => {
    it('should restore the company state with provided values', () => {
      const company = Company.restore({
        id: mockId,
        name: mockName,
        address: mockAddress,
      });
      expect(company.id).toBe(mockId);
      expect(company.name).toBe(mockName);
      expect(company.address).toBe(mockAddress);
    });

    it('should throw validation error on invalid name during restore', () => {
      expect(() =>
        Company.restore({ id: mockId, name: '', address: mockAddress })
      ).toThrow(CompanyValidationError);
      expect(() =>
        Company.restore({ id: mockId, name: '   ', address: mockAddress })
      ).toThrow(CompanyValidationError);
    });

    it('should throw validation error on invalid address during restore', () => {
      expect(() =>
        Company.restore({ id: mockId, name: mockName, address: '' })
      ).toThrow(CompanyValidationError);
      expect(() =>
        Company.restore({ id: mockId, name: mockName, address: '   ' })
      ).toThrow(CompanyValidationError);
    });
  });

  describe('create', () => {
    it('should create a company with auto-generated UUID and set name/address', () => {
      const name = 'New Company';
      const address = 'Av. Paulista, 1000 - São Paulo/SP';

      const company = Company.create({ name, address });

      expect(company.id).toBeDefined();
      expect(company.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
      expect(company.name).toBe(name);
      expect(company.address).toBe(address);
    });

    it('should throw validation error on invalid name during create', () => {
      expect(() => Company.create({ name: '', address: mockAddress })).toThrow(
        CompanyValidationError
      );
      expect(() =>
        Company.create({ name: '   ', address: mockAddress })
      ).toThrow(CompanyValidationError);
    });

    it('should throw validation error on invalid address during create', () => {
      expect(() => Company.create({ name: mockName, address: '' })).toThrow(
        CompanyValidationError
      );
      expect(() => Company.create({ name: mockName, address: '   ' })).toThrow(
        CompanyValidationError
      );
    });
  });
});
