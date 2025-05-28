// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   FaChevronLeft,
//   FaPlay,
//   FaCheck,
//   FaCode,
//   FaFileAlt,
//   FaTerminal,
//   FaLightbulb,
//   FaHistory,
//   FaExpand,
//   FaCompress,
//   FaCopy,
//   FaShare,
//   FaBookmark,
//   FaThumbsUp,
//   FaRegThumbsUp,
//   FaBolt,
//   FaClock,
//   FaUser,
//   FaRegBookmark,
//   FaRegCopy,
// } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";
// import { Prism as SyntaxHighlighter } from "prism-react-renderer";
// import { fetchProblemById } from "../../services/operations/ProblemAPI";
// import { submitSolution } from "../../services/operations/SubmissionAPI";
// import SplitPane from "react-split-pane";
// import { toast } from "react-hot-toast";
// import Editor from "@monaco-editor/react";
// import Markdown from "react-markdown";
// import rehypeRaw from "rehype-raw";
// import remarkGfm from "remark-gfm";

// const ProblemPage = () => {
//   const { problemId } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const darkMode = useSelector((state) => state.theme.darkMode);
//   const { problem, loading, error } = useSelector((state) => state.problem);
//   const [code, setCode] = useState("");
//   const [activeTab, setActiveTab] = useState("description");
//   const [output, setOutput] = useState("");
//   const [isRunning, setIsRunning] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [language, setLanguage] = useState("cpp");
//   const [fontSize, setFontSize] = useState(16);
//   const [isFullScreen, setIsFullScreen] = useState(false);
//   const [testCases, setTestCases] = useState([]);
//   const [customInput, setCustomInput] = useState("");
//   const [selectedTestCase, setSelectedTestCase] = useState(0);
//   const [consoleTab, setConsoleTab] = useState("testcases");
//   const [isBookmarked, setIsBookmarked] = useState(false);
//   const [isLiked, setIsLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(0);
//   const [showResults, setShowResults] = useState(false); // New state for showing results
//   const [Sub_type,setSub_type] = useState('run');
//   const editorRef = useRef(null);
//   const outputRef = useRef(null);

//   const token = useSelector((state) => state.auth.token);
  

//   // Fetch problem details
//   useEffect(() => {
//     dispatch(fetchProblemById(problemId));

//     const savedCode = localStorage.getItem(`code_${problemId}_${language}`);
//     if (savedCode) {
//       setCode(savedCode);
//     } else {
//       setCode(getDefaultCodeTemplate(language));
//     }

//     setLikeCount(Math.floor(Math.random() * 100));
//     setIsBookmarked(Math.random() > 0.7);
//     setIsLiked(Math.random() > 0.7);
//   }, [problemId, language, dispatch]);

//   // Default code templates
//   const getDefaultCodeTemplate = (lang) => {
//     const templates = {
//       cpp: `#include <iostream>\n\nusing namespace std;\n\n${
//         problem?.returnType || "int"
//       } ${problem?.functionName || "solution"}(${
//         problem?.parameters || "int input"
//       }) {\n    // Your code here\n    return ${
//         problem?.returnType === "int" ? "0" : "null"
//       };\n}`,
//     };
//     return templates[lang] || "";
//   };

//   // Handle language change
//   const handleLanguageChange = (e) => {
//     const newLanguage = e.target.value;
//     setLanguage(newLanguage);
//     localStorage.setItem(`lastLanguage_${problemId}`, newLanguage);
//   };

//   // Handle editor mount
//   const handleEditorDidMount = (editor, monaco) => {
//     editorRef.current = editor;
//     editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
//       formatCode();
//     });
//   };

//   // Handle code execution
//   const handleRun = async () => {
//     if (!code.trim()) {
//       toast.error("Please write some code before submitting");
//       return;
//     }

//     setIsRunning(true);
//     setOutput("Running your code...");
//     setShowResults(true); // Show results when running
//     const toastId = toast.loading("Testing your solution...");

//     try {
//       setSub_type('run');
//       const testResult = await dispatch(
//         submitSolution({ problemId, language, code, token , Sub_type})
//       );

//       toast.dismiss(toastId);
//       console.log("testResult result:", testResult.results);

//       setTestCases(testResult.results);
//       setIsRunning(false);

//       if (testResult.allTestCasesPassed) {
//         setOutput("✅ All test cases passed!");
//       } else {
//         const failedCount =
//           testResult.totalTestCases - testResult.passedTestCases;
//         setOutput(`❌ ${failedCount} test case(s) failed`);
//       }
//     } catch (err) {
//       console.error("Testing error:", err);
//       toast.dismiss(toastId);
//       const errorMessage = err.message || "Testing failed. Please try again.";
//       toast.error(errorMessage);
//       setOutput(`Error: ${err.message}`);
//       setIsRunning(false);
//       throw err;
//     } finally {
//       setIsRunning(false);
//     }
//   };

//   // Handle code submission
//   const handleSubmit = async () => {
//     if (!code.trim()) {
//       toast.error("Please write some code before submitting");
//       return;
//     }

//     setIsSubmitting(true);
//     setShowResults(true); // Show results when submitting
//     const toastId = toast.loading("Submitting your solution...");

//     try {
//       setSub_type('submit')
//       const submission = await dispatch(
//         submitSolution({ problemId, language, code, token, Sub_type })
//       );

//       console.log("Submission result:", submission);
//       toast.dismiss(toastId);
//       toast.success("Solution submitted successfully!");

//       // Show submission results in the submissions tab
//       setActiveTab("submissions");
//       setTestCases(submission.testCases || []);
//       setOutput(submission.message || "Submission successful");

//       return submission;
//     } catch (err) {
//       console.error("Submission error:", err);
//       toast.dismiss(toastId);
//       const errorMessage =
//         err.message || "Submission failed. Please try again.";
//       toast.error(errorMessage);
//       throw err;
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Other helper functions remain the same...
//   const handleCopyCode = () => {
//     navigator.clipboard.writeText(code);
//     toast.success("Code copied to clipboard!");
//   };

//   const handleCodeChange = (newCode) => {
//     setCode(newCode);
//     localStorage.setItem(`code_${problemId}_${language}`, newCode);
//   };

//   const toggleFullScreen = () => {
//     setIsFullScreen(!isFullScreen);
//   };

//   const formatCode = () => {
//     try {
//       const formatted = code
//         .replace(/\s*\n\s*/g, "\n")
//         .replace(/\{\s*/g, "{\n  ")
//         .replace(/\s*\}/g, "\n}");

//       setCode(formatted);
//       toast.success("Code formatted!");
//     } catch (err) {
//       toast.error("Could not format code");
//     }
//   };

//   const toggleBookmark = () => {
//     setIsBookmarked(!isBookmarked);
//     toast.success(
//       isBookmarked ? "Removed from bookmarks" : "Added to bookmarks"
//     );
//   };

//   const toggleLike = () => {
//     setIsLiked(!isLiked);
//     setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
//   };

//   if (loading === "loading") {
//     return (
//       <div
//         className={`min-h-screen ${
//           darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
//         } flex items-center justify-center`}
//       >
//         Loading...
//       </div>
//     );
//   }

//   if (loading === "failed") {
//     return (
//       <div
//         className={`min-h-screen ${
//           darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
//         } flex items-center justify-center`}
//       >
//         <div className="text-center max-w-md p-6 rounded-lg bg-red-100 dark:bg-red-900/50">
//           <h3 className="text-xl font-bold mb-2">Error Loading Problem</h3>
//           <p className="text-red-600 dark:text-red-300 mb-4">
//             {error || "Unknown error occurred"}
//           </p>
//           <div className="flex gap-3 justify-center">
//             <button
//               onClick={() => navigate("/problems")}
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//             >
//               Browse Problems
//             </button>
//             <button
//               onClick={() => dispatch(fetchProblemById(problemId))}
//               className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const editorTheme = darkMode ? "vs-dark" : "light";

//   return (
//     <div
//       className={`min-h-screen ${
//         darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
//       }`}
//     >
//       {/* Header */}
//       <div
//         className={`fixed top-0 z-10 ${
//           darkMode ? "bg-gray-800" : "bg-white"
//         } shadow-sm border-b ${
//           darkMode ? "border-gray-700" : "border-gray-200"
//         } w-full`}
//       >
//         <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//           <button
//             onClick={() => navigate("/problems")}
//             className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
//               darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
//             }`}
//           >
//             <FaChevronLeft className="text-blue-500" />
//             <span className="font-medium">Problems</span>
//           </button>

//           <div className="flex  gap-4 ml-6">
//             <button
//               onClick={handleRun}
//               disabled={isRunning || isSubmitting}
//               className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm ${
//                 isRunning
//                   ? `${
//                       darkMode
//                         ? "bg-gray-600 cursor-not-allowed"
//                         : "bg-gray-300 cursor-not-allowed"
//                     }`
//                   : `${
//                       darkMode
//                         ? "bg-gray-700 hover:bg-gray-600"
//                         : "bg-gray-200 hover:bg-gray-300"
//                     } transition-colors`
//               }`}
//             >
//               {isRunning ? (
//                 <>Running</>
//               ) : (
//                 <>
//                   <FaPlay /> Run
//                 </>
//               )}
//             </button>
//             <button
//               onClick={handleSubmit}
//               disabled={isSubmitting || isRunning}
//               className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm text-white ${
//                 isSubmitting
//                   ? "bg-green-600 cursor-not-allowed"
//                   : "bg-green-500 hover:bg-green-600 transition-colors"
//               }`}
//             >
//               {isSubmitting ? (
//                 <>Submitting</>
//               ) : (
//                 <>
//                   <FaCheck /> Submit
//                 </>
//               )}
//             </button>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2">
//               <label htmlFor="language" className="text-sm font-medium">
//                 Language:
//               </label>
//               <select
//                 id="language"
//                 value={language}
//                 onChange={handleLanguageChange}
//                 className={`px-2 py-1 rounded-md border text-sm ${
//                   darkMode
//                     ? "bg-gray-700 border-gray-600 focus:border-blue-500"
//                     : "bg-white border-gray-300 focus:border-blue-500"
//                 }`}
//               >
//                 <option value="cpp">C++</option>
//               </select>
//             </div>

