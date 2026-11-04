# Busca e baixa o pôster de cada obra da linha do tempo (MCU Wiki; uso pessoal).
import json, io, time, subprocess, urllib.request, urllib.parse, os
from PIL import Image
UA = {'User-Agent': 'CatalogoDoomsday/0.1 (projeto pessoal de fa)'}
BUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
B = 'https://marvelcinematicuniverse.fandom.com/api.php'
OBRAS = {
 'ultimato': ['Avengers: Endgame'], 'wandavision': ['WandaVision'], 'fatws': ['The Falcon and the Winter Soldier'],
 'loki1': ['Loki (Season One)', 'Loki (TV series)', 'Loki'], 'viuva-negra': ['Black Widow (film)', 'Black Widow (2021)'],
 'shang-chi': ['Shang-Chi and the Legend of the Ten Rings'], 'eternos': ['Eternals'], 'gaviao': ['Hawkeye (miniseries)', 'Hawkeye (TV series)', 'Hawkeye (2021)'],
 'nwh': ['Spider-Man: No Way Home'], 'dsmm': ['Doctor Strange in the Multiverse of Madness'], 'thor4': ['Thor: Love and Thunder'],
 'bpwf': ['Black Panther: Wakanda Forever'], 'quantumania': ['Ant-Man and the Wasp: Quantumania'], 'gotg3': ['Guardians of the Galaxy Vol. 3'],
 'loki2': ['Loki (Season Two)', 'Loki'], 'marvels': ['The Marvels'], 'dpwl': ['Deadpool & Wolverine'],
 'bnw': ['Captain America: Brave New World'], 'dd1': ['Daredevil: Born Again (Season One)', 'Daredevil: Born Again'], 'tbolts': ['Thunderbolts*'],
 'ironheart': ['Ironheart (miniseries)', 'Ironheart (TV series)', 'Ironheart (2025)'], 'ff': ['The Fantastic Four: First Steps'],
 'wonderman': ['Wonder Man (miniseries)', 'Wonder Man (TV series)', 'Wonder Man (2026)'], 'dd2': ['Daredevil: Born Again (Season Two)', 'Daredevil: Born Again'],
 'bnd': ['Spider-Man: Brand New Day'], 'visionquest': ['VisionQuest'], 'doomsday': ['Avengers: Doomsday'],
}
alltitles = sorted({t for l in OBRAS.values() for t in l})
found = {}
for i in range(0, len(alltitles), 40):
    chunk = alltitles[i:i+40]
    url = B + '?' + urllib.parse.urlencode({'action':'query','titles':'|'.join(chunk),'prop':'pageimages','piprop':'original','redirects':'1','format':'json'})
    r = json.loads(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30).read())['query']
    m = {}
    for k in ('normalized','redirects'):
        for x in r.get(k, []): m[x['from']] = x['to']
    byt = {p.get('title'): p.get('original',{}).get('source') for p in r['pages'].values()}
    for t in chunk:
        tt = t
        for _ in range(3): tt = m.get(tt, tt)
        if byt.get(tt): found[t] = byt[tt]
    time.sleep(1.5)
ok, falta = {}, []
for slug, cands in OBRAS.items():
    u = next((found[t] for t in cands if t in found), None)
    if not u: falta.append(slug); continue
    out = f'public/img/obra/{slug}.jpg'
    if os.path.exists(out): ok[slug] = u; continue
    for t in range(3):
        d = subprocess.run(['curl','-s','-m','40','-A',BUA,'-e','https://marvelcinematicuniverse.fandom.com/',u.split('?')[0].split('/revision')[0]], capture_output=True).stdout
        try:
            im = Image.open(io.BytesIO(d)); im.load(); break
        except Exception: im = None; time.sleep(3*(t+1))
    if im is None: falta.append(slug); continue
    im = im.convert('RGB'); im.thumbnail((640, 960)); im.save(out, quality=86)
    ok[slug] = u; print('ok', slug, im.size, flush=True); time.sleep(1.0)
print('faltam:', falta)
