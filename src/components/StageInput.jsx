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
      duration: 24,
      analysisDuration: 24,
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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">Production Stages</h3>
        <button
          onClick={addStage}
          disabled={stages.length >= 20}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          + Add Stage
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-primary-100 text-primary-900">
              <th className="px-4 py-3 text-left text-sm font-semibold">Stage</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Input/Batch (kg)</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Output/Batch (kg)</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Frequency (hrs)</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Duration (hrs)</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Analysis (hrs)</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((stage, index) => (
              <tr key={stage.id || index} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-700">
                  {index + 1}
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={stage.name || ''}
                    onChange={(e) => updateStage(index, 'name', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={`Stage-${index + 1}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={stage.inputPerBatch}
                    onChange={(e) => updateStage(index, 'inputPerBatch', parseFloat(e.target.value) || 0)}
                    className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="0"
                    step="0.01"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={stage.outputPerBatch}
                    onChange={(e) => updateStage(index, 'outputPerBatch', parseFloat(e.target.value) || 0)}
                    className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="0"
                    step="0.01"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={stage.frequency}
                    onChange={(e) => updateStage(index, 'frequency', parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="0"
                    step="1"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={stage.duration}
                    onChange={(e) => updateStage(index, 'duration', parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="0"
                    step="1"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={stage.analysisDuration}
                    onChange={(e) => updateStage(index, 'analysisDuration', parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="0"
                    step="1"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => removeStage(index)}
                    disabled={stages.length === 1}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
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
        <p className="text-sm text-amber-600">Maximum 20 stages reached</p>
      )}
    </div>
  );
}
