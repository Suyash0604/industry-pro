"use client"

import { useState } from "react"
import { Bot, Plus, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import ResourceAllocation from "@/components/resource-allocation"

// Sample resource data
const resourceData = {
  humans: [
    {
      id: "h1",
      name: "Alex Johnson",
      role: "Project Manager",
      skills: ["Management", "Planning", "Communication"],
      utilization: 85,
      projects: ["Website Redesign", "Mobile App Development"],
    },
    {
      id: "h2",
      name: "Sarah Chen",
      role: "UX Researcher",
      skills: ["User Research", "Analysis", "Documentation"],
      utilization: 70,
      projects: ["Website Redesign", "Marketing Campaign"],
    },
    {
      id: "h3",
      name: "Michael Brown",
      role: "Full Stack Developer",
      skills: ["Frontend", "Backend", "API Integration"],
      utilization: 90,
      projects: ["Website Redesign", "Mobile App Development"],
    },
    {
      id: "h4",
      name: "Emily Davis",
      role: "UI Designer",
      skills: ["UI Design", "Wireframing", "Prototyping"],
      utilization: 75,
      projects: ["Website Redesign", "Mobile App Development"],
    },
    {
      id: "h5",
      name: "David Wilson",
      role: "Frontend Developer",
      skills: ["React", "CSS", "JavaScript"],
      utilization: 60,
      projects: ["Website Redesign", "Marketing Campaign"],
    },
  ],
  bots: [
    {
      id: "b1",
      name: "DocBot",
      type: "Documentation",
      capabilities: ["Documentation Generation", "Content Formatting"],
      utilization: 40,
      projects: ["Website Redesign"],
    },
    {
      id: "b2",
      name: "ReviewBot",
      type: "QA",
      capabilities: ["Code Review", "Design Review"],
      utilization: 30,
      projects: ["Website Redesign"],
    },
    {
      id: "b3",
      name: "FrontendBot",
      type: "Development",
      capabilities: ["HTML/CSS Generation", "React Components"],
      utilization: 85,
      projects: ["Website Redesign", "Mobile App Development"],
    },
    {
      id: "b4",
      name: "QABot",
      type: "Testing",
      capabilities: ["Automated Testing", "Bug Detection"],
      utilization: 50,
      projects: ["Website Redesign"],
    },
    {
      id: "b5",
      name: "DeployBot",
      type: "DevOps",
      capabilities: ["Deployment Automation", "CI/CD"],
      utilization: 20,
      projects: ["Website Redesign"],
    },
    {
      id: "b6",
      name: "ContentBot",
      type: "Content",
      capabilities: ["Content Generation", "SEO Optimization"],
      utilization: 85,
      projects: ["Marketing Campaign"],
    },
    {
      id: "b7",
      name: "AnalyticsBot",
      type: "Analytics",
      capabilities: ["Data Analysis", "Reporting"],
      utilization: 50,
      projects: ["Marketing Campaign"],
    },
    {
      id: "b8",
      name: "TestBot",
      type: "Testing",
      capabilities: ["End-to-End Testing", "Performance Testing"],
      utilization: 40,
      projects: ["Mobile App Development"],
    },
  ],
}

export default function ResourcesPage() {
  const [resourceAllocation, setResourceAllocation] = useState({
    humans: resourceData.humans.length,
    bots: resourceData.bots.length,
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Resource Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Resource
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card-blue border-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-light-blue">Total Human Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resourceData.humans.length}</div>
            <p className="text-xs text-light-blue">
              {Math.round(
                resourceData.humans.reduce((acc, human) => acc + human.utilization, 0) / resourceData.humans.length,
              )}
              % average utilization
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card-blue border-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-light-blue">Total Bot Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resourceData.bots.length}</div>
            <p className="text-xs text-light-blue">
              {Math.round(resourceData.bots.reduce((acc, bot) => acc + bot.utilization, 0) / resourceData.bots.length)}%
              average utilization
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card-blue border-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-light-blue">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-light-blue">12 total tasks in progress</p>
          </CardContent>
        </Card>

        <Card className="bg-card-blue border-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-light-blue">Resource Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-light-blue">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card-blue border-blue">
        <CardHeader>
          <CardTitle>Resource Allocation</CardTitle>
          <CardDescription className="text-light-blue">
            Current allocation of human and bot resources across projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResourceAllocation resources={resourceAllocation} onChange={setResourceAllocation} />
        </CardContent>
      </Card>

      <Tabs defaultValue="humans" className="space-y-4">
        <TabsList className="bg-darker-blue">
          <TabsTrigger value="humans">Human Resources</TabsTrigger>
          <TabsTrigger value="bots">Bot Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="humans" className="space-y-4">
          <Card className="bg-card-blue border-blue">
            <CardHeader>
              <CardTitle>Human Resources</CardTitle>
              <CardDescription className="text-light-blue">
                Manage your human resources and their project assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resourceData.humans.map((human) => (
                  <div key={human.id} className="p-4 border border-blue rounded-lg bg-card-blue/50">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <div className="flex items-center">
                          <User className="h-5 w-5 mr-2 text-indigo-400" />
                          <h3 className="font-medium">{human.name}</h3>
                        </div>
                        <div className="text-sm text-light-blue mt-1">{human.role}</div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {human.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="bg-indigo-500/10 text-indigo-400">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 min-w-[200px]">
                        <div className="flex justify-between text-sm">
                          <span className="text-light-blue">Utilization</span>
                          <span>{human.utilization}%</span>
                        </div>
                        <Progress
                          value={human.utilization}
                          className="h-2"
                          indicatorClassName={
                            human.utilization > 90
                              ? "bg-red-500"
                              : human.utilization > 75
                                ? "bg-orange-500"
                                : "bg-indigo-500"
                          }
                        />

                        <div className="text-sm text-light-blue mt-2">Projects:</div>
                        <div className="flex flex-wrap gap-2">
                          {human.projects.map((project, index) => (
                            <Badge key={index} variant="outline" className="bg-blue-500/10 text-blue-400">
                              {project}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bots" className="space-y-4">
          <Card className="bg-card-blue border-blue">
            <CardHeader>
              <CardTitle>Bot Resources</CardTitle>
              <CardDescription className="text-light-blue">
                Manage your AI bot resources and their project assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resourceData.bots.map((bot) => (
                  <div key={bot.id} className="p-4 border border-blue rounded-lg bg-card-blue/50">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <div className="flex items-center">
                          <Bot className="h-5 w-5 mr-2 text-purple-400" />
                          <h3 className="font-medium">{bot.name}</h3>
                        </div>
                        <div className="text-sm text-light-blue mt-1">{bot.type} Bot</div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {bot.capabilities.map((capability, index) => (
                            <Badge key={index} variant="outline" className="bg-purple-500/10 text-purple-400">
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 min-w-[200px]">
                        <div className="flex justify-between text-sm">
                          <span className="text-light-blue">Utilization</span>
                          <span>{bot.utilization}%</span>
                        </div>
                        <Progress
                          value={bot.utilization}
                          className="h-2"
                          indicatorClassName={
                            bot.utilization > 90
                              ? "bg-red-500"
                              : bot.utilization > 75
                                ? "bg-orange-500"
                                : "bg-purple-500"
                          }
                        />

                        <div className="text-sm text-light-blue mt-2">Projects:</div>
                        <div className="flex flex-wrap gap-2">
                          {bot.projects.map((project, index) => (
                            <Badge key={index} variant="outline" className="bg-blue-500/10 text-blue-400">
                              {project}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
