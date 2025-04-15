"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import { Bot, HelpCircle, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

// Sample task allocation data
const projectAllocations: Record<
  string,
  {
    humans: { name: string; tasks: number; utilization: number }[]
    bots: { name: string; tasks: number; utilization: number }[]
    tasks: {
      id: string
      name: string
      assignee: { type: "human" | "bot"; name: string }
      category: string
      complexity: "Low" | "Medium" | "High"
      duration: number
    }[]
    aiSuggestions: string[]
  }
> = {
  "1": {
    humans: [
      { name: "Alex Johnson", tasks: 5, utilization: 85 },
      { name: "Sarah Chen", tasks: 3, utilization: 70 },
      { name: "Michael Brown", tasks: 4, utilization: 90 },
      { name: "Emily Davis", tasks: 4, utilization: 75 },
      { name: "David Wilson", tasks: 2, utilization: 60 },
    ],
    bots: [
      { name: "DocBot", tasks: 1, utilization: 40 },
      { name: "ReviewBot", tasks: 1, utilization: 30 },
      { name: "FrontendBot", tasks: 2, utilization: 85 },
      { name: "QABot", tasks: 2, utilization: 50 },
      { name: "DeployBot", tasks: 1, utilization: 20 },
    ],
    tasks: [
      {
        id: "t1-1",
        name: "Competitor Analysis",
        assignee: { type: "human", name: "Sarah Chen" },
        category: "Research",
        complexity: "Medium",
        duration: 5,
      },
      {
        id: "t1-2",
        name: "User Interviews",
        assignee: { type: "human", name: "Michael Brown" },
        category: "Research",
        complexity: "Medium",
        duration: 6,
      },
      {
        id: "t1-3",
        name: "Requirements Documentation",
        assignee: { type: "bot", name: "DocBot" },
        category: "Documentation",
        complexity: "Low",
        duration: 5,
      },
      {
        id: "t2-1",
        name: "Wireframing",
        assignee: { type: "human", name: "Emily Davis" },
        category: "Design",
        complexity: "Medium",
        duration: 5,
      },
      {
        id: "t2-2",
        name: "UI Design",
        assignee: { type: "human", name: "David Wilson" },
        category: "Design",
        complexity: "High",
        duration: 7,
      },
      {
        id: "t2-3",
        name: "Design Review",
        assignee: { type: "bot", name: "ReviewBot" },
        category: "QA",
        complexity: "Low",
        duration: 3,
      },
      {
        id: "t3-1",
        name: "Frontend Development",
        assignee: { type: "bot", name: "FrontendBot" },
        category: "Development",
        complexity: "High",
        duration: 16,
      },
      {
        id: "t3-2",
        name: "Backend Integration",
        assignee: { type: "human", name: "Michael Brown" },
        category: "Development",
        complexity: "High",
        duration: 16,
      },
      {
        id: "t4-1",
        name: "QA Testing",
        assignee: { type: "bot", name: "QABot" },
        category: "QA",
        complexity: "Medium",
        duration: 8,
      },
      {
        id: "t4-2",
        name: "User Acceptance Testing",
        assignee: { type: "human", name: "Sarah Chen" },
        category: "QA",
        complexity: "Medium",
        duration: 5,
      },
      {
        id: "t4-3",
        name: "Deployment",
        assignee: { type: "bot", name: "DeployBot" },
        category: "DevOps",
        complexity: "Low",
        duration: 1,
      },
    ],
    aiSuggestions: [
      "Reassign 'UI Design' from David Wilson to Emily Davis for better workload balance",
      "Increase bot utilization by moving 'QA Testing' entirely to QABot",
      "Consider adding another bot for frontend development tasks",
      "Michael Brown is over-allocated; redistribute some of his tasks",
    ],
  },
  "2": {
    humans: [
      { name: "Alex Johnson", tasks: 2, utilization: 65 },
      { name: "Emily Davis", tasks: 1, utilization: 80 },
      { name: "Michael Brown", tasks: 1, utilization: 70 },
    ],
    bots: [
      { name: "FrontendBot", tasks: 1, utilization: 90 },
      { name: "TestBot", tasks: 1, utilization: 40 },
    ],
    tasks: [
      {
        id: "m1",
        name: "Planning & Requirements",
        assignee: { type: "human", name: "Alex Johnson" },
        category: "Planning",
        complexity: "High",
        duration: 16,
      },
      {
        id: "m2",
        name: "UI/UX Design",
        assignee: { type: "human", name: "Emily Davis" },
        category: "Design",
        complexity: "High",
        duration: 21,
      },
      {
        id: "m3",
        name: "Frontend Development",
        assignee: { type: "bot", name: "FrontendBot" },
        category: "Development",
        complexity: "High",
        duration: 27,
      },
      {
        id: "m4",
        name: "Backend Development",
        assignee: { type: "human", name: "Michael Brown" },
        category: "Development",
        complexity: "High",
        duration: 37,
      },
      {
        id: "m5",
        name: "Testing & Deployment",
        assignee: { type: "bot", name: "TestBot" },
        category: "QA",
        complexity: "Medium",
        duration: 16,
      },
    ],
    aiSuggestions: [
      "Add another bot to assist with Frontend Development",
      "Consider splitting Backend Development into smaller tasks",
      "TestBot is underutilized; consider assigning more testing tasks",
    ],
  },
  "3": {
    humans: [
      { name: "Sarah Chen", tasks: 1, utilization: 75 },
      { name: "David Wilson", tasks: 1, utilization: 60 },
    ],
    bots: [
      { name: "ContentBot", tasks: 1, utilization: 85 },
      { name: "AnalyticsBot", tasks: 1, utilization: 50 },
    ],
    tasks: [
      {
        id: "mc1",
        name: "Campaign Strategy",
        assignee: { type: "human", name: "Sarah Chen" },
        category: "Strategy",
        complexity: "High",
        duration: 6,
      },
      {
        id: "mc2",
        name: "Content Creation",
        assignee: { type: "bot", name: "ContentBot" },
        category: "Content",
        complexity: "Medium",
        duration: 11,
      },
      {
        id: "mc3",
        name: "Campaign Launch",
        assignee: { type: "human", name: "David Wilson" },
        category: "Marketing",
        complexity: "Medium",
        duration: 4,
      },
      {
        id: "mc4",
        name: "Performance Analysis",
        assignee: { type: "bot", name: "AnalyticsBot" },
        category: "Analytics",
        complexity: "Medium",
        duration: 3,
      },
    ],
    aiSuggestions: [
      "AnalyticsBot could start preliminary analysis during the Campaign Launch phase",
      "Consider adding another human resource to assist with Campaign Launch",
    ],
  },
}

