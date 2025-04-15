"use client"

import { useState } from "react"
import { ArrowUpDown, Calendar, Filter, MoreHorizontal, PlusCircle, Search, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddTaskForm from "@/components/add-task-form"

// Sample task data
const tasksData = [
  {
    id: "t1",
    name: "Design homepage wireframes",
    project: "Website Redesign",
    status: "In Progress",
    priority: "High",
    dueDate: "2025-04-25",
    assignee: { type: "human", name: "Alex Johnson" },
    completed: false,
    category: "Design",
    estimatedCost: 1200,
  },
  {
    id: "t2",
    name: "Implement user authentication",
    project: "Mobile App Development",
    status: "Not Started",
    priority: "High",
    dueDate: "2025-05-02",
    assignee: { type: "human", name: "Sarah Chen" },
    completed: false,
    category: "Development",
    estimatedCost: 2500,
  },
  {
    id: "t3",
    name: "Create social media content calendar",
    project: "Marketing Campaign",
    status: "In Progress",
    priority: "Medium",
    dueDate: "2025-04-20",
    assignee: { type: "human", name: "Michael Brown" },
    completed: false,
    category: "Marketing",
    estimatedCost: 800,
  },
  {
    id: "t4",
    name: "Conduct user interviews",
    project: "Content Strategy",
    status: "Completed",
    priority: "Medium",
    dueDate: "2025-04-15",
    assignee: { type: "human", name: "Emily Davis" },
    completed: true,
    category: "Research",
    estimatedCost: 1500,
  },
  {
    id: "t5",
    name: "Set up analytics tracking",
    project: "Website Redesign",
    status: "Completed",
    priority: "Low",
    dueDate: "2025-04-10",
    assignee: { type: "bot", name: "AnalyticsBot" },
    completed: true,
    category: "Analytics",
    estimatedCost: 600,
  },
  {
    id: "t6",
    name: "Develop API endpoints",
    project: "Mobile App Development",
    status: "In Progress",
    priority: "High",
    dueDate: "2025-04-28",
    assignee: { type: "human", name: "David Wilson" },
    completed: false,
    category: "Development",
    estimatedCost: 3000,
  },
  {
    id: "t7",
    name: "Create email newsletter template",
    project: "Marketing Campaign",
    status: "Not Started",
    priority: "Low",
    dueDate: "2025-05-05",
    assignee: { type: "bot", name: "ContentBot" },
    completed: false,
    category: "Content",
    estimatedCost: 500,
  },
  {
    id: "t8",
    name: "Perform automated testing",
    project: "Mobile App Development",
    status: "In Progress",
    priority: "Medium",
    dueDate: "2025-05-10",
    assignee: { type: "bot", name: "QABot" },
    completed: false,
    category: "QA",
    estimatedCost: 1200,
  },
]

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [projectFilter, setProjectFilter] = useState("all")
  const [showAddTask, setShowAddTask] = useState(false)
  const [taskData, setTaskData] = useState(tasksData)
  const [sortColumn, setSortColumn] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")

  // Filter tasks based on search query and filters
  const filteredTasks = taskData.filter((task) => {
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    const matchesProject = projectFilter === "all" || task.project === projectFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesProject
  })

  // Sort tasks based on column and direction
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : 1
    } else {
      return aValue > bValue ? -1 : 1
    }
  })

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleTaskCompletion = (taskId: string, completed: boolean) => {
    setTaskData(
      taskData.map((task) =>
        task.id === taskId ? { ...task, completed, status: completed ? "Completed" : "In Progress" } : task,
      ),
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-orange-500"
      case "Medium":
        return "text-yellow-500"
      case "Low":
        return "text-green-500"
      default:
        return ""
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge variant="outline" className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
            Completed
          </Badge>
        )
      case "In Progress":
        return (
          <Badge variant="outline" className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30">
            In Progress
          </Badge>
        )
      case "Not Started":
        return (
          <Badge variant="outline" className="bg-gray-500/20 text-gray-400 hover:bg-gray-500/30">
            Not Started
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Get unique projects for filter
  const projects = Array.from(new Set(taskData.map((task) => task.project)))

  // Calculate task statistics
  const totalTasks = taskData.length
  const completedTasks = taskData.filter((task) => task.completed).length
  const inProgressTasks = taskData.filter((task) => task.status === "In Progress").length
  const notStartedTasks = taskData.filter((task) => task.status === "Not Started").length
  const totalCost = taskData.reduce((sum, task) => sum + task.estimatedCost, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Button onClick={() => setShowAddTask(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card-blue border-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-light-blue">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <Progress
              value={(completedTasks / totalTasks) * 100}
              className="h-2 mt-2"
              indicatorClassName="bg-indigo-500"
            />
            <p className="text-xs text-light-blue mt-1">
              {completedTasks} completed ({Math.round((completedTasks / totalTasks) * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card-blue border-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-light-blue">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks}</div>
            <Progress
              value={(inProgressTasks / totalTasks) * 100}
              className="h-2 mt-2"
              indicatorClassName="bg-blue-500"
            />
            <p className="text-xs text-light-blue mt-1">
              {Math.round((inProgressTasks / totalTasks) * 100)}% of all tasks
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card-blue border-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-light-blue">Not Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notStartedTasks}</div>
            <Progress
              value={(notStartedTasks / totalTasks) * 100}
              className="h-2 mt-2"
              indicatorClassName="bg-gray-500"
            />
            <p className="text-xs text-light-blue mt-1">
              {Math.round((notStartedTasks / totalTasks) * 100)}% of all tasks
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card-blue border-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-light-blue">Total Estimated Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toLocaleString()}</div>
            <p className="text-xs text-light-blue mt-1">Across all tasks</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="bg-darker-blue">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card className="bg-card-blue border-blue">
            <CardHeader>
              <CardTitle>Task List</CardTitle>
              <CardDescription className="text-light-blue">View and manage all tasks across projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    className="pl-9 bg-darker-blue border-blue"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
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

                  <Select value={projectFilter} onValueChange={setProjectFilter}>
                    <SelectTrigger className="w-[160px] bg-darker-blue border-blue">
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Project" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project} value={project}>
                          {project}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button variant="outline" className="bg-darker-blue border-blue">
                    Clear Filters
                  </Button>
                </div>
              </div>

              <div className="rounded-md border border-blue overflow-hidden">
                <Table>
                  <TableHeader className="bg-darker-blue">
                    <TableRow className="hover:bg-darker-blue/80 border-blue">
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead
                        className="w-[250px] cursor-pointer text-light-blue"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center">
                          Task Name
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer text-light-blue" onClick={() => handleSort("project")}>
                        <div className="flex items-center">
                          Project
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer text-light-blue" onClick={() => handleSort("status")}>
                        <div className="flex items-center">
                          Status
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer text-light-blue" onClick={() => handleSort("priority")}>
                        <div className="flex items-center">
                          Priority
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer text-light-blue" onClick={() => handleSort("dueDate")}>
                        <div className="flex items-center">
                          Due Date
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer text-light-blue" onClick={() => handleSort("assignee")}>
                        <div className="flex items-center">
                          Assignee
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="text-right text-light-blue">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTasks.map((task) => (
                      <TableRow
                        key={task.id}
                        className={`hover:bg-card-blue/80 border-blue ${task.completed ? "bg-muted/10" : ""}`}
                      >
                        <TableCell>
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={(checked) => handleTaskCompletion(task.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell
                          className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                        >
                          {task.name}
                        </TableCell>
                        <TableCell>{task.project}</TableCell>
                        <TableCell>{getStatusBadge(task.status)}</TableCell>
                        <TableCell>
                          <span className={getPriorityColor(task.priority)}>{task.priority}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(task.dueDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {task.assignee.type === "human" ? (
                              <User className="h-4 w-4 text-indigo-400" />
                            ) : (
                              <span className="text-purple-400">🤖</span>
                            )}
                            {task.assignee.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Task</DropdownMenuItem>
                              <DropdownMenuItem>Change Assignee</DropdownMenuItem>
                              <DropdownMenuItem>Delete Task</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kanban" className="space-y-4">
          <Card className="bg-card-blue border-blue">
            <CardHeader>
              <CardTitle>Kanban Board</CardTitle>
              <CardDescription className="text-light-blue">Visualize tasks by status in a kanban board</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-4">
                  <div className="bg-darker-blue p-3 rounded-md">
                    <h3 className="font-medium text-light-blue mb-2">Not Started</h3>
                    <div className="space-y-2">
                      {taskData
                        .filter((task) => task.status === "Not Started")
                        .map((task) => (
                          <div key={task.id} className="p-3 bg-card-blue border border-blue rounded-md">
                            <div className="font-medium mb-1">{task.name}</div>
                            <div className="text-sm text-light-blue mb-2">{task.project}</div>
                            <div className="flex justify-between items-center">
                              <Badge
                                variant="outline"
                                className={`bg-${getPriorityColor(task.priority).replace(
                                  "text-",
                                  "",
                                )}/20 ${getPriorityColor(task.priority)}`}
                              >
                                {task.priority}
                              </Badge>
                              <div className="text-xs text-light-blue">{formatDate(task.dueDate)}</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-darker-blue p-3 rounded-md">
                    <h3 className="font-medium text-light-blue mb-2">In Progress</h3>
                    <div className="space-y-2">
                      {taskData
                        .filter((task) => task.status === "In Progress")
                        .map((task) => (
                          <div key={task.id} className="p-3 bg-card-blue border border-blue rounded-md">
                            <div className="font-medium mb-1">{task.name}</div>
                            <div className="text-sm text-light-blue mb-2">{task.project}</div>
                            <div className="flex justify-between items-center">
                              <Badge
                                variant="outline"
                                className={`bg-${getPriorityColor(task.priority).replace(
                                  "text-",
                                  "",
                                )}/20 ${getPriorityColor(task.priority)}`}
                              >
                                {task.priority}
                              </Badge>
                              <div className="text-xs text-light-blue">{formatDate(task.dueDate)}</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-darker-blue p-3 rounded-md">
                    <h3 className="font-medium text-light-blue mb-2">Completed</h3>
                    <div className="space-y-2">
                      {taskData
                        .filter((task) => task.status === "Completed")
                        .map((task) => (
                          <div key={task.id} className="p-3 bg-card-blue border border-blue rounded-md">
                            <div className="font-medium mb-1">{task.name}</div>
                            <div className="text-sm text-light-blue mb-2">{task.project}</div>
                            <div className="flex justify-between items-center">
                              <Badge
                                variant="outline"
                                className={`bg-${getPriorityColor(task.priority).replace(
                                  "text-",
                                  "",
                                )}/20 ${getPriorityColor(task.priority)}`}
                              >
                                {task.priority}
                              </Badge>
                              <div className="text-xs text-light-blue">{formatDate(task.dueDate)}</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card className="bg-card-blue border-blue">
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription className="text-light-blue">View tasks organized by due date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-light-blue">Calendar view will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showAddTask && <AddTaskForm onClose={() => setShowAddTask(false)} />}
    </div>
  )
}
