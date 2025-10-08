import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateCompany,
  GetCompanyById,
  ListCompanies,
  CompanyNotFoundError,
  CompanyValidationError,
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
    @Inject('CreateCompany')
    private readonly createCompanyService: CreateCompany,
    @Inject('GetCompanyById')
    private readonly getCompanyByIdService: GetCompanyById,
    @Inject('ListCompanies')
    private readonly listCompaniesService: ListCompanies
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({ status: 201, description: 'Company created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createCompany(@Body() body: CreateCompanyDto) {
    try {
      const { name, address } = body;
      const output = await this.createCompanyService.execute({ name, address });
      return output;
    } catch (error) {
      if (error instanceof CompanyValidationError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'List all companies' })
  @ApiResponse({ status: 200, description: 'List of companies' })
  async listCompanies() {
    const output = await this.listCompaniesService.execute();
    return output;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiResponse({ status: 200, description: 'Company found' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async getCompanyById(@Param('id') id: string) {
    try {
      const output = await this.getCompanyByIdService.execute(id);
      return output;
    } catch (error) {
      if (error instanceof CompanyNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
