import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { seedDatabase, createTestUserProgress, isDatabaseSeeded } from '../utils/seedData';

const DatabaseSeeder = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [seeded, setSeeded] = useState(false);

  const handleSeedDatabase = async () => {
    setLoading(true);
    setMessage('');

    try {
      const result = await seedDatabase();
      setMessage(`✅ ${result.message}`);
      setSeeded(true);
    } catch (error) {
      setMessage(`❌ Error seeding database: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTestProgress = async () => {
    if (!user?.uid) {
      setMessage('❌ You must be logged in to create test progress');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await createTestUserProgress(user.uid);
      setMessage('✅ Test user progress created successfully');
    } catch (error) {
      setMessage(`❌ Error creating test progress: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckSeeded = async () => {
    setLoading(true);
    setMessage('');

    try {
      const isSeeded = await isDatabaseSeeded();
      setSeeded(isSeeded);
      setMessage(isSeeded ? '✅ Database is already seeded' : '⚠️ Database is not seeded');
    } catch (error) {
      setMessage(`❌ Error checking database: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Only show this component in development or for admin users
  if (process.env.NODE_ENV === 'production' && user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-gray-800 border border-gray-600 rounded-lg p-4 max-w-sm z-40">
      <h3 className="text-white font-bold mb-3">🛠️ Database Tools</h3>
      
      <div className="space-y-2 mb-3">
        <button
          onClick={handleCheckSeeded}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-sm py-2 px-3 rounded transition-colors"
        >
          {loading ? 'Checking...' : 'Check Database'}
        </button>
        
        <button
          onClick={handleSeedDatabase}
          disabled={loading || seeded}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-sm py-2 px-3 rounded transition-colors"
        >
          {loading ? 'Seeding...' : seeded ? 'Already Seeded' : 'Seed Database'}
        </button>
        
        <button
          onClick={handleCreateTestProgress}
          disabled={loading || !user?.uid}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white text-sm py-2 px-3 rounded transition-colors"
        >
          {loading ? 'Creating...' : 'Create Test Progress'}
        </button>
      </div>

      {message && (
        <div className="text-xs text-gray-300 bg-gray-700 p-2 rounded">
          {message}
        </div>
      )}

      <div className="text-xs text-gray-400 mt-2">
        User: {user?.email || 'Not logged in'}
      </div>
    </div>
  );
};

export default DatabaseSeeder; 