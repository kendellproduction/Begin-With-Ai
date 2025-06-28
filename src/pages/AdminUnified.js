import React from 'react';
import UnifiedAdminPanel from '../components/admin/UnifiedAdminPanel';

const AdminUnified = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hidden header for context - only visible in dev mode */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-green-800 text-white text-center py-2 text-sm">
          🎉 NEW: Unified Admin Panel - Consolidates all admin functionality into one modern interface
        </div>
      )}
      
      <UnifiedAdminPanel />
    </div>
  );
};

export default AdminUnified; 