import type React from "react"
import type { Metadata } from "next"
import { Be_Vietnam_Pro } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

export const metadata: Metadata = {
  title: "Tạo Video Mạng Xã Hội",
  description: "Ứng dụng tạo video mạng xã hội tự động với trải nghiệm hiện đại",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${beVietnamPro.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}