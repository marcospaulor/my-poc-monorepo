import { BaseError } from '../base.error';
import { ErrorHandler, ErrorResponse } from './error-handler.interface';

/**
 * Implementação base abstrata do ErrorHandler
 * Implementa a lógica de encadeamento do padrão Chain of Responsibility
 */
export abstract class AbstractErrorHandler implements ErrorHandler {
  private nextHandler: ErrorHandler | null = null;

  setNext(handler: ErrorHandler): ErrorHandler {
    this.nextHandler = handler;
    return handler;
  }

  handle(error: BaseError): ErrorResponse | null {
    // Tenta processar o erro neste handler
    const response = this.doHandle(error);

    if (response) {
      return response;
    }

    // Se não conseguiu processar, delega para o próximo handler
    if (this.nextHandler) {
      return this.nextHandler.handle(error);
    }

    // Se não há próximo handler, retorna null
    return null;
  }

  /**
   * Método abstrato que cada handler concreto deve implementar
   * Retorna ErrorResponse se puder processar o erro, null caso contrário
   */
  protected abstract doHandle(error: BaseError): ErrorResponse | null;

  /**
   * Helper para criar a resposta de erro padronizada
   */
  protected createResponse(
    error: BaseError,
    statusCode: number
  ): ErrorResponse {
    return {
      statusCode,
      code: error.code,
      message: error.message,
      timestamp: error.timestamp,
      context: error.context,
    };
  }
}
