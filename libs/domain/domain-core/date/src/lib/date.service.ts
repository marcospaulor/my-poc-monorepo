import { format, Locale } from 'date-fns';

export class DateService {
  private static _fixedDate: Date | null = null;

  static now(): Date {
    if (this._fixedDate) {
      return new Date(this._fixedDate.getTime());
    }
    return new Date();
  }

  static nowIso(): string {
    return this.now().toISOString();
  }

  static toIso(date: Date): string {
    return date.toISOString();
  }

  static format(date: Date | string, pattern: string, locale?: Locale): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, pattern, locale ? { locale } : undefined);
  }

  static setFixedDate(date: Date): void {
    this._fixedDate = new Date(date.getTime());
  }

  static reset(): void {
    this._fixedDate = null;
  }

  static isFrozen(): boolean {
    return this._fixedDate !== null;
  }
}
