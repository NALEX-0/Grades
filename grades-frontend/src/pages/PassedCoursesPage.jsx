import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import AddGradeModal from '../components/AddGradeModal';

export default function PassedCoursesPage() {
  const [groupedCourses, setGroupedCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get('/courses/passed')
      .then(res => setGroupedCourses(res.data))
      .catch(err => console.error('Failed to fetch passed courses', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Passed Courses</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
        >
          + Add Grade
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        Object.entries(groupedCourses).map(([semester, courses]) => (
          <div key={semester} className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-700">{semester}</h2>
            <div className="overflow-x-auto rounded-xl shadow">
              <table className="w-full text-left bg-white">
                <thead className="bg-gray-100 text-gray-600 text-sm">
                  <tr>
                    <th className="px-4 py-2">Course</th>
                    <th className="px-4 py-2">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(course => (
                    <tr key={course.courseId} className="border-t">
                      <td className="px-4 py-2">{course.courseName}</td>
                      <td className="px-4 py-2 font-semibold text-blue-600">{course.highestGrade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      {showModal && <AddGradeModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

