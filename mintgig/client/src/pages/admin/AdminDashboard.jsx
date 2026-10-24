import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import api from '../../api/client';
import {
  Users,
  BookOpen,
  Award,
  Briefcase,
  GraduationCap,
  TrendingUp,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get('/admin/metrics');
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (_) {}
      finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const metrics = data?.metrics || {};

  return (
    <DashboardLayout title="Platform Administration">
      <div className="space-y-8">
        {/* Banner */}
        <div className="bg-brand-dark rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-brand-accent tracking-wider">
              System Control Panel
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              mintGig Operations & Analytics
            </h2>
            <p className="text-xs text-gray-300 max-w-xl">
              Platform metrics derived directly from real MongoDB collections.
            </p>
          </div>

          <div className="flex gap-2">
            <Link to="/admin/courses/new">
              <Button variant="mint" size="sm">
                <PlusCircle className="w-4 h-4 mr-1.5" />
                <span>Create Course</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-5">
            <p className="text-xs text-brand-muted font-medium">Registered Users</p>
            <p className="text-2xl font-extrabold text-brand-dark mt-1">{metrics.totalUsers ?? 0}</p>
            <p className="text-[10px] text-brand-muted mt-2">
              {metrics.totalStudents ?? 0} Students · {metrics.totalClients ?? 0} Clients
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-xs text-brand-muted font-medium">Courses</p>
            <p className="text-2xl font-extrabold text-brand-dark mt-1">{metrics.totalCourses ?? 0}</p>
            <p className="text-[10px] text-emerald-700 font-semibold mt-2">
              {metrics.publishedCourses ?? 0} Published
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-xs text-brand-muted font-medium">Enrollments</p>
            <p className="text-2xl font-extrabold text-brand-dark mt-1">{metrics.totalEnrollments ?? 0}</p>
            <p className="text-[10px] text-brand-muted mt-2">
              {metrics.completedEnrollments ?? 0} Completed
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-xs text-brand-muted font-medium">Certificates Issued</p>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">{metrics.totalCertificates ?? 0}</p>
            <p className="text-[10px] text-emerald-800 font-semibold mt-2">
              100% Genuine
            </p>
          </Card>
        </div>

        {/* Second Metrics Row: Freelance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-brand-muted font-medium">Freelance Gigs</p>
              <p className="text-2xl font-extrabold text-brand-dark mt-1">{metrics.totalProjects ?? 0}</p>
              <p className="text-[11px] text-brand-muted mt-1">{metrics.openProjects ?? 0} Open for Proposals</p>
            </div>
            <Link to="/admin/moderation">
              <Button variant="outline" size="sm">Moderate Projects</Button>
            </Link>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-brand-muted font-medium">Total Proposals</p>
              <p className="text-2xl font-extrabold text-brand-dark mt-1">{metrics.totalProposals ?? 0}</p>
              <p className="text-[11px] text-brand-muted mt-1">Submitted across all listings</p>
            </div>
            <Link to="/admin/users">
              <Button variant="outline" size="sm">Manage Users</Button>
            </Link>
          </Card>
        </div>

        {/* Recent Registrations Table */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-brand-dark">Recent Platform Registrations</h3>
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-bg border-b border-brand-border text-brand-muted font-bold">
                  <tr>
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Created</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/60">
                  {(data?.recentUsers || []).map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50/60">
                      <td className="p-3.5 font-bold text-brand-dark">{u.name}</td>
                      <td className="p-3.5 text-brand-muted">{u.email}</td>
                      <td className="p-3.5">
                        <Badge variant={u.role === 'admin' ? 'rose' : u.role === 'student' ? 'mint' : 'blue'}>
                          {u.role.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-brand-muted">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {u.isActive ? 'ACTIVE' : 'SUSPENDED'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
