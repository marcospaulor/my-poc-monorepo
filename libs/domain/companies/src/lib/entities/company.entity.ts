import { randomUUID } from 'crypto';
import { CompanyValidationError } from './company.errors';

export class Company {
  public readonly id: string;
  private _name: string;
  private _address: string;

  private constructor(id: string, name: string, address: string) {
    if (!name || name.trim() === '') {
      throw CompanyValidationError.invalidName();
    }
    if (!address || address.trim() === '') {
      throw CompanyValidationError.invalidAddress();
    }
    this.id = id;
    this._name = name;
    this._address = address;
  }

  static create(params: { name: string; address: string }): Company {
    const id = randomUUID();
    return new Company(id, params.name, params.address);
  }

  static restore(params: {
    id: string;
    name: string;
    address: string;
  }): Company {
    return new Company(params.id, params.name, params.address);
  }

  get name(): string {
    return this._name;
  }

  get address(): string {
    return this._address;
  }
}
