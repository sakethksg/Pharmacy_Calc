'use client';

/**
 * Main Application Page
 * Multi-stage batch production planning interface
 */

import { useState } from 'react';
import StageInput from '@/components/StageInput';
import ResultsTable from '@/components/ResultsTable';
import ExportButton from '@/components/ExportButton';
import ValidationMessage from '@/components/ValidationMessage';

export default function Home() {
  const [productName, setProductName] = useState('');
  const [targetOutput, setTargetOutput] = useState(1000);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  const [stages, setStages] = useState([
    {
      name: 'Stage-1',
      inputPerBatch: 200,
      outputPerBatch: 250,
      frequency: 24,
      duration: 24,
      analysisDuration: 24,
    },
    {
      name: 'Stage-2',
      inputPerBatch: 300,
      outputPerBatch: 180,
      frequency: 24,
      duration: 24,
      analysisDuration: 24,
    },
  ]);

  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState(null);
  const [warnings, setWarnings] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    setErrors(null);
    setWarnings(null);
    setResults(null);

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName,
          targetFinalOutput: targetOutput,
          startDate,
          stages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data.details || [{ path: 'general', message: data.message }]);
        return;
      }

      if (data.success) {
        setResults(data.data);
        setWarnings(data.data.warnings);
      }
    } catch (error) {
      console.error('Calculation error:', error);
      setErrors([{ path: 'general', message: 'Failed to perform calculations. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Multi-Stage Batch Production Planner
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Automated production planning with backward calculation and time-based scheduling
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Production Parameters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Final Output (kg)
              </label>
              <input
                type="number"
                value={targetOutput}
                onChange={(e) => setTargetOutput(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <StageInput stages={stages} onChange={setStages} />

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleCalculate}
              disabled={loading || !productName}
              className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Calculating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Calculate Production Plan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Validation Messages */}
        {(errors || warnings) && (
          <div className="mb-8">
            <ValidationMessage errors={errors} warnings={warnings} />
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-8">
            <div className="flex justify-center">
              <ExportButton results={results} disabled={false} />
            </div>
            
            <ResultsTable results={results} />
          </div>
        )}

        {/* Help Section */}
        {!results && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">How It Works</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>1. Backward Calculation:</strong> The system starts with your target final output and works backward through each stage to determine exactly how much material is needed at each step.
              </p>
              <p>
                <strong>2. Batch Planning:</strong> For each stage, the system calculates how many batches must be run to achieve the required output, considering yield ratios.
              </p>
              <p>
                <strong>3. Time-Based Scheduling:</strong> Batches are scheduled forward in time, respecting:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Batch frequency (minimum time between batch starts)</li>
                <li>Processing duration (how long each batch takes)</li>
                <li>Analysis time (delay before material is available for next stage)</li>
                <li>Material availability (downstream stages wait for upstream material)</li>
              </ul>
              <p>
                <strong>4. Excel Export:</strong> Download a comprehensive report with all calculations, schedules, and metrics in a formatted Excel workbook.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            Multi-Stage Batch Production Planner © 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
