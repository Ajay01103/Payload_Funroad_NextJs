import { DEFA_LIMIT } from "@/constants"
import { loadProductFilters } from "@/modules/products/hooks/searchParams"
import { ProductListView } from "@/modules/products/views/product-list-view"
import { getQueryClient, trpc } from "@/trpc/server"
import { SearchParams } from "nuqs/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

interface Props {
  searchParams: Promise<SearchParams>
  params: Promise<{ slug: string }>
}

const Page = async ({ searchParams, params }: Props) => {
  const { slug } = await params
  const filters = await loadProductFilters(searchParams)

  const queryClient = getQueryClient()
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions(
      {
        ...filters,
        tenantSlug: slug,
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
      <ProductListView
        tenantSlug={slug}
        narrowView
      />
    </HydrationBoundary>
  )
}

export default Page
