import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { projectId } = await request.json()

    // In a real implementation, you would generate a Gantt chart analysis
    // This is a mock implementation for demonstration purposes
    const mockAnalysis = {
      projectId,
      criticalPath: [
        { taskId: "t2", name: "Design Phase" },
        { taskId: "t3", name: "Development" },
        { taskId: "t4", name: "Testing & Launch" },
      ],
      bottlenecks: [
        {
          taskId: "t3-2",
          name: "Backend Integration",
          reason: "Limited human resources with required skills",
          recommendation: "Consider adding another developer or reallocating resources",
        },
      ],
      timelineRisk: "Medium",
      completionProbability: 85,
      recommendations: [
        "Increase resources for Backend Integration to prevent delays",
        "Consider starting Frontend Development earlier to overlap with Design Review",
        "QA Testing can be parallelized with User Acceptance Testing",
      ],
    }

    return NextResponse.json(mockAnalysis)
  } catch (error) {
    console.error("Error processing Gantt analysis request:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
