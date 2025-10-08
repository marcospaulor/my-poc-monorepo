import { GetCompanyByIdInteractor } from './get-company-by-id.interactor';
import { CompanyRepository } from '../../contracts/company.repository';
import { Company } from '../../entities/company.entity';
import { CompanyNotFoundError } from '../../entities/company.errors';

describe('GetCompanyByIdInteractor', () => {
  let interactor: GetCompanyByIdInteractor;
  let mockCompanyRepository: jest.Mocked<CompanyRepository>;
  const mockCompany = Company.restore({
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Company',
    address: 'Rua das Flores, 123 - São Paulo/SP',
  });

  beforeEach(() => {
    mockCompanyRepository = {
      save: jest.fn(),
      findById: jest.fn(),
    };
    mockCompanyRepository.findById.mockResolvedValue(mockCompany); // TODO: trocar por um fake repository

    interactor = new GetCompanyByIdInteractor(mockCompanyRepository);
  });

  it('should return company data when company exists', async () => {
    const result = await interactor.execute(mockCompany.id);
    expect(result).toEqual(mockCompany);
  });

  it('should throw CompanyNotFoundError when company does not exist', async () => {
    mockCompanyRepository.findById.mockResolvedValue(null);
    await expect(interactor.execute('non-existent-id')).rejects.toThrow(
      CompanyNotFoundError
    );
  });

  it('should propagate errors from repository', async () => {
    const databaseError = new Error('Database connection failed');
    mockCompanyRepository.findById.mockRejectedValue(databaseError);
    await expect(interactor.execute('any-id')).rejects.toThrow(databaseError);
  });
});
