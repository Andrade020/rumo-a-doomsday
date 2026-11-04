# Baixa as imagens de personagens (MCU Wiki) usando curl com cabeçalhos de navegador (uso pessoal, autorizado pelo usuário).
import json, os, io, time, subprocess, sys
from PIL import Image
res = json.load(open('scripts/personagens-achados.json', encoding='utf-8'))
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
os.makedirs('public/img/char', exist_ok=True)
only = set(sys.argv[1:]); falhas = []
for cid, v in res.items():
    out = f'public/img/char/{cid}.png'
    if (only and cid not in only) or (not only and os.path.exists(out)): continue
    ref = 'https://marvelcinematicuniverse.fandom.com/' if v['fonte'] == 'MCU Wiki' else 'https://marvel.fandom.com/'
    data = None
    for t in range(3):
        r = subprocess.run(['curl', '-s', '-m', '40', '-A', UA, '-e', ref, v['url'].split('?')[0]], capture_output=True)
        try:
            im = Image.open(io.BytesIO(r.stdout)); im.load(); data = im; break
        except Exception:
            time.sleep(4 * (t + 1))
    if data is None: falhas.append(cid); print('FALHA', cid, flush=True); continue
    im = data.convert('RGBA'); im.thumbnail((1000, 1300)); im.save(out, optimize=True)
    print('ok', cid, im.size, flush=True)
    time.sleep(1.2)
print('falhas:', falhas)
