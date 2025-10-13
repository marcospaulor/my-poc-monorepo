import { Company } from './company.entity';
import { ValidationErrors } from '@my-poc-monorepo/domain-errors';

describe('Company Entity', () => {
  let mockId: string;
  let mockName: string;
  let mockAddress: string;
  let mockCreatedAt: Date;

  beforeEach(() => {
    mockId = '123e4567-e89b-12d3-a456-426614174000';
    mockName = 'Test Company';
    mockAddress = 'Rua das Flores, 123 - São Paulo/SP';
    mockCreatedAt = new Date('2024-01-15T10:30:00.000Z');
  });

  describe('restore', () => {
    it('should restore the company state with provided values', async () => {
      const companyData = {
        id: mockId,
        name: mockName,
        address: mockAddress,
        createdAt: mockCreatedAt,
      };
      const company = await Company.restore(companyData);
      expect(company.id.value).toBe(mockId);
      expect(company.name).toBe(mockName);
      expect(company.address).toBe(mockAddress);
      expect(company.createdAt).toEqual(mockCreatedAt);
      expect(company.createdAtIso).toBe('2024-01-15T10:30:00.000Z');
    });
  });

  describe('create', () => {
    it('should create a company with auto-generated UUID and set name/address', async () => {
      const name = 'New Company';
      const address = 'Address';
      const company = await Company.create({ name, address });
      expect(company.id).toBeDefined();
      expect(company.name).toBe(name);
      expect(company.address).toBe(address);
      expect(company.createdAt).toBeInstanceOf(Date);
      expect(company.createdAtIso).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
    });

    it('should throw ValidationErrors with both fields when name and address are invalid', async () => {
      await expect(Company.create({ name: '', address: '' })).rejects.toThrow(
        ValidationErrors
      );

      try {
        await Company.create({ name: '', address: '' });
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationErrors);
        const validationErrors = error as ValidationErrors;
        expect(validationErrors.errors).toHaveLength(2);
        expect(validationErrors.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ field: 'name' }),
            expect.objectContaining({ field: 'address' }),
          ])
        );
      }
    });

    it('should throw ValidationErrors with name field when only name is invalid', async () => {
      await expect(
        Company.create({ name: '', address: mockAddress })
      ).rejects.toThrow(ValidationErrors);

      try {
        await Company.create({ name: '', address: mockAddress });
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationErrors);
        const validationErrors = error as ValidationErrors;
        expect(validationErrors.errors).toHaveLength(1);
        expect(validationErrors.errors[0].field).toBe('name');
      }
    });

    it('should throw ValidationErrors with address field when only address is invalid', async () => {
      await expect(
        Company.create({ name: mockName, address: '' })
      ).rejects.toThrow(ValidationErrors);

      try {
        await Company.create({ name: mockName, address: '' });
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationErrors);
        const validationErrors = error as ValidationErrors;
        expect(validationErrors.errors).toHaveLength(1);
        expect(validationErrors.errors[0].field).toBe('address');
      }
    });
  });
});
