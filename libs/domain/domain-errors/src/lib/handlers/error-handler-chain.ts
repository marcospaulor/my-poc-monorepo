import { BaseError } from '../base.error';
import { ErrorHandler, ErrorResponse } from './error-handler.interface';
import { NotFoundErrorHandler } from './not-found-error.handler';
import { ValidationErrorHandler } from './validation-error.handler';
import { ValidationErrorsHandler } from './validation-errors.handler';
import { BusinessRuleErrorHandler } from './business-rule-error.handler';
import { DefaultErrorHandler } from './default-error.handler';

export class ErrorHandlerChain {
  private readonly chain: ErrorHandler;

  private constructor(chain: ErrorHandler) {
    this.chain = chain;
  }

  static create(): ErrorHandlerChain {
    const notFoundHandler = new NotFoundErrorHandler();
    const validationErrorsHandler = new ValidationErrorsHandler();
    const validationHandler = new ValidationErrorHandler();
    const businessRuleHandler = new BusinessRuleErrorHandler();
    const defaultHandler = new DefaultErrorHandler();

    // Monta a cadeia: NotFound -> ValidationErrors -> Validation -> BusinessRule -> Default
    notFoundHandler
      .setNext(validationErrorsHandler)
      .setNext(validationHandler)
      .setNext(businessRuleHandler)
      .setNext(defaultHandler);

    return new ErrorHandlerChain(notFoundHandler);
  }

  /**
   * Cria uma cadeia customizada com handlers específicos
   * Útil para casos especiais ou testes
   */
  static createCustom(firstHandler: ErrorHandler): ErrorHandlerChain {
    return new ErrorHandlerChain(firstHandler);
  }

  /**
   * Processa um erro de domínio através da cadeia de handlers
   * @param error - Erro de domínio a ser processado
   * @returns ErrorResponse com statusCode e informações formatadas
   */
  handle(error: BaseError): ErrorResponse {
    const response = this.chain.handle(error);

    // A cadeia sempre deve retornar uma resposta graças ao DefaultHandler
    if (!response) {
      // Fallback de segurança (nunca deve acontecer se DefaultHandler estiver na cadeia)
      return {
        statusCode: 500,
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
      };
    }

    return response;
  }
}
