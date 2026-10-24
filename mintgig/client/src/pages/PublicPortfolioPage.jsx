import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import api from '../api/client';
import {
  Award,
  BookOpen,
  Code2,
  ExternalLink,
  Github,
  Globe,
  Linkedin,
  MapPin,
  Share2,
  ShieldCheck,
  Check,
  AlertCircle,
  Briefcase,
} from 'lucide-react';

export const PublicPortfolioPage = () => {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.get(`/portfolio/user/${username}`);
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (_) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [username]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-bg">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-bg">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
          <h2 className="text-xl font-bold text-brand-dark">Portfolio Not Found</h2>
          <p className="text-xs text-brand-muted mt-1 mb-4">
            The student portfolio "@{username}" is private or does not exist.
          </p>
          <Link to="/">
            <Button variant="outline" size="sm">Go to Homepage</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const { user, profile, completedCourses, certificates } = data;

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      {/* Top Banner / Hero */}
      <div className="bg-white border-b border-brand-border py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center space-x-5">
              <div className="w-20 h-20 rounded-2xl bg-brand-dark text-brand-accent font-extrabold text-2xl flex items-center justify-center border-2 border-brand-accent shadow-md">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
                    {user.name}
                  </h1>
                  <Badge variant="mint">mintGig Verified</Badge>
                </div>
                <p className="text-xs font-mono text-brand-muted mt-0.5">@{user.username}</p>
                <p className="text-sm font-medium text-brand-dark mt-1.5">
                  {profile.headline || 'Student Developer & Learner'}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-brand-muted">
                  {profile.location && (
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-brand" />
                      <span>{profile.location}</span>
                    </span>
                  )}
                  {profile.availableForHire && (
                    <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Available for Freelance Gigs</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3 self-stretch sm:self-auto">
              <Button variant="outline" size="sm" onClick={handleShare} className="flex-1 sm:flex-initial">
                {copied ? <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 mr-1.5" />}
                <span>{copied ? 'Copied URL!' : 'Share Portfolio'}</span>
              </Button>
            </div>
          </div>

          {/* External Links */}
          <div className="flex items-center space-x-4 mt-6 pt-6 border-t border-brand-border text-xs text-brand-muted">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-dark flex items-center space-x-1.5 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            )}
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-dark flex items-center space-x-1.5 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-dark flex items-center space-x-1.5 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>Website</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Portfolio Sections */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 flex-1 w-full">
        {/* Biography */}
        {profile.bio && (
          <section className="bg-white rounded-xl border border-brand-border p-6 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-3">
              About
            </h2>
            <p className="text-xs text-brand-muted leading-relaxed whitespace-pre-line">
              {profile.bio}
            </p>
          </section>
        )}

        {/* Verified Skills */}
        <section className="bg-white rounded-xl border border-brand-border p-6 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-4">
            Skills & Competencies
          </h2>
          <div className="flex flex-wrap gap-2">
            {(profile.skills || []).map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-brand-bg rounded-lg text-xs font-semibold text-brand-dark border border-brand-border"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Verified mintGig Certificates (Auto-populated!) */}
        <section className="bg-white rounded-xl border border-brand-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-dark flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-brand" />
                <span>Verified mintGig Certificates</span>
              </h2>
              <p className="text-[11px] text-brand-muted mt-0.5">
                Automatically verified credentials issued upon completing coursework and passing server assessments.
              </p>
            </div>
            <Badge variant="emerald">{certificates.length} Verified</Badge>
          </div>

          {certificates.length === 0 ? (
            <p className="text-xs text-brand-muted py-4">No certificates earned yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <div
                  key={cert._id}
                  className="p-4 rounded-xl bg-brand-accentLight/30 border border-brand/20 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="mint">{cert.course?.category || 'Skill Track'}</Badge>
                      <span className="text-[10px] font-mono text-brand-muted">
                        ID: {cert.certificateId}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-brand-dark mb-1">
                      {cert.course?.title}
                    </h3>
                    <p className="text-[11px] text-brand-muted">
                      Assessment Score: <strong className="text-emerald-700">{cert.quizScore}%</strong> · Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-brand/20 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-800 font-medium flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                      <span>Tamper-proof verified</span>
                    </span>
                    <Link
                      to={`/verify-certificate/${cert.certificateId}`}
                      className="text-xs font-semibold text-brand hover:underline inline-flex items-center"
                    >
                      Verify <ExternalLink className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Completed Courses */}
        <section className="bg-white rounded-xl border border-brand-border p-6 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-4 flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-brand" />
            <span>Completed Coursework ({completedCourses.length})</span>
          </h2>

          {completedCourses.length === 0 ? (
            <p className="text-xs text-brand-muted py-4">No courses completed yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {completedCourses.map((c) => (
                <div key={c._id} className="p-3.5 rounded-lg border border-brand-border bg-gray-50/50">
                  <p className="text-xs font-bold text-brand-dark">{c.title}</p>
                  <p className="text-[11px] text-brand-muted mt-1">Instructor: {c.instructor} · {c.level}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Personal & Student Projects */}
        <section className="bg-white rounded-xl border border-brand-border p-6 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-4 flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-brand" />
            <span>Personal Projects & Proof-of-Work ({profile.portfolioProjects?.length || 0})</span>
          </h2>

          {(profile.portfolioProjects || []).length === 0 ? (
            <p className="text-xs text-brand-muted py-4">No personal projects added yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.portfolioProjects.map((proj, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-brand-border bg-brand-bg flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-brand-dark mb-1">{proj.title}</h3>
                    <p className="text-xs text-brand-muted leading-relaxed mb-3">{proj.description}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {(proj.technologies || []).map((t, i) => (
                        <span key={i} className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 pt-3 border-t border-brand-border text-xs font-semibold text-brand">
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="hover:underline flex items-center">
                        Live Demo <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                    {proj.github && (
                      <a href={proj.github} target="_blank" rel="noreferrer" className="hover:underline flex items-center">
                        Code <Github className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default PublicPortfolioPage;
