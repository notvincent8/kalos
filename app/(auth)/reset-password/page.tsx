import Link from "next/link"
import { redirect } from "next/navigation"
import ResetPasswordForm from "@/app/(auth)/reset-password/ResetPasswordForm"

type PageProps = {
  searchParams: Promise<{ token?: string; error?: string }>
}

const Page = async ({ searchParams }: PageProps) => {
  const { token, error } = await searchParams

  // No token provided - redirect to request reset page
  if (!token && !error) {
    redirect("/request-reset-password")
  }

  // Invalid or expired token
  if (error === "INVALID_TOKEN") {
    return (
      <div className="flex gap-8 flex-col w-fit rounded-lg border bg-card p-16 shadow-sm">
        <div className="flex flex-col gap-2">
          <h1 className="scroll-m-20 text-left text-4xl font-bold tracking-tight text-balance">Link expired</h1>
          <p className="text-muted-foreground">
            This password reset link is no longer valid. It may have expired or already been used.
          </p>
        </div>
        <div className="flex flex-col gap-4 ">
          <p className="text-muted-foreground">Need a new link? No problem.</p>
          <Link
            href="/request-reset-password"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Request new reset link
          </Link>
        </div>
        <span>
          Remember your password?
          <Link href="/login" className="ml-1 text-sm text-primary hover:underline">
            Log in
          </Link>
        </span>
      </div>
    )
  }

  // Valid token - show reset form
  return (
    <div className="flex gap-8 flex-col w-fit rounded-lg border bg-card p-16 shadow-sm">
      <div className="flex flex-col gap-2">
        <h1 className="scroll-m-20 text-left text-4xl font-bold tracking-tight text-balance">Set a new password</h1>
        <p className="text-muted-foreground">Choose a strong password you haven't used before.</p>
      </div>
      <ResetPasswordForm token={token!} />
      <span>
        Remember your password?
        <Link href="/login" className="ml-1 text-sm text-primary hover:underline">
          Log in
        </Link>
      </span>
    </div>
  )
}

export default Page
