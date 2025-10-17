import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { ProductFilters } from "@/modules/products/components/product-filters"
import { ProductSort } from "@/modules/products/components/product-sort"
import {
  ProductList,
  ProductListSkeleton,
} from "@/modules/products/components/products-list"
import { loadProductFilters } from "@/modules/products/hooks/searchParams"
import { getQueryClient, trpc } from "@/trpc/server"

interface Props {
  params: Promise<{
    category: string
  }>
  searchParams: Promise<SearchParams>
}

const CategoryPage = async ({ params, searchParams }: Props) => {
  const { category } = await params
  const filters = await loadProductFilters(searchParams)
  const queryClient = getQueryClient()

  // prefetching with trpc
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({ category, ...filters })
  )

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-4 px-4 py-8 lg:px-12">
        <div className="flex flex-col justify-between gap-y-2 lg:flex-row lg:items-center lg:gap-y-0">
          <p className="font-medium text-2xl">Curated for you</p>
          <ProductSort />
        </div>
        <div className="grid grid-cols-1 gap-x-12 gap-y-6 lg:grid-cols-6 xl:grid-cols-8">
          <div className="lg:col-span-2 xl:col-span-2">
            <ProductFilters />
          </div>

          <div className="lg:col-span-4 xl:col-span-6">
            <Suspense fallback={<ProductListSkeleton />}>
              <ProductList category={category} />
            </Suspense>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default CategoryPage
