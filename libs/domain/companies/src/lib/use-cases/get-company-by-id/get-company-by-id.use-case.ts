export type GetCompanyByIdOutput = {
  id: string;
  name: string;
  address: string;
  createdAt: string;
};

export interface GetCompanyById {
  execute(id: string): Promise<GetCompanyByIdOutput>;
}
