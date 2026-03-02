'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, User } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import styles from './header.module.styl'

const navLinks = [
  { href: '/newsletters', label: 'Newsletters' },
]

export function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const initials = session?.user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() ?? 'U'

  return (
    <header className={styles.header}>
      <div className={styles.claretBorder} />
      <div className="ft-container">
        <div className={styles.headerInner}>
          {/* Mobile menu button */}
          <button
            className={styles.mobileMenuButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Wordmark */}
          <Link href="/" className={styles.wordmark}>
            AI Times
          </Link>

          {/* Desktop nav */}
          <nav className={styles.desktopNav}>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth section */}
          <div className={styles.authSection}>
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={styles.avatarButton}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image ?? ''} alt={session.user?.name ?? ''} />
                      <AvatarFallback className="bg-wheat text-ink text-xs font-medium">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white border-divider">
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="text-ink no-underline hover:no-underline">
                      <User size={14} className="mr-2" />
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-divider" />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-ink-muted cursor-pointer"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/sign-in" className={styles.signInLink}>
                  Sign In
                </Link>
                <Link href="/sign-up" className="ft-button text-sm py-2 px-5">
                  Subscribe
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        {isMobileMenuOpen && (
          <nav className={styles.mobileNav}>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.mobileNavLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!session && (
              <>
                <Link
                  href="/sign-in"
                  className={styles.mobileNavLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="ft-button text-center mt-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Subscribe
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}

