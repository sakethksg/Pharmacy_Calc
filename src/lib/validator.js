/**
 * Input validation using Zod schemas
 * Validates all user inputs before processing
 */

import { z } from 'zod';

// Stage schema
export const stageSchema = z.object({
  name: z.string().max(100).optional(),
  inputPerBatch: z.number().positive('Input per batch must be positive'),
  outputPerBatch: z.number().positive('Output per batch must be positive'),
  frequency: z.number().positive('Batch frequency must be positive'),
  duration: z.number().positive('Batch duration must be positive'),
  analysisDuration: z.number().min(0, 'Analysis duration cannot be negative'),
}).refine((data) => data.frequency >= data.duration, {
  message: 'Batch frequency must be greater than or equal to batch duration',
  path: ['frequency'],
});

// Production plan schema
export const productionPlanSchema = z.object({
  productName: z.string()
    .min(1, 'Product name is required')
    .max(100, 'Product name must be less than 100 characters'),
  targetFinalOutput: z.number().positive('Target final output must be positive'),
  startDate: z.string().regex(
    /^\d{4}-\d{2}-\d{2}$/,
    'Start date must be in YYYY-MM-DD format'
  ),
  stages: z.array(stageSchema)
    .min(1, 'At least one stage is required')
    .max(20, 'Maximum 20 stages allowed'),
});

/**
 * Validate production plan input
 * @param {Object} data - Input data to validate
 * @returns {Object} Validation result with success flag and data/errors
 */
export function validateProductionPlan(data) {
  try {
    const validated = productionPlanSchema.parse(data);
    return {
      success: true,
      data: validated,
      errors: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return {
      success: false,
      data: null,
      errors: [{ path: 'unknown', message: error.message }],
    };
  }
}

/**
 * Validate individual stage
 * @param {Object} stage - Stage data to validate
 * @returns {Object} Validation result
 */
export function validateStage(stage) {
  try {
    const validated = stageSchema.parse(stage);
    return {
      success: true,
      data: validated,
      errors: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.errors.map(err => ({
          field: err.path[0],
          message: err.message,
        })),
      };
    }
    return {
      success: false,
      data: null,
      errors: [{ field: 'unknown', message: error.message }],
    };
  }
}

/**
 * Check for logical issues in the production plan
 * @param {Object} validatedData - Validated production plan data
 * @returns {Array} Array of warning messages
 */
export function checkLogicalWarnings(validatedData) {
  const warnings = [];

  // Check if start date is in the past
  const startDate = new Date(validatedData.startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (startDate < today) {
    warnings.push({
      type: 'warning',
      message: 'Start date is in the past',
    });
  }

  // Check for stages with loss (output < input)
  validatedData.stages.forEach((stage, idx) => {
    if (stage.outputPerBatch < stage.inputPerBatch) {
      const loss = ((1 - stage.outputPerBatch / stage.inputPerBatch) * 100).toFixed(1);
      warnings.push({
        type: 'info',
        message: `Stage ${idx + 1} has ${loss}% material loss`,
      });
    }
  });

  // Check for very long analysis times
  validatedData.stages.forEach((stage, idx) => {
    if (stage.analysisDuration > stage.duration * 2) {
      warnings.push({
        type: 'warning',
        message: `Stage ${idx + 1}: Analysis time (${stage.analysisDuration}h) is more than twice the batch duration`,
      });
    }
  });

  // Check for very high frequency (might indicate error)
  validatedData.stages.forEach((stage, idx) => {
    if (stage.frequency > 168) { // More than a week
      warnings.push({
        type: 'warning',
        message: `Stage ${idx + 1}: Batch frequency is very high (${stage.frequency} hours)`,
      });
    }
  });

  return warnings;
}
