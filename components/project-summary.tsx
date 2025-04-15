import Link from "next/link"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ProjectSummaryProps {
  project: {
    id: string
    name: string
    completion: number
    tasks: number
    completedTasks: number
  }
}

export default function ProjectSummary({ project }: ProjectSummaryProps) {
  return (
    <div className="p-4 border border-blue rounded-lg bg-card-blue/50">
      <div className="flex justify-between items-start mb-3">
        <Link href={`/projects/${project.id}`} className="font-medium hover:text-primary">
          {project.name}
        </Link>
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-light-blue">Progress</span>
          <span>{project.completion}%</span>
        </div>
        <Progress value={project.completion} className="h-2" />

        <div className="flex justify-between text-sm text-light-blue">
          <span>
            Tasks: {project.completedTasks}/{project.tasks}
          </span>
          <span>
            {project.completion < 30 && "Early Stage"}
            {project.completion >= 30 && project.completion < 70 && "In Progress"}
            {project.completion >= 70 && "Near Completion"}
          </span>
        </div>
      </div>
    </div>
  )
}
