import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Category from './pages/Category';
import Article from './pages/Article';
import Modules from './pages/Modules';

// Admin imports
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import CategoryManager from './pages/admin/CategoryManager';
import QuestionManager from './pages/admin/QuestionManager';
import QuestionEditor from './pages/admin/QuestionEditor';
import UserManager from './pages/admin/UserManager';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import SupportSettingsPage from './pages/admin/SupportSettingsPage';
import TicketManager from './pages/admin/TicketManager';
import TicketDetail from './pages/admin/TicketDetail';
import FloatingSupportWidget from './components/common/FloatingSupportWidget';
// Debug component
import DebugInfo from './components/common/DebugInfo';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="admin-loading-page">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="modules" element={<Modules />} />
        <Route path="category/:categoryId" element={<Category />} />
        <Route path="article/:articleId" element={<Article />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={
        <ProtectedRoute><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/categories" element={
        <ProtectedRoute><CategoryManager /></ProtectedRoute>
      } />
      <Route path="/admin/questions" element={
        <ProtectedRoute><QuestionManager /></ProtectedRoute>
      } />
      <Route path="/admin/questions/new" element={
        <ProtectedRoute><QuestionEditor /></ProtectedRoute>
      } />
      <Route path="/admin/questions/:id" element={
        <ProtectedRoute><QuestionEditor /></ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute><UserManager /></ProtectedRoute>
      } />
      <Route path="/admin/analytics" element={
        <ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/support-settings" element={
        <ProtectedRoute><SupportSettingsPage /></ProtectedRoute>
      } />
      <Route path="/admin/tickets" element={
        <ProtectedRoute><TicketManager /></ProtectedRoute>
      } />
      <Route path="/admin/tickets/:id" element={
        <ProtectedRoute><TicketDetail /></ProtectedRoute>
      } />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <FloatingSupportWidget />
      <DebugInfo />
    </AuthProvider>
  );
}

export default App;

