import { ArgumentsHost } from '@nestjs/common';
import { DomainExceptionFilter } from './domain-exception.filter';
import {
  ValidationError,
  ValidationErrors,
  NotFoundError,
  StringTooShortError,
  EmptyStringError,
} from '@my-poc-monorepo/domain-errors';

describe('DomainExceptionFilter', () => {
  let filter: DomainExceptionFilter;
  let mockHost: ArgumentsHost;
  let mockResponse: {
    status: jest.Mock;
    json: jest.Mock;
  };
  let mockRequest: {
    url: string;
    method: string;
  };

  beforeEach(async () => {
    filter = new DomainExceptionFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      url: '/api/companies',
      method: 'POST',
    };

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;
  });

  describe('ValidationError handling', () => {
    it('should handle EmptyStringError with 400 status', () => {
      const error = new EmptyStringError({ field: 'name' });

      filter.catch(error, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: expect.any(String),
          code: expect.any(String),
          timestamp: expect.any(String),
          path: '/api/companies',
          method: 'POST',
          context: expect.objectContaining({
            field: 'name',
          }),
        })
      );
    });

    it('should handle StringTooShortError with 400 status', () => {
      const error = new StringTooShortError(2, 1, { field: 'name' });

      filter.catch(error, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          code: expect.any(String),
        })
      );
    });
  });

  describe('ValidationErrors (multiple) handling', () => {
    it('should handle multiple validation errors with errors array', () => {
      const errors = ValidationErrors.fromErrors([
        { field: 'name', error: new EmptyStringError({ field: 'name' }) },
        {
          field: 'address',
          error: new StringTooShortError(5, 3, { field: 'address' }),
        },
      ]);

      filter.catch(errors, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: expect.stringContaining('name'),
          code: 'VALIDATION_ERRORS',
          errors: expect.arrayContaining([
            expect.objectContaining({
              field: 'name',
              message: expect.any(String),
              code: expect.any(String),
            }),
            expect.objectContaining({
              field: 'address',
              message: expect.any(String),
              code: expect.any(String),
            }),
          ]),
        })
      );
    });

    it('should include all error details in response', () => {
      const errors = ValidationErrors.fromErrors([
        { field: 'name', error: new EmptyStringError({ field: 'name' }) },
      ]);

      filter.catch(errors, mockHost);

      const jsonCall = mockResponse.json.mock.calls[0][0];
      expect(jsonCall).toHaveProperty('errors');
      expect(Array.isArray(jsonCall.errors)).toBe(true);
      expect(jsonCall.errors.length).toBe(1);
      expect(jsonCall.errors[0]).toHaveProperty('field', 'name');
      expect(jsonCall.errors[0]).toHaveProperty('message');
      expect(jsonCall.errors[0]).toHaveProperty('code');
    });
  });

  describe('NotFoundError handling', () => {
    it('should handle NotFoundError with 404 status', () => {
      class CompanyNotFoundError extends NotFoundError {
        constructor(id: string) {
          super(`Company with id ${id} not found`, { companyId: id });
        }
      }

      const error = new CompanyNotFoundError(
        '123e4567-e89b-12d3-a456-426614174000'
      );
      mockRequest.url = '/api/companies/123e4567-e89b-12d3-a456-426614174000';
      mockRequest.method = 'GET';

      filter.catch(error, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
          message: expect.stringContaining('not found'),
          context: expect.objectContaining({
            companyId: '123e4567-e89b-12d3-a456-426614174000',
          }),
        })
      );
    });
  });

  describe('Error response structure', () => {
    it('should always include required fields', () => {
      const error = new ValidationError('Test error');

      filter.catch(error, mockHost);

      const jsonCall = mockResponse.json.mock.calls[0][0];
      expect(jsonCall).toHaveProperty('statusCode');
      expect(jsonCall).toHaveProperty('message');
      expect(jsonCall).toHaveProperty('code');
      expect(jsonCall).toHaveProperty('timestamp');
      expect(jsonCall).toHaveProperty('path');
      expect(jsonCall).toHaveProperty('method');
      expect(jsonCall).toHaveProperty('context');
    });

    it('should format timestamp as ISO 8601', () => {
      const error = new ValidationError('Test error');

      filter.catch(error, mockHost);

      const jsonCall = mockResponse.json.mock.calls[0][0];
      expect(jsonCall.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
    });

    it('should include request path and method', () => {
      const error = new ValidationError('Test error');
      mockRequest.url = '/api/test';
      mockRequest.method = 'PUT';

      filter.catch(error, mockHost);

      const jsonCall = mockResponse.json.mock.calls[0][0];
      expect(jsonCall.path).toBe('/api/test');
      expect(jsonCall.method).toBe('PUT');
    });
  });

  describe('Chain of Responsibility integration', () => {
    it('should use error handler chain to determine status code', () => {
      const validationError = new ValidationError('Validation failed');
      filter.catch(validationError, mockHost);
      expect(mockResponse.status).toHaveBeenCalledWith(400);

      const notFoundError = new NotFoundError('Not found');
      filter.catch(notFoundError, mockHost);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it('should preserve error code from domain error', () => {
      const error = new EmptyStringError({ field: 'test' });

      filter.catch(error, mockHost);

      const jsonCall = mockResponse.json.mock.calls[0][0];
      expect(jsonCall.code).toBe(error.code);
    });

    it('should preserve error context from domain error', () => {
      const error = new StringTooShortError(5, 2, {
        field: 'name',
        userId: '123',
      });

      filter.catch(error, mockHost);

      const jsonCall = mockResponse.json.mock.calls[0][0];
      expect(jsonCall.context).toMatchObject({
        field: 'name',
        userId: '123',
        minLength: 5,
        actualLength: 2,
      });
    });
  });
});
