"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ResourceAllocation from "@/components/resource-allocation"

export default function CreateProject() {
  const router = useRouter()
  const [projectDuration, setProjectDuration] = useState(90)
  const [startDate, setStartDate] = useState("2025-04-15")
  const [endDate, setEndDate] = useState("2025-07-14")
  const [resourceAllocation, setResourceAllocation] = useState({
    humans: 5,
    bots: 3,
  })

  // Calculate end date based on start date and duration
  const calculateEndDate = (start: string, days: number) => {
    const date = new Date(start)
    date.setDate(date.getDate() + days)
    return date.toISOString().split("T")[0]
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value
    setStartDate(newStartDate)
    setEndDate(calculateEndDate(newStartDate, projectDuration))
  }

  const handleDurationChange = (value: number[]) => {
    const newDuration = value[0]
    setProjectDuration(newDuration)
    setEndDate(calculateEndDate(startDate, newDuration))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would save the project data here
    // For now, we'll just navigate to the projects page
    router.push("/projects")
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Project</h1>

      <form onSubmit={handleSubmit}>
        <Card className="bg-card-blue border-blue mb-6">
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
            <CardDescription className="text-light-blue">Enter the basic details about your project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="Enter project name"
                  className="bg-darker-blue border-blue"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  placeholder="Enter organization name"
                  className="bg-darker-blue border-blue"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDescription">Project Description</Label>
              <Textarea
                id="projectDescription"
                placeholder="Brief description of the project"
                className="bg-darker-blue border-blue min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectBudget">Project Budget ($)</Label>
              <Input
                id="projectBudget"
                type="number"
                placeholder="Enter budget amount"
                className="bg-darker-blue border-blue"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card-blue border-blue mb-6">
          <CardHeader>
            <CardTitle>Project Timeline</CardTitle>
            <CardDescription className="text-light-blue">Set the duration and dates for your project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <div className="relative">
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="bg-darker-blue border-blue"
                    required
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Auto-calculated)</Label>
                <div className="relative">
                  <Input id="endDate" type="date" value={endDate} readOnly className="bg-darker-blue border-blue" />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Project Duration: {projectDuration} days</Label>
              </div>
              <Slider
                defaultValue={[90]}
                max={365}
                min={1}
                step={1}
                value={[projectDuration]}
                onValueChange={handleDurationChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card-blue border-blue mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Resource Allocation</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Specify the number of human and bot resources for this project. The AI will automatically assign
                      tasks based on this allocation.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardDescription className="text-light-blue">
              Define how many humans and bots will work on this project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResourceAllocation resources={resourceAllocation} onChange={setResourceAllocation} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">Create Project</Button>
        </div>
      </form>
    </div>
  )
}
