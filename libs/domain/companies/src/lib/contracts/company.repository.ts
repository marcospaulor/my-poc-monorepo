import { Company } from '../entities/company.entity';

export interface CompanyRepository {
  save(company: Company): Promise<void>;
  findById(id: string): Promise<Company | null>;
  findAll(): Promise<Company[]>;
}
