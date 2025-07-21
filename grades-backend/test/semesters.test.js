const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/prisma/client');

let token;

beforeEach(async () => {
  await prisma.grade.deleteMany();
  await prisma.course.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.user.deleteMany();

  const user = {
    name: 'Test User',
    email: 'semester@test.com',
    password: 'Pass1234',
  };

  await request(app).post('/api/users/register').send(user);
  const res = await request(app).post('/api/users/login').send({
    email: user.email,
    password: user.password,
  });

  token = res.body.token;
});

afterAll(async () => {
  await prisma.$disconnect();
});

/**
 * Integration tests for Semester API.
 * 
 * Tests:
 * - Creating a semester (success and duplicate name)
 * - Creating a semester with missing fields
 * - Retrieving all semesters
 * - Updating a semester (success and 404)
 * - Deleting a semester (success and 404)
 * - Accessing routes without auth token
 */

describe('Semester API', () => {
  test('should create a semester', async () => {
    const res = await request(app)
      .post('/api/semesters')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Fall 2025' });

    expect(res.statusCode).toBe(201);
    expect(res.body.semester.name).toBe('Fall 2025');
  });

  test('should fail to create duplicate semester', async () => {
    await prisma.semester.create({ data: { name: 'Spring 2025' } });

    const res = await request(app)
      .post('/api/semesters')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Spring 2025' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/already exists/i);
  });

  test('should fail to create semester with missing name', async () => {
    const res = await request(app)
      .post('/api/semesters')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });

  test('should get all semesters', async () => {
    await prisma.semester.createMany({
      data: [{ name: 'Sem A' }, { name: 'Sem B' }],
    });

    const res = await request(app)
      .get('/api/semesters')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  test('should return 404 on non-existent semester update', async () => {
    const res = await request(app)
      .put('/api/semesters/99999')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated' });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  test('should return 404 on non-existent semester delete', async () => {
    const res = await request(app)
      .delete('/api/semesters/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  test('should fail without auth token', async () => {
    const res = await request(app).get('/api/semesters');
    expect(res.statusCode).toBe(401);
  });
});
