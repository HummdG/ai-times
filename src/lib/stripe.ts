import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-02-25.clover',
      typescript: true,
    })
  }
  return _stripe
}

export async function createCheckoutSession(
  userId: string,
  email: string,
  customerId?: string | null
): Promise<string> {
  const session = await getStripe().checkout.sessions.create({
    customer: customerId ?? undefined,
    customer_email: customerId ? undefined : email,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/newsletters?subscribed=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/sign-up?cancelled=true`,
    metadata: {
      userId,
    },
    subscription_data: {
      metadata: {
        userId,
      },
    },
  })

  return session.url!
}

export async function createCustomerPortalSession(
  customerId: string
): Promise<string> {
  const session = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXTAUTH_URL}/account`,
  })

  return session.url
}

