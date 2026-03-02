import { Hero } from '@/components/marketing/hero'
import { Features } from '@/components/marketing/features'
import { Sources } from '@/components/marketing/sources'
import { Pricing } from '@/components/marketing/pricing'

export default function HomePage() {
  return (
    <div className="page-enter">
      <Hero />
      <hr className="ft-divider" />
      <Features />
      <hr className="ft-divider" />
      <Sources />
      <hr className="ft-divider" />
      <Pricing />
    </div>
  )
}

