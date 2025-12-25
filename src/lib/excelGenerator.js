/**
 * Excel generation using exceljs
 * Creates formatted multi-sheet workbooks with all calculation and schedule data
 */

import ExcelJS from 'exceljs';
import { format } from 'date-fns';

/**
 * Generate Excel workbook from calculation and schedule results
 * @param {Object} params - Parameters including calculation, schedule, and input data
 * @returns {Promise<Buffer>} Excel file buffer
 */
export async function generateExcel({
  productName,
  targetFinalOutput,
  startDate,
  calculationResults,
  scheduleResults,
  dispatchSchedule,
  efficiency,
}) {
  const workbook = new ExcelJS.Workbook();

  // Set workbook properties
  workbook.creator = 'Pharma Production Planner';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Sheet 1: Summary
  createSummarySheet(workbook, {
    productName,
    targetFinalOutput,
    startDate,
    calculationResults,
    scheduleResults,
    efficiency,
  });

  // Sheet 2-N: Stage Details
  scheduleResults.stages.forEach((stage, idx) => {
    createStageSheet(workbook, stage, calculationResults.stages[idx]);
  });

  // Sheet N+1: Dispatch Schedule (if available)
  if (dispatchSchedule && dispatchSchedule.dispatches && dispatchSchedule.dispatches.length > 0) {
    createDispatchSheet(workbook, dispatchSchedule);
  }

  // Sheet N+2: Backward Calculation
  createBackwardCalculationSheet(workbook, calculationResults);

  // Return buffer
  return await workbook.xlsx.writeBuffer();
}

/**
 * Create summary sheet
 */
function createSummarySheet(workbook, data) {
  const sheet = workbook.addWorksheet('Summary', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  });

  // Set column widths
  sheet.columns = [
    { width: 30 },
    { width: 30 },
  ];

  // Title
  sheet.mergeCells('A1:B1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = 'Production Planning Summary';
  titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0284C7' },
  };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 30;

  // Add data
  const summaryData = [
    ['', ''],
    ['Product Information', ''],
    ['Product Name', data.productName],
    ['Target Final Output', `${data.targetFinalOutput} kg`],
    ['Actual Final Output', `${data.efficiency.actualOutput} kg`],
    ['Overproduction', `${data.efficiency.overproduction.toFixed(2)} kg (${data.efficiency.overproductionPercentage}%)`],
    ['', ''],
    ['Production Timeline', ''],
    ['Start Date', format(data.scheduleResults.startDate, 'dd-MM-yyyy')],
    ['End Date', format(data.scheduleResults.endDate, 'dd-MM-yyyy')],
    ['Total Production Time', `${data.scheduleResults.totalProductionTimeDays} days`],
    ['', ''],
    ['Production Statistics', ''],
    ['Total Stages', data.calculationResults.stages.length],
    ['Total Batches', data.scheduleResults.stages.reduce((sum, s) => sum + s.batches.length, 0)],
    ['Overall Yield', `${data.efficiency.overallYieldPercentage}%`],
    ['Total Input Required', `${data.efficiency.totalInput.toFixed(2)} kg`],
    ['', ''],
    ['Report Generated', format(new Date(), 'dd-MM-yyyy')],
  ];

  summaryData.forEach((row, idx) => {
    const rowNum = idx + 1;
    sheet.getRow(rowNum).values = row;
    
    // Style header rows
    if (row[0] && !row[1] && row[0] !== '') {
      const cell = sheet.getCell(`A${rowNum}`);
      cell.font = { bold: true, size: 12, color: { argb: 'FF0369A1' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0F2FE' },
      };
      sheet.mergeCells(`A${rowNum}:B${rowNum}`);
    }
  });

  // Apply borders
  const lastRow = summaryData.length;
  for (let row = 2; row <= lastRow; row++) {
    for (let col = 1; col <= 2; col++) {
      const cell = sheet.getCell(row, col);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }
  }
}

/**
 * Create stage detail sheet
 */
function createStageSheet(workbook, stageSchedule, stageCalculation) {
  const sheet = workbook.addWorksheet(`Stage-${stageSchedule.stageNumber}`, {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 2 }]
  });

  // Set column widths
  sheet.columns = [
    { width: 12 }, // Batch No
    { width: 20 }, // Start
    { width: 20 }, // Completion
    { width: 20 }, // Analysis Done
    { width: 20 }, // Pack Time
    { width: 20 }, // Print Time
    { width: 15 }, // Input
    { width: 15 }, // Output
    { width: 15 }, // Cumulative
  ];

  // Title
  sheet.mergeCells('A1:I1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = `${stageSchedule.stageName} - Batch Schedule`;
  titleCell.font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0369A1' },
  };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 25;

  // Stage info
  sheet.getRow(2).values = [
    'Yield:', `${stageCalculation.yieldPercentage}%`,
    'Required Batches:', stageCalculation.batchCount,
    'Total Output:', `${stageSchedule.totalOutput} kg`
  ];
  sheet.getRow(2).font = { bold: true };
  sheet.getRow(2).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF0F9FF' },
  };

  // Headers
  const headers = ['Batch No', 'Start Time', 'Completion Time', 'Analysis Done', 'Pack Time', 'Print Time', 'Input (kg)', 'Output (kg)', 'Cumulative (kg)'];
  sheet.getRow(3).values = headers;
  sheet.getRow(3).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(3).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0284C7' },
  };
  sheet.getRow(3).alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(3).height = 20;

  // Data rows
  stageSchedule.batches.forEach((batch, idx) => {
    const rowNum = 4 + idx;
    sheet.getRow(rowNum).values = [
      batch.batchId,
      batch.startTimeFormatted,
      batch.completionTimeFormatted,
      batch.analysisDoneTimeFormatted,
      batch.packTimeFormatted,
      batch.printTimeFormatted,
      batch.inputQuantity,
      batch.outputQuantity,
      batch.cumulativeOutput,
    ];

    // Alternate row colors
    if (idx % 2 === 0) {
      sheet.getRow(rowNum).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF0F9FF' },
      };
    }
  });

  // Apply borders to all cells
  const lastRow = 3 + stageSchedule.batches.length;
  for (let row = 2; row <= lastRow; row++) {
    for (let col = 1; col <= 9; col++) {
      const cell = sheet.getCell(row, col);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }
  }
}

