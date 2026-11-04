# Decora uma imagem de fundo (arquivo-original/thumbnail/fundo.png) e gera a thumbnail 1280x640.
# Uso (na raiz do projeto): python scripts/gerar_thumbnail.py [saida.png]
import sys, os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(ROOT)
OUT = sys.argv[1] if len(sys.argv) > 1 else 'arquivo-original/thumbnail/thumbnail_1280x640.png'
W = int(sys.argv[2]) if len(sys.argv) > 2 else 1280      # ex.: 1200 627 para LinkedIn
H = int(sys.argv[3]) if len(sys.argv) > 3 else 640
K = W / 1280.0                                           # escala dos elementos
FD = 'C:/Windows/Fonts/'
GREEN = (61, 220, 106); WHITE = (238, 243, 239); MUTED = (170, 190, 178)

bg = Image.open('arquivo-original/thumbnail/fundo.png').convert('RGB')
r = W / bg.width; bg = bg.resize((W, round(bg.height * r)), Image.LANCZOS)
top = round(14 * K)                                   # corta mais embaixo do que em cima (preserva os rostos)
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
gd.ellipse((round(-260 * K), H - round(310 * K), round(760 * K), H + round(260 * K)), fill=(7, 42, 23)); glow = glow.filter(ImageFilter.GaussianBlur(110))
im = ImageChops.screen(im, glow)

# texto
def shadowed(base, xy, text, font, fill, blur=10, off=3, op=190):
    lay = Image.new('RGBA', base.size, (0, 0, 0, 0)); ld = ImageDraw.Draw(lay)
    ld.text((xy[0] + off, xy[1] + off), text, font=font, fill=(0, 0, 0, op))
    lay = lay.filter(ImageFilter.GaussianBlur(blur))
    base.paste(lay, (0, 0), lay)
    ImageDraw.Draw(base).text(xy, text, font=font, fill=fill)

im = im.convert('RGB')
mark = Image.open('public/brand/mark.png').convert('RGBA'); mark.thumbnail((round(50 * K), round(50 * K)))
x0 = round(64 * K)
title_f = ImageFont.truetype(FD + 'georgiab.ttf', round(98 * K))
tag_f = ImageFont.truetype(FD + 'georgiai.ttf', round(38 * K))
chip_f = ImageFont.truetype(FD + 'segoeuib.ttf', round(19 * K))

shadowed(im, (x0, H - round(238 * K)), 'Rumo a Doomsday', title_f, WHITE, 14, 4, 220)
im.paste(mark, (round(40 * K), round(26 * K)), mark)                          # ícone no canto superior
shadowed(im, (x0 + 4, H - round(122 * K)), 'Onde cada um está, antes de Doomsday.', tag_f, GREEN, 8, 2, 200)

# linha de tópicos
d2 = ImageDraw.Draw(im)
items = ['PERSONAGENS', 'LINHA DO TEMPO', 'DOUTOR DESTINO']
x = x0 + 4; y = H - round(56 * K)
d2.rectangle((x0 - round(18 * K), y - 2, x0 - round(12 * K), y + round(26 * K)), fill=GREEN)
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
