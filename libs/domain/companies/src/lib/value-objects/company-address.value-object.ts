import { CompanyValidationError } from '../entities/company.errors';

export class CompanyAddress {
  private readonly _value: string;
  private static readonly MIN_LENGTH = 5;
  private static readonly MAX_LENGTH = 500;

  constructor(value: string) {
    this.validate(value);
    this._value = value.trim();
  }

  private validate(value: string): void {
    if (!value || value.trim() === '') {
      throw CompanyValidationError.invalidAddress();
    }

    const trimmedValue = value.trim();
    if (
      trimmedValue.length < CompanyAddress.MIN_LENGTH ||
      trimmedValue.length > CompanyAddress.MAX_LENGTH
    ) {
      throw CompanyValidationError.invalidAddress();
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: CompanyAddress): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
