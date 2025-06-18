import React, { useState, useRef, useEffect } from 'react';
import { FaUpload, FaPlus, FaTrash, FaInfoCircle, FaTimes, FaEdit } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { addManualTestCase, uploadTestCaseZip, deleteAllTestCases } from '../../../services/operations/TestCaseAPI';
import { useDispatch, useSelector } from 'react-redux';
import { ConfirmationModal } from './ConfirmationModal';

const TestCaseModal = ({ 
  isOpen,
  onClose,
  problemId,
  formData = { testCases: [], testCaseFile: null },
  previousTestCases = [],
  darkMode = false
}) => {
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [localFormData, setLocalFormData] = useState(formData);
  const [editingIndex, setEditingIndex] = useState(null);
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [testCaseToRemove, setTestCaseToRemove] = useState(null);

  // Sync local state when formData prop changes
  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleFileChange = (file) => {
    if (!file) return;
    
    if (!file.name.endsWith('.zip')) {
      toast.error('Only .zip files are allowed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size too large (max 10MB)');
      return;
    }

    setUploadedFileName(file.name);
    setLocalFormData(prev => ({ ...prev, testCaseFile: file }));
    
    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => prev >= 100 ? (clearInterval(interval), 100) : prev + 10);
    }, 200);
  };

  const handleFileUpload = (e) => handleFileChange(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) handleFileChange(e.dataTransfer.files[0]);
  };

  const resetFileUpload = () => {
    setLocalFormData(prev => ({ ...prev, testCaseFile: null }));
    setUploadedFileName('');
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

 const handleTestCase = {
  add: () => {
    setLocalFormData(prev => ({
      ...prev,
      testCases: [...prev.testCases, { input: '', expectedOutput: '' }]
    }));
    setEditingIndex(localFormData.testCases.length);
  },
  remove: (index) => {
      setTestCaseToRemove(index);
      setShowConfirmModal(true);
    },
    confirmRemove: () => {
      setLocalFormData(prev => ({
        ...prev,
        testCases: prev.testCases.filter((_, i) => i !== testCaseToRemove)
      }));
      if (editingIndex === testCaseToRemove) setEditingIndex(null);
      else if (editingIndex > testCaseToRemove) setEditingIndex(editingIndex - 1);
      setShowConfirmModal(false);
      setTestCaseToRemove(null);
    },
    cancelRemove: () => {
      setShowConfirmModal(false);
      setTestCaseToRemove(null);
    },
  update: (index, field, value) => {
    setLocalFormData(prev => ({
      ...prev,
      testCases: prev.testCases.map((testCase, i) => 
        i === index ? { ...testCase, [field]: value } : testCase
      )
    }));
  },
  import: (testCase) => {
    setLocalFormData(prev => ({
      ...prev,
      testCases: [...prev.testCases, { ...testCase }]
    }));
    setEditingIndex(localFormData.testCases.length);
  },

   removeAll: () => {
    setTestCaseToRemove('all');
    setShowConfirmModal(true);
  },
  confirmRemoveAll: () => {
    setLocalFormData(prev => ({ ...prev, testCases: [] }));
    setEditingIndex(null);
    setShowConfirmModal(false);
    setTestCaseToRemove(null);
  },
};

  const handleSave = async () => {
    try {
      // First delete all existing test cases
      await dispatch(deleteAllTestCases(problemId, token));
      
      // Then add new manual test cases if any exist
      if (localFormData.testCases.length > 0) {
        await dispatch(addManualTestCase(problemId, localFormData.testCases, token));
      }
      
      // Finally upload zip file if one was selected
      if (localFormData.testCaseFile) {
        await dispatch(uploadTestCaseZip(problemId, localFormData.testCaseFile, token));
      }
      
      onClose();
    } catch (error) {
      // console.error("Error saving test cases:", error);
      toast.error("Failed to save test cases");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 500 }}
          className={`relative z-50 w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          {/* Modal Header */}
          <div className={`p-6 border-b ${
            darkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className={`p-2 rounded-lg ${
                  darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
                }`}>
                  <FaUpload />
                </span>
                Test Case Management
              </h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-full ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="overflow-y-auto p-6 space-y-6">
            {/* Manual Test Cases Section */}
            <div className="space-y-4">
           <div className="flex justify-between items-center">
  <h4 className="font-medium">
    {localFormData.testCases.length} Manual Test Case{localFormData.testCases.length !== 1 ? 's' : ''}
  </h4>
  <div className="flex gap-2">
    {localFormData.testCases.length > 0 && (
      <motion.button
        onClick={handleTestCase.removeAll}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          darkMode ? 'bg-red-900/30 hover:bg-red-900/40 text-red-400' : 'bg-red-100 hover:bg-red-200 text-red-600'
        }`}
      >
        <FaTrash /> Delete All
      </motion.button>
    )}
    <motion.button
      onClick={handleTestCase.add}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
        darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
      }`}
    >
      <FaPlus /> Add Test Case
    </motion.button>
  </div>
</div>

              {localFormData.testCases.map((testCase, index) => (
                <TestCaseItem
                  key={index}
                  index={index}
                  testCase={testCase}
                  darkMode={darkMode}
                  editingIndex={editingIndex}
                  setEditingIndex={setEditingIndex}
                  onUpdate={handleTestCase.update}
                  onRemove={handleTestCase.remove}
                />
              ))}

            </div>

            {/* File Upload Section */}
            <FileUploadSection
              darkMode={darkMode}
              isDragging={isDragging}
              uploadProgress={uploadProgress}
              uploadedFileName={uploadedFileName}
              testCaseFile={localFormData.testCaseFile}
              fileInputRef={fileInputRef}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onFileChange={handleFileUpload}
              onRemoveFile={resetFileUpload}
            />
          </div>

          {/* Modal Footer */}
          <div className={`p-4 border-t ${
            darkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
          } flex justify-end gap-3`}>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`px-5 py-2.5 rounded-lg font-medium ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={handleSave}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`px-5 py-2.5 rounded-lg font-medium text-white ${
                darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              }`}
              disabled={localFormData.testCases.length === 0 && !localFormData.testCaseFile}
            >
              Save Test Cases
            </motion.button>
          </div>
        </motion.div>
      </div>
     <ConfirmationModal
  isOpen={showConfirmModal}
  onConfirm={testCaseToRemove === 'all' ? handleTestCase.confirmRemoveAll : handleTestCase.confirmRemove}
  onCancel={handleTestCase.cancelRemove}
  message={
    testCaseToRemove === 'all' 
      ? "Are you sure you want to delete ALL test cases? This action cannot be undone."
      : "Are you sure you want to delete this test case? This action cannot be undone."
  }
  darkMode={darkMode}
  actionToBeTaken="Delete"
/>
    </AnimatePresence>
  );
};

// Sub-components for better organization
const TestCaseItem = ({ index, testCase, darkMode, editingIndex, setEditingIndex, onUpdate, onRemove }) => {
  const isEditing = editingIndex === index;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-5 rounded-xl ${
        darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
      } border ${
        darkMode ? 'border-gray-600' : 'border-gray-300'
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            darkMode ? 'bg-gray-600' : 'bg-gray-200'
          }`}>
            Case #{index + 1}
          </span>
          {(!testCase.input || !testCase.expectedOutput) && (
            <span className="text-xs text-red-500 flex items-center gap-1">
              <FaInfoCircle /> Incomplete
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <ActionButton
                icon={<FaTimes className="text-gray-500" />}
                onClick={() => setEditingIndex(null)}
                darkMode={darkMode}
              />
              <ActionButton
                icon={<FaEdit className="text-white" />}
                onClick={() => setEditingIndex(null)}
                darkMode={darkMode}
                primary
              />
            </>
          ) : (
            <>
              <ActionButton
                icon={<FaEdit className="text-blue-500" />}
                onClick={() => setEditingIndex(index)}
                darkMode={darkMode}
              />
              <ActionButton
                icon={<FaTrash className="text-red-500" />}
                onClick={() => onRemove(index)}
                darkMode={darkMode}
              />
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <TestCaseField
          label="Input"
          value={testCase.input}
          isEditing={isEditing}
          onChange={(value) => onUpdate(index, 'input', value)}
          darkMode={darkMode}
        />
        <TestCaseField
          label="Expected Output"
          value={testCase.expectedOutput}
          isEditing={isEditing}
          onChange={(value) => onUpdate(index, 'expectedOutput', value)}
          darkMode={darkMode}
        />
      </div>
    </motion.div>
  );
};

const TestCaseField = ({ label, value, isEditing, onChange, darkMode }) => (
  <div>
    <label className="text-sm font-medium mb-2 flex items-center">
      {label} <span className="text-red-500 ml-1">*</span>
    </label>
    {isEditing ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className={`w-full px-4 py-3 rounded-lg border ${
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
        } font-mono text-sm`}
        placeholder={`${label}...`}
      />
    ) : (
      <div className={`p-3 rounded-lg border ${
        darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
      } font-mono text-sm max-h-32 overflow-y-auto`}>
        {value || <span className="text-gray-500">Empty</span>}
      </div>
    )}
  </div>
);

const ActionButton = ({ icon, onClick, darkMode, primary = false }) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className={`p-2 rounded-full ${
      primary 
        ? darkMode 
          ? 'bg-blue-600 hover:bg-blue-700' 
          : 'bg-blue-500 hover:bg-blue-600'
        : darkMode 
          ? 'hover:bg-gray-600' 
          : 'hover:bg-gray-200'
    }`}
  >
    {icon}
  </motion.button>
);

