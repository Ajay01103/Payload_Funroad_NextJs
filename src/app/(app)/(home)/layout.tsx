import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { SearchFilters } from "@/components/search-filters"
import { getPayload } from "payload"
import configParams from "@payload-config"
import type { Category } from "@/payload-types"
import type { CustomCategory } from "./types"

interface Props {
  children: React.ReactNode
}

const Layout = async ({ children }: Props) => {
  const payload = await getPayload({
    config: configParams,
  })

  const data = await payload.find({
    collection: "categories",
    depth: 1,
    where: {
      parent: {
        exists: false,
      },
    },
    sort: "name",
  })

  const formattedData: CustomCategory[] = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      // becoz depth is 1 we are confident subDoc will be a type of "Category"
      ...(doc as Category),
      subcategories: undefined,
    })),
  }))

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <SearchFilters data={formattedData} />
      <div className="flex-1 bg-[#F4F4F0]">{children}</div>
      <Footer />
    </div>
  )
}

export default Layout
