import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cog6ToothIcon,
  KeyIcon,
  ServerIcon,
  ShieldCheckIcon,
  CircleStackIcon,
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CloudArrowUpIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

// Import existing component
import APIStatusIndicator from '../APIStatusIndicator';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('api-config');
  const [settings, setSettings] = useState({
    openaiApiKey: process.env.REACT_APP_OPENAI_API_KEY ? '••••••••••••' : '',
    youtubeApiKey: process.env.REACT_APP_YOUTUBE_API_KEY ? '••••••••••••' : '',
    databaseUrl: '••••••••••••',
    maxUploadSize: '10MB',
    sessionTimeout: '30',
    emailNotifications: true,
    analyticsEnabled: true,
    debugMode: false
  });

  const tabs = [
    { id: 'api-config', name: 'API Configuration', icon: KeyIcon },
    { id: 'system-config', name: 'System Config', icon: ServerIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'backup', name: 'Backup & Restore', icon: CircleStackIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon }
  ];

  const SettingCard = ({ title, description, children }) => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      {children}
    </div>
  );

  const InputField = ({ label, value, onChange, type = 'text', placeholder, masked = false }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <input
        type={masked ? 'password' : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  const ToggleSwitch = ({ label, checked, onChange, description }) => (
    <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
      <div>
        <h4 className="font-medium text-white">{label}</h4>
        {description && <p className="text-sm text-gray-400">{description}</p>}
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'api-config':
        return (
          <div className="space-y-6">
            <SettingCard
              title="API Status Overview"
              description="Monitor the status of external services"
            >
              <APIStatusIndicator />
            </SettingCard>

            <SettingCard
              title="OpenAI Configuration"
              description="Configure OpenAI API for content generation and AI features"
            >
              <div className="space-y-4">
                <InputField
                  label="OpenAI API Key"
                  value={settings.openaiApiKey}
                  onChange={(e) => setSettings({...settings, openaiApiKey: e.target.value})}
                  placeholder="sk-..."
                  masked={true}
                />
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircleIcon className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">API key is configured and working</span>
                </div>
              </div>
            </SettingCard>

            <SettingCard
              title="YouTube API Configuration"
              description="Configure YouTube Data API for video processing"
            >
              <div className="space-y-4">
                <InputField
                  label="YouTube API Key"
                  value={settings.youtubeApiKey}
                  onChange={(e) => setSettings({...settings, youtubeApiKey: e.target.value})}
                  placeholder="AIza..."
                  masked={true}
                />
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircleIcon className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">YouTube API is accessible</span>
                </div>
              </div>
            </SettingCard>
          </div>
        );

      case 'system-config':
        return (
          <div className="space-y-6">
            <SettingCard
              title="Upload Settings"
              description="Configure file upload limits and restrictions"
            >
              <div className="space-y-4">
                <InputField
                  label="Maximum Upload Size"
                  value={settings.maxUploadSize}
                  onChange={(e) => setSettings({...settings, maxUploadSize: e.target.value})}
                  placeholder="10MB"
                />
                <InputField
                  label="Session Timeout (minutes)"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({...settings, sessionTimeout: e.target.value})}
                  type="number"
                />
              </div>
            </SettingCard>

            <SettingCard
              title="Feature Toggles"
              description="Enable or disable platform features"
            >
              <div className="space-y-4">
                <ToggleSwitch
                  label="Analytics Tracking"
                  checked={settings.analyticsEnabled}
                  onChange={() => setSettings({...settings, analyticsEnabled: !settings.analyticsEnabled})}
                  description="Track user interactions and performance metrics"
                />
                <ToggleSwitch
                  label="Debug Mode"
                  checked={settings.debugMode}
                  onChange={() => setSettings({...settings, debugMode: !settings.debugMode})}
                  description="Enable detailed logging for troubleshooting"
                />
              </div>
            </SettingCard>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <SettingCard
              title="Authentication Settings"
              description="Configure user authentication and security policies"
            >
              <div className="space-y-4">
                <div className="bg-green-900 bg-opacity-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <ShieldCheckIcon className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium">Security Status: Good</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-2">
                    All security measures are properly configured
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Password Requirements</p>
                    <p className="text-white">Minimum 8 characters, mixed case</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Session Security</p>
                    <p className="text-white">HTTPS enforced</p>
                  </div>
                  <div>
                    <p className="text-gray-400">API Rate Limiting</p>
                    <p className="text-white">100 requests/minute</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Email Verification</p>
                    <p className="text-white">Required for new accounts</p>
                  </div>
                </div>
              </div>
            </SettingCard>

            <SettingCard
              title="Firewall & Access Control"
              description="Manage IP restrictions and access policies"
            >
              <div className="text-center py-8">
                <ShieldCheckIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Advanced security settings</p>
                <p className="text-sm text-gray-500">Contact support for IP whitelisting and advanced controls</p>
              </div>
            </SettingCard>
          </div>
        );

      case 'backup':
        return (
          <div className="space-y-6">
            <SettingCard
              title="Automated Backups"
              description="Configure automatic data backup schedules"
            >
              <div className="space-y-4">
                <div className="bg-blue-900 bg-opacity-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-400 font-medium">Last Backup</p>
                      <p className="text-sm text-gray-300">Today at 3:00 AM</p>
                    </div>
                    <CheckCircleIcon className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="flex items-center justify-center space-x-2 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                    <CloudArrowUpIcon className="w-5 h-5" />
                    <span>Create Manual Backup</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                    <DocumentArrowDownIcon className="w-5 h-5" />
                    <span>Download Backup</span>
                  </button>
                </div>
              </div>
            </SettingCard>

            <SettingCard
              title="Data Export"
              description="Export user data and content for compliance"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                    Export User Data
                  </button>
                  <button className="p-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                    Export Content
                  </button>
                  <button className="p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                    Export Analytics
                  </button>
                </div>
              </div>
            </SettingCard>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <SettingCard
              title="Email Notifications"
              description="Configure when to send email notifications to users and admins"
            >
              <div className="space-y-4">
                <ToggleSwitch
                  label="User Registration Notifications"
                  checked={settings.emailNotifications}
                  onChange={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})}
                  description="Notify admins when new users register"
                />
                <ToggleSwitch
                  label="System Health Alerts"
                  checked={true}
                  onChange={() => {}}
                  description="Send alerts when system issues are detected"
                />
                <ToggleSwitch
                  label="Weekly Analytics Reports"
                  checked={false}
                  onChange={() => {}}
                  description="Send weekly usage and performance reports"
                />
              </div>
            </SettingCard>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">System Settings</h1>
          <p className="text-gray-400">Configure platform settings and integrations</p>
        </div>
        
        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
          Save All Changes
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-t-lg transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-gray-800 border-b-2 border-blue-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderTabContent()}
      </motion.div>

      {/* System Information */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">⚙️ System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Platform Version</p>
            <p className="text-white font-medium">v1.0.0</p>
          </div>
          <div>
            <p className="text-gray-400">Node.js Version</p>
            <p className="text-white font-medium">v18.x</p>
          </div>
          <div>
            <p className="text-gray-400">Database Status</p>
            <p className="text-green-400 font-medium">Connected</p>
          </div>
          <div>
            <p className="text-gray-400">Last Updated</p>
            <p className="text-white font-medium">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings; 