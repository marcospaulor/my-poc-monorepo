export type GetCompanyByIdOutput = {
  id: string;
  name: string;
  address: string;
};

export interface GetCompanyById {
  execute(id: string): Promise<GetCompanyByIdOutput>;
}
