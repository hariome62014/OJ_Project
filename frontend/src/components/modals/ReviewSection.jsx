import React from 'react';
import { 
  FaStar, 
  FaLightbulb,
  FaShieldAlt, 
  FaCogs, 
  FaExclamationTriangle,
  FaCode,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

const ReviewSection = ({ 
  title,
  content,
  score,
  sectionKey,
  darkMode = false,
  isExpanded = true,
  onToggle,
  children
}) => {
  // Section configuration
  const sectionConfig = {
    correctness: {
      icon: <FaStar className="text-lg" />,
      color: darkMode ? 'text-yellow-400' : 'text-yellow-600',
      bgColor: darkMode ? 'bg-yellow-900/20' : 'bg-yellow-100'
    },
    efficiency: {
      icon: <FaCogs className="text-lg" />,
      color: darkMode ? 'text-blue-400' : 'text-blue-600',
      bgColor: darkMode ? 'bg-blue-900/20' : 'bg-blue-100'
    },
    quality: {
      icon: <FaShieldAlt className="text-lg" />,
      color: darkMode ? 'text-green-400' : 'text-green-600',
      bgColor: darkMode ? 'bg-green-900/20' : 'bg-green-100'
    },
    edgeCases: {
      icon: <FaExclamationTriangle className="text-lg" />,
      color: darkMode ? 'text-red-400' : 'text-red-600',
      bgColor: darkMode ? 'bg-red-900/20' : 'bg-red-100'
    },
    improvements: {
      icon: <FaLightbulb className="text-lg" />,
      color: darkMode ? 'text-purple-400' : 'text-purple-600',
      bgColor: darkMode ? 'bg-purple-900/20' : 'bg-purple-100'
    },
    example: {
      icon: <FaCode className="text-lg" />,
      color: darkMode ? 'text-indigo-400' : 'text-indigo-600',
      bgColor: darkMode ? 'bg-indigo-900/20' : 'bg-indigo-100'
    }
  };

  if (!content && !children) return null;

  return (
    <div className={`mb-4 rounded-xl overflow-hidden transition-all duration-200 ${
      darkMode ? 'bg-gray-700/30' : 'bg-white shadow-sm'
    }`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 ${
          darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
        } transition-colors`}
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${title} section`}
      >
        <div className="flex items-center">
          <div className={`p-2 rounded-lg mr-3 ${sectionConfig[sectionKey]?.bgColor || ''} ${
            sectionConfig[sectionKey]?.color || ''
          }`}>
            {sectionConfig[sectionKey]?.icon || <FaLightbulb className="text-lg" />}
          </div>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          {score && (
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              darkMode ? 'bg-gray-600 text-yellow-300' : 'bg-gray-200 text-yellow-700'
            }`}>
              {score} Score
            </div>
          )}
          {isExpanded ? (
            <FaChevronUp className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          ) : (
            <FaChevronDown className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className={`p-4 pt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {content && (
            <div className="space-y-3">
              {content.trim().split('\n\n').map((paragraph, i) => (
                paragraph && (
                  <p key={i} className="text-sm leading-relaxed">
                    {paragraph}
                  </p>
                )
              ))}
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;