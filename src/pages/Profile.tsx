import { useState, useEffect } from 'react';
import { User, Save, Bell } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Textarea } from '../components/Textarea';

interface Profile {
  id: string;
  full_name: string;
  user_type: string;
  phone: string;
  address: string;
  notification_preferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  updated_at?: string;
}

interface ProfileProps {
  userId: string;
}

export function Profile({ userId }: ProfileProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    userType: 'buyer',
    phone: '',
    address: '',
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  });

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/profile/${userId}/`);
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data: Profile = await res.json();

      setProfile(data);
      setFormData({
        fullName: data.full_name || '',
        userType: data.user_type || 'buyer',
        phone: data.phone || '',
        address: data.address || '',
        emailNotifications: data.notification_preferences?.email ?? true,
        smsNotifications: data.notification_preferences?.sms ?? false,
        pushNotifications: data.notification_preferences?.push ?? true,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/profile/${userId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.fullName,
          user_type: formData.userType,
          phone: formData.phone,
          address: formData.address,
          notification_preferences: {
            email: formData.emailNotifications,
            sms: formData.smsNotifications,
            push: formData.pushNotifications,
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      alert('Profile updated successfully!');
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile & Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <User className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            </div>

            <div className="space-y-4">
              <Input
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Doe"
              />

              <Select
                label="User Type"
                value={formData.userType}
                onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                options={[
                  { value: 'farmer', label: 'Farmer' },
                  { value: 'buyer', label: 'Buyer' },
                  { value: 'delivery_picker', label: 'Delivery Picker' },
                  { value: 'admin', label: 'Admin' },
                ]}
              />

              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91-9876543210"
              />

              <Textarea
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                placeholder="123 Main Street, City, State, ZIP"
              />
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
            </div>

            {['Email', 'SMS', 'Push'].map((type) => (
              <div key={type} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{type} Notifications</p>
                  <p className="text-sm text-gray-600">Receive updates via {type.toLowerCase()}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      type === 'Email'
                        ? formData.emailNotifications
                        : type === 'SMS'
                        ? formData.smsNotifications
                        : formData.pushNotifications
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ...(type === 'Email'
                          ? { emailNotifications: e.target.checked }
                          : type === 'SMS'
                          ? { smsNotifications: e.target.checked }
                          : { pushNotifications: e.target.checked }),
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            ))}
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-5 w-5 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
