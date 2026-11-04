// Renderização determinística: para cada quadro (função tempo -> imagem) o site real é posicionado no
// instante t, as animações CSS são congeladas em (t - início) e a página é capturada com o Playwright.
// Os quadros vão por pipe direto ao ffmpeg. Sem gravação de tela.
// Uso: node render.mjs <saida.mp4>     (variáveis: FFMPEG, CHROME_PATH, TRAILER_URL)
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const tl = JSON.parse(fs.readFileSync(path.join(here, 'timeline.json'), 'utf8'));
const out = process.argv[2];
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const URL_BASE = (process.env.TRAILER_URL || tl.base).replace(/\/?$/, '/');
const CHROME = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/usr/bin/chromium']
  .filter(Boolean).find((p) => fs.existsSync(p));
if (!CHROME) throw new Error('Chrome não encontrado: defina CHROME_PATH');
if (!out) throw new Error('uso: node render.mjs <saida.mp4>');

// nomes de pessoas que não podem aparecer em quadro (atores e criadores)
const root = path.resolve(here, '..', '..');
const { characters } = await import('file:///' + path.join(root, 'src/data/characters.js').replace(/\\/g, '/'));
const names = [...new Set(characters.flatMap((c) => c.ator.replace(/\(.*?\)/g, '').split(/\s*(?:,| e )\s*/)).map((s) => s.trim()).filter((s) => s.length > 4)),
  'Downey', 'Stan Lee', 'Jack Kirby', 'Majors', 'Russo', 'Waldron', 'McFeely', 'McKenna', 'Sommers', 'Hemsworth'];

const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ['--hide-scrollbars', '--font-render-hinting=none', '--disable-lcd-text'] });
const ctx = await browser.newContext({ viewport: { width: tl.width, height: tl.height }, deviceScaleFactor: 1, permissions: ['clipboard-read', 'clipboard-write'] });
const page = await ctx.newPage();
await page.addInitScript(() => { localStorage.setItem('modo', 'personagem'); });
await page.goto(URL_BASE); await page.waitForSelector('.slice');

// dados reais para as sobreposições (prévia de compartilhamento = tags reais da página gerada no build)
const stub = await (await fetch(URL_BASE + tl.sharePreview.page)).text();
const meta = (p) => (stub.match(new RegExp(`<meta property="${p}" content="([^"]*)"`)) || [])[1] || '';
const decode = (s) => s.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<');
const preview = { title: decode(meta('og:title')), desc: decode(meta('og:description')), image: URL_BASE + meta('og:image').replace(/^.*?(og\/)/, '$1') };
const posters = ['ultimato', 'wandavision', 'fatws', 'loki1', 'viuva-negra', 'shang-chi', 'eternos', 'gaviao', 'nwh', 'dsmm', 'thor4', 'bpwf', 'quantumania', 'gotg3', 'loki2', 'marvels'];

await page.evaluate(() => document.fonts.ready);
await page.addScriptTag({ path: path.join(here, 'stage.js') });
await page.evaluate(([t, d]) => window.__init(t, d), [tl, { base: URL_BASE, names, preview, posters }]);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);

const ff = spawn(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(tl.fps), '-c:v', 'mjpeg', '-i', '-',
  '-c:v', 'libx264', '-crf', '10', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-vf', 'scale=in_range=pc:out_range=tv:out_color_matrix=bt709',
  '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-r', String(tl.fps), out], { stdio: ['pipe', 'inherit', 'inherit'] });
const ffDone = new Promise((res, rej) => { ff.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg saiu com código ' + c)))); });

const total = Math.round(tl.duration * tl.fps);
let prevT = -1, mouse = { x: -50, y: -50 }, sceneDone = new Set();
const t0 = Date.now();
for (let i = 0; i < total; i++) {
  const t = i / tl.fps;
  // troca de rota no instante exato do corte (a cena está totalmente no preto)
  for (const s of tl.scenes) {
    if (s.route && t >= s.t0 && !sceneDone.has(s.id)) {
      sceneDone.add(s.id);
      await page.evaluate((h) => { location.hash = h; }, s.route);
      await page.waitForTimeout(250);
      await page.evaluate(() => window.__waitImages());
    }
  }
  const st = await page.evaluate(([tt, ii]) => window.__pre(tt, ii), [t, i]);
  if (st.vis > 0 && (Math.abs(st.x - mouse.x) > 0.4 || Math.abs(st.y - mouse.y) > 0.4)) { await page.mouse.move(st.x, st.y); mouse = { x: st.x, y: st.y }; }
  for (const grp of tl.cursor) for (const k of grp) {
    if (k.click && k.t > prevT && k.t <= t + 1e-6) {
      const active = await page.evaluate(() => !!document.querySelector('#fx'));
      if (active) await page.mouse.click(mouse.x, mouse.y);
    }
  }
  await page.evaluate((tt) => window.__post(tt), t);
  const buf = await page.screenshot({ type: 'jpeg', quality: 93 });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  prevT = t;
  if (i % 90 === 0) console.log(`quadro ${i}/${total}  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}
ff.stdin.end(); await ffDone; await browser.close();
console.log('vídeo (sem áudio) pronto:', out);
