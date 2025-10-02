export type GetCompanyByIdOutput = {
  id: string;
  name: string;
  address: string;
};

export interface GetCompanyByIdUseCase {
  execute(id: string): Promise<GetCompanyByIdOutput>;
}
