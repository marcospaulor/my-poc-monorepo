import { SafeString } from './safe-string';
import {
  XssDetectedError,
  SqlInjectionDetectedError,
} from '@my-poc-monorepo/domain-errors';

describe('SafeString', () => {
  describe('create', () => {
    it('deve criar SafeString com valor simples', () => {
      const safe = SafeString.create('Hello World');
      expect(safe.getValue()).toBe('Hello World');
    });

    it('deve preservar caracteres UTF-8 (português)', () => {
      const safe = SafeString.create('Olá José Ação');
      expect(safe.getValue()).toContain('Olá');
      expect(safe.getValue()).toContain('José');
      expect(safe.getValue()).toContain('Ação');
    });
  });

  describe('HTML sanitization (always applied)', () => {
    it('deve escapar tags HTML', () => {
      const safe = SafeString.create('Hello');
      expect(safe.getValue()).toBe('Hello');
    });

    it('deve lançar XssDetectedError para scripts maliciosos', () => {
      expect(() =>
        SafeString.create('<script>alert("XSS")</script>Hello')
      ).toThrow(XssDetectedError);
    });

    it('deve lançar XssDetectedError para tags style', () => {
      expect(() =>
        SafeString.create('<style>body{color:red}</style>Hello')
      ).toThrow(XssDetectedError);
    });

    it('deve lançar XssDetectedError para javascript: protocol', () => {
      expect(() => SafeString.create('javascript:alert("XSS")')).toThrow(
        XssDetectedError
      );
    });

    it('deve escapar caracteres HTML perigosos', () => {
      const safe = SafeString.create('<div>Hello</div>');
      // HTML sanitizer runs first, then SQL sanitizer (SQL removes semicolons)
      expect(safe.getValue()).toBe('&ltdiv&gtHello&lt/div&gt');
    });
  });

  describe('SQL sanitization (always applied)', () => {
    it('deve escapar aspas simples', () => {
      const safe = SafeString.create("O'Reilly");
      // HTML runs first (escapes '), then SQL would escape but ' is already &
      expect(safe.getValue()).toBe('O&#x27Reilly');
    });

    it('deve lançar SqlInjectionDetectedError para comandos perigosos', () => {
      expect(() => SafeString.create('admin; DROP TABLE users')).toThrow(
        SqlInjectionDetectedError
      );
    });

    it('deve lançar SqlInjectionDetectedError para UNION SELECT', () => {
      expect(() =>
        SafeString.create('admin UNION SELECT * FROM users')
      ).toThrow(SqlInjectionDetectedError);
    });

    it('deve lançar SqlInjectionDetectedError para comentários SQL', () => {
      expect(() => SafeString.create('admin--')).toThrow(
        SqlInjectionDetectedError
      );
    });

    it('deve lançar SqlInjectionDetectedError para comentários de bloco', () => {
      expect(() => SafeString.create('admin /* comment */ user')).toThrow(
        SqlInjectionDetectedError
      );
    });

    it('deve escapar barras invertidas', () => {
      const safe = SafeString.create('C:\\Users\\Admin');
      expect(safe.getValue()).toBe('C:\\\\Users\\\\Admin');
    });
  });

  describe('combined protection', () => {
    it('deve sanitizar aspas simples sem padrões perigosos', () => {
      const safe = SafeString.create("O'Reilly - The Best Books");
      expect(safe.getValue()).toContain('O&#x27Reilly');
    });

    it('deve proteger mantendo caracteres portugueses', () => {
      const input = 'José da Silva - Rua São João 123';
      const safe = SafeString.create(input);
      expect(safe.getValue()).toContain('José');
      expect(safe.getValue()).toContain('São João');
    });
  });
});
