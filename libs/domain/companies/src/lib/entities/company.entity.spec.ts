import { Company } from './company.entity';

describe('Company Entity', () => {
  describe('constructor', () => {
    it('should create a company with provided id, name and address', () => {
      // Arrange
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const name = 'Test Company';
      const address = 'Rua das Flores, 123 - São Paulo/SP';

      // Act
      const company = new Company(id, name, address);

      // Assert
      expect(company.id).toBe(id);
      expect(company.name).toBe(name);
      expect(company.address).toBe(address);
    });
  });

  describe('create', () => {
    it('should create a company with auto-generated UUID', () => {
      // Arrange
      const name = 'New Company';
      const address = 'Av. Paulista, 1000 - São Paulo/SP';

      // Act
      const company = Company.create(name, address);

      // Assert
      expect(company.id).toBeDefined();
      expect(company.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
      expect(company.name).toBe(name);
      expect(company.address).toBe(address);
    });

    it('should create different companies with unique IDs', () => {
      // Arrange
      const name = 'Company Name';
      const address = 'Company Address';

      // Act
      const company1 = Company.create(name, address);
      const company2 = Company.create(name, address);

      // Assert
      expect(company1.id).not.toBe(company2.id);
    });
  });

  describe('getters', () => {
    it('should return name through getter', () => {
      // Arrange
      const name = 'Test Company';
      const company = Company.create(name, 'Test Address');

      // Act
      const result = company.name;

      // Assert
      expect(result).toBe(name);
    });

    it('should return address through getter', () => {
      // Arrange
      const address = 'Test Address';
      const company = Company.create('Test Company', address);

      // Act
      const result = company.address;

      // Assert
      expect(result).toBe(address);
    });
  });
});
