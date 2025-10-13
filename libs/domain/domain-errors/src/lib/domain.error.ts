import { BaseError, ErrorContext } from './base.error';

export class DomainError extends BaseError {
  constructor(message: string, code: string, context: ErrorContext = {}) {
    super(message, code, context);
  }
}

export class BusinessRuleError extends DomainError {
  constructor(message: string, code: string, context: ErrorContext = {}) {
    super(message, code, context);
  }
}

export class ValidationError extends BusinessRuleError {
  constructor(message: string, context: ErrorContext = {}) {
    super(message, 'VALIDATION_ERROR', context);
  }
}
export class NotFoundError extends DomainError {
  constructor(message: string, context: ErrorContext = {}) {
    super(message, 'NOT_FOUND', context);
  }
}
