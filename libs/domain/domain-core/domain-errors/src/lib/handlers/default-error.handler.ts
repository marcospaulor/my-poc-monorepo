import { BaseError } from '../base.error';
import { ErrorResponse } from './error-handler.interface';
import { AbstractErrorHandler } from './base-error.handler';

export class DefaultErrorHandler extends AbstractErrorHandler {
  protected doHandle(error: BaseError): ErrorResponse | null {
    return this.createResponse(error, 500);
  }
}
