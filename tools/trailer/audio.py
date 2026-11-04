"""Trilha original, sintetizada do zero (numpy/scipy). Sem samples, sem músicas de terceiros.
Lê a MESMA timeline.json do render, então cada impacto, clique e riser cai no quadro certo.
Uso: python audio.py <saida.wav>
"""
import json, os, sys
import numpy as np
from scipy import signal
from scipy.io import wavfile

HERE = os.path.dirname(os.path.abspath(__file__))
TL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))
A = TL['audio']
SR = 48000
DUR = TL['duration']
N = int((DUR + 2.0) * SR)
rng = np.random.default_rng(20261218)

NOTE = {'C': 0, 'Db': 1, 'D': 2, 'Eb': 3, 'E': 4, 'F': 5, 'Gb': 6, 'G': 7, 'Ab': 8, 'A': 9, 'Bb': 10, 'B': 11}
def hz(name, octave):  # C4 = 261.63
    return 440.0 * 2 ** ((NOTE[name] - 9) / 12 + (octave - 4))

def sos_filter(x, kind, cutoff, order=4):
    sos = signal.butter(order, cutoff, btype=kind, fs=SR, output='sos')
    return signal.sosfilt(sos, x)

def place(buf, sig, t, gain=1.0, pan=0.0):
    """soma `sig` (mono) em buf (2,N) no instante t, com pan (-1..1)."""
    i = int(t * SR)
    if i >= N: return
    j = min(N, i + len(sig)); s = sig[: j - i] * gain
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    buf[0, i:j] += s * l; buf[1, i:j] += s * r

def env(n, a, d, s, r_, sustain_len=None):
    """ADSR simples em n amostras."""
    e = np.zeros(n)
    na, nd, nr = int(a * SR), int(d * SR), int(r_ * SR)
    ns = n - na - nd - nr if sustain_len is None else int(sustain_len * SR)
    ns = max(0, ns)
    seg = [np.linspace(0, 1, max(1, na)), np.linspace(1, s, max(1, nd)), np.full(ns, s), np.linspace(s, 0, max(1, nr))]
    c = np.concatenate(seg)[:n]; e[: len(c)] = c
    return e

def saw_stack(f, n, detunes=(-9, -3, 3, 9), phase_seed=0):
    t = np.arange(n) / SR
    out = np.zeros(n)
    r = np.random.default_rng(phase_seed)
    for d in detunes:
        ff = f * 2 ** (d / 1200)
        out += signal.sawtooth(2 * np.pi * ff * t + r.uniform(0, 6.28))
    return out / len(detunes)

def reverb_ir(seconds=2.6, hf=0.55):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    out = []
    for _ in range(2):
        x = rng.standard_normal(n) * np.exp(-t * 2.6)
        x = sos_filter(x, 'lowpass', 5200 * hf + 1500, 2)
        out.append(x)
    ir = np.stack(out); ir[:, :int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))
    return ir / np.sqrt(np.sum(ir ** 2))

dry = np.zeros((2, N)); wet = np.zeros((2, N))   # wet = envio para reverb

chords = A['chords']
def chord_notes(c):
    r = c['root']; q = c['q']
    third = 3 if q == 'min' else 4
    base = NOTE[r]
    names = {v: k for k, v in NOTE.items()}
    def nm(semi): return names[(base + semi) % 12], (base + semi) // 12
    return [nm(0), nm(7), nm(12 + third), nm(12 + 7)]
def chord_end(i): return chords[i + 1]['t'] if i + 1 < len(chords) else DUR + 1.0

# ---------------------------------------------------------------- drone/sub + pad
for i, c in enumerate(chords):
    t0, t1 = c['t'], chord_end(i)
    n = int((t1 - t0 + 1.6) * SR)
    root = hz(c['root'], 1)
    g_in = 1.2 if t0 > 0 else 3.0
    # sub
    ts = np.arange(n) / SR
    sub = np.sin(2 * np.pi * root * ts) + 0.4 * np.sin(2 * np.pi * root * 2 * ts)
    e = np.minimum(1, ts / g_in) * np.minimum(1, (n / SR - ts) / 1.2)
    place(dry, sub * e, t0, 0.16)
    # pad (notas do acorde, sawtooth detunada, filtro suave)
    for k, (nn, octv) in enumerate(chord_notes(c)):
        f = hz(nn, 3 + (1 if k >= 2 else 0))
        x = saw_stack(f, n, phase_seed=i * 10 + k)
        x = sos_filter(x, 'lowpass', 1100 + 500 * (i / max(1, len(chords))), 2)
        e = np.minimum(1, ts / g_in) * np.minimum(1, (n / SR - ts) / 1.4)
        pan = (-0.5 + k * 0.33)
        place(dry, x * e, t0, 0.055, pan); place(wet, x * e, t0, 0.07, pan)

