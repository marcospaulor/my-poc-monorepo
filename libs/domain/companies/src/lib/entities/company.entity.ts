import { randomUUID } from 'crypto';
import { CompanyId } from '../value-objects/company-id.value-object';
import { CompanyName } from '../value-objects/company-name.value-object';
import { CompanyAddress } from '../value-objects/company-address.value-object';

export class Company {
  public readonly id: CompanyId;
  private _name: CompanyName;
  private _address: CompanyAddress;

  private constructor(
    id: CompanyId,
    name: CompanyName,
    address: CompanyAddress
  ) {
    this.id = id;
    this._name = name;
    this._address = address;
  }

  static create(params: { name: string; address: string }): Company {
    const id = new CompanyId(randomUUID());
    const name = new CompanyName(params.name);
    const address = new CompanyAddress(params.address);
    return new Company(id, name, address);
  }

  static restore(params: {
    id: string;
    name: string;
    address: string;
  }): Company {
    const id = new CompanyId(params.id);
    const name = new CompanyName(params.name);
    const address = new CompanyAddress(params.address);
    return new Company(id, name, address);
  }

  get name(): string {
    return this._name.value;
  }

  get address(): string {
    return this._address.value;
  }
}
