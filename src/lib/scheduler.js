/**
 * Time-based scheduler for batch production with material dependencies
 * Simulates forward scheduling respecting frequency, duration, analysis time, and material availability
 */

import { addHours, format } from 'date-fns';

/**
 * Schedule batches for all stages with time-based constraints and material dependencies
 * @param {Object} calculationResults - Results from calculateBackward
 * @param {Date} startDate - Production start date
 * @returns {Object} Scheduled batches for all stages
 */
export function scheduleBatches(calculationResults, startDate) {
  const scheduledStages = [];

  // Track available analyzed material from each stage
  const availableAnalyzedMaterial = new Array(calculationResults.stages.length).fill(0);
  const lastBatchTimes = new Array(calculationResults.stages.length).fill(null);

  for (let stageIdx = 0; stageIdx < calculationResults.stages.length; stageIdx++) {
    const stage = calculationResults.stages[stageIdx];
    const batches = [];
    let cumulativeOutput = 0;

    for (let batchNum = 1; batchNum <= stage.batchCount; batchNum++) {
      let batchStartTime;

      if (batchNum === 1) {
        // First batch of this stage
        if (stageIdx === 0) {
          // First stage starts at the given start date
          batchStartTime = new Date(startDate);
        } else {
          // Downstream stage: wait for enough analyzed material from previous stage
          batchStartTime = waitForMaterial(
            scheduledStages[stageIdx - 1].batches,
            stage.inputPerBatch,
            new Date(startDate)
          );
        }
      } else {
        // Subsequent batches
        const earliestByFrequency = addHours(lastBatchTimes[stageIdx], stage.frequency);

        if (stageIdx === 0) {
          // First stage only respects frequency
          batchStartTime = earliestByFrequency;
        } else {
          // Downstream stages must also check material availability
          const materialNeeded = stage.inputPerBatch;
          const materialAvailableTime = waitForMaterial(
            scheduledStages[stageIdx - 1].batches,
            materialNeeded * batchNum, // Cumulative material needed
            earliestByFrequency
          );

          batchStartTime = new Date(Math.max(
            earliestByFrequency.getTime(),
            materialAvailableTime.getTime()
          ));
        }
      }

      const completionTime = addHours(batchStartTime, stage.duration);
      const analysisDoneTime = addHours(completionTime, stage.analysisDuration);

      cumulativeOutput += stage.outputPerBatch;

      batches.push({
        batchNumber: batchNum,
        batchId: `#${String(batchNum).padStart(3, '0')}`,
        startTime: batchStartTime,
        startTimeFormatted: format(batchStartTime, 'dd-MM-yyyy'),
        completionTime: completionTime,
        completionTimeFormatted: format(completionTime, 'dd-MM-yyyy'),
        analysisDoneTime: analysisDoneTime,
        analysisDoneTimeFormatted: format(analysisDoneTime, 'dd-MM-yyyy'),
        inputQuantity: stage.inputPerBatch,
        outputQuantity: stage.outputPerBatch,
        cumulativeOutput: cumulativeOutput,
      });

      lastBatchTimes[stageIdx] = batchStartTime;
    }

    scheduledStages.push({
      stageNumber: stage.stageNumber,
      stageName: stage.stageName,
      batches: batches,
      totalInput: stage.batchCount * stage.inputPerBatch,
      totalOutput: cumulativeOutput,
      startTime: batches[0].startTime,
      endTime: batches[batches.length - 1].analysisDoneTime,
    });
  }

  // Calculate total production time
  const firstBatchStart = scheduledStages[0].batches[0].startTime;
  const lastBatchEnd = scheduledStages[scheduledStages.length - 1].endTime;
  const totalProductionTimeHours = (lastBatchEnd - firstBatchStart) / (1000 * 60 * 60);

  return {
    stages: scheduledStages,
    startDate: firstBatchStart,
    endDate: lastBatchEnd,
    totalProductionTimeHours: totalProductionTimeHours,
    totalProductionTimeDays: (totalProductionTimeHours / 24).toFixed(2),
  };
}

/**
 * Determine when enough analyzed material will be available from upstream batches
 * @param {Array} upstreamBatches - Completed batches from previous stage
 * @param {number} materialNeeded - Amount of material required
 * @param {Date} earliestTime - Earliest possible start time
 * @returns {Date} Time when material will be available
 */
function waitForMaterial(upstreamBatches, materialNeeded, earliestTime) {
  let cumulativeAvailable = 0;

  for (const batch of upstreamBatches) {
    cumulativeAvailable += batch.outputQuantity;

    if (cumulativeAvailable >= materialNeeded) {
      // Material is available after this batch's analysis is done
      const materialAvailableTime = batch.analysisDoneTime;

      // Return the later of material available time and earliest allowed time
      return new Date(Math.max(
        materialAvailableTime.getTime(),
        earliestTime.getTime()
      ));
    }
  }

  // If we get here, not enough material will ever be available
  // This shouldn't happen if calculations are correct
  // Return the analysis done time of the last batch
  if (upstreamBatches.length > 0) {
    return upstreamBatches[upstreamBatches.length - 1].analysisDoneTime;
  }

  return earliestTime;
}

/**
 * Format schedule summary for display
 * @param {Object} schedule - Schedule from scheduleBatches
 * @returns {Object} Formatted summary
 */
export function formatScheduleSummary(schedule) {
  return {
    startDate: format(schedule.startDate, 'dd-MM-yyyy'),
    endDate: format(schedule.endDate, 'dd-MM-yyyy'),
    totalProductionTime: `${schedule.totalProductionTimeDays} days (${schedule.totalProductionTimeHours.toFixed(1)} hours)`,
    totalStages: schedule.stages.length,
    totalBatches: schedule.stages.reduce((sum, stage) => sum + stage.batches.length, 0),
  };
}
