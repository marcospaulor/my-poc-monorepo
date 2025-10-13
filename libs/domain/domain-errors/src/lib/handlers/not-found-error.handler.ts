import { BaseError } from '../base.error';
import { NotFoundError } from '../domain.error';
import { ErrorResponse } from './error-handler.interface';
import { AbstractErrorHandler } from './base-error.handler';

/**
 * Handler para erros de entidade não encontrada
 * Mapeia NotFoundError para HTTP 404
 */
export class NotFoundErrorHandler extends AbstractErrorHandler {
  protected doHandle(error: BaseError): ErrorResponse | null {
    if (error instanceof NotFoundError) {
      return this.createResponse(error, 404);
    }
    return null;
  }
}
