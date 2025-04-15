"use client"

import { useEffect, useRef } from "react"
import { BarChart3 } from "lucide-react"

export default function ProjectPerformanceChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Sample data
    const data = {
      labels: ["Website Redesign", "Mobile App Development", "Marketing Campaign"],
      datasets: [
        {
          label: "Progress",
          data: [75, 45, 90],
          backgroundColor: "rgba(99, 102, 241, 0.6)",
        },
        {
          label: "Timeline Adherence",
          data: [85, 70, 95],
          backgroundColor: "rgba(139, 92, 246, 0.6)",
        },
        {
          label: "Budget Utilization",
          data: [65, 37, 88],
          backgroundColor: "rgba(16, 185, 129, 0.6)",
        },
      ],
    }

    // Draw chart
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    const barWidth = 30
    const spacing = 10
    const groupWidth = (barWidth + spacing) * data.datasets.length
    const chartHeight = 300
    const maxValue = 100 // Percentage values
    const scale = chartHeight / maxValue

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(50, 20)
    ctx.lineTo(50, chartHeight + 40)
    ctx.lineTo(data.labels.length * (groupWidth + 40) + 50, chartHeight + 40)
    ctx.strokeStyle = "#2a3158"
    ctx.stroke()

    // Draw bars
    data.labels.forEach((label, i) => {
      const x = i * (groupWidth + 40) + 80

      // Draw label
      ctx.fillStyle = "#a3aed0"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(label, x + groupWidth / 2 - spacing, chartHeight + 60)

      // Draw bars for each dataset
      data.datasets.forEach((dataset, j) => {
        const value = dataset.data[i]
        const barHeight = value * scale
        const barX = x + j * (barWidth + spacing)

        ctx.fillStyle = dataset.backgroundColor
        ctx.fillRect(barX, chartHeight + 40 - barHeight, barWidth, barHeight)

        // Draw value on top of bar
        ctx.fillStyle = "#ffffff"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(value.toString() + "%", barX + barWidth / 2, chartHeight + 35 - barHeight)
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
      ctx.fillStyle = "#a3aed0"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(dataset.label, x + 20, legendY + 12)
    })
  }, [])

  return (
    <div className="relative h-full w-full">
      {/* Fallback for browsers without canvas support */}
      <div className="absolute inset-0 flex items-center justify-center">
        <BarChart3 className="h-16 w-16 text-muted-foreground/20" />
      </div>
      <canvas ref={canvasRef} width={800} height={400} className="h-full w-full" />
    </div>
  )
}
