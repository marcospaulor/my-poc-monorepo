import { BaseError } from '../base.error';
import { ValidationErrors } from '../validation-errors.error';
import { AbstractErrorHandler } from './base-error.handler';
import { ErrorResponse } from './error-handler.interface';

/**
 * Handler para ValidationErrors (múltiplos erros de validação)
 * Retorna 400 Bad Request com detalhes de todos os campos inválidos
 */
export class ValidationErrorsHandler extends AbstractErrorHandler {
  protected doHandle(error: BaseError): ErrorResponse | null {
    if (!(error instanceof ValidationErrors)) {
      return null;
    }

    const validationErrors = error as ValidationErrors;

    return {
      statusCode: 400,
      code: validationErrors.code,
      message: validationErrors.message,
      timestamp: validationErrors.timestamp,
      context: {
        ...validationErrors.context,
        errors: validationErrors.errors,
      },
    };
  }
}
