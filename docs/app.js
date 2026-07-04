// Study Buddy landing page.
// 1. Detects the visitor's platform and points the download button at the
//    matching installer from the latest GitHub Release (falls back to the
//    releases page if the API is unavailable or rate-limited).
// 2. Builds the screenshot carousel by probing screenshots/study-buddy-1.png,
//    -2.png, -3.png… — drop a new numbered PNG into docs/screenshots/ and it
//    joins the rotation automatically, no code change needed.
// No server, no tracking; the only network call is to the public GitHub API.

const REPO = 'michael-borck/study-buddy'
const RELEASES_API = `https://api.github.com/repos/${REPO}/releases/latest`
const FALLBACK_URL = `https://github.com/${REPO}/releases/latest`

const PLATFORM_LABEL = { mac: 'macOS', windows: 'Windows', linux: 'Linux' }

/* ---------- Download button ---------- */

/** Sniff the OS from the browser. Defaults to macOS when unsure. */
function detectPlatform() {
  const ua = navigator.userAgent.toLowerCase()
  const platform = (navigator.platform || '').toLowerCase()
  if (platform.includes('mac') || ua.includes('macintosh') || ua.includes('mac os')) return 'mac'
  if (platform.includes('win') || ua.includes('windows')) return 'windows'
  if (ua.includes('linux') || platform.includes('linux')) return 'linux'
  return 'mac'
}

let selectedPlatform = detectPlatform()
let release = null // { tag, assets[] }

async function loadRelease() {
  try {
    const res = await fetch(RELEASES_API)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    release = { tag: data.tag_name, assets: data.assets || [] }
  } catch {
    release = null // API failed or rate-limited — fall back to the releases page.
  }
  render()
}

/**
 * Pick the installer for a platform. Asset names come from electron-builder:
 * Study.Buddy-{version}-arm64.dmg / Study.Buddy-{version}.dmg,
 * Study.Buddy.Setup.{version}.exe (plus a portable .exe),
 * Study.Buddy-{version}.AppImage. Browsers can't reliably distinguish Apple
 * Silicon from Intel, so macOS defaults to the arm64 DMG (the common case on
 * current hardware) and an "Intel Mac?" link offers the x64 DMG.
 */
function assetsFor(platform) {
  if (!release) return { primary: null, alt: null }
  const a = release.assets
  if (platform === 'mac') {
    const arm = a.find((x) => x.name.endsWith('-arm64.dmg'))
    const intel = a.find((x) => x.name.endsWith('.dmg') && !x.name.includes('arm64'))
    return { primary: arm || intel, alt: arm ? intel : null }
  }
  if (platform === 'windows') {
    const setup = a.find((x) => x.name.includes('Setup') && x.name.endsWith('.exe'))
    return { primary: setup || a.find((x) => x.name.endsWith('.exe')), alt: null }
  }
  return { primary: a.find((x) => x.name.endsWith('.AppImage')), alt: null }
}

function render() {
  const btn = document.getElementById('download-btn')
  const versionEl = document.getElementById('version')
  const altEl = document.getElementById('alt-arch')

  const { primary, alt } = assetsFor(selectedPlatform)
  btn.href = primary ? primary.browser_download_url : FALLBACK_URL
  btn.textContent = `Download for ${PLATFORM_LABEL[selectedPlatform]}`

  versionEl.textContent = release?.tag ? `Latest release: ${release.tag}` : 'See all releases →'

  if (alt) {
    altEl.hidden = false
    altEl.href = alt.browser_download_url
    altEl.textContent = 'Intel Mac? Download x64 →'
  } else {
    altEl.hidden = true
  }

  document.querySelectorAll('.platform-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.platform === selectedPlatform)
  })
}

document.querySelectorAll('.platform-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    selectedPlatform = btn.dataset.platform
    render()
  })
})

render()
loadRelease()

/* ---------- Screenshot carousel ---------- */

const SHOT_PREFIX = 'screenshots/study-buddy-'
const SHOT_MAX = 24 // sanity cap on probing

/** Probe numbered screenshots until one is missing; resolve with the found URLs. */
function discoverShots() {
  return new Promise((resolve) => {
    const found = []
    const tryNext = (n) => {
      if (n > SHOT_MAX) return resolve(found)
      const img = new Image()
      img.onload = () => { found.push(img.src); tryNext(n + 1) }
      img.onerror = () => resolve(found)
      img.src = `${SHOT_PREFIX}${n}.png`
    }
    tryNext(1)
  })
}

function buildCarousel(urls) {
  const carousel = document.getElementById('carousel')
  const dots = document.getElementById('carousel-dots')
  if (!urls.length) return

  let current = 0
  let timer = null

  urls.forEach((url, i) => {
    const img = document.createElement('img')
    img.src = url
    img.alt = `Study Buddy screenshot ${i + 1}`
    if (i === 0) img.classList.add('active')
    carousel.appendChild(img)

    const dot = document.createElement('button')
    dot.setAttribute('aria-label', `Show screenshot ${i + 1}`)
    if (i === 0) dot.classList.add('active')
    dot.addEventListener('click', () => { show(i); restart() })
    dots.appendChild(dot)
  })

  const imgs = carousel.querySelectorAll('img')
  const dotEls = dots.querySelectorAll('button')

  function show(i) {
    current = i
    imgs.forEach((el, j) => el.classList.toggle('active', j === i))
    dotEls.forEach((el, j) => el.classList.toggle('active', j === i))
  }

  function restart() {
    clearInterval(timer)
    if (urls.length > 1) timer = setInterval(() => show((current + 1) % urls.length), 4500)
  }

  carousel.addEventListener('mouseenter', () => clearInterval(timer))
  carousel.addEventListener('mouseleave', restart)
  restart()
}

discoverShots().then(buildCarousel)
