import Link from "next/link"
import { Button } from "@/app/components/ui/button"

type HeaderProps = {
  isAuthenticated?: boolean
}
const Header = ({ isAuthenticated = false }: HeaderProps) => {
  return (
    <header className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex items-center justify-between px-4 py-2">
      <h1 className="text-2xl uppercase font-bold">Kalos</h1>
      {!isAuthenticated ? (
        <Button asChild>
          <Link href="/register">Register</Link>
        </Button>
      ) : null}
    </header>
  )
}

export default Header
