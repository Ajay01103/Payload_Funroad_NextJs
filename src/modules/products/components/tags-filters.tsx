/** biome-ignore-all lint/a11y/noStaticElementInteractions: fine to use */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: fine to use */

import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { DEFAULT_TAGS_LIMIT } from "@/modules/tags/constants"
import { useTRPC } from "@/trpc/client"

interface Props {
  value?: string[] | null
  onChange: (value: string[]) => void
}

export const TagsFilters = ({ onChange, value }: Props) => {
  const trpc = useTRPC()
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery(
      trpc.tags.getMany.infiniteQueryOptions(
        {
          limit: DEFAULT_TAGS_LIMIT,
        },
        {
          getNextPageParam: (lastpage) =>
            lastpage.docs.length > 0 ? lastpage.nextPage : undefined,
        }
      )
    )

  const onClick = (tag: string) => {
    if (value?.includes(tag)) {
      onChange(value?.filter((t) => t !== tag) || [])
    } else {
      onChange([...(value || []), tag])
    }
  }

  return (
    <div className="flex flex-col gap-y-2">
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <Loader className="size-4 animate-spin" />
        </div>
      ) : (
        data?.pages?.map((page) =>
          page.docs.map((tag) => (
            <div
              key={tag.id}
              className="flex cursor-pointer items-center justify-between"
              onClick={() => onClick(tag.name)}>
              <p className="font-medium">{tag.name}</p>
              <Checkbox
                checked={value?.includes(tag.name)}
                onCheckedChange={() => onClick(tag.name)}
              />
            </div>
          ))
        )
      )}

      {hasNextPage && (
        <button
          type="button"
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          className="cursor-pointer justify-start text-start font-medium underline disabled:opacity-50">
          Load more...
        </button>
      )}
    </div>
  )
}
