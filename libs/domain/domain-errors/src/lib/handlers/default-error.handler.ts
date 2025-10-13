import { BaseError } from '../base.error';
import { ErrorResponse } from './error-handler.interface';
import { AbstractErrorHandler } from './base-error.handler';

/**
 * Handler padrão que processa qualquer erro não tratado pelos handlers específicos
 * Sempre retorna uma resposta, garantindo que nenhum erro fique sem tratamento
 * Mapeia erros desconhecidos para HTTP 500 (Internal Server Error)
 */
export class DefaultErrorHandler extends AbstractErrorHandler {
  protected doHandle(error: BaseError): ErrorResponse | null {
    // O handler padrão sempre processa o erro
    return this.createResponse(error, 500);
  }
}
