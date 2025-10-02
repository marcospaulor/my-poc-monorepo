import { Company, CompanyRepository } from '@my-poc-monorepo/domain/companies';

export class InMemoryCompanyRepository implements CompanyRepository {
  private companies: Company[] = [];

  async save(company: Company): Promise<void> {
    this.companies.push(company);
  }

  async findByIdOrThrow(id: string): Promise<Company> {
    const company = this.companies.find((c) => c.id === id);
    if (!company) {
      throw new Error('Company not found');
    }
    return company;
  }
}
