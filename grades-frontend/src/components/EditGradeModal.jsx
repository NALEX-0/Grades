import { useState } from 'react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

export default function EditGradeModal({ gradeId, currentScore, onClose, onSuccess }) {
  const [score, setScore] = useState(currentScore);

  const handleUpdate = async () => {
    try {
      await axios.put(`/grades/${gradeId}`, { score: parseInt(score) });
      toast.success('Grade updated');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to update grade:', err);
      toast.error('Failed to update grade');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm space-y-4">
        <h2 className="text-lg font-semibold">Update Grade</h2>

        <div>
          <label className="block mb-1 text-sm font-medium">Score</label>
          <input
            type="number"
            min="0"
            max="10"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
          <button onClick={handleUpdate} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
        </div>
      </div>
    </div>
  );
}
