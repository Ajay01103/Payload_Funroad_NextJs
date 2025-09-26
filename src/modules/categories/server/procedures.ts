import type { Category } from "@/payload-types"
import { baseProcedure, createTRPCRouter } from "@/trpc/init"

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const { payload } = ctx

    const data = await payload.find({
      collection: "categories",
      pagination: false,
      depth: 1,
      where: {
        parent: {
          exists: false,
        },
      },
      sort: "name",
    })

    const formattedData = data.docs.map((doc) => ({
      ...doc,
      subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
        // becoz depth is 1 we are confident subDoc will be a type of "Category"
        ...(doc as Category),
      })),
    }))

    return formattedData
  }),
})
