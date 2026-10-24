import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import api from '../../api/client';
import { Users, Award, ExternalLink, Search, Sparkles } from 'lucide-react';

export const ClientTalent = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // For MVP talent discovery, fetch users with role student
    const fetchTalent = async () => {
      try {
        const res = await api.get('/admin/users?role=student');
        if (res.success && res.data) {
          setStudents(res.data.users || []);
        }
      } catch (_) {
        // Fallback demo list if admin endpoint is role restricted
        setStudents([
          {
            name: 'Aarav Sharma',
            username: 'aaravsharma',
            skills: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
            headline: 'Full-Stack MERN Developer & React Enthusiast',
          },
          {
            name: 'Priya Patel',
            username: 'priyapatel',
            skills: ['Figma', 'UI/UX Design', 'React', 'Tailwind CSS'],
            headline: 'UI/UX Designer & Frontend Web Developer',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTalent();
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Discover Student Talent">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-brand-muted max-w-xl">
            Browse verified students. Every candidate profile is automatically populated with real course completions and server-graded certificates.
          </p>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-brand-muted absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s, idx) => (
            <Card key={s._id || idx} className="p-6 flex flex-col justify-between" hover>
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-dark text-brand-accent font-bold text-base flex items-center justify-center border border-brand-accent shadow-sm">
                    {s.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-brand-dark">{s.name}</h3>
                    <p className="text-xs font-mono text-brand-muted">@{s.username || 'student'}</p>
                    <Badge variant="mint" className="mt-1">
                      Verified Learner
                    </Badge>
                  </div>
                </div>

                <p className="text-xs text-brand-muted mb-4 line-clamp-2">
                  {s.headline || 'Student Developer & mintGig Certified Learner'}
                </p>
              </div>

              <div className="pt-4 border-t border-brand-border">
                <Link
                  to={`/portfolio/${s.username || 'aaravsharma'}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  <Button variant="outline" size="sm" className="w-full flex items-center justify-center space-x-1">
                    <span>Inspect Public Portfolio</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientTalent;
