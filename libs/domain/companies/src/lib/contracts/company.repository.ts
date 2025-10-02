import { Company } from '../entities/company.entity';

export interface CompanyRepository {
  save(company: Company): Promise<void>;
  findByIdOrThrow(id: string): Promise<Company>;
}
