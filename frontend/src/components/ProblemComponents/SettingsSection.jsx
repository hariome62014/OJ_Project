import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';

const SettingsSection = ({ formData, setFormData, errors, darkMode }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Time Limit (seconds) *</label>
          <input
            type="number"
            name="timeLimit"
            min="0.1"
            max="10"
            step="0.1"
            value={formData.timeLimit}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} ${errors.timeLimit ? 'border-red-500' : ''}`}
          />
          {errors.timeLimit && <p className="mt-1 text-sm text-red-500">{errors.timeLimit}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Memory Limit (MB) *</label>
          <input
            type="number"
            name="memoryLimit"
            min="1"
            max="512"
            value={formData.memoryLimit}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} ${errors.memoryLimit ? 'border-red-500' : ''}`}
          />
          {errors.memoryLimit && <p className="mt-1 text-sm text-red-500">{errors.memoryLimit}</p>}
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPublished"
          name="isPublished"
          checked={formData.isPublished}
          onChange={handleChange}
          className="h-4 w-4 rounded"
        />
        <label htmlFor="isPublished" className="ml-2 flex items-center gap-1">
          Publish Problem
        </label>
      </div>

      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <div className="flex items-start gap-3">
          <FaQuestionCircle className={`mt-1 flex-shrink-0 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
          <div>
            <h4 className="font-medium mb-1">Problem Visibility</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Published problems will be visible to users according to their access level.
              Unpublished problems are only visible to admins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;