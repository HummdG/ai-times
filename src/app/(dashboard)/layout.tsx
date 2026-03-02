import { SessionProvider } from '@/components/providers/session-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <Header />
      <main className="min-h-screen page-enter">{children}</main>
      <Footer />
    </SessionProvider>
  )
}

