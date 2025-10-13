import { ApiProperty } from '@nestjs/swagger';

export class CompanyResponseDto {
  @ApiProperty({ description: 'ID da empresa' })
  id: string;

  @ApiProperty({ description: 'Nome da empresa' })
  name: string;

  @ApiProperty({ description: 'Endereço da empresa' })
  address: string;

  @ApiProperty({
    description: 'Data de criação (ISO 8601 UTC)',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Data de criação formatada (pt-BR)',
    example: '15/01/2024 às 10:30',
  })
  createdAtFormatted: string;
}
