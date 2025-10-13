import { BaseError } from '../base.error';
import { ErrorHandler, ErrorResponse } from './error-handler.interface';

export abstract class AbstractErrorHandler implements ErrorHandler {
  private nextHandler: ErrorHandler | null = null;
  setNext(handler: ErrorHandler): ErrorHandler {
    this.nextHandler = handler;
    return handler;
  }

  handle(error: BaseError): ErrorResponse | null {
    const response = this.doHandle(error);
    if (response) {
      return response;
    }
    if (this.nextHandler) {
      return this.nextHandler.handle(error);
    }
    return null;
  }

  protected abstract doHandle(error: BaseError): ErrorResponse | null;

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
