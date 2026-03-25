"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ChevronDown, ChevronLeft, ChevronRight, Pencil, Plus, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type Goal = {
  name: string
  current: number
  target: number
  unit: string
  threshold: number
  level: number
  levelName: string
  nextLevel?: number
  nextLevelName?: string
}

type InspirationItem =
  | { type: "quote"; text: string; author: string }
  | { type: "resource"; text: string; subtitle: string; tag: string }

const MOCK_CURRENT_PROGRAM: { id: string; name: string; goals: Goal[] } = {
  id: "1",
  name: "Upper Body A",
  goals: [
    {
      name: "Pull-ups",
      current: 10,
      target: 10,
      unit: "reps",
      threshold: 8,
      level: 3,
      levelName: "Intermediate",
      nextLevel: 4,
      nextLevelName: "Advanced",
    },
    {
      name: "Muscle-up",
      current: 3,
      target: 5,
      unit: "reps",
      threshold: 3,
      level: 2,
      levelName: "Beginner",
      nextLevel: 3,
      nextLevelName: "Intermediate",
    },
    {
      name: "L-sit hold",
      current: 20,
      target: 30,
      unit: "sec",
      threshold: 25,
      level: 1,
      levelName: "Novice",
    },
  ],
}

const MOCK_OTHER_PROGRAMS = [
  { id: "2", name: "Push / Pull" },
  { id: "3", name: "Full Body" },
]

const INSPIRATION: InspirationItem[] = [
  {
    type: "quote",
    text: "The body achieves what the mind believes.",
    author: "Napoleon Hill",
  },
  {
    type: "quote",
    text: "Every rep is a vote for the person you want to become.",
    author: "James Clear",
  },
  {
    type: "resource",
    text: "Overcoming Gravity",
    subtitle: "Steven Low — The calisthenics bible.",
    tag: "Book",
  },
  {
    type: "quote",
    text: "Strength does not come from physical capacity. It comes from an indomitable will.",
    author: "Mahatma Gandhi",
  },
  {
    type: "resource",
    text: "r/bodyweightfitness",
    subtitle: "Recommended Routine & progressions.",
    tag: "Community",
  },
]

const SEGMENTS = 8

const GoalBar = ({ current, target }: { current: number; target: number }) => {
  const completed = current >= target
  const filled = Math.round((Math.min(current, target) / target) * SEGMENTS)
  return (
    <div className="flex gap-0.5 mt-2">
      {Array.from({ length: SEGMENTS }, (_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length visual segments
          key={i}
          className={cn(
            "flex-1 h-1 transition-colors",
            i < filled ? (completed ? "bg-olive" : "bg-primary") : "bg-border/50",
          )}
        />
      ))}
    </div>
  )
}

const getGreeting = (): string => {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 18) return "Good afternoon"
  return "Good evening"
}

const getFormattedDate = (): string =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

type Props = { userName?: string | null }

