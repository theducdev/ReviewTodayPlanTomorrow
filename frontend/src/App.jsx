import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import Reflection from './components/Reflection';
import Meditation from './components/Meditation';
import Reading from './components/Reading';
import Planning from './components/Planning';
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading...</div>;

  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white font-sans">
        {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
        <div className={isAuthenticated ? "md:ml-64 transition-all duration-300" : ""}>
          <Routes>
            <Route
              path="/login"
              element={!isAuthenticated ? <Auth setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/reflection" />}
            />
            <Route
              path="/reflection"
              element={isAuthenticated ? <Reflection /> : <Navigate to="/login" />}
            />
            <Route
              path="/meditation"
              element={isAuthenticated ? <Meditation /> : <Navigate to="/login" />}
            />
            <Route
              path="/reading"
              element={isAuthenticated ? <Reading /> : <Navigate to="/login" />}
            />
            <Route
              path="/planning"
              element={isAuthenticated ? <Planning /> : <Navigate to="/login" />}
            />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route path="/" element={<Navigate to={isAuthenticated ? "/reflection" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
