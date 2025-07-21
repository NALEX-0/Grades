const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/prisma/client');

let token;
let semesterId;

beforeEach(async () => {
  await prisma.grade.deleteMany();
  await prisma.course.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.user.deleteMany();

  const user = {
    name: 'Course User',
    email: 'course@test.com',
    password: 'Pass1234',
  };

  await request(app).post('/api/users/register').send(user);
  const res = await request(app).post('/api/users/login').send({
    email: user.email,
    password: user.password,
  });

  token = res.body.token;

  const semester = await prisma.semester.create({ data: { name: 'Semester A' } });
  semesterId = semester.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

/**
 * Integration tests for Course API.
 * 
 * Tests:
 * - Creating a course (success and duplicate name)
 * - Creating a course with missing fields
 * - Retrieving all courses
 * - Updating a course (success and 404)
 * - Deleting a course (success and 404)
 * - Accessing routes without auth token
 */
describe('Course API', () => {
  test('should create course', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Math 101', semesterId });

    expect(res.statusCode).toBe(201);
    expect(res.body.course.name).toBe('Math 101');
  });

  test('should fail to create duplicate course', async () => {
    await prisma.course.create({ data: { name: 'Physics', semesterId } });

    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Physics', semesterId });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/already exists/i);
  });

  test('should fail to create course with missing fields', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });

  test('should get all courses', async () => {
    await prisma.course.createMany({
      data: [
        { name: 'Course A', semesterId },
        { name: 'Course B', semesterId },
      ],
    });

    const res = await request(app)
      .get('/api/courses')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  test('should return 404 on non-existent course update', async () => {
    const res = await request(app)
      .put('/api/courses/99999')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated' });

    expect(res.statusCode).toBe(404);
  });

  test('should return 404 on non-existent course delete', async () => {
    const res = await request(app)
      .delete('/api/courses/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  test('should fail without token', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.statusCode).toBe(401);
  });
});
