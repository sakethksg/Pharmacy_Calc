'use client';

/**
 * StageInput Component - Redesigned
 * Modern collapsible card-based layout for production stages
 */

import { useState } from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
  PlusIcon,
  DuplicateIcon,
  LayersIcon,
  DragIcon,
  ClockIcon,
  BeakerIcon,
  CubeIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  TruckIcon
} from './Icons';

function Tooltip({ children, text }) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
        <div className="bg-slate-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-slate-900"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, unit, icon: Icon, tooltip, error, min = 0, step = "0.01", colorClass = "blue" }) {
  const [isValid, setIsValid] = useState(true);

  const colors = {
    blue: 'border-blue-200 focus:ring-blue-500 focus:border-blue-500',
    green: 'border-green-200 focus:ring-green-500 focus:border-green-500',
    purple: 'border-purple-200 focus:ring-purple-500 focus:border-purple-500',
    amber: 'border-amber-200 focus:ring-amber-500 focus:border-amber-500',
    pink: 'border-pink-200 focus:ring-pink-500 focus:border-pink-500',
    teal: 'border-teal-200 focus:ring-teal-500 focus:border-teal-500'
  };

  const handleChange = (e) => {
    const val = parseFloat(e.target.value) || 0;
    setIsValid(val >= min);
    onChange(val);
  };

  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
        {Icon && <Icon className="w-4 h-4 text-slate-500" />}
        {label}
        {tooltip && (
          <Tooltip text={tooltip}>
            <QuestionMarkCircleIcon className="w-4 h-4 text-slate-400 cursor-help" />
          </Tooltip>
        )}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={handleChange}
          className={`w-full px-3 py-2.5 pr-12 border-2 rounded-lg transition-all ${
            error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : colors[colorClass]
          } ${!isValid && !error ? 'border-amber-300' : ''} bg-white text-slate-900 font-medium`}
          min={min}
          step={step}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
            {unit}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}

