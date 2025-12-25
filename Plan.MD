# Multi‑Stage Batch Production Planning — Plan

## Technology Stack

**Frontend:**
- React.js or Next.js for UI
- Tailwind CSS or Material-UI for styling
- Excel export using `exceljs` library

**Backend:**
- Node.js with Express or Next.js API routes
- API endpoints for calculations
- Excel generation server-side

**Deployment:**
- Vercel (supports Next.js/Node.js)
- Serverless functions for backend logic
- Environment variables for configuration

---

## Problem Overview

We need an application that automates **multi‑stage batch production planning** where:

* The **final product output** (not the initial raw input) is the target — e.g., 10,000 kg.
* Material passes sequentially through multiple stages.
* Each stage consumes the previous stage’s analyzed output.
* Batches have frequency, processing duration, and analysis release time.

The system must automatically:

1. Accept stage definitions and a target final output.
2. Work **backward** to determine how much material is required at each stage.
3. Determine how many batches each stage must run.
4. Simulate time‑based batch scheduling respecting:

   * batch frequency
   * processing duration
   * analysis delay
   * upstream material availability
5. Produce batch tables for every stage.
6. **Generate downloadable Excel reports** with all calculations and schedules.

A downstream batch may only start when **enough analyzed quantity is available** from the previous stage.

---

## Input Structure

### Required Fields
* Product name (string, max 100 chars)
* Target final output (number, > 0, kg)
* Start date (date format: DD-MM-YYYY or ISO)
* Number of stages (integer, 1-20)

### For Each Stage
* Stage name/number (auto-generated or custom)
* Input per batch (number, > 0, kg)
* Output per batch (number, > 0, kg)
* Batch frequency (number, > 0, hours)
* Batch duration (number, > 0, hours)
* Analysis duration (number, ≥ 0, hours)

### Input Validation Rules
* All numeric values must be positive
* Output per batch can be less than or greater than input (loss or concentration)
* Batch frequency must be ≥ batch duration (logical constraint)
* Start date cannot be in the past (warning only)
* Maximum 20 stages to prevent performance issues

---

## Key Idea: Work Backward From Final Output

Unlike standard systems that begin with raw material, this model begins with:

> **Desired final product quantity**

We compute yields per stage:

```
yield(stage) = output_per_batch ÷ input_per_batch
```

Then compute recursively backward:

```
required_input(previous_stage) = required_output(current_stage) ÷ yield(current_stage)
```

Round up to whole batches at each stage.

---

## High‑Level Algorithm

1. **Read inputs** (stages, start date, final target output).
2. For each stage, compute yield:

   ```
   yield = output_per_batch / input_per_batch
   ```
3. Work **backward** from final stage:

   ```
   required_input[i-1] = required_output[i] / yield[i]
   ```
4. Compute required batches:

   ```
   batches[i] = ceil(required_input[i] / input_per_batch[i])
   ```
5. **Forward simulate scheduling** for each stage:

   * Determine earliest possible batch start:

     ```
     start_time = max(prev_batch_start + frequency,
                      time_when_required_material_is_available)
     ```
   * completion = start_time + duration
   * analysis_done = completion + analysis
   * update cumulative available quantity
6. Pass analyzed output downstream as available input.
7. Stop when final stage cumulative ≥ target.

---

## What the System Produces

### Web Interface Output
For every stage, generate an interactive table:

```
Batch No | Start | Completion | Analysis Done | Input (kg) | Output (kg) | Cumulative (kg)
```

Tables respect time gaps and material dependencies.

### Excel Export Structure

**Sheet 1: Summary**
- Product name
- Target final output
- Start date
- Total stages
- Total production time
- Final cumulative output
- Calculation timestamp

**Sheet 2-N: Stage Details** (one sheet per stage)
- Stage number and name
- Yield percentage
- Required batches
- Full batch schedule table with all columns
- Stage-specific metrics (total input, total output, efficiency)

**Sheet N+1: Backward Calculation**
- Stage-by-stage yield analysis
- Required input calculations
- Batch count determination

