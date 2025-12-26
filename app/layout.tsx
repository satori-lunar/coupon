import type { Metadata } from 'next'
import { Dancing_Script } from 'next/font/google'
import './globals.css'

// Only load handwritten font for gifts/letters content
const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-handwritten',
  display: 'swap',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'Together - Relationship Growth App',
  description: 'A thoughtful relationship app for couples to grow together',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#FF6B9D',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Together',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="min-h-full">
      <body className={`${dancingScript.variable} min-h-full antialiased`}>
        {children}
      </body>
    </html>
  )
}

