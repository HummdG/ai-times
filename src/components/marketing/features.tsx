import { Brain, FileText, Globe, Microscope, TrendingUp, Zap } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'From the Labs',
    description: 'Direct coverage of breakthroughs from OpenAI, Anthropic, Google DeepMind, Meta AI, and every major research laboratory.',
  },
  {
    icon: Microscope,
    title: 'Research Frontiers',
    description: 'The most important papers from arXiv, NeurIPS, ICML, and leading journals — distilled into actionable summaries.',
  },
  {
    icon: TrendingUp,
    title: 'Industry Moves',
    description: 'Funding rounds, product launches, partnerships, and strategic shifts from companies reshaping the AI landscape.',
  },
  {
    icon: FileText,
    title: 'Expert Curation',
    description: 'Every issue is editorially curated to separate signal from noise. No clickbait, no hype — just substantive analysis.',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'From Silicon Valley to Beijing, London to Tel Aviv — comprehensive coverage of AI developments worldwide.',
  },
  {
    icon: Zap,
    title: 'Weekly Delivery',
    description: 'A single, comprehensive briefing each week. Thoroughly researched, elegantly presented, and delivered to your inbox.',
  },
]

export function Features() {
  return (
    <section className="py-20 bg-wheat">
      <div className="ft-container">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
            What You Receive
          </p>
          <h2 className="font-serif text-3xl font-bold text-ink">
            Intelligence, Curated
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(feature => (
            <div key={feature.title} className="space-y-4">
              <div className="border-t border-divider pt-6">
                <feature.icon size={24} className="text-accent mb-3" strokeWidth={1.5} />
                <h3 className="font-serif text-xl font-bold text-ink mb-2">
                  {feature.title}
                </h3>
                <p className="text-ink-muted text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

