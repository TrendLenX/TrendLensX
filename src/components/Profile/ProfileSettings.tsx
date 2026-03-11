import { useState } from 'react';
import { User, Save, Mail, Bell, Moon, Globe, Shield } from 'lucide-react';
import { User as UserType } from '@/types';

interface Settings {
  emailNotifications: boolean;
  weeklyDigest: boolean;
  newFollowerAlerts: boolean;
  commentReplies: boolean;
  readingReminders: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
}

interface ProfileSettingsProps {
  user: UserType;
  initialSettings: Settings;
}

export default function ProfileSettings({ user, initialSettings }: ProfileSettingsProps) {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [profileData, setProfileData] = useState({
    name: user.name,
    bio: user.bio || '',
    location: user.location || '',
    website: user.website || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (key: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleProfileChange = (key: string, value: string) => {
    setProfileData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // In a real app, this would save to the database
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setIsSaving(false);
    // Show success message
  };

  return (
    <div className="space-y-8">
      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <User className="w-5 h-5 text-gray-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => handleProfileChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => handleProfileChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => handleProfileChange('bio', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
            <input
              type="url"
              value={profileData.website}
              onChange={(e) => handleProfileChange('website', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Bell className="w-5 h-5 text-gray-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
              <p className="text-sm text-gray-600">Receive email notifications for important updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Weekly Digest</h3>
              <p className="text-sm text-gray-600">Get a weekly summary of trending articles</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.weeklyDigest}
                onChange={(e) => handleSettingChange('weeklyDigest', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">New Follower Alerts</h3>
              <p className="text-sm text-gray-600">Get notified when someone follows you</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.newFollowerAlerts}
                onChange={(e) => handleSettingChange('newFollowerAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Comment Replies</h3>
              <p className="text-sm text-gray-600">Get notified when someone replies to your comments</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.commentReplies}
                onChange={(e) => handleSettingChange('commentReplies', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Reading Reminders</h3>
              <p className="text-sm text-gray-600">Get reminders to continue reading saved articles</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.readingReminders}
                onChange={(e) => handleSettingChange('readingReminders', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Globe className="w-5 h-5 text-gray-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Preferences</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Shield className="w-5 h-5 text-gray-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Privacy & Security</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Profile Visibility</h3>
              <p className="text-sm text-gray-600">Control who can see your profile and reading activity</p>
            </div>
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">Public</span>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Reading Activity</h3>
              <p className="text-sm text-gray-600">Show your reading activity on your public profile</p>
            </div>
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">Visible</span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}