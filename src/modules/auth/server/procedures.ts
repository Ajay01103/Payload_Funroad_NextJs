import { headers as getHeaders, cookies as getCookies } from "next/headers"

import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import { TRPCError } from "@trpc/server"
import { AUTH_COOKIE } from "../constants"
import { loginAuthScehma, registerAuthSchema } from "../schema"

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const { payload } = ctx
    const headers = await getHeaders()

    const session = await payload.auth({ headers })

    return session
  }),
  register: baseProcedure
    .input(registerAuthSchema)
    .mutation(async ({ ctx, input }) => {
      const { payload } = ctx

      const existingData = payload.find({
        collection: "users",
        limit: 1,
        where: {
          username: {
            equals: input.username,
          },
        },
      })

      const existingUser = (await existingData).docs[0]

      if (existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "username already taken",
        })
      }

      await payload.create({
        collection: "users",
        data: {
          username: input.username,
          email: input.email,
          password: input.password, // this is automatically hashed by payload
          role: "user" as const, // default role for new users
        },
      })

      const data = await payload.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      })

      if (!data.token) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Failed to login" })
      }

      const cookies = await getCookies()
      cookies.set({
        name: AUTH_COOKIE,
        value: data.token,
        httpOnly: true,
        path: "/",
        // sameSite: 'none',
        // "domain": ""
        // TODO: ensure cross domain cookie sharing for prod
      })
    }),
  login: baseProcedure.input(loginAuthScehma).mutation(async ({ ctx, input }) => {
    const { payload } = ctx

    const data = await payload.login({
      collection: "users",
      data: {
        email: input.email,
        password: input.password,
      },
    })

    if (!data.token) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Failed to login" })
    }

    const cookies = await getCookies()
    cookies.set({
      name: AUTH_COOKIE,
      value: data.token,
      httpOnly: true,
      path: "/",
      // sameSite: 'none',
      // "domain": ""
      // TODO: ensure cross domain cookie sharing for prod
    })

    return data
  }),
  logout: baseProcedure.mutation(async () => {
    const cookies = await getCookies()
    cookies.delete(AUTH_COOKIE)
  }),
})
