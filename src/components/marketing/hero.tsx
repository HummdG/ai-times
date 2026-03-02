import Link from 'next/link'
import styles from './hero.module.styl'

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className="ft-container">
        <div className={styles.heroContent}>
          <p className={styles.edition}>Weekly Intelligence Briefing</p>
          <h1 className={styles.headline}>
            The Definitive Weekly Briefing on Artificial Intelligence
          </h1>
          <hr className="ft-divider my-8 max-w-24 mx-auto" />
          <p className={styles.subheadline}>
            Every week, we distil the most significant developments from leading AI
            laboratories, groundbreaking research papers, and industry moves into one
            authoritative briefing. Curated by experts, delivered to your inbox.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/sign-up" className="ft-button text-base py-4 px-10">
              Subscribe Now — &pound;9.99/month
            </Link>
            <Link href="/sign-in" className="ft-button-outline text-base py-4 px-10">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

