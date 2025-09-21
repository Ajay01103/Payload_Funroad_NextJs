import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { SearchFilters, SearchFiltersLoading } from "@/components/search-filters"
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { Suspense } from "react"

interface Props {
  children: React.ReactNode
}

const Layout = async ({ children }: Props) => {
  const queryClient = getQueryClient()

  // prefetching categories
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions())

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<SearchFiltersLoading />}>
          <SearchFilters />
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1 bg-[#F4F4F0]">{children}</div>
      <Footer />
    </div>
  )
}

export default Layout
