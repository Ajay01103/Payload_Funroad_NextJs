import type { SearchParams } from "nuqs/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { DEFA_LIMIT } from "@/constants"
import { getQueryClient, trpc } from "@/trpc/server"

import { loadProductFilters } from "@/modules/products/hooks/searchParams"
import { ProductListView } from "@/modules/products/views/product-list-view"

interface Props {
  searchParams: Promise<SearchParams>
}

const Page = async ({ searchParams }: Props) => {
  const filters = await loadProductFilters(searchParams)

  const queryClient = getQueryClient()
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions(
      {
        ...filters,
        limit: DEFA_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.docs.length > 0 ? lastPage.nextPage : undefined
        },
      },
    ),
  )

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView />
    </HydrationBoundary>
  )
}

export default Page
