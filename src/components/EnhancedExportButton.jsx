'use client';

/**
 * EnhancedExportButton Component
 * Multi-format export dropdown with modern UI
 */

import { useState, useRef, useEffect } from 'react';
import { DownloadIcon, DocumentIcon, ChevronDownIcon } from './Icons';

export default function EnhancedExportButton({ results, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = async (format) => {
    setIsExporting(true);
    setIsOpen(false);

    try {
      if (format === 'excel') {
        const response = await fetch('/api/export', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(results),
        });

        if (!response.ok) {
          throw new Error('Export failed');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${results.productName}_Production_Schedule.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else if (format === 'csv') {
        // CSV export logic
        const csvContent = generateCSV(results);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${results.productName}_Production_Schedule.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else if (format === 'print') {
        window.print();
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const generateCSV = (data) => {
    // Simple CSV generation
    let csv = 'Production Schedule Report\n\n';
    csv += `Product Name:,${data.productName}\n`;
    csv += `Target Output:,${data.targetFinalOutput} kg\n`;
    csv += `Start Date:,${data.summary.startDate}\n`;
    csv += `End Date:,${data.summary.endDate}\n`;
    csv += `Total Production Time:,${data.summary.totalProductionTime}\n\n`;

    data.scheduleResults.stages.forEach((stage, idx) => {
      csv += `\n${stage.stageName}\n`;
      csv += 'Batch,Start Time,Completion Time,Analysis Done,Input (kg),Output (kg)\n';
      stage.batches.forEach((batch) => {
        csv += `${batch.batchNumber},${batch.startTimeFormatted},${batch.completionTimeFormatted},${batch.analysisDoneTimeFormatted},${batch.inputQuantity},${batch.outputQuantity}\n`;
      });
    });

    return csv;
  };

  const exportOptions = [
    {
      id: 'excel',
      label: 'Excel Workbook',
      description: 'Download as .xlsx file',
      icon: '📊',
      color: 'text-green-600',
      bgHover: 'hover:bg-green-50'
    },
    {
      id: 'csv',
      label: 'CSV File',
      description: 'Download as .csv file',
      icon: '📄',
      color: 'text-blue-600',
      bgHover: 'hover:bg-blue-50'
    },
    {
      id: 'print',
      label: 'Print Report',
      description: 'Open print dialog',
      icon: '🖨️',
      color: 'text-purple-600',
      bgHover: 'hover:bg-purple-50'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || isExporting}
        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center gap-3"
      >
        {isExporting ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Exporting...
          </>
        ) : (
          <>
            <DownloadIcon className="w-5 h-5" />
            Export Report
            <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border-2 border-slate-200 py-2 z-50 animate-fade-in">
          <div className="px-4 py-3 border-b border-slate-200">
            <p className="text-sm font-bold text-slate-900">Choose Export Format</p>
            <p className="text-xs text-slate-600 mt-0.5">Select how you'd like to export your data</p>
          </div>
          
          {exportOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleExport(option.id)}
              className={`w-full px-4 py-3 flex items-start gap-3 transition-colors ${option.bgHover} text-left`}
            >
              <span className="text-2xl flex-shrink-0">{option.icon}</span>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${option.color}`}>{option.label}</p>
                <p className="text-xs text-slate-600 mt-0.5">{option.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
