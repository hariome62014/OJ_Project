import React from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import TestCaseSection from './TestCase';

const SamplesSection = ({ formData, setFormData, errors, darkMode }) => {
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
      {formData.samples.map((sample, index) => (
        <div key={index} className="border rounded-lg p-4">
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
  );
};

export default SamplesSection;