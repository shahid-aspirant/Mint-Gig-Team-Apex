import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import PublicPortfolioPage from './pages/PublicPortfolioPage';
import CertificateVerifyPage from './pages/CertificateVerifyPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCourses from './pages/student/StudentCourses';
import CoursePlayer from './pages/student/CoursePlayer';
import StudentCertificates from './pages/student/StudentCertificates';
import StudentPortfolioEditor from './pages/student/StudentPortfolioEditor';
import StudentProposals from './pages/student/StudentProposals';
import StudentMessages from './pages/student/StudentMessages';
import StudentNotifications from './pages/student/StudentNotifications';
import StudentSettings from './pages/student/StudentSettings';

// Client Pages
import ClientDashboard from './pages/client/ClientDashboard';
import ClientProjects from './pages/client/ClientProjects';
import CreateProject from './pages/client/CreateProject';
import ClientProposals from './pages/client/ClientProposals';
import ClientTalent from './pages/client/ClientTalent';
import ClientMessages from './pages/client/ClientMessages';
import ClientNotifications from './pages/client/ClientNotifications';
import ClientSettings from './pages/client/ClientSettings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCourses from './pages/admin/AdminCourses';
import AdminNewCourse from './pages/admin/AdminNewCourse';
import AdminEnrollments from './pages/admin/AdminEnrollments';
import AdminCertificates from './pages/admin/AdminCertificates';
import AdminModeration from './pages/admin/AdminModeration';

export function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailsPage />} />
            <Route path="/portfolio/:username" element={<PublicPortfolioPage />} />
            <Route path="/verify-certificate/:certificateId" element={<CertificateVerifyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Student Protected Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/courses"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/learn/:courseId"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <CoursePlayer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/certificates"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentCertificates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/portfolio"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentPortfolioEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/projects"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ProjectsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/proposals"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentProposals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/messages"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentMessages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/notifications"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentNotifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/settings"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentSettings />
                </ProtectedRoute>
              }
            />

            {/* Client Protected Routes */}
            <Route
              path="/client/dashboard"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/projects"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientProjects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/projects/new"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <CreateProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/proposals"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientProposals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/talent"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientTalent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/messages"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientMessages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/notifications"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientNotifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/settings"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientSettings />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses/new"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminNewCourse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/enrollments"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminEnrollments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/certificates"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminCertificates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/moderation"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminModeration />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
