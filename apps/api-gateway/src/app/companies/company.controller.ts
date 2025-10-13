import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateCompany,
  GetCompanyById,
  ListCompanies,
} from '@my-poc-monorepo/domain/companies';
import { CreateCompanyDto, CompanyResponseDto } from './dto';
import { CompanyHelper } from './company.helper';

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
  @ApiResponse({
    status: 201,
    description: 'Company created successfully',
    type: CompanyResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createCompany(
    @Body() body: CreateCompanyDto
  ): Promise<CompanyResponseDto> {
    const { name, address } = body;
    const output = await this.createCompanyService.execute({ name, address });
    return CompanyHelper.toDto(output);
  }

  @Get()
  @ApiOperation({ summary: 'List all companies' })
  @ApiResponse({
    status: 200,
    description: 'List of companies',
    type: [CompanyResponseDto],
  })
  async listCompanies(): Promise<CompanyResponseDto[]> {
    const output = await this.listCompaniesService.execute();
    return output.companies.map(CompanyHelper.toDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiResponse({
    status: 200,
    description: 'Company found',
    type: CompanyResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async getCompanyById(@Param('id') id: string): Promise<CompanyResponseDto> {
    const output = await this.getCompanyByIdService.execute(id);
    return CompanyHelper.toDto(output);
  }
}
