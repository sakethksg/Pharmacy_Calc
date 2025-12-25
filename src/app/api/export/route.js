/**
 * API Route: /api/export
 * Generates and downloads Excel file with production plan
 */

import { NextResponse } from 'next/server';
import { generateExcel } from '@/lib/excelGenerator';

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate that required data is present
    if (!body.calculationResults || !body.scheduleResults) {
      return NextResponse.json(
        {
          error: 'Missing required data',
          message: 'calculationResults and scheduleResults are required',
        },
        { status: 400 }
      );
    }

    // Generate Excel file
    const buffer = await generateExcel({
      productName: body.productName,
      targetFinalOutput: body.targetFinalOutput,
      startDate: body.startDate,
      calculationResults: body.calculationResults,
      scheduleResults: body.scheduleResults,
      dispatchSchedule: body.dispatchSchedule,
      efficiency: body.efficiency,
    });

    // Create filename
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${body.productName.replace(/[^a-z0-9]/gi, '_')}_Production_Plan_${timestamp}.xlsx`;

    // Return file as response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Excel generation error:', error);
    return NextResponse.json(
      {
        error: 'Excel generation failed',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
