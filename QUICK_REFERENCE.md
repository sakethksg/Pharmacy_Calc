# Quick Reference Card

## 🚀 Start Application
```bash
npm run dev
```
Then open: http://localhost:3000

## 📦 Install Dependencies
```bash
npm install
```

## 🌐 Deploy to Vercel
```bash
vercel --prod
```

## 🔧 Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint |

## 📁 Key Files
| File | Purpose |
|------|---------|
| `src/app/page.js` | Main UI page |
| `src/lib/calculator.js` | Backward calculation |
| `src/lib/scheduler.js` | Batch scheduling |
| `src/lib/excelGenerator.js` | Excel export |
| `src/app/api/calculate/route.js` | Calculation API |
| `src/app/api/export/route.js` | Export API |

## 🎯 Default Example
- Product: `ABC`
- Target: `1000 kg`
- Stage-1: Input 200, Output 250 (24h/24h/24h)
- Stage-2: Input 300, Output 180 (24h/24h/24h)
- Result: ~6 batches Stage-2, ~5 batches Stage-1

## 🔗 URLs
- **Local**: http://localhost:3000
- **API Calculate**: http://localhost:3000/api/calculate
- **API Export**: http://localhost:3000/api/export

## 📊 Features
✅ Backward calculation  
✅ Time-based scheduling  
✅ Material dependencies  
✅ Excel export  
✅ Real-time validation  
✅ Responsive design  

## 💡 Tips
- Maximum 20 stages supported
- All time values in hours
- Dates in YYYY-MM-DD format
- Excel auto-downloads on click
- Frequency must be ≥ duration

## 🐛 Troubleshooting
**Build error?**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Port 3000 busy?**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---
*Quick access to all essential information*
