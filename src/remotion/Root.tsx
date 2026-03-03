import { Composition } from 'remotion'
import { DailyBriefing } from './DailyBriefing'

export const COMP_NAME = 'DailyBriefing'

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id={COMP_NAME}
      component={DailyBriefing as unknown as React.ComponentType<Record<string, unknown>>}
      durationInFrames={9000}
      fps={30}
      width={1280}
      height={720}
      defaultProps={{
        audioUrl: '',
        title: 'AI Times Daily',
        items: [],
      } as Record<string, unknown>}
    />
  )
}
