import { randomUUID } from 'crypto';

export class Company {
  public readonly id: string;
  private _name: string;
  private _address: string;

  constructor(id: string, name: string, address: string) {
    this.id = id;
    this._name = name;
    this._address = address;
  }

  static create(name: string, address: string): Company {
    const id = randomUUID();
    return new Company(id, name, address);
  }

  get name(): string {
    return this._name;
  }

  get address(): string {
    return this._address;
  }
}
