import { AbstractStringValidator } from './string-validator.interface';
import {
  EmptyStringError,
  StringValidationError,
} from '@my-poc-monorepo/domain-errors';

export class RequiredValidator extends AbstractStringValidator {
  protected doValidate(input: string): void {
    if (input === null || input === undefined) {
      throw new StringValidationError(
        'O campo é obrigatório e não pode ser nulo'
      );
    }

    if (typeof input !== 'string') {
      throw new StringValidationError('O valor deve ser uma string');
    }

    if (input.trim().length === 0) {
      throw new EmptyStringError();
    }
  }
}
