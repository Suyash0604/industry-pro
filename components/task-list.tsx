"use client"

import { useState } from "react"
import { ArrowUpDown, Clock, MoreHorizontal, PlusCircle, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Sample task data
const tasks = [
  {
    id: 1,
    name: "Design homepage wireframes",
    project: "Website Redesign",
    status: "In Progress",
    priority: "High",
    dueDate: "2025-04-25",
    assignee: "Alex Johnson",
    completed: false,
  },
  {
    id: 2,
    name: "Implement user authentication",
    project: "Mobile App Development",
    status: "Not Started",
    priority: "High",
    dueDate: "2025-05-02",
    assignee: "Sarah Chen",
    completed: false,
  },
  {
    id: 3,
    name: "Create social media content calendar",
    project: "Marketing Campaign",
    status: "In Progress",
    priority: "Medium",
    dueDate: "2025-04-20",
    assignee: "Michael Brown",
    completed: false,
  },
  {
    id: 4,
    name: "Conduct user interviews",
    project: "Content Strategy",
    status: "Completed",
    priority: "Medium",
    dueDate: "2025-04-15",
    assignee: "Emily Davis",
    completed: true,
  },
  {
    id: 5,
    name: "Set up analytics tracking",
    project: "Website Redesign",
    status: "Completed",
    priority: "Low",
    dueDate: "2025-04-10",
    assignee: "Alex Johnson",
    completed: true,
  },
  {
    id: 6,
    name: "Develop API endpoints",
    project: "Mobile App Development",
    status: "In Progress",
    priority: "High",
    dueDate: "2025-04-28",
    assignee: "David Wilson",
    completed: false,
  },
  {
    id: 7,
    name: "Create email newsletter template",
    project: "Marketing Campaign",
    status: "Not Started",
    priority: "Low",
    dueDate: "2025-05-05",
    assignee: "Michael Brown",
    completed: false,
  },
]

export default function TaskList() {
  const [sortColumn, setSortColumn] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [taskData, setTaskData] = useState(tasks)

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleTaskCompletion = (taskId: number, completed: boolean) => {
    setTaskData(
      taskData.map((task) =>
        task.id === taskId ? { ...task, completed, status: completed ? "Completed" : "In Progress" } : task,
      ),
    )
  }

  const sortedTasks = [...taskData].sort((a, b) => {
    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : 1
    } else {
      return aValue > bValue ? -1 : 1
    }
  })

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
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        )
      case "In Progress":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            In Progress
          </Badge>
        )
      case "Not Started":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Not Started
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between p-4">
        <h3 className="text-lg font-medium">Tasks</h3>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="w-[250px] cursor-pointer" onClick={() => handleSort("name")}>
              <div className="flex items-center">
                Task Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("project")}>
              <div className="flex items-center">
                Project
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
              <div className="flex items-center">
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("priority")}>
              <div className="flex items-center">
                Priority
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("dueDate")}>
              <div className="flex items-center">
                Due Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("assignee")}>
              <div className="flex items-center">
                Assignee
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTasks.map((task) => (
            <TableRow key={task.id} className={task.completed ? "bg-muted/50" : ""}>
              <TableCell>
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) => handleTaskCompletion(task.id, checked as boolean)}
                />
              </TableCell>
              <TableCell className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                {task.name}
              </TableCell>
              <TableCell>{task.project}</TableCell>
              <TableCell>{getStatusBadge(task.status)}</TableCell>
              <TableCell>
                <span className={getPriorityColor(task.priority)}>{task.priority}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {formatDate(task.dueDate)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {task.assignee}
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
    </Card>
  )
}