//             {/* <div className="flex items-center gap-2">
//               <label htmlFor="fontSize" className="text-sm font-medium">Font:</label>
//               <select
//                 id="fontSize"
//                 value={fontSize}
//                 onChange={(e) => setFontSize(Number(e.target.value))}
//                 className={`px-2 py-1 rounded-md border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'}`}
//               >
//                 {[12, 14, 16, 18, 20].map(size => (
//                   <option key={size} value={size}>{size}px</option>
//                 ))}
//               </select>
//             </div> */}
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-0 mt-14">
//         <SplitPane
//           split="vertical"
//           minSize={300}
//           defaultSize="50%"
//           className={`${isFullScreen ? "hidden" : ""}`}
//         >
//           {/* Problem Description Pane (Left) */}
//           <div
//             className={`h-full overflow-y-auto ${
//               darkMode ? "bg-gray-800" : "bg-white"
//             }`}
//           >
//             <div className="p-6">
//               <motion.div
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="flex justify-between items-start mb-6">
//                   <div>
//                     <h1 className="text-2xl font-bold">{problem?.title}</h1>
//                     <div className="flex items-center gap-3 mt-2">
//                       <span
//                         className={`px-2 py-1 text-xs rounded-full ${
//                           problem?.difficulty === "easy"
//                             ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
//                             : problem?.difficulty === "medium"
//                             ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
//                             : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
//                         }`}
//                       >
//                         {problem?.difficulty}
//                       </span>
//                       <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
//                         <span className="flex items-center gap-1">
//                           <FaUser className="text-xs" /> {problem?.acceptance}%
//                           Acceptance
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <FaBolt className="text-xs" /> {likeCount} Likes
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <FaClock className="text-xs" />{" "}
//                           {problem?.timeLimit || "1s"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={toggleBookmark}
//                       className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
//                       aria-label={
//                         isBookmarked ? "Remove bookmark" : "Add bookmark"
//                       }
//                     >
//                       {isBookmarked ? (
//                         <FaBookmark className="text-yellow-500" />
//                       ) : (
//                         <FaRegBookmark />
//                       )}
//                     </button>
//                     <button
//                       onClick={toggleLike}
//                       className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
//                       aria-label={isLiked ? "Unlike" : "Like"}
//                     >
//                       {isLiked ? (
//                         <FaThumbsUp className="text-blue-500" />
//                       ) : (
//                         <FaRegThumbsUp />
//                       )}
//                     </button>
//                     <button
//                       onClick={() => toast("Share feature coming soon!")}
//                       className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
//                       aria-label="Share"
//                     >
//                       <FaShare />
//                     </button>
//                   </div>
//                 </div>
//                 {/* Tabs */}
//                 <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
//                   <button
//                     onClick={() => setActiveTab("description")}
//                     className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
//                       activeTab === "description"
//                         ? `${
//                             darkMode
//                               ? "text-blue-400 border-b-2 border-blue-400"
//                               : "text-blue-600 border-b-2 border-blue-600"
//                           }`
//                         : `${
//                             darkMode
//                               ? "text-gray-400 hover:text-gray-300"
//                               : "text-gray-600 hover:text-gray-800"
//                           }`
//                     }`}
//                   >
//                     <FaFileAlt />
//                     Description
//                   </button>
//                   <button
//                     onClick={() => setActiveTab("solutions")}
//                     className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
//                       activeTab === "solutions"
//                         ? `${
//                             darkMode
//                               ? "text-blue-400 border-b-2 border-blue-400"
//                               : "text-blue-600 border-b-2 border-blue-600"
//                           }`
//                         : `${
//                             darkMode
//                               ? "text-gray-400 hover:text-gray-300"
//                               : "text-gray-600 hover:text-gray-800"
//                           }`
//                     }`}
//                   >
//                     <FaLightbulb />
//                     Solutions
//                   </button>
//                   <button
//                     onClick={() => setActiveTab("submissions")}
//                     className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
//                       activeTab === "submissions"
//                         ? `${
//                             darkMode
//                               ? "text-blue-400 border-b-2 border-blue-400"
//                               : "text-blue-600 border-b-2 border-blue-600"
//                           }`
//                         : `${
//                             darkMode
//                               ? "text-gray-400 hover:text-gray-300"
//                               : "text-gray-600 hover:text-gray-800"
//                           }`
//                     }`}
//                   >
//                     <FaHistory />
//                     Submissions
//                   </button>
//                 </div>
//                  {/* Tab Content */}
//                 <div className="prose max-w-none dark:prose-invert prose-headings:font-semibold prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-100 dark:prose-pre:bg-gray-700 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-600">
//                   <AnimatePresence mode="wait">
//                     <motion.div
//                       key={activeTab}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       transition={{ duration: 0.2 }}
//                     >
//                       {activeTab === "description" && (
//                         <>
//                           <div className="markdown-container">
//                             <Markdown rehypePlugins={[rehypeRaw]}>
//                               {problem?.description}
//                             </Markdown>
//                           </div>

//                           <h3 className="mt-8 mb-4 text-lg font-semibold">
//                             Examples
//                           </h3>
//                           {problem?.samples?.map((example, index) => (
//                             <div
//                               key={index}
//                               className={`my-4 p-4 rounded-lg ${
//                                 darkMode ? "bg-gray-700" : "bg-gray-100"
//                               }`}
//                             >
//                               <div className="font-medium mb-3">
//                                 Example {index + 1}:
//                               </div>
//                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div>
//                                   <div className="text-sm opacity-75 mb-1">
//                                     Input:
//                                   </div>
//                                   <pre className="mt-1 p-3 bg-gray-200 dark:bg-gray-600 rounded text-sm">
//                                     <code>{example.input}</code>
//                                   </pre>
//                                 </div>
//                                 <div>
//                                   <div className="text-sm opacity-75 mb-1">
//                                     Output:
//                                   </div>
//                                   <pre className="mt-1 p-3 bg-gray-200 dark:bg-gray-600 rounded text-sm">
//                                     <code>{example.output}</code>
//                                   </pre>
//                                 </div>
//                               </div>
//                               {example.explanation && (
//                                 <div className="mt-3">
//                                   <div className="text-sm opacity-75 mb-1">
//                                     Explanation:
//                                   </div>
//                                   <div className="mt-1 p-3 bg-gray-200 dark:bg-gray-600 rounded text-sm">
//                                     {example.explanation}
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           ))}

//                           <h3 className="mt-8 mb-4 text-lg font-semibold">
//                             Constraints
//                           </h3>
//                           <ul
//                             className={`p-4 rounded-lg space-y-2 text-sm ${
//                               darkMode ? "bg-gray-700" : "bg-gray-100"
//                             }`}
//                           >
//                             {problem?.constraints
//                               ?.split("\n")
//                               .map((constraint, i) => (
//                                 <li key={i} className="flex items-start">
//                                   <span className="mr-2">•</span>
//                                   <span>{constraint}</span>
//                                 </li>
//                               ))}
//                           </ul>
//                         </>
//                       )}

//                       {activeTab === "solutions" && (
//                         <div className="text-center py-8">
//                           <div className="inline-block p-4 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
//                             <FaLightbulb className="text-3xl text-blue-500 dark:text-blue-300" />
//                           </div>
//                           <h3 className="text-xl font-semibold mb-2">
//                             Solutions
//                           </h3>
//                           <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
//                             View community solutions and approaches to this
//                             problem
//                           </p>
//                           <button
//                             onClick={() =>
//                               toast("Solutions feature coming soon!")
//                             }
//                             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
//                           >
//                             View Solutions
//                           </button>
//                         </div>
//                       )}

//                       {activeTab === "submissions" && (
//                         <div className="text-center py-8">
//                           <div className="inline-block p-4 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
//                             <FaHistory className="text-3xl text-purple-500 dark:text-purple-300" />
//                           </div>
//                           <h3 className="text-xl font-semibold mb-2">
//                             Submissions
//                           </h3>
//                           <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
//                             View your submission history for this problem
//                           </p>
//                           <button
//                             onClick={() =>
//                               navigate(`/submissions?problem=${problemId}`)
//                             }
//                             className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
//                           >
//                             View Submissions
//                           </button>
//                         </div>
//                       )}
//                     </motion.div>
//                   </AnimatePresence>
//                 </div>
//               </motion.div>
//             </div>
//           </div>

