import { BaseError } from '../base.error';
import { ValidationError } from '../domain.error';
import { ErrorResponse } from './error-handler.interface';
import { AbstractErrorHandler } from './base-error.handler';

/**
 * Handler para erros de validação
 * Mapeia ValidationError para HTTP 400 (Bad Request)
 */
export class ValidationErrorHandler extends AbstractErrorHandler {
  protected doHandle(error: BaseError): ErrorResponse | null {
    if (error instanceof ValidationError) {
      return this.createResponse(error, 400);
    }
    return null;
  }
}
