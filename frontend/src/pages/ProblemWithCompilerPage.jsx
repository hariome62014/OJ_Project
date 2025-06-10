import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FaChevronLeft, FaPlay, FaCheck, FaCode, FaFileAlt, FaTerminal, FaLightbulb,
  FaHistory, FaExpand, FaCompress, FaCopy, FaShare, FaBookmark, FaThumbsUp,
  FaRegThumbsUp, FaBolt, FaClock, FaUser, FaRegBookmark, FaRegCopy, FaTimes
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { fetchProblemById } from "../../services/operations/ProblemAPI";
import { submitSolution } from "../../services/operations/SubmissionAPI";
import SplitPane from "react-split-pane";
import { toast } from "react-hot-toast";
import Editor from "@monaco-editor/react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import PanelTabButton from "../components/compilerComponents/PanelTabButton";
import RunResultView from "../components/compilerComponents/RunResultView";
import SubmitResultView from "../components/compilerComponents/SubmitResultView";
import { fetchUserSubmissions } from "../../services/operations/SubmissionAPI";


const ProblemPage = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const { problem, loading, error } = useSelector((state) => state.problem);
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState("cpp");
  const [fontSize, setFontSize] = useState(16);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [customInput, setCustomInput] = useState("");
  const [selectedTestCase, setSelectedTestCase] = useState(0);
  const [consoleTab, setConsoleTab] = useState("run"); // 'run' or 'submit'
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [showResultPanel, setShowResultPanel] = useState(false);

  const editorRef = useRef(null);
  const outputRef = useRef(null);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state)=>state.profile.user)



  // Fetch problem details
useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch problem data
      await dispatch(fetchProblemById(problemId,token));
      
      // Set default code template
      setCode(getDefaultCodeTemplate(language));
      
      // Only fetch submissions if user is logged in
      if (user) {
        try {
          // console.log("Ready for fetching Submission history...",user._id)
          const submissionResult = await dispatch(
            fetchUserSubmissions({ 
              problemId, 
              userId: user._id,
              token
            })
          ); // unwrap() gives you the actual payload or throws an error

          // console.log("Sunmission Result on frontend::",submissionResult)
          
          setSubmissionHistory(submissionResult);
        } catch (submissionError) {
          // console.error('Failed to fetch submissions:', submissionError);
          // You might want to set some error state here
          setSubmissionHistory([]); // Reset or keep previous state as per your needs
        }
      }
    } catch (problemError) {
      // console.error('Failed to fetch problem:', problemError);
      // Handle problem fetch error (maybe show a toast or set error state)
    }
  };

  fetchData();
}, [problemId, language, dispatch, user, token,submitResult,activeTab]); // Added token to dependencies

  // Default code templates
  const getDefaultCodeTemplate = (lang) => {

       if (code && code.trim() !== '') {
        return code;
    }
    const templates = {
      cpp: `#include <iostream>\n\nusing namespace std;\n\n${
        problem?.returnType || "int "
      } ${problem?.functionName || "main"}(${
        problem?.parameters || ""
      }) {\n    // Your code here\n    return ${
        problem?.returnType === "int" ? "0" : "0"
      };\n}`,
    };
    return templates[lang] || "";
  };

  // Handle language change
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    localStorage.setItem(`lastLanguage_${problemId}`, newLanguage);
  };

  // Handle editor mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      formatCode();
    });
  };

  // Handle code execution
// Assume: submitSolution is a redux-thunk action that returns the backend response

const ERROR_PRIORITY = [
  'compilation',
  'segmentation',
  'memory',
  'timeout',
  'runtime'
];

const STATUS_MAP = {
  compilation: "Compilation Error",
  segmentation: "Segmentation Fault",
  memory: "Memory Limit Exceeded",
  timeout: "Time Limit Exceeded",
  runtime: "Runtime Error"
};

function getStatusFromResults(results, allTestCasesPassed) {
  for (const type of ERROR_PRIORITY) {
    if (results.some(r => r.errorType === type)) return STATUS_MAP[type];
  }
  return allTestCasesPassed ? "Accepted" : "Wrong Answer";
}

