"use client"

import { Minus, Plus, BotIcon as Robot, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

interface ResourceAllocationProps {
  resources: {
    humans: number
    bots: number
  }
  onChange: (resources: { humans: number; bots: number }) => void
}

export default function ResourceAllocation({ resources, onChange }: ResourceAllocationProps) {
  const handleHumanChange = (value: number) => {
    onChange({ ...resources, humans: value })
  }

  const handleBotChange = (value: number) => {
    onChange({ ...resources, bots: value })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-darker-blue border-blue">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-indigo-400" />
                <h3 className="font-medium">Humans</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleHumanChange(Math.max(0, resources.humans - 1))}
                  disabled={resources.humans <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{resources.humans}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleHumanChange(resources.humans + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Slider
              defaultValue={[5]}
              max={20}
              min={0}
              step={1}
              value={[resources.humans]}
              onValueChange={(value) => handleHumanChange(value[0])}
              className="mt-2"
            />

            <div className="mt-4 text-sm text-light-blue">
              <p>
                Human resources will be assigned to tasks requiring creativity, strategic thinking, and complex
                decision-making.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-darker-blue border-blue">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Robot className="h-5 w-5 mr-2 text-purple-400" />
                <h3 className="font-medium">Bots</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleBotChange(Math.max(0, resources.bots - 1))}
                  disabled={resources.bots <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{resources.bots}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleBotChange(resources.bots + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Slider
              defaultValue={[3]}
              max={20}
              min={0}
              step={1}
              value={[resources.bots]}
              onValueChange={(value) => handleBotChange(value[0])}
              className="mt-2"
            />

            <div className="mt-4 text-sm text-light-blue">
              <p>
                Bot resources will be assigned to repetitive tasks, data processing, testing, and other automatable
                activities.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
        <h4 className="font-medium text-indigo-400 mb-2">AI Resource Allocation Recommendation</h4>
        <p className="text-sm text-light-blue">
          Based on your project description and timeline, we recommend a balanced team of{" "}
          {Math.max(3, Math.ceil(resources.humans * 0.6))} humans and {Math.max(2, Math.ceil(resources.bots * 0.8))}{" "}
          bots for optimal efficiency.
        </p>
      </div>
    </div>
  )
}
