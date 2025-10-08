export interface ListCompaniesOutput {
  companies: Array<{
    id: string;
    name: string;
    address: string;
  }>;
}

export interface ListCompanies {
  execute(): Promise<ListCompaniesOutput>;
}
