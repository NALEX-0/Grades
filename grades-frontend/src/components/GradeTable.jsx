import { useEffect, useState } from 'react';
import axios from '../utils/axios';

export default function GradeTable() {
  const [grades, setGrades] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchGrades = (p = 1) => {
    axios.get(`/grades?page=${p}&limit=5`).then((res) => {
      setGrades(res.data.data);
      setPage(res.data.page);
      // setTotalPages(res.data.totalPages);
      setTotalPages(res.data.totalPages > 0 ? res.data.totalPages : 1);
    });
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-4">Βαθμοί</h2>
      <table className="w-full table-auto text-left">
        <thead>
          <tr className="text-gray-500 text-sm">
            <th className="p-2">Μάθημα</th>
            <th className="p-2">Εξάμηνο</th>
            <th className="p-2">Βαθμός</th>
            <th className="p-2">Εξεταστική</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((g) => (
            <tr key={g.id} className="border-t">
              <td className="p-2">{g.course.name}</td>
              <td className="p-2">{g.course.semester.name}</td>
              <td className="p-2">{g.score}</td>
              <td className="p-2">{g.examination.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end items-center gap-2 mt-4">
        <button
          className="px-4 py-1 bg-gray-100 rounded disabled:opacity-50"
          onClick={() => fetchGrades(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
        <button
          className="px-4 py-1 bg-gray-100 rounded disabled:opacity-50"
          onClick={() => fetchGrades(page + 1)}
          disabled={page >= totalPages}
          // disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
