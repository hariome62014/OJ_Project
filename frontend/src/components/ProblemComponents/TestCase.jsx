import React, { useState, useRef } from 'react';
import { FaUpload, FaPlus, FaTrash, FaInfoCircle, FaTimes } from 'react-icons/fa';

const TestCaseSection = ({ darkMode, formData, setFormData, errors }) => {
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validate file type
  if (!file.name.endsWith('.zip')) {
    toast.error('Only .zip files are allowed');
    return;
  }

  // Validate file size (10MB)
  if (file.size > 10 * 1024 * 1024) {
    toast.error('File size too large (max 10MB)');
    return;
  }

  setUploadedFileName(file.name);
  setFormData({
    ...formData,
    testCaseFile: file
  });
  
  // Simulate or use real upload progress
  setUploadProgress(0);
  const interval = setInterval(() => {
    setUploadProgress(prev => {
      if (prev >= 100) {
        clearInterval(interval);
        return 100;
      }
      return prev + 10;
    });
  }, 200);
};

  const removeUploadedFile = () => {
    setFormData({
      ...formData,
      testCaseFile: null
    });
    setUploadedFileName('');
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) {
      handleFileUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addManualTestCase = () => {
   
    setFormData({
      ...formData,
      testCases: [...formData.testCases, { input: '', expectedOutput: '' }]
    });
  };

  const removeTestCase = (index) => {
    const newTestCases = formData.testCases.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      testCases: newTestCases
    });
  };

  const updateTestCase = (index, field, value) => {
    const newTestCases = [...formData.testCases];
    newTestCases[index][field] = value;
    setFormData({ ...formData, testCases: newTestCases });
  };

  return (
    <div className="space-y-6">

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium flex items-center gap-2">
            Test Cases <span className="text-red-500">*</span>
            {errors.testCases && (
              <span className="text-sm text-red-500">{errors.testCases}</span>
            )}
          </h3>
        </div>

        {!formData.testCaseFile && (
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging ? 'border-yellow-400 bg-yellow-400/10' : darkMode ? 'border-gray-600' : 'border-gray-300'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className={`p-4 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <FaUpload className={`text-2xl ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
              </div>
              <h4 className="text-lg font-medium">
                {isDragging ? 'Drop your test cases here' : 'Upload Test Cases ZIP'}
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Drag & drop a ZIP file containing input/expectedOutput files, or click to browse
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".zip"
                className="hidden"
              />
            </div>
          </div>
        )}

        {formData.testCaseFile && (
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="font-medium truncate max-w-xs md:max-w-md">
                  {uploadedFileName}
                </span>
                {uploadProgress === 100 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Upload Complete
                  </span>
                )}
              </div>
              <button
                onClick={removeUploadedFile}
                className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
              >
                <FaTimes className="text-red-500" />
              </button>
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="pt-2">
                <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm mt-1">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Manual Test Cases Section */}
      
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">
              {formData.testCases.length} Test Case{formData.testCases.length !== 1 ? 's' : ''}
            </h4>
            <button
              type="button"
              onClick={addManualTestCase}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              <FaPlus /> Add Test Case
            </button>
          </div>

          {formData.testCases.map((testCase, index) => (
            <div 
              key={index} 
              className={`p-5 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                    Case #{index + 1}
                  </span>
                  {(!testCase.input || !testCase.expectedOutput) && (
                    <span className="text-xs text-red-500 flex items-center gap-1">
                      <FaInfoCircle /> Incomplete
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeTestCase(index)}
                  className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                >
                  <FaTrash className="text-red-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center">
                    Input <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    value={testCase.input}
                    onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} font-mono text-sm`}
                    placeholder="Test case input"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center">
                    Expected Output <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    value={testCase.expectedOutput}
                    onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} font-mono text-sm`}
                    placeholder="Expected output"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      
    </div>
  );
};

export default TestCaseSection;