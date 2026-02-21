import Link from "next/link"
import LoginForm from "@/app/(auth)/login/LoginForm"

const Page = () => {
  return (
    <div className="flex gap-8 flex-col w-fit rounded-lg border bg-card p-16 shadow-sm">
      <h1 className="scroll-m-20 text-left text-4xl font-bold tracking-tight text-balance">Welcome back</h1>
      <LoginForm />
      <span>
        You don't have an account?
        <Link href="/register" className="ml-1 text-sm text-primary hover:underline">
          Register
        </Link>
      </span>
    </div>
  )
}

export default Page
