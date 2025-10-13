export interface ListCompaniesOutput {
  companies: Array<{
    id: string;
    name: string;
    address: string;
    createdAt: string;
  }>;
}

export interface ListCompanies {
  execute(): Promise<ListCompaniesOutput>;
}
