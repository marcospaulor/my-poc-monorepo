export type CreateCompanyInput = {
  name: string;
  address: string;
};

export type CreateCompanyOutput = {
  id: string;
  name: string;
  address: string;
  createdAt: string;
};

export interface CreateCompany {
  execute(input: CreateCompanyInput): Promise<CreateCompanyOutput>;
}
