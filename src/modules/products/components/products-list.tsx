"use client"

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"

interface Props {
  category?: string
}

export const ProductList = ({ category }: Props) => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.products.getMany.queryOptions({ category }))

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {data.docs.map((product) => (
        <div
          key={product.id}
          className="rounded-md border bg-white">
          <h2 className="font-medium text-xl">{product.name}</h2>
          <p>{product.price}</p>
        </div>
      ))}
    </div>
  )
}

export const ProductListSkeleton = () => {
  return <div>Loading....</div>
}
