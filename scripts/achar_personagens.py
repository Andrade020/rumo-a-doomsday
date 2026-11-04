# Procura imagens dos PERSONAGENS (com figurino) no MCU Wiki / Marvel Database (Fandom).
import json, time, urllib.request, urllib.parse, subprocess, re
UA = {'User-Agent': 'CatalogoDoomsday/0.1 (projeto pessoal de fa)'}
def api(base, titles):
    url = base + '?' + urllib.parse.urlencode({'action':'query','titles':'|'.join(titles),'prop':'pageimages','piprop':'original','redirects':'1','format':'json'})
    for t in range(4):
        try:
            return json.loads(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30).read())
        except Exception as e:
            print('erro', e); time.sleep(5*(t+1))
    return {}
# extrai personagens do JS via node
chars = json.loads(subprocess.check_output(['node','-e',"import('./src/data/characters.js').then(m=>console.log(JSON.stringify(m.characters.map(c=>({id:c.id,nome:c.nome,heroi:c.heroi}))))) "]))
OVR = json.load(open('scripts/titulos.json', encoding='utf-8')) if __import__('os').path.exists('scripts/titulos.json') else {}
MCU='https://marvelcinematicuniverse.fandom.com/api.php'; MDB='https://marvel.fandom.com/api.php'
cand = {}
for c in chars:
    l = OVR.get(c['id']) or []
    cand[c['id']] = l + [c['nome'], c['heroi'], f"{c['nome']} (Earth-199999)"]
def resolve(base, cand):
    allt = sorted({t for l in cand.values() for t in l})
    got = {}
    for i in range(0, len(allt), 40):
        r = api(base, allt[i:i+40])
        q = r.get('query', {})
        m = {}
        for k in ('normalized','redirects'):
            for x in q.get(k, []): m[x['from']] = x['to']
        byt = {p.get('title'): p.get('original',{}).get('source') for p in q.get('pages',{}).values()}
        for t in allt[i:i+40]:
            tt = t
            for _ in range(3): tt = m.get(tt, tt)
            if byt.get(tt): got[t] = (tt, byt[tt])
        time.sleep(1.5)
    return got
res = {}
g1 = resolve(MCU, cand)
for cid, l in cand.items():
    for t in l:
        if t in g1: res[cid] = {'fonte':'MCU Wiki','titulo':g1[t][0],'url':g1[t][1]}; break
falt = {cid: l for cid, l in cand.items() if cid not in res}
if falt:
    g2 = resolve(MDB, {cid:[t for t in l if '(Earth' in t] for cid,l in falt.items()})
    for cid, l in falt.items():
        for t in l:
            if t in g2: res[cid] = {'fonte':'Marvel Database','titulo':g2[t][0],'url':g2[t][1]}; break
json.dump(res, open('scripts/personagens-achados.json','w',encoding='utf-8'), indent=1, ensure_ascii=False)
print(len(res), '/', len(chars))
print('sem imagem:', [c['id'] for c in chars if c['id'] not in res])
for cid, v in list(res.items())[:80]: print(cid, '->', v['fonte'], '|', v['titulo'])
