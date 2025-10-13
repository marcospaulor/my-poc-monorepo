import { RequiredValidator } from './required.validator';
import {
  EmptyStringError,
  StringValidationError,
} from '@my-poc-monorepo/domain-errors';

describe('RequiredValidator', () => {
  let validator: RequiredValidator;

  beforeEach(() => {
    validator = new RequiredValidator();
  });

  describe('doValidate', () => {
    it('should pass validation for valid non-empty string', () => {
      expect(() => validator.validate('Valid string')).not.toThrow();
    });

    it('should pass validation for string with spaces and content', () => {
      expect(() => validator.validate('  Valid string  ')).not.toThrow();
    });

    it('should throw error for null', () => {
      expect(() => validator.validate(null as unknown as string)).toThrow(
        StringValidationError
      );
      expect(() => validator.validate(null as unknown as string)).toThrow(
        'O campo é obrigatório e não pode ser nulo'
      );
    });

    it('should throw error for undefined', () => {
      expect(() => validator.validate(undefined as unknown as string)).toThrow(
        StringValidationError
      );
      expect(() => validator.validate(undefined as unknown as string)).toThrow(
        'O campo é obrigatório e não pode ser nulo'
      );
    });

    it('should throw error for non-string types', () => {
      expect(() => validator.validate(123 as unknown as string)).toThrow(
        StringValidationError
      );
      expect(() => validator.validate(123 as unknown as string)).toThrow(
        'O valor deve ser uma string'
      );
    });

    it('should throw EmptyStringError for empty string', () => {
      expect(() => validator.validate('')).toThrow(EmptyStringError);
    });

    it('should throw EmptyStringError for string with only spaces', () => {
      expect(() => validator.validate('   ')).toThrow(EmptyStringError);
    });

    it('should throw EmptyStringError for string with tabs', () => {
      expect(() => validator.validate('\t\t\t')).toThrow(EmptyStringError);
    });

    it('should throw EmptyStringError for string with newlines', () => {
      expect(() => validator.validate('\n\n\n')).toThrow(EmptyStringError);
    });
  });

  describe('chain of responsibility', () => {
    it('should call next validator in chain if validation passes', () => {
      const nextValidator = {
        validate: jest.fn(),
        setNext: jest.fn(),
      };

      validator.setNext(nextValidator);
      validator.validate('Valid string');

      expect(nextValidator.validate).toHaveBeenCalledWith('Valid string');
    });

    it('should not call next validator if validation fails', () => {
      const nextValidator = {
        validate: jest.fn(),
        setNext: jest.fn(),
      };

      validator.setNext(nextValidator);

      expect(() => validator.validate('')).toThrow(EmptyStringError);
      expect(nextValidator.validate).not.toHaveBeenCalled();
    });
  });
});
