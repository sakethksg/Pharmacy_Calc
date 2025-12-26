'use client';

/**
 * Main Application Page
 * Multi-stage batch production planning interface
 */

import { useState } from 'react';
import StageInput from '@/components/StageInput';
import ResultsTable from '@/components/ResultsTable';
import DispatchTable from '@/components/DispatchTable';
import ExportButton from '@/components/ExportButton';
import ValidationMessage from '@/components/ValidationMessage';

export default function Home() {
  const [productName, setProductName] = useState('');
  const [targetOutput, setTargetOutput] = useState(1000);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [dispatchBatchQuantity, setDispatchBatchQuantity] = useState(500);
  const [packingTime, setPackingTime] = useState(8);
  
  const [stages, setStages] = useState([
    {
      id: Date.now(),
      name: 'Stage-1',
      inputPerBatch: 200,
      outputPerBatch: 250,
      frequency: 24,
      duration: 8,
      analysisDuration: 24,
      packTime: 0,
    },
    {
      id: Date.now() + 1,
      name: 'Stage-2',
      inputPerBatch: 300,
      outputPerBatch: 180,
      frequency: 24,
      duration: 8,
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
          dispatchBatchQuantity,
          packingTime,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col">
      {/* Professional Header */}
      <header className="bg-white border-b-2 border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Production Planning System</h1>
                <p className="text-sm text-slate-600">Pharmaceutical Manufacturing • Batch Optimization</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2.5 rounded-lg border-2 border-slate-200 hover:bg-slate-100 transition-colors text-slate-700"
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
        {/* Professional Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white border-r-2 border-slate-200 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto`}>
          <div className="p-6 space-y-6">
            {/* Close button for mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b-2 border-slate-200">
                System Guide
              </h2>
              <div className="space-y-3 text-sm">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                  <p className="font-semibold text-slate-900 mb-1.5">1. Input Details</p>
                  <p className="text-slate-700">Enter product name, target output, start date, dispatch quantity, and packing time</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-600">
                  <p className="font-semibold text-slate-900 mb-1.5">2. Configure Stages</p>
                  <p className="text-slate-700">Add/edit production stages with batch parameters</p>
                </div>
                <div className="bg-violet-50 p-4 rounded-lg border-l-4 border-violet-600">
                  <p className="font-semibold text-slate-900 mb-1.5">3. Calculate</p>
                  <p className="text-slate-700">Generate production and dispatch schedules</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-600">
                  <p className="font-semibold text-slate-900 mb-1.5">4. Review & Export</p>
                  <p className="text-slate-700">View schedules and download Excel report</p>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-slate-200 pt-6">
              <h3 className="text-md font-bold text-slate-900 mb-3">Key Features</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-700">Backward calculation from final output</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-700">Time-based scheduling with dependencies</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-700">Material flow management</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-700">Automated dispatch scheduling</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-700">Professional Excel exports</span>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-slate-200 pt-6">
              <h3 className="text-md font-bold text-slate-900 mb-3">Input Guidelines</h3>
              <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p><strong className="text-slate-900">Stages:</strong> Maximum 20 stages supported</p>
                <p><strong className="text-slate-900">Time Values:</strong> All durations in hours</p>
                <p><strong className="text-slate-900">Frequency:</strong> Must be ≥ duration</p>
                <p><strong className="text-slate-900">Dispatch:</strong> Product accumulates, packs, then dispatches</p>
                <p><strong className="text-slate-900">Dates:</strong> YYYY-MM-DD format</p>
              </div>
            </div>

            {results && (
              <div className="border-t-2 border-slate-200 pt-6">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-lg border-2 border-emerald-200">
                  <div className="flex items-center gap-2.5 mb-2">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-emerald-900">Results Ready</span>
                  </div>
                  <p className="text-sm text-emerald-800">Scroll down to view batch schedules and download Excel report</p>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Input Card */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-6 py-5 border-b-4 border-blue-600">
                <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Production Configuration
                </h2>
              </div>
              <div className="p-8">
                {/* Basic Info - Professional Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                  <div className="bg-slate-50 p-5 rounded-xl border-2 border-slate-200 hover:border-blue-400 transition-colors">
                    <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                      Product Name
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-900"
                      placeholder="e.g., Paracetamol 500mg"
                    />
                  </div>

                  <div className="bg-slate-50 p-5 rounded-xl border-2 border-slate-200 hover:border-emerald-400 transition-colors">
                    <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                      </svg>
                      Target Output (kg)
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={targetOutput}
                      onChange={(e) => setTargetOutput(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium text-slate-900"
                      min="0"
                      step="0.01"
                      placeholder="1000"
                    />
                  </div>

                  <div className="bg-slate-50 p-5 rounded-xl border-2 border-slate-200 hover:border-violet-400 transition-colors">
                    <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      Start Date
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all font-medium text-slate-900"
                    />
                  </div>

                  <div className="bg-amber-50 p-5 rounded-xl border-2 border-amber-200 hover:border-amber-400 transition-colors">
                    <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                      </svg>
                      Dispatch Batch (kg)
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={dispatchBatchQuantity}
                      onChange={(e) => setDispatchBatchQuantity(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium text-slate-900"
                      min="0"
                      step="0.01"
                      placeholder="500"
                    />
                  </div>

                  <div className="bg-orange-50 p-5 rounded-xl border-2 border-orange-200 hover:border-orange-400 transition-colors">
                    <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Packing Time (hrs)
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={packingTime}
                      onChange={(e) => setPackingTime(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-white border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium text-slate-900"
                      min="0"
                      step="0.5"
                      placeholder="8"
                    />
                  </div>
                </div>

                <StageInput stages={stages} onChange={setStages} />

                <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={handleCalculate}
                    disabled={loading || !productName}
                    className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3 text-lg"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Calculate Schedule
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden px-8 py-4 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2.5"
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
                
                {results.dispatchSchedule && (
                  <DispatchTable dispatchSchedule={results.dispatchSchedule} />
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
