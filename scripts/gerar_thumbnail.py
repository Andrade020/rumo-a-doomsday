# Decora uma imagem de fundo (arquivo-original/thumbnail/fundo.png) e gera a thumbnail 1280x640.
# Uso (na raiz do projeto): python scripts/gerar_thumbnail.py [saida.png]
import sys, os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(ROOT)
OUT = sys.argv[1] if len(sys.argv) > 1 else 'arquivo-original/thumbnail/thumbnail_1280x640.png'
W, H = 1280, 640
FD = 'C:/Windows/Fonts/'
GREEN = (61, 220, 106); WHITE = (238, 243, 239); MUTED = (170, 190, 178)

bg = Image.open('arquivo-original/thumbnail/fundo.png').convert('RGB')
r = W / bg.width; bg = bg.resize((W, round(bg.height * r)), Image.LANCZOS)
top = 14                                   # corta mais embaixo do que em cima (preserva os rostos)
bg = bg.crop((0, top, W, top + H))

# leve gradação de cor para o verde/escuro da identidade
arr = np.asarray(bg).astype(np.float32)
arr = arr * np.array([0.93, 1.0, 0.95]) * 0.92
im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
# vinheta radial
d = np.sqrt(((xx - W / 2) / (W * 0.62)) ** 2 + ((yy - H * 0.42) / (H * 0.78)) ** 2)
vig = np.clip((d - 0.55) / 0.75, 0, 1) ** 1.6 * 0.78
# degradê inferior (leitura do texto)
grad = np.clip((yy - H * 0.40) / (H * 0.60), 0, 1) ** 1.35 * 0.93
a = np.clip(vig + grad - vig * grad, 0, 1)
dark = Image.new('RGB', (W, H), (4, 7, 6))
im = Image.composite(dark, im, Image.fromarray((a * 255).astype(np.uint8)))

# brilho verde no canto inferior esquerdo + faixa de luz fina no topo
glow = Image.new('RGB', (W, H), (0, 0, 0)); gd = ImageDraw.Draw(glow)
gd.ellipse((-260, 330, 760, 900), fill=(7, 42, 23)); glow = glow.filter(ImageFilter.GaussianBlur(110))
im = ImageChops.screen(im, glow)

# texto
def shadowed(base, xy, text, font, fill, blur=10, off=3, op=190):
    lay = Image.new('RGBA', base.size, (0, 0, 0, 0)); ld = ImageDraw.Draw(lay)
    ld.text((xy[0] + off, xy[1] + off), text, font=font, fill=(0, 0, 0, op))
    lay = lay.filter(ImageFilter.GaussianBlur(blur))
    base.paste(lay, (0, 0), lay)
    ImageDraw.Draw(base).text(xy, text, font=font, fill=fill)

im = im.convert('RGB')
mark = Image.open('public/brand/mark.png').convert('RGBA'); mark.thumbnail((50, 50))
x0 = 64
title_f = ImageFont.truetype(FD + 'georgiab.ttf', 98)
tag_f = ImageFont.truetype(FD + 'georgiai.ttf', 38)
chip_f = ImageFont.truetype(FD + 'segoeuib.ttf', 19)

shadowed(im, (x0, 402), 'Rumo a Doomsday', title_f, WHITE, 14, 4, 220)
im.paste(mark, (22, 16), mark)                          # ícone no canto superior
shadowed(im, (x0 + 4, 518), 'Onde cada um está, antes de Doomsday.', tag_f, GREEN, 8, 2, 200)

# linha de tópicos
d2 = ImageDraw.Draw(im)
items = ['PERSONAGENS', 'LINHA DO TEMPO', 'DOUTOR DESTINO']
x = x0 + 4; y = 584
d2.rectangle((x0 - 18, y - 2, x0 - 12, y + 26), fill=GREEN)
for k, t in enumerate(items):
    sp = 3
    for ch in t:
        d2.text((x, y), ch, font=chip_f, fill=WHITE); x += d2.textlength(ch, font=chip_f) + sp
    x += 26
    if k < len(items) - 1:
        d2.ellipse((x - 16, y + 10, x - 10, y + 16), fill=GREEN)
os.makedirs(os.path.dirname(OUT), exist_ok=True)
im.save(OUT, optimize=True)
print('ok', OUT, im.size)
