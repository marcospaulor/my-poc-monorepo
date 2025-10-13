# Domain Errors

Biblioteca de gerenciamento de erros de domínio com suporte ao padrão **Chain of Responsibility** para mapeamento de erros em respostas HTTP.

## 🎯 Objetivo

Fornecer uma hierarquia de erros de domínio pura (sem conhecimento de infraestrutura) e um sistema de handlers para traduzir esses erros em respostas apropriadas para diferentes protocolos (HTTP, gRPC, etc).

## 📦 Conteúdo

### Erros de Domínio

- `BaseError` - Classe abstrata base para todos os erros
- `DomainError` - Erro genérico de domínio
- `ValidationError` - Erro de validação (400 Bad Request)
- `BusinessRuleError` - Erro de regra de negócio (422 Unprocessable Entity)
- `NotFoundError` - Entidade não encontrada (404 Not Found)
- `CompanyNotFoundError` - Exemplo de erro específico por agregado

### Chain of Responsibility

- `ErrorHandler` - Interface para handlers
- `ErrorResponse` - Estrutura de resposta HTTP
- `AbstractErrorHandler` - Implementação base abstrata
- `NotFoundErrorHandler` - Handler para erros 404
- `ValidationErrorHandler` - Handler para erros 400
- `BusinessRuleErrorHandler` - Handler para erros 422
- `DefaultErrorHandler` - Handler padrão (fallback 500)
- `ErrorHandlerChain` - Gerenciador da cadeia de handlers

## 🚀 Uso Rápido

```typescript
import { 
  NotFoundError, 
  ValidationError, 
  ErrorHandlerChain 
} from '@my-poc-monorepo/domain-errors';

// No domínio (use case, entity)
throw new NotFoundError('Company not found', { companyId: '123' });
throw new ValidationError('Invalid CNPJ', { field: 'cnpj' });

// Na camada de aplicação
const chain = ErrorHandlerChain.create();
const response = chain.handle(error);
// response: { statusCode: 404, code: 'NOT_FOUND', message: '...', ... }
```

## 📖 Documentação

Para documentação completa sobre o padrão Chain of Responsibility implementado, veja:

- [CHAIN_OF_RESPONSIBILITY.md](./CHAIN_OF_RESPONSIBILITY.md) - Documentação detalhada, exemplos e padrões

## 🏗️ Building

```bash
nx build domain-errors
```

## 🧪 Running unit tests

```bash
nx test domain-errors
```

## 📊 Princípios Seguidos

- ✅ **Separation of Concerns**: Domínio não conhece HTTP
- ✅ **Single Responsibility**: Cada handler tem uma responsabilidade
- ✅ **Open/Closed**: Extensível sem modificar código existente
- ✅ **Dependency Inversion**: Depende de abstrações (interfaces)
- ✅ **Clean Architecture**: Domínio puro, infraestrutura na borda
