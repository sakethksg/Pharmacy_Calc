'use client';

/**
 * Main Application Page - Modern Redesign
 * Multi-stage batch production planning interface with professional UI
 */

import { useState, useEffect } from 'react';
import StageInputModern from '@/components/StageInputModern';
import ResultsTable from '@/components/ResultsTable';
import DispatchTable from '@/components/DispatchTable';
import EnhancedExportButton from '@/components/EnhancedExportButton';
import SummaryDashboard from '@/components/SummaryDashboard';
import { ToastContainer } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import {
  LayersIcon,
  CalculatorIcon,
  InformationCircleIcon,
  MenuIcon,
  XIcon,
  CalendarIcon,
  SparklesIcon,
  TruckIcon,
  ClockIcon,
  DocumentIcon,
  CubeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationIcon
} from '@/components/Icons';

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
  
  // Toast notifications
  const toast = useToast();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + Enter to calculate
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!loading && productName) {
          handleCalculate();
        }
      }
      // Escape to close sidebar
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading, productName, sidebarOpen]);

  // Validation helpers
  const [fieldValidation, setFieldValidation] = useState({
    productName: true,
    targetOutput: true,
    dispatchBatchQuantity: true,
    packingTime: true
  });

  const validateField = (field, value) => {
    let isValid = true;
    
    switch (field) {
      case 'productName':
        isValid = value && value.trim().length > 0;
        break;
      case 'targetOutput':
      case 'dispatchBatchQuantity':
      case 'packingTime':
        isValid = value > 0;
        break;
    }
    
    setFieldValidation(prev => ({ ...prev, [field]: isValid }));
    return isValid;
  };

  const handleCalculate = async () => {
    // Validate all fields
    const isProductNameValid = validateField('productName', productName);
    const isTargetOutputValid = validateField('targetOutput', targetOutput);
    const isDispatchValid = validateField('dispatchBatchQuantity', dispatchBatchQuantity);
    const isPackingValid = validateField('packingTime', packingTime);

    if (!isProductNameValid || !isTargetOutputValid || !isDispatchValid || !isPackingValid) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

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
        toast.error('Calculation failed. Please check your inputs.');
        return;
      }

      if (data.success) {
        setResults(data.data);
        setWarnings(data.data.warnings);
        toast.success('Production schedule calculated successfully!');
        
        // Scroll to results
        setTimeout(() => {
          document.getElementById('results-section')?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    } catch (error) {
      console.error('Calculation error:', error);
      setErrors([{ path: 'general', message: 'Failed to perform calculations. Please try again.' }]);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col">
      {/* Toast Notifications */}
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />

      {/* Professional Header */}
      <header className="bg-white border-b-2 border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md">
                <LayersIcon className="w-7 h-7 text-white" />
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
              {sidebarOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Professional Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white border-r-2 border-slate-200 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto no-print`}>
          <div className="p-6 space-y-6">
            {/* Close button for mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <XIcon className="w-5 h-5" />
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
                  <p className="text-slate-700">View schedules and download reports</p>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-slate-200 pt-6">
              <h3 className="text-md font-bold text-slate-900 mb-3">Keyboard Shortcuts</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">Calculate Schedule</span>
                  <kbd className="px-2 py-1 bg-slate-200 border border-slate-300 rounded text-xs font-bold text-slate-700">
                    Ctrl + Enter
                  </kbd>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">Close Sidebar</span>
                  <kbd className="px-2 py-1 bg-slate-200 border border-slate-300 rounded text-xs font-bold text-slate-700">
                    Esc
                  </kbd>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-slate-200 pt-6">
              <h3 className="text-md font-bold text-slate-900 mb-3">Key Features</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-start gap-2.5">
                  <CheckCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Backward calculation from final output</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Time-based scheduling with dependencies</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Material flow management</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Automated dispatch scheduling</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
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
                    <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold text-emerald-900">Results Ready</span>
                  </div>
                  <p className="text-sm text-emerald-800">Scroll down to view batch schedules and download reports</p>
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
            <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <DocumentIcon className="w-7 h-7" />
                  Production Configuration
                </h2>
                <p className="text-blue-100 mt-1 text-sm">Configure your production parameters and stages</p>
              </div>
              <div className="p-8">
                {/* Basic Info - Professional Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                  <div className="bg-slate-50 p-5 rounded-xl border-2 border-slate-200 hover:border-blue-400 transition-all">
                    <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <CubeIcon className="w-4 h-4 text-blue-600" />
                      Product Name
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={productName}
                        onChange={(e) => {
                          setProductName(e.target.value);
                          validateField('productName', e.target.value);
                        }}
                        className={`w-full px-4 py-3 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all font-medium text-slate-900 ${
                          !fieldValidation.productName 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        placeholder="e.g., Paracetamol 500mg"
                      />
                      {fieldValidation.productName && productName && (
                        <CheckCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                    {!fieldValidation.productName && (
                      <p className="text-xs text-red-600 mt-1 font-medium">Product name is required</p>
                    )}
                  </div>

                  <div className="bg-slate-50 p-5 rounded-xl border-2 border-slate-200 hover:border-emerald-400 transition-all">
                    <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <SparklesIcon className="w-4 h-4 text-emerald-600" />
                      Target Output
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={targetOutput}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setTargetOutput(val);
                          validateField('targetOutput', val);
                        }}
                        className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all font-medium text-slate-900 ${
                          !fieldValidation.targetOutput 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'
                        }`}
                        min="0"
                        step="0.01"
                        placeholder="1000"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">kg</span>
                    </div>
                    {!fieldValidation.targetOutput && (
                      <p className="text-xs text-red-600 mt-1 font-medium">Must be greater than 0</p>
                    )}
                  </div>

                  <div className="bg-slate-50 p-5 rounded-xl border-2 border-slate-200 hover:border-violet-400 transition-all">
                    <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-violet-600" />
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

                  <div className="bg-slate-50 p-5 rounded-xl border-2 border-slate-200 hover:border-amber-400 transition-all">
                    <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <TruckIcon className="w-4 h-4 text-amber-600" />
                      Dispatch Batch
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={dispatchBatchQuantity}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setDispatchBatchQuantity(val);
                          validateField('dispatchBatchQuantity', val);
                        }}
                        className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all font-medium text-slate-900 ${
                          !fieldValidation.dispatchBatchQuantity 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-slate-300 focus:ring-amber-500 focus:border-amber-500'
                        }`}
                        min="0"
                        step="0.01"
                        placeholder="500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">kg</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-xl border-2 border-slate-200 hover:border-orange-400 transition-all">
                    <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-orange-600" />
                      Packing Time
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={packingTime}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setPackingTime(val);
                          validateField('packingTime', val);
                        }}
                        className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all font-medium text-slate-900 ${
                          !fieldValidation.packingTime 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-slate-300 focus:ring-orange-500 focus:border-orange-500'
                        }`}
                        min="0"
                        step="0.5"
                        placeholder="8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">hrs</span>
                    </div>
                  </div>
                </div>

                <StageInputModern stages={stages} onChange={setStages} />

                <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={handleCalculate}
                    disabled={loading || !productName}
                    className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3 text-lg"
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
                        <CalculatorIcon className="w-6 h-6" />
                        Calculate Schedule
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden px-8 py-4 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2.5"
                  >
                    <InformationCircleIcon className="w-5 h-5" />
                    View Guide
                  </button>
                </div>
              </div>
            </div>

            {/* Inline Validation Messages */}
            {errors && errors.length > 0 && (
              <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-5 rounded-lg animate-fade-in">
                <div className="flex items-start gap-3">
                  <XCircleIcon className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-red-900 mb-2">Validation Errors</h3>
                    <ul className="space-y-1.5 text-sm text-red-800">
                      {errors.map((error, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-red-500 font-bold">•</span>
                          <span><strong className="font-semibold">{error.path}:</strong> {error.message}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Results Section */}
            {results && (
              <div id="results-section" className="space-y-8 animate-fade-in">
                {/* Summary Dashboard */}
                <SummaryDashboard results={results} />

                {/* Export Button */}
                <div className="flex justify-center">
                  <EnhancedExportButton results={results} disabled={false} />
                </div>
                
                {/* Warnings */}
                {warnings && warnings.length > 0 && (
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-lg">
                    <div className="flex items-start gap-3">
                      <ExclamationIcon className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-amber-900 mb-2">Important Information</h3>
                        <ul className="space-y-1.5 text-sm text-amber-800">
                          {warnings.map((warning, idx) => (
                            <li key={idx}>{warning.message}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Results Table */}
                <ResultsTable results={results} />
                
                {/* Dispatch Table */}
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
