abstract class DomainError extends Error {
  protected _code: string;
  protected _details: Record<string, unknown> = {};

  constructor(message: string, code = 'DOMAIN_ERROR') {
    super(message);
    this.name = DomainError.name;
    this._code = code;
  }

  get code() {
    return this._code;
  }

  get details() {
    return this._details;
  }
}

class NotFoundError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = NotFoundError.name;
    this._code = 'NOT_FOUND';
  }
}

class DomainValidationError extends DomainError {}

export class CompanyNotFoundError extends NotFoundError {
  constructor(message: string) {
    super(message);
    this.name = CompanyNotFoundError.name;
  }
  static withId(id: string) {
    return new CompanyNotFoundError(`Company with ID ${id} not found`);
  }
}

class InvalidCompanyName extends DomainValidationError {}

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

  static invalidId() {
    return new CompanyValidationError(
      'Company ID is required and must be a valid UUID'
    );
  }
}
