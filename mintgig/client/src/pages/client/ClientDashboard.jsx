import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import {
  Briefcase,
  FileText,
  PlusCircle,
  Users,
  MessageSquare,
  ExternalLink,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const ClientDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [projRes, propRes] = await Promise.all([
        api.get('/projects/client/my'),
        api.get('/projects/client/all-proposals'),
      ]);
      if (projRes.success) setProjects(projRes.data.projects || []);
      if (propRes.success) setProposals(propRes.data.proposals || []);
    } catch (_) {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openProjects = projects.filter((p) => p.status === 'open');
  const inProgressProjects = projects.filter((p) => p.status === 'in_progress');
  const pendingProposals = proposals.filter((p) => p.status === 'pending');

  const handleDecision = async (proposalId, decision) => {
    try {
      const res = await api.put(`/projects/proposals/${proposalId}/decide`, { decision });
      if (res.success) {
        await fetchData();
      }
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  return (
    <DashboardLayout title="Client Dashboard">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-brand-dark to-brand rounded-2xl p-6 sm:p-8 text-white shadow-md mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs uppercase font-bold text-brand-accent tracking-wider">
              Employer Hub
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {user?.name}!
            </h2>
            <p className="text-xs text-gray-200 max-w-xl">
              Post projects, review verified student portfolios, and collaborate with skilled college talent.
            </p>
          </div>

          <Link to="/client/projects/new">
            <Button variant="mint" size="md" className="shadow-sm">
              <PlusCircle className="w-4 h-4 mr-1.5" />
              <span>Post New Project</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-brand-muted font-medium">Open Project Gigs</p>
              <p className="text-2xl font-extrabold text-brand-dark mt-1">{openProjects.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-accentLight text-brand-dark flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] text-brand-muted mt-2 block">
            {projects.length} Total Projects
          </span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-brand-muted font-medium">Pending Proposals</p>
              <p className="text-2xl font-extrabold text-brand-dark mt-1">{pendingProposals.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] text-brand-muted mt-2 block">
            {proposals.length} Received All-Time
          </span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-brand-muted font-medium">In Progress Gigs</p>
              <p className="text-2xl font-extrabold text-brand-dark mt-1">{inProgressProjects.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-2 block">
            Active Collaborations
          </span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-brand-muted font-medium">Talent Verification</p>
              <p className="text-base font-extrabold text-emerald-700 mt-1">100% Certified</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] text-brand-muted mt-2 block">
            Server Evaluated
          </span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Incoming Proposals */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-brand-dark">Incoming Proposals</h3>
            <Link to="/client/proposals" className="text-xs font-semibold text-brand hover:underline">
              View All ({proposals.length})
            </Link>
          </div>

          {proposals.length === 0 ? (
            <Card className="p-8 text-center text-xs text-brand-muted">
              No proposals received yet. Ensure your projects are open to student applicants!
            </Card>
          ) : (
            <div className="space-y-4">
              {proposals.slice(0, 4).map((p) => (
                <Card key={p._id} className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-brand-dark">{p.student?.name}</span>
                        {p.student?.username && (
                          <Link
                            to={`/portfolio/${p.student.username}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-brand hover:underline inline-flex items-center font-medium"
                          >
                            <span>Inspect Portfolio</span>
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Link>
                        )}
                      </div>
                      <p className="text-[11px] text-brand-muted">
                        Applied for: <strong>{p.project?.title}</strong>
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

                  <p className="text-xs text-brand-muted italic bg-brand-bg p-3 rounded-lg border border-brand-border my-2">
                    "{p.coverMessage}"
                  </p>

                  <div className="pt-3 border-t border-brand-border flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-brand-dark">
                        ₹{p.proposedBudget?.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-brand-muted ml-2">
                        · {p.estimatedDays} Days timeline
                      </span>
                    </div>

                    {p.status === 'pending' ? (
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-rose-600 hover:bg-rose-50 border-rose-200"
                          onClick={() => handleDecision(p._id, 'rejected')}
                        >
                          Decline
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleDecision(p._id, 'accepted')}
                        >
                          Accept Proposal
                        </Button>
                      </div>
                    ) : p.status === 'accepted' ? (
                      <Link to="/client/messages">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-3.5 h-3.5 mr-1" />
                          <span>Chat with Freelancer</span>
                        </Button>
                      </Link>
                    ) : null}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: My Projects */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-brand-dark">My Projects</h3>
            <Link to="/client/projects" className="text-xs font-semibold text-brand hover:underline">
              Manage All
            </Link>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 4).map((proj) => (
              <Card key={proj._id} className="p-4" hover>
                <div className="flex items-center justify-between mb-1.5">
                  <Badge variant={proj.status === 'open' ? 'emerald' : 'blue'}>
                    {proj.status.toUpperCase()}
                  </Badge>
                  <span className="text-xs font-bold text-brand-dark">
                    ₹{proj.budgetMin?.toLocaleString()} - ₹{proj.budgetMax?.toLocaleString()}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-brand-dark line-clamp-1">{proj.title}</h4>
                <div className="flex items-center justify-between pt-3 border-t border-brand-border mt-3 text-[11px] text-brand-muted">
                  <span>{proj.proposalCount || 0} Proposals</span>
                  <Link to={`/projects/${proj._id}`} className="text-brand font-semibold hover:underline">
                    View Listing →
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

export default ClientDashboard;
