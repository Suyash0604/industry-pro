import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ProjectSummary from "@/components/project-summary"

export default function Dashboard() {
  // Sample data for dashboard
  const recentProjects = [
    { id: "1", name: "Website Redesign", completion: 75, tasks: 24, completedTasks: 18 },
    { id: "2", name: "Mobile App Development", completion: 45, tasks: 36, completedTasks: 16 },
    { id: "3", name: "Marketing Campaign", completion: 90, tasks: 15, completedTasks: 13 },
  ]

  const resourceStats = {
    totalHumans: 12,
    activeHumans: 10,
    totalBots: 8,
    activeBots: 6,
    humanUtilization: 83,
    botUtilization: 75,
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/projects/create">
            Create New Project
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card-blue border-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-light-blue">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-light-blue">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-card-blue border-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-light-blue">Active Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-light-blue">+8 from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-card-blue border-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-light-blue">Human Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {resourceStats.activeHumans}/{resourceStats.totalHumans}
            </div>
            <p className="text-xs text-light-blue">{resourceStats.humanUtilization}% utilization</p>
          </CardContent>
        </Card>

        <Card className="bg-card-blue border-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-light-blue">Bot Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {resourceStats.activeBots}/{resourceStats.totalBots}
            </div>
            <p className="text-xs text-light-blue">{resourceStats.botUtilization}% utilization</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-card-blue border-blue lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription className="text-light-blue">Overview of your latest projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <ProjectSummary key={project.id} project={project} />
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/projects">View All Projects</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card-blue border-blue">
          <CardHeader>
            <CardTitle>Resource Allocation</CardTitle>
            <CardDescription className="text-light-blue">Current human and bot distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-light-blue">Human Resources</span>
                  <span className="text-sm text-light-blue">{resourceStats.humanUtilization}%</span>
                </div>
                <div className="w-full bg-blue-900/30 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full"
                    style={{ width: `${resourceStats.humanUtilization}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-light-blue">Bot Resources</span>
                  <span className="text-sm text-light-blue">{resourceStats.botUtilization}%</span>
                </div>
                <div className="w-full bg-blue-900/30 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${resourceStats.botUtilization}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="font-medium mb-2">AI Optimization Insights</h4>
                <ul className="space-y-2 text-sm text-light-blue">
                  <li className="flex items-start">
                    <span className="bg-green-500/20 text-green-500 rounded-full p-1 mr-2 text-xs">•</span>
                    <span>Increase bot allocation for frontend tasks to improve efficiency</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-yellow-500/20 text-yellow-500 rounded-full p-1 mr-2 text-xs">•</span>
                    <span>Human resources are over-allocated in design tasks</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-500/20 text-blue-500 rounded-full p-1 mr-2 text-xs">•</span>
                    <span>Consider adding 2 more bots for testing tasks</span>
                  </li>
                </ul>
              </div>

              <Button className="w-full" asChild>
                <Link href="/resources">Manage Resources</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card-blue border-blue">
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
          <CardDescription className="text-light-blue">
            Smart suggestions to optimize your project workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
              <h4 className="font-medium text-indigo-400 mb-2">Schedule Optimization</h4>
              <p className="text-sm text-light-blue mb-3">
                Based on your current resource allocation and task dependencies, we recommend adjusting the timeline for
                the Mobile App Development project.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/20"
              >
                View Details
              </Button>
            </div>

            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <h4 className="font-medium text-purple-400 mb-2">Resource Reallocation</h4>
              <p className="text-sm text-light-blue mb-3">
                Reallocating 2 bots from QA testing to frontend development could reduce project completion time by
                approximately 15%.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
              >
                Apply Suggestion
              </Button>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="font-medium text-blue-400 mb-2">Critical Path Alert</h4>
              <p className="text-sm text-light-blue mb-3">
                The API integration task is on the critical path and at risk of delay. Consider adding more resources to
                prevent project timeline slippage.
              </p>
              <Button size="sm" variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20">
                Resolve Issue
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
