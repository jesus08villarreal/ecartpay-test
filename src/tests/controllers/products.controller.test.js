const request = require('supertest');
const app = require('../../app');
const Product = require('../../models/Product');
const { createTestUser } = require('../helpers/auth.helper');

describe('Products Controller', () => {
  let token;
  let user;

  beforeEach(async () => {
    const testData = await createTestUser();
    token = testData.token;
    user = testData.user;
  });

  describe('GET /api/v1/products', () => {
    it('should get all products', async () => {
      // Crear algunos productos de prueba
      await Product.create([
        {
          name: 'Test Product 1',
          description: 'Test Description 1',
          price: 99.99,
          stock: 10,
          category: 'Test Category',
          createdBy: user._id
        },
        {
          name: 'Test Product 2',
          description: 'Test Description 2',
          price: 149.99,
          stock: 15,
          category: 'Test Category',
          createdBy: user._id
        }
      ]);

      const response = await request(app)
        .get('/api/v1/products')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/v1/products');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return empty array when no products exist', async () => {
      const response = await request(app)
        .get('/api/v1/products')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('POST /api/v1/products', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'New Product',
        description: 'New Product Description',
        price: 99.99,
        stock: 10,
        category: 'Test Category'
      };

      const response = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(productData.name);

      // Verificar que el producto existe en la base de datos
      const product = await Product.findById(response.body.data._id);
      expect(product).toBeTruthy();
    });

    it('should not create product with invalid data', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test',
          // Faltan campos requeridos
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should validate minimum price', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Product',
          description: 'Test Description',
          price: -10,
          stock: 10,
          category: 'Test'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should validate minimum stock', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Product',
          description: 'Test Description',
          price: 99.99,
          stock: -1,
          category: 'Test'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/products/:id', () => {
    it('should update product successfully', async () => {
      const product = await Product.create({
        name: 'Original Product',
        description: 'Original Description',
        price: 99.99,
        stock: 10,
        category: 'Test Category',
        createdBy: user._id
      });

      const updateData = {
        name: 'Updated Product',
        price: 149.99
      };

      const response = await request(app)
        .put(`/api/v1/products/${product._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
    });

    it('should not update product of another user', async () => {
      // Crear otro usuario
      const otherUser = await createTestUser({
        email: 'other@example.com'
      });

      // Crear producto con el otro usuario
      const product = await Product.create({
        name: 'Other User Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
        category: 'Test Category',
        createdBy: otherUser.user._id
      });

      const response = await request(app)
        .put(`/api/v1/products/${product._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Name'
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .put(`/api/v1/products/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Name'
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/products/:id', () => {
    it('should delete product successfully', async () => {
      const product = await Product.create({
        name: 'Product to Delete',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
        category: 'Test Category',
        createdBy: user._id
      });

      const response = await request(app)
        .delete(`/api/v1/products/${product._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verificar que el producto fue eliminado
      const deletedProduct = await Product.findById(product._id);
      expect(deletedProduct).toBeNull();
    });

    it('should not delete product of another user', async () => {
      const otherUser = await createTestUser({
        email: 'other@example.com'
      });

      const product = await Product.create({
        name: 'Other User Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
        category: 'Test Category',
        createdBy: otherUser.user._id
      });

      const response = await request(app)
        .delete(`/api/v1/products/${product._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);

      // Verificar que el producto no fue eliminado
      const productStillExists = await Product.findById(product._id);
      expect(productStillExists).toBeTruthy();
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .delete(`/api/v1/products/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
}); 