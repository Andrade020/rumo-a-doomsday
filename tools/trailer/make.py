"""Gera o vídeo promocional do site. Um comando:  python tools/trailer/make.py

Etapas: valida a timeline -> build do site -> render determinístico (Playwright -> ffmpeg) ->
áudio sintetizado -> loudnorm em duas passadas -> versões final (master) e leve em dist/trailer/.
"""
import json, os, re, shutil, subprocess, sys, time, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
TMP = os.path.join(HERE, '_tmp')
OUT = os.path.join(ROOT, 'dist', 'trailer')
TL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))
PORT = TL['base'].split(':')[-1].strip('/')

def ffmpeg_path():
    exe = shutil.which('ffmpeg')
    if exe: return exe
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()
FF = ffmpeg_path()

def run(cmd, **kw):
    print('›', ' '.join(map(str, cmd))[:160])
    return subprocess.run(cmd, check=True, **kw)

# ---------------------------------------------------------------- 0) legibilidade dos textos
def check_reading():
    items = [(x['text'], x['t1'] - x['t0']) for x in TL['texts']]
    ec = TL['endcard']
    items += [(ec['titleText'], ec['out'] - ec['titleIn']), (ec['subText'], ec['out'] - ec['subIn'])]
    ok = True
    for text, dur in items:
        need = len(text.split()) * 0.35 + 1.0   # 0,35 s por palavra + pausa
        flag = 'ok ' if dur >= need else 'CURTO'
        if dur < need: ok = False
        print(f'  [{flag}] {dur:4.1f}s (mín. {need:4.1f}s)  {text}')
    if not ok: sys.exit('Há textos curtos demais. Aumente a duração ou corte palavras.')

# ---------------------------------------------------------------- áudio
def measure(path):
    r = subprocess.run([FF, '-hide_banner', '-nostats', '-i', path, '-vn', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True)
    m = re.search(r'\{[^{}]*"input_i"[^{}]*\}', r.stderr, re.S)
    return json.loads(m.group(0))

def normalize(src, dst):
    m = measure(src)
    flt = (f"loudnorm=I=-14:TP=-2.6:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
           f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true:print_format=summary")
    run([FF, '-y', '-loglevel', 'error', '-i', src, '-af', flt, '-ar', '48000', '-c:a', 'pcm_s16le', dst])

def duration(path):
    r = subprocess.run([FF, '-hide_banner', '-i', path], capture_output=True, text=True)
    m = re.search(r'Duration: (\d+):(\d+):([\d.]+)', r.stderr)
    return int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3])

def wait_server(url, tries=60):
    for _ in range(tries):
        try: urllib.request.urlopen(url, timeout=2); return
        except Exception: time.sleep(0.5)
    sys.exit('servidor de preview não subiu')

def main():
    print('Legibilidade dos textos:'); check_reading()
    shutil.rmtree(TMP, ignore_errors=True); os.makedirs(TMP)

    print('\nBuild do site...')
    run('npm run build', cwd=ROOT, shell=True)
    os.makedirs(OUT, exist_ok=True)

    print('\nServidor de preview...')
    srv = subprocess.Popen(f'npx vite preview --port {PORT} --strictPort', cwd=ROOT, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        wait_server(TL['base'])
        env = dict(os.environ, FFMPEG=FF, TRAILER_URL=TL['base'])
        print('\nRenderizando quadros (determinístico)...')
        run(['node', 'render.mjs', os.path.join(TMP, 'video.mp4')], cwd=HERE, env=env)
    finally:
        subprocess.run(['taskkill', '/F', '/T', '/PID', str(srv.pid)], capture_output=True)

    print('\nSintetizando áudio...')
    run([sys.executable, os.path.join(HERE, 'audio.py'), os.path.join(TMP, 'audio_raw.wav')])
    normalize(os.path.join(TMP, 'audio_raw.wav'), os.path.join(TMP, 'audio.wav'))

    color = ['-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709']
    base = [FF, '-y', '-loglevel', 'error', '-i', os.path.join(TMP, 'video.mp4'), '-i', os.path.join(TMP, 'audio.wav'),
            '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', str(TL['fps']), *color,
            '-c:a', 'aac', '-movflags', '+faststart', '-t', str(TL['duration'])]
    master = os.path.join(OUT, 'trailer_master.mp4'); leve = os.path.join(OUT, 'trailer_leve.mp4')
    run(base + ['-crf', '16', '-preset', 'slow', '-b:a', '256k', master])
    run(base + ['-crf', '24', '-preset', 'slow', '-maxrate', '4M', '-bufsize', '8M', '-b:a', '160k', leve])

    print('\nMedições (feitas por análise, não por audição):')
    for p in (master, leve):
        m = measure(p)
        print(f"  {os.path.basename(p):20s} duração {duration(p):.2f}s | {os.path.getsize(p) / 1e6:.1f} MB | "
              f"loudness integrado {float(m['input_i']):.1f} LUFS | pico real {float(m['input_tp']):.2f} dBTP")
    shutil.rmtree(TMP, ignore_errors=True)
    print('\nPronto:', OUT)

if __name__ == '__main__':
    main()
