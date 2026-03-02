import Link from 'next/link'
import { Check } from 'lucide-react'
import styles from './pricing.module.styl'

const benefits = [
  'Weekly AI intelligence briefing',
  'Coverage of 20+ sources and labs',
  'Research paper summaries',
  'Full newsletter archive access',
  'Links to all original sources',
  'Cancel anytime',
]

export function Pricing() {
  return (
    <section className="py-20">
      <div className="ft-container">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
            Subscription
          </p>
          <h2 className="font-serif text-3xl font-bold text-ink">
            Premium Intelligence
          </h2>
        </div>

        <div className="max-w-md mx-auto">
          <div className={styles.pricingCard}>
            <div className={styles.pricingHeader}>
              <p className={styles.pricingLabel}>Monthly Subscription</p>
              <div className={styles.priceRow}>
                <span className={styles.currency}>&pound;</span>
                <span className={styles.amount}>9.99</span>
                <span className={styles.period}>/month</span>
              </div>
            </div>

            <hr className="ft-divider my-6" />

            <ul className={styles.benefitsList}>
              {benefits.map(benefit => (
                <li key={benefit} className={styles.benefitItem}>
                  <Check size={16} className="text-accent flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <Link href="/sign-up" className={styles.subscribeButton}>
              Subscribe Now
            </Link>

            <p className={styles.guarantee}>
              7-day money-back guarantee. No questions asked.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

