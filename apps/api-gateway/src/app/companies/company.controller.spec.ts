import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import {
  CreateCompany,
  GetCompanyById,
  ListCompanies,
  CompanyNotFoundError,
  CompanyValidationError,
} from '@my-poc-monorepo/domain/companies';

describe('CompanyController', () => {
  let controller: CompanyController;
  let mockCreateCompanyService: jest.Mocked<CreateCompany>;
  let mockGetCompanyByIdService: jest.Mocked<GetCompanyById>;
  let mockListCompaniesService: jest.Mocked<ListCompanies>;

  beforeEach(async () => {
    mockCreateCompanyService = {
      execute: jest.fn(),
    };

    mockGetCompanyByIdService = {
      execute: jest.fn(),
    };

    mockListCompaniesService = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: 'CreateCompany',
          useValue: mockCreateCompanyService,
        },
        {
          provide: 'GetCompanyById',
          useValue: mockGetCompanyByIdService,
        },
        {
          provide: 'ListCompanies',
          useValue: mockListCompaniesService,
        },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCompany', () => {
    it('should create a company successfully', async () => {
      // Arrange
      const createCompanyDto = {
        name: 'Test Company',
        address: 'Rua das Flores, 123 - São Paulo/SP',
      };
      const expectedOutput = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Company',
        address: 'Rua das Flores, 123 - São Paulo/SP',
        createdAt: '2024-01-15T10:30:00.000Z',
        createdAtFormatted: '15/01/2024 às 07:30',
      };

      mockCreateCompanyService.execute.mockResolvedValue({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Company',
        address: 'Rua das Flores, 123 - São Paulo/SP',
        createdAt: '2024-01-15T10:30:00.000Z',
      });

      // Act
      const result = await controller.createCompany(createCompanyDto);

      // Assert
      expect(result).toEqual(expectedOutput);
      expect(mockCreateCompanyService.execute).toHaveBeenCalledWith({
        name: createCompanyDto.name,
        address: createCompanyDto.address,
      });
      expect(mockCreateCompanyService.execute).toHaveBeenCalledTimes(1);
    });

    it('should pass correct parameters to service', async () => {
      // Arrange
      const createCompanyDto = {
        name: 'My Company LTDA',
        address: 'Av. Paulista, 1000 - São Paulo/SP',
      };
      const expectedOutput = {
        id: 'generated-id',
        name: 'My Company LTDA',
        address: 'Av. Paulista, 1000 - São Paulo/SP',
        createdAt: '2024-01-15T10:30:00.000Z',
      };

      mockCreateCompanyService.execute.mockResolvedValue(expectedOutput);

      // Act
      await controller.createCompany(createCompanyDto);

      // Assert
      expect(mockCreateCompanyService.execute).toHaveBeenCalledWith({
        name: 'My Company LTDA',
        address: 'Av. Paulista, 1000 - São Paulo/SP',
      });
    });

    it('should return the generated company ID', async () => {
      // Arrange
      const createCompanyDto = {
        name: 'Another Company',
        address: 'Test Address',
      };
      const expectedId = 'new-company-id';

      mockCreateCompanyService.execute.mockResolvedValue({
        id: expectedId,
        name: 'Another Company',
        address: 'Test Address',
        createdAt: '2024-01-15T10:30:00.000Z',
      });

      // Act
      const result = await controller.createCompany(createCompanyDto);

      // Assert
      expect(result).toHaveProperty('id');
      expect(result.id).toBe(expectedId);
    });

    it('should propagate errors from service', async () => {
      // Arrange
      const createCompanyDto = {
        name: 'Test Company',
        address: 'Test Address',
      };
      const error = new Error('Service error');

      mockCreateCompanyService.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.createCompany(createCompanyDto)).rejects.toThrow(
        'Service error'
      );
    });

    it('should propagate CompanyValidationError when invalid name is provided', async () => {
      // Arrange
      const createCompanyDto = {
        name: '',
        address: 'Test Address',
      };
      const error = CompanyValidationError.invalidName();

      mockCreateCompanyService.execute.mockRejectedValue(error);

      // Act & Assert
      // O controller agora deixa o erro ser propagado para o DomainExceptionFilter
      await expect(controller.createCompany(createCompanyDto)).rejects.toThrow(
        CompanyValidationError
      );
      await expect(controller.createCompany(createCompanyDto)).rejects.toThrow(
        'Nome da empresa é obrigatório e não pode estar vazio'
      );
    });

    it('should propagate CompanyValidationError when invalid address is provided', async () => {
      // Arrange
      const createCompanyDto = {
        name: 'Test Company',
        address: '',
      };
      const error = CompanyValidationError.invalidAddress();

      mockCreateCompanyService.execute.mockRejectedValue(error);

      // Act & Assert
      // O controller agora deixa o erro ser propagado para o DomainExceptionFilter
      await expect(controller.createCompany(createCompanyDto)).rejects.toThrow(
        CompanyValidationError
      );
      await expect(controller.createCompany(createCompanyDto)).rejects.toThrow(
        'Endereço da empresa é obrigatório e não pode estar vazio'
      );
    });

    it('should rethrow errors that are not CompanyValidationError', async () => {
      // Arrange
      const createCompanyDto = {
        name: 'Test Company',
        address: 'Test Address',
      };
      const error = new Error('Unexpected database error');

      mockCreateCompanyService.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.createCompany(createCompanyDto)).rejects.toThrow(
        'Unexpected database error'
      );
      await expect(
        controller.createCompany(createCompanyDto)
      ).rejects.not.toThrow(CompanyValidationError);
    });
  });

  describe('getCompanyById', () => {
    it('should return company data when company exists', async () => {
      // Arrange
      const companyId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedOutput = {
        id: companyId,
        name: 'Test Company',
        address: 'Rua das Flores, 123 - São Paulo/SP',
        createdAt: '2024-01-15T10:30:00.000Z',
        createdAtFormatted: '15/01/2024 às 07:30',
      };

      mockGetCompanyByIdService.execute.mockResolvedValue({
        id: companyId,
        name: 'Test Company',
        address: 'Rua das Flores, 123 - São Paulo/SP',
        createdAt: '2024-01-15T10:30:00.000Z',
      });

      // Act
      const result = await controller.getCompanyById(companyId);

      // Assert
      expect(result).toEqual(expectedOutput);
      expect(mockGetCompanyByIdService.execute).toHaveBeenCalledWith(companyId);
      expect(mockGetCompanyByIdService.execute).toHaveBeenCalledTimes(1);
    });

    it('should propagate CompanyNotFoundError when company does not exist', async () => {
      // Arrange
      const companyId = 'non-existent-id';
      const error = CompanyNotFoundError.withId(companyId);

      mockGetCompanyByIdService.execute.mockRejectedValue(error);

      // Act & Assert
      // O controller agora deixa o erro ser propagado para o DomainExceptionFilter
      await expect(controller.getCompanyById(companyId)).rejects.toThrow(
        CompanyNotFoundError
      );
      await expect(controller.getCompanyById(companyId)).rejects.toThrow(
        `Empresa com ID ${companyId} não encontrada`
      );
    });

    it('should return complete company information', async () => {
      // Arrange
      const companyId = 'test-id-123';
      const expectedOutput = {
        id: companyId,
        name: 'My Test Company LTDA',
        address: 'Av. Paulista, 1000 - São Paulo/SP',
        createdAt: '2024-01-15T10:30:00.000Z',
      };

      mockGetCompanyByIdService.execute.mockResolvedValue(expectedOutput);

      // Act
      const result = await controller.getCompanyById(companyId);

      // Assert
      expect(result.id).toBe(companyId);
      expect(result.name).toBe('My Test Company LTDA');
      expect(result.address).toBe('Av. Paulista, 1000 - São Paulo/SP');
    });

    it('should rethrow errors that are not CompanyNotFoundError', async () => {
      // Arrange
      const companyId = 'test-id';
      const error = new Error('Unexpected database error');

      mockGetCompanyByIdService.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.getCompanyById(companyId)).rejects.toThrow(
        'Unexpected database error'
      );
      await expect(controller.getCompanyById(companyId)).rejects.not.toThrow(
        CompanyNotFoundError
      );
    });

    it('should call service with exact id parameter', async () => {
      // Arrange
      const companyId = 'exact-id-test';
      const expectedOutput = {
        id: companyId,
        name: 'Test',
        address: 'Test Address',
        createdAt: '2024-01-15T10:30:00.000Z',
      };

      mockGetCompanyByIdService.execute.mockResolvedValue(expectedOutput);

      // Act
      await controller.getCompanyById(companyId);

      // Assert
      expect(mockGetCompanyByIdService.execute).toHaveBeenCalledWith(companyId);
    });

    it('should handle different company IDs correctly', async () => {
      // Arrange
      const companyId1 = 'id-1';
      const companyId2 = 'id-2';
      const output1 = {
        id: companyId1,
        name: 'Company 1',
        address: 'Addr 1',
        createdAt: '2024-01-15T10:30:00.000Z',
      };
      const output2 = {
        id: companyId2,
        name: 'Company 2',
        address: 'Addr 2',
        createdAt: '2024-01-16T11:30:00.000Z',
      };

      mockGetCompanyByIdService.execute
        .mockResolvedValueOnce(output1)
        .mockResolvedValueOnce(output2);

      // Act
      const result1 = await controller.getCompanyById(companyId1);
      const result2 = await controller.getCompanyById(companyId2);

      // Assert
      expect(result1.id).toBe(companyId1);
      expect(result2.id).toBe(companyId2);
      expect(mockGetCompanyByIdService.execute).toHaveBeenCalledTimes(2);
    });
  });
});
