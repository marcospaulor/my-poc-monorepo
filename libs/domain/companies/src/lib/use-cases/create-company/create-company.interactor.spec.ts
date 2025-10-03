import { CreateCompanyInteractor } from './create-company.interactor';
import { CompanyRepository } from '../../contracts/company.repository';
import { Company } from '../../entities/company.entity';
import { CompanyValidationError } from '../../entities/company.errors';
import { CreateCompanyInput } from './create-company.use-case';

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

  describe('execute', () => {
    it('should create and save a company successfully', async () => {
      // Arrange
      const input: CreateCompanyInput = {
        name: 'Test Company',
        address: 'Rua das Flores, 123 - São Paulo/SP',
      };

      mockCompanyRepository.save.mockResolvedValue(undefined);

      // Act
      const result = await interactor.execute(input);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
      expect(mockCompanyRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should call repository save with correct company data', async () => {
      // Arrange
      const input: CreateCompanyInput = {
        name: 'My Company',
        address: 'Av. Paulista, 1000 - São Paulo/SP',
      };

      mockCompanyRepository.save.mockResolvedValue(undefined);

      // Act
      await interactor.execute(input);

      // Assert
      const savedCompany = mockCompanyRepository.save.mock.calls[0][0];
      expect(savedCompany).toBeInstanceOf(Company);
      expect(savedCompany.name).toBe(input.name);
      expect(savedCompany.address).toBe(input.address);
      expect(savedCompany.id).toBeDefined();
    });

    it('should return the generated company ID', async () => {
      // Arrange
      const input: CreateCompanyInput = {
        name: 'Another Company',
        address: 'Rua Augusta, 500 - São Paulo/SP',
      };

      mockCompanyRepository.save.mockResolvedValue(undefined);

      // Act
      const result = await interactor.execute(input);

      // Assert
      expect(result).toHaveProperty('id');
      expect(typeof result.id).toBe('string');
    });

    it('should propagate errors from repository', async () => {
      // Arrange
      const input: CreateCompanyInput = {
        name: 'Test Company',
        address: 'Test Address',
      };

      const error = new Error('Database connection failed');
      mockCompanyRepository.save.mockRejectedValue(error);

      // Act & Assert
      await expect(interactor.execute(input)).rejects.toThrow(
        'Database connection failed'
      );
    });

    it('should throw CompanyValidationError when name is empty string', async () => {
      // Arrange
      const input: CreateCompanyInput = {
        name: '',
        address: 'Test Address',
      };

      // Act & Assert
      await expect(interactor.execute(input)).rejects.toThrow(
        CompanyValidationError
      );
      await expect(interactor.execute(input)).rejects.toThrow(
        'Company name is required and cannot be empty'
      );
      expect(mockCompanyRepository.save).not.toHaveBeenCalled();
    });

    it('should throw CompanyValidationError when name is only whitespace', async () => {
      // Arrange
      const input: CreateCompanyInput = {
        name: '   ',
        address: 'Test Address',
      };

      // Act & Assert
      await expect(interactor.execute(input)).rejects.toThrow(
        CompanyValidationError
      );
      await expect(interactor.execute(input)).rejects.toThrow(
        'Company name is required and cannot be empty'
      );
      expect(mockCompanyRepository.save).not.toHaveBeenCalled();
    });

    it('should throw CompanyValidationError when address is empty string', async () => {
      // Arrange
      const input: CreateCompanyInput = {
        name: 'Test Company',
        address: '',
      };

      // Act & Assert
      await expect(interactor.execute(input)).rejects.toThrow(
        CompanyValidationError
      );
      await expect(interactor.execute(input)).rejects.toThrow(
        'Company address is required and cannot be empty'
      );
      expect(mockCompanyRepository.save).not.toHaveBeenCalled();
    });

    it('should throw CompanyValidationError when address is only whitespace', async () => {
      // Arrange
      const input: CreateCompanyInput = {
        name: 'Test Company',
        address: '   ',
      };

      // Act & Assert
      await expect(interactor.execute(input)).rejects.toThrow(
        CompanyValidationError
      );
      await expect(interactor.execute(input)).rejects.toThrow(
        'Company address is required and cannot be empty'
      );
      expect(mockCompanyRepository.save).not.toHaveBeenCalled();
    });

    it('should create different companies with unique IDs on multiple calls', async () => {
      // Arrange
      const input: CreateCompanyInput = {
        name: 'Test Company',
        address: 'Test Address',
      };

      mockCompanyRepository.save.mockResolvedValue(undefined);

      // Act
      const result1 = await interactor.execute(input);
      const result2 = await interactor.execute(input);

      // Assert
      expect(result1.id).not.toBe(result2.id);
      expect(mockCompanyRepository.save).toHaveBeenCalledTimes(2);
    });
  });
});
