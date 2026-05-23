// afterSign hook for electron-builder. Bypasses electron-builder's own
// notarize wrapper (buggy across the 24.x/26.x line — it fails auth with a
// 401 even with valid credentials) and calls @electron/notarize directly with
// full options. Skipped on non-mac builds and when Apple credentials aren't
// set (local dev). Mirrors the working setup in the talk-buddy repo.

const { notarize } = require("@electron/notarize");
const { execFileSync } = require("child_process");

// electron-builder loads this hook via `require(path).default`, NOT
// `require(path)` directly — so the function MUST be exported on `default`.
// `module.exports = fn` is silently ignored. See https://www.electron.build/hooks
exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;

  console.log(`[notarize] afterSign hook entered (platform=${electronPlatformName})`);

  if (electronPlatformName !== "darwin") {
    return;
  }

  // Read NOTARIZE_*-prefixed env vars (not APPLE_*) so electron-builder's
  // auto-detection doesn't fire its own buggy notarize wrapper alongside ours.
  const appleId = process.env.NOTARIZE_APPLE_ID;
  const appleIdPassword = process.env.NOTARIZE_APPLE_PASSWORD;
  const teamId = process.env.NOTARIZE_APPLE_TEAM_ID;

  if (!appleId || !appleIdPassword || !teamId) {
    console.log(
      "[notarize] Skipping — NOTARIZE_APPLE_ID / NOTARIZE_APPLE_PASSWORD / NOTARIZE_APPLE_TEAM_ID not all set",
    );
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appPath = `${appOutDir}/${appName}.app`;
  const appBundleId = context.packager.appInfo.id;

  console.log(`[notarize] Notarizing ${appPath} (bundleId=${appBundleId}, teamId=${teamId})`);

  await notarize({
    tool: "notarytool",
    appBundleId,
    appPath,
    appleId,
    appleIdPassword,
    teamId,
  });

  console.log("[notarize] Notarisation accepted; stapling ticket");

  // Staple the ticket so Gatekeeper can verify offline. notarytool itself does
  // not staple. Staple failures are logged but don't fail the build — the app
  // is still validly notarised, the ticket is just fetched online instead.
  try {
    execFileSync("xcrun", ["stapler", "staple", appPath], { stdio: "inherit" });
    console.log("[notarize] Stapled");
  } catch (err) {
    console.warn(`[notarize] Staple failed (build will continue): ${err.message}`);
  }
};
