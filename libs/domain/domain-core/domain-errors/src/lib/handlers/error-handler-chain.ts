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

    notFoundHandler
      .setNext(validationErrorsHandler)
      .setNext(validationHandler)
      .setNext(businessRuleHandler)
      .setNext(defaultHandler);

    return new ErrorHandlerChain(notFoundHandler);
  }

  static createCustom(firstHandler: ErrorHandler): ErrorHandlerChain {
    return new ErrorHandlerChain(firstHandler);
  }

  handle(error: BaseError): ErrorResponse {
    const response = this.chain.handle(error);
    if (!response) {
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
