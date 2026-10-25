import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SnippetDetailPage from './pages/SnippetDetailPage';
import SnippetNewPage from './pages/SnippetNewPage';
import SnippetEditPage from './pages/SnippetEditPage';
import { Loader2 } from 'lucide-react';

// Create TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2, // 2 minutes
      retry: 1,
    },
  },
});

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-bg dark:bg-darkWarm-bg text-warm-muted dark:text-darkWarm-muted">
        <Loader2 className="h-6 w-6 animate-spin text-warm-accent dark:text-darkWarm-accent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Guard (Redirect authenticated users away from /login & /register)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-bg dark:bg-darkWarm-bg text-warm-muted dark:text-darkWarm-muted">
        <Loader2 className="h-6 w-6 animate-spin text-warm-accent dark:text-darkWarm-accent" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-warm-bg dark:bg-darkWarm-bg text-warm-text dark:text-darkWarm-text font-sans transition-colors duration-150">
              <Navbar />
              <main className="flex-1 w-full">
                <Routes>
                  {/* Public Auth Routes */}
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <LoginPage />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PublicRoute>
                        <RegisterPage />
                      </PublicRoute>
                    }
                  />

                  {/* Protected Snippet Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/snippets/new"
                    element={
                      <ProtectedRoute>
                        <SnippetNewPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/snippets/:id"
                    element={
                      <ProtectedRoute>
                        <SnippetDetailPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/snippets/:id/edit"
                    element={
                      <ProtectedRoute>
                        <SnippetEditPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Default Fallback */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </main>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
