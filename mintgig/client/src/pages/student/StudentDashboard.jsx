import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import {
  BookOpen,
  Award,
  FileText,
  Briefcase,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [eRes, cRes, pRes, projRes] = await Promise.all([
          api.get('/courses/my/enrollments'),
          api.get('/certificates/my'),
          api.get('/projects/my/proposals'),
          api.get('/projects?limit=3'),
        ]);

        if (eRes.success) setEnrollments(eRes.data.enrollments || []);
        if (cRes.success) setCertificates(cRes.data.certificates || []);
        if (pRes.success) setProposals(pRes.data.proposals || []);
        if (projRes.success) setRecommendedProjects(projRes.data.projects || []);
      } catch (_) {}
      finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const completedCount = enrollments.filter(e => e.status === 'completed').length;
  const activeProposalsCount = proposals.filter(p => p.status === 'pending' || p.status === 'accepted').length;

  return (
    <DashboardLayout title="Student Overview">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-dark to-brand rounded-2xl p-6 sm:p-8 text-white shadow-md mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-brand-accent text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Learn-to-Earn Pipeline Active</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-xs text-gray-200 max-w-xl leading-relaxed">
              Continue your courses, earn verified credentials, and apply for freelance gigs with your automated portfolio.
            </p>
          </div>

          {user?.username && (
            <Link to={`/portfolio/${user.username}`} target="_blank" rel="noreferrer">
              <Button variant="mint" size="sm" className="shadow-sm">
                <span>View My Public Portfolio</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-brand-muted font-medium">Courses Enrolled</p>
              <p className="text-2xl font-extrabold text-brand-dark mt-1">{enrollments.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-accentLight text-brand-dark flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-2 block">
            {completedCount} Completed
          </span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-brand-muted font-medium">Certificates Earned</p>
              <p className="text-2xl font-extrabold text-brand-dark mt-1">{certificates.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] text-brand-muted mt-2 block">
            100% Server Verified
          </span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-brand-muted font-medium">Active Proposals</p>
              <p className="text-2xl font-extrabold text-brand-dark mt-1">{activeProposalsCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] text-brand-muted mt-2 block">
            {proposals.length} Total Submitted
          </span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-brand-muted font-medium">Auto-Portfolio</p>
              <p className="text-base font-extrabold text-emerald-700 mt-1">Live & Synced</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] text-brand-muted mt-2 block">
            @{user?.username || 'user'}
          </span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Courses in Progress */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-brand-dark">My Active Courses</h3>
            <Link to="/student/courses" className="text-xs font-semibold text-brand hover:underline">
              View All
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <Card className="p-8 text-center bg-white">
              <BookOpen className="w-8 h-8 text-brand-muted mx-auto mb-2 opacity-40" />
              <p className="text-xs font-bold text-brand-dark">No courses enrolled yet</p>
              <p className="text-[11px] text-brand-muted mt-1 mb-4">
                Explore our catalog to start building verified skills.
              </p>
              <Link to="/courses">
                <Button variant="primary" size="sm">Explore Free Courses</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {enrollments.slice(0, 3).map((enr) => (
                <Card key={enr._id} className="p-4" hover>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant={enr.status === 'completed' ? 'emerald' : 'mint'}>
                          {enr.status === 'completed' ? 'Completed 🎓' : 'In Progress'}
                        </Badge>
                        <span className="text-[11px] text-brand-muted font-semibold">
                          {enr.course?.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-brand-dark">{enr.course?.title}</h4>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-2 max-w-xs">
                        <div
                          className="bg-brand h-full rounded-full transition-all duration-300"
                          style={{ width: `${enr.progressPercent || 0}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-brand-muted block">
                        {enr.progressPercent || 0}% Completed
                      </span>
                    </div>

                    <Link to={`/student/learn/${enr.course?._id}`}>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        {enr.status === 'completed' ? 'Review Lessons' : 'Continue'}
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Recent Proposals */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-brand-dark">Recent Proposals</h3>
              <Link to="/student/proposals" className="text-xs font-semibold text-brand hover:underline">
                View All Proposals
              </Link>
            </div>

            {proposals.length === 0 ? (
              <Card className="p-6 text-center text-xs text-brand-muted">
                You haven't submitted any proposals yet. Check recommended projects below!
              </Card>
            ) : (
              <div className="space-y-2">
                {proposals.slice(0, 3).map((p) => (
                  <div
                    key={p._id}
                    className="p-3.5 bg-white rounded-xl border border-brand-border flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-brand-dark">{p.project?.title}</p>
                      <p className="text-[11px] text-brand-muted">
                        Bid: ₹{p.proposedBudget?.toLocaleString()} · {p.estimatedDays} Days
                      </p>
                    </div>
                    <Badge
                      variant={
                        p.status === 'accepted'
                          ? 'emerald'
                          : p.status === 'rejected'
                          ? 'rose'
                          : 'blue'
                      }
                    >
                      {p.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recommended Opportunities */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-brand-dark">Open Freelance Gigs</h3>
            <Link to="/student/projects" className="text-xs font-semibold text-brand hover:underline">
              Browse All
            </Link>
          </div>

          <div className="space-y-4">
            {recommendedProjects.map((p) => (
              <Card key={p._id} className="p-4" hover>
                <div className="flex items-center justify-between mb-1.5">
                  <Badge variant="emerald">{p.category}</Badge>
                  <span className="text-xs font-bold text-brand-dark">
                    ₹{p.budgetMin?.toLocaleString()} - ₹{p.budgetMax?.toLocaleString()}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-brand-dark line-clamp-1">{p.title}</h4>
                <p className="text-[11px] text-brand-muted line-clamp-2 my-2">{p.description}</p>
                <div className="pt-2 border-t border-brand-border flex items-center justify-between">
                  <span className="text-[10px] text-brand-muted">
                    {p.proposalCount || 0} Proposals
                  </span>
                  <Link to={`/projects/${p._id}`}>
                    <Button variant="primary" size="sm">
                      Apply
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
