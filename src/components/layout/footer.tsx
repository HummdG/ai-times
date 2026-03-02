import Link from 'next/link'

const footerColumns = [
  {
    title: 'AI Times',
    links: [
      { href: '/', label: 'Home' },
      { href: '/newsletters', label: 'Newsletters' },
      { href: '/sign-up', label: 'Subscribe' },
    ],
  },
  {
    title: 'Account',
    links: [
      { href: '/sign-in', label: 'Sign In' },
      { href: '/account', label: 'My Account' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '#', label: 'Privacy Policy' },
      { href: '#', label: 'Terms of Service' },
    ],
  },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-ink text-white">
      <div className="ft-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="md:col-span-1">
            <h3 className="font-serif text-2xl font-bold text-white tracking-wider uppercase mb-4">
              AI Times
            </h3>
            <p className="text-ink-light text-sm leading-relaxed">
              The definitive weekly briefing on artificial intelligence. Curated intelligence for the informed reader.
            </p>
          </div>

          {/* Link columns */}
          {footerColumns.map(column => (
            <div key={column.title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-ink-light mb-4">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#9DA3AE] hover:text-white transition-colors no-underline hover:no-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[#333347] mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-ink-light">
              &copy; {currentYear} AI Times. All rights reserved.
            </p>
            <p className="text-xs text-ink-light">
              Delivering AI intelligence, weekly.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

