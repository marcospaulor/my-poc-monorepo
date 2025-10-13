import { SqlInjectionDetectedError } from '@my-poc-monorepo/domain-errors';
import { AbstractStringValidator } from './string-validator.interface';

export class SqlInjectionDetectionValidator extends AbstractStringValidator {
  private static readonly DANGEROUS_PATTERNS = [
    /;\s*(DROP|DELETE|UPDATE|INSERT|CREATE|ALTER|EXEC|EXECUTE)\s+/gi,
    /UNION\s+SELECT/gi,
    /--\s*$/gm,
    /\/\*[\s\S]*?\*\//g,
    /';\s*--/gi,
  ];

  protected doValidate(input: string): void {
    for (const pattern of SqlInjectionDetectionValidator.DANGEROUS_PATTERNS) {
      const match = input.match(pattern);
      if (match) {
        throw new SqlInjectionDetectedError(match[0].trim());
      }
    }
  }
}
