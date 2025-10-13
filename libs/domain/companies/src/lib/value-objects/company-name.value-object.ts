import { SafeString } from '@my-poc-monorepo/safe-string';
import {
  EmptyStringError,
  StringTooShortError,
  StringTooLongError,
} from '@my-poc-monorepo/domain-errors';

export class CompanyName {
  private readonly _value: string;
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 255;
  private static readonly FIELD_NAME = 'name';

  static create(value: string): CompanyName {
    return new CompanyName(value);
  }

  constructor(value: string) {
    const trimmedValue = value?.trim() || '';
    this.validate(trimmedValue);
    const safe = SafeString.create(trimmedValue);
    this._value = safe.getValue();
  }

  private validate(value: string): void {
    if (value.length === 0) {
      throw new EmptyStringError({ field: CompanyName.FIELD_NAME });
    }

    if (value.length < CompanyName.MIN_LENGTH) {
      throw new StringTooShortError(CompanyName.MIN_LENGTH, value.length, {
        field: CompanyName.FIELD_NAME,
      });
    }

    if (value.length > CompanyName.MAX_LENGTH) {
      throw new StringTooLongError(CompanyName.MAX_LENGTH, value.length, {
        field: CompanyName.FIELD_NAME,
      });
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
