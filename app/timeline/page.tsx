"use client"

import { Progress } from "@/components/ui/progress"

import { useState } from "react"
import { ChevronDown, ChevronRight, Download, ZoomIn, ZoomOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Types for our Gantt chart data
type Task = {
  id: string
  name: string
  start: Date
  end: Date
  progress: number
  dependencies?: string[]
  assignee?: {
    type: "human" | "bot"
    name: string
  }
  color?: string
  collapsed?: boolean
  subtasks?: Task[]
  isCriticalPath?: boolean
}

type Project = {
  id: string
  name: string
  tasks: Task[]
  startDate: Date
  endDate: Date
}

// Sample data for our Gantt chart
const projectsData: Project[] = [
  {
    id: "1",
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
        assignee: { type: "human", name: "Alex Johnson" },
        subtasks: [
          {
            id: "t1-1",
            name: "Competitor Analysis",
            start: new Date("2025-04-01"),
            end: new Date("2025-04-05"),
            progress: 100,
            assignee: { type: "human", name: "Sarah Chen" },
          },
          {
            id: "t1-2",
            name: "User Interviews",
            start: new Date("2025-04-03"),
            end: new Date("2025-04-08"),
            progress: 100,
            assignee: { type: "human", name: "Michael Brown" },
          },
          {
            id: "t1-3",
            name: "Requirements Documentation",
            start: new Date("2025-04-06"),
            end: new Date("2025-04-10"),
            progress: 100,
            assignee: { type: "bot", name: "DocBot" },
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
        assignee: { type: "human", name: "Emily Davis" },
        isCriticalPath: true,
        subtasks: [
          {
            id: "t2-1",
            name: "Wireframing",
            start: new Date("2025-04-11"),
            end: new Date("2025-04-15"),
            progress: 100,
            assignee: { type: "human", name: "Emily Davis" },
            isCriticalPath: true,
          },
          {
            id: "t2-2",
            name: "UI Design",
            start: new Date("2025-04-16"),
            end: new Date("2025-04-22"),
            progress: 90,
            assignee: { type: "human", name: "David Wilson" },
            isCriticalPath: true,
          },
          {
            id: "t2-3",
            name: "Design Review",
            start: new Date("2025-04-23"),
            end: new Date("2025-04-25"),
            progress: 50,
            assignee: { type: "bot", name: "ReviewBot" },
            isCriticalPath: true,
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
        assignee: { type: "human", name: "Alex Johnson" },
        isCriticalPath: true,
        subtasks: [
          {
            id: "t3-1",
            name: "Frontend Development",
            start: new Date("2025-04-20"),
            end: new Date("2025-05-05"),
            progress: 60,
            assignee: { type: "bot", name: "FrontendBot" },
            isCriticalPath: true,
          },
          {
            id: "t3-2",
            name: "Backend Integration",
            start: new Date("2025-04-25"),
            end: new Date("2025-05-10"),
            progress: 30,
            assignee: { type: "human", name: "Michael Brown" },
            isCriticalPath: true,
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
        assignee: { type: "bot", name: "TestBot" },
        isCriticalPath: true,
        subtasks: [
          {
            id: "t4-1",
            name: "QA Testing",
            start: new Date("2025-05-05"),
            end: new Date("2025-05-12"),
            progress: 20,
            assignee: { type: "bot", name: "QABot" },
            isCriticalPath: true,
          },
          {
            id: "t4-2",
            name: "User Acceptance Testing",
            start: new Date("2025-05-10"),
            end: new Date("2025-05-14"),
            progress: 0,
            assignee: { type: "human", name: "Sarah Chen" },
          },
          {
            id: "t4-3",
            name: "Deployment",
            start: new Date("2025-05-15"),
            end: new Date("2025-05-15"),
            progress: 0,
            assignee: { type: "bot", name: "DeployBot" },
            isCriticalPath: true,
          },
        ],
      },
    ],
  },
  {
    id: "2",
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
        assignee: { type: "human", name: "Alex Johnson" },
        isCriticalPath: true,
      },
      {
        id: "m2",
        name: "UI/UX Design",
        start: new Date("2025-04-25"),
        end: new Date("2025-05-15"),
        progress: 85,
        dependencies: ["m1"],
        color: "#ec4899",
        assignee: { type: "human", name: "Emily Davis" },
        isCriticalPath: true,
      },
      {
        id: "m3",
        name: "Frontend Development",
        start: new Date("2025-05-10"),
        end: new Date("2025-06-05"),
        progress: 45,
        dependencies: ["m2"],
        color: "#3b82f6",
        assignee: { type: "bot", name: "FrontendBot" },
        isCriticalPath: true,
      },
      {
        id: "m4",
        name: "Backend Development",
        start: new Date("2025-05-05"),
        end: new Date("2025-06-10"),
        progress: 30,
        color: "#0ea5e9",
        assignee: { type: "human", name: "Michael Brown" },
      },
      {
        id: "m5",
        name: "Testing & Deployment",
        start: new Date("2025-06-05"),
        end: new Date("2025-06-20"),
        progress: 0,
        dependencies: ["m3", "m4"],
        color: "#10b981",
        assignee: { type: "bot", name: "TestBot" },
        isCriticalPath: true,
      },
    ],
  },
  {
    id: "3",
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
        assignee: { type: "human", name: "Sarah Chen" },
        isCriticalPath: true,
      },
      {
        id: "mc2",
        name: "Content Creation",
        start: new Date("2025-04-15"),
        end: new Date("2025-04-25"),
        progress: 90,
        dependencies: ["mc1"],
        color: "#ec4899",
        assignee: { type: "bot", name: "ContentBot" },
        isCriticalPath: true,
      },
      {
        id: "mc3",
        name: "Campaign Launch",
        start: new Date("2025-04-25"),
        end: new Date("2025-04-28"),
        progress: 50,
        dependencies: ["mc2"],
        color: "#3b82f6",
        assignee: { type: "human", name: "David Wilson" },
        isCriticalPath: true,
      },
      {
        id: "mc4",
        name: "Performance Analysis",
        start: new Date("2025-04-28"),
        end: new Date("2025-04-30"),
        progress: 20,
        dependencies: ["mc3"],
        color: "#10b981",
        assignee: { type: "bot", name: "AnalyticsBot" },
        isCriticalPath: true,
      },
    ],
  },
]

export default function TimelinePage() {
  const [selectedProject, setSelectedProject] = useState<string>(projectsData[0].id)
  const [zoomLevel, setZoomLevel] = useState<number>(1) // 1 = day, 2 = week, 3 = month
  const [timelinePosition, setTimelinePosition] = useState<number>(50)
  const [collapsedTasks, setCollapsedTasks] = useState<Record<string, boolean>>({})
  const [showCriticalPath, setShowCriticalPath] = useState<boolean>(true)

  // Find the currently selected project
  const currentProject = projectsData.find((p) => p.id === selectedProject) || projectsData[0]

  // Calculate the date range for the chart based on the project tasks
  const calculateDateRange = () => {
    if (currentProject.tasks.length === 0) return { start: new Date(), end: new Date() }

    const minDate = new Date(currentProject.startDate)
    const maxDate = new Date(currentProject.endDate)

    // Add some padding to the start and end dates
    minDate.setDate(minDate.getDate() - 3)
    maxDate.setDate(maxDate.getDate() + 3)

    return { start: minDate, end: maxDate }
  }

  const dateRange = calculateDateRange()

  // Toggle task collapse state
  const toggleTaskCollapse = (taskId: string) => {
    setCollapsedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }))
  }

  // Generate dates for the timeline header
  const generateTimelineDates = () => {
    const dates: Date[] = []
    const currentDate = new Date(dateRange.start)

    while (currentDate <= dateRange.end) {
      dates.push(new Date(currentDate))

      if (zoomLevel < 0.5) {
        // Half-day increments
        currentDate.setHours(currentDate.getHours() + 12)
      } else if (zoomLevel < 1) {
        // Day increments
        currentDate.setDate(currentDate.getDate() + 1)
      } else if (zoomLevel < 2) {
        // 3-day increments
        currentDate.setDate(currentDate.getDate() + 3)
      } else if (zoomLevel < 3) {
        // Week increments
        currentDate.setDate(currentDate.getDate() + 7)
      } else {
        // Month increments
        currentDate.setMonth(currentDate.getMonth() + 1)
      }
    }

    return dates
  }

  // Format date for display
  const formatDate = (date: Date) => {
    if (zoomLevel < 1) {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    } else if (zoomLevel < 3) {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
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

  // Flatten tasks to include subtasks for rendering
  const flattenTasks = (tasks: Task[]): { task: Task; level: number }[] => {
    return tasks.reduce<{ task: Task; level: number }[]>((acc, task) => {
      acc.push({ task, level: 0 })

      if (task.subtasks && !collapsedTasks[task.id]) {
        acc.push(...task.subtasks.map((subtask) => ({ task: subtask, level: 1 })))
      }

      return acc
    }, [])
  }

  const timelineDates = generateTimelineDates()
  const flattenedTasks = flattenTasks(currentProject.tasks)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Timeline</h1>
        <div className="flex items-center gap-2">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[200px] bg-darker-blue border-blue">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              {projectsData.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setShowCriticalPath(!showCriticalPath)}>
            {showCriticalPath ? "Hide" : "Show"} Critical Path
          </Button>
        </div>
      </div>

      <Tabs defaultValue="gantt" className="space-y-4">
        <TabsList className="bg-darker-blue">
          <TabsTrigger value="gantt">Gantt Chart</TabsTrigger>
          <TabsTrigger value="network">Network Diagram</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="gantt" className="space-y-4">
          <Card className="bg-card-blue border-blue">
            <CardHeader>
              <CardTitle>Project Timeline: {currentProject.name}</CardTitle>
              <CardDescription className="text-light-blue">
                Gantt chart visualization of project tasks and timeline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.5))}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Slider
                    value={[zoomLevel]}
                    min={0.5}
                    max={3}
                    step={0.5}
                    onValueChange={(value) => setZoomLevel(value[0])}
                    className="w-32"
                  />
                  <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.5))}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-light-blue ml-2">
                    {zoomLevel < 1 ? "Daily" : zoomLevel < 2 ? "3-Day" : zoomLevel < 3 ? "Weekly" : "Monthly"} View
                  </span>
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Export as Image</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="overflow-x-auto border border-blue rounded-lg bg-darker-blue">
                <div className="gantt-container min-w-[800px]">
                  {/* Timeline header */}
                  <div className="grid grid-cols-[250px_1fr] border-b border-blue">
                    <div className="p-2 font-medium border-r border-blue">Task Name</div>
                    <div className="timeline-header">
                      <div className="flex">
                        {timelineDates.map((date, index) => (
                          <div
                            key={index}
                            className="timeline-header-cell text-center p-2 border-r border-blue last:border-r-0 text-xs font-medium"
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
                      <div key={task.id} className="grid grid-cols-[250px_1fr] border-b border-blue last:border-b-0">
                        <div
                          className="task-name p-2 border-r border-blue flex items-center"
                          style={{ paddingLeft: `${level * 16 + 8}px` }}
                        >
                          {task.subtasks && task.subtasks.length > 0 && level === 0 && (
                            <button
                              onClick={() => toggleTaskCollapse(task.id)}
                              className="mr-1 p-1 rounded-sm hover:bg-muted"
                            >
                              {collapsedTasks[task.id] ? (
                                <ChevronRight className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          <span className={cn("text-sm", level === 0 && "font-medium")}>
                            {task.name}
                            {task.isCriticalPath && showCriticalPath && (
                              <Badge variant="outline" className="ml-2 bg-red-500/20 text-red-400">
                                Critical
                              </Badge>
                            )}
                          </span>
                          {task.assignee && (
                            <span
                              className={cn(
                                "ml-2 text-xs px-1.5 py-0.5 rounded-full",
                                task.assignee.type === "human"
                                  ? "bg-indigo-500/20 text-indigo-400"
                                  : "bg-purple-500/20 text-purple-400",
                              )}
                            >
                              {task.assignee.type === "human" ? "👤" : "🤖"} {task.assignee.name}
                            </span>
                          )}
                        </div>

                        <div className="timeline-cell relative">
                          {/* Task bar */}
                          <div
                            className={cn(
                              "absolute top-1 h-6 rounded-sm task-bar",
                              task.isCriticalPath && showCriticalPath && "ring-2 ring-red-500",
                            )}
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
              </div>

              <div className="space-y-2">
                <label className="text-sm text-light-blue">Timeline Position</label>
                <Slider
                  value={[timelinePosition]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setTimelinePosition(value[0])}
                />
              </div>

              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                <h4 className="font-medium text-indigo-400 mb-2">AI Timeline Analysis</h4>
                <p className="text-sm text-light-blue mb-3">
                  Based on the current task assignments and progress, the project is on track to complete by the
                  deadline. The critical path runs through Design Phase, Development, and Testing & Launch. Consider
                  reallocating resources to the Backend Integration task to prevent potential bottlenecks.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/20"
                >
                  View Detailed Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <Card className="bg-card-blue border-blue">
            <CardHeader>
              <CardTitle>Network Diagram</CardTitle>
              <CardDescription className="text-light-blue">
                Visualize task dependencies and critical path
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-light-blue">Network diagram will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card className="bg-card-blue border-blue">
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription className="text-light-blue">View tasks organized by calendar dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-light-blue">Calendar view will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-card-blue border-blue">
        <CardHeader>
          <CardTitle>Project Milestones</CardTitle>
          <CardDescription className="text-light-blue">
            Key milestones and deadlines for {currentProject.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentProject.tasks
              .filter((task) => task.isCriticalPath)
              .map((task) => (
                <div key={task.id} className="p-4 border border-blue rounded-lg bg-card-blue/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{task.name}</h3>
                      <div className="text-sm text-light-blue mt-1">
                        {task.start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} -
                        {task.end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-red-500/20 text-red-400">
                      Critical Path
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-light-blue">Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
