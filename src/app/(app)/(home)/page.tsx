"use client"

import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"

export default function Home() {
  const trpc = useTRPC()
  const { data } = useQuery(trpc.auth.session.queryOptions())

  return (
    <div className="flex h-screen w-full flex-col gap-y-10">
      Home
      <p>auth state: {JSON.stringify(data?.user)}</p>
    </div>
  )
}
