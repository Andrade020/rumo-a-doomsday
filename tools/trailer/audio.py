"""Trilha ORIGINAL, sintetizada do zero (numpy/scipy). Sem samples, sem músicas de terceiros.
Estilo: fanfarra heroica de trailer (metais, cordas em ostinato, taiko, caixa, címbalos), em crescendo por cena.
Cada seção começa exatamente num corte do vídeo (lê a mesma timeline.json do render).
A melodia é de composição própria; não reproduz nenhuma música existente.
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
N = int((DUR + 3.0) * SR)
rng = np.random.default_rng(20261218)
BPM = A['bpm']; B = 60.0 / BPM            # duração de uma batida
BAR = 4 * B

NOTE = {'C': 0, 'Db': 1, 'D': 2, 'Eb': 3, 'E': 4, 'F': 5, 'Gb': 6, 'F#': 6, 'G': 7, 'Ab': 8, 'A': 9, 'Bb': 10, 'B': 11}
def hz(name):
    """'D4' -> frequência. C4 = 261.63 Hz."""
    k = name[:-1]; o = int(name[-1])
    return 440.0 * 2 ** ((NOTE[k] - 9) / 12 + (o - 4))

def sos_filter(x, kind, cutoff, order=4):
    return signal.sosfilt(signal.butter(order, cutoff, btype=kind, fs=SR, output='sos'), x)

dry = np.zeros((2, N)); wet = np.zeros((2, N))
def place(sig, t, gain=1.0, pan=0.0, send=0.0, buf=None):
    i = int(t * SR)
    if i >= N or i < 0: return
    j = min(N, i + len(sig)); s = sig[: j - i] * gain
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    dry[0, i:j] += s * l; dry[1, i:j] += s * r
    if send > 0:
        wet[0, i:j] += s * l * send; wet[1, i:j] += s * r * send

# ------------------------------------------------------------------ vozes
def _saw(phase):
    return 2.0 * ((phase / (2 * np.pi)) % 1.0) - 1.0

def brass(note, dur, gain=0.2, pan=0.0, send=0.35, bright=1.0, vib=True):
    """Metal heroico: saws desafinadas + sub-oitava, filtro que abre no ataque, vibrato suave."""
    f = hz(note); n = int((dur + 0.3) * SR); ts = np.arange(n) / SR
    v = 1 + (0.0035 * np.sin(2 * np.pi * 5.3 * ts) * np.clip((ts - 0.22) / 0.3, 0, 1) if vib else 0)
    out = np.zeros(n)
    for cents, g in ((-11, 1), (-4, 1), (4, 1), (11, 1), (-1200, 0.55)):
        ph = np.cumsum(2 * np.pi * f * 2 ** (cents / 1200) * v) / SR
        out += g * _saw(ph + rng.uniform(0, 6.28))
    out /= 4.5
    cut = 650 + 4200 * bright * np.exp(-ts * 3.0) + 900 * bright
    blocks = 20; bl = n // blocks; y = np.zeros(n)
    for b in range(blocks):
        c = float(cut[min(n - 1, b * bl)])
        seg = out[b * bl:(b + 1) * bl] if b < blocks - 1 else out[b * bl:]
        y[b * bl: b * bl + len(seg)] = signal.sosfilt(signal.butter(2, min(c, 11000), btype='lowpass', fs=SR, output='sos'), seg)
    env = np.minimum(1, ts / 0.05) * np.clip((dur + 0.18 - ts) / 0.18, 0, 1)
    return y * env

def strings_stac(note, gain=0.12):
    f = hz(note); n = int(0.30 * SR); ts = np.arange(n) / SR
    out = np.zeros(n)
    for cents in (-8, 0, 8):
        out += _saw(np.cumsum(2 * np.pi * f * 2 ** (cents / 1200) * np.ones(n)) / SR + rng.uniform(0, 6.28))
    out = sos_filter(out / 3, 'lowpass', 3400, 2)
    return out * np.exp(-ts * 11) * np.minimum(1, ts / 0.004)

def bass_note(note, dur=0.4):
    f = hz(note); n = int(dur * SR); ts = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * ts) + 0.5 * np.sin(2 * np.pi * f * 2 * ts) + 0.25 * _saw(2 * np.pi * f * ts)
    return sos_filter(x, 'lowpass', 600, 2) * np.exp(-ts * 5.5) * np.minimum(1, ts / 0.004)

def taiko(gain=0.7, size=1.0):
    n = int(0.55 * SR); ts = np.arange(n) / SR
    f = 64 * size * (0.55 + 0.45 * np.exp(-ts * 11))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-ts * 6.5)
    skin = sos_filter(rng.standard_normal(n), 'lowpass', 1400, 2) * np.exp(-ts * 70) * 0.55
    return (x + skin) * gain

def snare(gain=0.5):
    n = int(0.30 * SR); ts = np.arange(n) / SR
    nz = sos_filter(sos_filter(rng.standard_normal(n), 'highpass', 1400, 2), 'lowpass', 9000, 2) * np.exp(-ts * 20)
    tone = np.sin(2 * np.pi * 185 * ts) * np.exp(-ts * 28) * 0.5
    return (nz + tone) * gain

def crash(dur=3.0, gain=0.5):
    n = int(dur * SR); ts = np.arange(n) / SR
    x = sos_filter(rng.standard_normal(n), 'highpass', 4200, 2) * np.exp(-ts * 1.5)
    return x * np.minimum(1, ts / 0.004) * gain

def hit_boom(t, gain=0.9):
    n = int(1.5 * SR); ts = np.arange(n) / SR
    f = 52 * (0.55 + 0.45 * np.exp(-ts * 9))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-ts * 4.2)
    place(x, t, gain * 0.8, 0, 0.2)
    place(crash(2.2, 0.28), t, gain, 0, 0.45)

def whoosh(t, dur=0.5, gain=0.2):
    n = int(dur * SR); ts = np.arange(n) / SR
    x = rng.standard_normal(n); out = np.zeros(n); blocks = 40; bl = n // blocks
    for b in range(blocks):
        c = 350 * (14 ** (b / blocks)); seg = x[b * bl:(b + 1) * bl]
        out[b * bl:(b + 1) * bl] = signal.sosfilt(signal.butter(2, [c, min(c * 1.9, 14000)], btype='bandpass', fs=SR, output='sos'), seg)
    place(out * np.sin(np.pi * np.clip(ts / dur, 0, 1)) ** 1.5, t, gain, 0, 0.5)

def click(t, gain=0.3, f=1900.0):
    n = int(0.09 * SR); ts = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * ts) * np.exp(-ts * 70) + 0.4 * np.sin(2 * np.pi * f * 2.01 * ts) * np.exp(-ts * 110)
    place(x, t, gain, 0, 0.4)

# ------------------------------------------------------------------ estrutura (cortes do vídeo)
sc = {s['id']: (s['t0'], s['t1']) for s in TL['scenes']}
T_INTRO, T_BUILD, T_A, T_B, T_C, T_D, T_FIN = (sc['abertura'], sc['pergunta'], sc['tempo'], sc['quem'], sc['destino'], sc['compartilhar'], sc['fim'])

def bar_times(sec):
    t0, t1 = sec; k = 0
    while t0 + k * BAR < t1 - 0.05:
        yield k, t0 + k * BAR, min(t1, t0 + (k + 1) * BAR); k += 1

CH = {  # acordes: (baixo, quinta, terça-oitava)
    'Dm': ('D2', 'A2', 'F4', 'A3'), 'Bb': ('Bb1', 'F2', 'D4', 'F3'), 'F': ('F2', 'C3', 'A3', 'C4'),
    'C': ('C2', 'G2', 'E4', 'G3'), 'D': ('D2', 'A2', 'F#4', 'A3'), 'Gm': ('G1', 'D2', 'Bb3', 'D3'),
}
def pad_chord(name, t0, dur, gain, send=0.4):
    root, fifth, third, mid = CH[name]
    for nt, pan in ((fifth, -0.3), (mid, 0.0), (third, 0.3)):
        place(brass(nt, dur, bright=0.35, vib=False), t0, gain, pan, send)

def sub(name, t0, dur, gain):
    f = hz(CH[name][0]); n = int((dur + 0.2) * SR); ts = np.arange(n) / SR
    x = (np.sin(2 * np.pi * f * ts) + 0.35 * np.sin(2 * np.pi * f * 2 * ts)) * np.minimum(1, ts / 0.08) * np.clip((dur + 0.15 - ts) / 0.15, 0, 1)
    place(x, t0, gain, 0, 0.05)

# melodias originais (beats, duração em beats, nota) — 4 compassos cada
M1 = [(0, 2, 'D4'), (2, 1, 'A4'), (3, 1, 'G4'), (4, 2, 'F4'), (6, 1, 'E4'), (7, 1, 'D4'),
      (8, 2, 'D4'), (10, 1, 'A4'), (11, 1, 'C5'), (12, 3, 'Bb4'), (15, 1, 'A4')]
M2 = [(0, 2, 'Bb3'), (2, 1, 'F4'), (3, 1, 'Bb4'), (4, 2, 'C5'), (6, 1, 'Bb4'), (7, 1, 'A4'),
      (8, 2, 'G4'), (10, 1, 'A4'), (11, 1, 'Bb4'), (12, 3, 'C5'), (15, 1, 'D5')]
M3 = [(0, 1, 'F4'), (1, 1, 'C5'), (2, 2, 'F5'), (4, 1, 'E5'), (5, 1, 'D5'), (6, 2, 'C5'),
      (8, 1, 'D5'), (9, 1, 'A4'), (10, 2, 'D5'), (12, 2, 'C5'), (14, 1, 'Bb4'), (15, 1, 'A4')]
M3b = [(0, 1, 'A4'), (1, 1, 'F5'), (2, 2, 'A5'), (4, 1, 'G5'), (5, 1, 'F5'), (6, 2, 'E5'),
       (8, 1, 'F5'), (9, 1, 'D5'), (10, 2, 'G5'), (12, 4, 'F5')]

def melody(mel, t0, gain, octave_double=True, bright=1.0, pan=0.0, send=0.4, cut_t=None):
    for (b, d, nt) in mel:
        t = t0 + b * B
        if cut_t is not None and t >= cut_t - 0.05: continue
        dd = d * B * 0.97
        if cut_t is not None: dd = min(dd, cut_t - t)
        place(brass(nt, dd, bright=bright), t, gain, pan, send)
        if octave_double:
            lo = nt[:-1] + str(int(nt[-1]) - 1)
            place(brass(lo, dd, bright=0.5 * bright, vib=False), t, gain * 0.55, pan, send)

def ostinato(sec, prog, gain0, gain1, density=2):
    """cordas staccato em colcheias (density=2) ou semicolcheias (4) sobre a progressão."""
    t0, t1 = sec
    for k, tb, te in bar_times(sec):
        ch = prog[k % len(prog)]; root, fifth = CH[ch][0], CH[ch][1]
        steps = 4 * density
        for s in range(steps):
            t = tb + s * (BAR / steps)
            if t >= t1 - 0.04: break
            nt = [root, fifth, root, fifth][s % 4]
            nt = nt[:-1] + str(int(nt[-1]) + 1)
            g = gain0 + (gain1 - gain0) * min(1, (t - t0) / max(1e-6, (t1 - t0)))
            acc = 1.25 if s % steps == 0 else (1.0 if s % 2 == 0 else 0.7)
            place(strings_stac(nt), t, g * acc, ((s % 4) - 1.5) * 0.25, 0.2)

def drums(sec, start_bar=0, kick='half', snare_on=True, ramp=(0.5, 0.8)):
    t0, t1 = sec
    for k, tb, te in bar_times(sec):
        if k < start_bar: continue
        g = ramp[0] + (ramp[1] - ramp[0]) * min(1, (tb - t0) / max(1e-6, (t1 - t0)))
        beats = [0, 2] if kick == 'half' else [0, 1, 2, 3]
        for bt in beats:
            t = tb + bt * B
            if t < t1 - 0.03: place(taiko(1.0, 1.0 if bt == 0 else 0.92), t, g * (1.0 if bt == 0 else 0.75), 0, 0.25)
        if snare_on:
            for bt in (1, 3):
                t = tb + bt * B
                if t < t1 - 0.03: place(snare(1.0), t, g * 0.55, 0.1, 0.3)

def timp_roll(t0, t1, g0, g1):
    step = B / 4; t = t0; i = 0
    while t < t1 - 0.02:
        g = g0 + (g1 - g0) * (t - t0) / max(1e-6, t1 - t0)
        place(taiko(1.0, 1.0 + 0.02 * (i % 2)), t, g, 0, 0.3); t += step; i += 1

# ------------------------------------------------------------------ projetor (abertura) e drone
ticks0, ticks1 = A['ticks']; tt = ticks0
while tt < ticks1:
    n = int(0.02 * SR); ts = np.arange(n) / SR
    x = sos_filter(sos_filter(rng.standard_normal(n) * np.exp(-ts * 380), 'highpass', 1800, 2), 'lowpass', 7000, 2)
    place(x, tt, 0.22 * np.clip((ticks1 - tt) / 1.6, 0, 1) * (0.7 + 0.3 * rng.random()), rng.uniform(-0.3, 0.3))
    tt += 0.125 + rng.uniform(-0.004, 0.004)

# abertura: drone grave em Ré + crescendo de tímpanos até o corte
sub('Dm', 0.0, T_BUILD[0] + 0.1, 0.17)
for nt in ('D3', 'A3'):
    place(brass(nt, T_BUILD[0] - 0.3, bright=0.25, vib=False), 0.4, 0.05, 0.0, 0.5)

# build (pergunta): metais graves crescendo + pulso de tímpano a cada batida, ritmo apertando
sub('Dm', T_BUILD[0], T_BUILD[1] - T_BUILD[0], 0.17)
pad_chord('Dm', T_BUILD[0], T_BUILD[1] - T_BUILD[0], 0.06)
t = T_BUILD[0] + 0.6; i = 0
while t < T_BUILD[1] - 0.05:
    prog = (t - T_BUILD[0]) / (T_BUILD[1] - T_BUILD[0])
    place(taiko(1.0, 0.9), t, 0.18 + 0.30 * prog, 0, 0.3)
    t += B * (2 if prog < 0.55 else 1)
timp_roll(T_BUILD[1] - 1.1, T_BUILD[1], 0.12, 0.5)

# A (linha do tempo): tema 1 nos metais, cordas em ostinato, taiko meia-nota
prog_A = ['Dm', 'Bb', 'F', 'C']
for k, tb, te in bar_times(T_A):
    ch = prog_A[k % 4]
    sub(ch, tb, te - tb, 0.15)
    pad_chord(ch, tb, te - tb, 0.05)
melody(M1, T_A[0], 0.17, octave_double=False, bright=0.8, cut_t=T_A[1])
if T_A[0] + 16 * B < T_A[1] - 0.2: melody(M1, T_A[0] + 16 * B, 0.2, True, 0.95, cut_t=T_A[1])
ostinato(T_A, prog_A, 0.06, 0.12, 2)
drums(T_A, start_bar=1, kick='half', snare_on=False, ramp=(0.35, 0.65))

# B (personagens): sobe de tom, mais brilho, caixa na contrabatida
prog_B = ['Bb', 'C', 'Dm', 'Bb']
for k, tb, te in bar_times(T_B):
    ch = prog_B[k % 4]
    sub(ch, tb, te - tb, 0.16); pad_chord(ch, tb, te - tb, 0.06)
melody(M2, T_B[0], 0.21, True, 1.0, cut_t=T_B[1])
if T_B[0] + 16 * B < T_B[1] - 0.2: melody(M2, T_B[0] + 16 * B, 0.23, True, 1.1, cut_t=T_B[1])
ostinato(T_B, prog_B, 0.08, 0.14, 2)
drums(T_B, start_bar=0, kick='half', snare_on=True, ramp=(0.5, 0.78))

# C (destino): ápice — tema completo, taiko a cada batida, semicolcheias nas cordas
prog_C = ['F', 'C', 'Dm', 'Bb']
for k, tb, te in bar_times(T_C):
    ch = prog_C[k % 4]
    sub(ch, tb, te - tb, 0.18); pad_chord(ch, tb, te - tb, 0.075)
melody(M3, T_C[0], 0.25, True, 1.15, cut_t=T_C[1])
melody(M3b, T_C[0] + 16 * B, 0.27, True, 1.25, cut_t=T_C[1])
ostinato(T_C, prog_C, 0.10, 0.17, 4)
drums(T_C, start_bar=0, kick='all', snare_on=True, ramp=(0.62, 0.9))

# D (compartilhar): tensão — pedal de Ré, cordas aceleradas, rufar de caixa em crescendo
prog_D = ['Dm', 'Dm', 'Bb', 'Dm']
for k, tb, te in bar_times(T_D):
    sub('Dm', tb, te - tb, 0.18); pad_chord(prog_D[k % 4], tb, te - tb, 0.07)
ostinato(T_D, prog_D, 0.09, 0.17, 4)
drums(T_D, start_bar=0, kick='half', snare_on=False, ramp=(0.5, 0.7))
t = T_D[0] + 1.0
while t < T_D[1] - 0.05:
    prog = (t - T_D[0]) / (T_D[1] - T_D[0]); place(snare(1.0), t, 0.18 + 0.4 * prog, 0.1, 0.3)
    t += B / 2 if prog < 0.5 else B / 4

# riser (reaproveita o do timeline) — ruído com banda varrendo + tom
r0, r1 = A['riser']; n = int((r1 - r0) * SR); ts = np.arange(n) / SR; u = ts / (r1 - r0)
nz = rng.standard_normal(n); out = np.zeros(n); blocks = 90; bl = n // blocks
for b in range(blocks):
    c = 300 * (22 ** (b / blocks)); seg = nz[b * bl:(b + 1) * bl]
    out[b * bl:(b + 1) * bl] = signal.sosfilt(signal.butter(2, [c, min(c * 1.6, 18000)], btype='bandpass', fs=SR, output='sos'), seg)
tone = np.sin(2 * np.pi * np.cumsum(hz('D3') * (2 ** (2 * u))) / SR) * 0.5
place((out + tone) * (u ** 2.2), r0, 0.30, 0, 0.3)

# FINAL: fanfarra em Ré maior
tf = T_FIN[0]
hit_boom(tf, 1.0)
for nt, pan, g in (('D3', -0.4, 0.34), ('A3', -0.2, 0.30), ('D4', 0.0, 0.30), ('F#4', 0.2, 0.28), ('A4', 0.4, 0.28)):
    place(brass(nt, 3.2, bright=1.3), tf, g, pan, 0.45)
sub('D', tf, 3.4, 0.22)
tag = [(0.0, 0.5, 'D5'), (0.5, 0.5, 'A5'), (1.0, 0.5, 'D6'), (1.5, 2.2, 'F#6')]
for off, d, nt in tag:
    place(brass(nt, d, bright=1.4), tf + 0.9 + off, 0.16, 0.0, 0.5)
for j, bt in enumerate((0, 1, 2, 3)):
    place(taiko(1.0, 1.0), tf + 0.9 + bt * B * 0.5, 0.65, 0, 0.3)
place(taiko(1.0, 0.9), tf + 2.7, 0.7, 0, 0.3)
place(crash(3.5, 0.38), tf + 0.9, 1.0, 0.1, 0.5)
# brilho: arpejo agudo
for j, nt in enumerate(('D5', 'F#5', 'A5', 'D6', 'F#6', 'A5')):
    tt = tf + 2.1 + j * 0.24
    ts = np.arange(int(1.2 * SR)) / SR; f = hz(nt)
    x = np.sin(2 * np.pi * f * ts) * np.exp(-ts * 2.8) + 0.3 * np.sin(2 * np.pi * f * 2 * ts) * np.exp(-ts * 4.2)
    place(x, tt, 0.05, -0.5 + 0.2 * j, 0.5)

# ------------------------------------------------------------------ cortes, UI e cenas
for i, t in enumerate(A['booms']):
    if abs(t - tf) < 0.01: continue
    hit_boom(t, 0.55 if i == 0 else 0.8)
for t in A['whoosh']: whoosh(t)
for t in A['clicks']: click(t, 0.30)
for i, t in enumerate(A['hovers']): click(t, 0.10, 900 + 120 * (i % 5))

# ------------------------------------------------------------------ reverb, mix, fade
def reverb_ir(seconds=2.4):
    n = int(seconds * SR); t = np.arange(n) / SR; out = []
    for _ in range(2):
        x = rng.standard_normal(n) * np.exp(-t * 2.7); out.append(sos_filter(x, 'lowpass', 4600, 2))
    ir = np.stack(out); ir[:, :int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))
    return ir / np.sqrt(np.sum(ir ** 2))
ir = reverb_ir()
rv = np.stack([signal.fftconvolve(wet[c], ir[c])[:N] for c in range(2)])
mix = dry + rv * 0.9
mix = np.stack([sos_filter(mix[c], 'highpass', 28, 2) for c in range(2)])
f0, f1 = A['fadeOut']; i0, i1 = int(f0 * SR), int(f1 * SR)
fade = np.ones(N); fade[i0:i1] = np.linspace(1, 0, i1 - i0) ** 1.5; fade[i1:] = 0
mix = (mix * fade)[:, : int(DUR * SR)]
# arco dinâmico: começa baixa e tensa, cresce a cada cena e atinge o ápice no final
ARCO = [(0.0, 0.36), (T_INTRO[1], 0.44), (T_BUILD[1] - 0.2, 0.55), (T_A[0] + 0.5, 0.58), (T_A[1] - 0.2, 0.72),
        (T_B[0] + 0.3, 0.80), (T_B[1] - 0.2, 0.92), (T_C[0] + 0.3, 1.0), (T_C[1] - 0.2, 1.0),
        (T_D[0] + 0.3, 0.9), (T_D[1] - 0.1, 1.12), (T_FIN[0], 1.35), (T_FIN[0] + 4.0, 1.25), (DUR, 1.0)]
tt_ = np.arange(mix.shape[1]) / SR
mix = mix * np.interp(tt_, [a for a, _ in ARCO], [g for _, g in ARCO])
mix = np.tanh(mix * 1.1) / np.tanh(1.1)               # limitador suave
mix /= max(1e-9, np.max(np.abs(mix))) / 0.9            # o loudnorm (ffmpeg) faz o ajuste final
wavfile.write(sys.argv[1], SR, (mix.T * 32767).astype(np.int16))
print('áudio sintetizado:', sys.argv[1], f'{mix.shape[1] / SR:.2f}s', f'| {BPM:.1f} bpm')
