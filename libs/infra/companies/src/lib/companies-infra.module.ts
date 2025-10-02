import { Module } from '@nestjs/common';
import { InMemoryCompanyRepository } from './repositories/in-memory-company.repository';

@Module({
  providers: [
    {
      provide: 'CompanyRepository',
      useClass: InMemoryCompanyRepository,
    },
  ],
  exports: ['CompanyRepository'],
})
export class CompaniesInfraModule {}
