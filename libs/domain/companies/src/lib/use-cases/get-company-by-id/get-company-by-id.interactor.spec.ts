import { GetCompanyByIdInteractor } from './get-company-by-id.interactor';
import { Company } from '../../entities/company.entity';
import { InMemoryCompanyRepository } from '@my-poc-monorepo/infra-database/testing';

describe('GetCompanyById', () => {
  let interactor: GetCompanyByIdInteractor;
  let repository: InMemoryCompanyRepository;

  beforeEach(() => {
    repository = new InMemoryCompanyRepository();
    interactor = new GetCompanyByIdInteractor(repository);
  });

  afterEach(() => {
    repository.clear();
  });

  it('should save and retrieve company with all data', async () => {
    const company = Company.restore({
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Global Corp',
      address: 'Rua das Flores, 123 - São Paulo/SP',
    });
    await repository.save(company);
    const result = await interactor.execute(company.id.value);
    expect(result).toEqual({
      id: company.id.value,
      name: company.name,
      address: company.address,
    });
  });

  it('should fail when company does not exist', async () => {
    await expect(
      interactor.execute('00000000-0000-0000-0000-000000000000')
    ).rejects.toThrow();
  });
});
