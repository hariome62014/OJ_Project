import React, { useState, useRef } from 'react';
import { 
  FaTimes, 
  FaGripVertical, 
  FaStar, 
  FaLightbulb,
  FaCode,  
  FaShieldAlt, 
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaRegClock,
  FaBolt,
  FaMemory
} from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs, vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const CodeReviewModal = ({ reviewText, onClose, darkMode }) => {
  const modalRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [expandedSections, setExpandedSections] = useState({
    correctness: true,
    efficiency: true,
    quality: true,
    edgeCases: true,
    improvements: true,
    example: true
  });
  const contentRef = useRef(null);


  // Clean text by removing unwanted symbols and formatting
  const cleanText = (text) => {
    if (!text) return '';
    return text
      .replace(/^["'\s*\-]+|["'\s*\-]+$/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .trim();
  };

  // Render text with math expressions highlighted
  const renderTextWithMath = (text) => {
    if (!text) return null;
    
    const mathRegex = /\$(.*?)\$/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mathRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(
        <InlineMath 
          key={`math-${parts.length}`} 
          math={match[1]} 
          className={`${darkMode ? 'text-blue-300' : 'text-blue-600'} mx-0.5`}
        />
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? (
      <p className="text-sm my-2">
        {parts.map((part, i) => (
          <React.Fragment key={i}>{part}</React.Fragment>
        ))}
      </p>
    ) : (
      <p className="text-sm my-2">{text}</p>
    );
  };

  // Extract and highlight all code and math in content
  const renderEnhancedContent = (content) => {
    if (!content) return null;
    
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(renderTextWithMath(content.slice(lastIndex, match.index)));
      }
      
      parts.push(
        <SyntaxHighlighter
          key={`code-${parts.length}`}
          language={match[1] || 'cpp'}
          style={darkMode ? vscDarkPlus : vs}
          customStyle={{
            margin: '0.5rem 0',
            padding: '1rem',
            fontSize: '0.85rem',
            borderRadius: '0.5rem',
            background: darkMode ? '#1a202c' : '#f7fafc',
            border: darkMode ? '1px solid #2d3748' : '1px solid #e2e8f0'
          }}
        >
          {match[2].trim()}
        </SyntaxHighlighter>
      );
      
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(renderTextWithMath(content.slice(lastIndex)));
    }

    return parts.length > 0 ? parts : renderTextWithMath(content);
  };

  // Section icons and colors mapping
  const sectionConfig = {
    correctness: {
      icon: <FaCheckCircle className="text-lg" />,
      color: darkMode ? 'text-green-400' : 'text-green-600',
      bgColor: darkMode ? 'bg-green-900/20' : 'bg-green-100',
      title: 'Correctness Assessment',
      accentColor: darkMode ? 'border-green-500/30' : 'border-green-500/20'
    },
    efficiency: {
      icon: <FaBolt className="text-lg" />,
      color: darkMode ? 'text-blue-400' : 'text-blue-600',
      bgColor: darkMode ? 'bg-blue-900/20' : 'bg-blue-100',
      title: 'Efficiency Analysis',
      accentColor: darkMode ? 'border-blue-500/30' : 'border-blue-500/20'
    },
    quality: {
      icon: <FaShieldAlt className="text-lg" />,
      color: darkMode ? 'text-purple-400' : 'text-purple-600',
      bgColor: darkMode ? 'bg-purple-900/20' : 'bg-purple-100',
      title: 'Code Quality Evaluation',
      accentColor: darkMode ? 'border-purple-500/30' : 'border-purple-500/20'
    },
    edgeCases: {
      icon: <FaExclamationTriangle className="text-lg" />,
      color: darkMode ? 'text-orange-400' : 'text-orange-600',
      bgColor: darkMode ? 'bg-orange-900/20' : 'bg-orange-100',
      title: 'Edge Case Verification',
      accentColor: darkMode ? 'border-orange-500/30' : 'border-orange-500/20'
    },
    improvements: {
      icon: <FaLightbulb className="text-lg" />,
      color: darkMode ? 'text-yellow-400' : 'text-yellow-600',
      bgColor: darkMode ? 'bg-yellow-900/20' : 'bg-yellow-100',
      title: 'Improvement Recommendations',
      accentColor: darkMode ? 'border-yellow-500/30' : 'border-yellow-500/20'
    },
    example: {
      icon: <FaCode className="text-lg" />,
      color: darkMode ? 'text-indigo-400' : 'text-indigo-600',
      bgColor: darkMode ? 'bg-indigo-900/20' : 'bg-indigo-100',
      title: 'Example Implementation',
      accentColor: darkMode ? 'border-indigo-500/30' : 'border-indigo-500/20'
    }
  };

const toggleSection = (section, e) => {
  e.preventDefault();
  e.stopPropagation();
  
  // Save current scroll position
  const content = contentRef.current;
  const scrollTop = content ? content.scrollTop : 0;
  
  setExpandedSections(prev => ({
    ...prev,
    [section]: !prev[section]
  }));
  
  // Restore scroll position after state update
  setTimeout(() => {
    if (content) {
      content.scrollTop = scrollTop;
    }
  }, 0);
};


  const renderStars = (score, outOf = 10) => {
    if (!score) return null;
    const [num, denom] = score.split('/').map(Number);
    return (
      <div className="flex items-center gap-1">
        {[...Array(denom)].map((_, i) => (
          <FaStar
            key={i}
            className={
              i < num
                ? (darkMode ? 'text-yellow-400' : 'text-yellow-600')
                : (darkMode ? 'text-gray-600' : 'text-gray-300')
            }
          />
        ))}
        <span className={`ml-2 text-xs font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          {score}
        </span>
      </div>
    );
  };

  const renderComplexityBadge = (label, value) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          {label === 'Time' ? (
            <FaRegClock className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
          ) : (
            <FaMemory className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
          )}
        </div>
        <div>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label} Complexity</p>
          <div className={`text-sm font-mono ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
            {renderTextWithMath(value)}
          </div>
        </div>
      </div>
    );
  };

  const parseReviewText = (text) => {
    if (!text) return {};

    const sections = {
      title: '',
      correctness: { content: [], score: null },
      efficiency: { content: [], timeComplexity: null, spaceComplexity: null },
      quality: { content: [], score: null, positives: [], negatives: [] },
      edgeCases: { content: [], cases: [] },
      improvements: { items: [] },
      example: { code: '', language: 'cpp' }
    };

    // Split text into sections
    const sectionRegex = /##\s*(\d+\.\s*[^\n]+)([\s\S]*?)(?=##\s*\d+\.|$)/g;
    let match;
    
    while ((match = sectionRegex.exec(text)) !== null) {
      const [fullMatch, title, content] = match;
      const sectionNumber = title.match(/^\d+/)?.[0];
      
      if (sectionNumber === '1') {
        sections.correctness.score = content.match(/Rating:\s*(\d+\/\d+)/)?.[1];
        sections.correctness.content = content
          .split('\n')
          .filter(line => line.trim() && !line.includes('Rating:'))
          .map(line => cleanText(line));
      } 
      else if (sectionNumber === '2') {
        const timeMatch = content.match(/Time Complexity:\s*([^\n]+)/);
        const spaceMatch = content.match(/Space Complexity:\s*([^\n]+)/);
        
        if (timeMatch) sections.efficiency.timeComplexity = cleanText(timeMatch[1]);
        if (spaceMatch) sections.efficiency.spaceComplexity = cleanText(spaceMatch[1]);
        
        sections.efficiency.content = content
          .split('\n')
          .filter(line => line.trim() && !line.includes('Time Complexity:') && !line.includes('Space Complexity:'))
          .map(line => cleanText(line));
      }
      else if (sectionNumber === '3') {
        sections.quality.score = content.match(/Rating:\s*(\d+\/\d+)/)?.[1];
        
        const positives = [];
        const negatives = [];
        
        content.split('\n').forEach(line => {
          const cleanLine = cleanText(line);
          if (!cleanLine) return;
          
          if (line.includes('✅') || line.includes('✔') || line.includes('+')) {
            positives.push(cleanLine);
          } else if (line.includes('❌') || line.includes('✖') || line.includes('-')) {
            negatives.push(cleanLine);
          } else if (line.includes('Rating:')) {
            // Skip rating line
          } else {
            sections.quality.content.push(cleanLine);
          }
        });
        
        sections.quality.positives = positives;
        sections.quality.negatives = negatives;
      }
      else if (sectionNumber === '4') {
        sections.edgeCases.content = content
          .split('\n')
          .filter(line => line.trim())
          .map(line => cleanText(line));
          
        sections.edgeCases.cases = sections.edgeCases.content
          .filter(line => line.includes(':'))
          .map(line => {
            const [caseName, caseDesc] = line.split(':').map(part => cleanText(part));
            return { name: caseName, description: caseDesc };
          });
      }
      else if (sectionNumber === '5') {
        const priorityRegex = /(\d+\.)\s*(Critical|High Priority|Medium Priority|Low Priority)\s*\n([\s\S]*?)(?=\d+\.\s*(Critical|High Priority|Medium Priority|Low Priority)|$)/g;
        let improvementMatch;
        
        while ((improvementMatch = priorityRegex.exec(content)) !== null) {
          const [_, number, priority, details] = improvementMatch;
          const codeMatch = details.match(/```(\w+)?\n([\s\S]*?)```/);
          
          sections.improvements.items.push({
            priority: `${number} ${priority}`,
            description: cleanText(details.split('`')[0]),
            code: codeMatch ? {
              language: codeMatch[1] || 'cpp',
              content: codeMatch[2].trim()
            } : null
          });
        }
      }
    }

    // Extract code example
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/;
    const codeMatch = text.match(codeBlockRegex);
    if (codeMatch) {
      sections.example.code = codeMatch[2].trim();
      sections.example.language = codeMatch[1] || 'cpp';
    }

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
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const ReviewSection = ({ sectionKey }) => {
    const section = sections[sectionKey];
    const config = sectionConfig[sectionKey];
    
    // Don't render if no content
    if (!section || 
        (sectionKey === 'correctness' && !section.content?.length) ||
        (sectionKey === 'efficiency' && !section.content?.length && !section.timeComplexity && !section.spaceComplexity) ||
        (sectionKey === 'quality' && !section.content?.length && !section.positives?.length && !section.negatives?.length) ||
        (sectionKey === 'edgeCases' && !section.cases?.length) ||
        (sectionKey === 'improvements' && !section.items?.length) ||
        (sectionKey === 'example' && !section.code)) {
      return null;
    }

    return (
      <div className={`mb-4 rounded-xl overflow-hidden border ${config.accentColor} ${
        darkMode ? 'bg-gray-800/50' : 'bg-white shadow-sm'
      }`}>
        <button
        type="button"
          onClick={(e) => toggleSection(sectionKey,e)}
          className={`w-full flex items-center justify-between p-4 ${
            darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
          } transition-colors`}
        >
          <div className="flex items-center">
            <div className={`p-2 rounded-lg mr-3 ${config.bgColor} ${config.color}`}>
              {config.icon}
            </div>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              {config.title}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            {(sectionKey === 'correctness' || sectionKey === 'quality') && section.score && renderStars(section.score)}
            {expandedSections[sectionKey]
              ? <FaChevronUp className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              : <FaChevronDown className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />}
          </div>
        </button>
        {expandedSections[sectionKey] && (
          <div className={`p-4 pt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {sectionKey === 'correctness' && (
              <div className="space-y-3">
                {section.content.map((point, i) => (
                  point && point.trim && point.trim().length > 0 &&
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${config.accentColor} ${
                    darkMode ? 'bg-gray-800/30' : 'bg-gray-50'
                  }`}>
                    <FaCheckCircle className={`mt-0.5 flex-shrink-0 ${config.color}`} />
                    <div className="flex-1">
                      {renderEnhancedContent(point)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {sectionKey === 'efficiency' && (
              <div className="space-y-4">
                <div className="flex gap-4 flex-wrap">
                  {renderComplexityBadge('Time', section.timeComplexity)}
                  {renderComplexityBadge('Space', section.spaceComplexity)}
                </div>
                {section.content.length > 0 && (
                  <div className="mt-3 space-y-2 ">
                    <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Analysis Details
                    </h4>
                  <ul className="space-y-3">
  {section.content.map((point, i) => (
    point && point.trim && point.trim().length > 0 && (
      <li
        key={i}
        className={`flex items-center gap-3 p-3 rounded-lg border ${config.accentColor} ${
          darkMode ? 'bg-gray-800/30' : 'bg-gray-50'
        }`}
      >
        <span className={`mt-1 h-1.5 w-1.5 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-600'}`}></span>
        <div className="flex-1">
          {renderEnhancedContent(point)}
        </div>
      </li>
    )
  ))}
</ul>

                  </div>
                )}
              </div>
            )}

            {sectionKey === 'quality' && (
              <div className="space-y-4">
                {section.content.length > 0 && (
                  <div className={`p-3 rounded-lg border ${config.accentColor} ${
                    darkMode ? 'bg-gray-800/30' : 'bg-gray-50'
                  }`}>
                    <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Overall Assessment
                    </h4>
                    <div className="mt-1">
                      {renderEnhancedContent(section.content.join(' '))}
                    </div>
                  </div>
                )}
                {section.positives.length > 0 && (
                  <div className="space-y-2">
                    <h4 className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                      Strengths
                    </h4>
                    <ul className="space-y-3">
                      {section.positives.map((point, i) => (
                        <li key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${darkMode ? 'border-green-800/30 bg-gray-800/30' : 'border-green-200 bg-green-50'}`}>
                          <FaCheckCircle className={`mt-0.5 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                          <div className="flex-1">
                            {renderEnhancedContent(point)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {section.negatives.length > 0 && (
                  <div className="space-y-2">
                    <h4 className={`text-sm font-medium ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-3">
                      {section.negatives.map((point, i) => (
                        <li key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${darkMode ? 'border-orange-800/30 bg-gray-800/30' : 'border-orange-200 bg-orange-50'}`}>
                          <FaExclamationTriangle className={`mt-0.5 flex-shrink-0 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                          <div className="flex-1">
                            {renderEnhancedContent(point)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {sectionKey === 'edgeCases' && (
              <div className="space-y-4">
                {section.cases.length > 0 && (
                  <div className="space-y-3">
                    <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Verified Edge Cases
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {section.cases.map((edgeCase, i) => (
                        <div key={i} className={`p-3 rounded-lg border ${config.accentColor} ${
                          darkMode ? 'bg-gray-800/30' : 'bg-gray-50'
                        }`}>
                          <p className={`text-sm font-medium ${darkMode ? 'text-orange-300' : 'text-orange-600'}`}>
                            {edgeCase.name}
                          </p>
                          <div className="mt-1">
                            {renderEnhancedContent(edgeCase.description)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {sectionKey === 'improvements' && (
              <div className="space-y-4">
                {section.items.map((item, i) => (
                  <div key={i} className={`p-3 rounded-lg border ${config.accentColor} ${
                    darkMode ? 'bg-gray-800/30' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-lg ${config.bgColor} ${config.color}`}>
                        <FaLightbulb className="text-lg" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                          {item.priority}
                        </p>
                        {renderEnhancedContent(item.description)}
                        {item.code && (
                          <SyntaxHighlighter
                            language={item.code.language}
                            style={darkMode ? vscDarkPlus : vs}
                            customStyle={{
                              margin: '0.5rem 0',
                              padding: '1rem',
                              fontSize: '0.85rem',
                              borderRadius: '0.5rem',
                              background: darkMode ? '#1a202c' : '#f7fafc',
                              border: darkMode ? '1px solid #2d3748' : '1px solid #e2e8f0'
                            }}
                          >
                            {item.code.content}
                          </SyntaxHighlighter>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {sectionKey === 'example' && (
              <div className="mt-2">
                <SyntaxHighlighter
                  language={section.language}
                  style={darkMode ? vscDarkPlus : vs}
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    fontSize: '0.9rem',
                    borderRadius: '0.5rem',
                    background: darkMode ? '#1a202c' : '#f7fafc',
                    border: darkMode ? '1px solid #2d3748' : '1px solid #e2e8f0'
                  }}
                  showLineNumbers
                  wrapLines
                >
                  {section.code}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-start pointer-events-none">
    <div 
      ref={modalRef}
      className={`w-1/2 h-full pointer-events-auto flex flex-col transition-all duration-200 ${
        darkMode ? 'bg-gray-800 border-r border-gray-700 shadow-2xl' : 'bg-white border-r border-gray-200 shadow-xl'
      }`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'default',
        left: 0, // Ensure it stays on the left
        width: '49%', // Set to 50% width
        minWidth: '50%', // Prevent shrinking below 50%
        position: 'fixed' // Ensure it stays fixed
      }}
    >
    

        <div 
          className={`flex items-center justify-between p-4 border-b ${
            darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
          } cursor-move`}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center">
            <FaGripVertical className={`mr-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {sections.title || 'Code Review Analysis'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:opacity-80 transition-all ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            } no-drag`}
          >
            <FaTimes className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 no-drag"  ref={contentRef}>
          <div className="space-y-4">
            <ReviewSection sectionKey="correctness" />
            <ReviewSection sectionKey="efficiency" />
            {/* <ReviewSection sectionKey="quality" /> */}
            <ReviewSection sectionKey="edgeCases" />
            {/* <ReviewSection sectionKey="improvements" /> */}
            {sections.example?.code && <ReviewSection sectionKey="example" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeReviewModal;