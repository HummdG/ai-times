import { SessionProvider } from '@/components/providers/session-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <Header />
      <main>{children}</main>
      <Footer />
    </SessionProvider>
  )
}

