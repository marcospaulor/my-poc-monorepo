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
        createdCompanyId = response.body.id;
      });

      it('should sanitize HTML characters in successful creation', async () => {
        const response = await request(API_URL)
          .post('/api/companies')
          .send({
            name: "O'Reilly Books",
            address: 'Rua Test & Co, 123',
          })
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toContain('Reilly Books');
        expect(response.body.address).toContain('Test');
      });

      it('should handle special characters in Portuguese', async () => {
        const response = await request(API_URL)
          .post('/api/companies')
          .send({
            name: 'José & Ação Ltda',
            address: 'Rua São João, 123 - São Paulo/SP',
          })
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toContain('José');
        expect(response.body.address).toContain('São');
      });

      it('should allow SQL comments when not part of injection pattern', async () => {
        const response = await request(API_URL)
          .post('/api/companies')
          .send({
            name: 'Company -- Division A',
            address: 'Valid Address, 123',
          })
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toContain('Company');
      });

      it('should return 400 with proper error structure when name is empty', async () => {
        const response = await request(API_URL)
          .post('/api/companies')
          .send({
            name: '',
            address: 'Valid Address',
          })
          .expect(400);

        expect(response.body).toMatchObject({
          statusCode: 400,
          code: expect.any(String),
          path: '/api/companies',
          method: 'POST',
        });
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body.message).toContain('Validation failed');
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toBeInstanceOf(Array);
        expect(response.body.errors[0]).toMatchObject({
          field: 'name',
          message: expect.stringContaining('vazia'),
          code: expect.any(String),
        });
      });

      it('should return 400 when name is too short', async () => {
        const response = await request(API_URL)
          .post('/api/companies')
          .send({
            name: 'A',
            address: 'Valid Address',
          })
          .expect(400);

        expect(response.body).toMatchObject({
          statusCode: 400,
          path: '/api/companies',
          method: 'POST',
        });
        expect(response.body.message).toContain('Validation failed');
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors[0]).toMatchObject({
          field: 'name',
          message: expect.stringContaining('mínimo'),
        });
      });

      it('should return 400 when name is too long', async () => {
        const longName = 'A'.repeat(256);
        const response = await request(API_URL)
          .post('/api/companies')
          .send({
            name: longName,
            address: 'Valid Address',
          })
          .expect(400);

        expect(response.body).toMatchObject({
          statusCode: 400,
          path: '/api/companies',
          method: 'POST',
        });
        expect(response.body.message).toContain('Validation failed');
        expect(response.body.errors[0]).toMatchObject({
          field: 'name',
          message: expect.stringContaining('máximo'),
        });
      });

      it('should return 400 when address is too long', async () => {
        const longAddress = 'A'.repeat(501);
        const response = await request(API_URL)
          .post('/api/companies')
          .send({
            name: 'Valid Name',
            address: longAddress,
          })
          .expect(400);

        expect(response.body).toMatchObject({
          statusCode: 400,
          path: '/api/companies',
          method: 'POST',
        });
        expect(response.body.message).toContain('Validation failed');
        expect(response.body.errors[0]).toMatchObject({
          field: 'address',
          message: expect.stringContaining('máximo'),
        });
      });

      it('should return 400 when name contains only whitespace', async () => {
        const response = await request(API_URL)
          .post('/api/companies')
          .send({
            name: '   ',
            address: 'Valid Address',
          })
          .expect(400);

        expect(response.body).toMatchObject({
          statusCode: 400,
          path: '/api/companies',
          method: 'POST',
        });
        expect(response.body.message).toContain('Validation failed');
        expect(response.body.errors[0]).toMatchObject({
          field: 'name',
          message: expect.stringContaining('vazia'),
        });
      });

      it('should return 400 with multiple errors when multiple fields are invalid', async () => {
        const response = await request(API_URL)
          .post('/api/companies')
          .send({
            name: 'A',
            address: 'B',
          })
          .expect(400);

        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toBeInstanceOf(Array);
        expect(response.body.errors).toHaveLength(2);

        const nameError = response.body.errors.find(
          (e: { field: string }) => e.field === 'name'
        );
        const addressError = response.body.errors.find(
          (e: { field: string }) => e.field === 'address'
        );

        expect(nameError).toBeDefined();
        expect(addressError).toBeDefined();
        expect(nameError.message).toContain('mínimo');
        expect(addressError.message).toContain('mínimo');
      });

      it('should return 400 when XSS is detected in name field', async () => {
        const response = await request(API_URL)
          .post('/api/companies')
          .send({
            name: '<script>alert("XSS")</script>',
            address: 'Valid Address',
          })
          .expect(400);

        expect(response.body).toMatchObject({
          statusCode: 400,
          path: '/api/companies',
          method: 'POST',
          code: expect.any(String),
        });
        expect(response.body.message).toContain('Validation failed');
        expect(response.body.errors[0].message).toMatch(
          /XSS|script|malicioso/i
        );
      });

      it('should return 400 when XSS is detected in address field', async () => {
        const response = await request(API_URL)
          .post('/api/companies')
          .send({
            name: 'Valid Name',
            address: '<style>body{display:none}</style>',
          })
          .expect(400);

        expect(response.body).toMatchObject({
          statusCode: 400,
          path: '/api/companies',
          method: 'POST',
          code: expect.any(String),
        });
        expect(response.body.message).toContain('Validation failed');
        expect(response.body.errors[0].message).toMatch(/XSS|style|malicioso/i);
      });

      it('should return 400 when javascript protocol is detected', async () => {
        const response = await request(API_URL)
          .post('/api/companies')
          .send({
            name: 'Valid Name',
            address: 'javascript:alert("XSS")',
          })
          .expect(400);

        expect(response.body.statusCode).toBe(400);
      });

      it('should return 400 when SQL injection is detected with DROP TABLE', async () => {
        const response = await request(API_URL)
          .post('/api/companies')
          .send({
            name: "Robert'; DROP TABLE companies;--",
            address: 'Valid Address',
          })
          .expect(400);

        expect(response.body).toMatchObject({
          statusCode: 400,
          path: '/api/companies',
          method: 'POST',
          code: expect.any(String),
        });
        expect(response.body.message).toContain('Validation failed');
        expect(response.body.errors[0].message).toMatch(
          /SQL|injection|injeção/i
        );
      });

      it('should return 400 when SQL injection is detected with UNION SELECT', async () => {
        const response = await request(API_URL)
          .post('/api/companies')
          .send({
            name: 'Valid Name',
            address: "' UNION SELECT * FROM users--",
          })
          .expect(400);

        expect(response.body).toMatchObject({
          statusCode: 400,
          path: '/api/companies',
          method: 'POST',
          code: expect.any(String),
        });
        expect(response.body.message).toContain('Validation failed');
        expect(response.body.errors[0].message).toMatch(
          /SQL|injection|injeção/i
        );
      });

      it('should return 400 when SQL injection is detected with UNION SELECT', async () => {
        const response = await request(API_URL)
          .post('/api/companies')
          .send({
            name: 'Valid Name',
            address: "' UNION SELECT * FROM users--",
          })
          .expect(400);

        expect(response.body).toMatchObject({
          statusCode: 400,
          path: '/api/companies',
          method: 'POST',
          code: expect.any(String),
        });
        expect(response.body.message).toContain('Validation failed');
        expect(response.body.errors[0].message).toMatch(
          /SQL|injection|injeção/i
        );
      });
    });

    describe('GET /companies', () => {
      it('should return a list of companies with correct structure', async () => {
        const response = await request(API_URL)
          .get('/api/companies')
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);

        const company = response.body.find(
          (c: { id: string; name: string; address: string }) =>
            c.id === createdCompanyId
        );
        
        expect(company).toMatchObject({
          id: createdCompanyId,
          name: 'Test Company E2E',
          address: 'Rua de Teste, 123 - São Paulo/SP',
        });
        expect(company).toHaveProperty('createdAt');
        expect(company).toHaveProperty('createdAtFormatted');
      });
    });

    describe('GET /companies/:id', () => {
      it('should return a company by id with correct structure', async () => {
        const response = await request(API_URL)
          .get(`/api/companies/${createdCompanyId}`)
          .expect(200);
        
        expect(response.body).toMatchObject({
          id: createdCompanyId,
          name: 'Test Company E2E',
          address: 'Rua de Teste, 123 - São Paulo/SP',
        });
        expect(response.body).toHaveProperty('createdAt');
        expect(response.body).toHaveProperty('createdAtFormatted');
      });

      it('should return 404 when company not found with valid UUID', async () => {
        const nonExistentId = '123e4567-e89b-12d3-a456-426614174000';
        const response = await request(API_URL)
          .get(`/api/companies/${nonExistentId}`)
          .expect(404);

        expect(response.body).toMatchObject({
          statusCode: 404,
          message: expect.any(String),
          code: expect.any(String),
          path: `/api/companies/${nonExistentId}`,
          method: 'GET',
        });
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body.message).toContain('não encontrada');
        expect(response.body).toHaveProperty('context');
        expect(response.body.context).toHaveProperty(
          'companyId',
          nonExistentId
        );
      });

      it('should return 404 when id is not a valid UUID', async () => {
        const invalidId = 'invalid-uuid';
        const response = await request(API_URL)
          .get(`/api/companies/${invalidId}`)
          .expect(404);

        expect(response.body).toMatchObject({
          statusCode: 404,
          path: `/api/companies/${invalidId}`,
          method: 'GET',
        });
      });
    });

    describe('Error Response Structure', () => {
      it('should always include required fields in error response', async () => {
        const response = await request(API_URL)
          .post('/api/companies')
          .send({
            name: '',
            address: 'Valid Address',
          })
          .expect(400);

        expect(response.body).toHaveProperty('statusCode');
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('code');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body).toHaveProperty('path');
        expect(response.body).toHaveProperty('method');

        expect(typeof response.body.statusCode).toBe('number');
        expect(typeof response.body.message).toBe('string');
        expect(typeof response.body.code).toBe('string');
        expect(typeof response.body.timestamp).toBe('string');
        expect(typeof response.body.path).toBe('string');
        expect(typeof response.body.method).toBe('string');
      });

      it('should format timestamp as ISO 8601', async () => {
        const response = await request(API_URL)
          .post('/api/companies')
          .send({
            name: '',
            address: 'Valid Address',
          })
          .expect(400);

        expect(response.body.timestamp).toMatch(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
        );

        const timestamp = new Date(response.body.timestamp);
        expect(timestamp).toBeInstanceOf(Date);
        expect(timestamp.getTime()).not.toBeNaN();
      });
    });
  });
});
