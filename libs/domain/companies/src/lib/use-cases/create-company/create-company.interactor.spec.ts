import { CreateCompanyInteractor } from './create-company.interactor';
import { CompanyRepository } from '../../contracts/company.repository';
import { Company } from '../../entities/company.entity';

describe('CreateCompanyInteractor', () => {
  let interactor: CreateCompanyInteractor;
  let mockCompanyRepository: jest.Mocked<CompanyRepository>;

  beforeEach(() => {
    mockCompanyRepository = {
      save: jest.fn(),
      findById: jest.fn(),
    };

    interactor = new CreateCompanyInteractor(mockCompanyRepository);
  });

  describe('successful creation', () => {
    it('should create a company, save it, and return the ID', async () => {
      // Arrange
      const input = {
        name: 'Test Company',
        address: 'Rua das Flores, 123 - São Paulo/SP',
      };
      mockCompanyRepository.save.mockResolvedValue(undefined);

      // Act
      const result = await interactor.execute(input);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );

      expect(mockCompanyRepository.save).toHaveBeenCalledTimes(1);
      const savedCompany = mockCompanyRepository.save.mock.calls[0][0];
      expect(savedCompany).toBeInstanceOf(Company);
      expect(savedCompany.name).toBe(input.name);
      expect(savedCompany.address).toBe(input.address);
    });
  });

  describe('error handling', () => {
    it('should propagate errors from repository save', async () => {
      // Arrange
      const input = { name: 'Test Company', address: 'Test Address' };
      const error = new Error('Database connection failed');
      mockCompanyRepository.save.mockRejectedValue(error);

      // Act & Assert
      await expect(interactor.execute(input)).rejects.toThrow(
        'Database connection failed'
      );
    });

    // Validações agora falham via entity, mas teste indireto para cobertura
    it('should propagate validation errors from entity creation', async () => {
      // Arrange
      const invalidInput = { name: '', address: 'Valid Address' };

      // Act & Assert (falha no Company.create(), sem chamar save)
      await expect(interactor.execute(invalidInput)).rejects.toThrow(
        'Company name is required and cannot be empty'
      );
      expect(mockCompanyRepository.save).not.toHaveBeenCalled();
    });
  });
});
