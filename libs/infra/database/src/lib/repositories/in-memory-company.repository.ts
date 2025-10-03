import { Company, CompanyRepository } from '@my-poc-monorepo/domain/companies';
import { getDatabase } from '../in-memory-database';

export class InMemoryCompanyRepository implements CompanyRepository {
  private db = getDatabase();

  async save(company: Company): Promise<void> {
    this.db.saveCompany(company);
  }

  async findById(id: string): Promise<Company | null> {
    return this.db.findCompanyById(id);
  }

  async findByIdOrThrow(id: string): Promise<Company> {
    const company = await this.findById(id);
    if (!company) {
      throw new Error('Company not found');
    }
    return company;
  }

  async findAll(): Promise<Company[]> {
    return this.db.findAllCompanies();
  }

  async delete(id: string): Promise<boolean> {
    return this.db.deleteCompany(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.db.companyExists(id);
  }

  async count(): Promise<number> {
    return this.db.countCompanies();
  }
}
