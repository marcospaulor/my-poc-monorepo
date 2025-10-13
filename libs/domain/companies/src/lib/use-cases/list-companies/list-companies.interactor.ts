import { CompanyRepository } from '../../contracts/company.repository';
import { ListCompanies, ListCompaniesOutput } from './list-companies.use-case';

export class ListCompaniesInteractor implements ListCompanies {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(): Promise<ListCompaniesOutput> {
    const companies = await this.companyRepository.findAll();

    return {
      companies: companies.map((company) => ({
        id: company.id.value,
        name: company.name,
        address: company.address,
        createdAt: company.createdAtIso,
      })),
    };
  }
}
