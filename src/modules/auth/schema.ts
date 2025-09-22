import { z } from "zod/v4"

export const registerAuthSchema = z.object({
  email: z.email(),
  password: z.string().min(4, "Password is too short"),
  username: z
    .string()
    .min(3, "username atleast 6 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "username can only have lowercase letters, numbers and hyphens, it must starts and end with letters or numbers"
    )
    .refine((val) => !val.includes("--"), "username cannot contain double hyphens")
    .transform((val) => val.toLowerCase()),
})

export const loginAuthScehma = z.object({
  email: z.email(),
  password: z.string().min(4),
})
