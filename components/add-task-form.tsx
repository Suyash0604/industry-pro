"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface AddTaskFormProps {
  onClose: () => void
}

export default function AddTaskForm({ onClose }: AddTaskFormProps) {
  const [taskData, setTaskData] = useState({
    name: "",
    description: "",
    project: "",
    priority: "Medium",
    category: "",
    duration: 1,
    startDate: new Date().toISOString().split("T")[0],
    dependency: "",
    humans: 1,
    bots: 0,
    estimatedCost: 0,
  })

  const handleChange = (field: string, value: string | number) => {
    setTaskData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would save the task data here
    onClose()
  }

  // Calculate end date based on start date and duration
  const calculateEndDate = () => {
    const date = new Date(taskData.startDate)
    date.setDate(date.getDate() + taskData.duration)
    return date.toISOString().split("T")[0]
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-card-blue border-blue w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="sticky top-0 bg-card-blue z-10">
          <div className="flex justify-between items-center">
            <CardTitle>Add New Task</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="taskName">Task Name</Label>
              <Input
                id="taskName"
                placeholder="Enter task name"
                className="bg-darker-blue border-blue"
                value={taskData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taskDescription">Task Description</Label>
              <Textarea
                id="taskDescription"
                placeholder="Brief description of the task"
                className="bg-darker-blue border-blue min-h-[100px]"
                value={taskData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Select value={taskData.project} onValueChange={(value) => handleChange("project", value)}>
                  <SelectTrigger id="project" className="bg-darker-blue border-blue">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Website Redesign">Website Redesign</SelectItem>
                    <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                    <SelectItem value="Marketing Campaign">Marketing Campaign</SelectItem>
                    <SelectItem value="Content Strategy">Content Strategy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={taskData.category} onValueChange={(value) => handleChange("category", value)}>
                  <SelectTrigger id="category" className="bg-darker-blue border-blue">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Research">Research</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Content">Content</SelectItem>
                    <SelectItem value="QA">QA</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="Analytics">Analytics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={taskData.priority} onValueChange={(value) => handleChange("priority", value)}>
                  <SelectTrigger id="priority" className="bg-darker-blue border-blue">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dependency">Dependency</Label>
                <Input
                  id="dependency"
                  placeholder="Enter task name this depends on"
                  className="bg-darker-blue border-blue"
                  value={taskData.dependency}
                  onChange={(e) => handleChange("dependency", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  className="bg-darker-blue border-blue"
                  value={taskData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Auto-calculated)</Label>
                <Input
                  id="endDate"
                  type="date"
                  className="bg-darker-blue border-blue"
                  value={calculateEndDate()}
                  readOnly
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Duration (days): {taskData.duration}</Label>
              <Slider
                value={[taskData.duration]}
                min={1}
                max={30}
                step={1}
                onValueChange={(value) => handleChange("duration", value[0])}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Estimated Cost ($)</Label>
              <Input
                id="estimatedCost"
                type="number"
                placeholder="Enter estimated cost"
                className="bg-darker-blue border-blue"
                value={taskData.estimatedCost || ""}
                onChange={(e) => handleChange("estimatedCost", Number.parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="p-4 bg-darker-blue border border-blue rounded-lg">
              <h3 className="font-medium mb-3">Resource Allocation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Humans: {taskData.humans}</Label>
                  <Slider
                    value={[taskData.humans]}
                    min={0}
                    max={5}
                    step={1}
                    onValueChange={(value) => handleChange("humans", value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Bots: {taskData.bots}</Label>
                  <Slider
                    value={[taskData.bots]}
                    min={0}
                    max={5}
                    step={1}
                    onValueChange={(value) => handleChange("bots", value[0])}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
              <h4 className="font-medium text-indigo-400 mb-2">AI Suggestion</h4>
              <p className="text-sm text-light-blue">
                Based on the task details, we recommend assigning 1 human and 2 bots for optimal efficiency. This task
                is well-suited for automation with our QABot and ContentBot.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Task</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
