import type { Metadata } from "next"
import { Cormorant_Garamond, DM_Sans } from "next/font/google"
import "./globals.css"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ThemeProvider } from "@/app/components/ThemeProvider"

gsap.registerPlugin(useGSAP)

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
})

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: intentional FOUC prevention
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('kalos-theme');var d=t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})()`,
          }}
        />
        <title></title>
      </head>
      <body className={`${cormorant.variable} ${dmSans.variable} antialiased h-dvh w-dvw overflow-hidden`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
