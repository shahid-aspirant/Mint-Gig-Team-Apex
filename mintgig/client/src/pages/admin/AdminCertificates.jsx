import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import api from '../../api/client';
import { Award, ShieldCheck, ExternalLink } from 'lucide-react';

export const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCerts = async () => {
    try {
      const res = await api.get('/certificates/admin/all');
      if (res.success && res.data) {
        setCertificates(res.data.certificates || []);
      }
    } catch (_) {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const handleRevoke = async (certId) => {
    const reason = prompt('Reason for revocation:');
    if (!reason) return;

    try {
      const res = await api.put(`/certificates/admin/${certId}/revoke`, { reason });
      if (res.success) {
        await fetchCerts();
      }
    } catch (err) {
      alert(err.message || 'Revocation failed');
    }
  };

  return (
    <DashboardLayout title="Certificate Registry & Verification">
      <div className="space-y-6">
        <p className="text-xs text-brand-muted">
          All platform certificates and cryptographic identifiers. Only genuine completions are recordable.
        </p>

        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-bg border-b border-brand-border text-brand-muted font-bold">
                <tr>
                  <th className="p-3.5">Certificate ID</th>
                  <th className="p-3.5">Student</th>
                  <th className="p-3.5">Course</th>
                  <th className="p-3.5">Score</th>
                  <th className="p-3.5">Issued Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {certificates.map((cert) => (
                  <tr key={cert._id} className="hover:bg-gray-50/60">
                    <td className="p-3.5 font-mono font-bold text-brand">
                      {cert.certificateId}
                    </td>
                    <td className="p-3.5 font-bold text-brand-dark">
                      <div>{cert.student?.name}</div>
                      <span className="text-[10px] text-brand-muted font-normal font-mono">
                        @{cert.student?.username}
                      </span>
                    </td>
                    <td className="p-3.5 text-brand-text">{cert.course?.title}</td>
                    <td className="p-3.5 font-extrabold text-emerald-700">
                      {cert.quizScore}%
                    </td>
                    <td className="p-3.5 text-brand-muted">
                      {new Date(cert.issuedAt).toLocaleDateString()}
                    </td>
                    <td className="p-3.5">
                      <Badge variant={cert.status === 'active' ? 'emerald' : 'rose'}>
                        {cert.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <Link
                        to={`/verify-certificate/${cert.certificateId}`}
                        target="_blank"
                        className="text-xs font-semibold text-brand hover:underline inline-flex items-center"
                      >
                        <span>Verify</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                      {cert.status === 'active' && (
                        <button
                          onClick={() => handleRevoke(cert._id)}
                          className="text-xs font-semibold text-rose-600 hover:underline"
                        >
                          Revoke
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

export default AdminCertificates;