const handleRun = async () => {
  console.log("Hello reached" )
  if (!code.trim()) {
    toast.error("Please write some code before running");
    return;
  }
  setShowResultPanel(true);
  setConsoleTab("run");
  setIsRunning(true);
  setOutput("Running your code...");
  const toastId = toast.loading("Testing your solution...");

  try {
    const testResultAction = await dispatch(
      submitSolution({ problemId, language, code, token, Sub_type: "run" })
    );
    console.log("TestResult after run :::",testResultAction)
    const testResult = testResultAction.payload || testResultAction; // adapt to your redux setup

    console.log("TestResult",testResult)

    toast.dismiss(toastId);

    // Determine status
    const status = getStatusFromResults(testResult.results, testResult.allTestCasesPassed);

    // Output message
    let output = "";
    switch (status) {
      case "Accepted":
        output = "✅ All test cases passed!";
        break;
      case "Compilation Error":
        output = "❌ Compilation error";
        break;
      case "Segmentation Fault":
        output = "💥 Segmentation Fault";
        break;
      case "Memory Limit Exceeded":
        output = "🚫 Memory Limit Exceeded";
        break;
      case "Time Limit Exceeded":
        output = "⏱️ Time Limit Exceeded";
        break;
      case "Runtime Error":
        output = "💥 Runtime Error";
        break;
      default:
        output = `❌ ${testResult.totalTestCases - testResult.passedTestCases} test case(s) failed`;
    }

    const result = {
      status,
      runtime: testResult.maxExecutionTime ? testResult.maxExecutionTime.toFixed(2) + "s" : "N/A",
      memory: testResult.maxMemoryUsage ? testResult.maxMemoryUsage.toFixed(2) + "MB" : "N/A",
      passed: testResult.passedTestCases,
      total: testResult.totalTestCases,
      testCases: testResult.results || [],
      output,
    };

    setRunResult(result);
    setTestCases(result.testCases);

    // Show appropriate toast message
    if (status === "Accepted") toast.success("All test cases passed!");
    else toast.error(output);

  } catch (err) {
    toast.dismiss(toastId);
    toast.error(err.message || "Testing failed. Please try again.");
    setRunResult({
      status: "Error",
      output: `Error: ${err.message}`
    });
  } finally {
    setIsRunning(false);
  }
};

