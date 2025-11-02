import React, { Suspense } from "react"
import { ProductFilters } from "../components/product-filters"
import { ProductSort } from "../components/product-sort"
import { ProductList, ProductListSkeleton } from "../components/products-list"

interface Props {
  category?: string
}

export const ProductListView = ({ category }: Props) => {
  return (
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
  )
}
