# @my-poc-monorepo/date

Serviço simplificado para gerenciar datas e horas.

## Funcionalidades

✅ **Obter horário atual**  
✅ **Converter para ISO string**  
✅ **Formatar em padrão brasileiro** (dd/MM/yyyy)  
✅ **Suporte a testes** (congelar tempo)

## Instalação

```typescript
import { DateService } from '@my-poc-monorepo/date';
```

## Uso Básico

### 1. Obter Horário Atual

```typescript
// Obter data/hora atual
const now = DateService.now();

// Obter como ISO string
const isoString = DateService.nowIso();
// => "2025-10-12T14:30:00.000Z"
```

### 2. Converter para ISO String

```typescript
const date = new Date();
const isoString = DateService.toIso(date);
// => "2025-10-12T14:30:00.000Z"
```

### 3. Formatar para Padrão Brasileiro

```typescript
const date = new Date('2025-10-12T14:30:00.000Z');

// Com horário
const formatted = DateService.formatBR(date);
// => "12/10/2025 às 14:30"

// Apenas data
const simpleFormatted = DateService.formatBRSimple(date);
// => "12/10/2025"

// Também aceita ISO string
const formatted2 = DateService.formatBR('2025-10-12T14:30:00.000Z');
// => "12/10/2025 às 14:30"
```

## Uso em Entidades

```typescript
import { DateService } from '@my-poc-monorepo/date';

export class Company {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly createdAt: Date
  ) {}

  static create(name: string): Company {
    return new Company(
      generateId(),
      name,
      DateService.now() // ✅ Usa DateService
    );
  }
}
```

## Uso em Apresentação (DTOs)

```typescript
import { DateService } from '@my-poc-monorepo/date';

export class CompanyPresenter {
  static toHttp(company: Company) {
    return {
      id: company.id,
      name: company.name,
      createdAt: DateService.toIso(company.createdAt),
      createdAtFormatted: DateService.formatBR(company.createdAt),
    };
  }
}
```

## Testes

### Congelar Tempo

```typescript
import { DateService } from '@my-poc-monorepo/date';

describe('MyService', () => {
  beforeEach(() => {
    // Congela o tempo em uma data específica
    const fixedDate = new Date('2025-10-12T14:30:00.000Z');
    DateService.setFixedDate(fixedDate);
  });

  afterEach(() => {
    // Reseta para comportamento normal
    DateService.reset();
  });

  it('should use fixed date', () => {
    const now = DateService.now();
    
    expect(now.toISOString()).toBe('2025-10-12T14:30:00.000Z');
  });

  it('should check if frozen', () => {
    expect(DateService.isFrozen()).toBe(true);
  });
});
```

## API Completa

| Método | Retorno | Descrição |
|--------|---------|-----------|
| `now()` | `Date` | Retorna data/hora atual |
| `nowIso()` | `string` | Retorna data atual em ISO 8601 |
| `toIso(date)` | `string` | Converte Date para ISO 8601 |
| `formatBR(date)` | `string` | Formata: "dd/MM/yyyy às HH:mm" |
| `formatBRSimple(date)` | `string` | Formata: "dd/MM/yyyy" |
| `setFixedDate(date)` | `void` | Congela tempo (para testes) |
| `reset()` | `void` | Volta ao tempo real |
| `isFrozen()` | `boolean` | Verifica se está congelado |

## Exemplos de Saída

```typescript
const date = new Date('2025-10-12T14:30:00.000Z');

DateService.toIso(date);
// => "2025-10-12T14:30:00.000Z"

DateService.formatBR(date);
// => "12/10/2025 às 14:30"

DateService.formatBRSimple(date);
// => "12/10/2025"
```

## Por que usar?

✅ **Centralização**: Toda lógica de data em um único lugar  
✅ **Testabilidade**: Fácil de congelar tempo em testes  
✅ **Consistência**: Formato brasileiro padronizado  
✅ **Simplicidade**: API limpa e direta

## Rodando Testes

```bash
npx nx test date
```

