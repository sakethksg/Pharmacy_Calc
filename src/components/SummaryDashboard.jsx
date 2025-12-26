'use client';

/**
 * SummaryDashboard Component
 * Displays key production metrics at a glance
 */

import { ClockIcon, CalendarIcon, LayersIcon, CubeIcon, SparklesIcon, TruckIcon } from './Icons';

export default function SummaryDashboard({ results }) {
  if (!results) return null;

  const metrics = [
    {
      label: 'Total Production Time',
      value: results.summary.totalProductionTime,
      icon: ClockIcon,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      valueColor: 'text-blue-900'
    },
    {
      label: 'Dispatch Ready Date',
      value: results.summary.endDate,
      icon: TruckIcon,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      valueColor: 'text-emerald-900'
    },
    {
      label: 'Total Batches',
      value: results.summary.totalBatches,
      icon: CubeIcon,
      color: 'violet',
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-200',
      textColor: 'text-violet-700',
      valueColor: 'text-violet-900'
    },
    {
      label: 'Stage Count',
      value: results.summary.totalStages,
      icon: LayersIcon,
      color: 'amber',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      valueColor: 'text-amber-900'
    },
    {
      label: 'Actual Output',
      value: `${results.efficiency.actualOutput} kg`,
      icon: SparklesIcon,
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      valueColor: 'text-green-900'
    },
    {
      label: 'Overall Yield',
      value: `${results.efficiency.overallYieldPercentage}%`,
      icon: SparklesIcon,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-700',
      valueColor: 'text-indigo-900'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <CalendarIcon className="w-7 h-7" />
          Production Overview
        </h2>
        <p className="text-blue-100 mt-1 text-sm">Key performance metrics for {results.productName}</p>
      </div>

      {/* Metrics Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`${metric.bgColor} border-2 ${metric.borderColor} rounded-xl p-5 hover:shadow-md transition-all duration-200 hover:scale-105`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 ${metric.bgColor} rounded-lg border ${metric.borderColor}`}>
                  <metric.icon className={`w-6 h-6 ${metric.textColor}`} />
                </div>
              </div>
              <p className={`text-sm font-semibold ${metric.textColor} mb-1`}>{metric.label}</p>
              <p className={`text-2xl font-bold ${metric.valueColor}`}>{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Additional Info Bar */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Product Name</p>
            <p className="text-lg font-bold text-slate-900">{results.productName}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Start Date</p>
            <p className="text-lg font-bold text-slate-900">{results.summary.startDate}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Target Output</p>
            <p className="text-lg font-bold text-slate-900">{results.targetFinalOutput} kg</p>
          </div>
        </div>
      </div>
    </div>
  );
}
