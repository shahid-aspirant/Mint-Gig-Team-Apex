import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, TextArea } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import {
  User,
  Award,
  BookOpen,
  Code2,
  ExternalLink,
  Plus,
  Trash2,
  Share2,
  Check,
  ShieldCheck,
} from 'lucide-react';

export const StudentPortfolioEditor = () => {
  const { user, profile: authProfile, refreshUser } = useAuth();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // Profile fields state
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [skillsString, setSkillsString] = useState('');
  const [location, setLocation] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');
  const [isPortfolioPublic, setIsPortfolioPublic] = useState(true);
  const [availableForHire, setAvailableForHire] = useState(true);

  // Project Modal state
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectTech, setProjectTech] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [projectGithub, setProjectGithub] = useState('');
  const [addingProject, setAddingProject] = useState(false);

  const fetchPortfolio = async () => {
    try {
      const res = await api.get('/portfolio/me');
      if (res.success && res.data) {
        setPortfolioData(res.data);
        const p = res.data.profile || {};
        setHeadline(p.headline || '');
        setBio(p.bio || '');
        setSkillsString((p.skills || []).join(', '));
        setLocation(p.location || '');
        setGithub(p.github || '');
        setLinkedin(p.linkedin || '');
        setWebsite(p.website || '');
        setIsPortfolioPublic(p.isPortfolioPublic ?? true);
        setAvailableForHire(p.availableForHire ?? true);
      }
    } catch (_) {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      const skills = skillsString
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await api.put('/auth/profile', {
        headline,
        bio,
        skills,
        location,
        github,
        linkedin,
        website,
        isPortfolioPublic,
        availableForHire,
      });

      await refreshUser();
      await fetchPortfolio();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    setAddingProject(true);
    try {
      const technologies = projectTech
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await api.post('/portfolio/projects', {
        title: projectTitle.trim(),
        description: projectDesc.trim(),
        technologies,
        link: projectLink.trim(),
        github: projectGithub.trim(),
      });

      setProjectTitle('');
      setProjectDesc('');
      setProjectTech('');
      setProjectLink('');
      setProjectGithub('');
      setProjectModalOpen(false);
      await fetchPortfolio();
    } catch (err) {
      alert(err.message || 'Failed to add project');
    } finally {
      setAddingProject(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm('Remove this project from your portfolio?')) return;
    try {
      await api.delete(`/portfolio/projects/${projectId}`);
      await fetchPortfolio();
    } catch (err) {
      alert(err.message || 'Failed to delete project');
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/portfolio/${user?.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout title="Portfolio Builder">
      <div className="space-y-8 max-w-5xl">
        {/* Banner with Live Link */}
        <div className="bg-white rounded-xl border border-brand-border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-brand-dark flex items-center space-x-1.5">
              <span>Your Public Portfolio URL:</span>
              <Badge variant="mint">Live</Badge>
            </p>
            <p className="text-xs font-mono text-brand mt-0.5">
              {window.location.origin}/portfolio/{user?.username}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={handleShare}>
              {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 mr-1" />}
              <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
            </Button>
            <Link to={`/portfolio/${user?.username}`} target="_blank" rel="noreferrer">
              <Button variant="primary" size="sm">
                <span>View Live Portfolio</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Section 1: Auto-populated verified credentials summary */}
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Automatic Sync Active</span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            Your earned certificates ({portfolioData?.certificates?.length || 0}) and completed courses ({portfolioData?.completedCourses?.length || 0}) automatically reflect on your public portfolio directly from MongoDB. No manual updating required!
          </p>
        </div>

        {/* Section 2: Bio & Profile Customization */}
        <Card className="p-8 bg-white">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-border">
            <h2 className="text-base font-bold text-brand-dark">Profile Details & Bio</h2>
            {saveSuccess && (
              <Badge variant="emerald">Changes Saved Successfully</Badge>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <Input
              label="Professional Headline"
              placeholder="e.g. Full-Stack MERN Developer & React Enthusiast"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />

            <TextArea
              label="Professional Biography"
              rows={4}
              placeholder="Tell clients and employers about your passion, student background, and what problems you solve..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />

            <Input
              label="Skills (comma separated)"
              placeholder="React, Node.js, Express, MongoDB, Tailwind CSS, Python"
              value={skillsString}
              onChange={(e) => setSkillsString(e.target.value)}
              helperText="Separate multiple skills with commas."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Location"
                placeholder="e.g. Bengaluru, India"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Input
                label="GitHub Profile URL"
                placeholder="https://github.com/username"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="LinkedIn Profile URL"
                placeholder="https://linkedin.com/in/username"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />
              <Input
                label="Personal Website URL"
                placeholder="https://yourwebsite.dev"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
              <label className="flex items-center space-x-2 text-xs font-semibold text-brand-dark cursor-pointer">
                <input
                  type="checkbox"
                  checked={availableForHire}
                  onChange={(e) => setAvailableForHire(e.target.checked)}
                  className="rounded text-brand focus:ring-brand"
                />
                <span>Available for Freelance Opportunities</span>
              </label>

              <label className="flex items-center space-x-2 text-xs font-semibold text-brand-dark cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPortfolioPublic}
                  onChange={(e) => setIsPortfolioPublic(e.target.checked)}
                  className="rounded text-brand focus:ring-brand"
                />
                <span>Public Portfolio Visibility</span>
              </label>
            </div>

            <div className="pt-4 border-t border-brand-border">
              <Button type="submit" variant="primary" loading={saving}>
                Save Profile Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* Section 3: Personal Proof-of-Work Projects */}
        <Card className="p-8 bg-white">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-border">
            <div>
              <h2 className="text-base font-bold text-brand-dark">Personal Projects</h2>
              <p className="text-xs text-brand-muted mt-0.5">
                Add your own coding and design projects to showcase your practical experience.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setProjectModalOpen(true)}
              className="flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </Button>
          </div>

          {(portfolioData?.profile?.portfolioProjects || []).length === 0 ? (
            <p className="text-xs text-brand-muted py-6 text-center">
              No personal projects added yet. Click "Add Project" to add your GitHub repositories or live apps.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolioData.profile.portfolioProjects.map((p) => (
                <div
                  key={p._id}
                  className="p-4 rounded-xl border border-brand-border bg-brand-bg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-bold text-brand-dark">{p.title}</h4>
                      <button
                        onClick={() => handleDeleteProject(p._id)}
                        className="text-brand-muted hover:text-rose-600 p-1"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-brand-muted mt-1 leading-relaxed">{p.description}</p>
                    <div className="flex flex-wrap gap-1 my-3">
                      {(p.technologies || []).map((t, idx) => (
                        <span key={idx} className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-2 text-xs font-semibold text-brand">
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noreferrer" className="hover:underline">
                        Live Demo
                      </a>
                    )}
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noreferrer" className="hover:underline">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Add Project Modal */}
      <Modal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        title="Add Personal Project"
      >
        <form onSubmit={handleAddProject} className="space-y-4">
          <Input
            label="Project Title"
            required
            placeholder="e.g. Campus Food Delivery App"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
          />
          <TextArea
            label="Description"
            rows={3}
            placeholder="Brief overview of the project, features, and your role..."
            value={projectDesc}
            onChange={(e) => setProjectDesc(e.target.value)}
          />
          <Input
            label="Technologies Used (comma separated)"
            placeholder="React, Node.js, Express, MongoDB, Tailwind CSS"
            value={projectTech}
            onChange={(e) => setProjectTech(e.target.value)}
          />
          <Input
            label="Live Application Demo URL"
            placeholder="https://my-app.vercel.app"
            value={projectLink}
            onChange={(e) => setProjectLink(e.target.value)}
          />
          <Input
            label="GitHub Repository URL"
            placeholder="https://github.com/username/project"
            value={projectGithub}
            onChange={(e) => setProjectGithub(e.target.value)}
          />

          <div className="pt-3 border-t border-brand-border flex justify-end space-x-3">
            <Button variant="outline" size="sm" onClick={() => setProjectModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={addingProject}>
              Add to Portfolio
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default StudentPortfolioEditor;
