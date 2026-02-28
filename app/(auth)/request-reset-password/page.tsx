import Link from "next/link"
import RequestResetPasswordForm from "@/app/(auth)/request-reset-password/RequestResetPasswordForm"

const Page = () => {
  return (
    <div className="flex gap-8 flex-col w-fit rounded-lg border bg-card p-16 shadow-sm">
      <div className="flex flex-col gap-2">
        <h1 className="scroll-m-20 text-left text-4xl font-bold tracking-tight text-balance">Forgot your password?</h1>
        <p className="text-muted-foreground">No worries, enter your email and we'll send you a reset link.</p>
      </div>
      <RequestResetPasswordForm />
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
