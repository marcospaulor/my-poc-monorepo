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

  it('should return company data when company exists', async () => {
    const companyId = '123e4567-e89b-12d3-a456-426614174000';
    const mockCompany = Company.restore({
      id: companyId,
      name: 'Test Company',
      address: 'Rua das Flores, 123 - São Paulo/SP',
    });

    mockCompanyRepository.findById.mockResolvedValue(mockCompany);

    const result = await interactor.execute(companyId);

    expect(result).toEqual({
      id: companyId,
      name: 'Test Company',
      address: 'Rua das Flores, 123 - São Paulo/SP',
    });
    expect(mockCompanyRepository.findById).toHaveBeenCalledWith(companyId);
  });

  it('should throw CompanyNotFoundError when company does not exist', async () => {
    const companyId = 'non-existent-id';
    mockCompanyRepository.findById.mockResolvedValue(null);

    await expect(interactor.execute(companyId)).rejects.toThrow(
      CompanyNotFoundError
    );
    expect(mockCompanyRepository.findById).toHaveBeenCalledWith(companyId);
  });

  it('should propagate errors from repository', async () => {
    const companyId = 'test-id';
    const error = new Error('Database connection failed');
    mockCompanyRepository.findById.mockRejectedValue(error);

    await expect(interactor.execute(companyId)).rejects.toThrow(
      'Database connection failed'
    );
  });
});
