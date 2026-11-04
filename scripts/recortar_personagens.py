# Recorta o fundo das imagens de personagens -> public/img/charcut/<id>.png
# (se a imagem já tem transparência, só corta as bordas). Modelo geral, serve p/ não-humanos (Groot, Rocket...).
import glob, os, sys
from PIL import Image
from rembg import remove, new_session
sess = new_session('isnet-general-use')
only = set(sys.argv[1:]); os.makedirs('public/img/charcut', exist_ok=True)
for f in sorted(glob.glob('public/img/char/*.png')):
    cid = os.path.basename(f)[:-4]; out = f'public/img/charcut/{cid}.png'
    if (only and cid not in only) or (not only and os.path.exists(out)): continue
    im = Image.open(f).convert('RGBA')
    a = im.getchannel('A'); transp = sum(1 for p in a.resize((64, 64)).getdata() if p < 10) / 4096
    cut = im if transp > 0.15 else remove(im, session=sess)
    bb = cut.getchannel('A').point(lambda x: 255 if x > 20 else 0).getbbox()
    if bb: cut = cut.crop(bb)
    cut.save(out, optimize=True)
    print('ok', cid, 'ja-transparente' if transp > 0.15 else 'rembg', cut.size, flush=True)
