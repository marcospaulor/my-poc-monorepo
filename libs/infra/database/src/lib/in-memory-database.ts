import { Company } from '@my-poc-monorepo/domain/companies';

/**
 * In-Memory Database
 *
 * Banco de dados em memória singleton que gerencia todas as coleções.
 * Os dados são persistidos apenas durante a execução da aplicação.
 *
 * Features:
 * - Singleton pattern para garantir única instância
 * - Suporte a múltiplas coleções (companies, etc.)
 * - Métodos de utilidade (clear, reset, getStats)
 */
export class InMemoryDatabase {
  private static instance: InMemoryDatabase;

  // Coleções
  private companies: Map<string, Company> = new Map();

  private constructor() {
    // Construtor privado para implementar Singleton
  }

  /**
   * Retorna a instância única do banco de dados
   */
  static getInstance(): InMemoryDatabase {
    if (!InMemoryDatabase.instance) {
      InMemoryDatabase.instance = new InMemoryDatabase();
    }
    return InMemoryDatabase.instance;
  }

  // ==================== COMPANIES ====================

  /**
   * Salva ou atualiza uma empresa
   */
  saveCompany(company: Company): void {
    this.companies.set(company.id, company);
  }

  /**
   * Busca uma empresa por ID
   */
  findCompanyById(id: string): Company | null {
    return this.companies.get(id) || null;
  }

  /**
   * Lista todas as empresas
   */
  findAllCompanies(): Company[] {
    return Array.from(this.companies.values());
  }

  /**
   * Deleta uma empresa por ID
   */
  deleteCompany(id: string): boolean {
    return this.companies.delete(id);
  }

  /**
   * Verifica se uma empresa existe
   */
  companyExists(id: string): boolean {
    return this.companies.has(id);
  }

  /**
   * Conta o número de empresas
   */
  countCompanies(): number {
    return this.companies.size;
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Limpa todas as coleções do banco
   */
  clear(): void {
    this.companies.clear();
  }

  /**
   * Reseta o banco de dados (útil para testes)
   */
  reset(): void {
    this.clear();
  }

  /**
   * Retorna estatísticas do banco de dados
   */
  getStats(): DatabaseStats {
    return {
      companies: this.companies.size,
      totalRecords: this.companies.size,
    };
  }

  /**
   * Exporta todos os dados (útil para debug)
   */
  exportData(): DatabaseExport {
    return {
      companies: Array.from(this.companies.entries()).map(([id, company]) => ({
        id,
        name: company.name,
        address: company.address,
      })),
    };
  }

  /**
   * Importa dados (útil para testes ou seed)
   */
  importData(data: DatabaseExport): void {
    if (data.companies) {
      data.companies.forEach((companyData) => {
        const company = new Company(
          companyData.id,
          companyData.name,
          companyData.address
        );
        this.saveCompany(company);
      });
    }
  }
}

// ==================== TYPES ====================

export interface DatabaseStats {
  companies: number;
  totalRecords: number;
}

export interface DatabaseExport {
  companies?: Array<{
    id: string;
    name: string;
    address: string;
  }>;
}

// ==================== HELPER FUNCTION ====================

/**
 * Helper function para obter a instância do banco de dados
 */
export const getDatabase = () => InMemoryDatabase.getInstance();
