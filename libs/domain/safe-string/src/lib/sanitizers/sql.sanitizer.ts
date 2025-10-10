import {
  AbstractStringSanitizer,
  type SanitizationResult,
} from './string-sanitizer.interface';

export class SqlSanitizer extends AbstractStringSanitizer {
  protected doSanitize(input: string): SanitizationResult {
    let sanitized = input;

    sanitized = sanitized.replace(/;/g, '');
    sanitized = sanitized.replace(/--/g, '');
    sanitized = sanitized.replace(/\/\*/g, '');
    sanitized = sanitized.replace(/\*\//g, '');
    sanitized = sanitized.replace(/'/g, "''");
    sanitized = sanitized.replace(/\\/g, '\\\\');

    return {
      value: sanitized,
      modified: sanitized !== input,
    };
  }
}
