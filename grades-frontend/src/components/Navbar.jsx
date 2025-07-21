import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  if (loading) return null;

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between">
      <div className="flex gap-10 items-center">
        <Link to="/" className="font-bold text-lg">
          Grades
        </Link>
        {user && (
          <Link to="/dashboard" className="hover:text-blue-300 transition">
            Dashboard
          </Link>
        )}
        {user && (
          <Link to="/passed-courses">
            Courses
          </Link>
        )}
      </div>

      <div className="flex gap-4 items-center">
        {!user ? (
          <>
            <Link to="/login" className="hover:text-blue-300 transition">Login</Link>
            <Link to="/register" className="hover:text-blue-300 transition">Register</Link>
          </>
        ) : (
          <>
            <span className="text-sm text-gray-300">Hello, {user.name}</span>
            <button
              onClick={logout}
              className="hover:text-red-400 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
