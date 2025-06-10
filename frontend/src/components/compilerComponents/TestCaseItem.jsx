import React from 'react';
import { CodeBlock, StatusIndicator } from '../../utils/Compiler';
import { FaExclamationTriangle } from 'react-icons/fa';

const TestCaseItem = ({ testCase, index, isSelected, onSelect, darkMode }) => {
  // Determine status based on error type
  const getStatus = () => {
    if (testCase.passed) return "success";
    if (testCase.errorType === 'timeout') return "timeout";
    if (testCase.errorType === 'runtime') return "runtime";
    if (testCase.errorType === 'compilation') return "compilation";
    return "error";
  };

  return (
    <div 
      className={`p-4 cursor-pointer ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"}`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <StatusIndicator 
            status={getStatus()} 
            darkMode={darkMode} 
          />
          <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Test Case {index + 1}
          </span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          darkMode ? "bg-gray-600 text-gray-300" : "bg-gray-200 text-gray-700"
        }`}>
          {testCase.executionTime || "N/A"} ms
        </span>
      </div>

      {isSelected && (
        <div className="mt-3 space-y-3">
          {testCase.error && (
            <div className={`p-3 rounded flex items-start gap-2 ${
              testCase.errorType === 'timeout' 
                ? darkMode ? "bg-yellow-900/20 text-yellow-300" : "bg-yellow-100 text-yellow-800"
                : darkMode ? "bg-red-900/20 text-red-300" : "bg-red-100 text-red-800"
            }`}>
              <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
              <pre className="whitespace-pre-wrap text-sm flex-1">
                {testCase.error}
              </pre>
            </div>
          )}
          <CodeBlock 
            label="Input" 
            content={testCase.input} 
            darkMode={darkMode} 
          />
          <CodeBlock 
            label="Expected Output" 
            content={testCase.expectedOutput} 
            darkMode={darkMode} 
          />
          {testCase.actualOutput && (
            <CodeBlock 
              label="Your Output" 
              content={testCase.actualOutput} 
              status={testCase.passed ? "success" : "error"}
              darkMode={darkMode}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TestCaseItem;