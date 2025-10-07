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
describe('CompanyRepository Contract Tests', () => {
  const repositoryTypes = [
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
  ];

  repositoryTypes.forEach(({ name, setup, teardown }) => {
    describe(`${name}`, () => {
      let repository: CompanyRepository;

      beforeEach(async () => {
        repository = await setup();
      });

      afterAll(async () => {
        await teardown();
      });

      describe('save', () => {
        it('should save a new company', async () => {
          const company = Company.create({
            name: 'Tech Corp',
            address: '123 Main St',
          });

          await repository.save(company);
          const savedCompany = await repository.findById(company.id);

          expect(savedCompany).toBeDefined();
          expect(savedCompany?.id).toBe(company.id);
          expect(savedCompany?.name).toBe('Tech Corp');
          expect(savedCompany?.address).toBe('123 Main St');
        });

        it('should update an existing company', async () => {
          const company = Company.create({
            name: 'Tech Corp',
            address: '123 Main St',
          });
          await repository.save(company);

          const updatedCompany = Company.restore({
            id: company.id,
            name: 'Updated Corp',
            address: '456 New Ave',
          });
          await repository.save(updatedCompany);

          const result = await repository.findById(company.id);
          expect(result?.name).toBe('Updated Corp');
          expect(result?.address).toBe('456 New Ave');
        });
      });

      describe('findById', () => {
        it('should return a company when found', async () => {
          const company = Company.create({
            name: 'Tech Corp',
            address: '123 Main St',
          });
          await repository.save(company);

          const result = await repository.findById(company.id);

          expect(result).toBeDefined();
          expect(result?.id).toBe(company.id);
          expect(result?.name).toBe('Tech Corp');
          expect(result?.address).toBe('123 Main St');
        });

        it('should return null when company not found', async () => {
          const result = await repository.findById('non-existent-id');
          expect(result).toBeNull();
        });

        it('should return a Company instance', async () => {
          const company = Company.create({
            name: 'Tech Corp',
            address: '123 Main St',
          });
          await repository.save(company);

          const result = await repository.findById(company.id);
          expect(result).toBeInstanceOf(Company);
        });
      });
    });
  });
});
