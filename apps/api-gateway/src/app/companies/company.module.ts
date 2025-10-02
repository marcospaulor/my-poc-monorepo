import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import {
  CompanyRepository,
  CreateCompanyInteractor,
  GetCompanyByIdInteractor,
} from '@my-poc-monorepo/domain/companies';
import { CompaniesInfraModule } from '@my-poc-monorepo/infra/companies';

@Module({
  imports: [CompaniesInfraModule],
  controllers: [CompanyController],
  providers: [
    {
      provide: 'CreateCompanyUseCase',
      useFactory: (companyRepository: CompanyRepository) => {
        return new CreateCompanyInteractor(companyRepository);
      },
      inject: ['CompanyRepository'],
    },
    {
      provide: 'GetCompanyByIdUseCase',
      useFactory: (companyRepository: CompanyRepository) => {
        return new GetCompanyByIdInteractor(companyRepository);
      },
      inject: ['CompanyRepository'],
    },
  ],
})
export class CompanyModule {}
