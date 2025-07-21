// ---- 📁 components/AddGradeModal.jsx ----
import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

export default function AddGradeModal({ onClose }) {
  const [courseQuery, setCourseQuery] = useState('');
  const [examQuery, setExamQuery] = useState('');
  const [grade, setGrade] = useState('');

  const [courseResults, setCourseResults] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);

  const [semesters, setSemesters] = useState([]);
  const [selectedSemesterId, setSelectedSemesterId] = useState('');
  const [showCourseCreate, setShowCourseCreate] = useState(false);

  useEffect(() => {
    axios.get('/semesters')
      .then(res => setSemesters(res.data))
      .catch(err => console.error('Failed to fetch semesters', err));
  }, []);

  useEffect(() => {
    if (courseQuery.length > 0) {
      axios.get(`/courses/search?query=${courseQuery}`).then(res => {
        setCourseResults(res.data.results);
      });
    } else {
      setCourseResults([]);
    }
  }, [courseQuery]);

  useEffect(() => {
    if (examQuery.length > 0) {
      axios.get(`/examinations/search?query=${examQuery}`).then(res => {
        setExamResults(res.data.results);
      });
    } else {
      setExamResults([]);
    }
  }, [examQuery]);

  const handleAddGrade = async () => {
    if (!selectedCourse || !selectedExam || !grade) return;
    try {
      await axios.post('/grades', {
        courseId: selectedCourse.id,
        examinationId: selectedExam.id,
        score: parseInt(grade),
      });
      toast.success('Grade saved');
      onClose();
    } catch (err) {
      console.error('Failed to add grade:', err);
      toast.error('Failed to save grade');
    }
  };

  const handleAddCourseClick = () => {
    if (!courseQuery.trim()) return;
    setShowCourseCreate(true);
  };

  const handleConfirmCreateCourse = async () => {
    if (!courseQuery.trim() || !selectedSemesterId) return;
    try {
      const res = await axios.post('/courses', {
        name: courseQuery,
        semesterId: parseInt(selectedSemesterId),
      });
      setSelectedCourse(res.data);
      setCourseResults([]);
      setShowCourseCreate(false);
      toast.success('Course created');
    } catch (err) {
      console.error('Failed to create course:', err);
      toast.error('Failed to create course');
    }
  };

  const handleAddExam = async () => {
    if (!examQuery.trim()) return;
    try {
      const res = await axios.post('/examinations', { name: examQuery });
      setSelectedExam(res.data);
      setExamResults([]);
      toast.success('Examination created');
    } catch (err) {
      console.error('Failed to create examination:', err);
      toast.error('Failed to create examination');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Add Grade</h2>

        {/* Course Search */}
        <div>
          <label className="block mb-1 text-sm font-medium">Course</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={courseQuery}
              onChange={(e) => {
                setCourseQuery(e.target.value);
                setShowCourseCreate(false);
              }}
              className="border rounded px-3 py-2 w-full"
              placeholder="Search or select course"
            />
            <button onClick={handleAddCourseClick} className="bg-gray-200 px-3 py-2 rounded">+ Add</button>
          </div>

          {showCourseCreate && (
            <div className="mb-2">
              <select
                value={selectedSemesterId}
                onChange={(e) => setSelectedSemesterId(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm mb-1"
              >
                <option value="">Select Semester</option>
                {semesters.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <button
                onClick={handleConfirmCreateCourse}
                className="mt-1 bg-blue-500 text-white px-3 py-2 rounded w-full"
              >
                Confirm Create Course
              </button>
            </div>
          )}

          {courseResults.length > 0 && (
            <ul className="border mt-1 rounded bg-white max-h-32 overflow-y-auto text-sm">
              {courseResults.map(course => (
                <li
                  key={course.id}
                  onClick={() => {
                    setSelectedCourse(course);
                    setCourseQuery(course.name);
                    setCourseResults([]);
                    setShowCourseCreate(false);
                  }}
                  className="px-3 py-1 hover:bg-blue-100 cursor-pointer"
                >
                  {course.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Examination Search */}
        <div>
          <label className="block mb-1 text-sm font-medium">Examination</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={examQuery}
              onChange={(e) => setExamQuery(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              placeholder="Search or select examination"
            />
            <button onClick={handleAddExam} className="bg-gray-200 px-3 py-2 rounded">+ Add</button>
          </div>
          {examResults.length > 0 && (
            <ul className="border mt-1 rounded bg-white max-h-32 overflow-y-auto text-sm">
              {examResults.map(exam => (
                <li
                  key={exam.id}
                  onClick={() => {
                    setSelectedExam(exam);
                    setExamQuery(exam.name);
                    setExamResults([]);
                  }}
                  className="px-3 py-1 hover:bg-blue-100 cursor-pointer"
                >
                  {exam.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Grade Input */}
        <div>
          <label className="block mb-1 text-sm font-medium">Grade</label>
          <input
            type="number"
            min="0"
            max="10"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="Enter score"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
          <button onClick={handleAddGrade} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
