const request = require('supertest');
const app = require('../app');
const {_resetUsers} = require('../controllers/authController');

describe('Authentication API Tests', () => {
    beforeEach(() => {
      _resetUsers(); // Here I am resetting the mock database I created 
    });
  
    describe('Login Page Access', () => {
      test('Buyer can access login page', async () => {
        const res = await request(app)
          .get('/login')
          .expect('Content-Type', /html/)
          .expect(200);
        
        expect(res.text).toMatch(/<form.*?action="\/login"/i);
        expect(res.text).toMatch(/<input.*?name="username"/i);
        expect(res.text).toMatch(/<input.*?name="password"/i);
      });
  
      test('Seller sees appropriate login message', async () => {
        const res = await request(app)
          .get('/login')
          .expect(200);
        
        expect(res.text).toMatch(/Login to your account/i);
      });
    });
  
    describe('User Authentication', () => {
      test('Buyer can authenticate with valid credentials', async () => {
        // First register a test buyer
        await request(app)
          .post('/register')
          .send({
            email: 'buyer@test.com',
            username: 'test_buyer',
            password: 'valid_password',
            role: 'buyer'
          });
  
        const res = await request(app)
          .post('/login')
          .send({
            username: 'test_buyer',
            password: 'valid_password'
          })
          .expect(200);
  
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('role', 'buyer');
        expect(res.headers['set-cookie']).toBeDefined();
      });
    });
  
    describe('User Registration', () => {
      test('New user can register as buyer', async () => {
        const testUser = {
          email: `test${Date.now()}@example.com`,
          username: `user${Date.now()}`,
          password: 'SecurePass123!',
          role: 'buyer'
        };
  
        const res = await request(app)
          .post('/register')
          .send(testUser)
          .expect(201);
  
        expect(res.body).toHaveProperty('id');
        expect(res.body.email).toBe(testUser.email);
        expect(res.body.role).toBe(testUser.role);
      });

      test('New user can register as seller', async () => {
        const testSeller = {
          email: `seller${Date.now()}@example.com`,
          username: `seller${Date.now()}`,
          password: 'SellerPass123!',
          role: 'seller'
        };
      
        const res = await request(app)
          .post('/register')
          .send(testSeller)
          .expect(201);
      
        expect(res.body).toHaveProperty('id');
        expect(res.body.email).toBe(testSeller.email);
        expect(res.body.role).toBe(testSeller.role);
      
        await request(app)
          .post('/login')
          .send({
            username: testSeller.username,
            password: testSeller.password
          })
          .expect(200)
          .then(res => {
            expect(res.body).toHaveProperty('role', 'seller');
          });
      });
    });
  });