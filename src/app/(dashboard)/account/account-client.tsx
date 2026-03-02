'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { UserData } from '@/types'

interface AccountClientProps {
  user: UserData
}

export function AccountClient({ user }: AccountClientProps) {
  const router = useRouter()
  const [isLoadingPortal, setIsLoadingPortal] = useState(false)
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false)

  const isActive = user.subscription?.status === 'active'

  const formattedRenewal = user.subscription?.currentPeriodEnd
    ? new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(user.subscription.currentPeriodEnd))
    : null

  async function handleManageSubscription() {
    setIsLoadingPortal(true)
    try {
      const response = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Failed to open portal:', error)
    } finally {
      setIsLoadingPortal(false)
    }
  }

  async function handleSubscribe() {
    setIsLoadingCheckout(true)
    try {
      const response = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Failed to create checkout:', error)
    } finally {
      setIsLoadingCheckout(false)
    }
  }

  return (
    <div className="ft-container py-12 max-w-2xl">
      {/* Page Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Account
        </p>
        <h1 className="font-serif text-4xl font-bold text-ink">
          My Account
        </h1>
      </div>

      {/* Profile Section */}
      <section className="mb-10">
        <h3 className="ft-section-label">Profile</h3>
        <div className="bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-ink-muted mb-1">
                Name
              </p>
              <p className="text-ink">{user.name ?? 'Not set'}</p>
            </div>
            <Separator className="bg-divider" />
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-ink-muted mb-1">
                Email
              </p>
              <p className="text-ink">{user.email}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="mb-10">
        <h3 className="ft-section-label">Subscription</h3>
        <div className="bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-ink-muted mb-1">
                  Status
                </p>
                <div className="flex items-center gap-2">
                  {isActive ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 rounded-none text-xs font-semibold uppercase tracking-wider">
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-ink-muted hover:bg-gray-100 rounded-none text-xs font-semibold uppercase tracking-wider">
                      {user.subscription?.status ?? 'No Subscription'}
                    </Badge>
                  )}
                  {user.subscription?.cancelAtPeriodEnd && (
                    <span className="text-xs text-red-600">Cancels at period end</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider font-semibold text-ink-muted mb-1">
                  Plan
                </p>
                <p className="text-ink font-medium">
                  {isActive ? '£9.99/month' : '—'}
                </p>
              </div>
            </div>

            {formattedRenewal && (
              <>
                <Separator className="bg-divider" />
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-ink-muted mb-1">
                    {user.subscription?.cancelAtPeriodEnd ? 'Access Until' : 'Next Renewal'}
                  </p>
                  <p className="text-ink">{formattedRenewal}</p>
                </div>
              </>
            )}

            <Separator className="bg-divider" />

            {isActive ? (
              <button
                onClick={handleManageSubscription}
                disabled={isLoadingPortal}
                className="ft-button-outline w-full text-sm disabled:opacity-50"
              >
                {isLoadingPortal ? 'Loading...' : 'Manage Subscription'}
              </button>
            ) : (
              <button
                onClick={handleSubscribe}
                disabled={isLoadingCheckout}
                className="ft-button w-full disabled:opacity-50"
              >
                {isLoadingCheckout ? 'Loading...' : 'Subscribe — £9.99/month'}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

