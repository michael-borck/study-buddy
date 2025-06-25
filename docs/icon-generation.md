# Study Buddy Icon Generation Guide 🎓

## Current Status
The app currently uses a generic favicon and no custom Electron icons. We want to replace these with graduation cap emoji-based icons.

## Required Icon Sizes

### Web (favicon)
- `app/favicon.ico` - 16x16, 32x32 (multi-size ICO file)

### Electron (for cross-platform builds)
- `build/icons/icon.icns` (macOS) - Multi-size ICNS file
- `build/icons/icon.ico` (Windows) - Multi-size ICO file
- `build/icons/icon.png` (Linux) - 512x512 PNG (Electron will auto-scale)

### Additional sizes for Linux distributions
- `build/icons/16x16.png`
- `build/icons/32x32.png` 
- `build/icons/48x48.png`
- `build/icons/64x64.png`
- `build/icons/128x128.png`
- `build/icons/256x256.png`
- `build/icons/512x512.png`
- `build/icons/1024x1024.png`

## How to Generate Icons from 🎓 Emoji

### Option 1: Online Tools (Recommended)
1. Go to https://favicon.io/emoji-favicons/graduation-cap/ 
2. Download the graduation cap emoji favicon package
3. Extract and use the generated files

### Option 2: Manual Creation
1. **Create base image:**
   - Open image editor (Figma, Canva, GIMP, etc.)
   - Create 1024x1024 canvas with transparent background
   - Add graduation cap emoji 🎓 at large size
   - Center it with some padding around edges
   - Export as PNG

2. **Generate multiple sizes:**
   - Use online converter like https://icoconvert.com/
   - Upload your 1024x1024 PNG
   - Generate .ico files with multiple sizes (16, 32, 48, 64, 128, 256)
   - Generate .icns file for macOS
   - Generate individual PNG files for Linux

### Option 3: Command Line (if you have ImageMagick)
```bash
# Create base 1024x1024 image (you'll need to create this manually first)
# Then convert to various sizes:

# ICO for Windows (multi-size)
magick icon-1024.png -resize 256x256 -resize 128x128 -resize 64x64 -resize 48x48 -resize 32x32 -resize 16x16 build/icons/icon.ico

# Individual PNGs for Linux
magick icon-1024.png -resize 16x16 build/icons/16x16.png
magick icon-1024.png -resize 32x32 build/icons/32x32.png
magick icon-1024.png -resize 48x48 build/icons/48x48.png
magick icon-1024.png -resize 64x64 build/icons/64x64.png
magick icon-1024.png -resize 128x128 build/icons/128x128.png
magick icon-1024.png -resize 256x256 build/icons/256x256.png
magick icon-1024.png -resize 512x512 build/icons/512x512.png
cp icon-1024.png build/icons/1024x1024.png

# ICNS for macOS (requires additional tools)
# On macOS: iconutil -c icns icon.iconset
```

## Package.json Configuration

Once you have the icons, add this to your package.json build config:

```json
{
  "build": {
    "productName": "Study Buddy",
    "appId": "com.michaelborck.studybuddy",
    "directories": {
      "output": "dist"
    },
    "files": [...],
    "mac": {
      "icon": "build/icons/icon.icns",
      "category": "public.app-category.education"
    },
    "win": {
      "icon": "build/icons/icon.ico"
    },
    "linux": {
      "icon": "build/icons/icon.png"
    }
  }
}
```

## File Placement
```
study-buddy/
├── app/
│   └── favicon.ico          # Replace with graduation cap favicon
├── build/
│   └── icons/
│       ├── icon.icns        # macOS (multi-size)
│       ├── icon.ico         # Windows (multi-size)  
│       ├── icon.png         # Linux main (512x512)
│       ├── 16x16.png        # Linux sizes
│       ├── 32x32.png
│       ├── 48x48.png
│       ├── 64x64.png
│       ├── 128x128.png
│       ├── 256x256.png
│       ├── 512x512.png
│       └── 1024x1024.png
└── public/
    └── favicon.ico          # Copy from app/ for consistency
```

## Design Guidelines
- **Style**: Clean graduation cap emoji 🎓 on transparent background
- **Padding**: Leave ~15% padding around edges so icon doesn't touch edges
- **Colors**: Use standard emoji colors (black cap, gold tassel)
- **Background**: Transparent for all sizes
- **Quality**: Vector-based or high-DPI source for clean scaling

## Testing
After generating icons:
1. Test favicon in browser (should show in tab)
2. Build Electron app: `npm run electron-pack`
3. Check generated apps show graduation cap icon in:
   - Windows: Taskbar, window title, file explorer
   - macOS: Dock, Finder, window title
   - Linux: Application menu, window manager

## Quick Start
The fastest way is to use https://favicon.io/emoji-favicons/graduation-cap/ and download the complete package, then organize the files according to the structure above.