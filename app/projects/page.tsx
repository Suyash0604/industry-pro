import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ProjectList from "@/components/project-list"

export default function ProjectsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button asChild>
          <Link href="/projects/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <Card className="bg-card-blue border-blue">
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
          <CardDescription className="text-light-blue">Manage and monitor all your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectList />
        </CardContent>
      </Card>
    </div>
  )
}
