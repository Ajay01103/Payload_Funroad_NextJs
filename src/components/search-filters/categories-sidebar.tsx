import type { CustomCategory } from "@/app/(app)/(home)/types"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useState } from "react"
import { ScrollArea } from "../ui/scroll-area"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: CustomCategory[]
}

export const CategoriesSidebar = ({ onOpenChange, open, data }: Props) => {
  const router = useRouter()

  const [parentCategories, setParentCategories] = useState<CustomCategory[] | null>(
    null
  )
  const [selectedCategory, setSelectedCategory] = useState<CustomCategory | null>(
    null
  )

  // show parent categories if we have those
  const currentCategories = parentCategories ?? data ?? []

  const handleOpenChange = (open: boolean) => {
    setSelectedCategory(null)
    setParentCategories(null)
    onOpenChange(open)
  }

  const handleCategoryClick = (category: CustomCategory) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CustomCategory[])
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
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronRight className="size-4" />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
