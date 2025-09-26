/** biome-ignore-all lint/a11y/noStaticElementInteractions: fine to use */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: fine to use */
"use client"

import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"
import { PriceFilter } from "./price-filter"
import { useProductFilters } from "../hooks/use-product-filters"

interface Props {
  title: string
  className?: string
  children: React.ReactNode
}

const ProductFilter = ({ children, title, className }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const Icon = isOpen ? ChevronDown : ChevronRight

  return (
    <div className={cn("flex flex-col gap-2 border-b p-4", className)}>
      <div
        onClick={() => setIsOpen((current) => !current)}
        className="flex cursor-pointer items-center justify-between">
        <p className="font-medium">{title}</p>
        <Icon className="size-5" />
      </div>
      {isOpen && children}
    </div>
  )
}

export const ProductFilters = () => {
  const [filters, setFilters] = useProductFilters()

  const onChnage = (key: keyof typeof filters, value: unknown) => {
    setFilters({ ...filters, [key]: value })
  }

  return (
    <div className="rounded-md border bg-white">
      <div className="flex items-center justify-between border-b p-4">
        <p className="font-medium">Filters</p>
        <button
          className="underline"
          onClick={() => {}}
          type="button">
          Clear
        </button>
      </div>

      <ProductFilter
        title="Price"
        className="border-b-0">
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinPriceChange={(value) => onChnage("minPrice", value)}
          onMaxPriceChange={(value) => onChnage("maxPrice", value)}
        />
      </ProductFilter>
    </div>
  )
}
