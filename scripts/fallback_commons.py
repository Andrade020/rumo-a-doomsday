# Busca fotos livres no Commons para atores sem imagem principal livre.
import json, time, sys, io, urllib.request, urllib.parse, re
from PIL import Image
UA = {'User-Agent': 'CatalogoDoomsday/0.1 (projeto pessoal de fa)'}
def get(url):
    for t in range(1, 6):
        try:
            req = urllib.request.Request(url, headers=UA)
            return urllib.request.urlopen(req, timeout=30).read()
        except Exception as e:
            print('  erro', e, 'espera', t*8); time.sleep(t*8)
    raise SystemExit('falhou ' + url)
def j(p):
    return json.loads(get('https://commons.wikimedia.org/w/api.php?format=json&' + urllib.parse.urlencode(p)))
alvos = {
 'steve-rogers': ('Chris Evans', None), 'wanda-maximoff': ('Elizabeth Olsen', None),
 'kamala-khan': ('Iman Vellani', None), 'attuma': ('Alex Livinalli', None),
 'agatha-harkness': ('Kathryn Hahn', 'File:Kathryn Hahn'),
}
cred = json.load(open('public/img/CREDITOS.json', encoding='utf-8'))
for cid, (ator, _) in alvos.items():
    r = j({'action':'query','generator':'search','gsrsearch':f'{ator} filetype:bitmap','gsrnamespace':'6','gsrlimit':'15',
           'prop':'imageinfo','iiprop':'url|size|extmetadata|mime','iiurlwidth':'1000'})
    best = None
    for p in (r.get('query',{}).get('pages',{}) or {}).values():
        ii = p['imageinfo'][0]; t = p['title']
        last = ator.split()[-1].lower()
        if last not in t.lower(): continue
        lic = (ii['extmetadata'].get('LicenseShortName',{}).get('value') or '')
        if not re.match(r'(CC|Public)', lic): continue
        if ii['mime'] not in ('image/jpeg','image/png'): continue
        if ii['height'] < 600: continue
        score = (ii['height']/ii['width'] > 1.0, ii['height'])  # prefere retrato e maior
        if not best or score > best[0]: best = (score, p, ii, lic)
    if not best: print('SEM RESULTADO', cid); continue
    _, p, ii, lic = best
    img = Image.open(io.BytesIO(get(ii['thumburl']))).convert('RGB')
    img.save(f'public/img/{cid}.jpg', quality=92)
    autor = re.sub('<[^>]+>','',ii['extmetadata'].get('Artist',{}).get('value',''))
    cred[cid] = {'ator': ator, 'arquivo': p['title'][5:], 'licenca': lic, 'autor': autor, 'pagina': ii['descriptionurl']}
    print('ok', cid, p['title'], lic, img.size)
    time.sleep(3)
json.dump(cred, open('public/img/CREDITOS.json','w',encoding='utf-8'), indent=1, ensure_ascii=False)
