import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  Sparkles,
  LayoutDashboard,
  BookOpen,
  Award,
  User,
  Briefcase,
  FileText,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Users,
  ShieldAlert,
  GraduationCap,
} from 'lucide-react';

export const DashboardLayout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Courses', path: '/student/courses', icon: BookOpen },
    { name: 'Certificates', path: '/student/certificates', icon: Award },
    { name: 'My Portfolio', path: '/student/portfolio', icon: User },
    { name: 'Find Projects', path: '/student/projects', icon: Briefcase },
    { name: 'My Proposals', path: '/student/proposals', icon: FileText },
    { name: 'Messages', path: '/student/messages', icon: MessageSquare },
    { name: 'Notifications', path: '/student/notifications', icon: Bell, badge: unreadCount },
    { name: 'Settings', path: '/student/settings', icon: Settings },
  ];

  const clientLinks = [
    { name: 'Dashboard', path: '/client/dashboard', icon: LayoutDashboard },
    { name: 'My Projects', path: '/client/projects', icon: Briefcase },
    { name: 'Post New Project', path: '/client/projects/new', icon: PlusCircle },
    { name: 'Proposals Received', path: '/client/proposals', icon: FileText },
    { name: 'Discover Talent', path: '/client/talent', icon: Users },
    { name: 'Messages', path: '/client/messages', icon: MessageSquare },
    { name: 'Notifications', path: '/client/notifications', icon: Bell, badge: unreadCount },
    { name: 'Settings', path: '/client/settings', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Courses', path: '/admin/courses', icon: BookOpen },
    { name: 'Create Course', path: '/admin/courses/new', icon: PlusCircle },
    { name: 'Enrollments', path: '/admin/enrollments', icon: GraduationCap },
    { name: 'Certificates', path: '/admin/certificates', icon: Award },
    { name: 'Moderation', path: '/admin/moderation', icon: ShieldAlert },
  ];

  let navLinks = studentLinks;
  if (user?.role === 'client') navLinks = clientLinks;
  if (user?.role === 'admin') navLinks = adminLinks;

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-brand-border px-4 py-3 sticky top-0 z-30">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-brand-dark flex items-center justify-center text-brand-accent">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-brand-dark text-lg">
            mint<span className="text-brand">Gig</span>
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg text-brand-muted hover:text-brand-dark hover:bg-gray-100"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-brand-border transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto md:min-h-screen flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-brand-border/80 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-dark flex items-center justify-center text-brand-accent shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-brand-dark">
                mint<span className="text-brand">Gig</span>
              </span>
              <p className="text-[10px] uppercase font-bold text-brand-muted tracking-wider">
                {user?.role} Portal
              </p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 rounded-md text-brand-muted hover:text-brand-dark"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-brand text-white shadow-sm'
                    : 'text-brand-muted hover:text-brand-dark hover:bg-brand-accentLight/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-brand-muted'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-white text-brand' : 'bg-brand text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Mini Profile & Logout */}
        <div className="p-3.5 border-t border-brand-border/80 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-brand-accentLight text-brand-dark font-bold text-xs flex items-center justify-center border border-brand/20 flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-brand-text truncate">{user?.name}</p>
                <p className="text-[10px] text-brand-muted truncate capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-brand-muted hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-brand-border px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-brand-dark">{title || 'Dashboard'}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to={user?.role === 'student' ? '/student/notifications' : '/client/notifications'}
              className="relative p-2 text-brand-muted hover:text-brand-dark rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            {user?.role === 'student' && user.username && (
              <Link
                to={`/portfolio/${user.username}`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-brand-border text-xs font-semibold text-brand hover:bg-brand-accentLight transition-colors"
              >
                <span>View Public Portfolio</span>
              </Link>
            )}
          </div>
        </header>

        {/* Page Body */}
        <div className="p-6 md:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
