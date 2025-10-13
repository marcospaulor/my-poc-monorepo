import { CompanyValidationError } from '../entities/company.errors';

export class CompanyId {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value;
  }

  private validate(value: string): void {
    if (!value || value.trim() === '') {
      throw CompanyValidationError.invalidId();
    }
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw CompanyValidationError.invalidId();
    }
  }

  get value(): string {
    return this._value;
  }
}
