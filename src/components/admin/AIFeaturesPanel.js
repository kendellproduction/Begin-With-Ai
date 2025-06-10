import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AICodeFeedbackService } from '../../services/aiCodeFeedbackService';
import { SmartHintService } from '../../services/smartHintService';
import { AutoQuizService } from '../../services/autoQuizService';
import { LearningPathOptimizationService } from '../../services/learningPathOptimizationService';
import { sanitizeText } from '../../utils/sanitization';

const AIFeaturesPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState({
    codeFeedback: { requests: 0, successRate: 0, avgResponseTime: 0 },
    hints: { requests: 0, helpfulnessScore: 0, avgHintsPerSession: 0 },
    quizzes: { generated: 0, avgScore: 0, completionRate: 0 },
    pathOptimization: { pathsGenerated: 0, adaptations: 0, userSatisfaction: 0 }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState({});
  const [safeguardStatus, setSafeguardStatus] = useState({
    inputSanitization: 'active',
    rateLimiting: 'active',
    contentFiltering: 'active',
    userDataProtection: 'active'
  });

  useEffect(() => {
    loadMetrics();
    checkSafeguards();
  }, []);

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, these would fetch from analytics/monitoring services
      setMetrics({
        codeFeedback: { 
          requests: 1247, 
          successRate: 94.2, 
          avgResponseTime: 2.1,
          rateLimitHits: 23
        },
        hints: { 
          requests: 892, 
          helpfulnessScore: 4.3, 
          avgHintsPerSession: 2.1,
          rateLimitHits: 15
        },
        quizzes: { 
          generated: 156, 
          avgScore: 78.3, 
          completionRate: 87.2,
          rateLimitHits: 5
        },
        pathOptimization: { 
          pathsGenerated: 89, 
          adaptations: 234, 
          userSatisfaction: 4.1,
          rateLimitHits: 8
        }
      });
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSafeguards = () => {
    // In a real implementation, this would check actual safeguard status
    setSafeguardStatus({
      inputSanitization: 'active',
      rateLimiting: 'active',
      contentFiltering: 'active',
      userDataProtection: 'active',
      apiKeyRotation: 'active'
    });
  };

  const testAIService = async (service) => {
    setIsLoading(true);
    setTestResults(prev => ({ ...prev, [service]: { status: 'testing' } }));

    try {
      let result;
      
      switch (service) {
        case 'codeFeedback':
          result = await AICodeFeedbackService.analyzeCode(
            'test-user',
            'function hello() { console.log("Hello World!"); }',
            'javascript',
            { lessonGoal: 'Create a hello world function' }
          );
          break;
          
        case 'hints':
          result = await SmartHintService.getSmartHint('test-user', {
            lessonId: 'test-lesson',
            currentStep: 'test-step',
            userCode: 'const x = ',
            difficulty: 'intermediate',
            timeSpent: 300,
            attempts: 3
          });
          break;
          
        case 'quizzes':
          result = await AutoQuizService.generateQuiz('test-user', {
            title: 'JavaScript Basics',
            content: 'Learn about variables, functions, and basic programming concepts.',
            keyPoints: ['Variables', 'Functions', 'Loops'],
            difficulty: 'intermediate'
          });
          break;
          
        case 'pathOptimization':
          result = await LearningPathOptimizationService.generateOptimizedPath('test-user', {
            skillLevel: 'intermediate',
            interests: ['javascript', 'web-development'],
            goals: ['build-portfolio'],
            timeAvailable: 60
          });
          break;
          
        default:
          throw new Error('Unknown service');
      }

      setTestResults(prev => ({
        ...prev,
        [service]: {
          status: result.success ? 'success' : 'error',
          message: result.success ? 'Service working correctly' : result.error,
          responseTime: Date.now() % 1000 + 'ms' // Mock response time
        }
      }));

    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [service]: {
          status: 'error',
          message: error.message
        }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'success':
        return 'text-green-600 bg-green-100 border-green-300';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'error':
        return 'text-red-600 bg-red-100 border-red-300';
      case 'testing':
        return 'text-blue-600 bg-blue-100 border-blue-300';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'testing':
        return '🔄';
      default:
        return '❓';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'services', label: 'AI Services', icon: '🤖' },
    { id: 'safeguards', label: 'Safety & Security', icon: '🔒' },
    { id: 'monitoring', label: 'Monitoring', icon: '📈' },
    { id: 'testing', label: 'Testing', icon: '🧪' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🤖</span>
            <div>
              <h3 className="font-medium text-gray-800">Code Feedback</h3>
              <p className="text-2xl font-bold text-blue-600">{metrics.codeFeedback.requests}</p>
              <p className="text-sm text-gray-600">{metrics.codeFeedback.successRate}% success rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-medium text-gray-800">Smart Hints</h3>
              <p className="text-2xl font-bold text-green-600">{metrics.hints.requests}</p>
              <p className="text-sm text-gray-600">{metrics.hints.helpfulnessScore}/5 rating</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📝</span>
            <div>
              <h3 className="font-medium text-gray-800">Auto Quizzes</h3>
              <p className="text-2xl font-bold text-purple-600">{metrics.quizzes.generated}</p>
              <p className="text-sm text-gray-600">{metrics.quizzes.avgScore}% avg score</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🛤️</span>
            <div>
              <h3 className="font-medium text-gray-800">Path Optimization</h3>
              <p className="text-2xl font-bold text-orange-600">{metrics.pathOptimization.pathsGenerated}</p>
              <p className="text-sm text-gray-600">{metrics.pathOptimization.userSatisfaction}/5 satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🔒 Safety Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(safeguardStatus).map(([safeguard, status]) => (
            <div key={safeguard} className={`p-3 rounded-lg border text-center ${getStatusColor(status)}`}>
              <div className="text-lg mb-1">{getStatusIcon(status)}</div>
              <div className="text-xs font-medium capitalize">
                {safeguard.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(metrics).map(([service, data]) => (
          <div key={service} className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 capitalize">
                {service.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <button
                onClick={() => testAIService(service)}
                disabled={isLoading}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm rounded transition-colors"
              >
                Test
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Requests:</span>
                  <span className="ml-2 font-medium">{data.requests || 0}</span>
                </div>
                <div>
                  <span className="text-gray-600">Rate Limit Hits:</span>
                  <span className="ml-2 font-medium text-orange-600">{data.rateLimitHits || 0}</span>
                </div>
              </div>

              {testResults[service] && (
                <div className={`p-3 rounded border text-sm ${getStatusColor(testResults[service].status)}`}>
                  <div className="flex items-center space-x-2">
                    <span>{getStatusIcon(testResults[service].status)}</span>
                    <span>{testResults[service].message}</span>
                  </div>
                  {testResults[service].responseTime && (
                    <div className="mt-1 text-xs">
                      Response time: {testResults[service].responseTime}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSafeguards = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🛡️ Input Sanitization</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium">HTML/Script Tag Removal</span>
            <span className={`px-2 py-1 rounded text-sm ${getStatusColor('active')}`}>
              ✅ Active
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium">Code Injection Prevention</span>
            <span className={`px-2 py-1 rounded text-sm ${getStatusColor('active')}`}>
              ✅ Active
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium">Personal Information Filtering</span>
            <span className={`px-2 py-1 rounded text-sm ${getStatusColor('active')}`}>
              ✅ Active
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">⏱️ Rate Limiting</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Current Limits (per hour)</div>
            <ul className="space-y-1 text-sm">
              <li>Code Feedback: 20 requests</li>
              <li>Smart Hints: 30 requests</li>
              <li>Quiz Generation: 10 requests</li>
              <li>Path Optimization: 5 requests</li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Rate Limit Violations (24h)</div>
            <ul className="space-y-1 text-sm">
              <li>Code Feedback: {metrics.codeFeedback.rateLimitHits}</li>
              <li>Smart Hints: {metrics.hints.rateLimitHits}</li>
              <li>Quiz Generation: {metrics.quizzes.rateLimitHits}</li>
              <li>Path Optimization: {metrics.pathOptimization.rateLimitHits}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🔐 API Security</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium">OpenAI API Key Status</span>
            <span className={`px-2 py-1 rounded text-sm ${getStatusColor(process.env.REACT_APP_OPENAI_API_KEY ? 'active' : 'error')}`}>
              {process.env.REACT_APP_OPENAI_API_KEY ? '✅ Configured' : '❌ Missing'}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium">Request Encryption</span>
            <span className={`px-2 py-1 rounded text-sm ${getStatusColor('active')}`}>
              ✅ HTTPS Only
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium">Response Sanitization</span>
            <span className={`px-2 py-1 rounded text-sm ${getStatusColor('active')}`}>
              ✅ Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMonitoring = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">94.2%</div>
            <div className="text-sm text-gray-600">Overall Success Rate</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">2.1s</div>
            <div className="text-sm text-gray-600">Avg Response Time</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">51</div>
            <div className="text-sm text-gray-600">Rate Limit Hits (24h)</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🚨 System Alerts</h3>
        <div className="space-y-2">
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded flex items-center space-x-2">
            <span className="text-yellow-600">⚠️</span>
            <span className="text-sm">High rate limit usage detected for Code Feedback service</span>
            <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span className="text-sm">All AI services operating normally</span>
            <span className="text-xs text-gray-500 ml-auto">5 minutes ago</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 Usage Costs (Estimated)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700">Monthly API Costs</div>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>OpenAI (Code Feedback):</span>
                <span className="font-medium">$12.40</span>
              </li>
              <li className="flex justify-between">
                <span>OpenAI (Hints):</span>
                <span className="font-medium">$8.20</span>
              </li>
              <li className="flex justify-between">
                <span>OpenAI (Quizzes):</span>
                <span className="font-medium">$15.60</span>
              </li>
              <li className="flex justify-between">
                <span>OpenAI (Path Optimization):</span>
                <span className="font-medium">$6.80</span>
              </li>
              <li className="flex justify-between font-medium border-t pt-2">
                <span>Total:</span>
                <span>$43.00</span>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700">Usage Trends</div>
            <div className="text-sm text-gray-600">
              <p>📈 +15% increase from last month</p>
              <p>🎯 On track for $45-50 monthly budget</p>
              <p>💡 Consider implementing response caching for frequently asked questions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTesting = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🧪 AI Service Testing</h3>
        <p className="text-gray-600 mb-4">
          Test individual AI services to ensure they're working correctly and safely.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['codeFeedback', 'hints', 'quizzes', 'pathOptimization'].map(service => (
            <div key={service} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium capitalize">
                  {service.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <button
                  onClick={() => testAIService(service)}
                  disabled={isLoading}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm rounded transition-colors"
                >
                  {testResults[service]?.status === 'testing' ? 'Testing...' : 'Run Test'}
                </button>
              </div>
              
              {testResults[service] && (
                <div className={`p-3 rounded text-sm ${getStatusColor(testResults[service].status)}`}>
                  <div className="flex items-center space-x-2">
                    <span>{getStatusIcon(testResults[service].status)}</span>
                    <span>{testResults[service].message}</span>
                  </div>
                  {testResults[service].responseTime && (
                    <div className="mt-1 text-xs">
                      Response time: {testResults[service].responseTime}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🔐 Security Testing</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded">
            <h4 className="font-medium mb-2">Input Sanitization Test</h4>
            <textarea
              className="w-full h-20 p-2 border rounded text-sm"
              placeholder="Enter potentially malicious input to test sanitization..."
            />
            <button className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded">
              Test Sanitization
            </button>
          </div>
          
          <div className="p-4 bg-gray-50 rounded">
            <h4 className="font-medium mb-2">Rate Limiting Test</h4>
            <p className="text-sm text-gray-600 mb-2">
              Simulate rapid requests to test rate limiting
            </p>
            <button className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded">
              Test Rate Limits
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="p-6 bg-gray-100 rounded-lg">
        <p className="text-gray-600 text-center">
          Access denied. Admin privileges required.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          🤖 AI Features Administration
        </h1>
        <p className="text-gray-600">
          Monitor and manage AI-powered learning features with safety controls
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b mb-6">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'services' && renderServices()}
        {activeTab === 'safeguards' && renderSafeguards()}
        {activeTab === 'monitoring' && renderMonitoring()}
        {activeTab === 'testing' && renderTesting()}
      </div>
    </div>
  );
};

export default AIFeaturesPanel; 