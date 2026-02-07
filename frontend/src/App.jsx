import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import SubjectDetail from './pages/SubjectDetail';
import QuestionEdit from './pages/QuestionEdit';
import QuestionView from './pages/QuestionView';
import Landing from './pages/Landing/Landing';
import GuidePage from './pages/Landing/GuidePage';
import PricingPage from './pages/Landing/PricingPage';
import SupportPage from './pages/Landing/SupportPage';
import TermsPage from './pages/Landing/TermsPage';
import PrivacyPage from './pages/Landing/PrivacyPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<Landing />} />
            
            {/* Landing Support Pages */}
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />

            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subjects/:id"
              element={
                <ProtectedRoute>
                  <SubjectDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/view/:id"
              element={
                <ProtectedRoute>
                  <QuestionView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/new/:subjectId"
              element={
                <ProtectedRoute>
                  <QuestionEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/edit/:id"
              element={
                <ProtectedRoute>
                  <QuestionEdit />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
