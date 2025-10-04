import { CompanyRepository } from '@my-poc-monorepo/domain/companies';
import { InMemoryCompanyRepository } from './repositories/in-memory-company.repository';
import { PrismaCompanyRepository } from './repositories/prisma-company-repository';
import { PrismaService } from './prisma.service';

export type RespositoryType = 'in-memory' | 'prisma';

/**
 * Fábrica de repositórios
 * Permite trocar facilmente a implementação do repositório (ex: para testes)
 */

export class RepositoriesFactory {
  private static companyRepository: CompanyRepository | null = null;
  private static repositoryType: RespositoryType = 'in-memory';

  static configure(type: RespositoryType): void {
    this.repositoryType = type;
    this.reset();
  }

  /**
   * Cria ou retorna uma instância do repositório de empresas
   * Por padrão, usa o repositório em memória
   */
  static getCompanyRepository(): CompanyRepository {
    if (!this.companyRepository) {
      if (this.repositoryType === 'prisma') {
        const prismaService = PrismaService.getInstance();
        this.companyRepository = new PrismaCompanyRepository(prismaService);
        return this.companyRepository;
      }
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
