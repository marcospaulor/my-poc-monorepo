import { Company, CompanyRepository } from '@my-poc-monorepo/domain/companies';
import { PrismaCompanyRepository } from './prisma-company-repository';
import { InMemoryCompanyRepository } from './in-memory-company.repository';
import { PrismaService } from '../prisma.service';
import { InMemoryDatabase } from '../in-memory-database';

/**
 * Testes de contrato para CompanyRepository.
 * Estes testes garantem que todas as implementações de CompanyRepository
 * seguem o mesmo comportamento esperado.
 */
describe.each([
  {
    name: 'InMemoryCompanyRepository',
    setup: async () => {
      InMemoryDatabase.clear();
      return new InMemoryCompanyRepository();
    },
    teardown: async () => {
      // Nothing to teardown for in-memory repository
    },
  },
  {
    name: 'PrismaCompanyRepository',
    setup: async () => {
      const prismaService = PrismaService.getInstance();
      await prismaService.$connect();
      await prismaService.company.deleteMany({});
      return new PrismaCompanyRepository(prismaService);
    },
    teardown: async () => {
      const prismaService = PrismaService.getInstance();
      await prismaService.company.deleteMany({});
      await prismaService.$disconnect();
    },
  },
])('CompanyRepository Contract Tests - $name', ({ setup, teardown }) => {
  let repository: CompanyRepository;

  beforeEach(async () => {
    repository = await setup();
  });

  afterAll(async () => {
    await teardown();
  });

  it('should save and retrieve a valid company', async () => {
    const company = await Company.create({
      name: 'Test Company',
      address: '123 Main Street',
    });
    await repository.save(company);
    const savedCompany = await repository.findById(company.id.value);
    if (!savedCompany) throw new Error('Company not found after save');
    expect(savedCompany).toBeInstanceOf(Company);
    expect(savedCompany.id.value).toEqual(company.id.value);
    expect(savedCompany.name).toEqual(company.name);
    expect(savedCompany.address).toEqual(company.address);
  });

  it('should return null when company not found', async () => {
    const result = await repository.findById('non-existent-id');
    expect(result).toBeNull();
  });
});
