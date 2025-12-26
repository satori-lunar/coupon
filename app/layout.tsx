import type { Metadata } from 'next'
import { Dancing_Script, Playfair_Display, Crimson_Text } from 'next/font/google'
import './globals.css'

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-handwritten',
  display: 'swap',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const crimsonText = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Couples App - A Book of Moments',
  description: 'A romantic, playful couples relationship app with date nights, virtual gifts, and shared memories',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="min-h-full">
      <body className={`${dancingScript.variable} ${playfairDisplay.variable} ${crimsonText.variable} min-h-full antialiased`}>
        {children}
      </body>
    </html>
  )
}

