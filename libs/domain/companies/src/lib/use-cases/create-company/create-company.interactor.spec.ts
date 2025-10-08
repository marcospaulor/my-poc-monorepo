import { CreateCompanyInteractor } from './create-company.interactor';
import { InMemoryCompanyRepository } from '@my-poc-monorepo/infra-database/testing';

describe('CreateCompany', () => {
  let interactor: CreateCompanyInteractor;
  let repository: InMemoryCompanyRepository;

  beforeEach(() => {
    repository = new InMemoryCompanyRepository();
    interactor = new CreateCompanyInteractor(repository);
  });

  afterEach(() => {
    repository.clear();
  });

  it('should create company and persist with all data', async () => {
    const input = {
      name: 'Tech Solutions Inc',
      address: 'Rua das Flores, 123 - São Paulo/SP',
    };
    const result = await interactor.execute(input);
    expect(result.id).toBeDefined();
    const savedCompany = await repository.findById(result.id);
    expect(savedCompany).toMatchObject({
      name: input.name,
      address: input.address,
    });
  });

  it('should reject invalid data', async () => {
    await expect(
      interactor.execute({ name: '', address: 'Valid Address' })
    ).rejects.toThrow();
    await expect(
      interactor.execute({ name: 'Valid Company', address: '' })
    ).rejects.toThrow();
  });
});
