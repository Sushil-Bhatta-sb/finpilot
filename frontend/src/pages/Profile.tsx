import { useEffect, useState } from 'react';
import type { UserProfile } from '../types';
import { getProfile, updateProfile, changePassword } from '../api/profile';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';

export default function Profile() {
  const { setTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMessage, setPwMessage] = useState('');
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    getProfile()
      .then((res) => {
        setProfile(res.data);
        if (res.data.theme) setTheme(res.data.theme);
      })
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (field: keyof UserProfile, value: string) => {
    setProfile((p) => (p ? { ...p, [field]: value } : p));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const res = await updateProfile({
        name: profile.name,
        phone: profile.phone,
        photo: profile.photo,
        currency: profile.currency,
        timezone: profile.timezone,
        theme: profile.theme,
      });
      setProfile(res.data);
      if (res.data.theme) setTheme(res.data.theme);
      setMessage('Profile updated.');
    } catch {
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwSaving(true);
    setPwMessage('');
    setPwError('');
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setPwMessage('Password changed successfully.');
    } catch {
      setPwError('Failed to change password. Check your current password.');
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) return <Spinner label="Loading profile…" />;
  if (!profile) return <p className="error-text">{error || 'No profile.'}</p>;

  return (
    <div className="stack">
      <div className="page-head">
        <h1>Profile</h1>
      </div>

      <div className="grid-2">
        <Card>
          <div className="card-header">
            <span className="card-title">Account Details</span>
          </div>
          <form onSubmit={handleSave}>
            <Input label="Name" value={profile.name} onChange={(e) => update('name', e.target.value)} />
            <Input label="Email" value={profile.email} disabled />
            <Input
              label="Phone"
              value={profile.phone || ''}
              onChange={(e) => update('phone', e.target.value)}
            />
            <Input
              label="Photo URL"
              value={profile.photo || ''}
              onChange={(e) => update('photo', e.target.value)}
            />
            <Input
              label="Currency"
              value={profile.currency || ''}
              onChange={(e) => update('currency', e.target.value)}
            />
            <Input
              label="Timezone"
              value={profile.timezone || ''}
              onChange={(e) => update('timezone', e.target.value)}
            />
            <div className="field">
              <label className="field-label">Theme</label>
              <select
                className="field-input"
                value={profile.theme || 'light'}
                onChange={(e) => update('theme', e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            {message && <p className="success-text">{message}</p>}
            {error && <p className="error-text">{error}</p>}
            <Button type="submit" loading={saving} fullWidth>
              Save Changes
            </Button>
          </form>
        </Card>

        <Card>
          <div className="card-header">
            <span className="card-title">Change Password</span>
          </div>
          <form onSubmit={handleChangePassword}>
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {pwMessage && <p className="success-text">{pwMessage}</p>}
            {pwError && <p className="error-text">{pwError}</p>}
            <Button type="submit" loading={pwSaving} fullWidth>
              Update Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
