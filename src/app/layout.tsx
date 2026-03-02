import type { Metadata } from 'next'
import { Inter, Playfair_Display, Libre_Baskerville, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

const baskerville = Libre_Baskerville({
  variable: '--font-baskerville',
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AI Times — The Definitive Weekly Briefing on Artificial Intelligence',
  description: 'A sophisticated weekly newsletter covering the latest developments in AI from major labs, research institutions, and industry leaders. Subscribe for curated intelligence.',
  keywords: ['AI', 'artificial intelligence', 'newsletter', 'machine learning', 'deep learning', 'OpenAI', 'Anthropic', 'Google DeepMind'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${baskerville.variable} ${jetbrains.variable}`}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#FFF7F0',
              border: '1px solid #E8D6C4',
              color: '#1A1A2E',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
            },
          }}
        />
      </body>
    </html>
  )
}
