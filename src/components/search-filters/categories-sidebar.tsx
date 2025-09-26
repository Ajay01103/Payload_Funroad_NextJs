import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { CategoriesGetManyOutput } from "@/modules/categories/types"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ScrollArea } from "../ui/scroll-area"

// type CategoryItem =
//   | CategoriesGetManyOutput[1]
//   | CategoriesGetManyOutput[1]["subcategories"][0]

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CategoriesSidebar = ({ onOpenChange, open }: Props) => {
  const router = useRouter()

  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions())

  const [parentCategories, setParentCategories] =
    useState<CategoriesGetManyOutput | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<
    CategoriesGetManyOutput[1] | null
  >(null)

  // show parent categories if we have those
  const currentCategories = parentCategories ?? data ?? []

  const handleOpenChange = (open: boolean) => {
    setSelectedCategory(null)
    setParentCategories(null)
    onOpenChange(open)
  }

  const handleCategoryClick = (category: CategoriesGetManyOutput[1]) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CategoriesGetManyOutput)
      setSelectedCategory(category)
    } else {
      // if there is no subcategories
      if (parentCategories && selectedCategory) {
        router.push(`/${selectedCategory.slug}/${category.slug}`)
      } else {
        // this is a main category
        if (category.slug === "all") {
          router.push("/")
        } else {
          router.push(`/${category.slug}`)
        }
      }

      handleOpenChange(false)
    }
  }

  const handleBackClick = () => {
    if (parentCategories) {
      setParentCategories(null)
      setSelectedCategory(null)
    }
  }

  const backgroundColor = selectedCategory?.color || "white"

  return (
    <Sheet
      open={open}
      onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className="p-0 transition-none"
        style={{ backgroundColor: backgroundColor }}>
        <SheetHeader className="border-b p-4">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex h-full flex-col overflow-y-auto p-2">
          {parentCategories && (
            <button
              type="button"
              onClick={handleBackClick}
              className="flex w-full items-center p-4 text-left font-medium text-base hover:bg-black hover:text-white">
              <ChevronLeft className="mr-2 size-4" />
              Back
            </button>
          )}
          {currentCategories.map((category) => (
            <button
              type="button"
              key={category.slug}
              onClick={() => handleCategoryClick(category)}
              className="flex w-full cursor-pointer items-center justify-between p-4 text-left font-medium text-base hover:bg-black hover:text-white">
              {category.name}
              {"subcategories" in category &&
                category.subcategories &&
                category.subcategories.length > 0 && (
                  <ChevronRight className="size-4" />
                )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
