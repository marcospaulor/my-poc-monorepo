import { BaseError } from '../base.error';
import { BusinessRuleError } from '../domain.error';
import { ErrorResponse } from './error-handler.interface';
import { AbstractErrorHandler } from './base-error.handler';

export class BusinessRuleErrorHandler extends AbstractErrorHandler {
  protected doHandle(error: BaseError): ErrorResponse | null {
    if (error instanceof BusinessRuleError) {
      return this.createResponse(error, 422);
    }
    return null;
  }
}