//           {/* Code Editor Pane (Right) - Modified for Leetcode-like behavior */}
//           <div
//             className={`flex flex-col h-[100%] ${
//               darkMode ? "bg-gray-900" : "bg-gray-50"
//             } `}
//           >
//             {/* Editor Toolbar */}
//             <div
//               className={`flex justify-between items-center p-2 border-b ${
//                 darkMode
//                   ? "border-gray-700 bg-gray-800"
//                   : "border-gray-200 bg-white"
//               }`}
//             >
//               <div className="flex items-center gap-2 text-sm font-medium">
//                 <FaCode className="text-blue-500" />
//                 <span>Editor</span>
//                 <span
//                   className={`px-2 py-1 text-xs rounded-full ${
//                     darkMode ? "bg-gray-700" : "bg-gray-100"
//                   }`}
//                 >
//                   {language.toUpperCase()}
//                 </span>
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   onClick={formatCode}
//                   className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
//                   title="Format Code (Ctrl+S)"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </button>
//                 <button
//                   onClick={handleCopyCode}
//                   className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
//                   title="Copy Code"
//                 >
//                   <FaRegCopy />
//                 </button>
//                 <button
//                   onClick={toggleFullScreen}
//                   className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
//                   title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
//                 >
//                   {isFullScreen ? <FaCompress /> : <FaExpand />}
//                 </button>
//               </div>
//             </div>

//             {/* Code Editor */}
//             <div className="flex-1 overflow-hidden">
//               <Editor
//                 height="100%"
//                 language={language}
//                 theme={editorTheme}
//                 value={code}
//                 onChange={handleCodeChange}
//                 onMount={handleEditorDidMount}
//                 options={{
//                   fontSize: fontSize,
//                   minimap: { enabled: false },
//                   scrollBeyondLastLine: false,
//                   automaticLayout: true,
//                   wordWrap: "on",
//                   renderWhitespace: "selection",
//                   padding: { top: 10 },
//                   lineNumbersMinChars: 3,
//                   folding: false,
//                   lineDecorationsWidth: 10,
//                 }}
//               />
//             </div>

//             {/* Results Panel - Only shown after running/submitting */}

//             <div
//               className={`border-t ${
//                 darkMode
//                   ? "border-gray-700 bg-gray-800"
//                   : "border-gray-200 bg-white"
//               } h-[40%]`}
//             >
//               <div className="flex border-b border-gray-200 dark:border-gray-700">
//                 <button
//                   onClick={() => setConsoleTab("testcases")}
//                   className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
//                     consoleTab === "testcases"
//                       ? `${
//                           darkMode
//                             ? "text-blue-400 border-b-2 border-blue-400"
//                             : "text-blue-600 border-b-2 border-blue-600"
//                         }`
//                       : `${
//                           darkMode
//                             ? "text-gray-400 hover:text-gray-300"
//                             : "text-gray-600 hover:text-gray-800"
//                         }`
//                   }`}
//                 >
//                   <FaTerminal />
//                   Test Cases
//                 </button>
//                 {/* <button
//                   onClick={() => setConsoleTab("custominput")}
//                   className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
//                     consoleTab === "custominput"
//                       ? `${
//                           darkMode
//                             ? "text-blue-400 border-b-2 border-blue-400"
//                             : "text-blue-600 border-b-2 border-blue-600"
//                         }`
//                       : `${
//                           darkMode
//                             ? "text-gray-400 hover:text-gray-300"
//                             : "text-gray-600 hover:text-gray-800"
//                         }`
//                   }`}
//                 >
//                   <FaTerminal />
//                   Custom Input
//                 </button> */}
//                 <button
//                   onClick={() => setConsoleTab("output")}
//                   className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
//                     consoleTab === "output"
//                       ? `${
//                           darkMode
//                             ? "text-blue-400 border-b-2 border-blue-400"
//                             : "text-blue-600 border-b-2 border-blue-600"
//                         }`
//                       : `${
//                           darkMode
//                             ? "text-gray-400 hover:text-gray-300"
//                             : "text-gray-600 hover:text-gray-800"
//                         }`
//                   }`}
//                 >
//                   <FaTerminal />
//                   Output
//                 </button>
//               </div>

//               <div className="p-4 max-h-64 overflow-y-auto">
//                 <AnimatePresence mode="wait">
//                   <motion.div
//                     key={consoleTab}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     {consoleTab === "testcases" && (
//   <div>
//     {testCases.length > 0 ? (
//       <div>
//         <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
//           {testCases.map((testCase, index) => (
//             <button
//               key={index}
//               onClick={() => setSelectedTestCase(index)}
//               className={`px-3 py-1 rounded-md text-sm whitespace-nowrap ${
//                 selectedTestCase === index
//                   ? `${
//                       darkMode
//                         ? "bg-blue-600 text-white"
//                         : "bg-blue-500 text-white"
//                     }`
//                   : `${
//                       darkMode
//                         ? "bg-gray-700 hover:bg-gray-600"
//                         : "bg-gray-200 hover:bg-gray-300"
//                     }`
//               }`}
//             >
//               Case {index + 1}{" "}
//               {testCase.passed ? (
//                 <span className="text-green-400">✓</span>
//               ) : (
//                 <span className="text-red-400">✗</span>
//               )}
//             </button>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//           <div>
//             <div className="font-medium mb-2">Input</div>
//             <pre
//               className={`p-3 rounded ${
//                 darkMode ? "bg-gray-700" : "bg-gray-100"
//               }`}
//             >
//               {testCases[selectedTestCase]?.input}
//             </pre>
//           </div>
//           <div>
//             <div className="font-medium mb-2">Expected Output</div>
//             <pre
//               className={`p-3 rounded ${
//                 darkMode ? "bg-gray-700" : "bg-gray-100"
//               }`}
//             >
//               {testCases[selectedTestCase]?.expectedOutput}
//             </pre>
//           </div>
//           <div className="md:col-span-2">
//             <div className="font-medium mb-2">Your Output</div>
//             <pre
//               className={`p-3 rounded ${
//                 darkMode ? "bg-gray-700" : "bg-gray-100"
//               }`}
//             >
//               {testCases[selectedTestCase]?.actualOutput?.trim()}
//             </pre>
//             {testCases[selectedTestCase]?.runtime && (
//               <div
//                 className={`mt-2 text-xs ${
//                   darkMode ? "text-gray-400" : "text-gray-600"
//                 }`}
//               >
//                 Runtime: {testCases[selectedTestCase].runtime}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     ) : (
//       <div className="text-center py-4 text-gray-500 dark:text-gray-400">
//         {isRunning ? (
//           <div className="flex items-center justify-center gap-2">
//             <span>Running test cases...</span>
//           </div>
//         ) : (
//           "Run your code to see test case results"
//         )}
//       </div>
//     )}
//   </div>
// )}

//                     {/* {consoleTab === "custominput" && (
//                       <div>
//                         <div className="mb-4">
//                           <label className="block font-medium mb-2 text-sm">
//                             Custom Input
//                           </label>
//                           <textarea
//                             value={customInput}
//                             onChange={(e) => setCustomInput(e.target.value)}
//                             className={`w-full p-3 rounded border text-sm ${
//                               darkMode
//                                 ? "bg-gray-700 border-gray-600 focus:border-blue-500"
//                                 : "bg-white border-gray-300 focus:border-blue-500"
//                             }`}
//                             rows={4}
//                             placeholder="Enter your custom input here..."
//                           />
//                         </div>
//                       </div>
//                     )} */}

//                     {consoleTab === "output" && (
//                       <div>
//                         <div className="mb-4">
//                           <label className="block font-medium mb-2 text-sm">
//                             Output
//                           </label>
//                           <pre
//                             className={`p-3 rounded whitespace-pre-wrap text-sm ${
//                               darkMode ? "bg-gray-700" : "bg-gray-100"
//                             }`}
//                           >
//                             {output ||
//                               (isRunning
//                                 ? "Running your code..."
//                                 : "Run with custom input to see output")}
//                           </pre>
//                         </div>
//                       </div>
//                     )}
//                   </motion.div>
//                 </AnimatePresence>
//               </div>
//             </div>

//             {/* Action Buttons */}
//           </div>
//         </SplitPane>

//         {/* Fullscreen Editor */}

//         {isFullScreen && (
//           <div
//             className={`fixed inset-0 z-50 flex flex-col ${
//               darkMode ? "bg-gray-900" : "bg-gray-50"
//             }`}
//           >
//             <div
//               className={`flex justify-between items-center p-3 ${
//                 darkMode ? "bg-gray-800" : "bg-white"
//               } border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
//             >
//               <div className="flex items-center gap-2 font-medium">
//                 <FaCode className="text-blue-500" />
//                 <span>Fullscreen Editor - {problem?.title}</span>
//                 <span
//                   className={`px-2 py-1 text-xs rounded-full ${
//                     darkMode ? "bg-gray-700" : "bg-gray-100"
//                   }`}
//                 >
//                   {language.toUpperCase()}
//                 </span>
//               </div>
//               <button
//                 onClick={toggleFullScreen}
//                 className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
//               >
//                 <FaCompress />
//               </button>
//             </div>
//             <div className="flex-1 overflow-hidden">
//               <Editor
//                 height="100%"
//                 language={language}
//                 theme={editorTheme}
//                 value={code}
//                 onChange={handleCodeChange}
//                 options={{
//                   fontSize: fontSize,
//                   minimap: { enabled: true },
//                   scrollBeyondLastLine: true,
//                   automaticLayout: true,
//                   wordWrap: "on",
//                   renderWhitespace: "all",
//                   padding: { top: 20 },
//                   lineNumbersMinChars: 3,
//                 }}
//               />
//             </div>
//             <div
//               className={`p-3 ${
//                 darkMode ? "bg-gray-800" : "bg-gray-100"
//               } border-t ${
//                 darkMode ? "border-gray-700" : "border-gray-200"
//               } flex justify-between items-center`}
//             >
//               <div className="text-sm text-gray-600 dark:text-gray-400">
//                 {problem?.title} - {problem?.difficulty}
//               </div>
//               <button
//                 onClick={toggleFullScreen}
//                 className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
//               >
//                 Exit Fullscreen
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProblemPage;




// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   FaChevronLeft,
//   FaPlay,
//   FaCheck,
//   FaCode,
//   FaFileAlt,
//   FaTerminal,
//   FaLightbulb,
//   FaHistory,
//   FaExpand,
//   FaCompress,
//   FaCopy,
//   FaShare,
//   FaBookmark,
//   FaThumbsUp,
//   FaRegThumbsUp,
//   FaBolt,
//   FaClock,
//   FaUser,
//   FaRegBookmark,
//   FaRegCopy,
//   FaTimes,
// } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";
// import { fetchProblemById } from "../../services/operations/ProblemAPI";
// import { submitSolution } from "../../services/operations/SubmissionAPI";

// import SplitPane from "react-split-pane";
// import { toast } from "react-hot-toast";
// import Editor from "@monaco-editor/react";
// import Markdown from "react-markdown";
// import rehypeRaw from "rehype-raw";
// import remarkGfm from "remark-gfm";

// const ProblemPage = () => {
//   const { problemId } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const darkMode = useSelector((state) => state.theme.darkMode);
//   const { problem, loading, error } = useSelector((state) => state.problem);
//   const [code, setCode] = useState("");
//   const [activeTab, setActiveTab] = useState("description");
//   const [output, setOutput] = useState("");
//   const [isRunning, setIsRunning] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [language, setLanguage] = useState("cpp");
//   const [fontSize, setFontSize] = useState(16);
//   const [isFullScreen, setIsFullScreen] = useState(false);
//   const [testCases, setTestCases] = useState([]);
//   const [customInput, setCustomInput] = useState("");
//   const [selectedTestCase, setSelectedTestCase] = useState(0);
//   const [consoleTab, setConsoleTab] = useState("testcases");
//   const [isBookmarked, setIsBookmarked] = useState(false);
//   const [isLiked, setIsLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(0);
//   const [Sub_type, setSub_type] = useState("run");
//   const [editorTab, setEditorTab] = useState("code"); // 'code' or 'result'
//   const [submissionResult, setSubmissionResult] = useState(null);
//   const [showResultPanel, setShowResultPanel] = useState(false);
//   const [submissionHistory, setSubmissionHistory] = useState([]);

//   const editorRef = useRef(null);
//   const outputRef = useRef(null);
//   const token = useSelector((state) => state.auth.token);

//   // Fetch problem details
//   useEffect(() => {
//     dispatch(fetchProblemById(problemId));

//     const savedCode = localStorage.getItem(`code_${problemId}_${language}`);
//     if (savedCode) {
//       setCode(savedCode);
//     } else {
//       setCode(getDefaultCodeTemplate(language));
//     }

//     setLikeCount(Math.floor(Math.random() * 100));
//     setIsBookmarked(Math.random() > 0.7);
//     setIsLiked(Math.random() > 0.7);

//     // Mock submission history (replace with actual API call)
//     setSubmissionHistory([
//       {
//         id: "1",
//         date: new Date(Date.now() - 86400000).toISOString(),
//         status: "Accepted",
//         runtime: "12 ms",
//         language: "C++",
//       },
//       {
//         id: "2",
//         date: new Date(Date.now() - 172800000).toISOString(),
//         status: "Wrong Answer",
//         runtime: "8 ms",
//         language: "C++",
//       },
//     ]);
//   }, [problemId, language, dispatch]);

//   // Default code templates
//   const getDefaultCodeTemplate = (lang) => {
//     const templates = {
//       cpp: `#include <iostream>\n\nusing namespace std;\n\n${
//         problem?.returnType || "int"
//       } ${problem?.functionName || "solution"}(${
//         problem?.parameters || "int input"
//       }) {\n    // Your code here\n    return ${
//         problem?.returnType === "int" ? "0" : "null"
//       };\n}`,
//     };
//     return templates[lang] || "";
//   };

//   // Handle language change
//   const handleLanguageChange = (e) => {
//     const newLanguage = e.target.value;
//     setLanguage(newLanguage);
//     localStorage.setItem(`lastLanguage_${problemId}`, newLanguage);
//   };

//   // Handle editor mount
//   const handleEditorDidMount = (editor, monaco) => {
//     editorRef.current = editor;
//     editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
//       formatCode();
//     });
//   };

//   // Handle code execution
//   const handleRun = async () => {
//     if (!code.trim()) {
//       toast.error("Please write some code before submitting");
//       return;
//     }

//     setIsRunning(true);
//     setOutput("Running your code...");
//     setShowResultPanel(true);
//     setEditorTab("result");
//     const toastId = toast.loading("Testing your solution...");

//     try {
//       setSub_type("run");
//       const testResult = await dispatch(
//         submitSolution({ problemId, language, code, token, Sub_type })
//       );

//       toast.dismiss(toastId);
//       setSubmissionResult({
//         status: testResult.allTestCasesPassed ? "Accepted" : "Wrong Answer",
//         runtime: testResult.runtime || "N/A",
//         memory: testResult.memory || "N/A",
//         passed: testResult.passedTestCases,
//         total: testResult.totalTestCases,
//       });

//       setTestCases(testResult.results);
//       setIsRunning(false);

//       if (testResult.allTestCasesPassed) {
//         setOutput("✅ All test cases passed!");
//         toast.success("All test cases passed!");
//       } else {
//         const failedCount = testResult.totalTestCases - testResult.passedTestCases;
//         setOutput(`❌ ${failedCount} test case(s) failed`);
//         toast.error(`${failedCount} test case(s) failed`);
//       }
//     } catch (err) {
//       console.error("Testing error:", err);
//       toast.dismiss(toastId);
//       const errorMessage = err.message || "Testing failed. Please try again.";
//       toast.error(errorMessage);
//       setOutput(`Error: ${err.message}`);
//       setIsRunning(false);
//       throw err;
//     } finally {
//       setIsRunning(false);
//     }
//   };

//   // Handle code submission
//   const handleSubmit = async () => {
//     if (!code.trim()) {
//       toast.error("Please write some code before submitting");
//       return;
//     }

//     setIsSubmitting(true);
//     setShowResultPanel(true);
//     setEditorTab("result");
//     const toastId = toast.loading("Submitting your solution...");

//     try {
//       setSub_type("submit");
//       const submission = await dispatch(
//         submitSolution({ problemId, language, code, token, Sub_type })
//       );

//       console.log("Submission result:", submission);
//       toast.dismiss(toastId);
//       toast.success("Solution submitted successfully!");

//       setSubmissionResult({
//         status: submission.allTestCasesPassed ? "Accepted" : "Wrong Answer",
//         runtime: submission.runtime || "N/A",
//         memory: submission.memory || "N/A",
//         passed: submission.passedTestCases,
//         total: submission.totalTestCases,
//       });

//       // Add to submission history
//       const newSubmission = {
//         id: Date.now().toString(),
//         date: new Date().toISOString(),
//         status: submission.allTestCasesPassed ? "Accepted" : "Wrong Answer",
//         runtime: submission.runtime || "N/A",
//         language: language,
//       };
//       setSubmissionHistory([newSubmission, ...submissionHistory]);

//       setTestCases(submission.results || []);
//       setOutput(submission.message || "Submission successful");

//       // return submission;
//     } catch (err) {
//       console.error("Submission error:", err);
//       toast.dismiss(toastId);
//       const errorMessage = err.message || "Submission failed. Please try again.";
//       toast.error(errorMessage);
//       throw err;
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Other helper functions remain the same...
//   const handleCopyCode = () => {
//     navigator.clipboard.writeText(code);
//     toast.success("Code copied to clipboard!");
//   };

//   const handleCodeChange = (newCode) => {
//     setCode(newCode);
//     localStorage.setItem(`code_${problemId}_${language}`, newCode);
//   };

//   const toggleFullScreen = () => {
//     setIsFullScreen(!isFullScreen);
//   };

//   const formatCode = () => {
//     try {
//       const formatted = code
//         .replace(/\s*\n\s*/g, "\n")
//         .replace(/\{\s*/g, "{\n  ")
//         .replace(/\s*\}/g, "\n}");

//       setCode(formatted);
//       toast.success("Code formatted!");
//     } catch (err) {
//       toast.error("Could not format code");
//     }
//   };

//   const toggleBookmark = () => {
//     setIsBookmarked(!isBookmarked);
//     toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
//   };

//   const toggleLike = () => {
//     setIsLiked(!isLiked);
//     setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
//   };

//   const closeResultPanel = () => {
//     setShowResultPanel(false);
//     setEditorTab("code");
//   };

//   if (loading === "loading") {
//     return (
//       <div
//         className={`min-h-screen ${
//           darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
//         } flex items-center justify-center`}
//       >
//         Loading...
//       </div>
//     );
//   }

