"use client"

import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DEFA_LIMIT } from "@/constants"
import { useTRPC } from "@/trpc/client"
import { useProductFilters } from "../hooks/use-product-filters"
import { ProductCard, ProductCardSkeleton } from "./product-card"
import { cn } from "@/lib/utils"

interface Props {
  category?: string
  tenantSlug?: string
  narrowView?: boolean
}

export const ProductList = ({ category, tenantSlug, narrowView }: Props) => {
  const [filters] = useProductFilters()
  const trpc = useTRPC()
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.products.getMany.infiniteQueryOptions(
        { ...filters, category, tenantSlug, limit: DEFA_LIMIT },
        {
          getNextPageParam: (lastPage) => {
            return lastPage.docs.length > 0 ? lastPage.nextPage : undefined
          },
        },
      ),
    )

  if (data.pages?.[0]?.docs.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-y-4 rounded-lg border border-dashed border-black bg-white p-8">
        <Inbox />
        <p className="text-base font-medium">No products found</p>
      </div>
    )
  }

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4",
          narrowView && "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3",
        )}>
        {data.pages
          .flatMap((page) => page.docs)
          .map((product) => (
            <ProductCard
              key={product.id}
              id={String(product.id)}
              name={product.name}
              imageUrl={product.image?.url}
              tenantSlug={product.tenant?.slug}
              tenantImageUrl={product.tenant?.image?.url}
              reviewRating={3}
              reviewCount={5}
              price={product.price}
            />
          ))}
      </div>
      <div className="flex justify-center pt-8">
        {hasNextPage && (
          <Button
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            className="bg-white text-base font-medium disabled:opacity-50"
            variant="elevated">
            Load more
          </Button>
        )}
      </div>
    </>
  )
}

export const ProductListSkeleton = ({ narrowView }: Props) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4",
        narrowView && "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3",
      )}>
      {Array.from({ length: DEFA_LIMIT }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}
