import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import api from '../../api/client';
import { Briefcase, PlusCircle, ExternalLink, FileText, Settings } from 'lucide-react';

export const ClientProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects/client/my');
      if (res.success) setProjects(res.data.projects || []);
    } catch (_) {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleUpdateStatus = async (projectId, newStatus) => {
    try {
      const res = await api.put(`/projects/${projectId}`, { status: newStatus });
      if (res.success) {
        await fetchProjects();
      }
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  return (
    <DashboardLayout title="My Posted Projects">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-brand-muted">
            Manage your project listings and review student proposals.
          </p>
          <Link to="/client/projects/new">
            <Button variant="primary" size="sm" className="flex items-center space-x-1.5">
              <PlusCircle className="w-4 h-4" />
              <span>Post New Project</span>
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-brand-muted">Loading your projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <Card className="p-12 text-center max-w-md mx-auto">
            <Briefcase className="w-10 h-10 text-brand-muted mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-bold text-brand-dark">No projects posted yet</h3>
            <p className="text-xs text-brand-muted mt-1 mb-4">
              Publish your first freelance gig to start receiving proposals from certified students.
            </p>
            <Link to="/client/projects/new">
              <Button variant="primary" size="sm">Post a Project</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {projects.map((proj) => (
              <Card key={proj._id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          proj.status === 'open'
                            ? 'emerald'
                            : proj.status === 'in_progress'
                            ? 'blue'
                            : 'gray'
                        }
                      >
                        {proj.status.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-brand-muted">{proj.category}</span>
                    </div>

                    <h3 className="text-lg font-bold text-brand-dark">
                      <Link to={`/projects/${proj._id}`} className="hover:underline">
                        {proj.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-brand-muted line-clamp-2">{proj.description}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.requiredSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-brand-bg px-2 py-0.5 rounded border border-brand-border text-brand-dark font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Proposals */}
                  <div className="flex flex-col md:items-end justify-between min-w-[200px] pt-4 md:pt-0 border-t md:border-t-0 border-brand-border space-y-3">
                    <div className="md:text-right">
                      <p className="text-base font-extrabold text-brand-dark">
                        ₹{proj.budgetMin?.toLocaleString()} - ₹{proj.budgetMax?.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-brand-muted">
                        {proj.proposalCount || 0} Proposals received
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Link to="/client/proposals">
                        <Button variant="outline" size="sm" className="flex items-center space-x-1">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Review Proposals</span>
                        </Button>
                      </Link>

                      {proj.status === 'open' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateStatus(proj._id, 'paused')}
                        >
                          Pause
                        </Button>
                      )}
                      {proj.status === 'paused' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateStatus(proj._id, 'open')}
                        >
                          Reopen
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientProjects;
