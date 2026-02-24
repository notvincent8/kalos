import Link from "next/link"
import HeaderAuth from "@/app/components/HeaderAuth"

const Header = () => {
  return (
    <header className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex items-center justify-between px-4 py-2">
      <Link href="/">
        <span className="text-2xl uppercase font-bold">Kalos</span>
      </Link>
      <HeaderAuth />
    </header>
  )
}

export default Header
