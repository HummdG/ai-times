import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { NewsletterData } from '@/types'
import { NEWS_CATEGORIES, type NewsCategory } from '@/types'

interface WeeklyNewsletterEmailProps {
  newsletter: NewsletterData
}

export function WeeklyNewsletterEmail({ newsletter }: WeeklyNewsletterEmailProps) {
  const groupedItems = newsletter.items.reduce((acc, item) => {
    const category = item.category as NewsCategory
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {} as Record<string, typeof newsletter.items>)

  return (
    <Html>
      <Head />
      <Preview>{newsletter.title} — AI Times Weekly</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Masthead */}
          <Section style={masthead}>
            <div style={claretBar} />
            <Heading style={wordmark}>AI Times</Heading>
            <Text style={issueInfo}>
              Week {newsletter.weekNumber}, {newsletter.year} &bull; Weekly Intelligence Briefing
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Title */}
          <Section style={titleSection}>
            <Heading style={title}>{newsletter.title}</Heading>
          </Section>

          <Hr style={divider} />

          {/* Editorial */}
          <Section style={editorialSection}>
            {newsletter.editorial.split('\n\n').map((paragraph, index) => (
              <Text key={index} style={editorialText}>
                {paragraph}
              </Text>
            ))}
          </Section>

          <Hr style={divider} />

          {/* News Sections */}
          {(Object.keys(NEWS_CATEGORIES) as NewsCategory[]).map(category => {
            const items = groupedItems[category]
            if (!items || items.length === 0) return null

            return (
              <Section key={category} style={newsSection}>
                <Text style={sectionLabel}>
                  {NEWS_CATEGORIES[category]}
                </Text>

                {items.map(item => (
                  <div key={item.id} style={newsItem}>
                    <Link href={item.sourceUrl} style={newsTitle}>
                      {item.title}
                    </Link>
                    <Text style={newsSummary}>{item.summary}</Text>
                    <Text style={newsSource}>
                      {item.sourceName} &bull;{' '}
                      <Link href={item.sourceUrl} style={readMore}>
                        Read full article &rarr;
                      </Link>
                    </Text>
                  </div>
                ))}
              </Section>
            )
          })}

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              &copy; {newsletter.year} AI Times. All rights reserved.
            </Text>
            <Text style={footerText}>
              You are receiving this because you have an active AI Times subscription.
            </Text>
            <Link href={`${process.env.NEXTAUTH_URL}/account`} style={footerLink}>
              Manage Subscription
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#FFF1E5',
  fontFamily: 'Georgia, "Times New Roman", serif',
}

const container = {
  maxWidth: '640px',
  margin: '0 auto',
  padding: '40px 20px',
}

const masthead = {
  textAlign: 'center' as const,
  marginBottom: '24px',
}

const claretBar = {
  height: '3px',
  backgroundColor: '#9E2F50',
  marginBottom: '24px',
}

const wordmark = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: '28px',
  fontWeight: 900 as const,
  letterSpacing: '0.06em',
  textTransform: 'uppercase' as const,
  color: '#1A1A2E',
  margin: '0 0 8px 0',
}

const issueInfo = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '12px',
  color: '#666E80',
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  margin: '0',
}

const divider = {
  borderTop: '1px solid #E8D6C4',
  margin: '24px 0',
}

const titleSection = {
  textAlign: 'center' as const,
}

const title = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: '28px',
  fontWeight: 700 as const,
  lineHeight: '1.2',
  color: '#1A1A2E',
  margin: '0',
}

const editorialSection = {
  marginBottom: '8px',
}

const editorialText = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: '16px',
  lineHeight: '1.7',
  color: '#1A1A2E',
  fontStyle: 'italic' as const,
}

const newsSection = {
  marginBottom: '32px',
}

const sectionLabel = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '11px',
  fontWeight: 700 as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
  color: '#666E80',
  borderBottom: '1px solid #E8D6C4',
  paddingBottom: '8px',
  marginBottom: '16px',
}

const newsItem = {
  marginBottom: '24px',
}

const newsTitle = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: '18px',
  fontWeight: 700 as const,
  color: '#1A1A2E',
  textDecoration: 'none',
  lineHeight: '1.3',
}

const newsSummary = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#1A1A2E',
  margin: '8px 0',
}

const newsSource = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '12px',
  color: '#666E80',
  margin: '0',
}

const readMore = {
  color: '#0D7680',
  textDecoration: 'none',
}

const footer = {
  textAlign: 'center' as const,
  marginTop: '16px',
}

const footerText = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '12px',
  color: '#9DA3AE',
  margin: '4px 0',
}

const footerLink = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '12px',
  color: '#0D7680',
  textDecoration: 'none',
}

