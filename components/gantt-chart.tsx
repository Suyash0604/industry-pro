"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, ChevronRight, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// Types for our Gantt chart data
type Task = {
  id: string
  name: string
  start: Date
  end: Date
  progress: number
  dependencies?: string[]
  assignee?: string
  color?: string
  collapsed?: boolean
  subtasks?: Task[]
}

type Project = {
  id: string
  name: string
  tasks: Task[]
  startDate: Date
  endDate: Date
  collapsed?: boolean
}

// Sample data for our Gantt chart
const sampleProjects: Project[] = [
  {
    id: "p1",
    name: "Website Redesign",
    startDate: new Date("2025-04-01"),
    endDate: new Date("2025-05-15"),
    tasks: [
      {
        id: "t1",
        name: "Research & Planning",
        start: new Date("2025-04-01"),
        end: new Date("2025-04-10"),
        progress: 100,
        color: "#8b5cf6",
        subtasks: [
          {
            id: "t1-1",
            name: "Competitor Analysis",
            start: new Date("2025-04-01"),
            end: new Date("2025-04-05"),
            progress: 100,
          },
          {
            id: "t1-2",
            name: "User Interviews",
            start: new Date("2025-04-03"),
            end: new Date("2025-04-08"),
            progress: 100,
          },
          {
            id: "t1-3",
            name: "Requirements Documentation",
            start: new Date("2025-04-06"),
            end: new Date("2025-04-10"),
            progress: 100,
          },
        ],
      },
      {
        id: "t2",
        name: "Design Phase",
        start: new Date("2025-04-11"),
        end: new Date("2025-04-25"),
        progress: 80,
        dependencies: ["t1"],
        color: "#ec4899",
        subtasks: [
          {
            id: "t2-1",
            name: "Wireframing",
            start: new Date("2025-04-11"),
            end: new Date("2025-04-15"),
            progress: 100,
          },
          {
            id: "t2-2",
            name: "UI Design",
            start: new Date("2025-04-16"),
            end: new Date("2025-04-22"),
            progress: 90,
          },
          {
            id: "t2-3",
            name: "Design Review",
            start: new Date("2025-04-23"),
            end: new Date("2025-04-25"),
            progress: 50,
          },
        ],
      },
      {
        id: "t3",
        name: "Development",
        start: new Date("2025-04-20"),
        end: new Date("2025-05-10"),
        progress: 40,
        dependencies: ["t2"],
        color: "#3b82f6",
        subtasks: [
          {
            id: "t3-1",
            name: "Frontend Development",
            start: new Date("2025-04-20"),
            end: new Date("2025-05-05"),
            progress: 60,
          },
          {
            id: "t3-2",
            name: "Backend Integration",
            start: new Date("2025-04-25"),
            end: new Date("2025-05-10"),
            progress: 30,
          },
        ],
      },
      {
        id: "t4",
        name: "Testing & Launch",
        start: new Date("2025-05-05"),
        end: new Date("2025-05-15"),
        progress: 10,
        dependencies: ["t3"],
        color: "#10b981",
        subtasks: [
          {
            id: "t4-1",
            name: "QA Testing",
            start: new Date("2025-05-05"),
            end: new Date("2025-05-12"),
            progress: 20,
          },
          {
            id: "t4-2",
            name: "User Acceptance Testing",
            start: new Date("2025-05-10"),
            end: new Date("2025-05-14"),
            progress: 0,
          },
          {
            id: "t4-3",
            name: "Deployment",
            start: new Date("2025-05-15"),
            end: new Date("2025-05-15"),
            progress: 0,
          },
        ],
      },
    ],
  },
  {
    id: "p2",
    name: "Mobile App Development",
    startDate: new Date("2025-04-15"),
    endDate: new Date("2025-06-20"),
    tasks: [
      {
        id: "m1",
        name: "Planning & Requirements",
        start: new Date("2025-04-15"),
        end: new Date("2025-04-30"),
        progress: 100,
        color: "#8b5cf6",
      },
      {
        id: "m2",
        name: "UI/UX Design",
        start: new Date("2025-04-25"),
        end: new Date("2025-05-15"),
        progress: 85,
        dependencies: ["m1"],
        color: "#ec4899",
      },
      {
        id: "m3",
        name: "Frontend Development",
        start: new Date("2025-05-10"),
        end: new Date("2025-06-05"),
        progress: 45,
        dependencies: ["m2"],
        color: "#3b82f6",
      },
      {
        id: "m4",
        name: "Backend Development",
        start: new Date("2025-05-05"),
        end: new Date("2025-06-10"),
        progress: 30,
        color: "#0ea5e9",
      },
      {
        id: "m5",
        name: "Testing & Deployment",
        start: new Date("2025-06-05"),
        end: new Date("2025-06-20"),
        progress: 0,
        dependencies: ["m3", "m4"],
        color: "#10b981",
      },
    ],
  },
  {
    id: "p3",
    name: "Marketing Campaign",
    startDate: new Date("2025-04-10"),
    endDate: new Date("2025-04-30"),
    tasks: [
      {
        id: "mc1",
        name: "Campaign Strategy",
        start: new Date("2025-04-10"),
        end: new Date("2025-04-15"),
        progress: 100,
        color: "#8b5cf6",
      },
      {
        id: "mc2",
        name: "Content Creation",
        start: new Date("2025-04-15"),
        end: new Date("2025-04-25"),
        progress: 90,
        dependencies: ["mc1"],
        color: "#ec4899",
      },
      {
        id: "mc3",
        name: "Campaign Launch",
        start: new Date("2025-04-25"),
        end: new Date("2025-04-28"),
        progress: 50,
        dependencies: ["mc2"],
        color: "#3b82f6",
      },
      {
        id: "mc4",
        name: "Performance Analysis",
        start: new Date("2025-04-28"),
        end: new Date("2025-04-30"),
        progress: 20,
        dependencies: ["mc3"],
        color: "#10b981",
      },
    ],
  },
]

