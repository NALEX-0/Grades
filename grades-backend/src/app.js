const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.routes');
const examinationRoutes = require('./routes/examination.routes');
const semesterRoutes = require('./routes/semester.routes');
const courseRoutes = require('./routes/course.routes');
const gradeRoutes = require('./routes/grade.routes');
const statsRoutes = require('./routes/stats.routes');


app.use('/api/users', authRoutes);
app.use('/api/examinations', examinationRoutes);
app.use('/api/semesters', semesterRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/stats', statsRoutes);


module.exports = app;
