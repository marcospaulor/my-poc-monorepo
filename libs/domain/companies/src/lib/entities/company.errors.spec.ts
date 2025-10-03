import { CompanyNotFoundError, CompanyValidationError } from './company.errors';

describe('Company Errors', () => {
  describe('CompanyNotFoundError', () => {
    it('should create error with custom message', () => {
      // Arrange
      const message = 'Custom error message';

      // Act
      const error = new CompanyNotFoundError(message);

      // Assert
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(CompanyNotFoundError);
      expect(error.message).toBe(message);
      expect(error.name).toBe('CompanyNotFoundError');
    });

    it('should create error with id using withId factory method', () => {
      // Arrange
      const id = '123e4567-e89b-12d3-a456-426614174000';

      // Act
      const error = CompanyNotFoundError.withId(id);

      // Assert
      expect(error).toBeInstanceOf(CompanyNotFoundError);
      expect(error.message).toBe(`Company with ID ${id} not found`);
      expect(error.name).toBe('CompanyNotFoundError');
    });

    it('should create different errors for different IDs', () => {
      // Arrange
      const id1 = 'id-1';
      const id2 = 'id-2';

      // Act
      const error1 = CompanyNotFoundError.withId(id1);
      const error2 = CompanyNotFoundError.withId(id2);

      // Assert
      expect(error1.message).toBe(`Company with ID ${id1} not found`);
      expect(error2.message).toBe(`Company with ID ${id2} not found`);
      expect(error1.message).not.toBe(error2.message);
    });
  });

  describe('CompanyValidationError', () => {
    it('should create error with custom message', () => {
      // Arrange
      const message = 'Custom validation error';

      // Act
      const error = new CompanyValidationError(message);

      // Assert
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(CompanyValidationError);
      expect(error.message).toBe(message);
      expect(error.name).toBe('CompanyValidationError');
    });

    it('should create error for invalid name using invalidName factory method', () => {
      // Act
      const error = CompanyValidationError.invalidName();

      // Assert
      expect(error).toBeInstanceOf(CompanyValidationError);
      expect(error.message).toBe(
        'Company name is required and cannot be empty'
      );
      expect(error.name).toBe('CompanyValidationError');
    });

    it('should create error for invalid address using invalidAddress factory method', () => {
      // Act
      const error = CompanyValidationError.invalidAddress();

      // Assert
      expect(error).toBeInstanceOf(CompanyValidationError);
      expect(error.message).toBe(
        'Company address is required and cannot be empty'
      );
      expect(error.name).toBe('CompanyValidationError');
    });

    it('should create different errors for name and address', () => {
      // Act
      const nameError = CompanyValidationError.invalidName();
      const addressError = CompanyValidationError.invalidAddress();

      // Assert
      expect(nameError.message).not.toBe(addressError.message);
      expect(nameError.message).toContain('name');
      expect(addressError.message).toContain('address');
    });
  });
});
