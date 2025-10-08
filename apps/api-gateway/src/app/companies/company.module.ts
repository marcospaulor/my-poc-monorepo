import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import {
  CompanyRepository,
  CreateCompanyInteractor,
  GetCompanyByIdInteractor,
  ListCompaniesInteractor,
} from '@my-poc-monorepo/domain/companies';
import { RepositoriesFactory } from '@my-poc-monorepo/infra-database';

@Module({
  controllers: [CompanyController],
  providers: [
    {
      provide: 'CompanyRepository',
      useFactory: () => {
        RepositoriesFactory.configure(
          process.env.REPOSITORY_TYPE === 'test' ? 'in-memory' : 'prisma'
        );
        return RepositoriesFactory.getCompanyRepository();
      },
    },
    {
      provide: 'CreateCompany',
      useFactory: (companyRepository: CompanyRepository) => {
        return new CreateCompanyInteractor(companyRepository);
      },
      inject: ['CompanyRepository'],
    },
    {
      provide: 'GetCompanyById',
      useFactory: (companyRepository: CompanyRepository) => {
        return new GetCompanyByIdInteractor(companyRepository);
      },
      inject: ['CompanyRepository'],
    },
    {
      provide: 'ListCompanies',
      useFactory: (companyRepository: CompanyRepository) => {
        return new ListCompaniesInteractor(companyRepository);
      },
      inject: ['CompanyRepository'],
    },
  ],
})
export class CompanyModule {}
