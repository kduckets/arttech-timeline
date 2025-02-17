"use client"

import { useState, useCallback, useMemo } from "react"
import type { HumanMilestone } from "../../data/humanMilestones"
import MilestoneCard from "./MilestoneCard"
import InfiniteScroll from "./InfiniteScroll"
import { motion, AnimatePresence } from "framer-motion"

interface TimelineProps {
  milestones: HumanMilestone[]
  filteredCategories: string[]
  onCategoryClick: (category: string) => void
}

const ITEMS_PER_PAGE = 50

function groupMilestonesByEra(milestones: HumanMilestone[]): [string, HumanMilestone[]][] {
  const grouped = milestones.reduce(
    (acc, milestone) => {
      let era: string
      if (milestone.year < 0) {
        era = "BCE"
      } else if (milestone.year < 1000) {
        era = "1st Millennium CE"
      } else if (milestone.year < 1800) {
        era = "1000-1799 CE"
      } else if (milestone.year < 1900) {
        era = "19th Century"
      } else if (milestone.year < 2000) {
        era = "20th Century"
      } else {
        era = "21st Century"
      }
      if (!acc[era]) {
        acc[era] = []
      }
      acc[era].push(milestone)
      return acc
    },
    {} as Record<string, HumanMilestone[]>,
  )

  return Object.entries(grouped)
    .sort(([a], [b]) => {
      const order = ["BCE", "1st Millennium CE", "1000-1799 CE", "19th Century", "20th Century", "21st Century"]
      return order.indexOf(a) - order.indexOf(b)
    })
    .map(([era, milestones]) => [era, milestones.sort((a, b) => a.year - b.year)])
}

export default function Timeline({ milestones, filteredCategories, onCategoryClick }: TimelineProps) {
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE)

  const sortedMilestones = useMemo(() => [...milestones].sort((a, b) => a.year - b.year), [milestones])
  const groupedMilestones = useMemo(
    () => groupMilestonesByEra(sortedMilestones.slice(0, displayCount)),
    [sortedMilestones, displayCount],
  )

  const loadMore = useCallback(() => {
    setDisplayCount((prevCount) => prevCount + ITEMS_PER_PAGE)
  }, [])

  return (
    <div className="relative">
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600 hidden md:block"
        initial={{ height: 0 }}
        animate={{ height: "100%" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <AnimatePresence initial={false}>
        <div className="space-y-12 md:space-y-24">
          {groupedMilestones.map(([era, eraMilestones], eraIndex) => (
            <div key={era} className="relative">
              <motion.h2
                className="text-2xl font-bold mb-8 text-center md:text-left bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: eraIndex * 0.1 }}
              >
                {era}
              </motion.h2>
              {eraMilestones.map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  className="mb-12 md:mb-16"
                >
                  <MilestoneCard milestone={milestone} isLeft={index % 2 === 0} onCategoryClick={onCategoryClick} />
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </AnimatePresence>
      <InfiniteScroll onLoadMore={loadMore} hasMore={displayCount < sortedMilestones.length} />
    </div>
  )
}

