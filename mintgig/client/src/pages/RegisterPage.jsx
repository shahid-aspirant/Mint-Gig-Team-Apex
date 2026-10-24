import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { useAuth } from '../context/AuthContext';
import { Sparkles, GraduationCap, Briefcase, AlertCircle } from 'lucide-react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = searchParams.get('role') === 'client' ? 'client' : 'student';
  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (role === 'student' && !username) {
      setError('A username is required to generate your automatic portfolio');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const user = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        username: username ? username.trim().toLowerCase() : undefined,
      });

      if (user.role === 'student') navigate('/student/dashboard');
      else if (user.role === 'client') navigate('/client/dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12">
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-dark flex items-center justify-center text-brand-accent mx-auto shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-brand-dark">Join mintGig</h1>
            <p className="text-xs text-brand-muted">
              Choose your role to get started on the learning-to-earning platform.
            </p>
          </div>

          <Card className="p-8 bg-white">
            {/* Role Switcher */}
            <div className="grid grid-cols-2 gap-3 mb-6 p-1 bg-brand-bg rounded-xl border border-brand-border">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  role === 'student'
                    ? 'bg-white text-brand-dark shadow-sm border border-brand-border'
                    : 'text-brand-muted hover:text-brand-dark'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('client')}
                className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  role === 'client'
                    ? 'bg-white text-brand-dark shadow-sm border border-brand-border'
                    : 'text-brand-muted hover:text-brand-dark'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Client / Employer</span>
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200 mb-4 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                required
                placeholder={role === 'student' ? 'e.g. Aarav Sharma' : 'e.g. Neha Gupta'}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                label="Email Address"
                type="email"
                required
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Public Username"
                required={role === 'student'}
                placeholder="e.g. aaravsharma"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                helperText={
                  role === 'student'
                    ? `Your public portfolio will be live at: mintgig.com/portfolio/${username || 'username'}`
                    : 'Unique handle on the platform'
                }
              />

              <Input
                label="Password"
                type="password"
                required
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Must be minimum 8 characters."
              />

              <div className="pt-2">
                <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
                  {role === 'student' ? 'Create Student Account' : 'Create Client Account'}
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-brand-border text-center text-xs text-brand-muted">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-brand hover:underline">
                Sign in here
              </Link>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterPage;
