import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AccountClient } from './account-client'

export const metadata = {
  title: 'My Account — AI Times',
  description: 'Manage your AI Times subscription and account settings.',
}

export default async function AccountPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/sign-in')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  })

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <AccountClient
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        subscription: user.subscription ? {
          id: user.subscription.id,
          status: user.subscription.status,
          currentPeriodEnd: user.subscription.currentPeriodEnd,
          cancelAtPeriodEnd: user.subscription.cancelAtPeriodEnd,
        } : null,
      }}
    />
  )
}

