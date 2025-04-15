"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Key, Save, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  const [geminiApiKey, setGeminiApiKey] = useState("")
  const [geminiInitialized, setGeminiInitialized] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    taskAssignments: true,
    projectUpdates: true,
    resourceAlerts: false,
    dailyDigest: true,
  })
  const [aiSettings, setAiSettings] = useState({
    autoAssignTasks: true,
    suggestOptimizations: true,
    criticalPathAnalysis: true,
    resourceOptimizationLevel: 75,
    humanBotBalancingStrategy: "balanced",
  })

  const handleInitializeGemini = () => {
    if (geminiApiKey) {
      setGeminiInitialized(true)
    }
  }

  const handleNotificationChange = (setting: string, value: boolean) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  const handleAISettingChange = (setting: string, value: any) => {
    setAiSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-darker-blue">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="ai">AI Configuration</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="bg-card-blue border-blue">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription className="text-light-blue">Configure basic application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc-5">
                  <SelectTrigger id="timezone" className="bg-darker-blue border-blue">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                    <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                    <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                    <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                    <SelectItem value="utc+8">China Standard Time (UTC+8)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select defaultValue="mdy">
                  <SelectTrigger id="dateFormat" className="bg-darker-blue border-blue">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select defaultValue="dark">
                  <SelectTrigger id="theme" className="bg-darker-blue border-blue">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="compactView">Compact View</Label>
                  <div className="text-sm text-light-blue">Reduce spacing and show more content on screen</div>
                </div>
                <Switch id="compactView" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoSave">Auto Save</Label>
                  <div className="text-sm text-light-blue">Automatically save changes to projects and tasks</div>
                </div>
                <Switch id="autoSave" defaultChecked />
              </div>

              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card className="bg-card-blue border-blue">
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
              <CardDescription className="text-light-blue">Configure AI settings and integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-darker-blue border border-blue rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Key className="h-5 w-5 mr-2 text-indigo-400" />
                    <h3 className="font-medium">Gemini API Integration</h3>
                  </div>
                  <Badge
                    variant="outline"
                    className={geminiInitialized ? "bg-green-500/20 text-green-500" : "bg-gray-500/20 text-gray-400"}
                  >
                    {geminiInitialized ? "Initialized" : "Not Initialized"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="geminiApiKey">Gemini API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="geminiApiKey"
                      type="password"
                      placeholder="Enter Gemini API Key"
                      className="bg-darker-blue border-blue"
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                    />
                    <Button onClick={handleInitializeGemini} disabled={!geminiApiKey}>
                      Initialize Gemini AI
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">AI Task Assignment</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoAssignTasks">Auto-assign Tasks</Label>
                    <div className="text-sm text-light-blue">
                      Automatically assign tasks to humans and bots based on AI analysis
                    </div>
                  </div>
                  <Switch
                    id="autoAssignTasks"
                    checked={aiSettings.autoAssignTasks}
                    onCheckedChange={(checked) => handleAISettingChange("autoAssignTasks", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="suggestOptimizations">Suggest Optimizations</Label>
                    <div className="text-sm text-light-blue">
                      Receive AI suggestions for optimizing resource allocation
                    </div>
                  </div>
                  <Switch
                    id="suggestOptimizations"
                    checked={aiSettings.suggestOptimizations}
                    onCheckedChange={(checked) => handleAISettingChange("suggestOptimizations", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="criticalPathAnalysis">Critical Path Analysis</Label>
                    <div className="text-sm text-light-blue">
                      Automatically identify and highlight critical path in project timelines
                    </div>
                  </div>
                  <Switch
                    id="criticalPathAnalysis"
                    checked={aiSettings.criticalPathAnalysis}
                    onCheckedChange={(checked) => handleAISettingChange("criticalPathAnalysis", checked)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Resource Optimization Level: {aiSettings.resourceOptimizationLevel}%</Label>
                  <Slider
                    value={[aiSettings.resourceOptimizationLevel]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(value) => handleAISettingChange("resourceOptimizationLevel", value[0])}
                  />
                  <div className="flex justify-between text-xs text-light-blue">
                    <span>Conservative</span>
                    <span>Balanced</span>
                    <span>Aggressive</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="humanBotBalancingStrategy">Human-Bot Balancing Strategy</Label>
                <Select
                  value={aiSettings.humanBotBalancingStrategy}
                  onValueChange={(value) => handleAISettingChange("humanBotBalancingStrategy", value)}
                >
                  <SelectTrigger id="humanBotBalancingStrategy" className="bg-darker-blue border-blue">
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="human-focused">Human-Focused (Prioritize human resources)</SelectItem>
                    <SelectItem value="balanced">Balanced (Equal priority)</SelectItem>
                    <SelectItem value="bot-focused">Bot-Focused (Maximize automation)</SelectItem>
                    <SelectItem value="cost-optimized">Cost-Optimized (Minimize cost)</SelectItem>
                    <SelectItem value="time-optimized">Time-Optimized (Minimize time)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                <h4 className="font-medium text-indigo-400 mb-2">AI Recommendation</h4>
                <p className="text-sm text-light-blue">
                  Based on your project types and team composition, we recommend using the "Balanced" strategy with a
                  75% optimization level for optimal results.
                </p>
              </div>

              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save AI Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="bg-card-blue border-blue">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription className="text-light-blue">
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <div className="text-sm text-light-blue">Receive notifications via email</div>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                />
              </div>

              <div className="space-y-4 pl-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="taskAssignments">Task Assignments</Label>
                    <div className="text-sm text-light-blue">Notifications when tasks are assigned to you</div>
                  </div>
                  <Switch
                    id="taskAssignments"
                    checked={notificationSettings.taskAssignments}
                    onCheckedChange={(checked) => handleNotificationChange("taskAssignments", checked)}
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="projectUpdates">Project Updates</Label>
                    <div className="text-sm text-light-blue">Notifications for project status changes</div>
                  </div>
                  <Switch
                    id="projectUpdates"
                    checked={notificationSettings.projectUpdates}
                    onCheckedChange={(checked) => handleNotificationChange("projectUpdates", checked)}
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="resourceAlerts">Resource Alerts</Label>
                    <div className="text-sm text-light-blue">Notifications for resource allocation changes</div>
                  </div>
                  <Switch
                    id="resourceAlerts"
                    checked={notificationSettings.resourceAlerts}
                    onCheckedChange={(checked) => handleNotificationChange("resourceAlerts", checked)}
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dailyDigest">Daily Digest</Label>
                    <div className="text-sm text-light-blue">Daily summary of project activities</div>
                  </div>
                  <Switch
                    id="dailyDigest"
                    checked={notificationSettings.dailyDigest}
                    onCheckedChange={(checked) => handleNotificationChange("dailyDigest", checked)}
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notificationEmail">Notification Email</Label>
                <Input
                  id="notificationEmail"
                  type="email"
                  placeholder="Enter email address"
                  className="bg-darker-blue border-blue"
                  defaultValue="user@example.com"
                />
              </div>

              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card className="bg-card-blue border-blue">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription className="text-light-blue">
                Manage your account information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <User className="h-8 w-8 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-medium">John Doe</h3>
                  <p className="text-sm text-light-blue">Project Manager</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter first name"
                    className="bg-darker-blue border-blue"
                    defaultValue="John"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter last name"
                    className="bg-darker-blue border-blue"
                    defaultValue="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  className="bg-darker-blue border-blue"
                  defaultValue="john.doe@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select defaultValue="project-manager">
                  <SelectTrigger id="role" className="bg-darker-blue border-blue">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="project-manager">Project Manager</SelectItem>
                    <SelectItem value="team-lead">Team Lead</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Change Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  className="bg-darker-blue border-blue"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className="bg-darker-blue border-blue"
                />
              </div>

              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Account Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
