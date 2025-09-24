"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Poppins } from "next/font/google"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavbarSidebar } from "./navbar-sidebar"
import { useState } from "react"
import { MenuIcon } from "lucide-react"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
})

interface NavProps {
  children: React.ReactNode
  isActive?: boolean
  href: string
}

const NavItems = [
  {
    href: "/",
    children: "Home",
  },
  {
    href: "/about",
    children: "About",
  },
  {
    href: "/features",
    children: "Features",
  },
  {
    href: "/pricing",
    children: "Pricing",
  },
  {
    href: "/contact",
    children: "Contact",
  },
]

export const Navbar = () => {
  const trpc = useTRPC()
  const session = useQuery(trpc.auth.session.queryOptions())

  const pathName = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <nav className="flex h-20 justify-between border-b bg-white font-medium">
      <Link
        href="/"
        className="flex items-center pl-6">
        <span className={cn("font-semibold text-5xl", poppins.className)}>
          funroad
        </span>
      </Link>

      <NavbarSidebar
        items={NavItems}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />

      <div className="hidden items-center gap-4 lg:flex">
        {NavItems.map((item) => (
          <NavButton
            key={item.href}
            href={item.href}
            isActive={pathName === item.href}>
            {item.children}
          </NavButton>
        ))}
      </div>

      {session.data?.user ? (
        <div className="hidden lg:flex">
          <Link
            href="/admin"
            className={cn(
              buttonVariants({
                variant: "secondary",
                className:
                  "h-full rounded-none border-t-0 border-r-0 border-b-0 border-l bg-black px-12 text-lg text-white transition-colors hover:bg-pink-400 hover:text-black",
              })
            )}>
            Dashboard
          </Link>
        </div>
      ) : (
        <div className="hidden lg:flex">
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({
                variant: "secondary",
                className:
                  "h-full rounded-none border-t-0 border-r-0 border-b-0 border-l bg-white px-12 text-lg transition-colors hover:bg-pink-400",
              })
            )}>
            Login
          </Link>
          <Link
            href="/sign-up"
            className={cn(
              buttonVariants({
                variant: "secondary",
                className:
                  "h-full rounded-none border-t-0 border-r-0 border-b-0 border-l bg-black px-12 text-lg text-white transition-colors hover:bg-pink-400 hover:text-black",
              })
            )}>
            Start Selling
          </Link>
        </div>
      )}

      <div className="flex items-center justify-center lg:hidden">
        <Button
          variant="ghost"
          className="size-12 border-transparent bg-white"
          onClick={() => setSidebarOpen(true)}>
          <MenuIcon />
        </Button>
      </div>
    </nav>
  )
}

const NavButton = ({ children, isActive, href }: NavProps) => {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "transition-colors",
        isActive ? "bg-black text-white hover:bg-black/90" : "hover:bg-gray-100",
        "rounded-full border-transparent px-4 hover:border-black"
      )}>
      {children}
    </Link>
  )
}
