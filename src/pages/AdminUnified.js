import React from 'react';
import UnifiedAdminPanel from '../components/admin/UnifiedAdminPanel';
import OptimizedStarField from '../components/OptimizedStarField';

const AdminUnified = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#3b82f6' }}>
      {/* Optimized Star Field */}
      <OptimizedStarField starCount={220} opacity={0.8} speed={1} size={1.2} />

      {/* Hidden header for context - only visible in dev mode */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-green-800 text-white text-center py-2 text-sm relative z-10">
          🎉 NEW: Unified Admin Panel - Consolidates all admin functionality into one modern interface
        </div>
      )}
      
      <div className="relative z-10">
        <UnifiedAdminPanel />
      </div>
    </div>
  );
};

export default AdminUnified; 