// Baixa fotos LIVRES (Wikimedia Commons) dos atores, em lote e com pausas. Grava créditos.
// Uso: node scripts/baixar-fotos.mjs
import { characters } from '../src/data/characters.js';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';

const UA = 'CatalogoDoomsday/0.1 (projeto pessoal de fa)';
const OUT = new URL('../public/img/', import.meta.url);
const CRED = new URL('CREDITOS.json', OUT);
mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const strip = (h) => (h || '').replace(/<[^>]*>/g, '').trim();

async function getJson(url) {
  for (let t = 1; t <= 6; t++) {
    const r = await fetch(url, { headers: { 'User-Agent': UA } });
    const txt = await r.text();
    try { return JSON.parse(txt); } catch { console.log(`  limite/erro (${r.status}), aguardando ${t * 8}s...`); await sleep(t * 8000); }
  }
  throw new Error('falha em ' + url);
}
const q = (base, p) => `${base}?format=json&origin=*&${new URLSearchParams(p)}`;
const W = 'https://en.wikipedia.org/w/api.php', C = 'https://commons.wikimedia.org/w/api.php';
const limpa = (n) => n.replace(/\s*\(.*?\)/g, '').trim();

const creditos = existsSync(CRED) ? JSON.parse(readFileSync(CRED, 'utf8')) : {};
const atores = [...new Set(characters.map((c) => limpa(c.ator)).filter((n) => n !== 'Elenco infantil'))];
const foto = {}; // ator -> {url, arquivo}

// 1) imagem principal livre de cada ator, em lotes de 20
for (let i = 0; i < atores.length; i += 20) {
  const lote = atores.slice(i, i + 20);
  const r = await getJson(q(W, { action: 'query', titles: lote.join('|'), prop: 'pageimages', piprop: 'thumbnail|name', pithumbsize: '1000', pilicense: 'free', redirects: '1' }));
  const redir = Object.fromEntries([...(r.query.normalized || []), ...(r.query.redirects || [])].map((x) => [x.from, x.to]));
  for (const p of Object.values(r.query.pages)) {
    if (p.thumbnail) {
      const ator = lote.find((n) => (redir[n] || n) === p.title || n === p.title);
      if (ator) foto[ator] = { url: p.thumbnail.source, arquivo: p.pageimage };
    }
  }
  await sleep(2000);
}
console.log(`Atores com foto livre principal: ${Object.keys(foto).length}/${atores.length}`);
console.log('Sem foto:', atores.filter((a) => !foto[a]).join(', '));

// 2) licença/autor em lotes
const arqs = Object.values(foto).map((f) => 'File:' + f.arquivo);
const meta = {};
for (let i = 0; i < arqs.length; i += 20) {
  const r = await getJson(q(C, { action: 'query', titles: arqs.slice(i, i + 20).join('|'), prop: 'imageinfo', iiprop: 'extmetadata' }));
  for (const p of Object.values(r.query.pages)) {
    const m = p.imageinfo?.[0]?.extmetadata || {};
    meta[p.title.replace(/^File:/, '').replace(/ /g, '_')] = { licenca: strip(m.LicenseShortName?.value), autor: strip(m.Artist?.value) };
  }
  await sleep(2000);
}

// 3) downloads com pausa
let ok = 0;
const feitos = {};
for (const c of characters) {
  const nome = limpa(c.ator), f = foto[nome];
  if (!f) continue;
  const dest = new URL(`${c.id}.jpg`, OUT);
  if (existsSync(dest)) { continue; }
  if (!feitos[nome]) {
    let buf;
    for (let t = 1; t <= 5 && !buf; t++) {
      const r = await fetch(f.url, { headers: { 'User-Agent': UA } });
      const tipo = r.headers.get('content-type') || '';
      if (r.ok && tipo.includes('jpeg')) buf = Buffer.from(await r.arrayBuffer());
      else if (r.status === 429) { console.log('  429, aguardando...'); await sleep(t * 8000); }
      else { console.log(`  ${nome}: ${r.status} ${tipo}`); break; }
    }
    feitos[nome] = buf || null;
    await sleep(1500);
  }
  if (feitos[nome]) {
    writeFileSync(dest, feitos[nome]); ok++;
    const m = meta[f.arquivo.replace(/ /g, '_')] || {};
    creditos[c.id] = { ator: c.ator, arquivo: f.arquivo, ...m, pagina: 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(f.arquivo) };
    console.log('ok', c.id);
  }
}
writeFileSync(CRED, JSON.stringify(creditos, null, 1));
console.log(`Baixadas agora: ${ok}`);
