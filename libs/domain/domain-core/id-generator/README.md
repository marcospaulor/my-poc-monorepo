# @my-poc-monorepo/id-generator

Generic ID Generator library with pluggable strategies.

## Features

- 🔌 **Pluggable Strategy Pattern**: Switch between different ID generation algorithms
- 🛡️ **Type-Safe**: Full TypeScript support with interfaces
- 🎯 **Default UUID v4**: Secure random UUID generation out of the box
- 🧪 **Testable**: Easy to mock and test with custom providers
- 🔧 **Extensible**: Create custom providers for ULID, nanoid, cuid, or any other format

## Installation

This is an internal library within the monorepo. Import using the configured path:

```typescript
import { IdGenerator, IdProvider } from '@my-poc-monorepo/id-generator';
```

## Usage

### Basic Usage (UUID v4)

```typescript
import { IdGenerator } from '@my-poc-monorepo/id-generator';

// Generate a new UUID
const id = IdGenerator.generate();
// => "550e8400-e29b-41d4-a716-446655440000"

// Validate an ID
if (IdGenerator.isValid(id)) {
  console.log('Valid UUID');
}
```

### Custom Provider

Create your own ID generation strategy:

```typescript
import { IdProvider, IdGenerator } from '@my-poc-monorepo/id-generator';

// Example: Simple incremental ID provider
class IncrementalProvider implements IdProvider {
  private counter = 0;

  generate(): string {
    return `ID-${++this.counter}`;
  }

  isValid(id: string): boolean {
    return /^ID-\d+$/.test(id);
  }
}

// Use the custom provider
IdGenerator.setProvider(new IncrementalProvider());
console.log(IdGenerator.generate()); // => "ID-1"
console.log(IdGenerator.generate()); // => "ID-2"
```

### Example: ULID Provider

```typescript
import { IdProvider, IdGenerator } from '@my-poc-monorepo/id-generator';
import { ulid } from 'ulid'; // external package

class UlidProvider implements IdProvider {
  generate(): string {
    return ulid();
  }

  isValid(id: string): boolean {
    return /^[0-9A-HJKMNP-TV-Z]{26}$/.test(id);
  }
}

IdGenerator.setProvider(new UlidProvider());
const id = IdGenerator.generate();
// => "01ARZ3NDEKTSV4RRFFQ69G5FAV"
```

### Testing

Reset to default provider in tests:

```typescript
import { IdGenerator, IdProvider } from '@my-poc-monorepo/id-generator';

describe('MyService', () => {
  beforeEach(() => {
    // Reset to default UUID provider
    IdGenerator.reset();
  });

  it('should use fixed IDs for testing', () => {
    // Mock provider for predictable tests
    const mockProvider: IdProvider = {
      generate: () => 'test-id-123',
      isValid: (id) => id === 'test-id-123',
    };

    IdGenerator.setProvider(mockProvider);
    const id = IdGenerator.generate();
    
    expect(id).toBe('test-id-123');
  });
});
```

## API

### `IdGenerator`

Static class for ID generation.

#### Methods

- **`generate(): string`**
  - Generates a new unique identifier using the current provider
  
- **`isValid(id: string): boolean`**
  - Validates if a given string is valid for the current provider
  
- **`setProvider(provider: IdProvider): void`**
  - Sets a custom ID generation strategy
  
- **`getProvider(): IdProvider`**
  - Gets the current provider instance
  
- **`reset(): void`**
  - Resets to the default UUID v4 provider

### `IdProvider` Interface

Interface for creating custom ID providers.

```typescript
interface IdProvider {
  generate(): string;
  isValid(id: string): boolean;
}
```

### `UuidProvider`

Default UUID v4 provider implementation.

```typescript
import { UuidProvider } from '@my-poc-monorepo/id-generator';

const provider = new UuidProvider();
const uuid = provider.generate();
```

## Design Patterns

This library uses:

- **Strategy Pattern**: Allows swapping ID generation algorithms at runtime
- **Static Singleton**: Single global instance for convenience
- **Open/Closed Principle**: Open for extension (custom providers), closed for modification

## Possible Providers

You can create providers for:

- ✅ **UUID v4** (included by default)
- 📦 **ULID**: Sortable, time-based IDs
- 📦 **nanoid**: Short, URL-safe IDs
- 📦 **cuid**: Collision-resistant IDs
- 📦 **ksuid**: K-sortable unique IDs
- 📦 **Snowflake**: Twitter's distributed ID system
- 📦 **ObjectId**: MongoDB-style IDs
- 🔢 **Sequential**: Database-like incremental IDs

## Running Tests

```bash
npx nx test id-generator
```

## License

MIT