# ---------------------------------------------------------------- arpejo (pluck) a partir da cena "tempo"
beat = 60.0 / A['bpm']; step = beat / 2
t_arp0, t_arp1 = TL['scenes'][2]['t0'], A['final'] - 0.1
pattern = [0, 1, 2, 3, 2, 1, 2, 3]
k = 0; tt = t_arp0
while tt < t_arp1:
    ci = max(j for j, c in enumerate(chords) if c['t'] <= tt)
    nn, octv = chord_notes(chords[ci])[pattern[k % len(pattern)]]
    f = hz(nn, 4 + (1 if pattern[k % len(pattern)] >= 2 else 0))
    n = int(0.55 * SR); ts = np.arange(n) / SR
    x = saw_stack(f, n, (-6, 0, 6), phase_seed=k)
    x = sos_filter(x, 'lowpass', 2600, 2) * np.exp(-ts * 5.0)
    prog = np.clip((tt - t_arp0) / 25.0, 0, 1)
    gain = 0.05 + 0.05 * prog
    pan = -0.4 + 0.8 * ((k % 8) / 7)
    place(dry, x, tt, gain, pan); place(wet, x, tt, gain * 1.6, pan)
    k += 1; tt += step

# ---------------------------------------------------------------- tiques de projetor e pulso
t_end_ticks = A['ticks'][1]
tt = A['ticks'][0]; k = 0
while tt < t_end_ticks:
    n = int(0.02 * SR); ts = np.arange(n) / SR
    x = rng.standard_normal(n) * np.exp(-ts * 380)
    x = sos_filter(x, 'bandpass', [1800, 7000], 2) if False else sos_filter(sos_filter(x, 'highpass', 1800, 2), 'lowpass', 7000, 2)
    fadeout = np.clip((t_end_ticks - tt) / 1.6, 0, 1)
    place(dry, x, tt, 0.22 * fadeout * (0.7 + 0.3 * rng.random()), rng.uniform(-0.3, 0.3))
    tt += 0.125 + rng.uniform(-0.004, 0.004); k += 1

def thud(t, gain=0.6, f0=62.0, dur=0.55):
    n = int(dur * SR); ts = np.arange(n) / SR
    f = f0 * (0.55 + 0.45 * np.exp(-ts * 9))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-ts * 5.5)
    cl = rng.standard_normal(n) * np.exp(-ts * 60); cl = sos_filter(cl, 'lowpass', 900, 2) * 0.35
    place(dry, x + cl, t, gain)
    place(wet, x * 0.5, t, gain * 0.4)

p0, p1 = A['pulse']; tt = p0
while tt < p1:
    thud(tt, 0.26, 55.0, 0.4); tt += 60.0 / 45.0   # pulso grave que anuncia o corte

# ---------------------------------------------------------------- impactos, whooshes, cliques
def boom(t, gain=0.9):
    thud(t, gain, 52.0, 1.4)
    n = int(1.8 * SR); ts = np.arange(n) / SR
    x = rng.standard_normal(n) * np.exp(-ts * 3.2); x = sos_filter(x, 'lowpass', 2600, 2)
    place(wet, x, t, gain * 0.16, 0.0); place(dry, x, t, gain * 0.05)

def brass_hit(t, c, gain=0.5, length=2.4):
    n = int(length * SR); ts = np.arange(n) / SR
    for kk, (nn, octv) in enumerate(chord_notes(c)):
        f = hz(nn, 3 + (1 if kk >= 2 else 0))
        x = saw_stack(f, n, (-14, -5, 5, 14), kk)
        cut = 500 + 3300 * np.exp(-ts * 3.2)
        # filtro com corte variável por blocos
        out = np.zeros(n)
        blocks = 24; bl = n // blocks
        for b in range(blocks):
            cb = float(cut[min(n - 1, b * bl)])
            seg = x[b * bl:(b + 1) * bl] if b < blocks - 1 else x[b * bl:]
            sos = signal.butter(2, min(cb, 9000), btype='lowpass', fs=SR, output='sos')
            out[b * bl: b * bl + len(seg)] = signal.sosfilt(sos, seg)
        e = np.minimum(1, ts / 0.025) * np.exp(-ts * 1.7)
        place(dry, out * e, t, gain * 0.22, -0.4 + kk * 0.27); place(wet, out * e, t, gain * 0.3, -0.4 + kk * 0.27)

