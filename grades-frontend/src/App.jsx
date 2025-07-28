import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import PassedCoursesPage from './pages/PassedCoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
    
            <Route 
              path="/passed-courses" 
              element={
                <PrivateRoute>
                  <PassedCoursesPage />
                </PrivateRoute>
              }
            /> 

            <Route 
              path="/courses/:courseId"
              element={
                <PrivateRoute>
                  <CourseDetailsPage />
                </PrivateRoute>
              } 
            />

            {/* <Route path="*" element={<Navigate to="/dashboard" />} /> */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;