//   if (loading === "failed") {
//     return (
//       <div
//         className={`min-h-screen ${
//           darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
//         } flex items-center justify-center`}
//       >
//         <div className="text-center max-w-md p-6 rounded-lg bg-red-100 dark:bg-red-900/50">
//           <h3 className="text-xl font-bold mb-2">Error Loading Problem</h3>
//           <p className="text-red-600 dark:text-red-300 mb-4">
//             {error || "Unknown error occurred"}
//           </p>
//           <div className="flex gap-3 justify-center">
//             <button
//               onClick={() => navigate("/problems")}
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//             >
//               Browse Problems
//             </button>
//             <button
//               onClick={() => dispatch(fetchProblemById(problemId))}
//               className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const editorTheme = darkMode ? "vs-dark" : "light";

//   return (
//     <div
//       className={`min-h-screen ${
//         darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
//       }`}
//     >
//       {/* Header */}
//       <div
//         className={`fixed top-0 z-10 ${
//           darkMode ? "bg-gray-800" : "bg-white"
//         } shadow-sm border-b ${
//           darkMode ? "border-gray-700" : "border-gray-200"
//         } w-full`}
//       >
//         <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//           <button
//             onClick={() => navigate("/problems")}
//             className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
//               darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
//             }`}
//           >
//             <FaChevronLeft className="text-blue-500" />
//             <span className="font-medium">Problems</span>
//           </button>

//           <div className="flex gap-4 ml-6">
//             <button
//               onClick={handleRun}
//               disabled={isRunning || isSubmitting}
//               className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm ${
//                 isRunning
//                   ? `${
//                       darkMode
//                         ? "bg-gray-600 cursor-not-allowed"
//                         : "bg-gray-300 cursor-not-allowed"
//                     }`
//                   : `${
//                       darkMode
//                         ? "bg-gray-700 hover:bg-gray-600"
//                         : "bg-gray-200 hover:bg-gray-300"
//                     } transition-colors`
//               }`}
//             >
//               {isRunning ? (
//                 <>Running</>
//               ) : (
//                 <>
//                   <FaPlay /> Run
//                 </>
//               )}
//             </button>
//             <button
//               onClick={handleSubmit}
//               disabled={isSubmitting || isRunning}
//               className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm text-white ${
//                 isSubmitting
//                   ? "bg-green-600 cursor-not-allowed"
//                   : "bg-green-500 hover:bg-green-600 transition-colors"
//               }`}
//             >
//               {isSubmitting ? (
//                 <>Submitting</>
//               ) : (
//                 <>
//                   <FaCheck /> Submit
//                 </>
//               )}
//             </button>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2">
//               <label htmlFor="language" className="text-sm font-medium">
//                 Language:
//               </label>
//               <select
//                 id="language"
//                 value={language}
//                 onChange={handleLanguageChange}
//                 className={`px-2 py-1 rounded-md border text-sm ${
//                   darkMode
//                     ? "bg-gray-700 border-gray-600 focus:border-blue-500"
//                     : "bg-white border-gray-300 focus:border-blue-500"
//                 }`}
//               >
//                 <option value="cpp">C++</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-0 mt-14">
//         <SplitPane
//           split="vertical"
//           minSize={300}
//           defaultSize="50%"
//           className={`${isFullScreen ? "hidden" : ""}`}
//         >
//           {/* Problem Description Pane (Left) */}
//           <div
//             className={`h-full overflow-y-auto ${
//               darkMode ? "bg-gray-800" : "bg-white"
//             }`}
//           >
//             <div className="p-6">
//               <motion.div
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="flex justify-between items-start mb-6">
//                   <div>
//                     <h1 className="text-2xl font-bold">{problem?.title}</h1>
//                     <div className="flex items-center gap-3 mt-2">
//                       <span
//                         className={`px-2 py-1 text-xs rounded-full ${
//                           problem?.difficulty === "easy"
//                             ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
//                             : problem?.difficulty === "medium"
//                             ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
//                             : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
//                         }`}
//                       >
//                         {problem?.difficulty}
//                       </span>
//                       <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
//                         <span className="flex items-center gap-1">
//                           <FaUser className="text-xs" /> {problem?.acceptance}%
//                           Acceptance
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <FaBolt className="text-xs" /> {likeCount} Likes
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <FaClock className="text-xs" />{" "}
//                           {problem?.timeLimit || "1s"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={toggleBookmark}
//                       className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
//                       aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
//                     >
//                       {isBookmarked ? (
//                         <FaBookmark className="text-yellow-500" />
//                       ) : (
//                         <FaRegBookmark />
//                       )}
//                     </button>
//                     <button
//                       onClick={toggleLike}
//                       className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
//                       aria-label={isLiked ? "Unlike" : "Like"}
//                     >
//                       {isLiked ? (
//                         <FaThumbsUp className="text-blue-500" />
//                       ) : (
//                         <FaRegThumbsUp />
//                       )}
//                     </button>
//                     <button
//                       onClick={() => toast("Share feature coming soon!")}
//                       className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
//                       aria-label="Share"
//                     >
//                       <FaShare />
//                     </button>
//                   </div>
//                 </div>
//                 {/* Tabs */}
//                 <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
//                   <button
//                     onClick={() => setActiveTab("description")}
//                     className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
//                       activeTab === "description"
//                         ? `${
//                             darkMode
//                               ? "text-blue-400 border-b-2 border-blue-400"
//                               : "text-blue-600 border-b-2 border-blue-600"
//                           }`
//                         : `${
//                             darkMode
//                               ? "text-gray-400 hover:text-gray-300"
//                               : "text-gray-600 hover:text-gray-800"
//                           }`
//                     }`}
//                   >
//                     <FaFileAlt />
//                     Description
//                   </button>
//                   <button
//                     onClick={() => setActiveTab("solutions")}
//                     className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
//                       activeTab === "solutions"
//                         ? `${
//                             darkMode
//                               ? "text-blue-400 border-b-2 border-blue-400"
//                               : "text-blue-600 border-b-2 border-blue-600"
//                           }`
//                         : `${
//                             darkMode
//                               ? "text-gray-400 hover:text-gray-300"
//                               : "text-gray-600 hover:text-gray-800"
//                           }`
//                     }`}
//                   >
//                     <FaLightbulb />
//                     Solutions
//                   </button>
//                   <button
//                     onClick={() => setActiveTab("submissions")}
//                     className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
//                       activeTab === "submissions"
//                         ? `${
//                             darkMode
//                               ? "text-blue-400 border-b-2 border-blue-400"
//                               : "text-blue-600 border-b-2 border-blue-600"
//                           }`
//                         : `${
//                             darkMode
//                               ? "text-gray-400 hover:text-gray-300"
//                               : "text-gray-600 hover:text-gray-800"
//                           }`
//                     }`}
//                   >
//                     <FaHistory />
//                     Submissions
//                   </button>
//                 </div>
//                 {/* Tab Content */}
//                 <div className="prose max-w-none dark:prose-invert prose-headings:font-semibold prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-100 dark:prose-pre:bg-gray-700 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-600">
//                   <AnimatePresence mode="wait">
//                     <motion.div
//                       key={activeTab}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       transition={{ duration: 0.2 }}
//                     >
//                       {activeTab === "description" && (
//                         <>
//                           <div className="markdown-container">
//                             <Markdown rehypePlugins={[rehypeRaw]}>
//                               {problem?.description}
//                             </Markdown>
//                           </div>

//                           <h3 className="mt-8 mb-4 text-lg font-semibold">
//                             Examples
//                           </h3>
//                           {problem?.samples?.map((example, index) => (
//                             <div
//                               key={index}
//                               className={`my-4 p-4 rounded-lg ${
//                                 darkMode ? "bg-gray-700" : "bg-gray-100"
//                               }`}
//                             >
//                               <div className="font-medium mb-3">
//                                 Example {index + 1}:
//                               </div>
//                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div>
//                                   <div className="text-sm opacity-75 mb-1">
//                                     Input:
//                                   </div>
//                                   <pre className="mt-1 p-3 bg-gray-200 dark:bg-gray-600 rounded text-sm">
//                                     <code>{example.input}</code>
//                                   </pre>
//                                 </div>
//                                 <div>
//                                   <div className="text-sm opacity-75 mb-1">
//                                     Output:
//                                   </div>
//                                   <pre className="mt-1 p-3 bg-gray-200 dark:bg-gray-600 rounded text-sm">
//                                     <code>{example.output}</code>
//                                   </pre>
//                                 </div>
//                               </div>
//                               {example.explanation && (
//                                 <div className="mt-3">
//                                   <div className="text-sm opacity-75 mb-1">
//                                     Explanation:
//                                   </div>
//                                   <div className="mt-1 p-3 bg-gray-200 dark:bg-gray-600 rounded text-sm">
//                                     {example.explanation}
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           ))}

//                           <h3 className="mt-8 mb-4 text-lg font-semibold">
//                             Constraints
//                           </h3>
//                           <ul
//                             className={`p-4 rounded-lg space-y-2 text-sm ${
//                               darkMode ? "bg-gray-700" : "bg-gray-100"
//                             }`}
//                           >
//                             {problem?.constraints
//                               ?.split("\n")
//                               .map((constraint, i) => (
//                                 <li key={i} className="flex items-start">
//                                   <span className="mr-2">•</span>
//                                   <span>{constraint}</span>
//                                 </li>
//                               ))}
//                           </ul>
//                         </>
//                       )}

//                       {activeTab === "solutions" && (
//                         <div className="text-center py-8">
//                           <div className="inline-block p-4 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
//                             <FaLightbulb className="text-3xl text-blue-500 dark:text-blue-300" />
//                           </div>
//                           <h3 className="text-xl font-semibold mb-2">
//                             Solutions
//                           </h3>
//                           <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
//                             View community solutions and approaches to this
//                             problem
//                           </p>
//                           <button
//                             onClick={() =>
//                               toast("Solutions feature coming soon!")
//                             }
//                             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
//                           >
//                             View Solutions
//                           </button>
//                         </div>
//                       )}

