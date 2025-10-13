import { DateService } from './date.service';

describe('DateService', () => {
  afterEach(() => {
    DateService.reset();
  });

  describe('now()', () => {
    it('should return current date when not frozen', () => {
      const before = new Date();
      const now = DateService.now();
      const after = new Date();

      expect(now.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(now.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should return fixed date when frozen', () => {
      const fixedDate = new Date('2024-01-15T10:30:00.000Z');
      DateService.setFixedDate(fixedDate);

      const result1 = DateService.now();
      const result2 = DateService.now();

      expect(result1.toISOString()).toBe('2024-01-15T10:30:00.000Z');
      expect(result2.toISOString()).toBe('2024-01-15T10:30:00.000Z');
    });

    it('should return new instance each time (not same reference)', () => {
      const fixedDate = new Date('2024-01-15T10:30:00.000Z');
      DateService.setFixedDate(fixedDate);

      const result1 = DateService.now();
      const result2 = DateService.now();

      expect(result1).not.toBe(result2);
      expect(result1.getTime()).toBe(result2.getTime());
    });
  });

  describe('nowIso()', () => {
    it('should return ISO string of current date', () => {
      const fixedDate = new Date('2024-01-15T10:30:00.000Z');
      DateService.setFixedDate(fixedDate);

      expect(DateService.nowIso()).toBe('2024-01-15T10:30:00.000Z');
    });

    it('should return current ISO string when not frozen', () => {
      const isoString = DateService.nowIso();

      expect(isoString).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
    });
  });

  describe('toIso()', () => {
    it('should convert date to ISO string', () => {
      const date = new Date('2024-01-15T10:30:00.000Z');

      expect(DateService.toIso(date)).toBe('2024-01-15T10:30:00.000Z');
    });
  });

  describe('format()', () => {
    it('should format date with custom pattern', () => {
      const date = new Date('2024-01-15T10:30:00.000Z');

      const formatted = DateService.format(date, 'yyyy-MM-dd');

      expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should format date with custom pattern and locale', () => {
      const date = new Date('2024-01-15T10:30:00.000Z');
      const { ptBR } = require('date-fns/locale');

      const formatted = DateService.format(date, "EEEE, dd 'de' MMMM", ptBR);

      expect(formatted).toContain('de');
    });

    it('should accept ISO string', () => {
      const isoString = '2024-01-15T10:30:00.000Z';

      const formatted = DateService.format(isoString, 'dd/MM/yyyy HH:mm');

      expect(formatted).toMatch(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/);
    });

    it('should format Brazilian style with time', () => {
      const date = new Date('2024-01-15T10:30:00.000Z');
      const { ptBR } = require('date-fns/locale');

      const formatted = DateService.format(date, "dd/MM/yyyy 'às' HH:mm", ptBR);

      expect(formatted).toMatch(/^\d{2}\/\d{2}\/\d{4} às \d{2}:\d{2}$/);
    });

    it('should format Brazilian style without time', () => {
      const date = new Date('2024-01-15T10:30:00.000Z');
      const { ptBR } = require('date-fns/locale');

      const formatted = DateService.format(date, 'dd/MM/yyyy', ptBR);

      expect(formatted).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });
  });

  describe('setFixedDate() and reset()', () => {
    it('should freeze time at specific date', () => {
      const fixedDate = new Date('2024-01-15T10:30:00.000Z');
      DateService.setFixedDate(fixedDate);

      expect(DateService.isFrozen()).toBe(true);
      expect(DateService.now().toISOString()).toBe('2024-01-15T10:30:00.000Z');
    });

    it('should reset to normal behavior', () => {
      DateService.setFixedDate(new Date('2024-01-15T10:30:00.000Z'));
      DateService.reset();

      expect(DateService.isFrozen()).toBe(false);
    });

    it('should return real time after reset', () => {
      const fixedDate = new Date('2024-01-15T10:30:00.000Z');
      DateService.setFixedDate(fixedDate);

      expect(DateService.now().toISOString()).toBe('2024-01-15T10:30:00.000Z');

      DateService.reset();
      const now = DateService.now();

      expect(now.getTime()).not.toBe(fixedDate.getTime());
    });
  });

  describe('isFrozen()', () => {
    it('should return false when not frozen', () => {
      expect(DateService.isFrozen()).toBe(false);
    });

    it('should return true when frozen', () => {
      DateService.setFixedDate(new Date());

      expect(DateService.isFrozen()).toBe(true);
    });
  });

  describe('Integration scenarios', () => {
    it('should work in typical use case - get current time and format', () => {
      const fixedDate = new Date('2024-01-15T14:30:00.000Z');
      DateService.setFixedDate(fixedDate);
      const { ptBR } = require('date-fns/locale');

      const now = DateService.now();
      const isoString = DateService.toIso(now);
      const formatted = DateService.format(now, "dd/MM/yyyy 'às' HH:mm", ptBR);
      const simpleFormatted = DateService.format(now, 'dd/MM/yyyy', ptBR);

      expect(isoString).toBe('2024-01-15T14:30:00.000Z');
      expect(formatted).toMatch(/15\/01\/2024 às \d{2}:\d{2}/);
      expect(simpleFormatted).toMatch(/15\/01\/2024/);
    });
  });
});
