/**
 * Core calculation engine for multi-stage batch production planning
 * Handles backward calculation from final output to determine required inputs
 */

/**
 * Calculate yield for a stage
 * @param {number} outputPerBatch - Output quantity per batch
 * @param {number} inputPerBatch - Input quantity per batch
 * @returns {number} Yield ratio
 */
export function calculateYield(outputPerBatch, inputPerBatch) {
  if (inputPerBatch <= 0) throw new Error('Input per batch must be positive');
  return outputPerBatch / inputPerBatch;
}

/**
 * Work backward from final output to determine required inputs for each stage
 * @param {Array} stages - Array of stage objects with input/output per batch
 * @param {number} finalTarget - Target final output quantity
 * @returns {Object} Calculation results with yields, required inputs, and batch counts
 */
export function calculateBackward(stages, finalTarget) {
  const n = stages.length;
  const results = {
    stages: [],
    finalOutput: 0,
  };

  // Initialize arrays
  const yields = new Array(n);
  const requiredOutputs = new Array(n);
  const requiredInputs = new Array(n);
  const batchCounts = new Array(n);

  // Calculate yields for all stages
  for (let i = 0; i < n; i++) {
    yields[i] = calculateYield(
      stages[i].outputPerBatch,
      stages[i].inputPerBatch
    );
  }

  // Work backward from final stage
  requiredOutputs[n - 1] = finalTarget;

  for (let i = n - 1; i >= 0; i--) {
    // Calculate required input for this stage
    requiredInputs[i] = requiredOutputs[i] / yields[i];

    // Calculate number of batches needed (round up)
    batchCounts[i] = Math.ceil(requiredInputs[i] / stages[i].inputPerBatch);

    // Calculate actual output based on whole batches
    const actualOutput = batchCounts[i] * stages[i].outputPerBatch;

    // If not the first stage, set required output for previous stage
    if (i > 0) {
      requiredOutputs[i - 1] = requiredInputs[i];
    }

    results.stages.push({
      stageNumber: i + 1,
      stageName: stages[i].name || `Stage-${i + 1}`,
      inputPerBatch: stages[i].inputPerBatch,
      outputPerBatch: stages[i].outputPerBatch,
      yield: yields[i],
      yieldPercentage: (yields[i] * 100).toFixed(2),
      requiredOutput: requiredOutputs[i],
      requiredInput: requiredInputs[i],
      batchCount: batchCounts[i],
      actualOutput: actualOutput,
      frequency: stages[i].frequency,
      duration: stages[i].duration,
      analysisDuration: stages[i].analysisDuration,
    });
  }

  // Reverse to get stages in correct order (1, 2, 3...)
  results.stages.reverse();

  // Final output is the actual output of the last stage
  results.finalOutput = results.stages[n - 1].actualOutput;

  return results;
}

/**
 * Calculate efficiency metrics for the production plan
 * @param {Object} calculationResults - Results from calculateBackward
 * @param {number} targetOutput - Original target output
 * @returns {Object} Efficiency metrics
 */
export function calculateEfficiency(calculationResults, targetOutput) {
  const finalStage = calculationResults.stages[calculationResults.stages.length - 1];
  
  const overproduction = finalStage.actualOutput - targetOutput;
  const overproductionPercentage = ((overproduction / targetOutput) * 100).toFixed(2);
  
  // Calculate overall yield (first stage input to final stage output)
  const firstStage = calculationResults.stages[0];
  const totalInput = firstStage.batchCount * firstStage.inputPerBatch;
  const overallYield = finalStage.actualOutput / totalInput;
  
  return {
    targetOutput,
    actualOutput: finalStage.actualOutput,
    overproduction,
    overproductionPercentage: parseFloat(overproductionPercentage),
    totalInput,
    overallYield,
    overallYieldPercentage: (overallYield * 100).toFixed(2),
    totalStages: calculationResults.stages.length,
  };
}
