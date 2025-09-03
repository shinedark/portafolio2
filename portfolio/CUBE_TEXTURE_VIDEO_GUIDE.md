# 🎬 Cube Texture Video Integration Guide

## 📁 File Placement
Once you create your `cube-texture-video.mp4`, place it in:
```
/public/videos/cube-texture-video.mp4
```

## ✅ Video Requirements (Already Configured)
- **Resolution**: 1024x1024 (square format)
- **Duration**: 10-15 seconds (seamless loop)
- **Format**: MP4 (H.264 codec)
- **Frame Rate**: 30 FPS
- **File Size**: Under 5MB
- **Loop**: Must be seamless (first/last frames match)

## 🎨 Visual Theme (From Your Prompt)
- **Binary Rain Effect** (Matrix-style green/white)
- **Code Syntax Highlighting** (C/C++ snippets)
- **Compression Visualization** (shrinking files/particles)
- **Greek Letters Animation** (α, β, γ, δ floating)
- **Color Palette**: White/light gray on pure black

## 🔧 Code Integration Status
✅ **ZstdOptimizer.js Updated**
- Video source configured to use `/videos/cube-texture-video.mp4`
- Fallback to existing `remastered.mp4` if not found
- Optimized texture settings for cube mapping
- Error handling and mobile support added

## 🚀 How It Works
1. **Primary**: Loads `cube-texture-video.mp4`
2. **Fallback**: If not found, uses `remastered.mp4`
3. **Display**: Video texture applied to floating cubes in 3D scene
4. **Animation**: Cubes rotate and float representing data compression

## 📝 Code Snippets to Include in Video
```c
#include <zstd.h>
int main() {
    ZSTD_compress();
    return 0;
}
```

## 🔤 Greek Symbols to Feature
`α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ σ τ υ φ χ ψ ω`

## 🎯 Next Steps
1. Create the video using your detailed prompt
2. Save as `cube-texture-video.mp4` in `/public/videos/`
3. Test in browser - should auto-load with seamless looping
4. If issues occur, check browser console for fallback messages

The code is ready and waiting for your awesome cube texture video! 🎬✨
