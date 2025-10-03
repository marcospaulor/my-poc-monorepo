export class CompanyNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = CompanyNotFoundError.name;
  }
  static withId(id: string) {
    return new CompanyNotFoundError(`Company with ID ${id} not found`);
  }
}
