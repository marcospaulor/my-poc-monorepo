import { Company } from '@my-poc-monorepo/domain/companies';
import { PrismaCompanyRepository } from './prisma-company-repository';
import { PrismaService } from '../prisma.service';

describe('PrismaCompanyRepository', () => {
  let repository: PrismaCompanyRepository;
  let prismaService: PrismaService;

  beforeAll(async () => {
    prismaService = PrismaService.getInstance();
    await prismaService.$connect();
  });

  beforeEach(async () => {
    repository = new PrismaCompanyRepository(prismaService);
    // Limpa o banco antes de cada teste
    await prismaService.company.deleteMany({});
  });

  afterAll(async () => {
    // Limpa tudo e desconecta
    await prismaService.company.deleteMany({});
    await prismaService.$disconnect();
  });

  describe('save', () => {
    it('should save a new company', async () => {
      // Arrange
      const company = Company.create('Tech Corp', '123 Main St');

      // Act
      await repository.save(company);

      // Assert
      const savedCompany = await repository.findById(company.id);
      expect(savedCompany).toBeDefined();
      expect(savedCompany?.id).toBe(company.id);
      expect(savedCompany?.name).toBe('Tech Corp');
      expect(savedCompany?.address).toBe('123 Main St');
    });

    it('should update an existing company', async () => {
      // Arrange
      const company = Company.create('Tech Corp', '123 Main St');
      await repository.save(company);

      // Act - Cria uma nova instância com mesmo ID mas dados diferentes
      const updatedCompany = new Company(
        company.id,
        'Updated Corp',
        '456 New Ave'
      );
      await repository.save(updatedCompany);

      // Assert
      const result = await repository.findById(company.id);
      expect(result?.name).toBe('Updated Corp');
      expect(result?.address).toBe('456 New Ave');

      // Verifica que não criou duplicata
      const allCompanies = await prismaService.company.findMany();
      expect(allCompanies).toHaveLength(1);
    });
  });

  describe('findById', () => {
    it('should return a company when found', async () => {
      // Arrange
      const company = Company.create('Tech Corp', '123 Main St');
      await repository.save(company);

      // Act
      const result = await repository.findById(company.id);

      // Assert
      expect(result).toBeDefined();
      expect(result?.id).toBe(company.id);
      expect(result?.name).toBe('Tech Corp');
      expect(result?.address).toBe('123 Main St');
    });

    it('should return null when company not found', async () => {
      // Act
      const result = await repository.findById('non-existent-id');

      // Assert
      expect(result).toBeNull();
    });

    it('should return a Company instance', async () => {
      // Arrange
      const company = Company.create('Tech Corp', '123 Main St');
      await repository.save(company);

      // Act
      const result = await repository.findById(company.id);

      // Assert
      expect(result).toBeInstanceOf(Company);
    });
  });

  describe('integration', () => {
    it('should handle multiple companies', async () => {
      // Arrange
      const company1 = Company.create('Company 1', 'Address 1');
      const company2 = Company.create('Company 2', 'Address 2');
      const company3 = Company.create('Company 3', 'Address 3');

      // Act
      await repository.save(company1);
      await repository.save(company2);
      await repository.save(company3);

      // Assert
      const result1 = await repository.findById(company1.id);
      const result2 = await repository.findById(company2.id);
      const result3 = await repository.findById(company3.id);

      expect(result1?.name).toBe('Company 1');
      expect(result2?.name).toBe('Company 2');
      expect(result3?.name).toBe('Company 3');
    });
  });
});
