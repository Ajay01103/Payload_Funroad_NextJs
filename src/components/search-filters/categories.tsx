"use client"

import type { CustomCategory } from "@/app/(app)/(home)/types"
import { CategoryDropdown } from "./category-dropdown"
import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { ListFilter } from "lucide-react"
import { CategoriesSidebar } from "./categories-sidebar"

interface Props {
  data: CustomCategory[]
}

export const Categories = ({ data }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const viewallRef = useRef<HTMLDivElement>(null)

  const [visibleCount, setVisibleCount] = useState(data.length)
  const [isAnyHovered, setIsAnyHovered] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const activeCategory = "all"

  const activeCategoryIndex = data.findIndex((cat) => cat.slug === activeCategory)
  const isActiveCategoryHidden =
    activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1

  useEffect(() => {
    const calculateVisible = () => {
      if (!containerRef.current || !measureRef.current || !viewallRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const viewAllWidth = viewallRef.current.offsetWidth
      const availableWidth = containerWidth - viewAllWidth

      const items = Array.from(measureRef.current.children)
      let totalWidth = 0
      let visible = 0

      for (const item of items) {
        const width = item.getBoundingClientRect().width

        if (totalWidth + width > availableWidth) break
        totalWidth += width
        visible++
      }

      setVisibleCount(visible)
    }

    const resizeObserver = new ResizeObserver(calculateVisible)
    // biome-ignore lint/style/noNonNullAssertion: fine to use
    resizeObserver.observe(containerRef.current!)

    return () => resizeObserver.disconnect()
  }, [])

  return (
    <div className="relative w-full">
      <CategoriesSidebar
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        data={data}
      />
      {/* hidden div to measure all items */}
      <div
        ref={measureRef}
        style={{ position: "fixed", top: -9999, left: -9999 }}
        className="pointer-events-none absolute flex opacity-0">
        {data.map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={false}
            />
          </div>
        ))}
      </div>

      {/** biome-ignore lint/a11y/noStaticElementInteractions: fine to use */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
        className="flex flex-nowrap items-center">
        {data.slice(0, visibleCount).map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={isAnyHovered}
            />
          </div>
        ))}

        <div
          ref={viewallRef}
          className="shrink-0">
          <Button
            onClick={() => setIsSidebarOpen(true)}
            className={cn(
              "h-11 rounded-full border-transparent bg-transparent px-4 text-black hover:border-primary hover:bg-white",
              isActiveCategoryHidden && !isAnyHovered && "border-primary bg-white"
            )}>
            View All
            <ListFilter className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
