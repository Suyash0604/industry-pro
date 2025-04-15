import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Edit, LayoutList, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import ProjectGanttChart from "@/components/project-gantt-chart"
import TaskAllocation from "@/components/task-allocation"

// Sample project data - in a real app, this would come from a database
const projects = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete overhaul of the company website with modern design and improved UX",
    status: "In Progress",
    progress: 75,
    priority: "High",
    startDate: "April 1, 2025",
    endDate: "May 15, 2025",
    humans: 5,
    bots: 3,
    tasks: 24,
    completedTasks: 18,
    budget: 50000,
    spent: 32500,
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Creating a native mobile application for iOS and Android platforms",
    status: "In Progress",
    progress: 45,
    priority: "Medium",
    startDate: "April 15, 2025",
    endDate: "June 20, 2025",
    humans: 8,
    bots: 4,
    tasks: 36,
    completedTasks: 16,
    budget: 75000,
    spent: 28000,
  },
  {
    id: "3",
    name: "Marketing Campaign",
    description: "Q2 marketing campaign focused on product launch",
    status: "In Progress",
    progress: 90,
    priority: "High",
    startDate: "April 10, 2025",
    endDate: "April 30, 2025",
    humans: 4,
    bots: 2,
    tasks: 15,
    completedTasks: 13,
    budget: 25000,
    spent: 22000,
  },
]

export default function ProjectPage({ params }: { params: { id: string } }) {
  // Find the project by ID
  const project = projects.find((p) => p.id === params.id)

  // If project not found, you could handle this with a not found page
  if (!project) {
    return <div>Project not found</div>
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-orange-500/20 text-orange-500 hover:bg-orange-500/30"
      case "Medium":
        return "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
      case "Low":
        return "bg-green-500/20 text-green-500 hover:bg-green-500/30"
      default:
        return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-500 hover:bg-green-500/30"
      case "In Progress":
        return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
      case "Not Started":
        return "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
            <Badge variant="outline" className={getPriorityColor(project.priority)}>
              {project.priority}
            </Badge>
          </div>
        </div>
        <div className="ml-auto">
          <Button asChild>
            <Link href={`/projects/${project.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>

      <p className="text-light-blue">{project.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card-blue border-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-light-blue">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-400" />
              <div>
                <div className="font-medium">
                  {project.startDate} - {project.endDate}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card-blue border-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-light-blue">Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-400" />
              <div>
                <div className="font-medium">
                  {project.humans} Humans, {project.bots} Bots
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card-blue border-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-light-blue">Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <LayoutList className="h-5 w-5 text-indigo-400" />
              <div>
                <div className="font-medium">
                  {project.completedTasks}/{project.tasks} Completed
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card-blue border-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-light-blue">Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-400" />
              <div>
                <div className="font-medium">
                  ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Project Progress</h3>
        <Progress value={project.progress} className="h-2" />
        <div className="flex justify-between text-sm text-light-blue">
          <span>{project.progress}% Complete</span>
          <span>
            {project.completedTasks} of {project.tasks} tasks completed
          </span>
        </div>
      </div>

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList className="bg-darker-blue">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="resources">Resource Allocation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <Card className="bg-card-blue border-blue">
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription className="text-light-blue">
                Gantt chart visualization of project tasks and timeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectGanttChart projectId={params.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card className="bg-card-blue border-blue">
            <CardHeader>
              <CardTitle>Project Tasks</CardTitle>
              <CardDescription className="text-light-blue">All tasks for this project</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Task list will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card className="bg-card-blue border-blue">
            <CardHeader>
              <CardTitle>Resource Allocation</CardTitle>
              <CardDescription className="text-light-blue">
                AI-optimized allocation of humans and bots to project tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaskAllocation projectId={params.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="bg-card-blue border-blue">
            <CardHeader>
              <CardTitle>Project Analytics</CardTitle>
              <CardDescription className="text-light-blue">Performance metrics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Analytics will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
