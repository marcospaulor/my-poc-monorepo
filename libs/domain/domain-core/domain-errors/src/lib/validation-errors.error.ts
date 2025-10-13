import { BaseError } from './base.error';

export interface ValidationErrorDetail {
  field: string;
  message: string;
  code: string;
}

export class ValidationErrors extends BaseError {
  public readonly errors: ValidationErrorDetail[];

  constructor(message: string, errors: ValidationErrorDetail[]) {
    super(message, 'VALIDATION_ERRORS', { errors });
    this.errors = errors;
  }

  /**
   * Converte um array de erros em uma instância de ValidationErrors.
   * @param errors - Array de objetos com field e error
   */
  static fromErrors(
    errors: Array<{ field: string; error: Error }>
  ): ValidationErrors {
    const errorDetails = errors.map(({ field, error }) => ({
      field,
      message: error.message,
      code: error.name,
    }));

    const message = `Validation failed for fields: ${errors
      .map((e) => e.field)
      .join(', ')}`;
    return new ValidationErrors(message, errorDetails);
  }

  override toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      errors: this.errors,
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}
