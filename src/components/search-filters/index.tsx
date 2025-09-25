"use client"

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Categories } from "./categories"
import { SearchInput } from "./search-input"
import { useParams } from "next/navigation"
import { DEFAULT_BG_COLOR } from "@/constants"
import { BreadCrumbNavigation } from "./bread-crumb-navigation"

export const SearchFilters = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions())

  const params = useParams()
  const categoryParam = params.category as string | undefined
  const activeCategory = categoryParam || "all"

  const activeCategoryData = data.find(
    (category) => category.slug === activeCategory
  )

  const activeCategoryColor = activeCategoryData?.color || DEFAULT_BG_COLOR
  const activeCategoryName = activeCategoryData?.name || null

  const activeSubCategory = params.subcategory as string | undefined
  const activeSubCategoryName =
    activeCategoryData?.subcategories.find(
      (subcategory) => subcategory.slug === activeSubCategory
    )?.name || null

  return (
    <div
      style={{
        backgroundColor: activeCategoryColor,
      }}
      className="flex w-full flex-col gap-4 border-b px-4 py-8 lg:px-12">
      <SearchInput />
      <div className="hidden lg:block">
        <Categories data={data} />
      </div>
      <BreadCrumbNavigation
        activeCategoryName={activeCategoryName}
        activeCategory={activeCategory}
        activeSubCategoryName={activeSubCategoryName}
      />
    </div>
  )
}

export const SearchFiltersLoading = () => {
  return (
    <div
      style={{
        backgroundColor: "#F5F5F5",
      }}
      className="flex w-full flex-col gap-4 border-b px-4 py-8 lg:px-12">
      <SearchInput disabled />
      <div className="hidden lg:block">
        <div className="h-11" />
      </div>
    </div>
  )
}
