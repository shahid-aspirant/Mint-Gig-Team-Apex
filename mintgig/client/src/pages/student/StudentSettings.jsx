import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { User, Shield, CheckCircle2 } from 'lucide-react';

export const StudentSettings = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await updateProfile({ name: name.trim() });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Account Settings">
      <div className="max-w-2xl space-y-6">
        <Card className="p-8 bg-white">
          <h2 className="text-base font-bold text-brand-dark mb-4 pb-3 border-b border-brand-border">
            Personal Information
          </h2>

          {success && (
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 mb-4 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1.5">
                Email Address
              </label>
              <input
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-brand-border rounded-lg text-gray-500 cursor-not-allowed"
              />
              <p className="text-[10px] text-brand-muted mt-1">
                Account email cannot be modified directly for verification integrity.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1.5">
                Public Username
              </label>
              <input
                disabled
                value={user?.username || ''}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-brand-border rounded-lg text-gray-500 font-mono cursor-not-allowed"
              />
              <p className="text-[10px] text-brand-muted mt-1">
                Portfolio handle: mintgig.com/portfolio/{user?.username}
              </p>
            </div>

            <div className="pt-4 border-t border-brand-border">
              <Button type="submit" variant="primary" loading={saving}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-6 bg-white border-brand-border">
          <div className="flex items-center space-x-2.5 text-xs font-bold text-brand-dark mb-2">
            <Shield className="w-4 h-4 text-brand" />
            <span>Role & Security</span>
          </div>
          <p className="text-xs text-brand-muted leading-relaxed">
            Role: <strong className="capitalize text-brand-dark">{user?.role}</strong>. Sessions are managed through HTTP-only signed tokens.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentSettings;
