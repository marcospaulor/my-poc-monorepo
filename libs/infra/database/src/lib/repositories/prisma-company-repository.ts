import { Company, CompanyRepository } from '@my-poc-monorepo/domain/companies';
import { PrismaService } from '../prisma.service';

export class PrismaCompanyRepository implements CompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(company: Company): Promise<void> {
    await this.prisma.company.upsert({
      where: { id: company.id.value },
      create: {
        id: company.id.value,
        name: company.name,
        address: company.address,
        createdAt: company.createdAt,
      },
      update: {
        name: company.name,
        address: company.address,
      },
    });
  }

  async findById(id: string): Promise<Company | null> {
    const companyData = await this.prisma.company.findUnique({
      where: { id },
    });
    if (!companyData) {
      return null;
    }

    return await Company.restore({
      id: companyData.id,
      name: companyData.name,
      address: companyData.address,
      createdAt: companyData.createdAt,
    });
  }

  async findAll(): Promise<Company[]> {
    const companies = await this.prisma.company.findMany();
    return await Promise.all(
      companies.map((companyData) =>
        Company.restore({
          id: companyData.id,
          name: companyData.name,
          address: companyData.address,
          createdAt: companyData.createdAt,
        })
      )
    );
  }
}