export default function TaskAllocation({ projectId }: { projectId: string }) {
  const [optimized, setOptimized] = useState(false)

  // Get allocation data for the current project
  const allocationData = projectAllocations[projectId]

  if (!allocationData) {
    return <div>No allocation data available for this project.</div>
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Research":
        return "bg-purple-500/20 text-purple-500 hover:bg-purple-500/30"
      case "Design":
        return "bg-pink-500/20 text-pink-500 hover:bg-pink-500/30"
      case "Development":
        return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
      case "QA":
        return "bg-green-500/20 text-green-500 hover:bg-green-500/30"
      case "DevOps":
        return "bg-cyan-500/20 text-cyan-500 hover:bg-cyan-500/30"
      case "Documentation":
        return "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
      case "Planning":
        return "bg-indigo-500/20 text-indigo-500 hover:bg-indigo-500/30"
      case "Strategy":
        return "bg-violet-500/20 text-violet-500 hover:bg-violet-500/30"
      case "Content":
        return "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30"
      case "Marketing":
        return "bg-rose-500/20 text-rose-500 hover:bg-rose-500/30"
      case "Analytics":
        return "bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Current Resource Allocation</h3>
        <Button variant={optimized ? "default" : "outline"} onClick={() => setOptimized(!optimized)}>
          {optimized ? "View Original Allocation" : "Apply AI Optimization"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-darker-blue border-blue">
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 mr-2 text-indigo-400" />
              <h3 className="font-medium">Human Resources</h3>
            </div>

            <div className="space-y-4">
              {allocationData.humans.map((human) => (
                <div key={human.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="font-medium text-sm">{human.name}</span>
                      <span className="ml-2 text-xs text-light-blue">{human.tasks} tasks</span>
                    </div>
                    <span className="text-sm">{human.utilization}%</span>
                  </div>
                  <Progress
                    value={human.utilization}
                    className="h-2"
                    indicatorClassName={cn(
                      human.utilization > 90
                        ? "bg-red-500"
                        : human.utilization > 75
                          ? "bg-orange-500"
                          : "bg-indigo-500",
                    )}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-darker-blue border-blue">
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <Bot className="h-5 w-5 mr-2 text-purple-400" />
              <h3 className="font-medium">Bot Resources</h3>
            </div>

            <div className="space-y-4">
              {allocationData.bots.map((bot) => (
                <div key={bot.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="font-medium text-sm">{bot.name}</span>
                      <span className="ml-2 text-xs text-light-blue">{bot.tasks} tasks</span>
                    </div>
                    <span className="text-sm">{bot.utilization}%</span>
                  </div>
                  <Progress
                    value={bot.utilization}
                    className="h-2"
                    indicatorClassName={cn(
                      bot.utilization > 90 ? "bg-red-500" : bot.utilization > 75 ? "bg-orange-500" : "bg-purple-500",
                    )}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-darker-blue border-blue">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Task Assignments</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Tasks are assigned to humans and bots based on complexity, dependencies, and resource capabilities.
                    The AI optimizes this allocation for maximum efficiency.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-3">
            {allocationData.tasks.map((task) => (
              <div key={task.id} className="p-3 border border-blue rounded-lg bg-card-blue/50">
                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <div>
                    <div className="font-medium">{task.name}</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="outline" className={getCategoryColor(task.category)}>
                        {task.category}
                      </Badge>
                      <Badge variant="outline" className={getComplexityColor(task.complexity)}>
                        {task.complexity} Complexity
                      </Badge>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
                        {task.duration} days
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-light-blue">Assigned to:</span>
                    <Badge
                      variant="outline"
                      className={
                        task.assignee.type === "human"
                          ? "bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30"
                          : "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                      }
                    >
                      {task.assignee.type === "human" ? "👤" : "🤖"} {task.assignee.name}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
        <h4 className="font-medium text-indigo-400 mb-2">AI Optimization Suggestions</h4>
        <ul className="space-y-2 text-sm text-light-blue">
          {allocationData.aiSuggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start">
              <span className="bg-indigo-500/20 text-indigo-500 rounded-full p-1 mr-2 text-xs">•</span>
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
        <Button
          size="sm"
          variant="outline"
          className="mt-3 border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/20"
        >
          Apply All Suggestions
        </Button>
      </div>
    </div>
  )
}
