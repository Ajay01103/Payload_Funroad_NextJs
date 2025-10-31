import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { ProductListSkeleton } from "@/modules/products/components/products-list"
import { loadProductFilters } from "@/modules/products/hooks/searchParams"
import { ProductListView } from "@/modules/products/views/product-list-view"
import { getQueryClient, trpc } from "@/trpc/server"

interface Props {
  params: Promise<{
    subcategory: string
  }>
  searchParams: Promise<SearchParams>
}

const SubCategoryPage = async ({ params, searchParams }: Props) => {
  const { subcategory } = await params
  const filters = await loadProductFilters(searchParams)

  const queryClient = getQueryClient()

  // prefetching
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({ category: subcategory, ...filters })
  )

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductListView category={subcategory} />
      </Suspense>
    </HydrationBoundary>
  )
}

export default SubCategoryPage
