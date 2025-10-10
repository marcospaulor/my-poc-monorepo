import { XssDetectedError } from '@my-poc-monorepo/domain-errors';
import { AbstractStringValidator } from './string-validator.interface';

export class XssDetectionValidator extends AbstractStringValidator {
  private static readonly DANGEROUS_PATTERNS = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /<style[\s\S]*?>[\s\S]*?<\/style>/gi,
    /<iframe[\s\S]*?>/gi,
    /on\w+\s*=\s*["'][^"']*["']/gi,
    /javascript:\s*/gi,
    /<object[\s\S]*?>/gi,
    /<embed[\s\S]*?>/gi,
  ];

  protected doValidate(input: string): void {
    for (const pattern of XssDetectionValidator.DANGEROUS_PATTERNS) {
      const match = input.match(pattern);
      if (match) {
        throw new XssDetectedError(match[0]);
      }
    }
  }
}
