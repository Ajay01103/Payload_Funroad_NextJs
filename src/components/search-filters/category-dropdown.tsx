/** biome-ignore-all lint/a11y/useKeyWithClickEvents: no problem */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: no problem */
"use client"

import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { useRef, useState } from "react"
import { useDropdownPosition } from "./use-dropdown-position"
import { SubCategoryMenu } from "./subcategory-menu"
import Link from "next/link"
import type { CategoriesGetManyOutput } from "@/modules/categories/types"

interface Props {
  category: CategoriesGetManyOutput[1]
  isActive?: boolean
  isNavigationHovered?: boolean
}

export const CategoryDropdown = ({
  category,
  isActive,
  isNavigationHovered,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownref = useRef<HTMLDivElement>(null)

  const { getDropdownPosition } = useDropdownPosition(dropdownref)
  const dropdownPosition = getDropdownPosition()

  const onMouseEnter = () => {
    if (category.subcategories && category.subcategories.length > 0) {
      setIsOpen(true)
    }
  }

  const onMouseLeave = () => setIsOpen(false)

  // improove mobile mode filters can be disabled at no worry
  const toggleDropdown = () => {
    if (category.subcategories.length) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div
      className="relative"
      ref={dropdownref}
      onClick={toggleDropdown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      <div className="relative">
        <Button
          asChild
          variant="elevated"
          className={cn(
            "h-11 rounded-full border-transparent bg-transparent px-4 text-black hover:border-primary hover:bg-white",
            isActive && !isNavigationHovered && "border-primary bg-white",
            isOpen &&
              "-translate-x-[4px] -translate-y-[4px] border-primary bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          )}>
          <Link
            prefetch
            href={`/${category.slug === "all" ? "" : category.slug}`}>
            {category.name}
          </Link>
        </Button>

        {category.subcategories && category.subcategories.length > 0 && (
          <div
            className={cn(
              "-bottom-3 -translate-x-1/2 absolute left-1/2 h-0 w-0 border-r-[10px] border-r-transparent border-b-[10px] border-b-black border-l-[10px] border-l-transparent opacity-0",
              isOpen && "opacity-100"
            )}
          />
        )}
      </div>

      <SubCategoryMenu
        category={category}
        isOpen={isOpen}
        position={dropdownPosition}
      />
    </div>
  )
}
