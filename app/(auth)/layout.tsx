import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"
import { ThemeToggle } from "@/app/components/ThemeToggle"
import { auth } from "@/lib/auth/server"

type LayoutProps = {
  children: ReactNode
}

const Layout = async ({ children }: LayoutProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (session) {
    redirect("/dashboard")
  }

  return (
    <main className="h-full w-full bg-background overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[30%] left-[8%] w-[15%] h-px bg-linear-to-r from-transparent via-foreground/8 to-transparent" />
        <div className="absolute top-[30%] left-[8%] w-px h-[25%] bg-linear-to-b from-foreground/6 to-transparent" />
        <div className="absolute top-[30%] left-[23%] w-px h-[20%] bg-linear-to-b from-foreground/4 to-transparent" />

        <div
          className="absolute top-[35%] left-[5%] w-[20%] h-px bg-linear-to-r from-transparent via-foreground/5 to-transparent"
          style={{ transform: "rotate(25deg)", transformOrigin: "left center" }}
        />
        <div
          className="absolute top-[50%] left-[10%] w-[12%] h-px bg-linear-to-r from-transparent via-primary/8 to-transparent"
          style={{ transform: "rotate(-15deg)", transformOrigin: "left center" }}
        />

        <div className="hidden lg:block absolute top-[45%] left-[12%] size-16 border border-foreground/4 rounded-full" />
        <div className="hidden lg:block absolute top-[45%] left-[12%] size-16 border border-foreground/2 rounded-full scale-125" />

        <div className="absolute bottom-[25%] left-[6%] w-8 h-0.5 bg-foreground/6" />
        <div className="absolute bottom-[25%] left-[18%] w-8 h-0.5 bg-foreground/4" />
        <div className="absolute bottom-[28%] left-[10%] w-6 h-0.5 bg-primary/6" />

        <div className="absolute top-[40%] left-[3%] w-px h-[30%] bg-linear-to-b from-foreground/3 via-foreground/6 to-transparent" />

        <div className="absolute left-0 top-0 bottom-0 w-0.5 lg:w-1 bg-foreground/3" />
        <div className="absolute left-12 lg:left-24 top-0 bottom-0 w-px bg-border/30" />
        <div className="absolute left-18 lg:left-36 top-1/4 bottom-1/4 w-px bg-primary/15" />

        <div className="hidden lg:block absolute left-[15%] top-1/2 -translate-y-1/2">
          <div className="size-1 bg-primary/50" />
        </div>
        <div className="hidden lg:block absolute left-[8%] top-[60%]">
          <div className="size-0.5 bg-foreground/20" />
        </div>

        <div className="absolute bottom-24 left-0 right-1/2 h-px bg-border/20" />
        <div className="absolute top-16 left-24 right-0 h-px bg-linear-to-r from-border/15 via-transparent to-transparent" />

        <div
          className="hidden xl:block absolute top-[20%] left-[2%] w-[25%] h-px bg-linear-to-r from-transparent via-foreground/2 to-transparent"
          style={{ transform: "rotate(10deg)" }}
        />
        <div
          className="hidden xl:block absolute top-[70%] left-[5%] w-[18%] h-px bg-linear-to-r from-transparent via-foreground/3 to-transparent"
          style={{ transform: "rotate(-8deg)" }}
        />
      </div>

      <nav className="absolute top-0 left-0 z-10 p-6 lg:p-8">
        <Link href="/" className="group inline-flex items-center gap-3">
          <div className="relative">
            <div className="size-10 lg:size-12 bg-foreground flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
              <span className="text-background text-sm lg:text-base font-semibold tracking-tight">K</span>
            </div>
            <div className="absolute -bottom-1 -right-1 size-10 lg:size-12 border border-foreground/10 -z-10" />
          </div>
          <div className="hidden sm:block">
            <span className="text-xs font-medium tracking-[0.3em] uppercase text-foreground/70">Kalos</span>
            <div className="w-full h-px bg-foreground/10 mt-1" />
          </div>
        </Link>
      </nav>

      <nav className="absolute top-0 right-0 z-10 p-6 lg:p-8">
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="w-px h-4 bg-border/50" />
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Sign in
          </Link>
          <div className="w-px h-4 bg-border/50" />
          <Link
            href="/register"
            className="text-sm px-4 py-2 bg-foreground text-background hover:bg-primary transition-colors duration-200"
          >
            Create account
          </Link>
        </div>
      </nav>

      <div className="h-full flex items-center justify-center lg:justify-end px-6 lg:px-[12%] xl:px-[15%]">
        {children}
      </div>

      <div className="absolute bottom-6 lg:bottom-8 left-6 lg:left-8 flex items-center gap-4">
        <div className="w-8 h-px bg-primary/40" />
        <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/60 font-medium">Enter</span>
      </div>

      <div className="absolute bottom-0 right-0 w-16 h-16">
        <div className="absolute bottom-4 right-4 w-8 h-px bg-foreground/10" />
        <div className="absolute bottom-4 right-4 w-px h-8 bg-foreground/10" />
      </div>
    </main>
  )
}

export default Layout
