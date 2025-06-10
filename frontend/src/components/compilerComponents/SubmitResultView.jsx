import React, { useState } from 'react';
import { EmptyState, MetricItem, LanguageTag, StatusIndicator } from '../../utils/Compiler';
import { FaCheck, FaClock, FaBolt, FaRobot, FaSpinner, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { ReviewCode } from '../../../services/operations/SubmissionAPI';
import CodeReviewModal from '../modals/CodeReviewModal';
import { useDispatch } from 'react-redux';





const SubmitResultView = ({
  submitResult,
  isSubmitting,
  darkMode,
  language,
  code,
  problemDescription
}) => {
  const [aiReview, setAiReview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [showRawReview, setShowRawReview] = useState(false);

  const dispatch = useDispatch();

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const [showReviewModal, setShowReviewModal] = useState(false);




  const analyzeCode = async () => {
    if (!code) return;
    
    setIsAnalyzing(true);
    setAiError(null);
    setAiReview(null);
    
    try {
    const result = await dispatch(ReviewCode(code, problemDescription, language));
    setAiReview(result); // Assuming result contains the review text
    setShowReviewModal(true);
  } catch (error) {
    console.error("Error while analyzing code:", error);
    setAiError(error.message || "Failed to analyze code");
  } finally {
    setIsAnalyzing(false);
  }
};

  if (!submitResult) {
    return (
      <div className="space-y-4">
        <EmptyState 
          icon={<FaCheck />}
          title={isSubmitting ? "Submitting your solution..." : "No submission yet"}
          subtitle={isSubmitting ? "Please wait while we evaluate your code" : "Submit your code to see results"}
          darkMode={darkMode}
        />
        {/* Always show review button */}
        <div className={`rounded-lg p-4 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
          <button
            onClick={analyzeCode}
            disabled={isAnalyzing || !code}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
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
      </div>
    );
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Result Status Section */}
      {submitResult.status && (
        <div className={`rounded-lg p-4 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <StatusIndicator 
                status={submitResult.status === "Accepted" ? "success" : "error"} 
                size="lg"
                darkMode={darkMode}
              />
              <div>
                <h3 className={`text-lg font-semibold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
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

      {/* Performance Metrics Section - Only show for successful submissions */}
      {submitResult.status === "Accepted" && (
        <div className={`rounded-lg p-4 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
          <h4 className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Performance Metrics
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <MetricItem 
              label="Runtime" 
              value={submitResult.runtime || "N/A"} 
              color="blue" 
              darkMode={darkMode} 
            />
            <MetricItem 
              label="Memory" 
              value={submitResult.memory || "N/A"} 
              color="purple" 
              darkMode={darkMode} 
            />
            <MetricItem 
              label="Test Cases" 
              value={`${submitResult.passed}/${submitResult.total}`} 
              color={submitResult.passed === submitResult.total ? "green" : "red"} 
              darkMode={darkMode} 
            />
          </div>
        </div>
      )}

      {/* Error Details - Show for failed submissions */}
      {submitResult.status !== "Accepted" && submitResult.error && (
        <div className={`rounded-lg p-4 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
          <div className="flex items-start gap-3">
            <div className={`p-3 rounded-full ${
              submitResult.status === "Time Limit Exceeded" 
                ? darkMode ? "bg-yellow-900/50" : "bg-yellow-100" 
                : darkMode ? "bg-red-900/50" : "bg-red-100"
            }`}>
              {submitResult.status === "Time Limit Exceeded" ? (
                <FaClock className={`text-lg ${darkMode ? "text-yellow-300" : "text-yellow-700"}`} />
              ) : (
                <FaBolt className={`text-lg ${darkMode ? "text-red-300" : "text-red-700"}`} />
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
      <div className={`rounded-lg flex-1 flex flex-col ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
        <div className={`p-4 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Code Quality Analysis
              </h4>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Get detailed feedback on your solution
              </p>
            </div>
            <div className="flex items-center gap-2">
              {aiReview?.rawText && (
                <button
                  onClick={() => setShowRawReview(!showRawReview)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    darkMode 
                      ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  {showRawReview ? 'Structured View' : 'Raw View'}
                </button>
              )}
              <button
                onClick={analyzeCode}
                disabled={isAnalyzing || !code}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  darkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
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
          </div>
          
          {aiError && (
            <div className={`mt-3 p-3 rounded-md ${
              darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800'
            }`}>
              {aiError}
            </div>
          )}
        </div>

        {/* AI Review Results */}
      
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