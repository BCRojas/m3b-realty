---
name: webapp-promo-video
description: "Produce a ~60-second promotional MP4 video for a web application. Covers the full end-to-end workflow: capturing app screenshots, generating AI title/CTA cards, writing and generating a voiceover narration, synthesizing background music, and compositing everything into a final video with audio. Use this skill whenever a user asks to create a promo video, demo video, or marketing video for a web app or SaaS product."
---

# Web App Promo Video Skill

Produces a polished ~60-second promotional video with:
- App screenshots with headline overlays
- AI-generated opening title and CTA closing cards
- Energetic voiceover narration (TTS)
- Synthesized upbeat background music
- Final mixed MP4 (H.264 + AAC)

## Workflow

```
1. Capture screenshots        → browser screenshots of the live app
2. Generate graphic frames    → AI title card, features card, CTA card
3. Write voiceover script     → timed to video segments
4. Generate voiceover audio   → TTS with chosen voice
5. Build silent video         → make_video.py + config.json
6. Mix audio                  → mix_audio.sh (fits VO + adds music)
7. Deliver                    → attach final MP4 to result message
```

---

## Step 1 — Capture Screenshots

Navigate to the live app and capture 4–6 key screens using `browser_save_image`. Save to a working directory (e.g., `/home/ubuntu/promo_assets/`).

**Essential screens to capture:**
- Template/onboarding selector
- Main customization/editor panel
- Key feature (e.g., photo upload, form filling)
- Launch/publish button area
- Live output (the generated website or result)

---

## Step 2 — Generate Graphic Frames

Use the `generate` tool to create 3 AI image frames:

| Frame | Purpose | Prompt guidance |
|---|---|---|
| `frame_01_opening.png` | Hook title card | Dark navy background, bold white headline, app name prominent, energetic feel |
| `frame_02_features.png` | 3-column features grid | Dark background, 3 feature cards with icons, brand accent color |
| `frame_03_cta.png` | Closing CTA card | Bold headline, domain URL, strong call-to-action, brand colors |

---

## Step 3 — Write Voiceover Script

Read `references/voiceover_guide.md` for timing, tone, and CTA formulas.

**60s script structure:**
- 0–5s: Hook (punchy problem/promise)
- 5–15s: Pain point
- 15–35s: Step-by-step solution walkthrough
- 35–45s: Outcome / social proof
- 45–55s: Feature highlights
- 55–60s: CTA with domain

Write naturally — the audio will be speed-fitted to match the video duration automatically.

---

## Step 4 — Generate Voiceover Audio

Use the `generate` tool (speech mode) to produce the narration WAV.

**Voice selection:**
- Energetic male → use `male_voice` or equivalent energetic preset
- Professional female → use `female_voice`
- Ask the user for preference if not specified

Save to `voiceover.wav` in the working directory.

---

## Step 5 — Build the Silent Video

Create `config.json` using the schema in `references/slide_config_example.json`.

**Slide order (recommended):**
1. `full` — opening title card (5s)
2. `screenshot` — Step 1 screen (6s)
3. `screenshot` — Step 2 screen (6s)
4. `screenshot` — Step 3 screen (5s)
5. `full` — features card (5s)
6. `screenshot` — live result screen (7s)
7. `full` — CTA closing card (8s)

**Total: ~42–55s** (adjust durations to hit target length)

Run:
```bash
pip install moviepy pillow  # if not already installed
python scripts/make_video.py --config config.json --output promo_silent.mp4
```

---

## Step 6 — Mix Audio into Video

```bash
bash scripts/mix_audio.sh promo_silent.mp4 voiceover.wav promo_final.mp4 0.18
```

Arguments:
- `promo_silent.mp4` — silent video from Step 5
- `voiceover.wav` — TTS audio from Step 4
- `promo_final.mp4` — output path
- `0.18` — background music volume (0.0–1.0); default 0.18 keeps voice clear

The script automatically:
1. Speed-fits the voiceover to match video duration
2. Generates synthesized upbeat background music (128 BPM, ~60s)
3. Mixes voice + music and muxes into the final MP4

**Dependencies:** `ffmpeg`, `numpy`, `scipy` (for music synthesis)

---

## Step 7 — Deliver

Verify the output:
```bash
ffprobe -v quiet -show_entries format=duration,size -of default=noprint_wrappers=1 promo_final.mp4
```

Attach `promo_final.mp4` in the `result` message. Offer follow-up options:
- Add burned-in captions
- Create a 30-second cut
- Export a vertical 9:16 version for Reels/TikTok

---

## Key Parameters

| Parameter | Default | Notes |
|---|---|---|
| Resolution | 1920×1080 | Change in config.json |
| FPS | 30 | Change in config.json |
| Cross-fade | 0.4s | Change in config.json |
| Music BPM | 128 | Change `--bpm` in mix_audio.sh |
| Music volume | 0.18 | 4th arg to mix_audio.sh |

---

## Dependencies

Install once per environment:
```bash
sudo pip3 install moviepy pillow numpy scipy
# ffmpeg must be available on PATH
```