//                       {activeTab === "submissions" && (
//                         <div>
//                           <h3 className="text-lg font-semibold mb-4">Your Submissions</h3>
//                           {submissionHistory.length > 0 ? (
//                             <div className="overflow-x-auto">
//                               <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                                 <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
//                                   <tr>
//                                     <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
//                                       Time
//                                     </th>
//                                     <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
//                                       Status
//                                     </th>
//                                     <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
//                                       Runtime
//                                     </th>
//                                     <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
//                                       Language
//                                     </th>
//                                   </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                                   {submissionHistory.map((submission) => (
//                                     <tr key={submission.id} className={`${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}>
//                                       <td className="px-4 py-2 whitespace-nowrap text-sm">
//                                         {new Date(submission.date).toLocaleString()}
//                                       </td>
//                                       <td className="px-4 py-2 whitespace-nowrap text-sm">
//                                         <span
//                                           className={`px-2 py-1 rounded-full text-xs ${
//                                             submission.status === "Accepted"
//                                               ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
//                                               : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
//                                           }`}
//                                         >
//                                           {submission.status}
//                                         </span>
//                                       </td>
//                                       <td className="px-4 py-2 whitespace-nowrap text-sm">
//                                         {submission.runtime}
//                                       </td>
//                                       <td className="px-4 py-2 whitespace-nowrap text-sm">
//                                         {submission.language}
//                                       </td>
//                                     </tr>
//                                   ))}
//                                 </tbody>
//                               </table>
//                             </div>
//                           ) : (
//                             <div className="text-center py-8 text-gray-500 dark:text-gray-400">
//                               No submissions yet
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </motion.div>
//                   </AnimatePresence>
//                 </div>
//               </motion.div>
//             </div>
//           </div>

//           {/* Code Editor Pane (Right) - Modified for Leetcode-like behavior */}
//           <div
//             className={`flex flex-col h-[100%] ${
//               darkMode ? "bg-gray-900" : "bg-gray-50"
//             }`}
//           >
//             {/* Editor Tabs */}
//             <div
//               className={`flex border-b ${
//                 darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
//               }`}
//             >
//               <button
//                 onClick={() => setEditorTab("code")}
//                 className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
//                   editorTab === "code"
//                     ? `${
//                         darkMode
//                           ? "text-blue-400 border-b-2 border-blue-400"
//                           : "text-blue-600 border-b-2 border-blue-600"
//                       }`
//                     : `${
//                         darkMode
//                           ? "text-gray-400 hover:text-gray-300"
//                           : "text-gray-600 hover:text-gray-800"
//                       }`
//                 }`}
//               >
//                 <FaCode />
//                 Code
//               </button>
//               {showResultPanel && (
//                 <button
//                   onClick={() => setEditorTab("result")}
//                   className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
//                     editorTab === "result"
//                       ? `${
//                           darkMode
//                             ? "text-blue-400 border-b-2 border-blue-400"
//                             : "text-blue-600 border-b-2 border-blue-600"
//                         }`
//                       : `${
//                           darkMode
//                             ? "text-gray-400 hover:text-gray-300"
//                             : "text-gray-600 hover:text-gray-800"
//                         }`
//                   }`}
//                 >
//                   <FaCheck />
//                   Submission Result
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       closeResultPanel();
//                     }}
//                     className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
//                   >
//                     <FaTimes size={12} />
//                   </button>
//                 </button>
//               )}
//             </div>

//             {/* Editor Content */}
//             <div className="flex-1 overflow-hidden">
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={editorTab}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.1 }}
//                   className="h-full"
//                 >
//                   {editorTab === "code" ? (
//                     <>
//                       {/* Editor Toolbar */}
//                       <div
//                         className={`flex justify-between items-center p-2 ${
//                           darkMode ? "bg-gray-800" : "bg-white"
//                         }`}
//                       >
//                         <div className="flex items-center gap-2 text-sm font-medium">
//                           <span
//                             className={`px-2 py-1 text-xs rounded-full ${
//                               darkMode ? "bg-gray-700" : "bg-gray-100"
//                             }`}
//                           >
//                             {language.toUpperCase()}
//                           </span>
//                         </div>
//                         <div className="flex gap-2">
//                           <button
//                             onClick={formatCode}
//                             className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
//                             title="Format Code (Ctrl+S)"
//                           >
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               className="h-5 w-5"
//                               viewBox="0 0 20 20"
//                               fill="currentColor"
//                             >
//                               <path
//                                 fillRule="evenodd"
//                                 d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
//                                 clipRule="evenodd"
//                               />
//                             </svg>
//                           </button>
//                           <button
//                             onClick={handleCopyCode}
//                             className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
//                             title="Copy Code"
//                           >
//                             <FaRegCopy />
//                           </button>
//                           <button
//                             onClick={toggleFullScreen}
//                             className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
//                             title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
//                           >
//                             {isFullScreen ? <FaCompress /> : <FaExpand />}
//                           </button>
//                         </div>
//                       </div>

//                       {/* Code Editor */}
//                       <div className="h-[calc(100%-40px)]">
//                         <Editor
//                           height="100%"
//                           language={language}
//                           theme={editorTheme}
//                           value={code}
//                           onChange={handleCodeChange}
//                           onMount={handleEditorDidMount}
//                           options={{
//                             fontSize: fontSize,
//                             minimap: { enabled: false },
//                             scrollBeyondLastLine: false,
//                             automaticLayout: true,
//                             wordWrap: "on",
//                             renderWhitespace: "selection",
//                             padding: { top: 10 },
//                             lineNumbersMinChars: 3,
//                             folding: false,
//                             lineDecorationsWidth: 10,
//                           }}
//                         />
//                       </div>
//                     </>
//                   ) : (
//                     <div className="h-full flex flex-col">
//                       {/* Submission Result Header */}
//                       <div
//                         className={`p-4 border-b ${
//                           darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
//                         }`}
//                       >
//                         <div className="flex justify-between items-center">
//                           <h3 className="text-lg font-semibold">
//                             Submission Result
//                           </h3>
//                           <button
//                             onClick={closeResultPanel}
//                             className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
//                           >
//                             <FaTimes />
//                           </button>
//                         </div>
//                         {submissionResult && (
//                           <div className="mt-2 flex items-center gap-4">
//                             <span
//                               className={`px-3 py-1 rounded-full text-sm font-medium ${
//                                 submissionResult.status === "Accepted"
//                                   ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
//                                   : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
//                               }`}
//                             >
//                               {submissionResult.status}
//                             </span>
//                             <span className="text-sm">
//                               Runtime: {submissionResult.runtime}
//                             </span>
//                             <span className="text-sm">
//                               Passed: {submissionResult.passed}/{submissionResult.total} test cases
//                             </span>
//                           </div>
//                         )}
//                       </div>

//                       {/* Test Cases Tabs */}
//                       <div className="flex border-b border-gray-200 dark:border-gray-700">
//                         <button
//                           onClick={() => setConsoleTab("testcases")}
//                           className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
//                             consoleTab === "testcases"
//                               ? `${
//                                   darkMode
//                                     ? "text-blue-400 border-b-2 border-blue-400"
//                                     : "text-blue-600 border-b-2 border-blue-600"
//                                 }`
//                               : `${
//                                   darkMode
//                                     ? "text-gray-400 hover:text-gray-300"
//                                     : "text-gray-600 hover:text-gray-800"
//                                 }`
//                           }`}
//                         >
//                           <FaTerminal />
//                           Test Cases
//                         </button>
//                         <button
//                           onClick={() => setConsoleTab("output")}
//                           className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
//                             consoleTab === "output"
//                               ? `${
//                                   darkMode
//                                     ? "text-blue-400 border-b-2 border-blue-400"
//                                     : "text-blue-600 border-b-2 border-blue-600"
//                                 }`
//                               : `${
//                                   darkMode
//                                     ? "text-gray-400 hover:text-gray-300"
//                                     : "text-gray-600 hover:text-gray-800"
//                                 }`
//                           }`}
//                         >
//                           <FaTerminal />
//                           Output
//                         </button>
//                       </div>

