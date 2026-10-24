import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, TextArea } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Shield } from 'lucide-react';

export const ClientSettings = () => {
  const { user, profile, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [companyName, setCompanyName] = useState(profile?.companyName || '');
  const [industry, setIndustry] = useState(profile?.industry || '');
  const [website, setWebsite] = useState(profile?.website || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await updateProfile({
        name: name.trim(),
        companyName: companyName.trim(),
        industry: industry.trim(),
        website: website.trim(),
        bio: bio.trim(),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Client Settings">
      <div className="max-w-2xl space-y-6">
        <Card className="p-8 bg-white">
          <h2 className="text-base font-bold text-brand-dark mb-4 pb-3 border-b border-brand-border">
            Company & Contact Profile
          </h2>

          {success && (
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 mb-4 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Company settings updated!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Contact Person Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="Company Name"
              placeholder="e.g. EdInnovate Solutions"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Industry"
                placeholder="e.g. EdTech / SaaS"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
              <Input
                label="Company Website"
                placeholder="https://company.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <TextArea
              label="About Company"
              rows={3}
              placeholder="Brief description of your business and project needs..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />

            <div className="pt-4 border-t border-brand-border">
              <Button type="submit" variant="primary" loading={saving}>
                Save Company Profile
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-6 bg-white border-brand-border">
          <div className="flex items-center space-x-2.5 text-xs font-bold text-brand-dark mb-2">
            <Shield className="w-4 h-4 text-brand" />
            <span>Employer Account Verification</span>
          </div>
          <p className="text-xs text-brand-muted leading-relaxed">
            Registered as a Client on mintGig. You can publish projects, review applicant portfolios, and hire certified student talent.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ClientSettings;
