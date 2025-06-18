import React, { useState } from 'react';
import { FaTimes, FaSave, FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import { updateProblem } from '../../../services/operations/ProblemAPI';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const ProblemFormModal = ({ 
  problem = null, 
  onClose, 
  darkMode, 
  onSave,
  isLoading 
}) => {
  // console.log("Problem On Modal", problem)
  const [formData, setFormData] = useState({
    title: problem?.title || '',
    description: problem?.description || '',
    inputFormat: problem?.inputFormat || '',
    outputFormat: problem?.outputFormat || '',
    difficulty: problem?.difficulty || 'medium',
    tags: problem?.tags || [],
    samples: problem?.samples?.length ? [...problem.samples] : [{ input: '', output: '', explanation: '' }],
    constraints: problem?.constraints || '',
    isPublished: problem?.isPublished || false
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const tagOptions = [
    { value: 'Array', label: 'Array' },
    { value: 'Backtracking', label: 'Backtracking' },
    { value: 'bfs', label: 'BFS' },
    { value: 'binary search', label: 'Binary Search' },
    { value: 'dfs', label: 'DFS' },
    { value: 'Dynamic Programming', label: 'Dynamic Programming' },
    { value: 'Greedy', label: 'Greedy' },
    { value: 'Graph', label: 'Graph' },
    { value: 'Hash Table', label: 'Hash Table' },
    { value: 'Math', label: 'Math' },
    { value: 'recursion', label: 'Recursion' },
    { value: 'sliding window', label: 'Sliding Window' },
    { value: 'sorting', label: 'Sorting' },
    { value: 'String', label: 'String' },
    { value: 'Tree', label: 'Tree' },
    { value: 'trie', label: 'Trie' },
    { value: 'two pointers', label: 'Two Pointers' },
    { value: 'union find', label: 'Union Find' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTagChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      tags: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
  };

  const handleSampleChange = (index, field, value) => {
    setFormData(prev => {
      const newSamples = [...prev.samples];
      newSamples[index] = {
        ...newSamples[index],
        [field]: value
      };
      return {
        ...prev,
        samples: newSamples
      };
    });
  };

  const addNewSample = () => {
    setFormData(prev => ({
      ...prev,
      samples: [...prev.samples, { input: '', output: '', explanation: '' }]
    }));
  };

  const removeSample = (index) => {
    setFormData(prev => ({
      ...prev,
      samples: prev.samples.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.inputFormat.trim()) newErrors.inputFormat = 'Input format is required';
    if (!formData.outputFormat.trim()) newErrors.outputFormat = 'Output format is required';
    if (formData.tags.length === 0) newErrors.tags = 'At least one tag is required';
    
    const sampleErrors = [];
    formData.samples.forEach((sample, index) => {
      if (!sample.input.trim() || !sample.output.trim()) {
        sampleErrors.push(`Sample ${index + 1}`);
      }
    });
    if (sampleErrors.length > 0) newErrors.samples = sampleErrors;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const token = useSelector((state) => state.auth.token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const result = await dispatch(updateProblem(problem.id, formData, token));
      
      if (result?.error) {
        return;
      }
      
      toast.success("Problem updated successfully!");
      onSave && onSave(result); // Call the onSave callback if provided
    } catch (err) {
      // console.error("Update failed:", err);
      toast.error(err.message || "Problem update failed");
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: darkMode ? '#374151' : 'white',
      borderColor: errors.tags ? '#EF4444' : (darkMode ? '#4B5563' : '#D1D5DB'),
      color: darkMode ? 'white' : 'black',
      minHeight: '48px',
      boxShadow: state.isFocused ? (darkMode ? '0 0 0 1px #F59E0B' : '0 0 0 1px #F59E0B') : 'none',
      '&:hover': {
        borderColor: errors.tags ? '#EF4444' : (darkMode ? '#6B7280' : '#9CA3AF')
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? (darkMode ? '#F59E0B' : '#F59E0B')
        : state.isFocused 
        ? (darkMode ? '#4B5563' : '#F3F4F6')
        : (darkMode ? '#374151' : 'white'),
      color: state.isSelected 
        ? 'white' 
        : (darkMode ? 'white' : 'black'),
      '&:active': {
        backgroundColor: darkMode ? '#F59E0B' : '#F59E0B'
      }
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: darkMode ? '#F59E0B' : '#F59E0B',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'white',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'white',
      ':hover': {
        backgroundColor: darkMode ? '#D97706' : '#D97706',
        color: 'white',
      },
    }),
    input: (provided) => ({
      ...provided,
      color: darkMode ? 'white' : 'black',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: darkMode ? '#374151' : 'white',
      borderColor: darkMode ? '#4B5563' : '#D1D5DB',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: darkMode ? '#9CA3AF' : '#6B7280',
    }),
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm ${darkMode ? 'bg-black/30' : 'bg-gray-900/20'}`}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className={`relative w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}
        >
          {/* Header */}
          <div className={`flex justify-between items-center p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className="text-xl font-bold">
              {problem ? 'Edit Problem' : 'Create New Problem'}
            </h2>
            <button 
              onClick={onClose}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <FaTimes />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Problem Title<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="e.g. Two Sum"
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description<span className="text-red-500">*</span></label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={8}
                  className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} ${errors.description ? 'border-red-500' : ''}`}
                  placeholder="Describe the problem in detail..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Input Format<span className="text-red-500">*</span></label>
                  <textarea
                    name="inputFormat"
                    value={formData.inputFormat}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} ${errors.inputFormat ? 'border-red-500' : ''}`}
                    placeholder="Describe the input format (e.g. The first line contains an integer n...)"
                  />
                  {errors.inputFormat && <p className="mt-1 text-sm text-red-500">{errors.inputFormat}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Output Format<span className="text-red-500">*</span></label>
                  <textarea
                    name="outputFormat"
                    value={formData.outputFormat}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} ${errors.outputFormat ? 'border-red-500' : ''}`}
                    placeholder="Describe the output format (e.g. Print a single integer representing...)"
                  />
                  {errors.outputFormat && <p className="mt-1 text-sm text-red-500">{errors.outputFormat}</p>}
                </div>
              </div>

              <div className="space-y-4">
                {formData.samples.map((sample, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-lg p-4 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">Sample {index + 1}</h3>
                      {formData.samples.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSample(index)}
                          className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                        >
                          <FaTrash className="text-red-500" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Input<span className="text-red-500">*</span></label>
                        <textarea
                          value={sample.input}
                          onChange={(e) => handleSampleChange(index, 'input', e.target.value)}
                          rows={4}
                          className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} ${errors.samples?.includes(`Sample ${index + 1}`) ? 'border-red-500' : ''}`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Output<span className="text-red-500">*</span></label>
                        <textarea
                          value={sample.output}
                          onChange={(e) => handleSampleChange(index, 'output', e.target.value)}
                          rows={4}
                          className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} ${errors.samples?.includes(`Sample ${index + 1}`) ? 'border-red-500' : ''}`}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">Explanation (Optional)</label>
                      <textarea
                        value={sample.explanation}
                        onChange={(e) => handleSampleChange(index, 'explanation', e.target.value)}
                        rows={3}
                        className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        placeholder="Explain how the input produces this output..."
                      />
                    </div>
                  </div>
                ))}
                {errors.samples && !errors.samples.includes('Sample') && (
                  <p className="text-sm text-red-500">{errors.samples}</p>
                )}
                <button
                  type="button"
                  onClick={addNewSample}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  <FaPlus /> Add Sample
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Constraints<span className="text-red-500">*</span></label>
                <textarea
                  name="constraints"
                  value={formData.constraints}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  placeholder="List any constraints (e.g. 1 <= nums.length <= 10^4)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty<span className="text-red-500">*</span></label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  >
                    <option value="easy">easy</option>
                    <option value="medium">medium</option>
                    <option value="hard">hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags <span className="text-red-500">*</span></label>
                  <Select
                    isMulti
                    name="tags"
                    options={tagOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    styles={customStyles}
                    value={formData.tags.map(tag => ({ value: tag, label: tag }))}
                    onChange={handleTagChange}
                    placeholder="Select tags..."
                  />
                  {errors.tags && <p className="mt-1 text-sm text-red-500">{errors.tags}</p>}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  id="publish-checkbox"
                  className="mr-2"
                />
                <label htmlFor="publish-checkbox" className="text-sm font-medium">
                  Publish this problem
                </label>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-end gap-4`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              <FaArrowLeft /> Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-400'} text-white disabled:opacity-50`}
            >
              <FaSave /> {isLoading ? 'Saving...' : 'Save Problem'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProblemFormModal;