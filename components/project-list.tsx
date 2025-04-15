"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Clock, Filter, MoreHorizontal, Search, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample project data
const projectsData = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete overhaul of the company website with modern design and improved UX",
    status: "In Progress",
    progress: 75,
    priority: "High",
    startDate: "2025-04-01",
    endDate: "2025-05-15",
    humans: 5,
    bots: 3,
    tasks: 24,
    completedTasks: 18,
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Creating a native mobile application for iOS and Android platforms",
    status: "In Progress",
    progress: 45,
    priority: "Medium",
    startDate: "2025-04-15",
    endDate: "2025-06-20",
    humans: 8,
    bots: 4,
    tasks: 36,
    completedTasks: 16,
  },
  {
    id: "3",
    name: "Marketing Campaign",
    description: "Q2 marketing campaign focused on product launch",
    status: "In Progress",
    progress: 90,
    priority: "High",
    startDate: "2025-04-10",
    endDate: "2025-04-30",
    humans: 4,
    bots: 2,
    tasks: 15,
    completedTasks: 13,
  },
  {
    id: "4",
    name: "Content Strategy",
    description: "Developing content strategy for social media and blog",
    status: "In Progress",
    progress: 30,
    priority: "Low",
    startDate: "2025-05-01",
    endDate: "2025-07-10",
    humans: 3,
    bots: 1,
    tasks: 20,
    completedTasks: 6,
  },
  {
    id: "5",
    name: "E-commerce Integration",
    description: "Integrating e-commerce functionality into the website",
    status: "Not Started",
    progress: 0,
    priority: "Medium",
    startDate: "2025-06-01",
    endDate: "2025-08-01",
    humans: 6,
    bots: 3,
    tasks: 28,
    completedTasks: 0,
  },
]

export default function ProjectList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  // Filter projects based on search query and filters
  const filteredProjects = projectsData.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
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
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9 bg-darker-blue border-blue"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] bg-darker-blue border-blue">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Not Started">Not Started</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[130px] bg-darker-blue border-blue">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Priority" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-8 text-light-blue">No projects found matching your criteria.</div>
        ) : (
          filteredProjects.map((project) => (
            <div key={project.id} className="p-4 border border-blue rounded-lg bg-card-blue/50">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <Link href={`/projects/${project.id}`} className="text-lg font-medium hover:text-primary">
                        {project.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/projects/${project.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/projects/${project.id}/edit`}>Edit Project</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/projects/${project.id}/tasks`}>Manage Tasks</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/projects/${project.id}/timeline`}>View Timeline</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="text-sm text-light-blue mt-2">{project.description}</p>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-light-blue">Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 md:w-[300px] text-sm">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center text-light-blue">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Timeline</span>
                    </div>
                    <div>
                      <div>{formatDate(project.startDate)}</div>
                      <div>to</div>
                      <div>{formatDate(project.endDate)}</div>
                    </div>
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center text-light-blue">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Resources</span>
                    </div>
                    <div>
                      <div>{project.humans} Humans</div>
                      <div>{project.bots} Bots</div>
                    </div>
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center text-light-blue">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Tasks</span>
                    </div>
                    <div>
                      <div>
                        {project.completedTasks}/{project.tasks} Completed
                      </div>
                      <div>{((project.completedTasks / project.tasks) * 100).toFixed(0)}% Done</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
