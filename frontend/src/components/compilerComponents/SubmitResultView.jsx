import React, { useState } from 'react';
import { EmptyState, MetricItem, LanguageTag, StatusIndicator } from '../../utils/Compiler';
import { FaCheck, FaClock, FaBolt, FaRobot, FaSpinner, FaTimes, FaCode,FaMemory,FaCheckCircle } from 'react-icons/fa';
import { ReviewCode } from '../../../services/operations/SubmissionAPI';
import CodeReviewModal from '../modals/CodeReviewModal';
import { useDispatch } from 'react-redux';

const SubmitResultView = ({
  submitResult,
  isSubmitting,
  darkMode,
  language,
  code,
  problemDescription,
  showReviewModal,
  setShowReviewModal
}) => {
  const [aiReview, setAiReview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiError, setAiError] = useState(null);

  const dispatch = useDispatch();

  const analyzeCode = async () => {
    if (!code) return;
    
    setIsAnalyzing(true);
    setAiError(null);
    setAiReview(null);
    
    try {
      const result = await dispatch(ReviewCode(code, problemDescription, language));
      // console.log("Review result:",result);
      setAiReview(result);
      setShowReviewModal(true);
    } catch (error) {
      setAiError(error.message || "Failed to analyze code");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!submitResult) {
    return (
      <div className="space-y-4 h-full flex flex-col">
        <EmptyState 
          icon={<FaCheck />}
          title={isSubmitting ? "Submitting your solution..." : "No submission yet"}
          subtitle={isSubmitting ? "Please wait while we evaluate your code" : "Submit your code to see results"}
          darkMode={darkMode}
        />
        
       
      </div>
    );
  }

  return (
    <div className="space-y-3 h-full flex flex-col">
      {/* Result Status Section */}
    {(submitResult.status === "Accepted" || submitResult.status === "Wrong Answer" ) && (
  <div className={`rounded-xl px-6  ${darkMode ? "bg-gray-800" : "bg-white shadow-sm"}`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <StatusIndicator 
          status={submitResult.status}
          size="lg"
          darkMode={darkMode}
        />
        <div>
          <h3 className={`text-xl font-bold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
            {submitResult.status}
          </h3>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {submitResult.output}
          </p>
        </div>
      </div>
      <LanguageTag language={submitResult.language || language} darkMode={darkMode} />
    </div>
  </div>
)}


      {/* Performance Metrics Section */}
      {submitResult.status === "Accepted" && (
        <div className={`rounded-xl px-6 py-2 ${darkMode ? "bg-gray-800" : "bg-white shadow-sm"}`}>
          <h4 className={`text-base font-semibold mb-1 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}>
            Performance Metrics
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <MetricItem 
              icon={<FaBolt className="text-blue-500" />}
              label="Runtime" 
              value={submitResult.runtime || "N/A"} 
              color="blue" 
              darkMode={darkMode} 
            />
            <MetricItem 
              icon={<FaMemory className="text-purple-500" />}
              label="Memory" 
              value={submitResult.memory || "N/A"} 
              color="purple" 
              darkMode={darkMode} 
            />
            <MetricItem 
              icon={<FaCheckCircle className="text-green-500" />}
              label="Test Cases" 
              value={`${submitResult.passed}/${submitResult.total}`} 
              color={submitResult.passed === submitResult.total ? "green" : "red"} 
              darkMode={darkMode} 
            />
          </div>
        </div>
      )}

      {/* Error Details */}
      {submitResult.status !== "Accepted" && submitResult.error && (
        <div className={`rounded-xl  ${
          darkMode ? "bg-gray-800" : "bg-white shadow-sm"
        }`}>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${
              submitResult.status === "Time Limit Exceeded" 
                ? darkMode ? "bg-yellow-900/30" : "bg-yellow-100" 
                : darkMode ? "bg-red-900/30" : "bg-red-100"
            }`}>
              {submitResult.status === "Time Limit Exceeded" ? (
                <FaClock className={`text-xl ${
                  darkMode ? "text-yellow-300" : "text-yellow-700"
                }`} />
              ) : (
                <FaBolt className={`text-xl ${
                  darkMode ? "text-red-300" : "text-red-700"
                }`} />
              )}
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-semibold ${
                submitResult.status === "Time Limit Exceeded"
                  ? darkMode ? "text-yellow-300" : "text-yellow-700"
                  : darkMode ? "text-red-300" : "text-red-700"
              }`}>
                {submitResult.status}
              </h3>
              <pre className={`mt-2 text-sm whitespace-pre-wrap ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                {submitResult.error}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Code Analysis Section */}
      <div className={`rounded-xl px-6  flex-1 flex flex-col ${
        darkMode ? "bg-gray-800" : "bg-white shadow-sm"
      }`}>
      

        {aiError && (
          <div className={`p-4 rounded-lg mb-6 ${
            darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800'
          }`}>
            <div className="flex items-center gap-3">
              <FaTimes className="flex-shrink-0" />
              <p>{aiError}</p>
            </div>
          </div>
        )}

     {!aiReview ? (

        <div className="flex items-center justify-between mt-6">
          <div>
            <h4 className={`text-base font-semibold ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Code Quality Analysis
            </h4>
            <p className={`text-sm ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}>
              Get detailed feedback on your solution
            </p>
          </div>

            <button
    onClick={analyzeCode}
    disabled={isAnalyzing || !code}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all w-fit ${
      darkMode 
        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/30' 
        : 'bg-blue-100 hover:bg-blue-200 text-blue-800 shadow-md shadow-blue-200/50'
    } ${(isAnalyzing || !code) ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {isAnalyzing ? (
      <>
        <FaSpinner className="animate-spin" />
        Analyzing...
      </>
    ) : (
      <>
        <FaRobot />
        Analyze Code
      </>
    )}
  </button>
         
        </div>

) : (
  <div className="flex gap-2">
    <button
      onClick={() => setShowReviewModal(true)}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
        darkMode 
          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/30' 
          : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800 shadow-md shadow-indigo-200/50'
      }`}
    >
      <FaCode />
      Show Analysis
    </button>
    <button
      onClick={analyzeCode}
      disabled={isAnalyzing}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
        darkMode 
          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/30' 
          : 'bg-blue-100 hover:bg-blue-200 text-blue-800 shadow-md shadow-blue-200/50'
      } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isAnalyzing ? (
        <FaSpinner className="animate-spin" />
      ) : (
        <FaRobot />
      )}
      Re-analyze
    </button>
  </div>
)}
      </div>

      {showReviewModal && aiReview && (
        <CodeReviewModal 
          reviewText={aiReview} 
          onClose={() => setShowReviewModal(false)} 
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default SubmitResultView;


