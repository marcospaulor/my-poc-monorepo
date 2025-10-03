import { Company, CompanyRepository } from '@my-poc-monorepo/domain/companies';

export class InMemoryCompanyRepository implements CompanyRepository {
  private companies: Company[] = [];

  async save(company: Company): Promise<void> {
    this.companies.push(company);
  }

  async findById(id: string): Promise<Company | null> {
    const company = this.companies.find((c) => c.id === id);
    return company || null;
  }

  async findByIdOrThrow(id: string): Promise<Company> {
    const company = await this.findById(id);
    if (!company) {
      throw new Error('Company not found');
    }
    return company;
  }
}
