import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import api from '../api/client';
import {
  ShieldCheck,
  Award,
  Calendar,
  User,
  BookOpen,
  Printer,
  AlertTriangle,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

export const CertificateVerifyPage = () => {
  const { certificateId } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCert = async () => {
      try {
        const res = await api.get(`/certificates/verify/${certificateId}`);
        if (res.success && res.data) {
          setCert(res.data.certificate);
        }
      } catch (_) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCert();
  }, [certificateId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg print:bg-white">
      <div className="print:hidden">
        <Navbar />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {/* Verification banner */}
        <div className="print:hidden mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link to="/" className="inline-flex items-center text-xs font-semibold text-brand hover:underline">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Home
          </Link>
          {cert && cert.status === 'active' && (
            <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center space-x-1.5">
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-brand-muted">Verifying certificate credentials...</p>
          </div>
        ) : error || !cert ? (
          <div className="bg-white rounded-2xl border border-rose-200 p-12 text-center max-w-md mx-auto shadow-sm">
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-brand-dark">Certificate Not Found</h2>
            <p className="text-xs text-brand-muted mt-1 mb-4">
              Identifier <code className="font-mono text-brand-dark font-bold">{certificateId}</code> is not recorded in the mintGig verification registry.
            </p>
            <Link to="/">
              <Button variant="outline" size="sm">Go to Homepage</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status bar */}
            <div className={`p-4 rounded-xl border flex items-center justify-between print:hidden ${
              cert.status === 'active'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-xs font-bold">
                    {cert.status === 'active' ? 'Verified Authentic Certificate' : 'Certificate Has Been Revoked'}
                  </p>
                  <p className="text-[11px] text-brand-muted">
                    Issued by mintGig Platform Verification Engine
                  </p>
                </div>
              </div>
              <Badge variant={cert.status === 'active' ? 'emerald' : 'rose'}>
                {cert.status.toUpperCase()}
              </Badge>
            </div>

            {/* Printable Certificate Frame */}
            <div className="relative bg-white rounded-2xl border-8 border-brand-dark/10 p-8 sm:p-14 shadow-xl overflow-hidden print:border-4 print:shadow-none">
              {/* Corner Ornaments */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-brand" />
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-brand" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-brand" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-brand" />

              <div className="text-center space-y-6">
                {/* Logo & Header */}
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-9 h-9 rounded-xl bg-brand-dark flex items-center justify-center text-brand-accent shadow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-extrabold tracking-tight text-brand-dark">
                    mint<span className="text-brand">Gig</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs uppercase font-extrabold tracking-[0.25em] text-brand-muted">
                    Certificate of Verified Completion
                  </h3>
                  <p className="text-xs text-brand-muted font-medium">This is officially presented to</p>
                </div>

                {/* Recipient Name */}
                <div className="py-2">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark underline decoration-brand-accent underline-offset-8">
                    {cert.student?.name}
                  </h2>
                  <p className="text-xs text-brand-muted font-mono mt-2">
                    Student Username: @{cert.student?.username}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-brand-muted max-w-xl mx-auto leading-relaxed">
                  for successfully satisfying all curriculum requirements and achieving a score of{' '}
                  <strong className="text-brand-dark font-bold">{cert.quizScore}%</strong> on the comprehensive assessment for:
                </p>

                {/* Course Title */}
                <div className="p-4 rounded-xl bg-brand-bg border border-brand-border/80 max-w-lg mx-auto">
                  <p className="text-lg font-bold text-brand-dark">{cert.course?.title}</p>
                  <p className="text-xs text-brand-muted mt-1">Instructor: {cert.course?.instructor}</p>
                </div>

                {/* Footer details inside cert */}
                <div className="pt-8 mt-8 border-t border-brand-border grid grid-cols-2 sm:grid-cols-3 gap-4 text-left text-xs">
                  <div>
                    <span className="text-[10px] text-brand-muted block uppercase font-bold">Certificate ID</span>
                    <span className="font-mono font-bold text-brand-dark">{cert.certificateId}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-muted block uppercase font-bold">Date Issued</span>
                    <span className="font-bold text-brand-dark">
                      {new Date(cert.issuedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-1 sm:text-right">
                    <span className="text-[10px] text-brand-muted block uppercase font-bold">Verification URL</span>
                    <span className="text-[11px] text-brand font-medium">
                      mintgig.com/verify-certificate/{cert.certificateId}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
};

export default CertificateVerifyPage;
