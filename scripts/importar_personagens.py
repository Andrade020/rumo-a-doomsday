# Importa imagens de personagens baixadas manualmente: reconhece pelo nome do arquivo,
# converte para PNG em public/img/char/<id>.png e gera recorte em public/img/charcut/<id>.png
# Uso: python scripts/importar_personagens.py "C:\caminho\da\pasta" [--sem-recorte]
import sys, os, re, json, glob
from PIL import Image
stems = json.load(open('scripts/stems.json', encoding='utf-8'))
norm = lambda s: re.sub(r'\s*\(\d+\)$', '', os.path.splitext(s)[0]).lower().replace(' ', '_')
por_stem = {}
for cid, st in stems.items(): por_stem.setdefault(norm(st), []).append(cid)
pasta = next((a for a in sys.argv[1:] if not a.startswith('--')), os.path.expanduser('~/Downloads'))
recorte = '--sem-recorte' not in sys.argv
os.makedirs('public/img/char', exist_ok=True); os.makedirs('public/img/charcut', exist_ok=True)
sess = None
feitos = set()
for f in sorted(glob.glob(os.path.join(pasta, '*'))):
    ids = por_stem.get(norm(os.path.basename(f)))
    if not ids: continue
    try: im = Image.open(f).convert('RGBA')
    except Exception as e: print('ignorado', f, e); continue
    im.thumbnail((1000, 1300))
    for cid in ids:
        im.save(f'public/img/char/{cid}.png', optimize=True); feitos.add(cid)
        if recorte:
            if sess is None:
                from rembg import new_session; sess = new_session('u2net_human_seg')
            from rembg import remove
            cut = remove(im, session=sess)
            bb = cut.getchannel('A').point(lambda a: 255 if a > 20 else 0).getbbox()
            if bb: cut = cut.crop(bb)
            cut.save(f'public/img/charcut/{cid}.png', optimize=True)
        print('ok', cid, os.path.basename(f), flush=True)
falt = [c for c in stems if c not in feitos and not os.path.exists(f'public/img/char/{c}.png')]
print(f'\nImportados agora: {len(feitos)} | Ainda sem imagem: {len(falt)}')
