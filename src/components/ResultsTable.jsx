'use client';

/**
 * ResultsTable Component
 * Displays batch schedules for all stages
 */

export default function ResultsTable({ results }) {
  if (!results) return null;

  return (
    <div className="space-y-8">
      {/* Summary Section */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-6 py-4 border-b-4 border-emerald-600">
          <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Production Summary
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-5 bg-slate-50 rounded-xl border-2 border-slate-200">
              <p className="text-sm font-medium text-slate-600 mb-1">Product</p>
              <p className="text-xl font-bold text-slate-900">{results.productName}</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-xl border-2 border-slate-200">
              <p className="text-sm font-medium text-slate-600 mb-1">Target Output</p>
              <p className="text-xl font-bold text-slate-900">{results.targetFinalOutput} kg</p>
            </div>
            <div className="p-5 bg-emerald-50 rounded-xl border-2 border-emerald-200">
              <p className="text-sm font-medium text-emerald-700 mb-1">Actual Output</p>
              <p className="text-xl font-bold text-emerald-900">{results.efficiency.actualOutput} kg</p>
            </div>
            <div className="p-5 bg-blue-50 rounded-xl border-2 border-blue-200">
              <p className="text-sm font-medium text-blue-700 mb-1">Start Date</p>
              <p className="text-xl font-bold text-blue-900">{results.summary.startDate}</p>
            </div>
            <div className="p-5 bg-blue-50 rounded-xl border-2 border-blue-200">
              <p className="text-sm font-medium text-blue-700 mb-1">End Date</p>
              <p className="text-xl font-bold text-blue-900">{results.summary.endDate}</p>
            </div>
            <div className="p-5 bg-violet-50 rounded-xl border-2 border-violet-200">
              <p className="text-sm font-medium text-violet-700 mb-1">Total Time</p>
              <p className="text-xl font-bold text-violet-900">{results.summary.totalProductionTime}</p>
            </div>
            <div className="p-5 bg-amber-50 rounded-xl border-2 border-amber-200">
              <p className="text-sm font-medium text-amber-700 mb-1">Total Stages</p>
              <p className="text-xl font-bold text-amber-900">{results.summary.totalStages}</p>
            </div>
            <div className="p-5 bg-amber-50 rounded-xl border-2 border-amber-200">
              <p className="text-sm font-medium text-amber-700 mb-1">Total Batches</p>
              <p className="text-xl font-bold text-amber-900">{results.summary.totalBatches}</p>
            </div>
            <div className="p-5 bg-emerald-50 rounded-xl border-2 border-emerald-200">
              <p className="text-sm font-medium text-emerald-700 mb-1">Overall Yield</p>
              <p className="text-xl font-bold text-emerald-900">{results.efficiency.overallYieldPercentage}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Tables */}
      {results.scheduleResults.stages.map((stage, stageIdx) => (
        <div key={stageIdx} className="bg-white rounded-xl shadow-lg border-2 border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 border-b-4 border-blue-700">
            <h3 className="text-lg font-bold flex items-center gap-2.5">
              <span className="bg-white/20 rounded-lg px-3 py-1 text-sm font-bold backdrop-blur-sm">
                Stage {stageIdx + 1}
              </span>
              {stage.stageName}
            </h3>
            <div className="mt-3 flex flex-wrap gap-4 text-sm font-medium">
              <span className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">Yield: {results.calculationResults.stages[stageIdx].yieldPercentage}%</span>
              <span className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">Batches: {stage.batches.length}</span>
              <span className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">Total Output: {stage.totalOutput} kg</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-300">
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Batch No</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Start Time</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Completion Time</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Analysis Done</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Pack Time</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Input (kg)</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Output (kg)</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Cumulative (kg)</th>
                </tr>
              </thead>
              <tbody>
                {stage.batches.map((batch, batchIdx) => (
                  <tr 
                    key={batchIdx} 
                    className={`border-b border-slate-200 hover:bg-blue-50 transition-colors ${batchIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                  >
                    <td className="px-4 py-3 text-sm font-bold text-slate-900">{batch.batchId}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{batch.startTimeFormatted}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{batch.completionTimeFormatted}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{batch.analysisDoneTimeFormatted}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{batch.packTimeFormatted}</td>
                    <td className="px-4 py-3 text-sm text-right text-slate-700">{batch.inputQuantity}</td>
                    <td className="px-4 py-3 text-sm text-right text-slate-700">{batch.outputQuantity}</td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-slate-900">{batch.cumulativeOutput}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
