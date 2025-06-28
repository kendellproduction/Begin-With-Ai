import React from 'react';

const EnterpriseBuilderTest = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Enterprise Builder Test</h1>
        <p className="text-gray-300 mb-6">
          This is a test page to verify the Enterprise Builder is loading correctly.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">✅ Component Loading</h2>
            <p className="text-gray-400">React component rendered successfully</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">🎨 Styling</h2>
            <p className="text-gray-400">Tailwind CSS classes applied correctly</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">🔧 Ready for Testing</h2>
            <p className="text-gray-400">If you see this, the basic setup works</p>
          </div>
        </div>
        
        <div className="mt-8">
          <a 
            href="/enterprise-builder-full"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Full Enterprise Builder
          </a>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseBuilderTest; 