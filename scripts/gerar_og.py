# Gera as imagens de pré-visualização para compartilhamento (Open Graph), 1200x630, em public/og/.
# Uso (na raiz do projeto): python scripts/gerar_og.py
import json, os, subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
os.makedirs('public/og', exist_ok=True)
W, H = 1200, 630
BG = (6, 9, 10); GREEN = (61, 220, 106); MUTED = (150, 165, 157); WHITE = (232, 238, 234)
FD = 'C:/Windows/Fonts/'
def font(name, size): return ImageFont.truetype(FD + name, size)
SERIF_B = lambda s: font('georgiab.ttf', s)
SERIF = lambda s: font('georgia.ttf', s)
SANS = lambda s: font('segoeui.ttf', s)

chars = json.loads(subprocess.check_output(['node', '-e',
    "import('./src/data/characters.js').then(m=>console.log(JSON.stringify(m.characters.map(c=>({id:c.id,heroi:c.heroi,ator:c.ator,status:c.status,cor:c.cor})))))"]))
STATUS = {'confirmado': 'CONFIRMADO EM DOOMSDAY', 'reportado': 'REPORTADO PARA DOOMSDAY', 'rumor': 'RUMOR PARA DOOMSDAY'}

def base():
    im = Image.new('RGB', (W, H), BG)
    glow = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(glow)
    d.ellipse((-200, 380, 700, 900), fill=(14, 60, 32))
    glow = glow.filter(ImageFilter.GaussianBlur(120))
    return Image.blend(im, glow, 0.9)

def cover(img, w, h, anchor=0.15, ax=0.5):
    img = img.convert('RGB'); r = max(w / img.width, h / img.height)
    img = img.resize((int(img.width * r) + 1, int(img.height * r) + 1), Image.LANCZOS)
    x = int((img.width - w) * ax); y = int((img.height - h) * anchor)
    return img.crop((x, y, x + w, y + h))

def art_right(im, art, x0=560, anchor=0.12, fade=260, ax=0.5):
    w = W - x0
    a = cover(art, w, H, anchor, ax)
    mask = Image.new('L', (w, H), 255)
    md = ImageDraw.Draw(mask)
    for i in range(fade):
        md.line([(i, 0), (i, H)], fill=int(255 * i / fade))
    im.paste(a, (x0, 0), mask)
    # leve escurecimento embaixo
    shade = Image.new('L', (W, H), 0); sd = ImageDraw.Draw(shade)
    for y in range(H - 160, H): sd.line([(0, y), (W, y)], fill=int(150 * (y - (H - 160)) / 160))
    im.paste(Image.new('RGB', (W, H), BG), (0, 0), shade)

def wrap(draw, text, fnt, maxw):
    words, lines, cur = text.split(), [], ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if draw.textlength(t, font=fnt) <= maxw: cur = t
        else: lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines

def spaced(draw, xy, text, fnt, fill, sp=4):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill); x += draw.textlength(ch, font=fnt) + sp
    return x

def header(im):
    mark = Image.open('public/brand/mark.png').convert('RGBA'); mark.thumbnail((54, 54))
    im.paste(mark, (64, 54), mark)
    spaced(ImageDraw.Draw(im), (132, 66), 'RUMO A DOOMSDAY', SANS(20), MUTED, 5)

def footer(im, txt='18 · 12 · 2026'):
    spaced(ImageDraw.Draw(im), (64, H - 64), txt, SANS(20), GREEN, 5)

def card_texto(im, titulo, sub, badge=None, tsize=84):
    d = ImageDraw.Draw(im)
    fnt = SERIF_B(tsize)
    lines = wrap(d, titulo, fnt, 500)
    while len(lines) > 3 or max(d.textlength(l, font=fnt) for l in lines) > 520:
        tsize -= 6; fnt = SERIF_B(tsize); lines = wrap(d, titulo, fnt, 500)
    y = 190 if len(lines) < 3 else 160
    for l in lines:
        d.text((64, y), l, font=fnt, fill=WHITE); y += int(tsize * 1.12)
    d.text((64, y + 12), sub, font=SERIF(32), fill=MUTED)
    if badge:
        bf = SANS(18); bw = int(sum(d.textlength(c, font=bf) + 3 for c in badge)) + 36
        by = y + 78
        d.rounded_rectangle((64, by, 64 + bw, by + 40), radius=3, outline=(30, 90, 52), width=2)
        spaced(d, (82, by + 9), badge, bf, GREEN, 3)

# ---------- personagens ----------
def og_personagem(c):
    art_p = f'arquivo-original/char/{c["id"]}.png'
    if not os.path.exists(art_p): art_p = f'arquivo-original/atores/{c["id"]}.jpg'
    if not os.path.exists(art_p): return False
    im = base(); art_right(im, Image.open(art_p))
    header(im); card_texto(im, c['heroi'], c['ator'], STATUS.get(c['status'])); footer(im)
    im.save(f'public/og/{c["id"]}.jpg', quality=86, optimize=True); return True

n = 0
for c in chars:
    if c['status'] == 'sem-info': continue
    if c['id'] == 'doutor-destino': continue
    n += og_personagem(c)

# ---------- doutor destino ----------
im = base(); art_right(im, Image.open('arquivo-original/char/doutor-destino.png'), 540, 0.05)
header(im); card_texto(im, 'Doutor Destino', 'Victor von Doom · Robert Downey Jr.', 'VILÃO CENTRAL · CONFIRMADO', 92); footer(im)
im.save('public/og/destino.jpg', quality=86, optimize=True)

# ---------- início ----------
arte = Image.open('arquivo-original/thumbnail/arte_site.png')   # arte de capa (vertical): rosto e ombro à direita
im = base(); art_right(im, arte, 500, 0.30, 300, 0.5)
logo = Image.open('public/brand/logo.png').convert('RGBA'); logo.thumbnail((500, 210))
im.paste(logo, (56, 62), logo)
d = ImageDraw.Draw(im)
f = SERIF_B(54)
y = 300
for l in wrap(d, 'Onde cada um está, antes de Doomsday.', f, 520):
    d.text((64, y), l, font=f, fill=WHITE); y += 64
spaced(d, (64, H - 96), '18 · 12 · 2026', SANS(20), GREEN, 5)
spaced(d, (64, H - 60), 'POR LUCAS ANDRADE · ANDRADE020.GITHUB.IO', SANS(15), MUTED, 3)
im.save('public/og/home.jpg', quality=88, optimize=True)

# ---------- linha do tempo ----------
slugs = ['ultimato', 'nwh', 'tbolts', 'ff', 'doomsday']
im = base(); header(im)
pw, ph, step = 112, 168, 126
x0 = W - 64 - (step * (len(slugs) - 1) + pw)
for i, s in enumerate(slugs):
    p = cover(Image.open(f'public/img/obra/{s}.jpg'), pw, ph, 0.0)
    im.paste(p, (x0 + i * step, 200 + (i % 2) * 60))
d = ImageDraw.Draw(im)
d.text((64, 210), 'Desde', font=SERIF_B(92), fill=WHITE); d.text((64, 310), 'Ultimato', font=SERIF_B(92), fill=WHITE)
d.text((64, 430), 'Do estalo ao multiverso, obra por obra.', font=SERIF(32), fill=MUTED)
footer(im)
im.save('public/og/linha-do-tempo.jpg', quality=86, optimize=True)

print('og de personagens:', n, '+ home, destino, linha-do-tempo')
