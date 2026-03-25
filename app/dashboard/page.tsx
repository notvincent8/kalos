"use client"

import Loader from "@/app/components/layout/Loader"
import { useSession } from "@/lib/auth"
import DashboardHeader from "./components/DashboardHeader"
import DashboardMain from "./components/DashboardMain"
import DashboardSidebar from "./components/DashboardSidebar"

const NEXT_SESSION = {
  programName: "Upper Body A",
  rounds: 4,
  restSeconds: 60,
}

const Page = () => {
  const { data: session, isPending: isSessionLoading } = useSession()

  if (isSessionLoading && !session) {
    return <Loader />
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader />

      <div className="flex-1 overflow-hidden grid grid-cols-12 border-t border-border/30">
        <aside className="col-span-3 h-full overflow-hidden border-r border-border/40">
          <DashboardSidebar userName={session?.user.name} />
        </aside>

        <main className="col-span-9 h-full overflow-hidden">
          <DashboardMain nextSession={NEXT_SESSION} />
        </main>
      </div>
    </div>
  )
}

export default Page
