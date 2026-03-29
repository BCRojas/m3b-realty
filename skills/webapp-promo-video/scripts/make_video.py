"""
webapp-promo-video skill — Video Compositor
============================================
Produces a ~60-second promotional MP4 from a set of slides and screenshots.

Usage:
    python make_video.py --config config.json --output promo.mp4

config.json schema:
{
  "resolution": [1920, 1080],       // optional, default 1920x1080
  "fps": 30,                        // optional, default 30
  "fade": 0.4,                      // optional, cross-fade seconds
  "slides": [
    {
      "type": "full",               // full-bleed pre-rendered image
      "image": "/path/to/frame.png",
      "duration": 5.0
    },
    {
      "type": "screenshot",         // app screenshot with headline overlay
      "image": "/path/to/screen.webp",
      "headline": "Step 1 — Choose Your Template",
      "sub": "Optional subtitle text",
      "duration": 6.0
    }
  ]
}
"""

import argparse, json, os, textwrap
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from moviepy import ImageClip, concatenate_videoclips, ColorClip
from moviepy.video.fx import FadeIn, FadeOut

# ── Defaults ──────────────────────────────────────────────────────────────────
DEFAULT_W, DEFAULT_H = 1920, 1080
DEFAULT_FPS = 30
DEFAULT_FADE = 0.4
DARK_BG = (10, 22, 40)
GREEN   = (44, 122, 75)
WHITE   = (255, 255, 255)
GRAY    = (180, 190, 200)

# ── Helpers ───────────────────────────────────────────────────────────────────

def load_img(path, size, fit="cover"):
    img = Image.open(path).convert("RGB")
    if fit == "cover":
        ratio = max(size[0] / img.width, size[1] / img.height)
        nw, nh = int(img.width * ratio), int(img.height * ratio)
        img = img.resize((nw, nh), Image.LANCZOS)
        l, t = (nw - size[0]) // 2, (nh - size[1]) // 2
        img = img.crop((l, t, l + size[0], t + size[1]))
    elif fit == "contain":
        img.thumbnail(size, Image.LANCZOS)
        canvas = Image.new("RGB", size, DARK_BG)
        canvas.paste(img, ((size[0] - img.width) // 2, (size[1] - img.height) // 2))
        img = canvas
    return img


def get_font(size, bold=False):
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]
    for p in candidates:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def draw_centered(draw, text, y, font, color=WHITE):
    lines = textwrap.wrap(text, width=40)
    lh = font.size + 10
    cy = y - (lh * len(lines)) // 2
    for line in lines:
        bb = draw.textbbox((0, 0), line, font=font)
        x = (draw.im.size[0] - (bb[2] - bb[0])) // 2
        draw.text((x, cy), line, font=font, fill=color)
        cy += lh


def make_full_slide(image_path, duration, W, H):
    img = load_img(image_path, (W, H), fit="cover")
    return ImageClip(np.array(img)).with_duration(duration)


def make_screenshot_slide(image_path, headline, sub, duration, W, H):
    bg = Image.new("RGB", (W, H), DARK_BG)
    draw = ImageDraw.Draw(bg)
    draw_centered(draw, headline, y=110, font=get_font(62, bold=True), color=WHITE)
    if sub:
        draw_centered(draw, sub, y=175, font=get_font(34), color=GRAY)
    fw, fh = 1560, 780
    screen = load_img(image_path, (fw, fh), fit="contain")
    border = 6
    bg.paste(Image.new("RGB", (fw + border*2, fh + border*2), GREEN),
             ((W - fw - border*2) // 2, 210 - border))
    bg.paste(screen, ((W - fw) // 2, 210))
    return ImageClip(np.array(bg)).with_duration(duration)


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    with open(args.config) as f:
        cfg = json.load(f)

    W, H  = cfg.get("resolution", [DEFAULT_W, DEFAULT_H])
    fps   = cfg.get("fps", DEFAULT_FPS)
    fade  = cfg.get("fade", DEFAULT_FADE)

    clips = []
    for slide in cfg["slides"]:
        stype = slide["type"]
        img   = slide["image"]
        dur   = slide["duration"]
        if stype == "full":
            clips.append(make_full_slide(img, dur, W, H))
        elif stype == "screenshot":
            clips.append(make_screenshot_slide(
                img, slide.get("headline", ""), slide.get("sub", ""), dur, W, H))
        else:
            raise ValueError(f"Unknown slide type: {stype}")

    faded = []
    for i, clip in enumerate(clips):
        c = clip
        if i > 0:
            c = c.with_effects([FadeIn(fade)])
        if i < len(clips) - 1:
            c = c.with_effects([FadeOut(fade)])
        faded.append(c)

    total = sum(c.duration for c in faded)
    print(f"Total duration: {total:.1f}s  ({total/60:.2f} min)")

    final = concatenate_videoclips(faded, method="compose")
    final.write_videofile(args.output, fps=fps, codec="libx264",
                          preset="fast", ffmpeg_params=["-crf", "20"],
                          audio=False, logger="bar")
    print(f"\nDone → {args.output}")


if __name__ == "__main__":
    main()
