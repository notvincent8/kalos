import { useEffect, useState } from "react"

const DashboardClock = () => {
  const [time, setTime] = useState<string>("")
  const [seconds, setSeconds] = useState<string>("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",

          hour12: true,
        }),
      )
      setSeconds(now.getSeconds().toString().padStart(2, "0"))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="nav-item absolute left-1/2 -translate-x-1/2 flex items-baseline gap-1">
      <span className="text-2xl font-medium tabular-nums tracking-tight">{time}</span>
      <span className="text-xs text-muted-foreground/50 tabular-nums">{seconds}</span>
    </div>
  )
}

export default DashboardClock
