import type { Category } from "@/payload-types"

export type CustomCategory = Category & {
  subcategories: Omit<Category, "subcategories">[]
}

// export interface CustomCategory extends Omit<Category, "subcategories"> {
//   subcategories: Category[]
// }

// Alias for backward compatibility
// export type TransformedCategory = CustomCategory