const DashboardSidebar = ({ userName }: Props) => {
  const [showSwitcher, setShowSwitcher] = useState(false)
  const [dismissedGoals, setDismissedGoals] = useState<Set<string>>(new Set())
  const [minimizedGoals, setMinimizedGoals] = useState<Set<string>>(new Set())
  const [inspoIndex, setInspoIndex] = useState(0)
  const [greeting, setGreeting] = useState("")
  const [dateStr, setDateStr] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setGreeting(getGreeting())
    setDateStr(getFormattedDate())
  }, [])

  useGSAP(
    () => {
      const q = gsap.utils.selector(containerRef)
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      tl.from(q(".sidebar-section"), { x: -16, opacity: 0, duration: 0.5, stagger: 0.1 })
      tl.from(q(".geo-marker"), { scale: 0, duration: 0.3, ease: "back.out(2)", stagger: 0.06 }, "-=0.2")
    },
    { scope: containerRef },
  )

  const firstName = userName?.split(" ")[0] ?? "Athlete"
  const inspo = INSPIRATION[inspoIndex]
  const prevInspo = () => setInspoIndex((i) => (i === 0 ? INSPIRATION.length - 1 : i - 1))
  const nextInspo = () => setInspoIndex((i) => (i + 1) % INSPIRATION.length)

  const dismiss = (name: string) => setDismissedGoals((prev) => new Set([...prev, name]))
  const minimize = (name: string) => setMinimizedGoals((prev) => new Set([...prev, name]))
  const restore = (name: string) =>
    setMinimizedGoals((prev) => {
      const s = new Set(prev)
      s.delete(name)
      return s
    })

  return (
    <div ref={containerRef} className="flex flex-col h-full overflow-hidden">
      <div className="sidebar-section relative px-6 pt-6 pb-5 shrink-0 border-b border-border/40">
        <div className="geo-marker absolute top-6 right-6 size-1.5 bg-primary rotate-45" />
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">{greeting}</p>
        <h2 className="font-serif text-3xl font-light leading-none mb-2">{firstName}</h2>
        <p className="text-xs text-muted-foreground/60">{dateStr}</p>
      </div>

      <div className="sidebar-section flex-1 flex flex-col min-h-0 overflow-y-auto px-6 py-5">
        <div className="flex items-start justify-between mb-5 shrink-0">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-1.5">Current program</p>
            <h3 className="font-serif text-xl font-light leading-tight">{MOCK_CURRENT_PROGRAM.name}</h3>
          </div>
          <button
            type="button"
            aria-label="Edit program"
            className="mt-0.5 p-1.5 text-muted-foreground/40 hover:text-foreground transition-colors"
          >
            <Pencil className="size-3.5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="space-y-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground/60">Goals &amp; thresholds</p>

          {MOCK_CURRENT_PROGRAM.goals.map((goal) => {
            const pct = Math.round((goal.current / goal.target) * 100)
            const completed = goal.current >= goal.target
            const aboveThreshold = goal.current >= goal.threshold
            const isDismissed = dismissedGoals.has(goal.name)
            const isMinimized = minimizedGoals.has(goal.name)

            return (
              <div key={goal.name}>
                <div className="flex items-baseline justify-between mb-0.5">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="text-sm text-foreground truncate">{goal.name}</span>
                    <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wide shrink-0">
                      Lv.{goal.level}
                    </span>
                  </div>
                  <span className="text-xs font-mono shrink-0 ml-2">
                    <span
                      className={cn(
                        completed ? "text-olive" : aboveThreshold ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {goal.current}
                    </span>
                    <span className="text-muted-foreground/40">
                      /{goal.target} {goal.unit}
                    </span>
                  </span>
                </div>

                <GoalBar current={goal.current} target={goal.target} />

                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">{pct}%</span>
                  <span className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">
                    min {goal.threshold}
                  </span>
                </div>

                {completed && !isDismissed && (
                  <div className="mt-3">
                    {isMinimized ? (
                      <button
                        type="button"
                        onClick={() => restore(goal.name)}
                        className="w-full flex items-center gap-2 px-3 py-2 border border-olive/30 bg-olive/5 text-olive hover:bg-olive/10 transition-colors"
                      >
                        <div className="size-1.5 bg-olive rounded-full shrink-0" />
                        <span className="text-[11px] uppercase tracking-wider flex-1 text-left">
                          Goal reached — upgrade available
                        </span>
                        <ChevronDown className="size-3 shrink-0" strokeWidth={1.5} />
                      </button>
                    ) : (
                      <div className="border border-olive/30 bg-olive/5 p-3.5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="size-1.5 bg-olive shrink-0" />
                            <span className="text-xs font-medium text-olive uppercase tracking-wider">
                              Goal reached!
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => minimize(goal.name)}
                            aria-label="Minimize"
                            className="p-0.5 text-muted-foreground/40 hover:text-foreground transition-colors"
                          >
                            <X className="size-3" strokeWidth={1.5} />
                          </button>
                        </div>

                        {goal.nextLevelName ? (
                          <>
                            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                              Ready for{" "}
                              <span className="text-foreground font-medium">
                                Level {goal.nextLevel} — {goal.nextLevelName}
                              </span>
                              ? Or take your time and stay here.
                            </p>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                className="flex-1 py-1.5 text-[11px] uppercase tracking-wider bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors"
                              >
                                Upgrade
                              </button>
                              <button
                                type="button"
                                onClick={() => dismiss(goal.name)}
                                className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground border border-border/50 hover:border-border transition-colors"
                              >
                                Stay
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">Maximum level. Master it.</p>
                            <button
                              type="button"
                              onClick={() => dismiss(goal.name)}
                              className="text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                            >
                              Dismiss
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-border/30 shrink-0">
          <button
            type="button"
            onClick={() => setShowSwitcher((v) => !v)}
            className="flex items-center justify-between w-full text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="text-xs uppercase tracking-[0.2em]">Switch program</span>
            <ChevronDown
              className={cn("size-3.5 transition-transform duration-200", showSwitcher && "rotate-180")}
              strokeWidth={1.5}
            />
          </button>

          {showSwitcher && (
            <div className="mt-2 space-y-px">
              {MOCK_OTHER_PROGRAMS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="w-full flex items-center gap-2 px-2 py-2 text-left text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <div className="size-1 bg-border/60 rotate-45 shrink-0" />
                  {p.name}
                </button>
              ))}
              <button
                type="button"
                className="w-full flex items-center gap-2 px-2 py-2 text-left text-xs uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-foreground transition-colors"
              >
                <Plus className="size-3" />
                New program
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="sidebar-section shrink-0 border-t border-border/40 px-6 py-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground/60">
            {inspo.type === "quote" ? "Inspiration" : "Resource"}
          </p>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={prevInspo}
              aria-label="Previous"
              className="p-1 text-muted-foreground/40 hover:text-foreground transition-colors"
            >
              <ChevronLeft className="size-3" strokeWidth={1.5} />
            </button>
            <span className="text-[10px] text-muted-foreground/30 tabular-nums w-7 text-center">
              {inspoIndex + 1}/{INSPIRATION.length}
            </span>
            <button
              type="button"
              onClick={nextInspo}
              aria-label="Next"
              className="p-1 text-muted-foreground/40 hover:text-foreground transition-colors"
            >
              <ChevronRight className="size-3" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {inspo.type === "quote" ? (
          <blockquote className="border-l-2 border-primary/40 pl-3">
            <p className="text-sm text-foreground leading-relaxed italic font-serif">&ldquo;{inspo.text}&rdquo;</p>
            <footer className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider">
              — {inspo.author}
            </footer>
          </blockquote>
        ) : (
          <div className="flex items-start gap-3">
            <span className="shrink-0 text-[9px] uppercase tracking-wider text-primary border border-primary/30 px-1.5 py-0.5 mt-0.5">
              {inspo.tag}
            </span>
            <div>
              <p className="text-sm text-foreground font-medium">{inspo.text}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{inspo.subtitle}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardSidebar
