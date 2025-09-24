"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { Poppins } from "next/font/google"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { loginAuthScehma } from "../schema"
import type { z } from "zod/v4"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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
        toast.error("Something went wrong", { description: error.shape?.message })
      },
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.auth.session.queryFilter())
        router.push("/")
      },
    })
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
                  href="/sign-up">
                  Sign up
                </Link>
              </Button>
            </div>

            <h1 className="font-medium text-4xl">Welcome back to Funroad</h1>

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
              disabled={loginMutation.isPending}
              type="submit"
              size="lg"
              variant="elevated"
              className="bg-black text-white hover:bg-pink-400 hover:text-primary">
              Sign in
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
