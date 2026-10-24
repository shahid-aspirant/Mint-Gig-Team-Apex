import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Input, TextArea } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import {
  Briefcase,
  Clock,
  IndianRupee,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Send,
  User,
} from 'lucide-react';

export const ProjectDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [userProposal, setUserProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  // Proposal form state
  const [coverMessage, setCoverMessage] = useState('');
  const [proposedBudget, setProposedBudget] = useState('');
  const [estimatedDays, setEstimatedDays] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        if (res.success && res.data) {
          setProject(res.data.project);
          setUserProposal(res.data.userProposal);
          if (res.data.project) {
            setProposedBudget(res.data.project.budgetMin || '');
          }
        }
      } catch (_) {
        setProject(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: `/projects/${id}` } });
      return;
    }

    if (user.role !== 'student') {
      setError('Only student accounts can apply for freelance projects.');
      return;
    }

    if (!coverMessage || coverMessage.trim().length < 20) {
      setError('Cover message must be at least 20 characters.');
      return;
    }

    if (!proposedBudget || Number(proposedBudget) <= 0) {
      setError('Please provide a valid proposed budget.');
      return;
    }

    if (!estimatedDays || Number(estimatedDays) < 1) {
      setError('Please provide estimated delivery timeline in days.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await api.post(`/projects/${id}/proposals`, {
        coverMessage: coverMessage.trim(),
        proposedBudget: Number(proposedBudget),
        estimatedDays: Number(estimatedDays),
        relevantSkills: project.requiredSkills || [],
      });

      if (res.success && res.data) {
        setUserProposal(res.data.proposal);
        setSuccess('Your proposal has been submitted to the client successfully!');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit proposal');
    } finally {
      setSubmitting(false);
    }
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

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-bg">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
          <h2 className="text-xl font-bold text-brand-dark">Project Not Found</h2>
          <p className="text-xs text-brand-muted mt-1 mb-4">This project does not exist or has been removed.</p>
          <Link to="/projects">
            <Button variant="outline" size="sm">Back to Projects</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <Link to="/projects" className="inline-flex items-center text-xs font-semibold text-brand hover:underline mb-6">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to all projects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <Badge variant="emerald">{project.category}</Badge>
                <span className="text-xs font-semibold text-brand-muted">
                  Status: <strong className="text-brand-dark uppercase">{project.status}</strong>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark mb-4">
                {project.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 py-4 border-y border-brand-border text-xs text-brand-muted mb-6">
                <div>
                  <span className="block text-brand-dark font-extrabold text-base">
                    ₹{project.budgetMin?.toLocaleString()} - ₹{project.budgetMax?.toLocaleString()}
                  </span>
                  <span className="text-[10px] uppercase font-semibold">Budget (INR)</span>
                </div>
                <div>
                  <span className="block text-brand-dark font-semibold">
                    {project.duration || 'Flexible'}
                  </span>
                  <span className="text-[10px] uppercase font-semibold">Estimated Duration</span>
                </div>
                <div>
                  <span className="block text-brand-dark font-semibold">
                    {project.proposalCount || 0}
                  </span>
                  <span className="text-[10px] uppercase font-semibold">Proposals</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-brand-dark">Project Overview & Deliverables</h3>
                <p className="text-xs text-brand-muted leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-brand-border">
                <h3 className="text-sm font-bold text-brand-dark mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {project.requiredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-brand-bg rounded-lg text-xs font-semibold text-brand-dark border border-brand-border"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Proposal Submission or Existing Proposal Status */}
            {userProposal ? (
              <Card className="p-6 border-emerald-200 bg-emerald-50/50">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>You Have Applied for This Project</span>
                </div>
                <div className="space-y-2 text-xs text-brand-text">
                  <p>
                    <strong>Status:</strong>{' '}
                    <span className="uppercase font-bold text-brand">{userProposal.status}</span>
                  </p>
                  <p>
                    <strong>Proposed Budget:</strong> ₹{userProposal.proposedBudget?.toLocaleString()}
                  </p>
                  <p>
                    <strong>Delivery Timeline:</strong> {userProposal.estimatedDays} Days
                  </p>
                  <p className="pt-2 text-brand-muted italic">"{userProposal.coverMessage}"</p>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-200">
                  <Link to="/student/proposals">
                    <Button variant="outline" size="sm">
                      Manage My Proposals
                    </Button>
                  </Link>
                </div>
              </Card>
            ) : user?.role === 'student' ? (
              <Card className="p-8">
                <h3 className="text-lg font-bold text-brand-dark mb-1 flex items-center space-x-2">
                  <Send className="w-4 h-4 text-brand" />
                  <span>Submit a Proposal</span>
                </h3>
                <p className="text-xs text-brand-muted mb-6">
                  Your public mintGig profile, verified certificates, and completed courses will be automatically linked with your proposal.
                </p>

                {error && (
                  <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200 mb-4">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 mb-4">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmitProposal} className="space-y-4">
                  <TextArea
                    label="Cover Message & Approach"
                    required
                    rows={5}
                    placeholder="Describe how your skills and coursework prepare you to successfully complete this project..."
                    value={coverMessage}
                    onChange={(e) => setCoverMessage(e.target.value)}
                    helperText="Minimum 20 characters. Highlight relevant coursework and projects."
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Proposed Budget (INR)"
                      required
                      type="number"
                      placeholder={`e.g. ${project.budgetMin}`}
                      value={proposedBudget}
                      onChange={(e) => setProposedBudget(e.target.value)}
                    />
                    <Input
                      label="Estimated Delivery (Days)"
                      required
                      type="number"
                      placeholder="e.g. 7"
                      value={estimatedDays}
                      onChange={(e) => setEstimatedDays(e.target.value)}
                    />
                  </div>

                  <div className="pt-2">
                    <Button type="submit" variant="primary" size="lg" loading={submitting}>
                      Submit Proposal
                    </Button>
                  </div>
                </form>
              </Card>
            ) : user?.role === 'client' ? (
              <Card className="p-6 bg-brand-bg text-center">
                <p className="text-xs text-brand-muted">
                  You are logged in as a Client. To apply for projects, sign in with a student account.
                </p>
              </Card>
            ) : (
              <Card className="p-8 text-center bg-white">
                <h3 className="text-base font-bold text-brand-dark mb-2">Want to apply for this project?</h3>
                <p className="text-xs text-brand-muted mb-4 max-w-sm mx-auto">
                  Create a student profile or sign in to submit your proposal with your automatic mintGig portfolio.
                </p>
                <div className="flex justify-center gap-3">
                  <Link to="/login" state={{ from: `/projects/${id}` }}>
                    <Button variant="outline" size="sm">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="sm">Register as Student</Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column: Client Profile Info */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-4">
                About the Client
              </h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-accentLight text-brand-dark font-bold text-sm flex items-center justify-center border border-brand/20">
                  {project.client?.name?.charAt(0) || 'C'}
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-dark">{project.client?.name || 'Verified Client'}</p>
                  <p className="text-[10px] text-brand-muted">mintGig Verified Employer</p>
                </div>
              </div>
              <div className="space-y-2 text-xs text-brand-muted border-t border-brand-border pt-4">
                <div className="flex items-center space-x-2 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Payment terms verified</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>In-app messaging supported</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProjectDetailsPage;
