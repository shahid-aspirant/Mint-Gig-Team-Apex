import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import api from '../../api/client';
import { FileText, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';

export const StudentProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProposals = async () => {
    try {
      const res = await api.get('/projects/my/proposals');
      if (res.success) setProposals(res.data.proposals || []);
    } catch (_) {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleWithdraw = async (id) => {
    if (!confirm('Are you sure you want to withdraw this proposal?')) return;
    try {
      const res = await api.put(`/projects/proposals/${id}/withdraw`);
      if (res.success) {
        await fetchProposals();
      }
    } catch (err) {
      alert(err.message || 'Failed to withdraw proposal');
    }
  };

  return (
    <DashboardLayout title="My Submitted Proposals">
      <div className="space-y-6">
        <p className="text-xs text-brand-muted">
          Track client decisions on your freelance project applications.
        </p>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-brand-muted">Loading proposals...</p>
          </div>
        ) : proposals.length === 0 ? (
          <Card className="p-12 text-center max-w-md mx-auto">
            <FileText className="w-10 h-10 text-brand-muted mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-bold text-brand-dark">No proposals submitted</h3>
            <p className="text-xs text-brand-muted mt-1 mb-4">
              Explore open freelance opportunities and submit your proposals.
            </p>
            <Link to="/student/projects">
              <Button variant="primary" size="sm">Browse Projects</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {proposals.map((p) => (
              <Card key={p._id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          p.status === 'accepted'
                            ? 'emerald'
                            : p.status === 'rejected'
                            ? 'rose'
                            : p.status === 'withdrawn'
                            ? 'gray'
                            : 'blue'
                        }
                      >
                        {p.status.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-brand-muted">
                        Applied {new Date(p.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-brand-dark">
                      <Link to={`/projects/${p.project?._id}`} className="hover:underline">
                        {p.project?.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-brand-muted italic bg-brand-bg p-3 rounded-lg border border-brand-border">
                      "{p.coverMessage}"
                    </p>

                    {p.clientNote && (
                      <div className="p-3 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs">
                        <strong>Client Note:</strong> {p.clientNote}
                      </div>
                    )}
                  </div>

                  {/* Financials & Actions */}
                  <div className="flex flex-col md:items-end justify-between min-w-[180px] pt-4 md:pt-0 border-t md:border-t-0 border-brand-border space-y-4">
                    <div className="md:text-right">
                      <p className="text-base font-extrabold text-brand-dark">
                        ₹{p.proposedBudget?.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-brand-muted">
                        Delivery in {p.estimatedDays} Days
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {p.status === 'accepted' && (
                        <Link to="/student/messages">
                          <Button variant="primary" size="sm" className="flex items-center space-x-1">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Message Client</span>
                          </Button>
                        </Link>
                      )}

                      {p.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWithdraw(p._id)}
                          className="text-rose-600 hover:bg-rose-50 border-rose-200"
                        >
                          Withdraw
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

export default StudentProposals;
