"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ArrowRight, Clock, Pencil, Plus, Repeat2, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type NextSession = {
  programName: string
  rounds: number
  restSeconds: number
}

type SessionData = {
  name: string
  duration: number
  rounds: number
  rpe: number | null
  rating: number | null
}

type DayData = {
  label: string
  date: string
  status: 0 | 1 | 2 | 3
  session: SessionData | null
}

const MOCK_WEEK: DayData[] = [
  {
    label: "M",
    date: "Mon 23 · Mar",
    status: 1,
    session: { name: "Push Day", duration: 48, rounds: 4, rpe: 7, rating: 4.2 },
  },
  {
    label: "T",
    date: "Tue 24 · Mar",
    status: 1,
    session: { name: "Pull Day", duration: 52, rounds: 4, rpe: null, rating: null },
  },
  { label: "W", date: "Wed 25 · Mar", status: 0, session: null },
  { label: "T", date: "Thu 26 · Mar", status: 3, session: null },
  { label: "F", date: "Fri 27 · Mar", status: 2, session: null },
  { label: "S", date: "Sat 28 · Mar", status: 0, session: null },
  { label: "S", date: "Sun 29 · Mar", status: 0, session: null },
]

const DEFAULT_DAY = 1

const DashboardMain = ({ nextSession }: { nextSession: NextSession }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const sessionRef = useRef<HTMLDivElement>(null)

  const [selectedDay, setSelectedDay] = useState(DEFAULT_DAY)
  const [editingRpe, setEditingRpe] = useState(false)
  const [editingRating, setEditingRating] = useState(false)
  const [localRpe, setLocalRpe] = useState<number | null>(MOCK_WEEK[DEFAULT_DAY].session?.rpe ?? null)
  const [localRating, setLocalRating] = useState<number | null>(MOCK_WEEK[DEFAULT_DAY].session?.rating ?? null)

  useEffect(() => {
    const s = MOCK_WEEK[selectedDay]?.session
    setLocalRpe(s?.rpe ?? null)
    setLocalRating(s?.rating ?? null)
    setEditingRpe(false)
    setEditingRating(false)
  }, [selectedDay])

  const day = MOCK_WEEK[selectedDay]

  useGSAP(
    () => {
      const q = gsap.utils.selector(containerRef)
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      tl.from(q(".arch-line"), { opacity: 0, duration: 0.8, stagger: 0.1 })
      tl.from(ctaRef.current, { scale: 0.97, opacity: 0, duration: 0.65 }, "-=0.5")
      tl.from(q(".cta-content"), { y: 18, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.35")
      tl.from(sessionRef.current, { y: 24, opacity: 0, duration: 0.5 }, "-=0.3")
      tl.from(q(".stat-item"), { y: 8, opacity: 0, duration: 0.3, stagger: 0.07 }, "-=0.2")
      tl.from(q(".geo-marker"), { scale: 0, duration: 0.25, ease: "back.out(2)", stagger: 0.05 }, "-=0.3")
    },
    { scope: containerRef },
  )

  return (
    <div ref={containerRef} className="relative flex h-full overflow-hidden">
      <div className="arch-line absolute top-0 bottom-0 left-[58%] w-px bg-border/25 pointer-events-none z-10" />

      <div
        ref={ctaRef}
        className="group/cta relative flex flex-col justify-between overflow-hidden bg-primary cursor-pointer"
        style={{ flex: "0 0 58%" }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.045] group-hover/cta:opacity-[0.09] transition-opacity duration-500 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, currentColor, currentColor 1px, transparent 1px, transparent 32px)",
          }}
        />

        <div aria-hidden className="geo-marker absolute top-5 right-5 pointer-events-none">
          <div className="absolute top-0 right-0 w-5 h-px bg-primary-foreground/25" />
          <div className="absolute top-0 right-0 w-px h-5 bg-primary-foreground/25" />
        </div>
        <div aria-hidden className="geo-marker absolute bottom-6 left-6 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-5 h-px bg-primary-foreground/25" />
          <div className="absolute bottom-0 left-0 w-px h-5 bg-primary-foreground/25" />
        </div>

        <div className="relative px-8 lg:px-10 pt-8 lg:pt-10">
          <div className="cta-content flex items-center gap-2">
            <div className="size-1.5 bg-primary-foreground/30 rotate-45 shrink-0" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary-foreground/50">Next session</p>
          </div>
        </div>

        <div className="relative px-8 lg:px-10 flex-1 flex flex-col justify-center">
          <h1
            className="cta-content font-serif italic font-light text-primary-foreground leading-[0.88] mb-4 transition-transform duration-500 group-hover/cta:translate-x-1.5"
            style={{ fontSize: "clamp(3rem, 6.5vw, 5.5rem)" }}
          >
            {nextSession.programName}
          </h1>
          <p className="cta-content text-[10px] uppercase tracking-[0.28em] text-primary-foreground/45 transition-transform duration-500 group-hover/cta:translate-x-1">
            {nextSession.rounds} rounds &middot; {nextSession.restSeconds}s rest
          </p>
        </div>

        <div className="relative px-8 lg:px-10 pb-8 lg:pb-10 flex items-center justify-between">
          <div className="cta-content flex items-center gap-2">
            <div className="size-1 bg-primary-foreground/30 rounded-full" />
            <span className="text-[9px] uppercase tracking-[0.28em] text-primary-foreground/35">Ready</span>
          </div>
          <button
            type="button"
            className="group/btn cta-content relative overflow-hidden flex items-center gap-3 bg-primary-foreground text-primary px-5 py-2.5"
          >
            <span
              aria-hidden
              className="absolute inset-0 bg-foreground origin-left scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 ease-in-out"
            />
            <span className="relative text-[11px] font-medium uppercase tracking-[0.2em] group-hover/btn:text-background transition-colors duration-150 delay-75">
              Start session
            </span>
            <ArrowRight
              className="relative size-3.5 shrink-0 group-hover/btn:text-background group-hover/btn:translate-x-1 transition-all duration-150 delay-75"
              strokeWidth={2.5}
            />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex-1 flex flex-col justify-start gap-4 pt-1 min-h-0">
          <div className="arch-line w-full h-px bg-border/30" />
          <div className="arch-line w-3/5 h-px bg-border/20" />
        </div>

        <div className="shrink-0 flex gap-0.5 mb-3">
          {MOCK_WEEK.map((d, i) => (
            <button
              key={`${d.label}-${d.date}`}
              type="button"
              onClick={() => setSelectedDay(i)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1.5 py-2 transition-colors",
                selectedDay === i ? "bg-foreground/5" : "hover:bg-muted/50",
              )}
            >
              <div
                className={cn(
                  "w-full h-1",
                  d.status === 1 && "bg-primary",
                  d.status === 2 && "bg-foreground/35",
                  d.status === 3 && (selectedDay === i ? "bg-primary" : "bg-primary/40"),
                  d.status === 0 && "bg-border/40",
                )}
              />
              <span
                className={cn(
                  "text-[9px] uppercase leading-none",
                  selectedDay === i && "text-foreground",
                  d.status === 3 && selectedDay !== i && "text-primary/70",
                  d.status !== 3 && selectedDay !== i && "text-muted-foreground/40",
                )}
              >
                {d.label}
              </span>
            </button>
          ))}
        </div>

        <div ref={sessionRef} className="relative bg-card border border-border/60 overflow-hidden shrink-0">
          <div className="absolute left-0 top-0 bottom-0 w-0.75 bg-primary/70" />

          <div aria-hidden className="geo-marker absolute top-4 right-4 pointer-events-none">
            <div className="absolute top-0 right-0 w-4 h-px bg-foreground/15" />
            <div className="absolute top-0 right-0 w-px h-4 bg-foreground/15" />
          </div>

          <div className="pl-6 pr-5 py-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{day.date}</p>
              <div className="flex items-center gap-0.5">
                {day.session ? (
                  <>
                    <button
                      type="button"
                      aria-label="Edit session"
                      className="p-1.5 text-muted-foreground/40 hover:text-foreground transition-colors"
                    >
                      <Pencil className="size-3.5" strokeWidth={1.5} />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete session"
                      className="p-1.5 text-muted-foreground/40 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="size-3.5" strokeWidth={1.5} />
                    </button>
                  </>
                ) : null}
              </div>
            </div>

            <div className="min-h-44 flex flex-col justify-between">
              {day.session ? (
                <>
                  <h2
                    className="font-serif font-light text-foreground leading-none mb-5"
                    style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)" }}
                  >
                    {day.session.name}
                  </h2>

                  <div className="grid grid-cols-4 border-t border-border/40 pt-4">
                    <div className="stat-item flex flex-col items-start pr-3 border-r border-border/30">
                      <div className="flex items-baseline gap-1">
                        <span className="font-mono text-2xl lg:text-3xl text-foreground">{day.session.duration}</span>
                        <span className="text-xs text-muted-foreground">min</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="size-2.5 text-muted-foreground/40" strokeWidth={1.5} />
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Duration</p>
                      </div>
                    </div>

                    <div className="stat-item flex flex-col items-center px-3 border-r border-border/30">
                      <div className="flex items-baseline gap-1">
                        <span className="font-mono text-2xl lg:text-3xl text-foreground">{day.session.rounds}</span>
                        <span className="text-xs text-muted-foreground">×</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Repeat2 className="size-2.5 text-muted-foreground/40" strokeWidth={1.5} />
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Rounds</p>
                      </div>
                    </div>

                    <div className="stat-item flex flex-col items-center px-3 border-r border-border/30">
                      <div className="flex items-baseline gap-1 min-h-9 lg:min-h-11">
                        {editingRpe ? (
                          <input
                            type="number"
                            min={1}
                            max={10}
                            // biome-ignore lint/a11y/noAutofocus: intentional inline edit UX
                            autoFocus
                            value={localRpe ?? ""}
                            onChange={(e) =>
                              setLocalRpe(e.target.value ? Math.min(10, Math.max(1, Number(e.target.value))) : null)
                            }
                            onBlur={() => setEditingRpe(false)}
                            onKeyDown={(e) => e.key === "Enter" && setEditingRpe(false)}
                            className="w-10 font-mono text-2xl lg:text-3xl bg-transparent border-b border-primary outline-none text-foreground"
                          />
                        ) : localRpe === null ? (
                          <button
                            type="button"
                            onClick={() => setEditingRpe(true)}
                            className="text-[10px] uppercase tracking-wider text-primary border border-dashed border-primary/40 px-2 py-1 hover:bg-primary/5 transition-colors"
                          >
                            Set
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEditingRpe(true)}
                            className="flex items-baseline gap-1 hover:opacity-70 transition-opacity"
                          >
                            <span className="font-mono text-2xl lg:text-3xl text-foreground">{localRpe}</span>
                            <span className="text-xs text-muted-foreground">/10</span>
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">RPE</p>
                    </div>

                    <div className="stat-item flex flex-col items-end pl-3">
                      <div className="flex items-baseline gap-1 min-h-9 lg:min-h-11">
                        {editingRating ? (
                          <input
                            type="number"
                            min={1}
                            max={5}
                            step={0.1}
                            // biome-ignore lint/a11y/noAutofocus: intentional inline edit UX
                            autoFocus
                            value={localRating ?? ""}
                            onChange={(e) =>
                              setLocalRating(e.target.value ? Math.min(5, Math.max(1, Number(e.target.value))) : null)
                            }
                            onBlur={() => setEditingRating(false)}
                            onKeyDown={(e) => e.key === "Enter" && setEditingRating(false)}
                            className="w-12 font-mono text-2xl lg:text-3xl bg-transparent border-b border-primary outline-none text-primary text-right"
                          />
                        ) : localRating === null ? (
                          <button
                            type="button"
                            onClick={() => setEditingRating(true)}
                            className="text-[10px] uppercase tracking-wider text-primary border border-dashed border-primary/40 px-2 py-1 hover:bg-primary/5 transition-colors"
                          >
                            Set
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEditingRating(true)}
                            className="flex items-baseline gap-1 hover:opacity-70 transition-opacity"
                          >
                            <span className="font-mono text-2xl lg:text-3xl text-primary">{localRating}</span>
                            <span className="text-xs text-muted-foreground">★</span>
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Rating</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-start py-3">
                  <p className="font-serif text-xl font-light text-muted-foreground italic mb-1.5">No session logged</p>
                  <p className="text-xs text-muted-foreground/60 mb-4">
                    {day.status === 3 ? "Today" : "This day"} — log a session retroactively
                  </p>
                  <button
                    type="button"
                    className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary border border-primary/30 px-4 py-2 hover:bg-primary/5 transition-colors"
                  >
                    <Plus className="size-3.5" strokeWidth={2} />
                    Log session
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardMain
