const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/prisma/client');
const { beforeEach, afterAll, describe, test, expect } = require('@jest/globals');

beforeEach(async () => {
  await prisma.grade.deleteMany();
  await prisma.examination.deleteMany();
  await prisma.course.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

/**
 * Integration tests for Auth (User Registration and Login) API.
 * 
 * Tests:
 * - Successful user registration
 * - Duplicate email registration failure
 * - Registration with missing fields
 * - Successful login
 * - Login failure with incorrect email or password
 * - Login failure with missing fields
 */

describe('Auth Routes', () => {
  const validUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPassword123',
  };

  describe('POST /api/users/register', () => {
    test('should register a new user', async () => {
      const res = await request(app).post('/api/users/register').send(validUser);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.email).toBe(validUser.email);
    });

    test('should not allow duplicate email', async () => {
      await prisma.user.create({ data: validUser });
      const res = await request(app).post('/api/users/register').send(validUser);
      expect(res.statusCode).toBe(409);
    });

    test('should return 400 for missing fields', async () => {
      const res = await request(app).post('/api/users/register').send({ email: 'x' });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/users/register').send(validUser);
    });

    test('should login successfully with correct credentials', async () => {
      const res = await request(app).post('/api/users/login').send({
        email: validUser.email,
        password: validUser.password,
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(validUser.email);
    });

    test('should reject invalid email', async () => {
      const res = await request(app).post('/api/users/login').send({
        email: 'wrong@example.com',
        password: validUser.password,
      });
      expect(res.statusCode).toBe(401);
    });

    test('should reject invalid password', async () => {
      const res = await request(app).post('/api/users/login').send({
        email: validUser.email,
        password: 'WrongPassword',
      });
      expect(res.statusCode).toBe(401);
    });

    test('should return 400 for missing credentials', async () => {
      const res = await request(app).post('/api/users/login').send({});
      expect(res.statusCode).toBe(400);
    });
  });
});
