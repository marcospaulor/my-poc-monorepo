import { Company, CompanyRepository } from '@my-poc-monorepo/domain/companies';

export class InMemoryCompanyRepository implements CompanyRepository {
  private readonly _companies: Company[] = [];

  async save(company: Company): Promise<void> {
    const existingIndex = this._companies.findIndex((c) => c.id === company.id);
    if (existingIndex >= 0) {
      throw new Error('Company with this ID already exists');
    }
    this._companies.push(company);
  }

  async findById(id: string): Promise<Company | null> {
    return this._companies.find((company) => company.id === id) ?? null;
  }
}
