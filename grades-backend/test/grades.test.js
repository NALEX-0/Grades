const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

let token;
let courseId;
let examId;

/**
 * Integration tests for Grade API..
 *
 * Tests:
 * - Creating a grade
 * - Failing with missing fields
 * - Retrieving user grades
 * - Updating grade
 * - Deleting grade
 */
beforeEach(async () => {
  await prisma.grade.deleteMany();
  await prisma.course.deleteMany();
  await prisma.examination.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.user.deleteMany();

  const user = {
    name: 'Grade Tester',
    email: 'gradetest@example.com',
    password: 'Password123',
  };

  await request(app).post('/api/users/register').send(user);

  const loginRes = await request(app).post('/api/users/login').send({
    email: user.email,
    password: user.password,
  });

  token = loginRes.body.token;

  const semester = await prisma.semester.create({ data: { name: 'Spring 2025' } });

  const course = await prisma.course.create({
    data: {
      name: 'Math 101',
      semesterId: semester.id,
    },
  });

  const exam = await prisma.examination.create({ data: { name: 'Final Exam' } });

  courseId = course.id;
  examId = exam.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Grade API', () => {
  it('should create a grade', async () => {
    const res = await request(app)
      .post('/api/grades')
      .set('Authorization', `Bearer ${token}`)
      .send({
        courseId,
        examinationId: examId,
        score: 88,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.grade).toHaveProperty('id');
    expect(res.body.grade.score).toBe(88);
  });

  it('should fail with missing fields', async () => {
    const res = await request(app)
      .post('/api/grades')
      .set('Authorization', `Bearer ${token}`)
      .send({ score: 90 });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });

  it('should retrieve all grades for user', async () => {
    await prisma.grade.create({
      data: {
        score: 91,
        courseId,
        examinationId: examId,
        userId: (await prisma.user.findFirst()).id,
      },
    });

    const res = await request(app)
      .get('/api/grades')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should update a grade', async () => {
    const grade = await prisma.grade.create({
      data: {
        score: 75,
        courseId,
        examinationId: examId,
        userId: (await prisma.user.findFirst()).id,
      },
    });

    const res = await request(app)
      .put(`/api/grades/${grade.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ score: 95 });

    expect(res.statusCode).toBe(200);
    expect(res.body.grade.score).toBe(95);
  });

  it('should delete a grade', async () => {
    const grade = await prisma.grade.create({
      data: {
        score: 60,
        courseId,
        examinationId: examId,
        userId: (await prisma.user.findFirst()).id,
      },
    });

    const res = await request(app)
      .delete(`/api/grades/${grade.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });
});
