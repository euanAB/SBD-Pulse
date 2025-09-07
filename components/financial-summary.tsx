"use client"

export function FinancialSummary() {
  // Mock monthly trend data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  const revenue = [8000, 9200, 8800, 10000, 11200, 12600]
  const outstanding = [1200, 900, 1500, 1100, 1000, 800]

  const max = Math.max(...revenue, ...outstanding)
  const height = 180
  const pad = 8

  return (
    <div className="w-full">
      <div className="text-sm text-muted-foreground mb-3">Revenue vs Outstanding (last 6 months)</div>
      <div className="relative">
        <svg
          width="100%"
          height={height + 40}
          viewBox={`0 0 600 ${height + 40}`}
          role="img"
          aria-label="Financial summary chart"
        >
          {/* Axes */}
          <line x1="32" y1={height} x2="580" y2={height} stroke="hsl(var(--muted-foreground))" strokeOpacity="0.2" />
          <line x1="32" y1="0" x2="32" y2={height} stroke="hsl(var(--muted-foreground))" strokeOpacity="0.2" />
          {/* Bars */}
          {months.map((m, i) => {
            const xBase = 32 + i * 90
            const revH = (revenue[i] / max) * (height - pad)
            const outH = (outstanding[i] / max) * (height - pad)
            return (
              <g key={m}>
                <rect x={xBase + 10} y={height - revH} width={28} height={revH} fill="hsl(142 76% 36%)" opacity="0.9" />
                <rect x={xBase + 42} y={height - outH} width={28} height={outH} fill="hsl(25 95% 53%)" opacity="0.8" />
                <text x={xBase + 32} y={height + 16} textAnchor="middle" fontSize="10" fill="currentColor">
                  {m}
                </text>
              </g>
            )
          })}
        </svg>
        <div className="mt-2 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "hsl(142 76% 36%)" }} />
            Revenue
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "hsl(25 95% 53%)" }} />
            Outstanding
          </div>
        </div>
      </div>
    </div>
  )
}
