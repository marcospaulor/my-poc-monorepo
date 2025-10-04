import { Company, CompanyRepository } from '@my-poc-monorepo/domain/companies';
import { PrismaService } from '../prisma.service';

export class PrismaCompanyRepository implements CompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(company: Company): Promise<void> {
    await this.prisma.company.upsert({
      where: { id: company.id },
      create: {
        id: company.id,
        name: company.name,
        address: company.address,
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

    return new Company(companyData.id, companyData.name, companyData.address);
  }
}
