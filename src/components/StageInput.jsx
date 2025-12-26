'use client';

/**
 * StageInput Component
 * Dynamic table for adding/editing/removing production stages
 */

import { useState, useEffect } from 'react';

export default function StageInput({ stages, onChange }) {
  const addStage = () => {
    const newStage = {
      id: Date.now(), // Add unique ID for each stage
      name: `Stage-${stages.length + 1}`,
      inputPerBatch: 100,
      outputPerBatch: 100,
      frequency: 24,
      duration: 8,
      analysisDuration: 24,
      packTime: 0,
    };
    console.log('Adding new stage:', newStage);
    console.log('Current stages count:', stages.length);
    onChange([...stages, newStage]);
  };

  const removeStage = (index) => {
    if (stages.length > 1) {
      onChange(stages.filter((_, i) => i !== index));
    }
  };

  const updateStage = (index, field, value) => {
    const updated = stages.map((stage, i) => {
      if (i === index) {
        return { ...stage, [field]: value };
      }
      return stage;
    });
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </span>
          Production Stages ({stages.length})
        </h3>
        <button
          onClick={addStage}
          disabled={stages.length >= 20}
          className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2 justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Stage
        </button>
      </div>

      {/* Mobile-friendly cards for small screens */}
      <div className="block lg:hidden space-y-4">
        {stages.map((stage, index) => (
          <div key={stage.id || index} className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 bg-indigo-500 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={stage.name || ''}
                  onChange={(e) => updateStage(index, 'name', e.target.value)}
                  className="font-semibold px-3 py-1.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  placeholder={`Stage-${index + 1}`}
                />
              </div>
              <button
                onClick={() => removeStage(index)}
                disabled={stages.length === 1}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Input/Batch (kg)</label>
                <input
                  type="number"
                  value={stage.inputPerBatch}
                  onChange={(e) => updateStage(index, 'inputPerBatch', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Output/Batch (kg)</label>
                <input
                  type="number"
                  value={stage.outputPerBatch}
                  onChange={(e) => updateStage(index, 'outputPerBatch', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Frequency (hrs)</label>
                <input
                  type="number"
                  value={stage.frequency}
                  onChange={(e) => updateStage(index, 'frequency', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Duration (hrs)</label>
                <input
                  type="number"
                  value={stage.duration}
                  onChange={(e) => updateStage(index, 'duration', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Analysis (hrs)</label>
                <input
                  type="number"
                  value={stage.analysisDuration}
                  onChange={(e) => updateStage(index, 'analysisDuration', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Pack Time (hrs)</label>
                <input
                  type="number"
                  value={stage.packTime || 0}
                  onChange={(e) => updateStage(index, 'packTime', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border-2 border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  min="0"
                  step="1"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden lg:block overflow-x-auto rounded-xl border-2 border-gray-200 shadow-md">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <th className="px-4 py-3 text-left text-sm font-bold">Stage</th>
              <th className="px-4 py-3 text-left text-sm font-bold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-bold">Input/Batch (kg)</th>
              <th className="px-4 py-3 text-left text-sm font-bold">Output/Batch (kg)</th>
              <th className="px-4 py-3 text-left text-sm font-bold">Frequency (hrs)</th>
              <th className="px-4 py-3 text-left text-sm font-bold">Duration (hrs)</th>
              <th className="px-4 py-3 text-left text-sm font-bold">Analysis (hrs)</th>
              <th className="px-4 py-3 text-left text-sm font-bold">Pack Time (hrs)</th>
              <th className="px-4 py-3 text-center text-sm font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((stage, index) => (
              <tr key={stage.id || index} className={`border-b border-gray-200 hover:bg-indigo-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="px-4 py-3 text-sm">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-500 text-white rounded-lg font-bold">
                    {index + 1}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={stage.name || ''}
                    onChange={(e) => updateStage(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder={`Stage-${index + 1}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={stage.inputPerBatch}
                    onChange={(e) => updateStage(index, 'inputPerBatch', parseFloat(e.target.value) || 0)}
                    className="w-28 px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    min="0"
                    step="0.01"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={stage.outputPerBatch}
                    onChange={(e) => updateStage(index, 'outputPerBatch', parseFloat(e.target.value) || 0)}
                    className="w-28 px-3 py-2 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    min="0"
                    step="0.01"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={stage.frequency}
                    onChange={(e) => updateStage(index, 'frequency', parseFloat(e.target.value) || 0)}
                    className="w-24 px-3 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    min="0"
                    step="1"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={stage.duration}
                    onChange={(e) => updateStage(index, 'duration', parseFloat(e.target.value) || 0)}
                    className="w-24 px-3 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    min="0"
                    step="1"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={stage.analysisDuration}
                    onChange={(e) => updateStage(index, 'analysisDuration', parseFloat(e.target.value) || 0)}
                    className="w-24 px-3 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    min="0"
                    step="1"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={stage.packTime || 0}
                    onChange={(e) => updateStage(index, 'packTime', parseFloat(e.target.value) || 0)}
                    className="w-24 px-3 py-2 border-2 border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    min="0"
                    step="1"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => removeStage(index)}
                    disabled={stages.length === 1}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-semibold text-sm shadow-sm hover:shadow-md"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {stages.length >= 20 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
          <p className="text-sm text-amber-800 font-semibold">⚠️ Maximum 20 stages reached</p>
        </div>
      )}
    </div>
  );
}
