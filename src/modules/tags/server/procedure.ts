import { z } from "zod/v4"
import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import { DEFAULT_TAGS_LIMIT } from "../constants"

export const tagsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_TAGS_LIMIT),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { payload } = ctx

      const data = await payload.find({
        collection: "tags",
        page: input.cursor,
        limit: input.limit,
      })

      return data
    }),
})
