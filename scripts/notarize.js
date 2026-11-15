// Golden afterSign hook for the Electron fleet.
//
// Prefers App Store Connect API-key notarization:
//   APPLE_API_KEY_PATH  decoded .p8 path (written by the release workflow)
//   APPLE_API_KEY       Key ID
//   APPLE_API_ISSUER    Issuer ID
//
// Falls back to Apple ID during migration:
//   NOTARIZE_APPLE_ID / NOTARIZE_APPLE_PASSWORD / NOTARIZE_APPLE_TEAM_ID
//
// Staple/CloudKit failures are retried; no-op off macOS or without credentials.
// Keep `mac.notarize: false` in electron-builder.yml so the built-in wrapper
// does not run a second notarization.
const { execFileSync } = require('node:child_process')

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function stapleWithRetry(appPath) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      execFileSync('xcrun', ['stapler', 'staple', appPath], { stdio: 'inherit' })
      return
    } catch (e) {
      if (attempt === 3) throw e
      console.warn(`[notarize] staple failed (attempt ${attempt}); retrying...`)
      await sleep(15000)
    }
  }
}

exports.default = async function notarizing(context) {
  if (context.electronPlatformName !== 'darwin') return
  const { notarize } = require('@electron/notarize')
  const appName = context.packager.appInfo.productFilename
  const appPath = `${context.appOutDir}/${appName}.app`

  const apiKeyPath = process.env.APPLE_API_KEY_PATH
  const apiKeyId = process.env.APPLE_API_KEY
  const apiIssuer = process.env.APPLE_API_ISSUER
  const appleId = process.env.NOTARIZE_APPLE_ID
  const appleIdPassword = process.env.NOTARIZE_APPLE_PASSWORD
  const teamId = process.env.NOTARIZE_APPLE_TEAM_ID

  console.log(`[notarize] ${appPath}`)

  const runNotarize = async (options) => {
    try {
      await notarize(options)
    } catch (e) {
      const message = String((e && e.message) || e)
      if (!/staple|CloudKit|Error 68|network/i.test(message)) throw e
      console.warn('[notarize] wrapper failed during stapling:', message)
      await stapleWithRetry(options.appPath)
    }
  }

  if (apiKeyPath && apiKeyId && apiIssuer) {
    console.log('[notarize] using App Store Connect API key')
    await runNotarize({
      tool: 'notarytool',
      appPath,
      appleApiKey: apiKeyPath,
      appleApiKeyId: apiKeyId,
      appleApiIssuer: apiIssuer
    })
  } else if (appleId && appleIdPassword && teamId) {
    console.log('[notarize] using Apple ID')
    await runNotarize({ tool: 'notarytool', appPath, appleId, appleIdPassword, teamId })
  } else {
    console.log('[notarize] skipped (no API key or Apple ID credentials)')
    return
  }

  await stapleWithRetry(appPath)
}
