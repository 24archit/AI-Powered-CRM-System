import type { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import UserPortal from './pages/UserPortal';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Wrapper
const ProtectedRoute = ({ children, roleRequired }: { children: ReactNode, roleRequired?: 'Admin' | 'User' }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roleRequired && user?.role !== roleRequired) return <Navigate to="/login" replace />;
  
  return children;
};

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated 
              ? <Navigate to={user?.role === 'Admin' ? "/admin" : "/portal"} replace /> 
              : <Navigate to="/login" replace />
          } 
        />
        <Route path="/login" element={<LoginPage />} />
        
        <Route 
          path="/portal" 
          element={
            <ProtectedRoute roleRequired="User">
              <UserPortal />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute roleRequired="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
