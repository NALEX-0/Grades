const prisma = require('../prisma/client');

/**
 * Get average and passed-grades (5-10) distribution stats for the logged-in user.
 * @route GET /api/stats/average
 * @returns 200 - Stats: totalCourses, averageScore, and gradeDistribution[]
 * @returns 500 - Server error
 */
async function getUserAverage(req, res) {
  const userId = req.user.id;

  try {
    const userGrades = await prisma.grade.findMany({
      where: { userId },
      select: {
        courseId: true,
        score: true,
      },
      orderBy: [
        { courseId: 'asc' },
        { score: 'desc' },
      ],
    });

    const highestGradesMap = new Map();
    for (const { courseId, score } of userGrades) {
      if (!highestGradesMap.has(courseId)) {
        highestGradesMap.set(courseId, score);
      }
    }

    const gradeDistribution = {};
    let totalCoursesPassed = 0;
    let scoreSum = 0;
    for (let i = 5; i <= 10; i++) {
      gradeDistribution[i] = 0;
    }
    for (const score of highestGradesMap.values()) {
      if (score >= 5) {
        const bucket = Math.floor(score);
        gradeDistribution[bucket]++;
        totalCoursesPassed++;
        scoreSum += score;
      }
    }
    
    const averageScore = totalCoursesPassed > 0
      ? parseFloat((scoreSum / totalCoursesPassed).toFixed(2))
      : 0;

    return res.status(200).json({
      totalCourses: totalCoursesPassed,
      averageScore,
      gradeDistribution,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch average stats' });
  }
}

/**
 * Get full grade distribution (0–10) for the logged-in user.
 * @route GET /api/stats/full-distribution
 * @returns 200 - Full distribution
 * @returns 500 - Server error
 */
async function getUserFullDistribution(req, res) {
  const userId = req.user.id;

  try {
    const allGrades = await prisma.grade.findMany({
      where: { userId },
      select: {
        score: true,
      },
    });

    const fullGradeDistribution = {};
    for (let i = 0; i <= 10; i++) {
      fullGradeDistribution[i] = 0;
    }

    for (const { score } of allGrades) {
      const bucket = Math.floor(score);
      if (bucket >= 0 && bucket <= 10) {
        fullGradeDistribution[bucket]++;
      }
    }

    return res.status(200).json({ fullGradeDistribution });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch full grade distribution' });
  }
}



module.exports = {
  getUserAverage,
  getUserFullDistribution
};
