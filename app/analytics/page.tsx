"use client"

import { useState } from "react"
import { BarChart, Download, PieChart, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import ProjectPerformanceChart from "@/components/project-performance-chart"
import ResourceUtilizationChart from "@/components/resource-utilization-chart"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month")
  const [projectFilter, setProjectFilter] = useState("all")

  // Sample analytics data
  const analyticsData = {
    projectCompletion: {
      "Website Redesign": 75,
      "Mobile App Development": 45,
      "Marketing Campaign": 90,
    },
    resourceUtilization: {
      humans: 83,
      bots: 75,
    },
    taskCompletion: {
      completed: 47,
      inProgress: 32,
      notStarted: 21,
    },
    budgetUtilization: {
      allocated: 150000,
      spent: 87500,
      remaining: 62500,
    },
    timelineAdherence: 92,
    projectRisk: {
      low: 65,
      medium: 25,
      high: 10,
    },
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px] bg-darker-blue border-blue">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-[180px] bg-darker-blue border-blue">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="website">Website Redesign</SelectItem>
              <SelectItem value="mobile">Mobile App Development</SelectItem>
              <SelectItem value="marketing">Marketing Campaign</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card-blue border-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-light-blue">Project Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                Object.values(analyticsData.projectCompletion).reduce((a, b) => a + b, 0) /
                  Object.values(analyticsData.projectCompletion).length,
              )}
              %
            </div>
            <Progress
              value={
                Object.values(analyticsData.projectCompletion).reduce((a, b) => a + b, 0) /
                Object.values(analyticsData.projectCompletion).length
              }
              className="h-2 mt-2"
            />
            <p className="text-xs text-light-blue mt-1">Average across all projects</p>
          </CardContent>
        </Card>

        <Card className="bg-card-blue border-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-light-blue">Resource Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((analyticsData.resourceUtilization.humans + analyticsData.resourceUtilization.bots) / 2)}%
            </div>
            <div className="space-y-2 mt-2">
              <div className="flex justify-between text-xs">
                <span className="text-light-blue">Humans</span>
                <span>{analyticsData.resourceUtilization.humans}%</span>
              </div>
              <Progress
                value={analyticsData.resourceUtilization.humans}
                className="h-1"
                indicatorClassName="bg-indigo-500"
              />
              <div className="flex justify-between text-xs">
                <span className="text-light-blue">Bots</span>
                <span>{analyticsData.resourceUtilization.bots}%</span>
              </div>
              <Progress
                value={analyticsData.resourceUtilization.bots}
                className="h-1"
                indicatorClassName="bg-purple-500"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card-blue border-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-light-blue">Budget Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.budgetUtilization.spent.toLocaleString()}</div>
            <Progress
              value={(analyticsData.budgetUtilization.spent / analyticsData.budgetUtilization.allocated) * 100}
              className="h-2 mt-2"
            />
            <p className="text-xs text-light-blue mt-1">
              {Math.round((analyticsData.budgetUtilization.spent / analyticsData.budgetUtilization.allocated) * 100)}%
              of ${analyticsData.budgetUtilization.allocated.toLocaleString()} allocated
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card-blue border-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-light-blue">Timeline Adherence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.timelineAdherence}%</div>
            <Progress value={analyticsData.timelineAdherence} className="h-2 mt-2" />
            <p className="text-xs text-light-blue mt-1">Projects on schedule</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="bg-darker-blue">
          <TabsTrigger value="performance">Project Performance</TabsTrigger>
          <TabsTrigger value="resources">Resource Utilization</TabsTrigger>
          <TabsTrigger value="tasks">Task Analytics</TabsTrigger>
          <TabsTrigger value="budget">Budget Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card className="bg-card-blue border-blue">
            <CardHeader>
              <CardTitle>Project Performance Metrics</CardTitle>
              <CardDescription className="text-light-blue">
                Tracking progress, timeline adherence, and completion rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ProjectPerformanceChart />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card-blue border-blue">
              <CardHeader>
                <CardTitle>Project Completion Status</CardTitle>
                <CardDescription className="text-light-blue">Progress of active projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analyticsData.projectCompletion).map(([project, completion]) => (
                    <div key={project} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{project}</span>
                        <span>{completion}%</span>
                      </div>
                      <Progress value={completion} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card-blue border-blue">
              <CardHeader>
                <CardTitle>Project Risk Assessment</CardTitle>
                <CardDescription className="text-light-blue">Risk levels across projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[200px]">
                  <div className="w-[200px] h-[200px] relative">
                    <PieChart className="w-full h-full text-muted-foreground/20 absolute" />
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <div className="text-2xl font-bold">{analyticsData.projectRisk.low}%</div>
                      <div className="text-sm text-light-blue">Low Risk</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <div className="text-center">
                    <Badge variant="outline" className="bg-green-500/20 text-green-500 mb-2">
                      Low Risk
                    </Badge>
                    <div className="text-xl font-bold">{analyticsData.projectRisk.low}%</div>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500 mb-2">
                      Medium Risk
                    </Badge>
                    <div className="text-xl font-bold">{analyticsData.projectRisk.medium}%</div>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="bg-red-500/20 text-red-500 mb-2">
                      High Risk
                    </Badge>
                    <div className="text-xl font-bold">{analyticsData.projectRisk.high}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card className="bg-card-blue border-blue">
            <CardHeader>
              <CardTitle>Resource Utilization</CardTitle>
              <CardDescription className="text-light-blue">
                Human and bot resource allocation and efficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResourceUtilizationChart />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card-blue border-blue">
              <CardHeader>
                <CardTitle>Human Resource Allocation</CardTitle>
                <CardDescription className="text-light-blue">
                  Distribution of human resources across projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-blue rounded-lg bg-card-blue/50">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-indigo-400" />
                        <span className="font-medium">Website Redesign</span>
                      </div>
                      <span>5 humans</span>
                    </div>
                    <Progress value={85} className="h-2" indicatorClassName="bg-indigo-500" />
                    <div className="flex justify-between text-xs text-light-blue mt-1">
                      <span>85% utilization</span>
                      <span>12 tasks assigned</span>
                    </div>
                  </div>

                  <div className="p-4 border border-blue rounded-lg bg-card-blue/50">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-indigo-400" />
                        <span className="font-medium">Mobile App Development</span>
                      </div>
                      <span>8 humans</span>
                    </div>
                    <Progress value={75} className="h-2" indicatorClassName="bg-indigo-500" />
                    <div className="flex justify-between text-xs text-light-blue mt-1">
                      <span>75% utilization</span>
                      <span>18 tasks assigned</span>
                    </div>
                  </div>

                  <div className="p-4 border border-blue rounded-lg bg-card-blue/50">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-indigo-400" />
                        <span className="font-medium">Marketing Campaign</span>
                      </div>
                      <span>4 humans</span>
                    </div>
                    <Progress value={90} className="h-2" indicatorClassName="bg-indigo-500" />
                    <div className="flex justify-between text-xs text-light-blue mt-1">
                      <span>90% utilization</span>
                      <span>9 tasks assigned</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card-blue border-blue">
              <CardHeader>
                <CardTitle>Bot Resource Allocation</CardTitle>
                <CardDescription className="text-light-blue">
                  Distribution of bot resources across projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-blue rounded-lg bg-card-blue/50">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span className="text-purple-400 mr-2">🤖</span>
                        <span className="font-medium">Website Redesign</span>
                      </div>
                      <span>3 bots</span>
                    </div>
                    <Progress value={70} className="h-2" indicatorClassName="bg-purple-500" />
                    <div className="flex justify-between text-xs text-light-blue mt-1">
                      <span>70% utilization</span>
                      <span>8 tasks assigned</span>
                    </div>
                  </div>

                  <div className="p-4 border border-blue rounded-lg bg-card-blue/50">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span className="text-purple-400 mr-2">🤖</span>
                        <span className="font-medium">Mobile App Development</span>
                      </div>
                      <span>4 bots</span>
                    </div>
                    <Progress value={85} className="h-2" indicatorClassName="bg-purple-500" />
                    <div className="flex justify-between text-xs text-light-blue mt-1">
                      <span>85% utilization</span>
                      <span>12 tasks assigned</span>
                    </div>
                  </div>

                  <div className="p-4 border border-blue rounded-lg bg-card-blue/50">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span className="text-purple-400 mr-2">🤖</span>
                        <span className="font-medium">Marketing Campaign</span>
                      </div>
                      <span>2 bots</span>
                    </div>
                    <Progress value={65} className="h-2" indicatorClassName="bg-purple-500" />
                    <div className="flex justify-between text-xs text-light-blue mt-1">
                      <span>65% utilization</span>
                      <span>4 tasks assigned</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card className="bg-card-blue border-blue">
            <CardHeader>
              <CardTitle>Task Completion Analytics</CardTitle>
              <CardDescription className="text-light-blue">Task status and completion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[400px]">
                <div className="w-[400px] h-[400px] relative">
                  <PieChart className="w-full h-full text-muted-foreground/20 absolute" />
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <div className="text-3xl font-bold">{analyticsData.taskCompletion.completed}</div>
                    <div className="text-sm text-light-blue">Completed Tasks</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <Badge variant="outline" className="bg-green-500/20 text-green-500 mb-2">
                    Completed
                  </Badge>
                  <div className="text-xl font-bold">{analyticsData.taskCompletion.completed}</div>
                  <div className="text-sm text-light-blue">
                    {Math.round(
                      (analyticsData.taskCompletion.completed /
                        (analyticsData.taskCompletion.completed +
                          analyticsData.taskCompletion.inProgress +
                          analyticsData.taskCompletion.notStarted)) *
                        100,
                    )}
                    %
                  </div>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-500 mb-2">
                    In Progress
                  </Badge>
                  <div className="text-xl font-bold">{analyticsData.taskCompletion.inProgress}</div>
                  <div className="text-sm text-light-blue">
                    {Math.round(
                      (analyticsData.taskCompletion.inProgress /
                        (analyticsData.taskCompletion.completed +
                          analyticsData.taskCompletion.inProgress +
                          analyticsData.taskCompletion.notStarted)) *
                        100,
                    )}
                    %
                  </div>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="bg-gray-500/20 text-gray-400 mb-2">
                    Not Started
                  </Badge>
                  <div className="text-xl font-bold">{analyticsData.taskCompletion.notStarted}</div>
                  <div className="text-sm text-light-blue">
                    {Math.round(
                      (analyticsData.taskCompletion.notStarted /
                        (analyticsData.taskCompletion.completed +
                          analyticsData.taskCompletion.inProgress +
                          analyticsData.taskCompletion.notStarted)) *
                        100,
                    )}
                    %
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card-blue border-blue">
            <CardHeader>
              <CardTitle>Task Efficiency Metrics</CardTitle>
              <CardDescription className="text-light-blue">
                Comparing human vs bot task completion efficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-indigo-400" />
                    Human Task Efficiency
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-light-blue">Average Completion Time</span>
                        <span>3.2 days</span>
                      </div>
                      <Progress value={68} className="h-2" indicatorClassName="bg-indigo-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-light-blue">Quality Score</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="h-2" indicatorClassName="bg-indigo-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-light-blue">On-time Completion</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-2" indicatorClassName="bg-indigo-500" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4 flex items-center">
                    <span className="text-purple-400 mr-2">🤖</span>
                    Bot Task Efficiency
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-light-blue">Average Completion Time</span>
                        <span>1.5 days</span>
                      </div>
                      <Progress value={85} className="h-2" indicatorClassName="bg-purple-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-light-blue">Quality Score</span>
                        <span>88%</span>
                      </div>
                      <Progress value={88} className="h-2" indicatorClassName="bg-purple-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-light-blue">On-time Completion</span>
                        <span>98%</span>
                      </div>
                      <Progress value={98} className="h-2" indicatorClassName="bg-purple-500" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card className="bg-card-blue border-blue">
            <CardHeader>
              <CardTitle>Budget Analysis</CardTitle>
              <CardDescription className="text-light-blue">Budget allocation, spending, and forecasts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <BarChart className="h-64 w-64 text-muted-foreground/20" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card-blue border-blue">
              <CardHeader>
                <CardTitle>Budget Breakdown</CardTitle>
                <CardDescription className="text-light-blue">Budget allocation by project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-blue rounded-lg bg-card-blue/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Website Redesign</span>
                      <span>$50,000</span>
                    </div>
                    <Progress value={65} className="h-2" />
                    <div className="flex justify-between text-xs text-light-blue mt-1">
                      <span>$32,500 spent</span>
                      <span>65% of budget</span>
                    </div>
                  </div>

                  <div className="p-4 border border-blue rounded-lg bg-card-blue/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Mobile App Development</span>
                      <span>$75,000</span>
                    </div>
                    <Progress value={37} className="h-2" />
                    <div className="flex justify-between text-xs text-light-blue mt-1">
                      <span>$28,000 spent</span>
                      <span>37% of budget</span>
                    </div>
                  </div>

                  <div className="p-4 border border-blue rounded-lg bg-card-blue/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Marketing Campaign</span>
                      <span>$25,000</span>
                    </div>
                    <Progress value={88} className="h-2" />
                    <div className="flex justify-between text-xs text-light-blue mt-1">
                      <span>$22,000 spent</span>
                      <span>88% of budget</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card-blue border-blue">
              <CardHeader>
                <CardTitle>Cost Efficiency</CardTitle>
                <CardDescription className="text-light-blue">Human vs bot resource cost comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2 flex items-center">
                      <Users className="h-5 w-5 mr-2 text-indigo-400" />
                      Human Resources
                    </h3>
                    <div className="p-4 border border-blue rounded-lg bg-card-blue/50">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-light-blue text-sm">Total Cost</div>
                          <div className="text-xl font-bold">$65,000</div>
                        </div>
                        <div>
                          <div className="text-light-blue text-sm">Avg. Cost per Task</div>
                          <div className="text-xl font-bold">$1,850</div>
                        </div>
                        <div>
                          <div className="text-light-blue text-sm">Tasks Completed</div>
                          <div className="text-xl font-bold">35</div>
                        </div>
                        <div>
                          <div className="text-light-blue text-sm">Cost Efficiency</div>
                          <div className="text-xl font-bold">72%</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2 flex items-center">
                      <span className="text-purple-400 mr-2">🤖</span>
                      Bot Resources
                    </h3>
                    <div className="p-4 border border-blue rounded-lg bg-card-blue/50">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-light-blue text-sm">Total Cost</div>
                          <div className="text-xl font-bold">$22,500</div>
                        </div>
                        <div>
                          <div className="text-light-blue text-sm">Avg. Cost per Task</div>
                          <div className="text-xl font-bold">$750</div>
                        </div>
                        <div>
                          <div className="text-light-blue text-sm">Tasks Completed</div>
                          <div className="text-xl font-bold">30</div>
                        </div>
                        <div>
                          <div className="text-light-blue text-sm">Cost Efficiency</div>
                          <div className="text-xl font-bold">94%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
        <h4 className="font-medium text-indigo-400 mb-2">AI Analytics Insights</h4>
        <p className="text-sm text-light-blue mb-3">
          Based on the current analytics data, we recommend reallocating bot resources to the Mobile App Development
          project to improve efficiency. Human resources are being utilized effectively, but there's an opportunity to
          reduce costs by increasing bot automation for repetitive tasks.
        </p>
        <Button size="sm" variant="outline" className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/20">
          View Detailed Recommendations
        </Button>
      </div>
    </div>
  )
}
