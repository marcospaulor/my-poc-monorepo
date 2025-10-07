import { Company } from '@my-poc-monorepo/domain/companies';

export class InMemoryDatabase {
  private static companies: Map<string, Company> = new Map();

  saveCompany(company: Company): void {
    InMemoryDatabase.companies.set(company.id, company);
  }

  findCompanyById(id: string): Company | null {
    return InMemoryDatabase.companies.get(id) || null;
  }

  findAllCompanies(): Company[] {
    return Array.from(InMemoryDatabase.companies.values());
  }

  static clear(): void {
    InMemoryDatabase.companies.clear();
  }
}
