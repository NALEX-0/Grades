/**
 * Integration tests for Stats API (/api/stats/average)
 * 
 * Tests:
 * - Returns total courses and average score
 * - Requires valid auth token
 */

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
    name: 'Stats Tester',
    email: 'stats@example.com',
    password: 'Password123'
  };

  await request(app).post('/api/users/register').send(user);
  const loginRes = await request(app).post('/api/users/login').send({
    email: user.email,
    password: user.password
  });

  token = loginRes.body.token;

  const semester = await prisma.semester.create({ data: { name: 'Fall 2025' } });
  const course1 = await prisma.course.create({ data: { name: 'Math', semesterId: semester.id } });
  const course2 = await prisma.course.create({ data: { name: 'History', semesterId: semester.id } });
  const exam = await prisma.examination.create({ data: { name: 'Midterm' } });

  await prisma.grade.createMany({
    data: [
      { score: 80, userId: loginRes.body.user.id, courseId: course1.id, examinationId: exam.id },
      { score: 90, userId: loginRes.body.user.id, courseId: course2.id, examinationId: exam.id }
    ]
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Stats API', () => {
  test('should return total courses and average score', async () => {
    const res = await request(app)
      .get('/api/stats/average')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.totalCourses).toBeGreaterThanOrEqual(2);
    expect(res.body.averageScore).toBeCloseTo(85, 0);
  });

  test('should return 401 if no token provided', async () => {
    const res = await request(app).get('/api/stats/average');
    expect(res.statusCode).toBe(401);
  });
});