function StageCard({ stage, index, updateStage, removeStage, duplicateStage, canRemove, totalStages, isLastStage }) {
  const [isExpanded, setIsExpanded] = useState(index < 2); // First 2 expanded by default

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Card Header */}
      <div className="bg-slate-50 px-5 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <button className="cursor-move text-slate-400 hover:text-slate-600 transition-colors">
              <DragIcon className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-sm">
                {index + 1}
              </div>
              
              <input
                type="text"
                value={stage.name || ''}
                onChange={(e) => updateStage(index, 'name', e.target.value)}
                className="flex-1 max-w-xs px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-semibold text-slate-900 transition-all"
                placeholder={`Stage-${index + 1}`}
              />

              <div className="hidden md:flex items-center gap-2 text-sm text-slate-600">
                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md font-medium">
                  {stage.frequency}h cycle
                </span>
                <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-md font-medium">
                  {stage.duration}h duration
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip text="Duplicate stage">
              <button
                onClick={() => duplicateStage(index)}
                disabled={totalStages >= 20}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <DuplicateIcon className="w-5 h-5" />
              </button>
            </Tooltip>

            <Tooltip text={canRemove ? "Remove stage" : "Cannot remove last stage"}>
              <button
                onClick={() => removeStage(index)}
                disabled={!canRemove}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </Tooltip>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isExpanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Card Content - Collapsible */}
      {isExpanded && (
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <InputField
              label="Input per Batch"
              value={stage.inputPerBatch}
              onChange={(val) => updateStage(index, 'inputPerBatch', val)}
              unit="kg"
              icon={CubeIcon}
              tooltip="Material input required for each batch"
              colorClass="blue"
            />

            <InputField
              label="Output per Batch"
              value={stage.outputPerBatch}
              onChange={(val) => updateStage(index, 'outputPerBatch', val)}
              unit="kg"
              icon={CubeIcon}
              tooltip="Expected output from each batch"
              colorClass="green"
            />

            <InputField
              label="Frequency"
              value={stage.frequency}
              onChange={(val) => updateStage(index, 'frequency', val)}
              unit="hrs"
              icon={ClockIcon}
              tooltip="Time interval between starting consecutive batches"
              colorClass="purple"
              step="1"
            />

            <InputField
              label="Duration"
              value={stage.duration}
              onChange={(val) => updateStage(index, 'duration', val)}
              unit="hrs"
              icon={ClockIcon}
              tooltip="Processing time for each batch"
              colorClass="amber"
              step="1"
            />

            <InputField
              label="Analysis Duration"
              value={stage.analysisDuration}
              onChange={(val) => updateStage(index, 'analysisDuration', val)}
              unit="hrs"
              icon={BeakerIcon}
              tooltip="Time required for quality analysis"
              colorClass="pink"
              step="1"
            />

            <InputField
              label="Pack Time"
              value={stage.packTime || 0}
              onChange={(val) => updateStage(index, 'packTime', val)}
              unit="hrs"
              icon={ClockIcon}
              tooltip="Time to pack the output"
              colorClass="teal"
              step="1"
            />
          </div>

          {/* Dispatch Fields - Only for Last Stage */}
          {isLastStage && (
            <div className="mt-6 pt-6 border-t-2 border-blue-200 bg-blue-50/50 -m-5 p-5 rounded-b-lg">
              <div className="flex items-center gap-2 mb-4">
                <TruckIcon className="w-5 h-5 text-blue-600" />
                <h4 className="text-lg font-bold text-blue-900">Dispatch Configuration (Final Stage)</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  label="Dispatch Batch Quantity"
                  value={stage.dispatchBatchQuantity || 500}
                  onChange={(val) => updateStage(index, 'dispatchBatchQuantity', val)}
                  unit="kg"
                  icon={TruckIcon}
                  tooltip="Quantity per dispatch batch"
                  colorClass="blue"
                />

                <InputField
                  label="Packing Time"
                  value={stage.packingTime || 8}
                  onChange={(val) => updateStage(index, 'packingTime', val)}
                  unit="hrs"
                  icon={ClockIcon}
                  tooltip="Time required to pack a dispatch batch"
                  colorClass="blue"
                  step="0.5"
                />
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="mt-5 pt-5 border-t border-slate-200">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-600">Yield:</span>
                <span className="font-bold text-slate-900">
                  {((stage.outputPerBatch / stage.inputPerBatch) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600">Cycle Time:</span>
                <span className="font-bold text-slate-900">{stage.frequency} hrs</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600">Total Analysis + Pack:</span>
                <span className="font-bold text-slate-900">
                  {stage.analysisDuration + (stage.packTime || 0)} hrs
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StageInput({ stages, onChange }) {
  const addStage = () => {
    if (stages.length >= 20) return;
    
    // Remove dispatch fields from the previous last stage (if any)
    const updatedStages = stages.map((stage, index) => {
      if (index === stages.length - 1) {
        const { dispatchBatchQuantity, packingTime, ...stageWithoutDispatch } = stage;
        return stageWithoutDispatch;
      }
      return stage;
    });
    
    const newStage = {
      id: Date.now(),
      name: `Stage-${stages.length + 1}`,
      inputPerBatch: 100,
      outputPerBatch: 100,
      frequency: 24,
      duration: 8,
      analysisDuration: 24,
      packTime: 0,
      // Add dispatch fields to the new last stage
      dispatchBatchQuantity: 500,
      packingTime: 8,
    };
    onChange([...updatedStages, newStage]);
  };

  const removeStage = (index) => {
    if (stages.length > 1) {
      const filteredStages = stages.filter((_, i) => i !== index);
      // Ensure the new last stage has dispatch fields
      const updatedStages = filteredStages.map((stage, idx) => {
        if (idx === filteredStages.length - 1 && !stage.dispatchBatchQuantity) {
          return {
            ...stage,
            dispatchBatchQuantity: 500,
            packingTime: 8,
          };
        }
        return stage;
      });
      onChange(updatedStages);
    }
  };

  const duplicateStage = (index) => {
    if (stages.length >= 20) return;
    
    const stageToDuplicate = stages[index];
    
    // Remove dispatch fields from the previous last stage
    const updatedStages = stages.map((stage, idx) => {
      if (idx === stages.length - 1) {
        const { dispatchBatchQuantity, packingTime, ...stageWithoutDispatch } = stage;
        return stageWithoutDispatch;
      }
      return stage;
    });
    
    const newStage = {
      ...stageToDuplicate,
      id: Date.now(),
      name: `${stageToDuplicate.name} (Copy)`,
      // Always add dispatch fields to the new last stage
      dispatchBatchQuantity: stageToDuplicate.dispatchBatchQuantity || 500,
      packingTime: stageToDuplicate.packingTime || 8,
    };
    
    onChange([...updatedStages, newStage]);
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

  const expandAll = () => {
    // This would require state management for all cards
  };

  const collapseAll = () => {
    // This would require state management for all cards
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <LayersIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Production Stages</h3>
            <p className="text-sm text-slate-600">
              {stages.length} {stages.length === 1 ? 'stage' : 'stages'} configured
              {stages.length >= 20 && ' (maximum reached)'}
            </p>
          </div>
        </div>

        <button
          onClick={addStage}
          disabled={stages.length >= 20}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2 justify-center"
        >
          <PlusIcon className="w-5 h-5" />
          Add Stage
        </button>
      </div>

      {/* Stage Cards */}
      <div className="space-y-4">
        {stages.map((stage, index) => (
          <StageCard
            key={stage.id || index}
            stage={stage}
            index={index}
            updateStage={updateStage}
            removeStage={removeStage}
            duplicateStage={duplicateStage}
            canRemove={stages.length > 1}
            totalStages={stages.length}
            isLastStage={index === stages.length - 1}
          />
        ))}
      </div>

      {/* Footer Info */}
      {stages.length >= 20 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg flex items-start gap-3">
          <QuestionMarkCircleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900">Maximum stages reached</p>
            <p className="text-sm text-amber-800 mt-1">
              You've reached the maximum of 20 production stages. Remove a stage to add another.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
