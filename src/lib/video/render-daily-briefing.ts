import {
  addBundleToSandbox,
  createSandbox,
  renderMediaOnVercel,
  uploadToVercelBlob,
} from '@remotion/vercel'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { COMP_NAME } from '@/remotion/Root'

const BUNDLE_DIR = '.remotion'

function ensureBundle(): void {
  const bundlePath = path.join(process.cwd(), BUNDLE_DIR)
  const indexHtml = path.join(bundlePath, 'index.html')
  if (!fs.existsSync(indexHtml)) {
    execSync(`npx remotion bundle --out-dir ./${BUNDLE_DIR}`, {
      cwd: process.cwd(),
      stdio: 'inherit',
    })
  }
}

export interface RenderBriefingInput {
  audioUrl: string
  title: string
  items: { title: string; sourceUrl: string; sourceName: string }[]
}

/**
 * Render daily briefing video via Remotion on Vercel Sandbox.
 * Returns video URL or null if render fails (caller can fall back to audio-only).
 */
export async function renderDailyBriefing(
  input: RenderBriefingInput
): Promise<string | null> {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  if (!blobToken) {
    console.warn('BLOB_READ_WRITE_TOKEN not set, skipping video render')
    return null
  }

  try {
    const sandbox = await createSandbox({
      onProgress: ({ progress, message }) => {
        console.log(`[Remotion] ${message} (${Math.round(progress * 100)}%)`)
      },
    })

    try {
      ensureBundle()
      await addBundleToSandbox({
        sandbox,
        bundleDir: path.join(process.cwd(), BUNDLE_DIR),
      })
    } catch (bundleErr) {
      console.warn('Remotion bundle/sandbox setup failed:', bundleErr)
      await sandbox?.stop().catch(() => {})
      return null
    }

    const { sandboxFilePath, contentType } = await renderMediaOnVercel({
      sandbox,
      compositionId: COMP_NAME,
      inputProps: input as unknown as Record<string, unknown>,
      onProgress: (update) => {
        console.log(
          `[Remotion] ${update.stage} - ${Math.round(update.overallProgress * 100)}%`
        )
      },
    })

    const { url } = await uploadToVercelBlob({
      sandbox,
      sandboxFilePath,
      contentType,
      blobToken,
      access: 'public',
    })

    await sandbox.stop().catch(() => {})
    return url
  } catch (err) {
    console.error('Remotion video render failed:', err)
    return null
  }
}
