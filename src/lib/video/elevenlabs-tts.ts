import { put } from '@vercel/blob'

const ELEVENLABS_API = 'https://api.elevenlabs.io/v1'
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM' // Rachel - professional news-style voice

/**
 * Generate TTS audio from script via ElevenLabs, upload to Vercel Blob, return URL.
 */
export async function generateAndUploadAudio(script: string): Promise<string> {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY is required for video generation')
  }

  const voiceId = process.env.ELEVENLABS_VOICE_ID ?? DEFAULT_VOICE_ID

  const response = await fetch(
    `${ELEVENLABS_API}/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: script,
        model_id: 'eleven_multilingual_v2',
      }),
    }
  )

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`ElevenLabs TTS failed: ${response.status} ${err}`)
  }

  const audioBuffer = await response.arrayBuffer()
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const pathname = `daily-updates/audio/${timestamp}.mp3`

  const blob = await put(pathname, audioBuffer, {
    access: 'public',
    contentType: 'audio/mpeg',
  })

  return blob.url
}
