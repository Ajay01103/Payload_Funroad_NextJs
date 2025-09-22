"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod/v4"
import { registerAuthSchema } from "../schema"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Poppins } from "next/font/google"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTRPC } from "@/trpc/client"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
})

export const SignUpView = () => {
  const router = useRouter()

  const trpc = useTRPC()
  const registerMuation = useMutation(
    trpc.auth.register.mutationOptions({
      onError: (error) => {
        toast.error("Something went wrong", { description: error.message })
      },
      onSuccess: () => {
        toast.success("Registered")
        router.push("/")
      },
    })
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
        <Form {...form}>
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

            <h1 className="font-medium text-4xl">
              Join over 1000s of creators earning money on Funroad
            </h1>

            <FormField
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">User name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription className={cn("hidden", true && "block")}>
                    Your store will be available at&nbsp;
                    <strong>{username}</strong>.shop.com
                    {/* TODO: use proper methos to generate preview url */}
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={registerMuation.isPending}
              type="submit"
              size="lg"
              variant="elevated"
              className="bg-black text-white hover:bg-pink-400 hover:text-primary">
              Create account
            </Button>
          </form>
        </Form>
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
