"use client"

import { useEffect, useRef } from "react"
import { BarChart3 } from "lucide-react"

export default function ProjectMetrics() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Sample data
    const data = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Completed Tasks",
          data: [12, 19, 15, 22, 28, 25],
          backgroundColor: "rgba(16, 185, 129, 0.6)",
        },
        {
          label: "New Tasks",
          data: [15, 22, 18, 25, 30, 28],
          backgroundColor: "rgba(59, 130, 246, 0.6)",
        },
      ],
    }

    // Draw chart
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    const barWidth = 30
    const spacing = 20
    const groupWidth = barWidth * 2 + spacing
    const chartHeight = 200
    const maxValue = Math.max(...data.datasets.flatMap((ds) => ds.data))
    const scale = chartHeight / maxValue

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(50, 20)
    ctx.lineTo(50, chartHeight + 40)
    ctx.lineTo(data.labels.length * groupWidth + 80, chartHeight + 40)
    ctx.strokeStyle = "#e2e8f0"
    ctx.stroke()

    // Draw bars
    data.labels.forEach((label, i) => {
      const x = i * groupWidth + 80

      // Draw label
      ctx.fillStyle = "#64748b"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(label, x + barWidth, chartHeight + 60)

      // Draw bars for each dataset
      data.datasets.forEach((dataset, j) => {
        const value = dataset.data[i]
        const barHeight = value * scale
        const barX = x + j * (barWidth + 5)

        ctx.fillStyle = dataset.backgroundColor
        ctx.fillRect(barX, chartHeight + 40 - barHeight, barWidth, barHeight)

        // Draw value on top of bar
        ctx.fillStyle = "#64748b"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(value.toString(), barX + barWidth / 2, chartHeight + 35 - barHeight)
      })
    })

    // Draw legend
    const legendX = 80
    const legendY = 30

    data.datasets.forEach((dataset, i) => {
      const x = legendX + i * 150

      // Draw color box
      ctx.fillStyle = dataset.backgroundColor
      ctx.fillRect(x, legendY, 15, 15)

      // Draw label
      ctx.fillStyle = "#64748b"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(dataset.label, x + 20, legendY + 12)
    })
  }, [])

  return (
    <div className="relative h-[300px] w-full">
      {/* Fallback for browsers without canvas support */}
      <div className="absolute inset-0 flex items-center justify-center">
        <BarChart3 className="h-16 w-16 text-muted-foreground/20" />
      </div>
      <canvas ref={canvasRef} width={800} height={300} className="h-full w-full" />
    </div>
  )
}
