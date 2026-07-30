import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import type { SearchParams } from "nuqs/server"
import { DEFA_LIMIT } from "@/constants"
import { loadProductFilters } from "@/modules/products/hooks/searchParams"
import { ProductListView } from "@/modules/products/views/product-list-view"
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
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions(
      {
        category,
        limit: DEFA_LIMIT,
        ...filters,
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
      <ProductListView category={category} />
    </HydrationBoundary>
  )
}

export default CategoryPage
