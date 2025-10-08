import { ListCompaniesInteractor } from './list-companies.interactor';
import { InMemoryCompanyRepository } from '@my-poc-monorepo/infra-database/testing';
import { Company } from '../../entities/company.entity';

describe('ListCompanies', () => {
  let interactor: ListCompaniesInteractor;
  let repository: InMemoryCompanyRepository;

  beforeEach(() => {
    repository = new InMemoryCompanyRepository();
    interactor = new ListCompaniesInteractor(repository);
  });

  afterEach(() => {
    repository.clear();
  });

  it('should save multiple companies and retrieve all with complete data', async () => {
    const companies = [
      Company.restore({
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Alpha Industries',
        address: '100 First Avenue',
      }),
      Company.restore({
        id: '22222222-2222-2222-2222-222222222222',
        name: 'Beta Solutions',
        address: '200 Second Street',
      }),
      Company.restore({
        id: '33333333-3333-3333-3333-333333333333',
        name: 'Gamma Enterprises',
        address: '300 Third Boulevard',
      }),
    ];
    for (const company of companies) {
      await repository.save(company);
    }
    const result = await interactor.execute();
    expect(result.companies).toHaveLength(3);
    expect(result.companies).toEqual(
      expect.arrayContaining([
        {
          id: '11111111-1111-1111-1111-111111111111',
          name: 'Alpha Industries',
          address: '100 First Avenue',
        },
        {
          id: '22222222-2222-2222-2222-222222222222',
          name: 'Beta Solutions',
          address: '200 Second Street',
        },
        {
          id: '33333333-3333-3333-3333-333333333333',
          name: 'Gamma Enterprises',
          address: '300 Third Boulevard',
        },
      ])
    );
  });
});
