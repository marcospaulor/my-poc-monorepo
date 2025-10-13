import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
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
