import { DateService } from '@my-poc-monorepo/date';
import { ptBR } from 'date-fns/locale';
import { CompanyResponseDto } from './dto';

export class CompanyHelper {
  static toDto(data: {
    id: string;
    name: string;
    address: string;
    createdAt: string;
  }): CompanyResponseDto {
    return {
      id: data.id,
      name: data.name,
      address: data.address,
      createdAt: data.createdAt,
      createdAtFormatted: DateService.format(
        data.createdAt,
        "dd/MM/yyyy 'às' HH:mm",
        ptBR
      ),
    };
  }
}
