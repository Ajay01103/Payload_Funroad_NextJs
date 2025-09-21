import type { CategoriesGetManyOutput } from "@/modules/categories/types"
import Link from "next/link"

interface Props {
  category: CategoriesGetManyOutput[1]
  isOpen: boolean
  position: { top: number; left: number }
}

export const SubCategoryMenu = ({ category, isOpen, position }: Props) => {
  if (!isOpen || !category.subcategories || category.subcategories.length === 0) {
    return null
  }

  const backgroundColor = category.color || "#F5F5F5"

  return (
    <div
      className="fixed z-100"
      style={{ top: position.top, left: position.left }}>
      {/* invisible gap */}
      <div className="h-3 w-60" />

      <div
        style={{ backgroundColor }}
        className="-translate-x-[2px] -translate-y-[2px] w-60 overflow-hidden rounded-md border text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div>
          {category.subcategories.map((subcategory) => (
            <Link
              key={subcategory.slug}
              href={`/${category.slug}/${subcategory.slug}`}
              className="flex w-full items-center justify-between p-4 text-left font-medium underline hover:bg-black hover:text-white">
              {subcategory.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
