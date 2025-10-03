import { CompanyRepository } from '@my-poc-monorepo/domain/companies';
import { InMemoryCompanyRepository } from './repositories/in-memory-company.repository';

/**
 * Factory para criar instâncias dos repositórios de infraestrutura
 * Esta abordagem permite que as libs sejam independentes de framework
 */
export class RepositoriesFactory {
  private static companyRepository: CompanyRepository | null = null;

  /**
   * Cria ou retorna uma instância do repositório de empresas
   * Por padrão, usa o repositório em memória
   */
  static getCompanyRepository(): CompanyRepository {
    if (!this.companyRepository) {
      this.companyRepository = new InMemoryCompanyRepository();
    }
    return this.companyRepository;
  }

  /**
   * Permite sobrescrever o repositório de empresas (útil para testes)
   */
  static setCompanyRepository(repository: CompanyRepository): void {
    this.companyRepository = repository;
  }

  /**
   * Reseta o repositório (útil para testes)
   */
  static reset(): void {
    this.companyRepository = null;
  }
}
