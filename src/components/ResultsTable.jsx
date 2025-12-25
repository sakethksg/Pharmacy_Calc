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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Production Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-primary-50 rounded-lg">
            <p className="text-sm text-gray-600">Product</p>
            <p className="text-lg font-semibold text-gray-800">{results.productName}</p>
          </div>
          <div className="p-4 bg-primary-50 rounded-lg">
            <p className="text-sm text-gray-600">Target Output</p>
            <p className="text-lg font-semibold text-gray-800">{results.targetFinalOutput} kg</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Actual Output</p>
            <p className="text-lg font-semibold text-green-700">{results.efficiency.actualOutput} kg</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Start Date</p>
            <p className="text-lg font-semibold text-gray-800">{results.summary.startDate}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">End Date</p>
            <p className="text-lg font-semibold text-gray-800">{results.summary.endDate}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Time</p>
            <p className="text-lg font-semibold text-purple-700">{results.summary.totalProductionTime}</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Stages</p>
            <p className="text-lg font-semibold text-amber-700">{results.summary.totalStages}</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Batches</p>
            <p className="text-lg font-semibold text-amber-700">{results.summary.totalBatches}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Overall Yield</p>
            <p className="text-lg font-semibold text-green-700">{results.efficiency.overallYieldPercentage}%</p>
          </div>
        </div>
      </div>

      {/* Stage Tables */}
      {results.scheduleResults.stages.map((stage, stageIdx) => (
        <div key={stageIdx} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-primary-600 text-white px-6 py-4">
            <h3 className="text-lg font-bold">{stage.stageName}</h3>
            <div className="mt-2 flex flex-wrap gap-4 text-sm">
              <span>Yield: {results.calculationResults.stages[stageIdx].yieldPercentage}%</span>
              <span>Batches: {stage.batches.length}</span>
              <span>Total Output: {stage.totalOutput} kg</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Batch No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Start Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Completion Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Analysis Done</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Input (kg)</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Output (kg)</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Cumulative (kg)</th>
                </tr>
              </thead>
              <tbody>
                {stage.batches.map((batch, batchIdx) => (
                  <tr 
                    key={batchIdx} 
                    className={`border-b border-gray-200 ${batchIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{batch.batchId}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{batch.startTimeFormatted}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{batch.completionTimeFormatted}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{batch.analysisDoneTimeFormatted}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">{batch.inputQuantity}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">{batch.outputQuantity}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{batch.cumulativeOutput}</td>
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
