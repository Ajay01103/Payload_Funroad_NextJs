"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Poppins } from "next/font/google"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod/v4"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useTRPC } from "@/trpc/client"
import { loginAuthScehma } from "../schema"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
})

export const SignInView = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const trpc = useTRPC()
  const loginMutation = useMutation(
    trpc.auth.login.mutationOptions({
      onError: (error) => {
        toast.error("Something went wrong", {
          description: error.shape?.message,
        })
      },
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.auth.session.queryFilter())
        router.push("/")
      },
    }),
  )

  const form = useForm<z.infer<typeof loginAuthScehma>>({
    resolver: zodResolver(loginAuthScehma),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (data: z.infer<typeof loginAuthScehma>) => {
    loginMutation.mutate(data)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <div className="h-screen w-full overflow-y-auto bg-[#F4F4F4] lg:col-span-3">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 p-4 lg:p-12">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/">
              <span className={cn("font-semibold text-2xl", poppins.className)}>
                Funroad
              </span>
            </Link>

            <Button
              asChild
              variant="ghost"
              size="sm">
              <Link
                prefetch
                href="/sign-up">
                Sign up
              </Link>
            </Button>
          </div>

          <h1 className="text-4xl font-medium">Welcome back to Funroad</h1>

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input
                  type="password"
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Button
            disabled={loginMutation.isPending}
            type="submit"
            size="lg"
            variant="elevated"
            className="hover:text-primary bg-black text-white hover:bg-pink-400">
            Sign in
          </Button>
        </form>
      </div>

      <div
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="hidden h-screen w-full lg:col-span-2 lg:block"
      />
    </div>
  )
}
