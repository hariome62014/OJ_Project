import React, { useState, useRef } from 'react';
import { FaTimes, FaGripVertical } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs, vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const CodeReviewModal = ({ reviewText, onClose, darkMode }) => {
  const modalRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // Clean text by removing markdown formatting
  const cleanText = (text) => {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1')     // Remove italics
      .replace(/^\s*[-*+]\s*/gm, '')   // Remove list markers
      .trim();
  };

  // Parse the review text into structured sections
  const parseReviewText = (text) => {
    if (!text) return {};
    
    const sections = {
      title: '',
      correctness: { content: '', score: null },
      efficiency: { content: '' },
      quality: { content: '', score: null },
      edgeCases: { content: '' },
      improvements: { content: '' },
      example: ''
    };

    const lines = text.split('\n');
    let currentSection = null;

    lines.forEach(line => {
      if (line.startsWith('## ')) {
        sections.title = cleanText(line);
      } 
      else if (line.startsWith('**1. ')) {
        currentSection = 'correctness';
        const cleaned = cleanText(line);
        sections.correctness.content = cleaned + '\n';
        sections.correctness.score = cleaned.match(/\d+\/10/)?.[0];
      }
      else if (line.startsWith('**2. ')) {
        currentSection = 'efficiency';
        sections.efficiency.content = cleanText(line) + '\n';
      }
      else if (line.startsWith('**3. ')) {
        currentSection = 'quality';
        const cleaned = cleanText(line);
        sections.quality.content = cleaned + '\n';
        sections.quality.score = cleaned.match(/\d+\/10/)?.[0];
      }
      else if (line.startsWith('**4. ')) {
        currentSection = 'edgeCases';
        sections.edgeCases.content = cleanText(line) + '\n';
      }
      else if (line.startsWith('**5. ')) {
        currentSection = 'improvements';
        sections.improvements.content = cleanText(line) + '\n';
      }
      else if (line.startsWith('```cpp')) {
        currentSection = 'example';
      }
      else if (currentSection && currentSection !== 'example') {
        sections[currentSection].content += cleanText(line) + '\n';
      }
      else if (currentSection === 'example' && !line.startsWith('```')) {
        sections.example += line + '\n';
      }
    });

    return sections;
  };

  const sections = parseReviewText(reviewText);

 const handleMouseDown = (e) => {
    if (e.target.closest('.no-drag')) return;
    
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - startPos.x;
    const newY = e.clientY - startPos.y;
    
    setPosition({
      x: newX,
      y: newY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Section component with clean formatting
  const ReviewSection = ({ title, content, score }) => {
    if (!content) return null;
    
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            {title}
          </h3>
          {score && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'
            }`}>
              {score}
            </span>
          )}
        </div>
        <div className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {content.trim().split('\n\n').map((paragraph, i) => (
            paragraph && (
              <p key={i} className="text-sm leading-relaxed">
                {paragraph}
              </p>
            )
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-start pointer-events-none mt-14">
      <div 
        ref={modalRef}
        className={`w-1/2 h-full pointer-events-auto shadow-xl flex flex-col ${
          darkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'
        }`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? 'grabbing' : 'default'
        }}
      >
        {/* Modal Header */}
        <div 
          className={`flex items-center justify-between p-4 border-b ${
            darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
          } cursor-move`}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center">
            <FaGripVertical className={`mr-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {sections.title || 'Code Review'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-full hover:opacity-80 transition-opacity ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            } no-drag`}
          >
            <FaTimes className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 no-drag">
          <ReviewSection 
            // title="Correctness" 
            content={sections.correctness?.content} 
            score={sections.correctness?.score} 
          />
          
          <ReviewSection 
            // title="Efficiency" 
            content={sections.efficiency?.content} 
          />
          
          <ReviewSection 
            // title="Code Quality" 
            content={sections.quality?.content} 
            score={sections.quality?.score} 
          />
          
          <ReviewSection 
            // title="Edge Cases" 
            content={sections.edgeCases?.content} 
          />
          
          <ReviewSection 
            // title="Improvement Suggestions" 
            content={sections.improvements?.content} 
          />

          {sections.example && (
            <div className="mt-6">
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                Example Implementation
              </h3>
              <SyntaxHighlighter
                language="cpp"
                style={darkMode ? vscDarkPlus : vs}
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  fontSize: '0.9rem',
                  borderRadius: '0.5rem',
                  background: darkMode ? '#1a202c' : '#f7fafc'
                }}
                showLineNumbers
                wrapLines
              >
                {sections.example.trim()}
              </SyntaxHighlighter>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeReviewModal;