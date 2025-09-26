import type { Category } from "@/payload-types"
import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import type { Where } from "payload"
import { z } from "zod/v4"

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { payload } = ctx

      const where: Where = {}

      if (input.minPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
        }
      }

      if (input.maxPrice) {
        where.price = {
          less_than_equal: input.maxPrice,
        }
      }

      if (input.category) {
        const categoriesData = await payload.find({
          collection: "categories",
          limit: 1,
          depth: 1,
          pagination: false,
          where: {
            slug: {
              equals: input.category,
            },
          },
        })

        const formattedData = categoriesData.docs.map((doc) => ({
          ...doc,
          subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            // becoz depth is 1 we are confident subDoc will be a type of "Category"
            ...(doc as Category),
            subcategories: undefined,
          })),
        }))

        const subcategoriesSlug = []

        const parentCategory = formattedData[0]

        if (parentCategory) {
          subcategoriesSlug.push(
            ...parentCategory.subcategories.map((subcategory) => subcategory.slug)
          )

          where["category.slug"] = {
            in: [input.category, ...subcategoriesSlug],
          }
        }
      }

      const data = await payload.find({
        collection: "products",
        depth: 1, // populates the image and categories of the product
        where,
      })

      return data
    }),
})
