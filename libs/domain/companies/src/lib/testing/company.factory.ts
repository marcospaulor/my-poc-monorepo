import { faker } from '@faker-js/faker';
import { Company } from '../entities/company.entity';

export class CompanyFactory {
  static create(overrides?: {
    id?: string;
    name?: string;
    address?: string;
  }): Company {
    return Company.restore({
      id: overrides?.id ?? faker.string.uuid(),
      name: overrides?.name ?? faker.company.name(),
      address: overrides?.address ?? faker.location.streetAddress(true),
    });
  }

  static createNew(overrides?: { name?: string; address?: string }): Company {
    return Company.create({
      name: overrides?.name ?? faker.company.name(),
      address: overrides?.address ?? faker.location.streetAddress(true),
    });
  }
}
