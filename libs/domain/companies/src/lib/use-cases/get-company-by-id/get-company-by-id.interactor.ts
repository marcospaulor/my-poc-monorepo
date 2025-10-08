import { CompanyRepository } from '../../contracts/company.repository';
import { CompanyNotFoundError } from '../../entities/company.errors';
import {
  GetCompanyById,
  GetCompanyByIdOutput,
} from './get-company-by-id.use-case';

export class GetCompanyByIdInteractor implements GetCompanyById {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(id: string): Promise<GetCompanyByIdOutput> {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw CompanyNotFoundError.withId(id);
    }
    return {
      id: company.id.value,
      name: company.name,
      address: company.address,
    };
  }
}
