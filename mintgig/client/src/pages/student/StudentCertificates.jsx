import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import api from '../../api/client';
import { Award, ShieldCheck, ExternalLink, Calendar, BookOpen } from 'lucide-react';

export const StudentCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await api.get('/certificates/my');
        if (res.success) setCertificates(res.data.certificates || []);
      } catch (_) {}
      finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  return (
    <DashboardLayout title="My Verified Certificates">
      <div className="space-y-6">
        <p className="text-xs text-brand-muted">
          All certificates here are issued only after passing required course assessments. They are permanently recorded and tamper-proof.
        </p>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-brand-muted">Loading your certificates...</p>
          </div>
        ) : certificates.length === 0 ? (
          <Card className="p-12 text-center max-w-md mx-auto">
            <Award className="w-10 h-10 text-brand-muted mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-bold text-brand-dark">No certificates earned yet</h3>
            <p className="text-xs text-brand-muted mt-1 mb-4">
              Complete your enrolled course lessons and pass the final assessment quiz to earn your verified credential.
            </p>
            <Link to="/student/courses">
              <Button variant="primary" size="sm">Go to My Courses</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <Card key={cert._id} className="p-6 border-brand/20 bg-white" hover>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="mint">{cert.course?.category || 'Skill Track'}</Badge>
                  <span className="text-xs font-mono font-bold text-brand-dark">
                    ID: {cert.certificateId}
                  </span>
                </div>

                <h3 className="text-base font-bold text-brand-dark mb-1">
                  {cert.course?.title}
                </h3>

                <p className="text-xs text-brand-muted mb-4">
                  Assessment Score: <strong className="text-emerald-700">{cert.quizScore}%</strong> · Issued:{' '}
                  {new Date(cert.issuedAt).toLocaleDateString()}
                </p>

                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] mb-4 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Automatically pinned to your public student portfolio</span>
                </div>

                <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                  <Link to={`/verify-certificate/${cert.certificateId}`}>
                    <Button variant="primary" size="sm" className="flex items-center space-x-1">
                      <span>View & Print</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>

                  <Link to="/student/portfolio">
                    <Button variant="outline" size="sm">
                      Inspect on Portfolio
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentCertificates;
