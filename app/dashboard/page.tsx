"use client"

import { useRef } from "react"
import Loader from "@/app/components/layout/Loader"
import { useSession } from "@/lib/auth"
import DashboardHeader from "./components/DashboardHeader"

const Page = () => {
  const containerRef = useRef<HTMLElement>(null)
  const { data: session, isPending: isSessionLoading } = useSession()

  if (isSessionLoading && !session) {
    return <Loader />
  }

  return (
    <>
      <DashboardHeader />
      <section ref={containerRef} className="h-full w-full bg-background overflow-hidden">
        <div className="bg-primary/10  my-5 mx-auto w-2/3 p-5 rounded-2xl flex items-center justify-center">
          <h1 className="text-xl font-bold">Welcome back, {session?.user.name}!</h1>
        </div>
      </section>
    </>
  )
}

export default Page
