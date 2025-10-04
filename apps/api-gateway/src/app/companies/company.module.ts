import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import {
  CompanyRepository,
  CreateCompanyInteractor,
  GetCompanyByIdInteractor,
} from '@my-poc-monorepo/domain/companies';
import { RepositoriesFactory } from '@my-poc-monorepo/infra-database';

RepositoriesFactory.configure(
  process.env.REPOSITORY_TYPE === 'test' ? 'in-memory' : 'prisma'
);

@Module({
  controllers: [CompanyController],
  providers: [
    {
      provide: 'CompanyRepository',
      useFactory: () => RepositoriesFactory.getCompanyRepository(),
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
  ],
})
export class CompanyModule {}
