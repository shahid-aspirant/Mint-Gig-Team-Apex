import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import api from '../../api/client';
import { ShieldAlert, ExternalLink } from 'lucide-react';

export const AdminModeration = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/admin/projects');
      if (res.success && res.data) {
        setProjects(res.data.projects || []);
      }
    } catch (_) {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleUpdateStatus = async (projectId, status) => {
    try {
      const res = await api.put(`/admin/projects/${projectId}/status`, { status });
      if (res.success) {
        await fetchProjects();
      }
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  return (
    <DashboardLayout title="Marketplace Moderation">
      <div className="space-y-6">
        <p className="text-xs text-brand-muted">
          Review freelance listings and ensure safety and compliance across project descriptions and budgets.
        </p>

        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-bg border-b border-brand-border text-brand-muted font-bold">
                <tr>
                  <th className="p-3.5">Project Title</th>
                  <th className="p-3.5">Client</th>
                  <th className="p-3.5">Budget</th>
                  <th className="p-3.5">Proposals</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {projects.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/60">
                    <td className="p-3.5 font-bold text-brand-dark max-w-xs">
                      <div>{p.title}</div>
                      <p className="text-[10px] text-brand-muted font-normal line-clamp-1">
                        {p.description}
                      </p>
                    </td>
                    <td className="p-3.5 text-brand-text">
                      <div>{p.client?.name}</div>
                      <span className="text-[10px] text-brand-muted">{p.client?.email}</span>
                    </td>
                    <td className="p-3.5 font-bold text-brand-dark">
                      ₹{p.budgetMin?.toLocaleString()} - ₹{p.budgetMax?.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-brand-muted">
                      {p.proposalCount || 0}
                    </td>
                    <td className="p-3.5">
                      <Badge
                        variant={
                          p.status === 'open'
                            ? 'emerald'
                            : p.status === 'in_progress'
                            ? 'blue'
                            : 'rose'
                        }
                      >
                        {p.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <Link
                        to={`/projects/${p._id}`}
                        target="_blank"
                        className="text-xs font-semibold text-brand hover:underline"
                      >
                        View
                      </Link>
                      {p.status === 'open' ? (
                        <button
                          onClick={() => handleUpdateStatus(p._id, 'paused')}
                          className="text-xs font-semibold text-amber-700 hover:underline"
                        >
                          Pause
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(p._id, 'open')}
                          className="text-xs font-semibold text-emerald-700 hover:underline"
                        >
                          Reopen
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminModeration;
