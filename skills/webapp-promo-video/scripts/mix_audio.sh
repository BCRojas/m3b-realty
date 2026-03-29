#!/usr/bin/env bash
# webapp-promo-video skill — Audio Mixer
# =======================================
# Fits voiceover to video duration, generates background music,
# then mixes both into the final video.
#
# Usage:
#   bash mix_audio.sh <silent_video.mp4> <voiceover.wav> <output.mp4> [music_volume]
#
# Arguments:
#   silent_video   Silent MP4 produced by make_video.py
#   voiceover      WAV file from TTS (any duration)
#   output         Final MP4 path
#   music_volume   Background music volume 0.0–1.0 (default: 0.18)

set -euo pipefail

SILENT_VIDEO="${1:?Usage: mix_audio.sh <silent_video> <voiceover> <output> [music_vol]}"
VOICEOVER="${2:?}"
OUTPUT="${3:?}"
MUSIC_VOL="${4:-0.18}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORK_DIR="$(mktemp -d)"
trap "rm -rf $WORK_DIR" EXIT

# ── Step 1: Get video duration ────────────────────────────────────────────────
VIDEO_DUR=$(ffprobe -v quiet -show_entries format=duration \
  -of default=noprint_wrappers=1 "$SILENT_VIDEO" | cut -d= -f2)
echo "Video duration: ${VIDEO_DUR}s"

# ── Step 2: Fit voiceover to video duration ───────────────────────────────────
VO_DUR=$(ffprobe -v quiet -show_entries format=duration \
  -of default=noprint_wrappers=1 "$VOICEOVER" | cut -d= -f2)
echo "Voiceover duration: ${VO_DUR}s"

SPEED=$(python3 -c "print(round($VO_DUR / $VIDEO_DUR, 4))")
echo "Speed factor: $SPEED"

FITTED_VO="$WORK_DIR/voiceover_fitted.wav"
if python3 -c "exit(0 if 1.0 <= $SPEED <= 2.0 else 1)"; then
  ffmpeg -y -i "$VOICEOVER" -filter:a "atempo=$SPEED" "$FITTED_VO" -loglevel error
elif python3 -c "exit(0 if $SPEED > 2.0 else 1)"; then
  # Two-pass for speed > 2.0
  TMP="$WORK_DIR/vo_tmp.wav"
  HALF=$(python3 -c "print(round(($SPEED**0.5), 4))")
  ffmpeg -y -i "$VOICEOVER" -filter:a "atempo=$HALF,atempo=$HALF" "$FITTED_VO" -loglevel error
else
  # Speed < 1.0 — slow down (atempo min is 0.5)
  ffmpeg -y -i "$VOICEOVER" -filter:a "atempo=$SPEED" "$FITTED_VO" -loglevel error
fi

# ── Step 3: Generate background music ────────────────────────────────────────
BGMUSIC="$WORK_DIR/bgmusic.wav"
python3 "$SCRIPT_DIR/make_bgmusic.py" \
  --duration "$(python3 -c "print($VIDEO_DUR + 2)")" \
  --output "$BGMUSIC"

# ── Step 4: Mix and mux ───────────────────────────────────────────────────────
ffmpeg -y \
  -i "$SILENT_VIDEO" \
  -i "$FITTED_VO" \
  -i "$BGMUSIC" \
  -filter_complex "
    [1:a]volume=1.0[voice];
    [2:a]volume=${MUSIC_VOL},atrim=0:${VIDEO_DUR},asetpts=PTS-STARTPTS[music];
    [voice][music]amix=inputs=2:duration=first:dropout_transition=2[aout]
  " \
  -map 0:v -map "[aout]" \
  -c:v copy \
  -c:a aac -b:a 192k \
  -shortest \
  "$OUTPUT" -loglevel error

echo "Final video → $OUTPUT"
