# Otimiza as imagens para a web.
# - Originais pesados ficam em arquivo-original/ (fora do site, não são publicados).
# - public/img/char/<id>.webp   arte do personagem (≤ 800x1100)
# - public/img/cut/<id>.webp    recorte do ator, com transparência (≤ 700 px)
# - public/img/<id>.jpg         foto do ator (≤ 700 px)
# Só gera para personagens visíveis no site (confirmado / reportado / rumor).
# Uso (na raiz do projeto): python scripts/otimizar_imagens.py
import glob, json, os, shutil, subprocess
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
ORIG = 'arquivo-original'
chars = json.loads(subprocess.check_output(['node', '-e',
    "import('./src/data/characters.js').then(m=>console.log(JSON.stringify(m.characters.map(c=>({id:c.id,status:c.status})))))"]))
visiveis = [c['id'] for c in chars if c['status'] != 'sem-info']

def guardar(src_glob, destino):
    os.makedirs(destino, exist_ok=True)
    for f in glob.glob(src_glob):
        d = os.path.join(destino, os.path.basename(f))
        if not os.path.exists(d):
            shutil.copy2(f, d)

# 1) guarda os originais (copia, só se ainda não houver cópia)
guardar('public/img/char/*.png', f'{ORIG}/char')
guardar('public/img/cut/*.png', f'{ORIG}/cut')
guardar('public/img/*.jpg', f'{ORIG}/atores')

# 2) limpa as pastas públicas dos formatos pesados
for f in glob.glob('public/img/char/*.png') + glob.glob('public/img/cut/*.png') + glob.glob('public/img/*.jpg'):
    os.remove(f)
for f in glob.glob('public/img/char/*.webp') + glob.glob('public/img/cut/*.webp'):
    os.remove(f)
os.makedirs('public/img/char', exist_ok=True); os.makedirs('public/img/cut', exist_ok=True)

def fit(im, w, h):
    im = im.copy(); im.thumbnail((w, h), Image.LANCZOS); return im

n = {'char': 0, 'cut': 0, 'ator': 0}
for cid in visiveis:
    p = f'{ORIG}/char/{cid}.png'
    if os.path.exists(p):
        fit(Image.open(p).convert('RGB'), 800, 1100).save(f'public/img/char/{cid}.webp', 'WEBP', quality=82, method=6); n['char'] += 1
    p = f'{ORIG}/cut/{cid}.png'
    if os.path.exists(p):
        fit(Image.open(p).convert('RGBA'), 700, 900).save(f'public/img/cut/{cid}.webp', 'WEBP', quality=82, method=6); n['cut'] += 1
    p = f'{ORIG}/atores/{cid}.jpg'
    if os.path.exists(p):
        fit(Image.open(p).convert('RGB'), 700, 900).save(f'public/img/{cid}.jpg', 'JPEG', quality=82, optimize=True, progressive=True); n['ator'] += 1
print('gerados:', n, '| visíveis:', len(visiveis))
