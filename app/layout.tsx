import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ToastProvider } from "@/components/ui/toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Yaya Innovations HR System",
  description: "Comprehensive HR Management System for Yaya Innovations",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "192x192",
      },
    ],
    apple: {
      url: "/apple-icon.png",
      sizes: "180x180",
    },
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ToastProvider>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto bg-muted/20 p-4">{children}</main>
              </div>
            </div>
            <Toaster />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'