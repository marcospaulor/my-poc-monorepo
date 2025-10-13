import { ErrorHandlerChain } from './error-handler-chain';
import {
  DomainError,
  NotFoundError,
  ValidationError,
  BusinessRuleError,
} from '../domain.error';
import { BaseError } from '../base.error';

describe('ErrorHandlerChain', () => {
  let chain: ErrorHandlerChain;

  beforeEach(() => {
    chain = ErrorHandlerChain.create();
  });

  describe('NotFoundError handling', () => {
    it('should map NotFoundError to 404', () => {
      const error = new NotFoundError('Resource not found');
      const response = chain.handle(error);

      expect(response.statusCode).toBe(404);
      expect(response.code).toBe('NOT_FOUND');
      expect(response.message).toBe('Resource not found');
      expect(response.timestamp).toBeDefined();
    });

    it('should map extended NotFoundError to 404', () => {
      // Simula um erro específico que estenderia NotFoundError
      class UserNotFoundError extends NotFoundError {
        constructor(userId: string) {
          super(`User with id ${userId} not found`, { userId });
        }
      }

      const error = new UserNotFoundError('123');
      const response = chain.handle(error);

      expect(response.statusCode).toBe(404);
      expect(response.message).toContain('User with id 123 not found');
      expect(response.context).toHaveProperty('userId', '123');
    });
  });

  describe('ValidationError handling', () => {
    it('should map ValidationError to 400', () => {
      const error = new ValidationError('Invalid input');
      const response = chain.handle(error);

      expect(response.statusCode).toBe(400);
      expect(response.code).toBe('VALIDATION_ERROR');
      expect(response.message).toBe('Invalid input');
    });

    it('should include context in response', () => {
      const error = new ValidationError('Invalid email', {
        field: 'email',
        value: 'invalid-email',
      });
      const response = chain.handle(error);

      expect(response.statusCode).toBe(400);
      expect(response.context).toHaveProperty('field', 'email');
      expect(response.context).toHaveProperty('value', 'invalid-email');
    });
  });

  describe('BusinessRuleError handling', () => {
    it('should map BusinessRuleError to 422', () => {
      const error = new BusinessRuleError(
        'Cannot delete active company',
        'COMPANY_IS_ACTIVE'
      );
      const response = chain.handle(error);

      expect(response.statusCode).toBe(422);
      expect(response.code).toBe('COMPANY_IS_ACTIVE');
      expect(response.message).toBe('Cannot delete active company');
    });

    it('should preserve error context', () => {
      const error = new BusinessRuleError(
        'Insufficient balance',
        'INSUFFICIENT_BALANCE',
        {
          balance: 100,
          required: 500,
        }
      );
      const response = chain.handle(error);

      expect(response.statusCode).toBe(422);
      expect(response.context).toHaveProperty('balance', 100);
      expect(response.context).toHaveProperty('required', 500);
    });
  });

  describe('Generic DomainError handling', () => {
    it('should map generic DomainError to 500', () => {
      const error = new DomainError('Something went wrong', 'GENERIC_ERROR');
      const response = chain.handle(error);

      expect(response.statusCode).toBe(500);
      expect(response.code).toBe('GENERIC_ERROR');
      expect(response.message).toBe('Something went wrong');
    });
  });

  describe('Unknown error handling', () => {
    it('should map unknown BaseError to 500', () => {
      class CustomError extends BaseError {
        constructor() {
          super('Custom error', 'CUSTOM_ERROR');
        }
      }

      const error = new CustomError();
      const response = chain.handle(error);

      expect(response.statusCode).toBe(500);
      expect(response.code).toBe('CUSTOM_ERROR');
      expect(response.message).toBe('Custom error');
    });
  });

  describe('Error hierarchy precedence', () => {
    it('should handle ValidationError as 400 even though it extends BusinessRuleError', () => {
      // ValidationError extends BusinessRuleError, mas deve ser tratado como 400
      const error = new ValidationError('Invalid data');
      const response = chain.handle(error);

      // Como ValidationError vem antes na cadeia, deve ser 400, não 422
      expect(response.statusCode).toBe(400);
    });
  });

  describe('Response structure', () => {
    it('should include all required fields in response', () => {
      const error = new NotFoundError('Not found', {
        userId: 'user-123',
        traceId: 'trace-456',
      });
      const response = chain.handle(error);

      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('code');
      expect(response).toHaveProperty('message');
      expect(response).toHaveProperty('timestamp');
      expect(response).toHaveProperty('context');
      expect(response.context).toHaveProperty('userId', 'user-123');
      expect(response.context).toHaveProperty('traceId', 'trace-456');
    });

    it('should handle errors without context', () => {
      const error = new NotFoundError('Not found');
      const response = chain.handle(error);

      expect(response.statusCode).toBe(404);
      expect(response.context).toBeDefined();
    });
  });
});
