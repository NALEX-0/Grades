import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import axios from '../utils/axios';
import GradeChart from '../components/GradeChart';

const debouncedFetch = debounce(async (value, setSuggestions, setLoading) => {
  if (!value) return setSuggestions([]);

  setLoading(true);
  try {
    const res = await axios.get(`/courses/search?query=${value}`);
    setSuggestions(res.data.results);
  } catch (err) {
    console.error('Search error:', err);
    setSuggestions([]);
  } finally {
    setLoading(false);
  }
}, 200); // Delay (ms)


export default function GradeStats() {
  const [distributionData, setDistributionData] = useState([]);
  const [allGradesData, setAllGradesData] = useState([]);
  const [average, setAverage] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleSearch = (value) => {
    debouncedFetch(value, setSuggestions, setLoading);
  };


  useEffect(() => {
    axios.get('/stats/average').then((res) => {
      const dist = res.data.gradeDistribution;
      const chartData = Object.keys(dist).map((key) => ({
        grade: key,
        count: dist[key],
      }));
      setDistributionData(chartData);
      setAverage(res.data.averageScore);
      setTotalCourses(res.data.totalCourses);
    });

    axios.get('/stats/full-distribution').then((res) => {
      const dist = res.data.fullGradeDistribution;
      const chartData = Object.keys(dist).map((key) => ({
        grade: key,
        count: dist[key],
      }));
      setAllGradesData(chartData);
    });
  }, []);

  return (
    <div className="space-y-4">

      {/* Stat Card */}
      <div className="bg-white p-4 rounded-2xl shadow flex flex-col sm:flex-row justify-around items-center text-center gap-4">
        <div>
          <p className="text-sm text-gray-500">Average Score</p>
          <p className="text-xl font-bold text-blue-600">{average.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Courses Passed</p>
          <p className="text-xl font-bold text-green-600">{totalCourses}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GradeChart
          title="Grade Distribution (Passed Courses)"
          data={distributionData}
          color="#3b82f6"
          average={average}
        />
        <GradeChart
          title="Full Grade Distribution (All Grades)"
          data={allGradesData}
          color="#10b981"
        />
      </div>
    </div>
  );
}
