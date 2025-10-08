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
      mockCompanyRepository.save.mockResolvedValue(undefined); // TODO: trocar por um fake repository

      // Act
      const result = await interactor.execute(input);

      // Assert
      expect(result.id).toBeDefined();

      expect(mockCompanyRepository.save).toHaveBeenCalledTimes(1);
      const savedCompany = mockCompanyRepository.save.mock.calls[0][0];
      expect(savedCompany.name).toBe(input.name);
      expect(savedCompany.address).toBe(input.address);
    });
  });

  describe('error handling', () => {
    it('should propagate errors from repository save', async () => {
      const input = { name: 'Any', address: 'Any' };
      interactor.execute(input);
      await expect(interactor.execute(input)).rejects.toThrow(
        'Company with this ID already exists'
      );
    });

    it('should propagate validation errors from entity creation', async () => {
      const invalidInput = { name: '', address: 'Valid Address' };
      await expect(interactor.execute(invalidInput)).rejects.toThrow(
        'Company name is required and cannot be empty'
      );
      expect(mockCompanyRepository.save).not.toHaveBeenCalled();
    });
  });
});
