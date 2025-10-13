export interface IDateProvider {
  now(): Date;

  nowIso(): string;

  nowTimestamp(): number;

  create(value: string | number | Date): Date;

  addDays(date: Date, days: number): Date;

  addHours(date: Date, hours: number): Date;

  addMinutes(date: Date, minutes: number): Date;

  isPast(date: Date): boolean;

  isFuture(date: Date): boolean;

  diffInDays(date1: Date, date2: Date): number;

  diffInHours(date1: Date, date2: Date): number;

  toIsoString(date: Date): string;
}
