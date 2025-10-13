import { BaseError } from '../base.error';
import { BusinessRuleError } from '../domain.error';
import { ErrorResponse } from './error-handler.interface';
import { AbstractErrorHandler } from './base-error.handler';

/**
 * Handler para erros de regra de negócio
 * Mapeia BusinessRuleError para HTTP 422 (Unprocessable Entity)
 *
 * HTTP 422 indica que a requisição está bem formada, mas não pode ser processada
 * devido a erros semânticos ou de regras de negócio
 */
export class BusinessRuleErrorHandler extends AbstractErrorHandler {
  protected doHandle(error: BaseError): ErrorResponse | null {
    if (error instanceof BusinessRuleError) {
      return this.createResponse(error, 422);
    }
    return null;
  }
}
