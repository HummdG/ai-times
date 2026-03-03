import { AbsoluteFill, Audio, interpolate, useCurrentFrame } from 'remotion'

export interface BriefingItem {
  title: string
  sourceUrl: string
  sourceName: string
}

export interface DailyBriefingProps {
  audioUrl: string
  title: string
  items: BriefingItem[]
}

export const DailyBriefing: React.FC<DailyBriefingProps> = ({
  audioUrl,
  title,
  items,
}) => {
  const frame = useCurrentFrame()
  const fps = 30

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#1A1A2E',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {audioUrl && <Audio src={audioUrl} />}

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 48,
        }}
      >
        <div
          style={{
            height: 3,
            width: 80,
            backgroundColor: '#9E2F50',
            marginBottom: 24,
          }}
        />
        <h1
          style={{
            fontSize: 42,
            fontWeight: 900,
            color: '#FFF1E5',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            margin: 0,
            textAlign: 'center',
          }}
        >
          AI Times
        </h1>
        <p
          style={{
            fontSize: 18,
            color: '#9DA3AE',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginTop: 8,
          }}
        >
          Daily Briefing
        </p>
        <h2
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: '#FFF1E5',
            marginTop: 48,
            maxWidth: 900,
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          {title}
        </h2>
        {items.length > 0 && (
          <div
            style={{
              marginTop: 48,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              justifyContent: 'center',
            }}
          >
            {items.slice(0, 6).map((item, i) => {
              const startFrame = 90 + i * 120
              const opacity = interpolate(
                frame,
                [startFrame, startFrame + 30],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              )
              return (
                <div
                  key={i}
                  style={{
                    backgroundColor: 'rgba(255,241,229,0.08)',
                    padding: '12px 20px',
                    borderRadius: 8,
                    border: '1px solid rgba(158,47,80,0.4)',
                    opacity,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      color: '#9DA3AE',
                      marginRight: 8,
                    }}
                  >
                    {item.sourceName}
                  </span>
                  <span style={{ fontSize: 16, color: '#FFF1E5' }}>
                    {item.title.length > 50 ? item.title.slice(0, 50) + '…' : item.title}
                  </span>
                </div>
              )
            })}
          </div>
        )}
        <p
          style={{
            position: 'absolute',
            bottom: 48,
            fontSize: 14,
            color: '#666E80',
          }}
        >
          Full links in your email and below the video
        </p>
      </div>
    </AbsoluteFill>
  )
}
