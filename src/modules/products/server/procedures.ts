import type { Sort, Where } from "payload"
import { z } from "zod/v4"
import { DEFA_LIMIT } from "@/constants"
import type { Category, Media, Tenant } from "@/payload-types"
import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import { sortValues } from "../hooks/searchParams"

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFA_LIMIT),
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
        tenantSlug: z.string().nullable().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { payload } = ctx

      const where: Where = {}
      let sort: Sort = "-createdAt"

      if (input.sort === "trending") {
        sort = "-createdAt"
      }

      if (input.sort === "hot_and_new") {
        sort = "name"
      }

      if (input.sort === "curated") {
        sort = "+createdAt"
      }

      if (input.minPrice && input.maxPrice) {
        where.price = {
          less_than_equal: input.maxPrice,
          greater_than_equal: input.minPrice,
        }
      } else if (input.minPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
        }
      } else if (input.maxPrice) {
        where.price = {
          less_than_equal: input.maxPrice,
        }
      }

      if (input.tenantSlug) {
        where["tenant.slug"] = {
          equals: input.tenantSlug,
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
            ...parentCategory.subcategories.map((subcategory) => subcategory.slug),
          )

          where["category.slug"] = {
            in: [input.category, ...subcategoriesSlug],
          }
        }
      }

      if (input.tags && input.tags.length > 0) {
        where["tags.name"] = {
          in: input.tags,
        }
      }

      const data = await payload.find({
        collection: "products",
        depth: 2, // populates image, "categories", "tenant" & "image" of the product
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
      })

      return {
        ...data,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      }
    }),
})