//                       {/* Test Cases Content */}
//                       <div className="flex-1 overflow-y-auto">
//                         <AnimatePresence mode="wait">
//                           <motion.div
//                             key={consoleTab}
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: -10 }}
//                             transition={{ duration: 0.2 }}
//                             className="h-full"
//                           >
//                             {consoleTab === "testcases" && (
//                               <div>
//                                 {testCases.length > 0 ? (
//                                   <div className="p-4">
//                                     <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
//                                       {testCases.map((testCase, index) => (
//                                         <button
//                                           key={index}
//                                           onClick={() => setSelectedTestCase(index)}
//                                           className={`px-3 py-1 rounded-md text-sm whitespace-nowrap ${
//                                             selectedTestCase === index
//                                               ? `${
//                                                   darkMode
//                                                     ? "bg-blue-600 text-white"
//                                                     : "bg-blue-500 text-white"
//                                                 }`
//                                               : `${
//                                                   darkMode
//                                                     ? "bg-gray-700 hover:bg-gray-600"
//                                                     : "bg-gray-200 hover:bg-gray-300"
//                                                 }`
//                                           }`}
//                                         >
//                                           Case {index + 1}{" "}
//                                                                                 {testCase.passed ? (
//                                         <span className="text-green-400">✓</span>
//                                       ) : (
//                                         <span className="text-red-400">✗</span>
//                                       )}
//                                     </button>
//                                   ))}
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                                   <div>
//                                     <div className="font-medium mb-2">Input</div>
//                                     <pre
//                                       className={`p-3 rounded ${
//                                         darkMode ? "bg-gray-700" : "bg-gray-100"
//                                       }`}
//                                     >
//                                       {testCases[selectedTestCase]?.input}
//                                     </pre>
//                                   </div>
//                                   <div>
//                                     <div className="font-medium mb-2">Expected Output</div>
//                                     <pre
//                                       className={`p-3 rounded ${
//                                         darkMode ? "bg-gray-700" : "bg-gray-100"
//                                       }`}
//                                     >
//                                       {testCases[selectedTestCase]?.expectedOutput}
//                                     </pre>
//                                   </div>
//                                   <div className="md:col-span-2">
//                                     <div className="font-medium mb-2">Your Output</div>
//                                     <pre
//                                       className={`p-3 rounded ${
//                                         darkMode ? "bg-gray-700" : "bg-gray-100"
//                                       }`}
//                                     >
//                                       {testCases[selectedTestCase]?.actualOutput?.trim()}
//                                     </pre>
//                                     {testCases[selectedTestCase]?.runtime && (
//                                       <div
//                                         className={`mt-2 text-xs ${
//                                           darkMode ? "text-gray-400" : "text-gray-600"
//                                         }`}
//                                       >
//                                         Runtime: {testCases[selectedTestCase].runtime}
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                             ) : (
//                               <div className="text-center py-4 text-gray-500 dark:text-gray-400">
//                                 {isRunning ? (
//                                   <div className="flex items-center justify-center gap-2">
//                                     <span>Running test cases...</span>
//                                   </div>
//                                 ) : (
//                                   "Run your code to see test case results"
//                                 )}
//                               </div>
//                             )}
//                           </div>
//                         )}

//                         {consoleTab === "output" && (
//                           <div className="p-4">
//                             <div className="mb-4">
//                               <label className="block font-medium mb-2 text-sm">
//                                 Output
//                               </label>
//                               <pre
//                                 className={`p-3 rounded whitespace-pre-wrap text-sm ${
//                                   darkMode ? "bg-gray-700" : "bg-gray-100"
//                                 }`}
//                               >
//                                 {output ||
//                                   (isRunning
//                                     ? "Running your code..."
//                                     : "Run with custom input to see output")}
//                               </pre>
//                             </div>
//                           </div>
//                         )}
//                       </motion.div>
//                     </AnimatePresence>
//                   </div>
//                 </div>
//               )}
//             </motion.div>
//           </AnimatePresence>
//         </div>

//         {/* Results Panel */}
//         {showResultPanel && editorTab === "code" && (
//           <div
//             className={`border-t ${
//               darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
//             }`}
//             style={{ height: "40%" }}
//           >
//             <div className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-gray-700">
//               <div className="flex items-center gap-2">
//                 <span className="font-medium">Submission Result</span>
//                 {submissionResult && (
//                   <span
//                     className={`px-2 py-1 text-xs rounded-full ${
//                       submissionResult.status === "Accepted"
//                         ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
//                         : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
//                     }`}
//                   >
//                     {submissionResult.status}
//                   </span>
//                 )}
//               </div>
//               <button
//                 onClick={closeResultPanel}
//                 className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
//               >
//                 <FaTimes />
//               </button>
//             </div>
//             <div className="p-4 overflow-y-auto h-full">
//               {submissionResult && (
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-3 gap-4 text-sm">
//                     <div>
//                       <div className="text-gray-500 dark:text-gray-400">Runtime</div>
//                       <div>{submissionResult.runtime}</div>
//                     </div>
//                     <div>
//                       <div className="text-gray-500 dark:text-gray-400">Memory</div>
//                       <div>{submissionResult.memory}</div>
//                     </div>
//                     <div>
//                       <div className="text-gray-500 dark:text-gray-400">Test Cases</div>
//                       <div>
//                         {submissionResult.passed}/{submissionResult.total} passed
//                       </div>
//                     </div>
//                   </div>

//                   {testCases.length > 0 && (
//                     <div>
//                       <div className="font-medium mb-2">Test Cases</div>
//                       <div className="space-y-4">
//                         {testCases.map((testCase, index) => (
//                           <div
//                             key={index}
//                             className={`p-3 rounded ${
//                               darkMode ? "bg-gray-700" : "bg-gray-100"
//                             }`}
//                           >
//                             <div className="flex justify-between items-center mb-2">
//                               <span className="font-medium">Case {index + 1}</span>
//                               <span
//                                 className={`px-2 py-1 text-xs rounded-full ${
//                                   testCase.passed
//                                     ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
//                                     : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
//                                 }`}
//                               >
//                                 {testCase.passed ? "Passed" : "Failed"}
//                               </span>
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
//                               <div>
//                                 <div className="text-gray-500 dark:text-gray-400">
//                                   Input
//                                 </div>
//                                 <pre className="whitespace-pre-wrap">
//                                   {testCase.input}
//                                 </pre>
//                               </div>
//                               <div>
//                                 <div className="text-gray-500 dark:text-gray-400">
//                                   Expected
//                                 </div>
//                                 <pre className="whitespace-pre-wrap">
//                                   {testCase.expectedOutput}
//                                 </pre>
//                               </div>
//                               <div>
//                                 <div className="text-gray-500 dark:text-gray-400">
//                                   Output
//                                 </div>
//                                 <pre className="whitespace-pre-wrap">
//                                   {testCase.actualOutput?.trim()}
//                                 </pre>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </SplitPane>

//     {/* Fullscreen Editor */}
//     {isFullScreen && (
//       <div
//         className={`fixed inset-0 z-50 flex flex-col ${
//           darkMode ? "bg-gray-900" : "bg-gray-50"
//         }`}
//       >
//         <div
//           className={`flex justify-between items-center p-3 ${
//             darkMode ? "bg-gray-800" : "bg-white"
//           } border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
//         >
//           <div className="flex items-center gap-2 font-medium">
//             <FaCode className="text-blue-500" />
//             <span>Fullscreen Editor - {problem?.title}</span>
//             <span
//               className={`px-2 py-1 text-xs rounded-full ${
//                 darkMode ? "bg-gray-700" : "bg-gray-100"
//               }`}
//             >
//               {language.toUpperCase()}
//             </span>
//           </div>
//           <button
//             onClick={toggleFullScreen}
//             className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
//           >
//             <FaCompress />
//           </button>
//         </div>
//         <div className="flex-1 overflow-hidden">
//           <Editor
//             height="100%"
//             language={language}
//             theme={editorTheme}
//             value={code}
//             onChange={handleCodeChange}
//             options={{
//               fontSize: fontSize,
//               minimap: { enabled: true },
//               scrollBeyondLastLine: true,
//               automaticLayout: true,
//               wordWrap: "on",
//               renderWhitespace: "all",
//               padding: { top: 20 },
//               lineNumbersMinChars: 3,
//             }}
//           />
//         </div>
//         <div
//           className={`p-3 ${
//             darkMode ? "bg-gray-800" : "bg-gray-100"
//           } border-t ${
//             darkMode ? "border-gray-700" : "border-gray-200"
//           } flex justify-between items-center`}
//         >
//           <div className="text-sm text-gray-600 dark:text-gray-400">
//             {problem?.title} - {problem?.difficulty}
//           </div>
//           <button
//             onClick={toggleFullScreen}
//             className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
//           >
//             Exit Fullscreen
//           </button>
//         </div>
//       </div>
//     )}
//   </div>
// </div>
// )};


// export default ProblemPage;



import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FaChevronLeft,
  FaPlay,
  FaCheck,
  FaCode,
  FaFileAlt,
  FaTerminal,
  FaLightbulb,
  FaHistory,
  FaExpand,
  FaCompress,
  FaCopy,
  FaShare,
  FaBookmark,
  FaThumbsUp,
  FaRegThumbsUp,
  FaBolt,
  FaClock,
  FaUser,
  FaRegBookmark,
  FaRegCopy,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { fetchProblemById } from "../../services/operations/ProblemAPI";
import { submitSolution } from "../../services/operations/SubmissionAPI";
import SplitPane from "react-split-pane";
import { toast } from "react-hot-toast";
import Editor from "@monaco-editor/react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

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
  const [Sub_type, setSub_type] = useState("run");
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [showResultPanel, setShowResultPanel] = useState(false);

  

  const editorRef = useRef(null);
  const outputRef = useRef(null);
  const token = useSelector((state) => state.auth.token);

  // Fetch problem details
  useEffect(() => {
    dispatch(fetchProblemById(problemId));

   
      setCode(getDefaultCodeTemplate(language));
    

    setLikeCount(Math.floor(Math.random() * 100));
    setIsBookmarked(Math.random() > 0.7);
    setIsLiked(Math.random() > 0.7);

    // Mock submission history (replace with actual API call)
    setSubmissionHistory([
      {
        id: "1",
        date: new Date(Date.now() - 86400000).toISOString(),
        status: "Accepted",
        runtime: "12 ms",
        language: "C++",
      },
      {
        id: "2",
        date: new Date(Date.now() - 172800000).toISOString(),
        status: "Wrong Answer",
        runtime: "8 ms",
        language: "C++",
      },
    ]);
  }, [problemId, language, dispatch]);

  // Default code templates
  const getDefaultCodeTemplate = (lang) => {
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
  const handleRun = async () => {
    if (!code.trim()) {
      toast.error("Please write some code before submitting");
      return;
    }

      setShowResultPanel(true);


    setIsRunning(true);
    setOutput("Running your code...");
    setConsoleTab("run");
    const toastId = toast.loading("Testing your solution...");

    try {
      setSub_type("run");
      const testResult = await dispatch(
        submitSolution({ problemId, language, code, token, Sub_type })
      );

      toast.dismiss(toastId);
      const result = {
        status: testResult.allTestCasesPassed ? "Accepted" : "Wrong Answer",
        runtime: testResult.runtime || "N/A",
        memory: testResult.memory || "N/A",
        passed: testResult.passedTestCases,
        total: testResult.totalTestCases,
        testCases: testResult.results,
        output: testResult.allTestCasesPassed 
          ? "✅ All test cases passed!" 
          : `❌ ${testResult.totalTestCases - testResult.passedTestCases} test case(s) failed`
      };

      setRunResult(result);
      setTestCases(result.testCases);

      if (testResult.allTestCasesPassed) {
        toast.success("All test cases passed!");
      } else {
        toast.error(`${testResult.totalTestCases - testResult.passedTestCases} test case(s) failed`);
      }
    } catch (err) {
      console.error("Testing error:", err);
      toast.dismiss(toastId);
      const errorMessage = err.message || "Testing failed. Please try again.";
      toast.error(errorMessage);
      setRunResult({
        status: "Error",
        output: `Error: ${err.message}`
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Handle code submission
  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error("Please write some code before submitting");
      return;
    }

      setShowResultPanel(true);


    setIsSubmitting(true);
    setConsoleTab("submit");
    const toastId = toast.loading("Submitting your solution...");

    try {
      setSub_type("submit");
      const submission = await dispatch(
        submitSolution({ problemId, language, code, token, Sub_type })
      );

      toast.dismiss(toastId);
      const result = {
        status: submission.allTestCasesPassed ? "Accepted" : "Wrong Answer",
        runtime: submission.runtime || "N/A",
        memory: submission.memory || "N/A",
        passed: submission.passedTestCases,
        total: submission.totalTestCases,
        testCases: submission.results || [],
        output: submission.message || "Submission successful"
      };

      setSubmitResult(result);
      setTestCases(result.testCases);
      toast.success("Solution submitted successfully!");

      // Add to submission history
      const newSubmission = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        status: submission.allTestCasesPassed ? "Accepted" : "Wrong Answer",
        runtime: submission.runtime || "N/A",
        language: language,
      };
      setSubmissionHistory([newSubmission, ...submissionHistory]);

    } catch (err) {
      console.error("Submission error:", err);
      toast.dismiss(toastId);
      const errorMessage = err.message || "Submission failed. Please try again.";
      toast.error(errorMessage);
      setSubmitResult({
        status: "Error",
        output: `Error: ${err.message}`
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
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        } flex items-center justify-center`}
      >
        Loading...
      </div>
    );
  }

  if (loading === "failed") {
    return (
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        } flex items-center justify-center`}
      >
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
              onClick={() => dispatch(fetchProblemById(problemId))}
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
                          <FaUser className="text-xs" /> {problem?.acceptance}%
                          Acceptance
                        </span>
                        <span className="flex items-center gap-1">
                          <FaBolt className="text-xs" /> {likeCount} Likes
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock className="text-xs" />{" "}
                          {problem?.timeLimit || "1s"}
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
                                    <code>{example.input}</code>
                                  </pre>
                                </div>
                                <div>
                                  <div className="text-sm opacity-75 mb-1">
                                    Output:
                                  </div>
                                  <pre className="mt-1 p-3 bg-gray-200 dark:bg-gray-600 rounded text-sm">
                                    <code>{example.output}</code>
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

            {/* Results Panel - Always visible */}
            {/* Add this state to your component */}


{/* Modified result panel section */}
{(showResultPanel || isRunning || isSubmitting) && (
  <div className={`border-t ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
      <div className="flex">
        <button
          onClick={() => setConsoleTab("run")}
          className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
            consoleTab === "run"
              ? `${darkMode ? "text-blue-400 border-b-2 border-blue-400" : "text-blue-600 border-b-2 border-blue-600"}`
              : `${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-800"}`
          }`}
        >
          <FaTerminal />
          Run Result
        </button>
        <button
          onClick={() => setConsoleTab("submit")}
          className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
            consoleTab === "submit"
              ? `${darkMode ? "text-blue-400 border-b-2 border-blue-400" : "text-blue-600 border-b-2 border-blue-600"}`
              : `${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-800"}`
          }`}
        >
          <FaTerminal />
          Submission Result
        </button>
      </div>
      <button
        onClick={() => setShowResultPanel(false)}
        className="p-2 mr-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        title="Close panel"
      >
        <FaTimes className="text-gray-500 dark:text-gray-400" />
      </button>
    </div>

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
        <div className="h-full">
          {runResult ? (
            <div className="h-full">
              {/* Test Case Details Only */}
              {runResult.testCases && runResult.testCases.length > 0 ? (
                <div className={`rounded-lg overflow-hidden h-full ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                  <div className={`p-4 border-b ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
                    <h4 className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Test Cases ({runResult.passed}/{runResult.total} passed)
                    </h4>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-600 h-[calc(100%-50px)] overflow-y-auto">
                    {runResult.testCases.map((testCase, index) => (
                      <div 
                        key={index} 
                        className={`p-4 cursor-pointer hover:${darkMode ? "bg-gray-600" : "bg-gray-100"}`}
                        onClick={() => setSelectedTestCase(index)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                              testCase.passed 
                                ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
                            }`}>
                              {testCase.passed ? (
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Test Case {index + 1}
                            </span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            darkMode ? "bg-gray-600 text-gray-300" : "bg-gray-200 text-gray-700"
                          }`}>
                            {testCase.runtime || "N/A"}
                          </span>
                        </div>

                        {/* Expanded test case details */}
                        {selectedTestCase === index && (
                          <div className="mt-3 space-y-3">
                            <div>
                              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Input</p>
                              <pre className={`p-2 rounded text-sm ${darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"}`}>
                                {JSON.stringify(testCase.input, null, 2)}
                              </pre>
                            </div>
                            <div>
                              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Expected Output</p>
                              <pre className={`p-2 rounded text-sm ${darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"}`}>
                                {JSON.stringify(testCase.expectedOutput, null, 2)}
                              </pre>
                            </div>
                            <div>
                              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Your Output</p>
                              <pre className={`p-2 rounded text-sm ${
                                testCase.passed 
                                  ? darkMode ? "bg-green-900/30 text-green-200" : "bg-green-100 text-green-800"
                                  : darkMode ? "bg-red-900/30 text-red-200" : "bg-red-100 text-red-800"
                              }`}>
                                {JSON.stringify(testCase.actualOutput, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={`rounded-lg p-8 text-center h-full flex flex-col items-center justify-center ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                    <FaPlay className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className={`mt-3 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-900"}`}>
                    No test cases available
                  </h3>
                </div>
              )}
            </div>
          ) : (
            <div className={`rounded-lg p-8 text-center h-full flex flex-col items-center justify-center ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                <FaPlay className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className={`mt-3 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-900"}`}>
                {isRunning ? "Running your code..." : "No run results yet"}
              </h3>
              <p className={`mt-1 text-sm ${darkMode ? "text-gray-500" : "text-gray-600"}`}>
                {isRunning ? "Please wait while we run your code" : "Run your code to see results"}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="h-full">
          {submitResult ? (
            <div className="space-y-4 h-full">
              {/* Submission Result Card */}
              <div className={`rounded-lg p-4 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      submitResult.status === "Accepted" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                        : submitResult.status === "Error"
                        ? "bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
                    }`}>
                      {submitResult.status === "Accepted" ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : submitResult.status === "Error" ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                        {submitResult.status}
                      </h3>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {submitResult.output}
                      </p>
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    darkMode ? "bg-gray-600 text-gray-300" : "bg-gray-200 text-gray-700"
                  }`}>
                    {submitResult.language || language}
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className={`rounded-lg p-4 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                <h4 className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Performance Metrics
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Runtime
                    </p>
                    <p className={`text-lg font-semibold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                      {submitResult.runtime || "N/A"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Memory
                    </p>
                    <p className={`text-lg font-semibold ${darkMode ? "text-purple-400" : "text-purple-600"}`}>
                      {submitResult.memory || "N/A"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Test Cases
                    </p>
                    <p className={`text-lg font-semibold ${
                      submitResult.passed === submitResult.total 
                        ? darkMode ? "text-green-400" : "text-green-600"
                        : darkMode ? "text-red-400" : "text-red-600"
                    }`}>
                      {submitResult.passed}/{submitResult.total}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`rounded-lg p-8 text-center h-full flex flex-col items-center justify-center ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                <FaCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className={`mt-3 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-900"}`}>
                {isSubmitting ? "Submitting your solution..." : "No submission yet"}
              </h3>
              <p className={`mt-1 text-sm ${darkMode ? "text-gray-500" : "text-gray-600"}`}>
                {isSubmitting ? "Please wait while we evaluate your code" : "Submit your code to see results"}
              </p>
            </div>
          )}
        </div>
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