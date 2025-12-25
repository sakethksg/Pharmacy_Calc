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
      id: Date.now(),
      name: 'Stage-1',
      inputPerBatch: 200,
      outputPerBatch: 250,
      frequency: 24,
      duration: 24,
      analysisDuration: 24,
      packTime: 0,
    },
    {
      id: Date.now() + 1,
      name: 'Stage-2',
      inputPerBatch: 300,
      outputPerBatch: 180,
      frequency: 24,
      duration: 24,
      analysisDuration: 24,
      packTime: 0,
    },
  ]);

  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState(null);
  const [warnings, setWarnings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    setErrors(null);
    setWarnings(null);
    setResults(null);

    try {
      // Remove the 'id' field from stages before sending to API
      const cleanStages = stages.map(({ id, ...stage }) => stage);
      
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName,
          targetFinalOutput: targetOutput,
          startDate,
          stages: cleanStages,
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Modern Header with Menu Button */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Production Planner</h1>
                <p className="text-xs sm:text-sm text-blue-100">Multi-Stage Batch Planning</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {sidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Info Panel */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto`}>
          <div className="p-6 space-y-6">
            {/* Close button for mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Quick Guide
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="font-semibold text-blue-900 mb-1">Step 1: Input Details</p>
                  <p>Enter product name, target output, and start date</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <p className="font-semibold text-green-900 mb-1">Step 2: Configure Stages</p>
                  <p>Add/edit production stages with batch parameters</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <p className="font-semibold text-purple-900 mb-1">Step 3: Calculate</p>
                  <p>Generate batch schedules and timelines</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
                  <p className="font-semibold text-amber-900 mb-1">Step 4: Export</p>
                  <p>Download detailed Excel report</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-md font-bold text-gray-800 mb-3">Key Features</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Backward calculation from final output</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Time-based scheduling with dependencies</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Material flow management</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Professional Excel exports</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-md font-bold text-gray-800 mb-3">Input Guidelines</h3>
              <div className="space-y-2 text-xs text-gray-600 bg-gray-50 p-4 rounded-lg">
                <p><strong>Stages:</strong> Maximum 20 stages supported</p>
                <p><strong>Time Values:</strong> All durations in hours</p>
                <p><strong>Frequency:</strong> Must be ≥ duration</p>
                <p><strong>Dates:</strong> YYYY-MM-DD format</p>
              </div>
            </div>

            {results && (
              <div className="border-t pt-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-green-900">Results Ready</span>
                  </div>
                  <p className="text-sm text-green-800">Scroll down to view batch schedules and download Excel report</p>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Input Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Production Parameters</h2>
              </div>
              
              <div className="p-6">
                {/* Basic Info - Modern Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., Product ABC"
                    />
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                    <label className="block text-sm font-semibold text-green-900 mb-2">
                      Target Output (kg) *
                    </label>
                    <input
                      type="number"
                      value={targetOutput}
                      onChange={(e) => setTargetOutput(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      min="0"
                      step="0.01"
                      placeholder="1000"
                    />
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                    <label className="block text-sm font-semibold text-purple-900 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <StageInput stages={stages} onChange={setStages} />

                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={handleCalculate}
                    disabled={loading || !productName}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3 text-lg"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Calculating...
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Calculate Production Plan
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden px-6 py-4 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    View Guide
                  </button>
                </div>
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
          </div>
        </main>
      </div>
    </div>
  );
}
