import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateCompanyUseCase,
  GetCompanyByIdUseCase,
} from '@my-poc-monorepo/domain/companies';

class CreateCompanyDto {
  @ApiProperty({
    description: 'Nome da empresa',
    example: 'Minha Empresa LTDA',
  })
  name: string;

  @ApiProperty({
    description: 'Endereço da empresa',
    example: 'Rua das Flores, 123 - São Paulo/SP',
  })
  address: string;
}

@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(
    @Inject('CreateCompanyUseCase')
    private readonly createCompanyUseCase: CreateCompanyUseCase,
    @Inject('GetCompanyByIdUseCase')
    private readonly getCompanyByIdUseCase: GetCompanyByIdUseCase
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({ status: 201, description: 'Company created successfully' })
  async createCompany(@Body() body: CreateCompanyDto) {
    const { name, address } = body;
    const output = await this.createCompanyUseCase.execute({ name, address });
    return output;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiResponse({ status: 200, description: 'Company found' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async getCompanyById(@Param('id') id: string) {
    const output = await this.getCompanyByIdUseCase.execute(id);
    return output;
  }
}
