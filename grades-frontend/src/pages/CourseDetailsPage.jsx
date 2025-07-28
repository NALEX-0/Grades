import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from '../utils/axios';
import EditGradeModal from '../components/EditGradeModal';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';

export default function CourseDetailsPage() {
  const { courseId } = useParams();
  const [summary, setSummary] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editModalInfo, setEditModalInfo] = useState(null);

  useEffect(() => {
    axios.get(`/courses/${courseId}/summary`).then(res => setSummary(res.data));
    axios.get(`/courses/${courseId}/grades/graph`).then(res => setGraphData(res.data.grades));
    loadTablePage(1);
  }, [courseId]);

  const loadTablePage = (pageNum) => {
    axios.get(`/courses/${courseId}/grades?page=${pageNum}&limit=5`).then(res => {
      setTableData(res.data.data);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    });
  };

  const handleDelete = async (gradeId) => {
    if (!window.confirm('Are you sure you want to delete this grade?')) return;
    try {
      await axios.delete(`/grades/${gradeId}`);
      toast.success('Grade deleted');
      loadTablePage(page);
    } catch (err) {
      console.error('Failed to delete grade:', err);
      toast.error('Failed to delete grade');
    }
  };

  if (!summary) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{summary.courseName}</h1>

      <div className="bg-white p-4 rounded-xl shadow w-fit">
        <p className="text-sm text-gray-500">Final Grade</p>
        <p className="text-xl font-bold text-blue-600">
          {summary.finalGrade ?? 'N/A'}
          {summary.examination && <span className="ml-2 text-sm text-gray-400">({summary.examination})</span>}
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">Grade History</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="examination" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">All Grades</h2>
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="px-4 py-2">Examination</th>
              <th className="px-4 py-2">Score</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((grade) => (
              <tr key={grade.id} className="border-t">
                <td className="px-4 py-2">{grade.examination?.name ?? '—'}</td>
                <td className="px-4 py-2 font-medium text-blue-600">{grade.score}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => setEditModalInfo({ id: grade.id, score: grade.score })}
                    className="text-sm px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(grade.id)}
                    className="text-sm px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end items-center gap-2 mt-4">
          <button
            disabled={page <= 1}
            onClick={() => loadTablePage(page - 1)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => loadTablePage(page + 1)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {editModalInfo && (
        <EditGradeModal
          gradeId={editModalInfo.id}
          currentScore={editModalInfo.score}
          onClose={() => setEditModalInfo(null)}
          onSuccess={() => loadTablePage(page)}
        />
      )}
    </div>
  );
}

