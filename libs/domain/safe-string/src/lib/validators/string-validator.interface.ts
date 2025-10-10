export interface StringValidator {
  setNext(validator: StringValidator): StringValidator;
  validate(input: string): void;
}

export abstract class AbstractStringValidator implements StringValidator {
  private nextValidator?: StringValidator;

  public setNext(validator: StringValidator): StringValidator {
    this.nextValidator = validator;
    return validator;
  }

  public validate(input: string): void {
    this.doValidate(input);

    if (this.nextValidator) {
      this.nextValidator.validate(input);
    }
  }

  protected abstract doValidate(input: string): void;
}
