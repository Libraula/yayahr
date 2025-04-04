import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "YAYA HR | Human Resource Management System",
  description: "Comprehensive HR Management System by YAYA",
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.dev',
    // Add Open Graph metadata
    openGraph: {
      title: "YAYA HR | Human Resource Management System",
      description: "Comprehensive HR Management System by YAYA",
      images: [
        {
          url: "https://www.yayainnovations.com/static/img/logo/yaya-logo-1.png", // Your logo URL
          width: 800, // Optional: Specify width
          height: 600, // Optional: Specify height
          alt: 'YAYA Innovations Logo', // Optional: Alt text
        },
      ],
      type: 'website', // Optional: Specify content type
    },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto bg-muted/20 p-4">{children}</main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}