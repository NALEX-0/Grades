const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

let token;

beforeEach(async () => {
  await prisma.grade.deleteMany();
  await prisma.course.deleteMany();
  await prisma.examination.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.user.deleteMany();

  const user = {
    name: 'Exam Tester',
    email: 'examuser@example.com',
    password: 'Password123',
  };

  await request(app).post('/api/users/register').send(user);
  const loginRes = await request(app).post('/api/users/login').send({
    email: user.email,
    password: user.password,
  });

  token = loginRes.body.token;
});

afterAll(async () => {
  await prisma.$disconnect();
});

/**
 * Integration tests for Examination API.
 * 
 * Tests:
 * - Creating an examination (success, duplicate name, and missing name)
 * - Retrieving all examinations
 * - Retrieving by ID and name
 * - Updating an examination (success and 404)
 * - Accessing endpoints without token
 */
describe('Examination API (authenticated)', () => {
  test('should create an examination', async () => {
    const res = await request(app)
      .post('/api/examinations')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Exam' });

    expect(res.statusCode).toBe(201);
    expect(res.body.exam).toHaveProperty('id');
  });

  test('should return 400 if name is missing', async () => {
    const res = await request(app)
      .post('/api/examinations')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });

  test('should return 400 if exam name already exists', async () => {
    await prisma.examination.create({ data: { name: 'Duplicate Exam' } });

    const res = await request(app)
      .post('/api/examinations')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Duplicate Exam' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/already exists/i);
  });

  test('should get all examinations', async () => {
    await prisma.examination.createMany({
      data: [{ name: 'Exam 1' }, { name: 'Exam 2' }],
    });

    const res = await request(app)
      .get('/api/examinations')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  test('should return specific exam by ID', async () => {
    const exam = await prisma.examination.create({ data: { name: 'ID Test' } });

    const res = await request(app)
      .get(`/api/examinations/${exam.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('ID Test');
  });

  test('should return 404 if exam ID not found', async () => {
    const res = await request(app)
      .get('/api/examinations/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  test('should return specific exam by name', async () => {
    await prisma.examination.create({ data: { name: 'ByName' } });

    const res = await request(app)
      .get('/api/examinations/name/ByName')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('ByName');
  });

  test('should return 404 if name not found', async () => {
    const res = await request(app)
      .get('/api/examinations/name/Nonexistent')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  test('should update an exam name', async () => {
    const exam = await prisma.examination.create({ data: { name: 'Old Name' } });

    const res = await request(app)
      .put(`/api/examinations/${exam.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Name' });

    expect(res.statusCode).toBe(200);
    expect(res.body.exam.name).toBe('New Name');
  });

  test('should return 404 if updating non-existent exam', async () => {
    const res = await request(app)
      .put('/api/examinations/99999')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Anything' });

    expect(res.statusCode).toBe(404);
  });

  test('should return 401 if no token is provided', async () => {
    const res = await request(app)
      .get('/api/examinations');

    expect(res.statusCode).toBe(401);
  });
});
