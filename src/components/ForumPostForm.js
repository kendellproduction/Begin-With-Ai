import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ForumPostForm = ({ onSubmit, category = 'general' }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim() || !content.trim()) {
      setError('Please provide both title and content for your post');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        title,
        content,
        category,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        createdAt: new Date().toISOString(),
      });
      
      // Reset form
      setTitle('');
      setContent('');
    } catch (err) {
      console.error('Error submitting post:', err);
      setError('Failed to submit your post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">Create a New Post</h3>
      
      {/* Community Guidelines Warning */}
      <div className="bg-blue-900/30 border border-blue-800/50 rounded-lg p-4 mb-6">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium text-blue-300">Community Guidelines</h4>
            <p className="text-sm text-blue-200 mt-1">
              Be respectful and don't share personal information (email, phone number, address) or sensitive code (API keys, passwords).
              All posts are reviewed for safety.
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter a descriptive title"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-300 mb-2">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Share your thoughts, questions, or code examples..."
            disabled={isSubmitting}
          />
        </div>
        
        {error && (
          <div className="mb-4 text-red-400 bg-red-900/30 p-3 rounded-md">
            {error}
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForumPostForm; 