def whoosh(t, dur=0.5, gain=0.25):
    n = int(dur * SR); ts = np.arange(n) / SR
    x = rng.standard_normal(n)
    out = np.zeros(n); blocks = 40; bl = n // blocks
    for b in range(blocks):
        c = 350 * (14 ** (b / blocks)); seg = x[b * bl:(b + 1) * bl]
        sos = signal.butter(2, [c, min(c * 1.9, 14000)], btype='bandpass', fs=SR, output='sos')
        out[b * bl:(b + 1) * bl] = signal.sosfilt(sos, seg)
    e = np.sin(np.pi * np.clip(ts / dur, 0, 1)) ** 1.5
    place(dry, out * e, t, gain, 0.0); place(wet, out * e, t, gain * 0.6)

def click(t, gain=0.3, f=1900.0):
    n = int(0.09 * SR); ts = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * ts) * np.exp(-ts * 70) + 0.4 * np.sin(2 * np.pi * f * 2.01 * ts) * np.exp(-ts * 110)
    place(dry, x, t, gain, 0.0); place(wet, x, t, gain * 0.5)

for i, t in enumerate(A['booms']):
    g = 0.55 if i == 0 else 0.8
    boom(t, g)
    ci = max(j for j, c in enumerate(chords) if c['t'] <= t + 0.01)
    if i >= 2: brass_hit(t, chords[ci], 0.38 + 0.04 * i, 2.2)
for t in A['whoosh']: whoosh(t)
for t in A['clicks']: click(t, 0.34)
for i, t in enumerate(A['hovers']): click(t, 0.12, 900 + 120 * (i % 5))

# ---------------------------------------------------------------- riser e final
r0, r1 = A['riser']; n = int((r1 - r0) * SR); ts = np.arange(n) / SR; u = ts / (r1 - r0)
x = rng.standard_normal(n); out = np.zeros(n); blocks = 90; bl = n // blocks
for b in range(blocks):
    c = 300 * (22 ** (b / blocks)); seg = x[b * bl:(b + 1) * bl]
    sos = signal.butter(2, [c, min(c * 1.6, 18000)], btype='bandpass', fs=SR, output='sos')
    out[b * bl:(b + 1) * bl] = signal.sosfilt(sos, seg)
tone = np.sin(2 * np.pi * np.cumsum(hz('D', 3) * (2 ** (2 * u))) / SR) * 0.5
sw = (out * 1.0 + tone) * (u ** 2.2) * np.minimum(1, (1 - u) / 0.01 + 0.0001)
place(dry, sw, r0, 0.34); place(wet, sw, r0, 0.28)

tf = A['final']
boom(tf, 1.0)
fin = chords[-1]
brass_hit(tf, fin, 0.95, 3.6)
n = int(2.6 * SR); ts = np.arange(n) / SR
sh = rng.standard_normal(n) * np.exp(-ts * 1.7); sh = sos_filter(sh, 'highpass', 5200, 2)
place(dry, sh, tf, 0.07); place(wet, sh, tf, 0.1)
# brilho do acorde final: arpejo agudo suave
for j, (nn, octv) in enumerate(chord_notes(fin) + chord_notes(fin)):
    tt = tf + 0.35 + j * 0.28
    f = hz(nn, 5)
    n = int(1.2 * SR); ts = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * ts) * np.exp(-ts * 2.8) + 0.3 * np.sin(2 * np.pi * f * 2 * ts) * np.exp(-ts * 4.2)
    place(dry, x, tt, 0.05, -0.5 + 0.14 * j); place(wet, x, tt, 0.09, -0.5 + 0.14 * j)

# ---------------------------------------------------------------- reverb, mix, fade
ir = reverb_ir()
rv = np.stack([signal.fftconvolve(wet[c], ir[c])[:N] for c in range(2)])
mix = dry + rv * 0.85
mix = np.stack([sos_filter(mix[c], 'highpass', 28, 2) for c in range(2)])
f0, f1 = A['fadeOut']; i0, i1 = int(f0 * SR), int(f1 * SR)
fade = np.ones(N); fade[i0:i1] = np.linspace(1, 0, i1 - i0) ** 1.5; fade[i1:] = 0
mix *= fade
mix = mix[:, : int(DUR * SR)]
mix = np.tanh(mix * 1.15) / np.tanh(1.15)          # saturação leve (limitador suave)
mix /= max(1e-9, np.max(np.abs(mix))) / 0.9         # o loudnorm (ffmpeg) faz o ajuste final
wavfile.write(sys.argv[1], SR, (mix.T * 32767).astype(np.int16))
print('áudio sintetizado:', sys.argv[1], f'{mix.shape[1] / SR:.2f}s')
