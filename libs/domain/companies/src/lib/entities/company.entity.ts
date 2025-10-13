import { randomUUID } from 'crypto';
import { DateService } from '@my-poc-monorepo/date';
import { CompanyId } from '../value-objects/company-id.value-object';
import { CompanyName } from '../value-objects/company-name.value-object';
import { CompanyAddress } from '../value-objects/company-address.value-object';
import { ValidationErrors } from '@my-poc-monorepo/domain-errors';

export class Company {
  public readonly id: CompanyId;
  private _name: CompanyName;
  private _address: CompanyAddress;
  private _createdAt: Date;

  private constructor(
    id: CompanyId,
    name: CompanyName,
    address: CompanyAddress,
    createdAt: Date
  ) {
    this.id = id;
    this._name = name;
    this._address = address;
    this._createdAt = createdAt;
  }

  static async create(params: {
    name: string;
    address: string;
  }): Promise<Company> {
    const id = new CompanyId(randomUUID());
    const validationResults = await Promise.allSettled([
      Promise.resolve().then(() => new CompanyName(params.name)),
      Promise.resolve().then(() => new CompanyAddress(params.address)),
    ]);

    const errors: Array<{ field: string; error: Error }> = [];
    if (validationResults[0].status === 'rejected') {
      errors.push({ field: 'name', error: validationResults[0].reason });
    }
    if (validationResults[1].status === 'rejected') {
      errors.push({ field: 'address', error: validationResults[1].reason });
    }

    if (errors.length > 0) {
      throw ValidationErrors.fromErrors(errors);
    }

    const name = (validationResults[0] as PromiseFulfilledResult<CompanyName>).value;
    const address = (validationResults[1] as PromiseFulfilledResult<CompanyAddress>).value;
    const createdAt = DateService.now();

    return new Company(id, name, address, createdAt);
  }

  static async restore(params: {
    id: string;
    name: string;
    address: string;
    createdAt: Date;
  }): Promise<Company> {
    const validationResults = await Promise.allSettled([
      Promise.resolve().then(() => new CompanyId(params.id)),
      Promise.resolve().then(() => new CompanyName(params.name)),
      Promise.resolve().then(() => new CompanyAddress(params.address)),
    ]);

    const errors: Array<{ field: string; error: Error }> = [];
    if (validationResults[0].status === 'rejected') {
      errors.push({ field: 'id', error: validationResults[0].reason });
    }
    if (validationResults[1].status === 'rejected') {
      errors.push({ field: 'name', error: validationResults[1].reason });
    }
    if (validationResults[2].status === 'rejected') {
      errors.push({ field: 'address', error: validationResults[2].reason });
    }

    if (errors.length > 0) {
      throw ValidationErrors.fromErrors(errors);
    }

    const id = (validationResults[0] as PromiseFulfilledResult<CompanyId>).value;
    const name = (validationResults[1] as PromiseFulfilledResult<CompanyName>).value;
    const address = (validationResults[2] as PromiseFulfilledResult<CompanyAddress>).value;

    return new Company(id, name, address, params.createdAt);
  }

  get name(): string {
    return this._name.value;
  }

  get address(): string {
    return this._address.value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get createdAtIso(): string {
    return this._createdAt.toISOString();
  }
}
