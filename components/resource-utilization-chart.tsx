"use client"

import { useEffect, useRef } from "react"
import { LineChart } from "lucide-react"

export default function ResourceUtilizationChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Sample data
    const data = {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
      datasets: [
        {
          label: "Human Utilization",
          data: [65, 70, 75, 80, 85, 83],
          color: "#6366f1",
        },
        {
          label: "Bot Utilization",
          data: [50, 60, 65, 70, 75, 75],
          color: "#8b5cf6",
        },
      ],
    }

    // Draw chart
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    const chartWidth = canvasRef.current.width - 100
    const chartHeight = 300
    const maxValue = 100 // Percentage values
    const scale = chartHeight / maxValue
    const xStep = chartWidth / (data.labels.length - 1)

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(50, 20)
    ctx.lineTo(50, chartHeight + 40)
    ctx.lineTo(chartWidth + 70, chartHeight + 40)
    ctx.strokeStyle = "#2a3158"
    ctx.stroke()

    // Draw grid lines
    ctx.beginPath()
    for (let i = 0; i <= 10; i++) {
      const y = chartHeight + 40 - i * 10 * scale
      ctx.moveTo(50, y)
      ctx.lineTo(chartWidth + 70, y)

      // Draw y-axis labels
      ctx.fillStyle = "#a3aed0"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(`${i * 10}%`, 45, y + 3)
    }
    ctx.strokeStyle = "#2a3158"
    ctx.stroke()

    // Draw x-axis labels
    data.labels.forEach((label, i) => {
      const x = 50 + i * xStep
      ctx.fillStyle = "#a3aed0"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(label, x, chartHeight + 60)
    })

    // Draw lines
    data.datasets.forEach((dataset) => {
      ctx.beginPath()
      dataset.data.forEach((value, i) => {
        const x = 50 + i * xStep
        const y = chartHeight + 40 - value * scale

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.strokeStyle = dataset.color
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw points
      dataset.data.forEach((value, i) => {
        const x = 50 + i * xStep
        const y = chartHeight + 40 - value * scale

        ctx.beginPath()
        ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fillStyle = dataset.color
        ctx.fill()
      })
    })

    // Draw legend
    const legendX = 80
    const legendY = 30

    data.datasets.forEach((dataset, i) => {
      const x = legendX + i * 150

      // Draw color line
      ctx.beginPath()
      ctx.moveTo(x, legendY + 7)
      ctx.lineTo(x + 15, legendY + 7)
      ctx.strokeStyle = dataset.color
      ctx.lineWidth = 3
      ctx.stroke()

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
        <LineChart className="h-16 w-16 text-muted-foreground/20" />
      </div>
      <canvas ref={canvasRef} width={800} height={400} className="h-full w-full" />
    </div>
  )
}
