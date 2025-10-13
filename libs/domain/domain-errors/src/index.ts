// Erros base e de domínio
export * from './lib/base.error';
export * from './lib/domain.error';
export * from './lib/string-validation.error';
export * from './lib/validation-errors.error';

// Chain of Responsibility para mapeamento de erros
export * from './lib/handlers/error-handler.interface';
export * from './lib/handlers/base-error.handler';
export * from './lib/handlers/not-found-error.handler';
export * from './lib/handlers/validation-error.handler';
export * from './lib/handlers/validation-errors.handler';
export * from './lib/handlers/business-rule-error.handler';
export * from './lib/handlers/default-error.handler';
export * from './lib/handlers/error-handler-chain';
