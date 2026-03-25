import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/app/components/ui/button"

const Loader = () => {
  return (
    <section className="h-full w-full flex flex-col gap-8 items-center justify-center bg-background">
      <div className="relative">
        <div className="size-12 border-2 border-foreground rotate-45 animate-loader-morph-outer " />
        <div className="absolute inset-2 border border-foreground/50 rotate-45 animate-loader-morph-inner" />
      </div>

      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Please wait while we are loading the content for you. This should only take a moment.
        </p>
        <Button variant="link" asChild>
          <Link href="/">
            <ArrowLeft />
            Return Home
          </Link>
        </Button>
      </div>
    </section>
  )
}

export default Loader
