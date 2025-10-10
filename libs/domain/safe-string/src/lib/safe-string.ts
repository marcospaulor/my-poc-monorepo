import { XssDetectionValidator } from './validators/xss-detection.validator';
import { SqlInjectionDetectionValidator } from './validators/sql-injection-detection.validator';
import { HtmlSanitizer } from './sanitizers/html.sanitizer';
import { SqlSanitizer } from './sanitizers/sql.sanitizer';

export class SafeString {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(input: string): SafeString {
    SafeString.validate(input);
    const sanitizedValue = SafeString.sanitize(input);
    return new SafeString(sanitizedValue);
  }

  private static validate(input: string): void {
    const xssValidator = new XssDetectionValidator();
    const sqlValidator = new SqlInjectionDetectionValidator();

    xssValidator.setNext(sqlValidator);
    xssValidator.validate(input);
  }

  private static sanitize(input: string): string {
    const htmlSanitizer = new HtmlSanitizer();
    const sqlSanitizer = new SqlSanitizer();

    htmlSanitizer.setNext(sqlSanitizer);

    return htmlSanitizer.sanitize(input).value;
  }

  public getValue(): string {
    return this.value;
  }
}
