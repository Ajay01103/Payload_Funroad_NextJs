import { cookies as getCookies, headers as getHeaders } from "next/headers"

import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import { TRPCError } from "@trpc/server"
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

      // Check for existing username or email in a single query
      const existingUsers = await payload.find({
        collection: "users",
        limit: 2, // We only need to find up to 2 users (one for username, one for email)
        where: {
          or: [
            {
              username: {
                equals: input.username,
              },
            },
            {
              email: {
                equals: input.email,
              },
            },
          ],
        },
      })

      // Check which field(s) are already taken
      const existingUsername = existingUsers.docs.find(
        (user) => user.username === input.username
      )

      if (existingUsername) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username already taken",
        })
      }

      const existingEmail = existingUsers.docs.find(
        (user) => user.email === input.email
      )

      if (existingEmail) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email already registered",
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
        name: `${payload.config.cookiePrefix}-token`, // standard way for payload auth otherwise auth will not work
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
      name: `${payload.config.cookiePrefix}-token`, // standard way for payload auth otherwise auth will not work
      value: data.token,
      httpOnly: true,
      path: "/",
      // sameSite: 'none',
      // "domain": ""
      // TODO: ensure cross domain cookie sharing for prod
    })

    return data
  }),
  logout: baseProcedure.mutation(async ({ ctx }) => {
    const { payload } = ctx

    const cookies = await getCookies()
    cookies.delete(`${payload.config.cookiePrefix}-token`)
  }),
})