const FileUploadSection = ({
  darkMode,
  isDragging,
  uploadProgress,
  uploadedFileName,
  testCaseFile,
  fileInputRef,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
  onRemoveFile
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-medium flex items-center gap-2">
        New Test Cases <span className="text-red-500">*</span>
      </h3>
    </div>

    {!testCaseFile ? (
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging ? 'border-yellow-400 bg-yellow-400/10' : 
          darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <motion.div 
            animate={{ scale: isDragging ? 1.1 : 1 }}
            className={`p-4 rounded-full ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}
          >
            <FaUpload className={`text-2xl ${
              darkMode ? 'text-yellow-400' : 'text-yellow-500'
            }`} />
          </motion.div>
          <h4 className="text-lg font-medium">
            {isDragging ? 'Drop your test cases here' : 'Upload Test Cases ZIP'}
          </h4>
          <p className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Drag & drop a ZIP file containing input/expectedOutput files, or click to browse
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            accept=".zip"
            className="hidden"
          />
        </div>
      </motion.div>
    ) : (
      <UploadedFilePreview
        darkMode={darkMode}
        fileName={uploadedFileName}
        progress={uploadProgress}
        onRemove={onRemoveFile}
      />
    )}
  </div>
);

const UploadedFilePreview = ({ darkMode, fileName, progress, onRemove }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-4 rounded-xl ${
      darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
    } border ${
      darkMode ? 'border-gray-600' : 'border-gray-300'
    }`}
  >
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <span className="font-medium truncate max-w-xs md:max-w-md">
          {fileName}
        </span>
        {progress === 100 && (
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Upload Complete
          </span>
        )}
      </div>
      <button
        onClick={onRemove}
        className={`p-2 rounded-full ${
          darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
        }`}
      >
        <FaTimes className="text-red-500" />
      </button>
    </div>
    {progress > 0 && progress < 100 && (
      <div className="pt-2">
        <div className={`h-2 rounded-full ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-right text-sm mt-1">
          Uploading... {progress}%
        </p>
      </div>
    )}
  </motion.div>
);

export default TestCaseModal;