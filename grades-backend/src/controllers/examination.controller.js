const prisma = require('../prisma/client');

/**
 * Create a new examination.
 * @route POST /api/examinations
 * @param {string} req.body.name - The name of the examination (must be unique)
 * @returns 201 - Examination created
 * @returns 400 - Missing or duplicate name
 * @returns 500 - Server error
 */
async function createExamination(req, res) {
  const name = req.body.name?.trim();

  if (!name) {
    return res.status(400).json({ error: 'Examination name is required' });
  }

  try {
    const existing = await prisma.examination.findUnique({ where: { name } });
    if (existing) {
      return res.status(400).json({ error: 'Examination name already exists' });
    }

    const exam = await prisma.examination.create({ data: { name } });
    return res.status(201).json({ message: 'Examination created', exam });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create examination' });
  }
}

/**
 * Get all examinations.
 * @route GET /api/examinations
 * @returns 200 - Array of examinations
 * @returns 500 - Server error
 */
async function getAllExaminations(req, res) {
  try {
    const exams = await prisma.examination.findMany();
    return res.status(200).json(exams);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch examinations' });
  }
}

/**
 * Get a specific examination by ID.
 * @route GET /api/examinations/:id
 * @param {string} req.params.id - Examination ID
 * @returns 200 - Examination object
 * @returns 404 - Not found
 * @returns 500 - Server error
 */
async function getExaminationById(req, res) {
  const { id } = req.params;

  try {
    const exam = await prisma.examination.findUnique({
      where: { id: parseInt(id) },
    });

    if (!exam) {
      return res.status(404).json({ error: 'Examination not found' });
    }

    return res.status(200).json(exam);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch examination' });
  }
}

/**
 * Get an examination by name.
 * @route GET /api/examinations/name/:name
 * @param {string} req.params.name - Examination name
 * @returns 200 - Examination object
 * @returns 404 - Not found
 * @returns 500 - Server error
 */
async function getExaminationByName(req, res) {
  const { name } = req.params;

  try {
    const exam = await prisma.examination.findUnique({ where: { name } });

    if (!exam) {
      return res.status(404).json({ error: 'Examination not found' });
    }

    return res.status(200).json(exam);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch examination' });
  }
}

/**
 * Search examinations by name.
 * @route GET /api/examinations/search
 * @query query - Partial examination name
 * @returns 200 - Examination object
 * @returns 500 - Server error
 */
async function searchExaminations(req, res) {
  const { query } = req.query;

  if (!query || query.trim().length < 1) {
    return res.status(400).json({ error: 'Missing search query' });
  }

  try {
    const results = await prisma.examination.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
      take: 10,
    });

    res.status(200).json({ results });
  } catch (err) {
    console.error('Failed to search examinations:', err);
    res.status(500).json({ error: 'Failed to search examinations' });
  }
}


/**
 * Update an examination.
 * @route PUT /api/examinations/:id
 * @param {string} req.params.id - Examination ID
 * @param {string} req.body.name - New name
 * @returns 200 - Updated examination
 * @returns 400 - Missing name
 * @returns 404 - Not found
 * @returns 500 - Server error
 */
async function updateExamination(req, res) {
  const { id } = req.params;
  const name = req.body.name?.trim();

  if (!name) {
    return res.status(400).json({ error: 'New name is required' });
  }

  try {
    const exam = await prisma.examination.update({
      where: { id: parseInt(id) },
      data: { name },
    });

    return res.status(200).json({ message: 'Examination updated', exam });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Examination not found' });
    }
    return res.status(500).json({ error: 'Failed to update examination' });
  }
}

module.exports = {
  createExamination,
  getAllExaminations,
  getExaminationById,
  getExaminationByName,
  searchExaminations,
  updateExamination,
};
