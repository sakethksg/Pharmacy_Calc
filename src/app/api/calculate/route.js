/**
 * API Route: /api/calculate
 * Performs production planning calculations
 */

import { NextResponse } from 'next/server';
import { validateProductionPlan, checkLogicalWarnings } from '@/lib/validator';
import { calculateBackward, calculateEfficiency } from '@/lib/calculator';
import { scheduleBatches, formatScheduleSummary } from '@/lib/scheduler';
import { parse } from 'date-fns';

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate input
    const validation = validateProductionPlan(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check for logical warnings
    const warnings = checkLogicalWarnings(data);

    // Perform backward calculation
    const calculationResults = calculateBackward(
      data.stages,
      data.targetFinalOutput
    );

    // Calculate efficiency metrics
    const efficiency = calculateEfficiency(
      calculationResults,
      data.targetFinalOutput
    );

    // Parse start date
    const startDate = parse(data.startDate, 'yyyy-MM-dd', new Date());

    // Perform forward scheduling
    const scheduleResults = scheduleBatches(calculationResults, startDate);

    // Format summary
    const summary = formatScheduleSummary(scheduleResults);

    return NextResponse.json({
      success: true,
      data: {
        productName: data.productName,
        targetFinalOutput: data.targetFinalOutput,
        startDate: data.startDate,
        calculationResults,
        scheduleResults,
        efficiency,
        summary,
        warnings,
      },
    });
  } catch (error) {
    console.error('Calculation error:', error);
    return NextResponse.json(
      {
        error: 'Calculation failed',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
