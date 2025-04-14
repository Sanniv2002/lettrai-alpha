import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Generate } from './pages/Generate';
import { Jobs } from './pages/Jobs';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { useAuthStore } from './store/auth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Welcome to Lettrai
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Your AI-powered email and CV generator
                </p>
                <div className="grid gap-6 max-w-2xl mx-auto">
                  <a
                    href="/generate"
                    className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
                  >
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                      Generate New Content
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Create a tailored email or CV based on your knowledge base and job description
                    </p>
                  </a>
                  <a
                    href="/knowledge-base"
                    className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
                  >
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                      Manage Knowledge Base
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Add or update your resumes and additional information
                    </p>
                  </a>
                  <a
                    href="/jobs"
                    className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
                  >
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                      View Generated Content
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Access your previously generated emails and CVs
                    </p>
                  </a>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/generate"
          element={
            <ProtectedRoute>
              <Generate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/knowledge-base"
          element={
            <ProtectedRoute>
              <KnowledgeBase />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;