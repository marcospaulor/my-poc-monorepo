import { Company } from '../../entities/company.entity';
import { CompanyRepository } from '../../contracts/company.repository';
import { CompanyValidationError } from '../../entities/company.errors';
import {
  CreateCompany,
  CreateCompanyInput,
  CreateCompanyOutput,
} from './create-company.use-case';

export class CreateCompanyInteractor implements CreateCompany {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(input: CreateCompanyInput): Promise<CreateCompanyOutput> {
    const { name, address } = input;

    // Validations
    if (!name || name.trim() === '') {
      throw CompanyValidationError.invalidName();
    }

    if (!address || address.trim() === '') {
      throw CompanyValidationError.invalidAddress();
    }

    const company = Company.create(name, address);
    await this.companyRepository.save(company);
    return { id: company.id };
  }
}
