import { Company } from '../../entities/company.entity';
import { CompanyRepository } from '../../contracts/company.repository';
import {
  CreateCompany,
  CreateCompanyInput,
  CreateCompanyOutput,
} from './create-company.use-case';

export class CreateCompanyInteractor implements CreateCompany {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(input: CreateCompanyInput): Promise<CreateCompanyOutput> {
    const { name, address } = input;
    const company = Company.create(name, address);
    await this.companyRepository.save(company);
    return { id: company.id };
  }
}
