import { GetCompanyByIdInteractor } from './get-company-by-id.interactor';
import { CompanyRepository } from '../../contracts/company.repository';
import { Company } from '../../entities/company.entity';
import { CompanyNotFoundError } from '../../entities/company.errors';

describe('GetCompanyByIdInteractor', () => {
  let interactor: GetCompanyByIdInteractor;
  let mockCompanyRepository: jest.Mocked<CompanyRepository>;

  beforeEach(() => {
    mockCompanyRepository = {
      save: jest.fn(),
      findById: jest.fn(),
    };

    interactor = new GetCompanyByIdInteractor(mockCompanyRepository);
  });

  describe('execute', () => {
    it('should return company data when company exists', async () => {
      // Arrange
      const companyId = '123e4567-e89b-12d3-a456-426614174000';
      const mockCompany = new Company(
        companyId,
        'Test Company',
        'Rua das Flores, 123 - São Paulo/SP'
      );

      mockCompanyRepository.findById.mockResolvedValue(mockCompany);

      // Act
      const result = await interactor.execute(companyId);

      // Assert
      expect(result).toEqual({
        id: companyId,
        name: 'Test Company',
        address: 'Rua das Flores, 123 - São Paulo/SP',
      });
      expect(mockCompanyRepository.findById).toHaveBeenCalledWith(companyId);
      expect(mockCompanyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw CompanyNotFoundError when company does not exist', async () => {
      // Arrange
      const companyId = 'non-existent-id';
      mockCompanyRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(interactor.execute(companyId)).rejects.toThrow(
        CompanyNotFoundError
      );
      await expect(interactor.execute(companyId)).rejects.toThrow(
        `Company with ID ${companyId} not found`
      );
      expect(mockCompanyRepository.findById).toHaveBeenCalledWith(companyId);
    });

    it('should return complete company information', async () => {
      // Arrange
      const companyId = 'test-id-123';
      const name = 'My Test Company LTDA';
      const address = 'Av. Paulista, 1000 - São Paulo/SP';
      const mockCompany = new Company(companyId, name, address);

      mockCompanyRepository.findById.mockResolvedValue(mockCompany);

      // Act
      const result = await interactor.execute(companyId);

      // Assert
      expect(result.id).toBe(companyId);
      expect(result.name).toBe(name);
      expect(result.address).toBe(address);
      expect(Object.keys(result)).toEqual(['id', 'name', 'address']);
    });

    it('should propagate errors from repository', async () => {
      // Arrange
      const companyId = 'test-id';
      const error = new Error('Database connection failed');
      mockCompanyRepository.findById.mockRejectedValue(error);

      // Act & Assert
      await expect(interactor.execute(companyId)).rejects.toThrow(
        'Database connection failed'
      );
    });

    it('should handle different company IDs correctly', async () => {
      // Arrange
      const companyId1 = 'id-1';
      const companyId2 = 'id-2';
      const company1 = new Company(companyId1, 'Company 1', 'Address 1');
      const company2 = new Company(companyId2, 'Company 2', 'Address 2');

      mockCompanyRepository.findById
        .mockResolvedValueOnce(company1)
        .mockResolvedValueOnce(company2);

      // Act
      const result1 = await interactor.execute(companyId1);
      const result2 = await interactor.execute(companyId2);

      // Assert
      expect(result1.id).toBe(companyId1);
      expect(result1.name).toBe('Company 1');
      expect(result2.id).toBe(companyId2);
      expect(result2.name).toBe('Company 2');
    });

    it('should call repository with exact id parameter', async () => {
      // Arrange
      const companyId = 'exact-id-test';
      const mockCompany = new Company(companyId, 'Test', 'Test Address');
      mockCompanyRepository.findById.mockResolvedValue(mockCompany);

      // Act
      await interactor.execute(companyId);

      // Assert
      expect(mockCompanyRepository.findById).toHaveBeenCalledWith(companyId);
      expect(mockCompanyRepository.findById).not.toHaveBeenCalledWith(
        expect.not.stringContaining(companyId)
      );
    });
  });
});
