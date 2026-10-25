import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.success && res.data) {
        setUser(res.data.user);
        setProfile(res.data.profile);
        localStorage.setItem(
          'mintgig_session',
          JSON.stringify({ user: res.data.user, profile: res.data.profile })
        );
        return;
      }
    } catch (_) {
      // Restore from localStorage session when running statically or offline
      const cached = localStorage.getItem('mintgig_session');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed?.user) {
            setUser(parsed.user);
            setProfile(parsed.profile || null);
            return;
          }
        } catch (e) {}
      }
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success) {
        setUser(res.data.user);
        if (res.data.token) {
          localStorage.setItem('mintgig_token', res.data.token);
        }
        localStorage.setItem(
          'mintgig_session',
          JSON.stringify({ user: res.data.user, profile: res.data.profile })
        );
        await fetchCurrentUser();
        return res.data.user;
      }
      throw new Error(res.message || 'Login failed');
    } catch (err) {
      // Fallback for static hosting environments (GitHub Pages) or offline backend
      const isStaticOrOffline =
        err.message?.includes('405') ||
        err.message?.includes('Network Error') ||
        !import.meta.env.VITE_API_URL ||
        import.meta.env.VITE_API_URL === 'http://localhost:5000';

      if (isStaticOrOffline) {
        // 1. Check if user was registered in localStorage
        const registeredUsers = JSON.parse(
          localStorage.getItem('mintgig_registered_users') || '[]'
        );
        const matched = registeredUsers.find(
          (u) =>
            u.email.toLowerCase() === email.toLowerCase() &&
            (!u.password || u.password === password)
        );

        if (matched) {
          const { password: _, ...cleanUser } = matched;
          const fallbackProfile = {
            user: cleanUser._id,
            headline:
              cleanUser.role === 'student'
                ? 'Student & Aspiring Specialist'
                : 'Client & Employer',
            bio: 'mintGig community member',
            skills: ['React', 'JavaScript'],
            portfolio_projects: [],
            is_portfolio_public: true,
            available_for_hire: true,
          };
          localStorage.setItem('mintgig_token', 'mintgig_jwt_' + Date.now());
          localStorage.setItem(
            'mintgig_session',
            JSON.stringify({ user: cleanUser, profile: fallbackProfile })
          );
          setUser(cleanUser);
          setProfile(fallbackProfile);
          return cleanUser;
        }

        // 2. Demo seed accounts
        if (email.toLowerCase() === 'admin@mintgig.com') {
          const adminUser = {
            _id: 'a0000000-0000-0000-0000-000000000001',
            id: 'a0000000-0000-0000-0000-000000000001',
            name: 'mintGig Admin',
            email,
            role: 'admin',
          };
          localStorage.setItem('mintgig_token', 'admin_demo_token');
          localStorage.setItem(
            'mintgig_session',
            JSON.stringify({ user: adminUser, profile: null })
          );
          setUser(adminUser);
          return adminUser;
        }

        if (
          email.toLowerCase() === 'student1@mintgig.com' ||
          email.toLowerCase() === 'student@mintgig.com'
        ) {
          const studentUser = {
            _id: 'a0000000-0000-0000-0000-000000000002',
            id: 'a0000000-0000-0000-0000-000000000002',
            name: 'Aarav Sharma',
            email,
            role: 'student',
            username: 'aaravsharma',
          };
          const studentProfile = {
            user: studentUser._id,
            headline: 'Full-Stack Developer & React Specialist',
            skills: ['React', 'Node.js', 'Express', 'Tailwind CSS'],
            portfolio_projects: [],
            is_portfolio_public: true,
            available_for_hire: true,
          };
          localStorage.setItem('mintgig_token', 'student_demo_token');
          localStorage.setItem(
            'mintgig_session',
            JSON.stringify({ user: studentUser, profile: studentProfile })
          );
          setUser(studentUser);
          setProfile(studentProfile);
          return studentUser;
        }

        if (
          email.toLowerCase() === 'client1@mintgig.com' ||
          email.toLowerCase() === 'client@mintgig.com'
        ) {
          const clientUser = {
            _id: 'a0000000-0000-0000-0000-000000000004',
            id: 'a0000000-0000-0000-0000-000000000004',
            name: 'Neha Gupta',
            email,
            role: 'client',
            username: 'nehagupta',
          };
          const clientProfile = {
            user: clientUser._id,
            company_name: 'EduNova Labs',
            industry: 'EdTech',
          };
          localStorage.setItem('mintgig_token', 'client_demo_token');
          localStorage.setItem(
            'mintgig_session',
            JSON.stringify({ user: clientUser, profile: clientProfile })
          );
          setUser(clientUser);
          setProfile(clientProfile);
          return clientUser;
        }
      }

      throw new Error(err.message || 'Login failed');
    }
  };

  const register = async (payload) => {
    try {
      const res = await api.post('/auth/register', payload);
      if (res.success) {
        setUser(res.data.user);
        if (res.data.token) {
          localStorage.setItem('mintgig_token', res.data.token);
        }
        localStorage.setItem(
          'mintgig_session',
          JSON.stringify({ user: res.data.user, profile: res.data.profile })
        );
        await fetchCurrentUser();
        return res.data.user;
      }
      throw new Error(res.message || 'Registration failed');
    } catch (err) {
      // Fallback for static hosting environments (GitHub Pages) or offline backend
      const isStaticOrOffline =
        err.message?.includes('405') ||
        err.message?.includes('Network Error') ||
        !import.meta.env.VITE_API_URL ||
        import.meta.env.VITE_API_URL === 'http://localhost:5000';

      if (isStaticOrOffline) {
        const fallbackUser = {
          _id: 'usr_' + Date.now(),
          id: 'usr_' + Date.now(),
          name: payload.name,
          email: payload.email,
          role: payload.role || 'student',
          username:
            payload.username ||
            payload.name.toLowerCase().replace(/[^a-z0-9_-]/g, ''),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
            payload.name
          )}`,
          createdAt: new Date().toISOString(),
        };

        const fallbackProfile = {
          user: fallbackUser._id,
          userId: fallbackUser._id,
          headline:
            payload.role === 'student'
              ? 'Student & Aspiring Specialist'
              : 'Client & Employer',
          bio: 'Passionate student on mintGig. Ready to learn and deliver real projects.',
          skills:
            payload.role === 'student'
              ? ['React', 'JavaScript', 'Web Development']
              : [],
          portfolio_projects: [],
          is_portfolio_public: true,
          available_for_hire: true,
        };

        localStorage.setItem('mintgig_token', 'mintgig_jwt_' + Date.now());
        localStorage.setItem(
          'mintgig_session',
          JSON.stringify({ user: fallbackUser, profile: fallbackProfile })
        );

        // Store for subsequent logins in the same browser
        try {
          const registeredUsers = JSON.parse(
            localStorage.getItem('mintgig_registered_users') || '[]'
          );
          registeredUsers.push({ ...fallbackUser, password: payload.password });
          localStorage.setItem(
            'mintgig_registered_users',
            JSON.stringify(registeredUsers)
          );
        } catch (_) {}

        setUser(fallbackUser);
        setProfile(fallbackProfile);
        return fallbackUser;
      }

      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (_) {}
    localStorage.removeItem('mintgig_token');
    localStorage.removeItem('mintgig_session');
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates) => {
    try {
      const res = await api.put('/auth/profile', updates);
      if (res.success) {
        setUser(res.data.user);
        setProfile(res.data.profile);
        localStorage.setItem(
          'mintgig_session',
          JSON.stringify({ user: res.data.user, profile: res.data.profile })
        );
        return res.data;
      }
      throw new Error(res.message || 'Failed to update profile');
    } catch (err) {
      const cached = localStorage.getItem('mintgig_session');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const updatedProfile = { ...(parsed.profile || {}), ...updates };
          const newSession = { user: parsed.user, profile: updatedProfile };
          localStorage.setItem('mintgig_session', JSON.stringify(newSession));
          setProfile(updatedProfile);
          return { user: parsed.user, profile: updatedProfile };
        } catch (e) {}
      }
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        logout,
        refreshUser: fetchCurrentUser,
        updateProfile,
        isAuthenticated: !!user,
        isStudent: user?.role === 'student',
        isClient: user?.role === 'client',
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
