import {
  AbstractStringSanitizer,
  SanitizationResult,
} from './string-sanitizer.interface';

export class HtmlSanitizer extends AbstractStringSanitizer {
  protected doSanitize(input: string): SanitizationResult {
    const sanitized = input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');

    return {
      value: sanitized,
      modified: sanitized !== input,
    };
  }
}
