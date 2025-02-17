"use client"

import { useState, useCallback, useMemo } from "react"
import type { HumanMilestone } from "../../data/humanMilestones"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import MilestoneDetails from "./MilestoneDetails"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"

interface MilestoneCardProps {
  milestone: HumanMilestone
  isLeft: boolean
  onCategoryClick: (category: string) => void
}

export default function MilestoneCard({ milestone, isLeft, onCategoryClick }: MilestoneCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleCategoryClick = useCallback(
    (category: string) => {
      onCategoryClick(category)
    },
    [onCategoryClick],
  )

  const formatYear = (year: number) => {
    const absYear = Math.abs(year)
    if (year < 0) {
      return `${absYear} BCE`
    } else {
      return `${absYear} CE`
    }
  }

  const getCategoryGradient = useMemo(() => {
    const isArt = milestone.categories.includes("Art")
    const isTechnology = milestone.categories.some((cat) =>
      [
        "Technology",
        "Computing",
        "Communication",
        "Transportation",
        "Energy",
        "Space",
        "Navigation",
        "Industrial",
      ].includes(cat),
    )

    if (isArt && isTechnology) {
      return "bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500"
    } else if (isArt) {
      return "bg-gradient-to-r from-purple-600 to-pink-500"
    } else if (isTechnology) {
      return "bg-gradient-to-r from-blue-500 to-cyan-500"
    } else {
      return "bg-gradient-to-r from-gray-600 to-gray-500"
    }
  }, [milestone.categories])

  return (
    <div className={`flex ${isLeft ? "justify-start" : "justify-end"} mb-6 md:mb-0`}>
      <motion.div
        className="w-full md:w-[calc(50%-1rem)] flex items-center"
        initial={{ x: isLeft ? -50 : 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="hidden md:flex flex-col items-center justify-center mr-4">
          <div
            className={`${getCategoryGradient} text-white text-xl font-bold rounded-full w-24 h-24 flex flex-col items-center justify-center border-4 border-gray-800 shadow-lg transform hover:scale-110 transition-transform duration-200`}
          >
            <span className="text-sm">{milestone.year < 0 ? "BCE" : "CE"}</span>
            <span className="text-2xl">{Math.abs(milestone.year)}</span>
          </div>
          <div className="h-full w-1 bg-gradient-to-b from-blue-500 to-purple-600 my-2"></div>
        </div>
        <Card className="flex-grow overflow-hidden shadow-lg border border-gray-700 bg-gray-800">
          <CardHeader className={`${getCategoryGradient} text-white p-4`}>
            <div className="flex items-center space-x-4">
              <div className="md:hidden bg-black text-white text-lg font-bold rounded-full w-16 h-16 flex flex-col items-center justify-center border-2 border-white">
                <span className="text-xs">{milestone.year < 0 ? "BCE" : "CE"}</span>
                <span className="text-sm">{Math.abs(milestone.year)}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg md:text-xl">{milestone.title}</CardTitle>
                </div>
                <div className="flex flex-wrap items-center mt-1 gap-2">
                  {milestone.categories.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="text-xs md:text-sm bg-black text-white cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCategoryClick(category)
                      }}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 text-gray-300">
            <p className="text-sm md:text-base">{milestone.description}</p>
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`mt-4 w-full justify-between text-white hover:opacity-90 ${getCategoryGradient}`}
            >
              {isExpanded ? "Hide Details" : "Show Details"}
              {isExpanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </Button>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MilestoneDetails milestone={milestone} />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

