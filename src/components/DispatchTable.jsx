'use client';

/**
 * DispatchTable Component
 * Displays packing and dispatch schedule
 */

export default function DispatchTable({ dispatchSchedule }) {
  if (!dispatchSchedule || !dispatchSchedule.dispatches || dispatchSchedule.dispatches.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-4 border-b-4 border-amber-700">
        <h3 className="text-lg font-bold flex items-center gap-2.5">
          <span className="bg-white/20 rounded-lg px-3 py-1 text-sm font-bold backdrop-blur-sm">
            <svg className="w-5 h-5 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
            </svg>
            Dispatch Schedule
          </span>
        </h3>
        <div className="mt-3 flex flex-wrap gap-4 text-sm font-medium">
          <span className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
            Batch Size: {dispatchSchedule.dispatchBatchQuantity} kg
          </span>
          <span className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
            Packing Time: {dispatchSchedule.packingTimeHours} hrs
          </span>
          <span className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
            Total Dispatches: {dispatchSchedule.totalBatches}
          </span>
          <span className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
            Total Dispatched: {dispatchSchedule.totalDispatched.toFixed(2)} kg
          </span>
        </div>
      </div>

      <div className="p-5 bg-amber-50 border-b border-amber-200">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-slate-700">
            <p className="font-semibold text-amber-900 mb-1">Dispatch Process</p>
            <p>
              Final product accumulates until reaching <strong>{dispatchSchedule.dispatchBatchQuantity} kg</strong>. 
              Once accumulated, packing begins and takes <strong>{dispatchSchedule.packingTimeHours} hours</strong>. 
              After packing completes, the batch is ready for dispatch.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-300">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Dispatch Batch</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Packing Start</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Packing Complete</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Dispatch Ready</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Quantity (kg)</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Cumulative (kg)</th>
            </tr>
          </thead>
          <tbody>
            {dispatchSchedule.dispatches.map((dispatch, idx) => (
              <tr 
                key={idx} 
                className={`border-b border-slate-200 hover:bg-amber-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
              >
                <td className="px-4 py-3 text-sm font-bold text-slate-900">{dispatch.dispatchBatchId}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{dispatch.packingStartTimeFormatted}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{dispatch.packingCompleteTimeFormatted}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{dispatch.dispatchReadyTimeFormatted}</td>
                <td className="px-4 py-3 text-sm text-right text-slate-700">{dispatch.quantityPacked.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-right font-bold text-slate-900">{dispatch.cumulativeDispatched.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