const handleSubmit = async () => {
  if (!code.trim()) {
    toast.error("Please write some code before submitting");
    return;
  }
  setShowResultPanel(true);
  setConsoleTab("submit");
  setIsSubmitting(true);
  const toastId = toast.loading("Submitting your solution...");

  try {
    const submissionAction = await dispatch(
      submitSolution({ problemId, language, code, token, Sub_type: "submit" })
    );
    const submission = submissionAction.payload || submissionAction;

    toast.dismiss(toastId);

    // Determine status
    const status = getStatusFromResults(submission.results, submission.allTestCasesPassed);

    // Output message
    let output = "";
    switch (status) {
      case "Accepted":
        output = "✅ All test cases passed!";
        break;
      case "Compilation Error":
        output = "❌ Compilation error";
        break;
      case "Segmentation Fault":
        output = "💥 Segmentation Fault";
        break;
      case "Memory Limit Exceeded":
        output = "🚫 Memory Limit Exceeded";
        break;
      case "Time Limit Exceeded":
        output = "⏱️ Time Limit Exceeded";
        break;
      case "Runtime Error":
        output = "💥 Runtime Error";
        break;
      default:
        output = `❌ ${submission.totalTestCases - submission.passedTestCases} test case(s) failed`;
    }

    const result = {
      status,
      runtime: submission.maxExecutionTime ? submission.maxExecutionTime.toFixed(2) + "s" : "N/A",
      memory: submission.maxMemoryUsage ? submission.maxMemoryUsage.toFixed(2) + "MB" : "N/A",
      passed: submission.passedTestCases,
      total: submission.totalTestCases,
      testCases: submission.results || [],
      output,
      error: submission.results?.find(t => t.error)?.error
    };

    setSubmitResult(result);
    setTestCases(result.testCases);

    // Show appropriate toast message
    if (status === "Accepted") toast.success("All test cases passed!");
    else toast.error(output);

    // Update submission history
    setSubmissionHistory(prevHistory => [
      {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        status,
        runtime: result.runtime,
        memory: result.memory,
        language,
      },
      ...prevHistory
    ]);
  } catch (err) {
    toast.dismiss(toastId);
    toast.error(err.message || "Submission failed. Please try again.");
    setSubmitResult({
      status: "Error",
      output: `Error: ${err.message}`,
      error: err.message
    });
  } finally {
    setIsSubmitting(false);
  }
};

  // Other helper functions
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    localStorage.setItem(`code_${problemId}_${language}`, newCode);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const formatCode = () => {
    try {
      const formatted = code
        .replace(/\s*\n\s*/g, "\n")
        .replace(/\{\s*/g, "{\n  ")
        .replace(/\s*\}/g, "\n}");
      setCode(formatted);
      toast.success("Code formatted!");
    } catch (err) {
      toast.error("Could not format code");
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  if (loading === "loading") {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} flex items-center justify-center`}>
        Loading...
      </div>
    );
  }

  if (loading === "failed") {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} flex items-center justify-center`}>
        <div className="text-center max-w-md p-6 rounded-lg bg-red-100 dark:bg-red-900/50">
          <h3 className="text-xl font-bold mb-2">Error Loading Problem</h3>
          <p className="text-red-600 dark:text-red-300 mb-4">
            {error || "Unknown error occurred"}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/problems")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Browse Problems
            </button>
            <button
              onClick={() => dispatch(fetchProblemById(problemId,token))}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const editorTheme = darkMode ? "vs-dark" : "light";
  const currentResult = consoleTab === "run" ? runResult : submitResult;

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div
        className={`fixed top-0 z-10 ${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow-sm border-b ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } w-full`}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button
            onClick={() => navigate("/problems")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <FaChevronLeft className="text-blue-500" />
            <span className="font-medium">Problems</span>
          </button>

          <div className="flex gap-4 ml-6">
            <button
              onClick={handleRun}
              disabled={isRunning || isSubmitting}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm ${
                isRunning
                  ? `${
                      darkMode
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-gray-300 cursor-not-allowed"
                    }`
                  : `${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-200 hover:bg-gray-300"
                    } transition-colors`
              }`}
            >
              {isRunning ? (
                <>Running</>
              ) : (
                <>
                  <FaPlay /> Run
                </>
              )}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isRunning}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm text-white ${
                isSubmitting
                  ? "bg-green-600 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 transition-colors"
              }`}
            >
              {isSubmitting ? (
                <>Submitting</>
              ) : (
                <>
                  <FaCheck /> Submit
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="language" className="text-sm font-medium">
                Language:
              </label>
              <select
                id="language"
                value={language}
                onChange={handleLanguageChange}
                className={`px-2 py-1 rounded-md border text-sm ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:border-blue-500"
                }`}
              >
                <option value="cpp">C++</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-0 mt-14">
        <SplitPane
          split="vertical"
          minSize={300}
          defaultSize="50%"
          className={`${isFullScreen ? "hidden" : ""}`}
        >
          {/* Problem Description Pane (Left) */}
          <div
            className={`h-full overflow-y-auto ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="p-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-2xl font-bold">{problem?.title}</h1>
                    <div className="flex items-center gap-3 mt-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          problem?.difficulty === "easy"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : problem?.difficulty === "medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {problem?.difficulty}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                         {problem?.acceptance}%
                          Acceptance
                        </span>
                        
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={toggleBookmark}
                      className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                    >
                      {isBookmarked ? (
                        <FaBookmark className="text-yellow-500" />
                      ) : (
                        <FaRegBookmark />
                      )}
                    </button>
                    <button
                      onClick={toggleLike}
                      className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      aria-label={isLiked ? "Unlike" : "Like"}
                    >
                      {isLiked ? (
                        <FaThumbsUp className="text-blue-500" />
                      ) : (
                        <FaRegThumbsUp />
                      )}
                    </button>
                    <button
                      onClick={() => toast("Share feature coming soon!")}
                      className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Share"
                    >
                      <FaShare />
                    </button>
                  </div>
                </div>
                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                  <button
                    onClick={() => setActiveTab("description")}
                    className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === "description"
                        ? `${
                            darkMode
                              ? "text-blue-400 border-b-2 border-blue-400"
                              : "text-blue-600 border-b-2 border-blue-600"
                          }`
                        : `${
                            darkMode
                              ? "text-gray-400 hover:text-gray-300"
                              : "text-gray-600 hover:text-gray-800"
                          }`
                    }`}
                  >
                    <FaFileAlt />
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab("solutions")}
                    className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === "solutions"
                        ? `${
                            darkMode
                              ? "text-blue-400 border-b-2 border-blue-400"
                              : "text-blue-600 border-b-2 border-blue-600"
                          }`
                        : `${
                            darkMode
                              ? "text-gray-400 hover:text-gray-300"
                              : "text-gray-600 hover:text-gray-800"
                          }`
                    }`}
                  >
                    <FaLightbulb />
                    Solutions
                  </button>
                  <button
                    onClick={() => setActiveTab("submissions")}
                    className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === "submissions"
                        ? `${
                            darkMode
                              ? "text-blue-400 border-b-2 border-blue-400"
                              : "text-blue-600 border-b-2 border-blue-600"
                          }`
                        : `${
                            darkMode
                              ? "text-gray-400 hover:text-gray-300"
                              : "text-gray-600 hover:text-gray-800"
                          }`
                    }`}
                  >
                    <FaHistory />
                    Submissions
                  </button>
                </div>
                {/* Tab Content */}
                <div className="prose max-w-none dark:prose-invert prose-headings:font-semibold prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-100 dark:prose-pre:bg-gray-700 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-600">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {activeTab === "description" && (
                        <>
                          <div className="markdown-container">
                            <Markdown rehypePlugins={[rehypeRaw]}>
                              {problem?.description}
                            </Markdown>
                          </div>

                          <h3 className="mt-8 mb-4 text-lg font-semibold">
                            Examples
                          </h3>
                          {problem?.samples?.map((example, index) => (
                            <div
                              key={index}
                              className={`my-4 p-4 rounded-lg ${
                                darkMode ? "bg-gray-700" : "bg-gray-100"
                              }`}
                            >
                              <div className="font-medium mb-3">
                                Example {index + 1}:
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <div className="text-sm opacity-75 mb-1">
                                    Input:
                                  </div>
                                  <pre className="mt-1 p-3 bg-gray-200 dark:bg-gray-600 rounded text-sm">
                                    {example.input}
                                  </pre>
                                </div>
                                <div>
                                  <div className="text-sm opacity-75 mb-1">
                                    Output:
                                  </div>
                                  <pre className="mt-1 p-3 bg-gray-200 dark:bg-gray-600 rounded text-sm">
                                    {example.output}
                                  </pre>
                                </div>
                              </div>
                              {example.explanation && (
                                <div className="mt-3">
                                  <div className="text-sm opacity-75 mb-1">
                                    Explanation:
                                  </div>
                                  <div className="mt-1 p-3 bg-gray-200 dark:bg-gray-600 rounded text-sm">
                                    {example.explanation}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}

                          <h3 className="mt-8 mb-4 text-lg font-semibold">
                            Constraints
                          </h3>
                          <ul
                            className={`p-4 rounded-lg space-y-2 text-sm ${
                              darkMode ? "bg-gray-700" : "bg-gray-100"
                            }`}
                          >
                            {problem?.constraints
                              ?.split("\n")
                              .map((constraint, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>{constraint}</span>
                                </li>
                              ))}
                          </ul>
                        </>
                      )}

                      {activeTab === "solutions" && (
                        <div className="text-center py-8">
                          <div className="inline-block p-4 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                            <FaLightbulb className="text-3xl text-blue-500 dark:text-blue-300" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">
                            Solutions
                          </h3>
                          <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                            View community solutions and approaches to this
                            problem
                          </p>
                          <button
                            onClick={() =>
                              toast("Solutions feature coming soon!")
                            }
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                          >
                            View Solutions
                          </button>
                        </div>
                      )}

                      {activeTab === "submissions" && (
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Your Submissions</h3>
                          {submissionHistory.length > 0 ? (
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                      Time
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                      Status
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                      Runtime
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                      Language
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                  {submissionHistory.map((submission) => (
                                    <tr key={submission.id} className={`${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                                        {new Date(submission.date).toLocaleString()}
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                                        <span
                                          className={`px-2 py-1 rounded-full text-xs ${
                                            submission.status === "Accepted"
                                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                          }`}
                                        >
                                          {submission.status}
                                        </span>
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                                        {submission.runtime}
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                                        {submission.language}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                              No submissions yet
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Code Editor Pane (Right) */}
          <div
            className={`flex flex-col h-[100%] ${
              darkMode ? "bg-gray-900" : "bg-gray-50"
            }`}
          >
            {/* Editor Toolbar */}
            <div
              className={`flex justify-between items-center p-2 border-b ${
                darkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <FaCode className="text-blue-500" />
                <span>Editor</span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  {language.toUpperCase()}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={formatCode}
                  className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Format Code (Ctrl+S)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Copy Code"
                >
                  <FaRegCopy />
                </button>
                <button
                  onClick={toggleFullScreen}
                  className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullScreen ? <FaCompress /> : <FaExpand />}
                </button>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 overflow-hidden">
              <Editor
                height="100%"
                language={language}
                theme={editorTheme}
                value={code}
                onChange={handleCodeChange}
                onMount={handleEditorDidMount}
                options={{
                  fontSize: fontSize,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: "on",
                  renderWhitespace: "selection",
                  padding: { top: 10 },
                  lineNumbersMinChars: 3,
                  folding: false,
                  lineDecorationsWidth: 10,
                }}
              />
            </div>



{/* Modified result panel section */}
{(showResultPanel || isRunning || isSubmitting) && (
  <div className={`border-t ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
    {/* Panel Header */}
    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
      <div className="flex">
        <PanelTabButton
          active={consoleTab === "run"}
          onClick={() => setConsoleTab("run")}
          icon={<FaTerminal />}
          darkMode={darkMode}
        >
          Run Result
        </PanelTabButton>
        <PanelTabButton
          active={consoleTab === "submit"}
          onClick={() => setConsoleTab("submit")}
          icon={<FaTerminal />}
          darkMode={darkMode}
        >
          Submission Result
        </PanelTabButton>
      </div>
      <button
        onClick={() => setShowResultPanel(false)}
        className="p-2 mr-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        title="Close panel"
      >
        <FaTimes className="text-gray-500 dark:text-gray-400" />
      </button>
    </div>

    {/* Panel Content */}
    <div className="p-4 h-full overflow-y-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={consoleTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {consoleTab === "run" ? (
            <RunResultView 
              runResult={runResult}
              isRunning={isRunning}
              darkMode={darkMode}
              selectedTestCase={selectedTestCase}
              setSelectedTestCase={setSelectedTestCase}
            />
          ) : (
            <SubmitResultView 
              submitResult={submitResult}
              isSubmitting={isSubmitting}
              darkMode={darkMode}
              language={language}
              problemDescription = {problem.description}
              code = {code}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  </div>
)}
          </div>
        </SplitPane>

        {/* Fullscreen Editor */}
        {isFullScreen && (
          <div
            className={`fixed inset-0 z-50 flex flex-col ${
              darkMode ? "bg-gray-900" : "bg-gray-50"
            }`}
          >
            <div
              className={`flex justify-between items-center p-3 ${
                darkMode ? "bg-gray-800" : "bg-white"
              } border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
            >
              <div className="flex items-center gap-2 font-medium">
                <FaCode className="text-blue-500" />
                <span>Fullscreen Editor - {problem?.title}</span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  {language.toUpperCase()}
                </span>
              </div>
              <button
                onClick={toggleFullScreen}
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <FaCompress />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Editor
                height="100%"
                language={language}
                theme={editorTheme}
                value={code}
                onChange={handleCodeChange}
                options={{
                  fontSize: fontSize,
                  minimap: { enabled: true },
                  scrollBeyondLastLine: true,
                  automaticLayout: true,
                  wordWrap: "on",
                  renderWhitespace: "all",
                  padding: { top: 20 },
                  lineNumbersMinChars: 3,
                }}
              />
            </div>
            <div
              className={`p-3 ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              } border-t ${
                darkMode ? "border-gray-700" : "border-gray-200"
              } flex justify-between items-center`}
            >
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {problem?.title} - {problem?.difficulty}
              </div>
              <button
                onClick={toggleFullScreen}
                className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                Exit Fullscreen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemPage;