import LoginForm from "@/app/(auth)/login/LoginForm"

const Page = () => {
  return (
    <div className="flex gap-8 flex-col w-fit rounded-lg border bg-card p-16 shadow-sm">
      <h1 className="scroll-m-20 text-left text-4xl font-bold tracking-tight text-balance">Welcome back</h1>
      <LoginForm />
    </div>
  )
}

export default Page
