"use client"

import { useState, useMemo } from "react"
import {
  buildingBlockMilestones,
  type BuildingBlockMilestone,
  buildingBlockCategories,
} from "../../data/buildingBlocksMilestones"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BuildingBlockTimeline() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const filteredMilestones = useMemo(() => {
    return selectedCategory === "All"
      ? buildingBlockMilestones
      : buildingBlockMilestones.filter((milestone) => milestone.category === selectedCategory)
  }, [selectedCategory])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Internet Building Blocks Timeline</h2>
        <Select onValueChange={(value) => setSelectedCategory(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {buildingBlockCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        {filteredMilestones.map((milestone) => (
          <MilestoneCard key={milestone.id} milestone={milestone} />
        ))}
      </div>
    </div>
  )
}

function MilestoneCard({ milestone }: { milestone: BuildingBlockMilestone }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{milestone.title}</CardTitle>
          <Badge variant="secondary">{milestone.year}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-2">{milestone.description}</p>
        <p className="text-sm text-muted-foreground">Impact: {milestone.impact}</p>
        <Badge className="mt-2">{milestone.category}</Badge>
      </CardContent>
    </Card>
  )
}

