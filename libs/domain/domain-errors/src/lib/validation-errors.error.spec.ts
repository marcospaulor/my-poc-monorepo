import { ValidationErrors } from './validation-errors.error';
import { ValidationError } from './domain.error';

describe('ValidationErrors', () => {
  describe('fromErrors', () => {
    it('should create ValidationErrors from an array of errors', () => {
      const errors = [
        {
          field: 'name',
          error: new ValidationError('Name is required', { field: 'name' }),
        },
        {
          field: 'address',
          error: new ValidationError('Address is required', {
            field: 'address',
          }),
        },
      ];

      const validationErrors = ValidationErrors.fromErrors(errors);

      expect(validationErrors).toBeInstanceOf(ValidationErrors);
      expect(validationErrors.code).toBe('VALIDATION_ERRORS');
      expect(validationErrors.message).toBe(
        'Validation failed for fields: name, address'
      );
      expect(validationErrors.errors).toHaveLength(2);
      expect(validationErrors.errors).toEqual([
        {
          field: 'name',
          message: 'Name is required',
          code: 'ValidationError',
        },
        {
          field: 'address',
          message: 'Address is required',
          code: 'ValidationError',
        },
      ]);
    });

    it('should create ValidationErrors with a single error', () => {
      const errors = [
        {
          field: 'email',
          error: new ValidationError('Invalid email format', {
            field: 'email',
          }),
        },
      ];

      const validationErrors = ValidationErrors.fromErrors(errors);

      expect(validationErrors.message).toBe(
        'Validation failed for fields: email'
      );
      expect(validationErrors.errors).toHaveLength(1);
      expect(validationErrors.errors[0]).toEqual({
        field: 'email',
        message: 'Invalid email format',
        code: 'ValidationError',
      });
    });
  });

  describe('toJSON', () => {
    it('should serialize to JSON with all error details', () => {
      const errors = [
        {
          field: 'name',
          error: new ValidationError('Name is required', { field: 'name' }),
        },
      ];

      const validationErrors = ValidationErrors.fromErrors(errors);
      const json = validationErrors.toJSON();

      expect(json).toEqual({
        name: 'ValidationErrors',
        message: 'Validation failed for fields: name',
        code: 'VALIDATION_ERRORS',
        errors: [
          {
            field: 'name',
            message: 'Name is required',
            code: 'ValidationError',
          },
        ],
        context: {
          errors: [
            {
              field: 'name',
              message: 'Name is required',
              code: 'ValidationError',
            },
          ],
        },
        timestamp: expect.any(String),
        stack: expect.any(String),
      });
    });
  });

  describe('constructor', () => {
    it('should create instance with custom message and errors array', () => {
      const errorDetails = [
        { field: 'username', message: 'Username taken', code: 'DUPLICATE' },
        { field: 'email', message: 'Email invalid', code: 'INVALID_FORMAT' },
      ];

      const error = new ValidationErrors(
        'Custom validation message',
        errorDetails
      );

      expect(error.message).toBe('Custom validation message');
      expect(error.code).toBe('VALIDATION_ERRORS');
      expect(error.errors).toEqual(errorDetails);
    });
  });
});
