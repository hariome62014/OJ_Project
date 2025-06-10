import React from 'react';
import TestCaseItem from './TestCaseItem';
import { EmptyState } from '../../utils/Compiler';
import { FaPlay, FaClock, FaBolt, FaCode } from 'react-icons/fa';

const RunResultView = ({ runResult, isRunning, darkMode, selectedTestCase, setSelectedTestCase }) => {
  if (!runResult) {
    return (
      <EmptyState 
        icon={<FaPlay />}
        title={isRunning ? "Running your code..." : "No run results yet"}
        subtitle={isRunning ? "Please wait while we run your code" : "Run your code to see results"}
        darkMode={darkMode}
      />
    );
  }

  // Handle all error cases at the top level
  if (runResult.status !== "Accepted" && runResult.status !== "Wrong Answer") {
    return (
      <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-full ${
            runResult.status === "Time Limit Exceeded" 
              ? darkMode ? "bg-yellow-900/50" : "bg-yellow-100" 
              : darkMode ? "bg-red-900/50" : "bg-red-100"
          }`}>
            {runResult.status === "Time Limit Exceeded" ? (
              <FaClock className={`text-lg ${darkMode ? "text-yellow-300" : "text-yellow-700"}`} />
            ) : runResult.status === "Compilation Error" ? (
              <FaCode className={`text-lg ${darkMode ? "text-red-300" : "text-red-700"}`} />
            ) : (
              <FaBolt className={`text-lg ${darkMode ? "text-red-300" : "text-red-700"}`} />
            )}
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${
              runResult.status === "Time Limit Exceeded"
                ? darkMode ? "text-yellow-300" : "text-yellow-700"
                : darkMode ? "text-red-300" : "text-red-700"
            }`}>
              {runResult.status}
            </h3>
            {runResult.testCases.find(tc => tc.error) && (
              <pre className={`mt-2 text-sm whitespace-pre-wrap ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                {runResult.testCases.find(tc => tc.error).error}
              </pre>
            )}
            <p className={`mt-2 text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              {runResult.output}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!runResult.testCases || runResult.testCases.length === 0) {
    return (
      <EmptyState 
        icon={<FaPlay />}
        title="No test cases available"
        darkMode={darkMode}
      />
    );
  }

  return (
    <div className="h-full">
      <div className={`rounded-lg overflow-hidden h-full ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
        <div className={`p-4 border-b ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
          <h4 className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Test Cases ({runResult.passed}/{runResult.total} passed)
          </h4>
          {runResult.status === "Error" && (
            <div className={`mt-2 text-sm ${darkMode ? "text-red-400" : "text-red-600"}`}>
              {runResult.output}
            </div>
          )}
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-600 h-[calc(100%-50px)] overflow-y-auto">
          {runResult.testCases.map((testCase, index) => (
            <TestCaseItem 
              key={index}
              testCase={testCase}
              index={index}
              isSelected={selectedTestCase === index}
              onSelect={() => setSelectedTestCase(index)}
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RunResultView;