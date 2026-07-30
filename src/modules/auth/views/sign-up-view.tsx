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
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useTRPC } from "@/trpc/client"
import { registerAuthSchema } from "../schema"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
})

export const SignUpView = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const trpc = useTRPC()
  const registerMuation = useMutation(
    trpc.auth.register.mutationOptions({
      onError: (error) => {
        toast.error("Something went wrong", { description: error.message })
      },
      onSuccess: () => {
        toast.success("Registered")
        queryClient.invalidateQueries(trpc.auth.session.queryFilter())
        router.push("/")
      },
    }),
  )

  const form = useForm<z.infer<typeof registerAuthSchema>>({
    mode: "all",
    resolver: zodResolver(registerAuthSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  })

  const onSubmit = (data: z.infer<typeof registerAuthSchema>) => {
    registerMuation.mutate(data)
  }

  const username = form.watch("username")
  const usernameErrors = form.formState.errors.username

  const _showPreview = username && !usernameErrors
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
                href="/sign-in">
                Sign in
              </Link>
            </Button>
          </div>

          <h1 className="text-4xl font-medium">
            Join over 1000s of creators earning money on Funroad
          </h1>

          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>User name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription className={cn("hidden", true && "block")}>
                  Your store will be available at&nbsp;
                  <strong>{username}</strong>.shop.com
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

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
            disabled={registerMuation.isPending}
            type="submit"
            size="lg"
            variant="elevated"
            className="hover:text-primary bg-black text-white hover:bg-pink-400">
            Create account
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