**Formatting:**
- Header rows with bold styling
- Date columns formatted as DD-MM-YYYY HH:MM
- Numeric columns with appropriate decimal places
- Color coding for different stages
- Auto-fit column widths

---

## Sample Input (Plain Text)

Product Name: ABC
Target Final Output: 1000 kg
Start Date: 25-12-2025

Number of Stages: 2

Stage-1
Input per batch: 200 kg
Output per batch: 250 kg
Batch frequency: 24 hours
Batch duration: 24 hours
Analysis duration: 24 hours

Stage-2
Input per batch: 300 kg
Output per batch: 180 kg
Batch frequency: 24 hours
Batch duration: 24 hours
Analysis duration: 24 hours

---

## Sample Output (Plain Text)

Explanation:
Stage‑2 must produce 1000 kg.
Each batch outputs 180 kg → 6 batches (≈1080 kg).
Stage‑1 must supply enough analyzed input to feed Stage‑2.

Stage‑1 example table:

```
#001 25-12-2025 26-12-2025 27-12-2025 200 250 250
#002 26-12-2025 27-12-2025 28-12-2025 200 250 500
...
```

Stage‑2 example table:

```
#001 29-12-2025 30-12-2025 31-12-2025 300 180 180
#002 30-12-2025 31-12-2025 01-01-2026 300 180 360
...
```

Final output ≈ 1080 kg (meets the target).

---

## Features to Implement

### Core Features
* ✓ Editable stage table with add/remove rows
* ✓ Automatic batch/yield calculations
* ✓ Time‑based scheduler with material dependencies
* ✓ Real-time validation and error messages
* ✓ Responsive design (mobile, tablet, desktop)

### Export Features
* **Excel Download** (primary) - Multi-sheet workbook with formatting
* CTechnical Implementation Details

### Project Structure
```
pharma-calc/
├── package.json
├── next.config.js
├── vercel.json
├── .env.local
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── api/
│   │       ├── calculate/route.js
│   │       └── export/route.js
│   ├── components/
│   │   ├── StageInput.jsx
│   │   ├── ResultsTable.jsx
│   │   ├── ExportButton.jsx
│   │   └── ValidationMessage.jsx
│   ├── lib/
│   │   ├── calculator.js
│   │   ├── scheduler.js
│   │   ├── validator.js
│   │   └── excelGenerator.js
│   └── utils/
│       ├── dateUtils.js
│       └── formatters.js
└── README.md
```

### Key Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "exceljs": "^4.4.0",
    "date-fns": "^3.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### API Endpoints

**POST /api/calculate**
- Input: JSON with stages, target output, start date
- Output: Calculated batch schedules for all stages
- Validation: Zod schema validation
- Error handling: 400 for validation errors, 500 for calculation errors

**POST /api/export**
- Input: Calculation results + format (excel/csv)
- Output: File download (binary stream)
- Uses `exceljs` for Excel generation
- Implements streaming for large files

### Vercel Deployment Configuration

**vercel.json:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "regions": ["iad1"]
}
```

**Environment Variables:**
- `NODE_ENV`: production/development
- `MAX_STAGES`: 20 (configurable limit)
- `CALCULATION_TIMEOUT`: 30000 (ms)

### Excel Generation Logic (exceljs)

```javascript
// lib/excelGenerator.js
import ExcelJS from 'exceljs';

