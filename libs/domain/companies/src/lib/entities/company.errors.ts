export class CompanyNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = CompanyNotFoundError.name;
  }
  static withId(id: string) {
    return new CompanyNotFoundError(`Company with ID ${id} not found`);
  }
}

export class CompanyValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = CompanyValidationError.name;
  }

  static invalidName() {
    return new CompanyValidationError(
      'Company name is required and cannot be empty'
    );
  }

  static invalidAddress() {
    return new CompanyValidationError(
      'Company address is required and cannot be empty'
    );
  }
}
