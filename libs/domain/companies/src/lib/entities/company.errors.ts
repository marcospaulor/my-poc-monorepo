import { NotFoundError, ValidationError } from '@my-poc-monorepo/domain-errors';

/**
 * Erro quando empresa não é encontrada
 */
export class CompanyNotFoundError extends NotFoundError {
  static withId(id: string): CompanyNotFoundError {
    return new CompanyNotFoundError(`Empresa com ID ${id} não encontrada`, {
      companyId: id,
    });
  }
}

/**
 * Erro de validação de dados da empresa
 */
export class CompanyValidationError extends ValidationError {
  static invalidName(): CompanyValidationError {
    return new CompanyValidationError(
      'Nome da empresa é obrigatório e não pode estar vazio',
      { field: 'name' }
    );
  }

  static invalidAddress(): CompanyValidationError {
    return new CompanyValidationError(
      'Endereço da empresa é obrigatório e não pode estar vazio',
      { field: 'address' }
    );
  }

  static invalidId(): CompanyValidationError {
    return new CompanyValidationError(
      'ID da empresa é obrigatório e deve ser um UUID válido',
      { field: 'id' }
    );
  }
}
