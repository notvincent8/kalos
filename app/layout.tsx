import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { headers } from "next/headers"
import Footer from "@/app/components/Footer"
import Header from "@/app/components/Header"
import { auth } from "@/server/auth"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Kalos - Calisthenics Workout Tracker",
  description:
    "Track your calisthenics progress with beautiful simplicity. Log exercises, sets, and reps. Build strength through consistency.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header isAuthenticated={!!session} />
        {children}
        <Footer />
      </body>
    </html>
  )
}
