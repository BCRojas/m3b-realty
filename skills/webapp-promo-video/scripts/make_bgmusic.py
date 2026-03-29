"""
webapp-promo-video skill — Background Music Synthesizer
========================================================
Generates an upbeat corporate background music track of the requested duration.
Uses numpy-based synthesis (no external music files required).

Usage:
    python make_bgmusic.py --duration 60 --bpm 128 --output bgmusic.wav

Output: 44100 Hz stereo WAV with fade-in/fade-out.
"""

import argparse
import numpy as np
import wave

SR = 44100


def note_freq(midi):
    return 440.0 * (2 ** ((midi - 69) / 12))


def sine(freq, dur, amp=0.5):
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    return amp * np.sin(2 * np.pi * freq * t)


def square(freq, dur, amp=0.3, duty=0.5):
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    return amp * np.where((t * freq % 1.0) < duty, 1.0, -1.0)


def sawtooth(freq, dur, amp=0.3):
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    return amp * (2 * ((t * freq) % 1.0) - 1.0)


def adsr(sig, attack=0.01, decay=0.05, sustain=0.7, release=0.08):
    n = len(sig)
    env = np.ones(n)
    a, d, r = int(attack * SR), int(decay * SR), int(release * SR)
    if a: env[:a] = np.linspace(0, 1, a)
    if d: env[a:a+d] = np.linspace(1, sustain, d)
    env[a+d:max(n-r, a+d)] = sustain
    if r and n - r > 0: env[n-r:] = np.linspace(sustain, 0, r)
    return sig * env


def place(buf, sig, start):
    end = min(start + len(sig), len(buf))
    buf[start:end] += sig[:end - start]


def generate(duration=60.0, bpm=128):
    rng = np.random.default_rng(42)
    beat = 60.0 / bpm
    total = int(SR * duration)
    L = np.zeros(total)
    R = np.zeros(total)

    # Kick (sine thump)
    def kick(dur=0.18):
        t = np.linspace(0, dur, int(SR * dur), endpoint=False)
        freq = 120 * np.exp(-30 * t)
        body = 0.9 * np.sin(2 * np.pi * np.cumsum(freq) / SR)
        click = 0.4 * rng.standard_normal(len(t)) * np.exp(-80 * t)
        return (body + click) * np.exp(-15 * t)

    def snare(dur=0.15):
        t = np.linspace(0, dur, int(SR * dur), endpoint=False)
        return ((0.6 * rng.standard_normal(len(t)) + 0.3 * np.sin(2 * np.pi * 220 * t))
                * np.exp(-20 * t))

    def hihat(dur=0.06, amp=0.25):
        t = np.linspace(0, dur, int(SR * dur), endpoint=False)
        return amp * rng.standard_normal(len(t)) * np.exp(-60 * t)

    kick_s, snare_s, hh_s = kick(), snare(), hihat()

    bars = int(duration / (beat * 4)) + 2
    for bar in range(bars):
        bs = int(bar * beat * 4 * SR)
        for b in range(4):
            s = bs + int(b * beat * SR)
            if b in (0, 2):
                place(L, kick_s, s); place(R, kick_s, s)
            if b in (1, 3):
                place(L, snare_s * 0.9, s); place(R, snare_s * 0.9, s)
            for e in range(2):
                hs = s + int(e * beat * 0.5 * SR)
                place(L, hh_s * 0.7, hs); place(R, hh_s * 0.7, hs)

    # Bass line
    bass_notes = [45, 45, 48, 52, 45, 45, 50, 52]
    for bar in range(bars):
        for i, midi in enumerate(bass_notes):
            s = int((bar * beat * 4 + i * beat * 0.5) * SR)
            if s >= total: break
            sig = adsr(sawtooth(note_freq(midi), beat * 0.45, amp=0.35),
                       sustain=0.8, release=0.05)
            place(L, sig, s); place(R, sig, s)

    # Chord stabs
    chords = [[57,60,64],[53,57,60],[48,52,55],[55,59,62]]
    for bar in range(bars):
        chord = chords[bar % 4]
        for bi in (0, 2):
            s = int((bar * beat * 4 + bi * beat) * SR)
            if s >= total: break
            stab = np.zeros(int(beat * 0.4 * SR))
            for midi in chord:
                stab += square(note_freq(midi), beat * 0.4, amp=0.12)
            stab = adsr(stab, attack=0.005, decay=0.08, sustain=0.5, release=0.1)
            place(L, stab * 0.8, s); place(R, stab * 0.8, s)

    # Melody
    melody = [69, 72, 71, 69, 67, 69, 72, 74]
    for bar in range(bars):
        for i, midi in enumerate(melody):
            s = int((bar * beat * 4 + i * beat * 0.5) * SR)
            if s >= total: break
            sig = adsr(sine(note_freq(midi), beat * 0.45, amp=0.18),
                       attack=0.02, sustain=0.7, release=0.06)
            place(L, sig, s); place(R, sig, s)

    # Fade in/out
    fi, fo = int(1.5 * SR), int(3.0 * SR)
    L[:fi] *= np.linspace(0, 1, fi); R[:fi] *= np.linspace(0, 1, fi)
    L[-fo:] *= np.linspace(1, 0, fo); R[-fo:] *= np.linspace(1, 0, fo)

    # Normalize
    peak = max(np.max(np.abs(L)), np.max(np.abs(R)))
    if peak > 0:
        L /= peak * 1.1; R /= peak * 1.1

    return L, R


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--duration", type=float, default=60.0)
    parser.add_argument("--bpm", type=int, default=128)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    print(f"Generating {args.duration}s background music at {args.bpm} BPM…")
    L, R = generate(args.duration, args.bpm)

    interleaved = np.empty(len(L) * 2, dtype=np.float32)
    interleaved[0::2] = L.astype(np.float32)
    interleaved[1::2] = R.astype(np.float32)

    with wave.open(args.output, "w") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes((interleaved * 32767).astype(np.int16).tobytes())

    print(f"Done → {args.output}")


if __name__ == "__main__":
    main()
