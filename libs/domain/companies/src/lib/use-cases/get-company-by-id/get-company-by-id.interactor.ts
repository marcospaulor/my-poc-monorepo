import { CompanyRepository } from '../../contracts/company.repository';
import {
  GetCompanyByIdUseCase,
  GetCompanyByIdOutput,
} from './get-company-by-id.use-case';

export class GetCompanyByIdInteractor implements GetCompanyByIdUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(id: string): Promise<GetCompanyByIdOutput> {
    const company = await this.companyRepository.findByIdOrThrow(id);
    return {
      id: company.id,
      name: company.name,
      address: company.address,
    };
  }
}
