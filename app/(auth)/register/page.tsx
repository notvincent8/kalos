import RegisterForm from "@/app/(auth)/register/RegisterForm"

const Page = async () => {
  return (
    <div className="flex gap-8 flex-col w-fit rounded-lg border bg-card p-16 shadow-sm">
      <h1 className="scroll-m-20 text-left text-4xl font-bold tracking-tight text-balance">Get started</h1>
      <RegisterForm />
    </div>
  )
}

export default Page
