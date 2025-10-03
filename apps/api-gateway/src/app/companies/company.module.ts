import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import {
  CompanyRepository,
  CreateCompanyInteractor,
  GetCompanyByIdInteractor,
} from '@my-poc-monorepo/domain/companies';
import { RepositoriesFactory } from '@my-poc-monorepo/infra-database';

@Module({
  controllers: [CompanyController],
  providers: [
    {
      provide: 'CompanyRepository',
      useFactory: () => RepositoriesFactory.getCompanyRepository(),
    },
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
