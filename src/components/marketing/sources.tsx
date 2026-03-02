const sourceGroups = [
  {
    label: 'Major Labs',
    sources: ['OpenAI', 'Anthropic', 'Google DeepMind', 'Meta AI', 'Mistral', 'xAI', 'Cohere'],
  },
  {
    label: 'Research',
    sources: ['arXiv', 'Hugging Face', 'Papers With Code', 'NeurIPS', 'ICML'],
  },
  {
    label: 'Industry',
    sources: ['NVIDIA', 'Microsoft Research', 'Apple ML', 'AWS AI', 'Tesla AI'],
  },
  {
    label: 'Press',
    sources: ['MIT Technology Review', 'TechCrunch', 'The Verge', 'Ars Technica'],
  },
]

export function Sources() {
  return (
    <section className="py-20 bg-paper-light">
      <div className="ft-container">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
            Our Sources
          </p>
          <h2 className="font-serif text-3xl font-bold text-ink">
            20+ Authoritative Sources, One Briefing
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sourceGroups.map(group => (
            <div key={group.label}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4 pb-2 border-b border-divider">
                {group.label}
              </h4>
              <ul className="space-y-2">
                {group.sources.map(source => (
                  <li key={source} className="text-sm text-ink">
                    {source}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

