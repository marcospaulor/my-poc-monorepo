export interface SanitizationResult {
  value: string;
  modified: boolean;
}

export interface StringSanitizer {
  setNext(sanitizer: StringSanitizer): StringSanitizer;
  sanitize(input: string): SanitizationResult;
}

export abstract class AbstractStringSanitizer implements StringSanitizer {
  private nextSanitizer?: StringSanitizer;

  public setNext(sanitizer: StringSanitizer): StringSanitizer {
    this.nextSanitizer = sanitizer;
    return sanitizer;
  }

  public sanitize(input: string): SanitizationResult {
    const result = this.doSanitize(input);

    if (this.nextSanitizer) {
      const nextResult = this.nextSanitizer.sanitize(result.value);
      return {
        value: nextResult.value,
        modified: result.modified || nextResult.modified,
      };
    }

    return result;
  }

  protected abstract doSanitize(input: string): SanitizationResult;
}
