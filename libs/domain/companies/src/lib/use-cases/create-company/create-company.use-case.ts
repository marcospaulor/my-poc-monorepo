export type CreateCompanyInput = {
  name: string;
  address: string;
};

export type CreateCompanyOutput = {
  id: string;
};

export interface CreateCompanyUseCase {
  execute(input: CreateCompanyInput): Promise<CreateCompanyOutput>;
}