export default function GanttChart({ projectId }: { projectId?: string }) {
  const [projects, setProjects] = useState<Project[]>(sampleProjects)
  const [selectedProject, setSelectedProject] = useState<string>(projectId || projects[0].id)
  const [zoomLevel, setZoomLevel] = useState<number>(1) // 1 = day, 2 = week, 3 = month
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day")
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(),
    end: new Date(),
  })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Find the currently selected project
  const currentProject = projects.find((p) => p.id === selectedProject) || projects[0]

  // Calculate the date range for the chart based on the selected project
  useEffect(() => {
    if (currentProject) {
      // Add some padding to the start and end dates
      const startDate = new Date(currentProject.startDate)
      startDate.setDate(startDate.getDate() - 3)

      const endDate = new Date(currentProject.endDate)
      endDate.setDate(endDate.getDate() + 3)

      setDateRange({ start: startDate, end: endDate })
    }
  }, [currentProject])

  // Toggle task collapse state
  const toggleTaskCollapse = (taskId: string) => {
    setProjects(
      projects.map((project) => ({
        ...project,
        tasks: project.tasks.map((task) => {
          if (task.id === taskId) {
            return { ...task, collapsed: !task.collapsed }
          }
          return task
        }),
      })),
    )
  }

  // Toggle project collapse state
  const toggleProjectCollapse = (projectId: string) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return { ...project, collapsed: !project.collapsed }
        }
        return project
      }),
    )
  }

  // Generate dates for the timeline header
  const generateTimelineDates = () => {
    const dates: Date[] = []
    const currentDate = new Date(dateRange.start)

    while (currentDate <= dateRange.end) {
      dates.push(new Date(currentDate))

      if (viewMode === "day") {
        currentDate.setDate(currentDate.getDate() + 1)
      } else if (viewMode === "week") {
        currentDate.setDate(currentDate.getDate() + 7)
      } else {
        currentDate.setMonth(currentDate.getMonth() + 1)
      }
    }

    return dates
  }

  // Format date for display
  const formatDate = (date: Date) => {
    if (viewMode === "day") {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    } else if (viewMode === "week") {
      const endOfWeek = new Date(date)
      endOfWeek.setDate(endOfWeek.getDate() + 6)
      return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
    } else {
      return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    }
  }

  // Calculate position and width for task bars
  const calculateTaskPosition = (task: Task) => {
    const totalDays = Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24))
    const taskStartDays = Math.ceil((task.start.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24))
    const taskDuration = Math.ceil((task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    const left = (taskStartDays / totalDays) * 100
    const width = (taskDuration / totalDays) * 100

    return { left: `${left}%`, width: `${width}%` }
  }

  // Handle zoom level changes
  const handleZoomChange = (level: "day" | "week" | "month") => {
    setViewMode(level)

    // Adjust date range based on zoom level
    const currentDate = new Date()
    const start = new Date(currentDate)
    const end = new Date(currentDate)

    if (level === "day") {
      start.setDate(start.getDate() - 15)
      end.setDate(end.getDate() + 15)
    } else if (level === "week") {
      start.setDate(start.getDate() - 28)
      end.setDate(end.getDate() + 28)
    } else {
      start.setMonth(start.getMonth() - 3)
      end.setMonth(end.getMonth() + 3)
    }

    setDateRange({ start, end })
  }

  // Export chart as image
  const exportChart = () => {
    if (canvasRef.current) {
      const link = document.createElement("a")
      link.download = `${currentProject.name}-gantt-chart.png`
      link.href = canvasRef.current.toDataURL("image/png")
      link.click()
    }
  }

  // Render dependencies between tasks
  const renderDependencies = () => {
    // This would be implemented with SVG lines connecting dependent tasks
    return null
  }

  // Flatten tasks to include subtasks for rendering
  const flattenTasks = (tasks: Task[], level = 0): { task: Task; level: number }[] => {
    return tasks.reduce<{ task: Task; level: number }[]>((acc, task) => {
      acc.push({ task, level })

      if (task.subtasks && !task.collapsed) {
        acc.push(...flattenTasks(task.subtasks, level + 1))
      }

      return acc
    }, [])
  }

  const timelineDates = generateTimelineDates()
  const flattenedTasks = flattenTasks(currentProject.tasks)

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Project Timeline</CardTitle>
        <div className="flex items-center gap-2">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "day" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => handleZoomChange("day")}
              className="rounded-r-none"
            >
              Day
            </Button>
            <Button
              variant={viewMode === "week" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => handleZoomChange("week")}
              className="rounded-none border-x"
            >
              Week
            </Button>
            <Button
              variant={viewMode === "month" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => handleZoomChange("month")}
              className="rounded-l-none"
            >
              Month
            </Button>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={exportChart}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export as Image</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <div className="gantt-container min-w-[800px]">
            {/* Timeline header */}
            <div className="grid grid-cols-[250px_1fr] border-b">
              <div className="p-2 font-medium border-r">Task Name</div>
              <div className="timeline-header">
                <div className="flex">
                  {timelineDates.map((date, index) => (
                    <div
                      key={index}
                      className="timeline-header-cell text-center p-2 border-r last:border-r-0 text-xs font-medium"
                      style={{ width: `${100 / timelineDates.length}%` }}
                    >
                      {formatDate(date)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Task rows */}
            <div className="gantt-body">
              {flattenedTasks.map(({ task, level }, index) => (
                <div key={task.id} className="grid grid-cols-[250px_1fr] border-b">
                  <div
                    className="task-name p-2 border-r flex items-center"
                    style={{ paddingLeft: `${level * 16 + 8}px` }}
                  >
                    {task.subtasks && task.subtasks.length > 0 && (
                      <button
                        onClick={() => toggleTaskCollapse(task.id)}
                        className="mr-1 p-1 rounded-sm hover:bg-muted"
                      >
                        {task.collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    )}
                    <span className={cn("text-sm", level === 0 && "font-medium")}>{task.name}</span>
                  </div>

                  <div className="timeline-cell relative">
                    {/* Task bar */}
                    <div
                      className="absolute top-1 h-6 rounded-sm task-bar"
                      style={{
                        ...calculateTaskPosition(task),
                        backgroundColor: task.color || "#3b82f6",
                      }}
                    >
                      <div
                        className="h-full rounded-sm bg-black bg-opacity-20"
                        style={{ width: `${task.progress}%` }}
                      />

                      {/* Task label inside the bar if there's enough space */}
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-white px-2 truncate">
                        {task.progress}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hidden canvas for export */}
          <canvas ref={canvasRef} className="hidden" width={1200} height={800} />
        </div>
      </CardContent>
    </Card>
  )
}
