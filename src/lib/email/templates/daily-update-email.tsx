import {
  Body,
  Button,
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

interface DailyUpdateEmailProps {
  title: string
  date: string
  watchUrl: string
  items: { title: string; sourceUrl: string; sourceName: string }[]
}

export function DailyUpdateEmail({
  title,
  date,
  watchUrl,
  items,
}: DailyUpdateEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>AI Times Daily — {title}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={masthead}>
            <div style={claretBar} />
            <Heading style={wordmark}>AI Times</Heading>
            <Text style={issueInfo}>
              {date} &bull; Daily Briefing
            </Text>
          </Section>

          <Hr style={divider} />

          <Section style={titleSection}>
            <Heading style={titleStyle}>{title}</Heading>
          </Section>

          <Section style={ctaSection}>
            <Button href={watchUrl} style={ctaButton}>
              Watch your daily briefing
            </Button>
          </Section>

          <Hr style={divider} />

          <Section style={linksSection}>
            <Text style={sectionLabel}>Source links</Text>
            {items.map((item, index) => (
              <div key={index} style={linkItem}>
                <Link href={item.sourceUrl} style={linkTitle}>
                  {item.title}
                </Link>
                <Text style={linkSource}>{item.sourceName}</Text>
              </div>
            ))}
          </Section>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} AI Times. All rights reserved.
            </Text>
            <Text style={footerText}>
              You are receiving this because you have an active AI Times subscription.
            </Text>
            <Link
              href={`${process.env.NEXTAUTH_URL ?? 'https://aitimes.com'}/account`}
              style={footerLink}
            >
              Manage Subscription
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

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

const titleStyle = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: '24px',
  fontWeight: 700 as const,
  lineHeight: '1.2',
  color: '#1A1A2E',
  margin: '0',
}

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const ctaButton = {
  backgroundColor: '#9E2F50',
  color: '#FFF1E5',
  padding: '14px 32px',
  borderRadius: '4px',
  fontSize: '16px',
  fontWeight: 700 as const,
  textDecoration: 'none',
}

const linksSection = {
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

const linkItem = {
  marginBottom: '16px',
}

const linkTitle = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: '16px',
  fontWeight: 700 as const,
  color: '#1A1A2E',
  textDecoration: 'none',
  lineHeight: '1.3',
}

const linkSource = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '12px',
  color: '#666E80',
  margin: '4px 0 0 0',
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
