"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Spinner } from "@/app/components/ui/spinner"

gsap.registerPlugin(useGSAP)

export type Status = "idle" | "pending" | "success"

type SubmitButtonProps = {
  isPending: boolean
  isSuccess: boolean
  labels: { [K in Status]: string }
  onSuccessComplete?: () => void
  successDuration?: number
}

const SubmitButton = ({
  isPending,
  isSuccess,
  labels,
  onSuccessComplete,
  successDuration = 1000,
}: SubmitButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null!)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (!isSuccess) return
    setShowSuccess(true)

    const timeout = setTimeout(() => {
      onSuccessComplete?.()
    }, successDuration)

    return () => clearTimeout(timeout)
  }, [isSuccess, successDuration, onSuccessComplete])

  const status: Status = showSuccess ? "success" : isPending ? "pending" : "idle"

  useGSAP(
    () => {
      if (showSuccess && buttonRef.current) {
        gsap.fromTo(buttonRef.current, { scale: 1 }, { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1 })
      }
    },
    { scope: buttonRef, dependencies: [showSuccess] },
  )

  return (
    <Button
      ref={buttonRef}
      className="data-[status=success]:bg-olive data-[status=success]:text-white data-[status=success]:opacity-100  "
      disabled={isPending || showSuccess}
      type="submit"
      data-status={status}
    >
      {status === "pending" && (
        <>
          {labels.pending}
          <Spinner data-icon="inline-start" />
        </>
      )}
      {status === "success" && labels.success}
      {status === "idle" && labels.idle}
    </Button>
  )
}

export default SubmitButton
