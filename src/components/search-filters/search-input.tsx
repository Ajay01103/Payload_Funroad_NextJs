"use client"

import { ListFilter, SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { CustomCategory } from "@/app/(app)/(home)/types"
import { CategoriesSidebar } from "./categories-sidebar"
import { useState } from "react"
import { Button } from "../ui/button"

interface Props {
  disabled?: boolean
  data: CustomCategory[]
}

export const SearchInput = ({ disabled, data }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex w-full items-center gap-2">
      <CategoriesSidebar
        data={data}
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />
      <div className="relative w-full">
        <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-neutral-500" />
        <Input
          className="pl-8"
          placeholder="Search Products"
          disabled={disabled}
        />
      </div>

      <Button
        variant="elevated"
        className="flex size-12 shrink-0 lg:hidden"
        onClick={() => setIsSidebarOpen(true)}>
        <ListFilter />
      </Button>
    </div>
  )
}
