import React from 'react';
import Select from 'react-select';
import { FaPlus, FaTimes } from 'react-icons/fa';

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

const DescriptionSection = ({ formData, setFormData, errors, darkMode }) => {
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

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: darkMode ? '#374151' : 'white',
      borderColor: darkMode ? '#4B5563' : '#D1D5DB',
      color: darkMode ? 'white' : 'black',
      minHeight: '48px',
      boxShadow: state.isFocused ? (darkMode ? '0 0 0 1px #F59E0B' : '0 0 0 1px #F59E0B') : 'none',
      '&:hover': {
        borderColor: darkMode ? '#6B7280' : '#9CA3AF'
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

  const handleSampleChange = (index, field, value) => {
    const newSamples = [...formData.samples];
    newSamples[index][field] = value;
    setFormData(prev => ({
      ...prev,
      samples: newSamples
    }));
  };

  const addNewSample = () => {
    setFormData({
      ...formData,
      samples: [...formData.samples, { input: '', output: '', explanation: '' }]
    });
  };

  const removeSample = (index) => {
    const newSamples = [...formData.samples];
    newSamples.splice(index, 1);
    setFormData({...formData, samples: newSamples});
  };

  return (
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

      {/* Input and Output Format Fields - Side by Side */}
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

      <div className='space-y-6'>
        {formData.samples.map((sample, index) => (
          <div key={index} className={`border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} rounded-lg p-4`}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Sample {index + 1}</h3>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeSample(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTimes />
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
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
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
    </div>
  );
};

export default DescriptionSection;