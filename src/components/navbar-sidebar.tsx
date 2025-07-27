import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

interface Props {
  items: NavItem[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface NavItem {
  href: string
  children: React.ReactNode
}

export const NavbarSidebar = ({ items, onOpenChange, open }: Props) => {
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent
        side="left"
        className="p-0 transition-all"
      >
        <SheetHeader className="border-b p-4">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex h-full flex-col overflow-y-auto pb-2">
          {items.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              onClick={() => onOpenChange(false)}
              className="flex w-full items-center p-4 text-left font-medium text-base hover:bg-black hover:text-white"
            >
              {item.children}
            </Link>
          ))}

          <div className="border-t">
            <Link
              href="/sign-in"
              onClick={() => onOpenChange(false)}
              className="flex w-full items-center p-4 text-left font-medium text-base hover:bg-black hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              onClick={() => onOpenChange(false)}
              className="flex w-full items-center p-4 text-left font-medium text-base hover:bg-black hover:text-white"
            >
              Start Selling
            </Link>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