/**
 * Create backward calculation sheet
 */
function createBackwardCalculationSheet(workbook, calculationResults) {
  const sheet = workbook.addWorksheet('Backward Calculation', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  });

  // Set column widths
  sheet.columns = [
    { width: 15 },
    { width: 20 },
    { width: 18 },
    { width: 18 },
    { width: 12 },
    { width: 18 },
    { width: 18 },
    { width: 15 },
  ];

  // Title
  sheet.mergeCells('A1:H1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = 'Backward Calculation Analysis';
  titleCell.font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0369A1' },
  };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 25;

  // Headers
  const headers = [
    'Stage',
    'Stage Name',
    'Input/Batch',
    'Output/Batch',
    'Yield %',
    'Required Output',
    'Required Input',
    'Batch Count',
  ];
  sheet.getRow(2).values = headers;
  sheet.getRow(2).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(2).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0284C7' },
  };
  sheet.getRow(2).alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(2).height = 20;

  // Data rows
  calculationResults.stages.forEach((stage, idx) => {
    const rowNum = 3 + idx;
    sheet.getRow(rowNum).values = [
      stage.stageNumber,
      stage.stageName,
      `${stage.inputPerBatch} kg`,
      `${stage.outputPerBatch} kg`,
      `${stage.yieldPercentage}%`,
      `${stage.requiredOutput.toFixed(2)} kg`,
      `${stage.requiredInput.toFixed(2)} kg`,
      stage.batchCount,
    ];

    // Alternate row colors
    if (idx % 2 === 0) {
      sheet.getRow(rowNum).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF0F9FF' },
      };
    }
  });

  // Apply borders
  const lastRow = 2 + calculationResults.stages.length;
  for (let row = 2; row <= lastRow; row++) {
    for (let col = 1; col <= 8; col++) {
      const cell = sheet.getCell(row, col);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }
  }
}

/**
 * Create dispatch schedule sheet
 */
function createDispatchSheet(workbook, dispatchSchedule) {
  const sheet = workbook.addWorksheet('Dispatch Schedule', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 2 }]
  });

  // Set column widths
  sheet.columns = [
    { width: 15 }, // Dispatch Batch
    { width: 20 }, // Packing Start
    { width: 20 }, // Packing Complete
    { width: 20 }, // Dispatch Ready
    { width: 18 }, // Quantity
    { width: 18 }, // Cumulative
  ];

  // Title
  sheet.mergeCells('A1:F1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = 'Dispatch & Packing Schedule';
  titleCell.font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF59E0B' }, // Amber color
  };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 25;

  // Info row
  sheet.getRow(2).values = [
    'Batch Size:', `${dispatchSchedule.dispatchBatchQuantity} kg`,
    'Packing Time:', `${dispatchSchedule.packingTimeHours} hrs`,
    'Total Batches:', dispatchSchedule.totalBatches
  ];
  sheet.getRow(2).font = { bold: true };
  sheet.getRow(2).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFEF3C7' },
  };

  // Headers
  const headers = ['Dispatch Batch', 'Packing Start', 'Packing Complete', 'Dispatch Ready', 'Quantity (kg)', 'Cumulative (kg)'];
  sheet.getRow(3).values = headers;
  sheet.getRow(3).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(3).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD97706' },
  };
  sheet.getRow(3).alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(3).height = 20;

  // Data rows
  dispatchSchedule.dispatches.forEach((dispatch, idx) => {
    const rowNum = 4 + idx;
    sheet.getRow(rowNum).values = [
      dispatch.dispatchBatchId,
      dispatch.packingStartTimeFormatted,
      dispatch.packingCompleteTimeFormatted,
      dispatch.dispatchReadyTimeFormatted,
      dispatch.quantityPacked.toFixed(2),
      dispatch.cumulativeDispatched.toFixed(2),
    ];

    // Alternate row colors
    if (idx % 2 === 0) {
      sheet.getRow(rowNum).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFEF3C7' },
      };
    }
  });

  // Apply borders to all cells
  const lastRow = 3 + dispatchSchedule.dispatches.length;
  for (let row = 2; row <= lastRow; row++) {
    for (let col = 1; col <= 6; col++) {
      const cell = sheet.getCell(row, col);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }
  }
}
