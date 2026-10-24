import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../common/Button';
import {
  Sparkles,
  BookOpen,
  Briefcase,
  Bell,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Award,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'student') return '/student/dashboard';
    if (user.role === 'client') return '/client/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    return '/';
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-brand-dark flex items-center justify-center text-brand-accent shadow-sm group-hover:bg-brand transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-brand-dark flex items-center">
                mint<span className="text-brand">Gig</span>
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-wider text-brand-muted -mt-1">
                Learn · Prove · Earn
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-7 text-sm font-medium text-brand-muted">
            <Link to="/courses" className="hover:text-brand-dark flex items-center space-x-1.5 transition-colors">
              <BookOpen className="w-4 h-4" />
              <span>Courses</span>
            </Link>
            <Link to="/projects" className="hover:text-brand-dark flex items-center space-x-1.5 transition-colors">
              <Briefcase className="w-4 h-4" />
              <span>Find Projects</span>
            </Link>
            <Link to="/about" className="hover:text-brand-dark transition-colors">
              How It Works
            </Link>
            <Link to="/contact" className="hover:text-brand-dark transition-colors">
              Support
            </Link>
          </div>

          {/* Right Action Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Notification Bell */}
                <Link
                  to={user.role === 'student' ? '/student/notifications' : '/client/notifications'}
                  className="relative p-2 text-brand-muted hover:text-brand-dark rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Dashboard Quick Button */}
                <Link to={getDashboardLink()}>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1.5">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-lg border border-brand-border hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-accentLight text-brand-dark font-bold text-xs flex items-center justify-center border border-brand/20">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-brand-text max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-brand/10 text-brand">
                      {user.role}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-brand-border py-1.5 z-50">
                      <div className="px-3.5 py-2 border-b border-brand-border/60">
                        <p className="text-xs font-bold text-brand-text truncate">{user.name}</p>
                        <p className="text-[11px] text-brand-muted truncate">{user.email}</p>
                      </div>

                      {user.role === 'student' && (
                        <>
                          <Link
                            to={`/portfolio/${user.username || 'me'}`}
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center space-x-2 px-3.5 py-2 text-xs font-medium text-brand-text hover:bg-brand-accentLight transition-colors"
                          >
                            <User className="w-3.5 h-3.5" />
                            <span>Public Portfolio</span>
                          </Link>
                          <Link
                            to="/student/certificates"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center space-x-2 px-3.5 py-2 text-xs font-medium text-brand-text hover:bg-brand-accentLight transition-colors"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>My Certificates</span>
                          </Link>
                        </>
                      )}

                      <Link
                        to={getDashboardLink()}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-3.5 py-2 text-xs font-medium text-brand-text hover:bg-brand-accentLight transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Go to Dashboard</span>
                      </Link>

                      <div className="border-t border-brand-border/60 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-brand-muted hover:text-brand-dark hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-brand-border bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-brand-text py-2"
          >
            Courses
          </Link>
          <Link
            to="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-brand-text py-2"
          >
            Find Projects
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-brand-text py-2"
          >
            How It Works
          </Link>
          <div className="pt-2 border-t border-brand-border flex flex-col space-y-2">
            {user ? (
              <>
                <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Go to Dashboard ({user.role})
                  </Button>
                </Link>
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
