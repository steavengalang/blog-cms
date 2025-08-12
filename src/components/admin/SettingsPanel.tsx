import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import {
  CogIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface BlogSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  adminEmail: string;
  postsPerPage: number;
  allowComments: boolean;
  moderateComments: boolean;
  enableNewsletter: boolean;
  seoTitle: string;
  seoDescription: string;
  analyticsCode: string;
}

const SettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<BlogSettings>({
    siteName: 'My Blog',
    siteDescription: 'A personal blog about technology and life',
    siteUrl: 'https://myblog.com',
    adminEmail: 'admin@myblog.com',
    postsPerPage: 10,
    allowComments: true,
    moderateComments: true,
    enableNewsletter: true,
    seoTitle: 'My Blog - Technology and Life',
    seoDescription: 'Personal blog sharing insights about technology, development, and life experiences',
    analyticsCode: ''
  });

  const [_isLoading, _setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (field: keyof BlogSettings, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      // Save to Supabase
      // await supabase
      //   .from('settings')
      //   .upsert(settings);

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        siteName: 'My Blog',
        siteDescription: 'A personal blog about technology and life',
        siteUrl: 'https://myblog.com',
        adminEmail: 'admin@myblog.com',
        postsPerPage: 10,
        allowComments: true,
        moderateComments: true,
        enableNewsletter: true,
        seoTitle: 'My Blog - Technology and Life',
        seoDescription: 'Personal blog sharing insights about technology, development, and life experiences',
        analyticsCode: ''
      });
      setMessage(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Settings</h1>
          <p className="text-gray-600 mt-1">Configure your blog settings and preferences</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" onClick={handleReset}>
            Reset to Default
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <CheckIcon className="w-5 h-5 mr-2" />
            ) : (
              <XMarkIcon className="w-5 h-5 mr-2" />
            )}
            {message.text}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <CogIcon className="w-5 h-5 mr-2" />
              General Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  placeholder="Enter site name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Description
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  placeholder="Enter site description"
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site URL
                </label>
                <Input
                  value={settings.siteUrl}
                  onChange={(e) => handleInputChange('siteUrl', e.target.value)}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Email
                </label>
                <Input
                  value={settings.adminEmail}
                  onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                  placeholder="admin@example.com"
                  type="email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Posts Per Page
                </label>
                <Select
                  value={settings.postsPerPage.toString()}
                  onChange={(e) => handleInputChange('postsPerPage', parseInt(e.target.value))}
                  className="w-32"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                  <option value="25">25</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Comment Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Comment Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Allow Comments</label>
                  <p className="text-xs text-gray-500">Enable commenting on blog posts</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowComments}
                  onChange={(e) => handleInputChange('allowComments', e.target.checked)}
                  className="rounded border-gray-300"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Moderate Comments</label>
                  <p className="text-xs text-gray-500">Require approval before publishing comments</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.moderateComments}
                  onChange={(e) => handleInputChange('moderateComments', e.target.checked)}
                  className="rounded border-gray-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SEO & Analytics */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default SEO Title
                </label>
                <Input
                  value={settings.seoTitle}
                  onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                  placeholder="Enter default SEO title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default SEO Description
                </label>
                <textarea
                  value={settings.seoDescription}
                  onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                  placeholder="Enter default SEO description"
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics & Integration</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Newsletter</label>
                  <p className="text-xs text-gray-500">Enable newsletter subscription</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableNewsletter}
                  onChange={(e) => handleInputChange('enableNewsletter', e.target.checked)}
                  className="rounded border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Analytics Code
                </label>
                <textarea
                  value={settings.analyticsCode}
                  onChange={(e) => handleInputChange('analyticsCode', e.target.value)}
                  placeholder="Paste your Google Analytics or other tracking code here"
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This code will be added to the &lt;head&gt; section of your blog
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
