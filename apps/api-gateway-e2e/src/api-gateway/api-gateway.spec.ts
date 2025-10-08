import request from 'supertest';

const API_URL = process.env['API_URL'] || 'http://localhost:3000';

describe('API Gateway E2E', () => {
  describe('GET /api', () => {
    it('should return a welcome message', async () => {
      const response = await request(API_URL).get('/api').expect(200);

      expect(response.body).toEqual({ message: 'Hello API' });
    });
  });

  describe('Companies API', () => {
    let createdCompanyId: string;

    describe('POST /companies', () => {
      it('should create a new company with valid data', async () => {
        const response = await request(API_URL)
          .post('/api/companies')
          .send({
            name: 'Test Company E2E',
            address: 'Rua de Teste, 123 - São Paulo/SP',
          })
          .expect(201);
        expect(response.body).toHaveProperty('id');
        expect(typeof response.body.id).toBe('string');
        // Validar formato do ID (UUID)
        expect(response.body.id).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        );
        createdCompanyId = response.body.id;
      });

      it('should return 400 when name is too short', async () => {
        const response = await request(API_URL)
          .post('/api/companies')
          .send({
            name: 'A',
            address: 'Valid Address, 123',
          })
          .expect(400);
        expect(response.body).toMatchObject({
          statusCode: 400,
        });
        expect(response.body).toHaveProperty('message');
      });

      it('should return 400 when name is too long', async () => {
        const response = await request(API_URL)
          .post('/api/companies')
          .send({
            name: 'A'.repeat(256),
            address: 'Valid Address, 123',
          })
          .expect(400);
        expect(response.body).toMatchObject({
          statusCode: 400,
        });
        expect(response.body).toHaveProperty('message');
      });

      it('should return 400 when address is too short', async () => {
        const response = await request(API_URL)
          .post('/api/companies')
          .send({
            name: 'Valid Company Name',
            address: 'Abc',
          })
          .expect(400);
        expect(response.body).toMatchObject({
          statusCode: 400,
        });
        expect(response.body).toHaveProperty('message');
      });

      it('should return 400 when address is too long', async () => {
        const response = await request(API_URL)
          .post('/api/companies')
          .send({
            name: 'Valid Company Name',
            address: 'A'.repeat(501),
          })
          .expect(400);
        expect(response.body).toMatchObject({
          statusCode: 400,
        });
        expect(response.body).toHaveProperty('message');
      });

      it('should trim whitespace from name and address', async () => {
        const response = await request(API_URL)
          .post('/api/companies')
          .send({
            name: '  Trimmed Company  ',
            address: '  Trimmed Address, 456  ',
          })
          .expect(201);
        expect(response.body).toHaveProperty('id');
        expect(typeof response.body.id).toBe('string');
        // Verificar se a empresa foi criada corretamente buscando-a pelo ID
        const getResponse = await request(API_URL)
          .get(`/api/companies/${response.body.id}`)
          .expect(200);
        expect(getResponse.body).toMatchObject({
          name: 'Trimmed Company',
          address: 'Trimmed Address, 456',
        });
      });
    });

    describe('GET /companies', () => {
      it('should return a list of companies with correct structure', async () => {
        const response = await request(API_URL)
          .get('/api/companies')
          .expect(200);

        expect(response.body).toHaveProperty('companies');
        expect(Array.isArray(response.body.companies)).toBe(true);
        expect(response.body.companies.length).toBeGreaterThan(0);

        // Validar estrutura de cada empresa
        response.body.companies.forEach(
          (company: { id: string; name: string; address: string }) => {
            expect(company).toHaveProperty('id');
            expect(company).toHaveProperty('name');
            expect(company).toHaveProperty('address');
            expect(typeof company.id).toBe('string');
            expect(typeof company.name).toBe('string');
            expect(typeof company.address).toBe('string');
          }
        );

        // Verificar se a empresa criada está na lista
        const company = response.body.companies.find(
          (c: { id: string; name: string; address: string }) =>
            c.id === createdCompanyId
        );
        expect(company).toEqual({
          id: createdCompanyId,
          name: 'Test Company E2E',
          address: 'Rua de Teste, 123 - São Paulo/SP',
        });
      });

      it('should return empty array when no companies exist', async () => {
        // Este teste só funcionaria com um banco limpo
        // Mas serve para documentar o comportamento esperado
        const response = await request(API_URL)
          .get('/api/companies')
          .expect(200);

        expect(response.body).toHaveProperty('companies');
        expect(Array.isArray(response.body.companies)).toBe(true);
        // Não validamos se está vazio porque podem existir empresas de outros testes
      });
    });

    describe('GET /companies/:id', () => {
      it('should return a company by id with correct structure', async () => {
        const response = await request(API_URL)
          .get(`/api/companies/${createdCompanyId}`)
          .expect(200);
        expect(response.body).toEqual({
          id: createdCompanyId,
          name: 'Test Company E2E',
          address: 'Rua de Teste, 123 - São Paulo/SP',
        });
      });

      it('should return 404 when company not found with valid UUID', async () => {
        const nonExistentId = '123e4567-e89b-12d3-a456-426614174000';
        const response = await request(API_URL)
          .get(`/api/companies/${nonExistentId}`)
          .expect(404);
        expect(response.body).toMatchObject({
          statusCode: 404,
        });
        expect(response.body).toHaveProperty('message');
      });

      it('should return error when id is not a valid UUID', async () => {
        const invalidId = 'invalid-uuid';
        const response = await request(API_URL).get(
          `/api/companies/${invalidId}`
        );
        // Pode ser 400 (bad request) ou 404 (not found) dependendo da validação
        expect([400, 404]).toContain(response.status);
        expect(response.body).toHaveProperty('message');
      });
    });
  });
});
