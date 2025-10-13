import { BaseError } from '../base.error';

/**
 * Resposta HTTP formatada a partir de um erro de domínio
 * Contém informações específicas do protocolo HTTP
 */
export interface ErrorResponse {
  statusCode: number;
  code: string;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

/**
 * Interface para handlers no padrão Chain of Responsibility
 * Cada handler decide se pode processar um erro específico
 * Se não puder, delega para o próximo handler na cadeia
 */
export interface ErrorHandler {
  /**
   * Define o próximo handler na cadeia
   */
  setNext(handler: ErrorHandler): ErrorHandler;

  /**
   * Tenta processar o erro
   * @param error - Erro de domínio a ser processado
   * @returns ErrorResponse se o handler puder processar, null caso contrário
   */
  handle(error: BaseError): ErrorResponse | null;
}
