import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PodcastContent = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [selectedSection, setSelectedSection] = useState(0);

  useEffect(() => {
    // TODO: Load lesson data from Firestore database instead of static imports
    // This component should fetch lesson content from the database
    console.log('PodcastContent needs to be updated to load from database');
  }, [lessonId]);

  if (!lesson) {
    return <div className="p-8 text-white">Lesson not found</div>;
  }

  // Extract content sections for podcast
  const contentSections = lesson.slides.filter(slide => slide.type === 'concept');

  const cleanTextForPodcast = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
      .replace(/---/g, '') // Remove horizontal rules
      .replace(/\n{3,}/g, '\n\n') // Normalize line breaks
      .trim();
  };

  const generatePodcastScript = () => {
    let script = `# ${lesson.title}\n\nPodcast Script\n\n`;
    
    contentSections.forEach((section, index) => {
      script += `## Section ${index + 1}: ${section.content.title}\n\n`;
      script += cleanTextForPodcast(section.content.explanation);
      script += '\n\n---\n\n';
    });

    return script;
  };

  const downloadScript = () => {
    const script = generatePodcastScript();
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lesson.id}-podcast-script.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatePodcastScript());
      alert('Podcast script copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🎙️ Podcast Content: {lesson.title}
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Convert this lesson into podcast format
          </p>
          
          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={downloadScript}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              📥 Download Script
            </button>
            <button
              onClick={copyToClipboard}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              📋 Copy to Clipboard
            </button>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-3">Content Sections:</h3>
          <div className="flex flex-wrap gap-2">
            {contentSections.map((section, index) => (
              <button
                key={index}
                onClick={() => setSelectedSection(index)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedSection === index
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {index + 1}. {section.content.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content Display */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">
            Section {selectedSection + 1}: {contentSections[selectedSection]?.content.title}
          </h2>
          
          <div className="prose prose-invert prose-lg max-w-none">
            <div 
              className="text-gray-200 leading-relaxed text-lg"
              style={{ lineHeight: '1.8' }}
            >
              {cleanTextForPodcast(contentSections[selectedSection]?.content.explanation)
                .split('\n\n')
                .map((paragraph, index) => (
                  <p key={index} className="mb-6">
                    {paragraph}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Full Script Preview */}
        <div className="mt-8 bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
          <h3 className="text-xl font-semibold text-white mb-4">Full Podcast Script Preview</h3>
          <pre className="text-gray-300 text-sm bg-black/30 p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">
            {generatePodcastScript()}
          </pre>
        </div>
        
      </div>
    </div>
  );
};

export default PodcastContent; 