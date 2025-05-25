import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaPlus, FaCheck, FaTimes, FaArrowLeft, FaQuestionCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { createProblem } from '../../../services/operations/ProblemAPI';
import DescriptionSection from './DescriptionSection';
import SamplesSection from './SampleSection';
import SettingsSection from './SettingsSection';
import { addManualTestCase, uploadTestCaseZip } from '../../../services/operations/TestCaseAPI';
import TestCaseSection from './TestCase'
import toast from 'react-hot-toast';

const CreateProblemPage = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'medium',
    tags: [],
    constraints: '',
    samples: [{ input: '', output: '', explanation: '' }],
    testCases: [],
    testCaseFile: null,
    timeLimit: 1,
    memoryLimit: 256,
    isPublished: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const validate = () => {
    setErrors({});
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } 

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }

    if (!formData.constraints.trim()) {
      newErrors.constraints = 'Constraints are required';
    }

    if (formData.samples.length === 0) {
      newErrors.samples = 'At least one sample is required';
    } else {
      formData.samples.forEach((sample, index) => {
        if (!sample.input.trim() || !sample.output.trim()) {
          newErrors.samples = `Sample ${index + 1} must have both input and output`;
        }
      });
    }

    if (formData.testCases.length === 0 && !formData.testCaseFile) {
      newErrors.testCases = 'Either add test cases or upload a test case file';
    } else if (formData.testCases.length > 0) {
      formData.testCases.forEach((testCase, index) => {
        if (!testCase.input || !testCase.expectedOutput) {
          newErrors.testCases = `Test Case ${index + 1} must have both input and output`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProblemCreation = async () => {
    try {
      const problemData = {
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        tags: formData.tags.map(tag => tag.trim().toLowerCase()),
        constraints: formData.constraints,
        samples: formData.samples,
        timeLimit: formData.timeLimit,
        memoryLimit: formData.memoryLimit,
        isPublished: formData.isPublished
      };

      const result = await dispatch(createProblem(problemData, token));
      if (!result || result.error) {
        throw new Error(result?.message || 'Problem creation failed');
      }

      const problemId = result.id;
      let testCasesAdded = false;
      let lastError = null;

      // Try manual test cases first
      if (formData.testCases.length > 0) {
        try {
          const addedTestCase = await dispatch(addManualTestCase(problemId, formData.testCases, token));
          if (addedTestCase && !addedTestCase.error) {
            testCasesAdded = true;
            toast.success("Manual test cases added successfully");
          } else {
            lastError = addedTestCase?.message || 'Manual test case addition failed';
          }
        } catch (error) {
          lastError = error.message;
          console.error("Manual test case addition failed:", error);
        }
      }

      // Fallback to file upload if manual fails
      if (!testCasesAdded && formData.testCaseFile) {
        try {
          const addedTestCaseByUpload = await dispatch(uploadTestCaseZip(problemId, formData.testCaseFile, token));
          if (addedTestCaseByUpload && !addedTestCaseByUpload.error) {
            testCasesAdded = true;
            toast.success("Test cases uploaded via file successfully");
          } else {
            lastError = addedTestCaseByUpload?.message || 'Test case file upload failed';
          }
        } catch (error) {
          lastError = error.message;
          console.error("Test case file upload failed:", error);
        }
      }

      if (!testCasesAdded && lastError) {
        toast("Problem created but test cases couldn't be added. You can add them later.");
      }

      return result;
    } catch (error) {
      console.error("Problem creation failed:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await handleProblemCreation();
      toast.success('Problem created successfully!');
      // navigate('/admin/problems');
    } catch (error) {
      toast.error(error.message || "Failed to create problem");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} mt-16`}>
      <div className={`py-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              <FaArrowLeft /> Back
            </button>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 ml-12">
              <FaPlus className="text-yellow-500" /> Create New Problem
            </h1>
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-xl overflow-hidden shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            {['description', 'Testcase', 'settings'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium capitalize ${activeTab === tab ? 
                  (darkMode ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-yellow-600 border-b-2 border-yellow-500') : 
                  (darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800')}`}
              >
                {tab.replace(/([A-Z])/g, ' $1')}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {activeTab === 'description' && (
              <DescriptionSection 
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                darkMode={darkMode}
              />
            )}

            {activeTab === 'Testcase' && (
             
             
               <div className="mt-8">
        <TestCaseSection 
          darkMode={darkMode} 
          formData={formData} 
          setFormData={setFormData} 
          errors={errors} 
        />
      </div>
      
            )}

            {activeTab === 'settings' && (
              <SettingsSection 
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                darkMode={darkMode}
              />
            )}

            <div className="mt-8 flex justify-between">
              {activeTab !== 'description' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'Testcase') setActiveTab('description');
                    else setActiveTab('Testcase');
                  }}
                  className={`px-6 py-3 rounded-lg font-medium ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Back to {activeTab === 'Testcase' ? 'Description' : 'Testcase'}
                </button>
              )}

              <div className="flex gap-4">
                {activeTab !== 'settings' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === 'description') setActiveTab('Testcase');
                      else setActiveTab('settings');
                    }}
                    className={`px-6 py-3 rounded-lg font-medium ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    Next: {activeTab === 'description' ? 'Testcase' : 'Settings'}
                  </button>
                )}

                {activeTab === 'settings' && (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-3 rounded-lg font-medium text-white ${darkMode ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-yellow-500 hover:bg-yellow-400'} flex items-center gap-2`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        <FaCheck /> Create Problem
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateProblemPage;