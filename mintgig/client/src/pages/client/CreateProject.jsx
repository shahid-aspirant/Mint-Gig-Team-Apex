import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, TextArea } from '../../components/common/Input';
import api from '../../api/client';
import { PlusCircle, AlertCircle } from 'lucide-react';

export const CreateProject = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [budgetType, setBudgetType] = useState('fixed');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [duration, setDuration] = useState('1-2 weeks');
  const [skillsString, setSkillsString] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Web Development',
    'Design',
    'AI/ML',
    'Mobile Development',
    'Data Science',
    'Writing',
    'Marketing',
    'Other',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !budgetMin || !budgetMax) {
      setError('Please fill out all required fields');
      return;
    }

    if (Number(budgetMin) > Number(budgetMax)) {
      setError('Minimum budget cannot exceed maximum budget');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const requiredSkills = skillsString
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await api.post('/projects', {
        title: title.trim(),
        description: description.trim(),
        category,
        budgetType,
        budgetMin: Number(budgetMin),
        budgetMax: Number(budgetMax),
        duration,
        requiredSkills: requiredSkills.length > 0 ? requiredSkills : ['General'],
      });

      if (res.success) {
        navigate('/client/projects');
      }
    } catch (err) {
      setError(err.message || 'Failed to publish project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Post a New Freelance Gig">
      <div className="max-w-3xl space-y-6">
        <p className="text-xs text-brand-muted">
          Specify your project deliverables and requirements. Motivated students with verified course credentials will apply with their automatic portfolios.
        </p>

        <Card className="p-8 bg-white">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200 mb-4 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Project Title"
              required
              placeholder="e.g. Build Responsive Landing Page in React & Tailwind"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <TextArea
              label="Project Description & Deliverables"
              required
              rows={5}
              placeholder="Detail the scope of work, technical requirements, deliverables, and expectations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              helperText="Minimum 30 characters."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Minimum Budget (INR ₹)"
                type="number"
                required
                placeholder="e.g. 5000"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
              />

              <Input
                label="Maximum Budget (INR ₹)"
                type="number"
                required
                placeholder="e.g. 8000"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1.5">
                  Budget Type
                </label>
                <select
                  value={budgetType}
                  onChange={(e) => setBudgetType(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                </select>
              </div>

              <Input
                label="Estimated Duration"
                placeholder="e.g. 1-2 weeks"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            <Input
              label="Required Skills (comma separated)"
              placeholder="React, Tailwind CSS, JavaScript, Responsive Design"
              value={skillsString}
              onChange={(e) => setSkillsString(e.target.value)}
            />

            <div className="pt-4 border-t border-brand-border">
              <Button type="submit" variant="primary" size="lg" loading={submitting}>
                Publish Project Listing
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateProject;
