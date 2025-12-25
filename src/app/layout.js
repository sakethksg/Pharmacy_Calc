import './globals.css'

export const metadata = {
  title: 'Multi-Stage Batch Production Planner',
  description: 'Automated production planning with backward calculation and time-based scheduling',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
