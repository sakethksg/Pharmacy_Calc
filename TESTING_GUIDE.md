# Testing the Modern Interface

## Quick Start

1. **Install Dependencies** (if not already done):
```bash
npm install
```

2. **Run Development Server**:
```bash
npm run dev
```

3. **Open Browser**:
Navigate to `http://localhost:3000`

## What to Test

### 1. **Basic Functionality**
- [ ] Enter product name (should show green checkmark when valid)
- [ ] Enter target output > 0 (validation feedback)
- [ ] Select start date
- [ ] Set dispatch batch quantity
- [ ] Set packing time
- [ ] Add/remove stages using the new card interface
- [ ] Expand/collapse stage cards
- [ ] Duplicate a stage
- [ ] Click "Calculate Schedule"

### 2. **Keyboard Shortcuts**
- [ ] Press `Ctrl/Cmd + Enter` to calculate (when form is valid)
- [ ] Press `Esc` to close sidebar on mobile view

### 3. **Validation**
- [ ] Leave product name empty → should show error
- [ ] Set target output to 0 → should show validation error
- [ ] Try to remove the last stage → button should be disabled

### 4. **Toast Notifications**
- [ ] Calculate successfully → green success toast should appear
- [ ] Submit invalid form → red error toast should appear
- [ ] Toasts should auto-dismiss after 5 seconds
- [ ] Can manually close toasts with X button

### 5. **Export Functionality**
- [ ] Click "Export Report" button
- [ ] Should see dropdown with 3 options:
  - Excel Workbook
  - CSV File
  - Print Report
- [ ] Click outside to close dropdown
- [ ] Try exporting to Excel (should download)

### 6. **Responsive Design**
- [ ] Resize browser to mobile width (< 640px)
- [ ] Sidebar should become a drawer
- [ ] Stage cards should be collapsible
- [ ] Input fields should stack vertically
- [ ] Touch-friendly button sizes

### 7. **Visual Elements**
- [ ] Summary dashboard appears after calculation
- [ ] 6 metric cards displayed with colors
- [ ] Stage cards have drag handles (visual only)
- [ ] Tooltips appear on hover over question mark icons
- [ ] Smooth animations when expanding/collapsing
- [ ] Loading spinner during calculation

### 8. **Collapsible Stages**
- [ ] First 2 stages should be expanded by default
- [ ] Click chevron to expand/collapse
- [ ] Stage number badge visible
- [ ] Quick stats shown below collapsed stages
- [ ] All fields have inline units (kg, hrs)

### 9. **Results Section**
- [ ] Summary dashboard shows all metrics
- [ ] Results table maintains its original functionality
- [ ] Dispatch table displays correctly
- [ ] Scroll to results happens automatically
- [ ] Export button appears above results

### 10. **Sidebar Guide**
- [ ] Opens/closes on mobile
- [ ] Shows system guide steps
- [ ] Displays keyboard shortcuts
- [ ] Lists key features
- [ ] Shows input guidelines
- [ ] "Results Ready" badge appears after calculation

## Expected Behavior

### Field Validation
- Product name: Required, non-empty
- Target output: Required, must be > 0
- Dispatch batch: Required, must be > 0
- Packing time: Required, must be > 0
- Valid fields show green checkmark
- Invalid fields show red border + error message

### Stage Cards
- Default: 2 stages
- Maximum: 20 stages
- Can add, remove, duplicate
- First 2 expanded by default
- Fields: Input/Batch, Output/Batch, Frequency, Duration, Analysis, Pack Time
- Each field has tooltip explaining its purpose

### Toast Notifications
- Success: Green background, checkmark icon
- Error: Red background, X icon
- Warning: Amber background, exclamation icon
- Info: Blue background, info icon
- Auto-dismiss: 5 seconds
- Manual close: X button

### Export Options
- Excel: Downloads .xlsx file
- CSV: Downloads .csv file
- Print: Opens print dialog

## Common Issues & Solutions

### Issue: Components not rendering
**Solution**: Make sure all new component files are created in `src/components/`

### Issue: Icons not showing
**Solution**: Verify `Icons.jsx` is in `src/components/` and exports all icons

### Issue: Styles not applying
**Solution**: Run `npm run dev` again to rebuild with new CSS

### Issue: Toast not appearing
**Solution**: Check that `ToastContainer` is in `page.js` and useToast hook is imported

### Issue: Export button dropdown not working
**Solution**: Ensure click-outside handler is working (check browser console)

## Browser Compatibility

Tested on:
- Chrome/Edge (Recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Notes

- First load: ~2-3 seconds
- Calculation: < 1 second for typical inputs
- Animations: 60fps target
- No console errors expected

## Success Criteria

✅ All form fields validate correctly
✅ Toast notifications appear and dismiss
✅ Stage cards expand/collapse smoothly
✅ Export dropdown works
✅ Keyboard shortcuts function
✅ Results display correctly
✅ Responsive on mobile
✅ No console errors
✅ Professional appearance maintained

---

If any issues arise, check the browser console for error messages and verify all component files are properly created.
