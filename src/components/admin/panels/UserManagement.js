import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UsersIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

// Import existing component
import AccountSwitcher from '../AccountSwitcher';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);

  const tabs = [
    { id: 'students', name: 'Students', icon: UsersIcon, count: 1 },
    { id: 'admins', name: 'Administrators', icon: ShieldCheckIcon, count: 2 },
    { id: 'invitations', name: 'Invitations', icon: EnvelopeIcon, count: 0 },
    { id: 'account-switching', name: 'Account Switching', icon: ClockIcon, count: 0 }
  ];

  const students = [
    {
      id: 1,
      name: 'Current User',
      email: 'user@example.com',
      status: 'active',
      role: 'student',
      joinDate: '2024-01-15',
      lastActive: '2 hours ago',
      coursesEnrolled: 3,
      lessonsCompleted: 23,
      progress: 75
    }
  ];

  const admins = [
    {
      id: 1,
      name: 'System Admin',
      email: 'admin@beginningwithai.com',
      status: 'active',
      role: 'admin',
      permissions: ['content_create', 'user_manage', 'analytics_view'],
      lastActive: 'Currently online'
    },
    {
      id: 2,
      name: 'Content Manager',
      email: 'content@beginningwithai.com',
      status: 'active',
      role: 'content_admin',
      permissions: ['content_create', 'content_edit'],
      lastActive: '1 day ago'
    }
  ];

  const UserCard = ({ user, type }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'active': return 'text-green-400 bg-green-900';
        case 'inactive': return 'text-yellow-400 bg-yellow-900';
        case 'suspended': return 'text-red-400 bg-red-900';
        default: return 'text-gray-400 bg-gray-800';
      }
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case 'active': return <CheckCircleIcon className="w-4 h-4" />;
        case 'suspended': return <XCircleIcon className="w-4 h-4" />;
        default: return <ClockIcon className="w-4 h-4" />;
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-white">{user.name}</h3>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`flex items-center space-x-1 px-2 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}>
              {getStatusIcon(user.status)}
              <span>{user.status}</span>
            </span>
            <button className="p-1 rounded hover:bg-gray-700 transition-colors">
              <EllipsisVerticalIcon className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {type === 'student' && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Courses</p>
                <p className="text-white font-medium">{user.coursesEnrolled}</p>
              </div>
              <div>
                <p className="text-gray-400">Completed</p>
                <p className="text-white font-medium">{user.lessonsCompleted}</p>
              </div>
              <div>
                <p className="text-gray-400">Progress</p>
                <p className="text-white font-medium">{user.progress}%</p>
              </div>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${user.progress}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-400">
              <span>Joined {user.joinDate}</span>
              <span>Last active {user.lastActive}</span>
            </div>
          </div>
        )}

        {type === 'admin' && (
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400 mb-2">Permissions</p>
              <div className="flex flex-wrap gap-2">
                {user.permissions.map((permission) => (
                  <span key={permission} className="px-2 py-1 bg-blue-900 text-blue-300 text-xs rounded-full">
                    {permission.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-400">
              <span>Role: {user.role}</span>
              <span>Last active: {user.lastActive}</span>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  const TabNavigation = () => (
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
          <span className={`px-2 py-1 text-xs rounded-full ${
            activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}>
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );

  const SearchAndFilters = () => (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <FunnelIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <UserPlusIcon className="w-4 h-4" />
          <span>Invite User</span>
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'students':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <UserCard key={student.id} user={student} type="student" />
            ))}
          </div>
        );
      
      case 'admins':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {admins.map((admin) => (
              <UserCard key={admin.id} user={admin} type="admin" />
            ))}
          </div>
        );
      
      case 'invitations':
        return (
          <div className="text-center py-12">
            <EnvelopeIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No pending invitations</h3>
            <p className="text-gray-400 mb-6">Invite new users to your platform</p>
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Send Invitation
            </button>
          </div>
        );
      
      case 'account-switching':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Account Switching Tool</h3>
              <p className="text-gray-400 mb-4">
                Switch between different user accounts for testing and support purposes.
              </p>
              <AccountSwitcher />
            </div>
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
          <h1 className="text-2xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">Manage student accounts and administrator roles</p>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-white">3</p>
            </div>
            <UsersIcon className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Students</p>
              <p className="text-2xl font-bold text-white">1</p>
            </div>
            <CheckCircleIcon className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Administrators</p>
              <p className="text-2xl font-bold text-white">2</p>
            </div>
            <ShieldCheckIcon className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Pending Invites</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
            <EnvelopeIcon className="w-8 h-8 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <TabNavigation />

      {/* Search and Filters */}
      {activeTab !== 'account-switching' && <SearchAndFilters />}

      {/* Tab Content */}
      {renderTabContent()}

      {/* Bulk Actions */}
      {(activeTab === 'students' || activeTab === 'admins') && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">🔧 Bulk Actions</h3>
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Export User List
            </button>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              Send Bulk Email
            </button>
            <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors">
              Update Permissions
            </button>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
              Bulk Suspend
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 