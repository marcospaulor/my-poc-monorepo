import { ValidationError } from './domain.error';
import type { ErrorContext } from './base.error';

/**
 * Erro base para validações de string
 */
export class StringValidationError extends ValidationError {
  constructor(message: string, context?: ErrorContext) {
    super(message, context);
  }
}

/**
 * Erro lançado quando a string está vazia ou contém apenas espaços em branco
 */
export class EmptyStringError extends StringValidationError {
  constructor(context?: ErrorContext) {
    super('A string não pode estar vazia', context);
  }
}

/**
 * Erro lançado quando a string é muito curta
 */
export class StringTooShortError extends StringValidationError {
  constructor(minLength: number, actualLength: number, context?: ErrorContext) {
    super(
      `A string deve ter no mínimo ${minLength} caracteres (atual: ${actualLength})`,
      { ...context, minLength, actualLength }
    );
  }
}

/**
 * Erro lançado quando a string é muito longa
 */
export class StringTooLongError extends StringValidationError {
  constructor(maxLength: number, actualLength: number, context?: ErrorContext) {
    super(
      `A string deve ter no máximo ${maxLength} caracteres (atual: ${actualLength})`,
      { ...context, maxLength, actualLength }
    );
  }
}

/**
 * Erro lançado quando a string contém caracteres inválidos
 */
export class InvalidCharactersError extends StringValidationError {
  constructor(invalidChars: string[], context?: ErrorContext) {
    super(`A string contém caracteres inválidos: ${invalidChars.join(', ')}`, {
      ...context,
      invalidChars,
    });
  }
}

/**
 * Erro lançado quando detecta tentativa de XSS
 */
export class XssDetectedError extends StringValidationError {
  constructor(pattern: string, context?: ErrorContext) {
    super(`Detectado padrão de XSS potencialmente malicioso: ${pattern}`, {
      ...context,
      pattern,
    });
  }
}

/**
 * Erro lançado quando detecta tentativa de SQL Injection
 */
export class SqlInjectionDetectedError extends StringValidationError {
  constructor(pattern: string, context?: ErrorContext) {
    super(
      `Detectado padrão de SQL Injection potencialmente malicioso: ${pattern}`,
      { ...context, pattern }
    );
  }
}
