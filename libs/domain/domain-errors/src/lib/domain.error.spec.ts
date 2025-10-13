import {
  ValidationError,
  NotFoundError,
  BusinessRuleError,
} from './domain.error';

describe('BaseError', () => {
  it('deve criar um erro com todas as propriedades de domínio', () => {
    const error = new ValidationError('Erro de teste', { field: 'name' });
    expect(error.message).toBe('Erro de teste');
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.context).toEqual({ field: 'name' });
    expect(error.timestamp).toBeDefined();
  });

  it('deve serializar para JSON corretamente', () => {
    const error = new ValidationError('Teste', {});
    const json = error.toJSON();
    expect(json.name).toBe('ValidationError');
    expect(json.message).toBe('Teste');
    expect(json.code).toBe('VALIDATION_ERROR');
    expect(json.timestamp).toBeDefined();
    expect(json.context).toBeDefined();
  });
});

describe('ValidationError', () => {
  it('deve criar erro de validação com código correto', () => {
    const error = new ValidationError('Campo obrigatório', { field: 'email' });
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.context).toEqual({ field: 'email' });
  });

  it('deve criar erro de validação sem contexto', () => {
    const error = new ValidationError('Campo obrigatório');
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.message).toBe('Campo obrigatório');
    expect(error.context).toEqual({});
  });
});

describe('NotFoundError', () => {
  it('deve criar erro de não encontrado', () => {
    const error = new NotFoundError('Recurso não encontrado', { id: '123' });
    expect(error.code).toBe('NOT_FOUND');
    expect(error.context).toEqual({ id: '123' });
  });

  it('pode ser estendido para erros específicos de domínio', () => {
    // Exemplo de como criar um erro específico
    class UserNotFoundError extends NotFoundError {
      constructor(userId: string) {
        super(`User with id ${userId} not found`, { userId });
      }
    }

    const error = new UserNotFoundError('user-456');
    expect(error.code).toBe('NOT_FOUND');
    expect(error.message).toContain('user-456');
    expect(error.context).toHaveProperty('userId', 'user-456');
  });
});

describe('BusinessRuleError', () => {
  it('deve criar erro de regra de negócio', () => {
    const error = new BusinessRuleError(
      'Saldo insuficiente',
      'INSUFFICIENT_BALANCE',
      { balance: 100, required: 200 }
    );
    expect(error.code).toBe('INSUFFICIENT_BALANCE');
    expect(error.context).toEqual({ balance: 100, required: 200 });
  });

  it('deve permitir código customizado', () => {
    const error = new BusinessRuleError(
      'Operação não permitida',
      'CUSTOM_BUSINESS_RULE'
    );
    expect(error.code).toBe('CUSTOM_BUSINESS_RULE');
    expect(error.message).toBe('Operação não permitida');
  });
});
