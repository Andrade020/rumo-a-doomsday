# Remove o fundo das fotos (rembg) -> public/img/cut/<id>.png, recortado ao sujeito.
import sys, glob, os
from PIL import Image
from rembg import remove, new_session
sess = new_session('u2net_human_seg')
only = sys.argv[1:]
for f in sorted(glob.glob('public/img/*.jpg')):
    cid = os.path.basename(f)[:-4]
    out = f'public/img/cut/{cid}.png'
    if only and cid not in only: continue
    if os.path.exists(out) and not only: continue
    img = Image.open(f).convert('RGB')
    img.thumbnail((900, 1300))
    cut = remove(img, session=sess)
    bbox = cut.getchannel('A').point(lambda a: 255 if a > 20 else 0).getbbox()
    if bbox: cut = cut.crop(bbox)
    cut.save(out, optimize=True)
    print('ok', cid, cut.size, flush=True)
