import { faker } from '@faker-js/faker';
import { DateService } from '@my-poc-monorepo/date';
import { Company } from '../entities/company.entity';

export class CompanyFactory {
  static async create(overrides?: {
    id?: string;
    name?: string;
    address?: string;
    createdAt?: Date;
  }): Promise<Company> {
    return await Company.restore({
      id: overrides?.id ?? faker.string.uuid(),
      name: overrides?.name ?? faker.company.name(),
      address: overrides?.address ?? faker.location.streetAddress(true),
      createdAt: overrides?.createdAt ?? DateService.now(),
    });
  }

  static async createNew(overrides?: {
    name?: string;
    address?: string;
  }): Promise<Company> {
    return await Company.create({
      name: overrides?.name ?? faker.company.name(),
      address: overrides?.address ?? faker.location.streetAddress(true),
    });
  }
}
