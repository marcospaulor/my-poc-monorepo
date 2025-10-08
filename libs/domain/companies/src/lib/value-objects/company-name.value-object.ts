import { CompanyValidationError } from '../entities/company.errors';

export class CompanyName {
  private readonly _value: string;
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 255;

  constructor(value: string) {
    this.validate(value);
    this._value = value.trim();
  }

  private validate(value: string): void {
    if (!value || value.trim() === '') {
      throw CompanyValidationError.invalidName();
    }

    const trimmedValue = value.trim();
    if (
      trimmedValue.length < CompanyName.MIN_LENGTH ||
      trimmedValue.length > CompanyName.MAX_LENGTH
    ) {
      throw CompanyValidationError.invalidName();
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: CompanyName): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
