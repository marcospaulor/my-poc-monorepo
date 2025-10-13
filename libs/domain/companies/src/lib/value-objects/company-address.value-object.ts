import { SafeString } from '@my-poc-monorepo/safe-string';
import {
  EmptyStringError,
  StringTooShortError,
  StringTooLongError,
} from '@my-poc-monorepo/domain-errors';

export class CompanyAddress {
  private readonly _value: string;
  private static readonly MIN_LENGTH = 5;
  private static readonly MAX_LENGTH = 500;
  private static readonly FIELD_NAME = 'address';

  constructor(value: string) {
    const trimmedValue = value?.trim() || '';
    this.validate(trimmedValue);
    const safe = SafeString.create(trimmedValue);
    this._value = safe.getValue();
  }

  private validate(value: string): void {
    if (value.length === 0) {
      throw new EmptyStringError({ field: CompanyAddress.FIELD_NAME });
    }

    if (value.length < CompanyAddress.MIN_LENGTH) {
      throw new StringTooShortError(CompanyAddress.MIN_LENGTH, value.length, {
        field: CompanyAddress.FIELD_NAME,
      });
    }

    if (value.length > CompanyAddress.MAX_LENGTH) {
      throw new StringTooLongError(CompanyAddress.MAX_LENGTH, value.length, {
        field: CompanyAddress.FIELD_NAME,
      });
    }
  }

  get value(): string {
    return this._value;
  }
}