async function generateExcel(data) {
  const workbook = new ExcelJS.Workbook();
  
  // Summary sheet
  const summary = workbook.addWorksheet('Summary');
  // ... add summary data
  
  // Stage sheets
  data.stages.forEach((stage, idx) => {
    const sheet = workbook.addWorksheet(`Stage-${idx + 1}`);
    // ... add stage data with formatting
  });
  
  // Return buffer for download
  return await workbook.xlsx.writeBuffer();
}
```

### Deployment Steps

1. **Setup:**
   ```bash
   npm create next-app@latest pharma-calc
   cd pharma-calc
   npm install exceljs date-fns zod
   ```

2. **Development:**
   ```bash
   npm run dev
   # Test at http://localhost:3000
   ```

3. **Vercel Deployment:**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

4. **Post-Deployment:**
   - Configure custom domain (optional)
   - Set environment variables in Vercel dashboard
   - Enable analytics and monitoring

## AI Builder Prompt (for generating the app)

"""
Build a multi‑stage batch production planning application using Next.js and Node.js, deployable on Vercel.

**Technology Requirements:**
* Framework: Next.js 14+ (React)
* Styling: Tailwind CSS
* Excel Export: exceljs library
* Date handling: date-fns
* Validation: Zod
* Deployment: Vercel-ready configuration

**Core Requirements:**

1. **Input Interface:**
   - Form to accept product name, target final output, start date
   - Dynamic table to add/edit/remove production stages
   - Each stage has: input/batch, output/batch, frequency, duration, analysis time
   - Real-time validation with error messages

2. **Calculation Engine:**
   - Compute backward from final output to determine required input per stage
   - Calculate yield per stage (output/input ratio)
   - Determine required number of batches per stage
   - Forward-simulate scheduling respecting:
     * Batch frequency constraints
     * Processing duration
     * Analysis delay before material is available
     * Material dependency (downstream waits for upstream analyzed output)

3. **Output Display:**
   - Interactive tables for each stage showing:
     * Batch No | Start | Completion | Analysis Done | Input | Output | Cumulative
   - Summary metrics (total time, efficiency, final output vs target)
   - Visual indicators for warnings/errors

4. **Excel Export (Primary Feature):**
   - Generate multi-sheet Excel workbook using exceljs
   - Sheet 1: Summary with metadata and key metrics
   - Sheet 2-N: One sheet per stage with full batch schedule
   - Sheet N+1: Backward calculation breakdown
   - Professional formatting: headers, date formats, number formats, colors
   - Immediate download on button click

5. **API Structure:**
   - POST /api/calculate - Performs calculations, returns JSON
   - POST /api/export - Generates and streams Excel file

6. **Validation & Error Handling:**
   - Validate all inputs (positive numbers, valid dates, logical constraints)
   - Detect impossible plans and show helpful messages
   - Handle calculation timeouts gracefully
   - Provide loading states during processing

7. **Deployment:**
   - Include vercel.json configuration
   - Environment variables setup instructions
   - README with deployment steps
   - Optimize for Vercel's serverless functions

**Deliverables:**
- Complete Next.js project structure
- All components and API routes
- Excel generation with proper formatting
- Responsive UI with Tailwind CSS
- Vercel deployment configuration
- README with setup and deployment instructions
"""

---

## Success Criteria

✅ **Functional:**
- Accurate backward calculation of material requirements
- Correct time-based scheduling with dependencies
- Excel file downloads successfully with all data

✅ **Technical:**
- Deploys successfully to Vercel
- API response time < 5 seconds for typical scenarios
- Excel generation works for up to 20 stages, 1000+ batches

✅ **User Experience:**
- Intuitive form interface
- Clear error messages
- One-click Excel download
- Mobile-responsive design

---

This comprehensive plan provides the complete specification for building and deploying the multi-stage batch production planning application
* Debounced input validation
* Optimized Excel generation
* Client-side caching

---

## AI Builder Prompt (for generating the app)

"""
Build an application that automates multi‑stage batch production planning.

Requirements:

* Accept table of production stages
* Accept start date and target FINAL output
* Compute backward to determine required input and batches per stage
* Forward‑simulate scheduling respecting frequency, duration, and analysis time
* Enforce material dependency between stages
* Stop when final cumulative output reaches the target
* Output tables with: Batch No, Start, Completion, Analysis Done, Input, Output, Cumulative
* Allow exports to CSV/Excel and show explanations of calculations
  """

---

This plan defines the logic, data model, algorithm, and the prompt needed to instruct an AI builder to create the tool.
