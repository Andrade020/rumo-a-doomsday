import './style.css';
import { characters, characterMap } from './data/characters.js';
import { groupMap } from './data/groups.js';
import { timeline } from './data/timeline.js';
import { hero, terras, estreias } from './data/texto.js';
import { obras } from './data/obras.js';
import * as D from './data/destino.js';

const app = document.getElementById('app');
const BASE = import.meta.env.BASE_URL;
const RELEASE = new Date('2026-12-18T00:00:00');
const VIDEO = 'X1aFkAkFASk'; // Marvel Entertainment

const STATUS = { confirmado: 'Confirmado', reportado: 'Reportado', rumor: 'Rumor' };
// Só aparece no site quem está confirmado, reportado ou em rumor.
const visible = characters.filter((c) => STATUS[c.status]);
const isVisible = (id) => characterMap[id] && STATUS[characterMap[id].status];
const link = (c) => (c.id === 'doutor-destino' ? '#/destino' : `#/personagem/${c.id}`);

/* ---------- imagens ---------- */
let modo = localStorage.getItem('modo') || 'personagem';
const srcs = (c) => {
  const a = [`img/cut/${c.id}.webp`, `img/${c.id}.jpg`];
  const p = [`img/char/${c.id}.webp`];
  return (modo === 'personagem' ? [...p, ...a] : [...a, ...p]).map((x) => BASE + x);
};
window.__next = (img) => {
  const q = JSON.parse(img.dataset.q);
  const i = Number(img.dataset.i || 0) + 1;
  if (i >= q.length) return img.remove();
  img.dataset.i = i;
  img.src = q[i];
};
const photo = (c) => {
  const q = srcs(c);
  return `<img class="ph" src="${q[0]}" data-q='${JSON.stringify(q)}' alt="${c.heroi}" loading="lazy" onerror="__next(this)" />`;
};
const initials = (n) => n.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

/* ---------- peças ---------- */
const slice = (c) => `
  <a class="slice" href="${link(c)}" style="--c:${c.cor}" aria-label="${c.heroi}">
    <div class="bg"><span class="ini">${initials(c.heroi)}</span>${photo(c)}</div>
    <i class="dot ${c.status}" title="${STATUS[c.status]}"></i>
    <div class="name"><strong>${c.heroi}</strong><small>${c.ator}</small></div>
  </a>`;

const nav = (active) => `
  <header class="top">
    <a class="brand" href="#/"><img src="${BASE}brand/mark.png" alt="" /><span>Rumo a Doomsday</span></a>
    <nav>
      <a href="#/" class="${active === 'home' ? 'on' : ''}">Início</a>
      <a href="#/linha-do-tempo" class="${active === 'linha' ? 'on' : ''}">Desde Ultimato</a>
      <a href="#/destino" class="${active === 'destino' ? 'on' : ''}">Doutor Destino</a>
    </nav>
  </header>`;

const footer = () => `
  <footer class="foot">
    <img src="${BASE}brand/mark.png" alt="" />
    <p>Projeto de fã, sem fins comerciais e para uso pessoal. Marcas, logos e imagens © Marvel Studios / Disney.
    <a href="#/creditos">Créditos das imagens</a></p>
  </footer>`;

const NOME_SITE = 'Rumo a Doomsday';
const setTitle = (t) => { document.title = t ? `${t} — ${NOME_SITE}` : `${NOME_SITE} — onde cada um está antes de Vingadores: Doomsday`; };

function toast(msg) {
  document.querySelector('.toast')?.remove();
  const t = document.createElement('div');
  t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2400);
}
// Link de compartilhamento: em produção usa a página de prévia (/p/<slug>/); em desenvolvimento, o endereço atual.
function shareUrl(slug) {
  return import.meta.env.PROD ? new URL(`p/${slug}/`, document.baseURI.split('#')[0]).href : location.href;
}
const shareBtn = (slug) => `<button class="btn share" data-share="${slug}" type="button">Copiar link</button>`;
function bindShare() {
  app.querySelectorAll('[data-share]').forEach((b) => b.addEventListener('click', async () => {
    const url = shareUrl(b.dataset.share);
    try { await navigator.clipboard.writeText(url); toast('Link copiado'); }
    catch { window.prompt('Copie o link:', url); }
  }));
}

const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const dataBR = (d) => { const [y, m] = d.split('-'); return `${MES[Number(m) - 1]} ${y}`; };
const days = () => Math.ceil((RELEASE - new Date()) / 86400000);
// A contagem só existe até a estreia; depois disso, some.
const countdown = () => (new Date() < RELEASE ? `<div class="count"><b>${days()}</b> ${days() === 1 ? 'dia' : 'dias'} para 18/12/2026</div>` : '');

const videoBlock = () => `
  <section class="video-block">
    <h3>Trailer</h3>
    <button class="vthumb" data-video aria-label="Assistir ao trailer">
      <img src="https://i.ytimg.com/vi/${VIDEO}/maxresdefault.jpg" alt="" onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${VIDEO}/hqdefault.jpg'" />
      <span>▶</span>
    </button>
    <p class="muted">Avengers: Doomsday — Marvel Entertainment</p>
  </section>`;

/* ---------- vídeo (lightbox) ---------- */
function openVideo() {
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.innerHTML = `<button aria-label="Fechar">✕</button>
    <iframe src="https://www.youtube-nocookie.com/embed/${VIDEO}?autoplay=1&rel=0&modestbranding=1" title="Avengers: Doomsday — Trailer" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  const close = () => { box.remove(); document.removeEventListener('keydown', esc); };
  const esc = (e) => e.key === 'Escape' && close();
  box.addEventListener('click', (e) => { if (e.target === box || e.target.tagName === 'BUTTON') close(); });
  document.addEventListener('keydown', esc);
  document.body.appendChild(box);
}
const bindVideo = () => app.querySelectorAll('[data-video]').forEach((b) => b.addEventListener('click', openVideo));

/* ---------- home ---------- */
function stripsFor(grupoIds, list) {
  return grupoIds
    .map((id) => groupMap[id])
    .map((g) => ({ g, items: list.filter((c) => c.grupos[0] === g.id) }))
    .filter((x) => x.items.length)
    .map(({ g, items }) => `
      <section class="lineup">
        <header><h3><a href="#/grupo/${g.id}">${g.nome}</a></h3><p>${g.resumo}</p></header>
        <div class="strip">${items.map(slice).join('')}</div>
      </section>`).join('');
}

function home(filter = 'todos') {
  setTitle('');
  const list = filter === 'todos' ? visible : visible.filter((c) => c.status === filter);
  const secoes = terras
    .map((t) => ({ t, html: stripsFor(t.grupos, list) }))
    .filter((x) => x.html)
    .map(({ t, html }) => `
      <section class="terra" id="${t.id}">
        <div class="terra-head"><span class="num">${t.num}</span><div><h2>${t.nome}</h2><p>${t.texto}</p></div></div>
        ${html}
      </section>`).join('');

  app.innerHTML = `${nav('home')}
    <section class="hero">
      <div class="hero-bg" style="background-image:url('${BASE}brand/poster.jpg')"></div>
      <div class="fog"></div>
      <div class="hero-in">
        <img class="logo" src="${BASE}brand/logo.png" alt="Avengers: Doomsday" fetchpriority="high" />
        <h1>${hero.titulo}</h1>
        <div class="cta">
          <button class="btn primary" data-video>▶ Trailer</button>
          <a class="btn" href="#dossie">Ver os personagens</a>
        </div>
        ${countdown()}
      </div>
    </section>

    <section class="toolbar" id="dossie">
      <div class="seg">
        ${[['todos', 'Todos'], ['confirmado', 'Confirmados'], ['reportado', 'Reportados'], ['rumor', 'Rumores']]
          .map(([k, l]) => `<button data-f="${k}" class="${k === filter ? 'on' : ''}">${l}</button>`).join('')}
      </div>
      <button class="seg-btn" id="modo" title="Alternar entre arte do personagem e foto do ator">${modo === 'personagem' ? 'Arte' : 'Ator'} ⇄</button>
    </section>
    <main>${secoes || '<p class="empty">Nada por aqui ainda.</p>'}</main>
    ${footer()}`;

  app.querySelectorAll('.seg button').forEach((b) => b.addEventListener('click', () => { home(b.dataset.f); document.getElementById('dossie').scrollIntoView(); }));
  document.getElementById('modo').addEventListener('click', () => {
    modo = modo === 'personagem' ? 'ator' : 'personagem';
    localStorage.setItem('modo', modo);
    home(filter);
    document.getElementById('dossie').scrollIntoView();
  });
  bindVideo();
}

/* ---------- grupo ---------- */
function groupPage(id) {
  const g = groupMap[id];
  const members = g ? g.membros.map((m) => characterMap[m]).filter((c) => c && STATUS[c.status]) : [];
  if (!g || !members.length) return notFound();
  setTitle(g.nome);
  app.innerHTML = `${nav('home')}
    <section class="page-head" style="--c:${g.cor}">
      <a class="back" href="#/">← Início</a>
      <h1>${g.nome}</h1>
      <p class="sub">${g.resumo}</p>
    </section>
    <section class="cols">
      <div><h4>Antes</h4><p>${g.antes}</p></div>
      <div><h4>Agora</h4><p>${g.agora}</p></div>
      <div><h4>Em Doomsday</h4><p>${g.doomsday}</p></div>
    </section>
    <main><section class="lineup"><div class="strip">${members.map(slice).join('')}</div></section></main>
    ${footer()}`;
}

/* ---------- personagem ---------- */
function characterPage(id) {
  if (id === 'doutor-destino') return destinoPage();
  const c = characterMap[id];
  if (!c || !STATUS[c.status]) return notFound();
  const gs = c.grupos.map((g) => groupMap[g]).filter(Boolean);
  const e = estreias[id];
  setTitle(`${c.heroi} (${c.ator})`);
  app.innerHTML = `${nav('home')}
    <article class="char" style="--c:${c.cor}">
      <div class="poster"><div class="bg"><span class="ini">${initials(c.heroi)}</span>${photo(c)}</div></div>
      <div class="body">
        <a class="back" href="#/">← Início</a>
        <span class="tag ${c.status}">${STATUS[c.status]} em Doomsday</span>
        <h1>${c.heroi}</h1>
        <p class="who">${c.nome} · ${c.ator}</p>
        ${shareBtn(c.id)}
        <dl class="ficha">
          ${e ? `<div><dt>Estreia</dt><dd>${e}</dd></div>` : ''}
          <div><dt>Grupo</dt><dd>${gs.map((g) => `<a href="#/grupo/${g.id}">${g.nome}</a>`).join(', ')}</dd></div>
          <div><dt>Em Doomsday</dt><dd>${c.doomsday}</dd></div>
        </dl>
        <h3>Antes de Ultimato</h3>
        <p class="txt">${c.antes}</p>
        <h3>Desde Ultimato</h3>
        <div class="tl">
          ${c.depois.length
            ? c.depois.map(([y, o, t]) => `<div class="ev"><b>${y}</b><div><h5>${o}</h5><p>${t}</p></div></div>`).join('')
            : '<p class="txt muted">Sem aparições no MCU desde então.</p>'}
        </div>
        <h3>Onde está agora</h3>
        <p class="txt">${c.agora}</p>
      </div>
    </article>
    ${footer()}`;
  bindShare();
}

/* ---------- Doutor Destino (página inteira) ---------- */
function destinoPage() {
  const c = characterMap['doutor-destino'];
  const gal = (f) => `${BASE}img/destino/${f}.jpg`;
  setTitle('Doutor Destino');
  app.innerHTML = `${nav('destino')}
    <section class="d-hero">
      <div class="d-bg" style="background-image:url('${gal('secret-wars-doom')}')"></div>
      <div class="d-in">
        <span class="tag">Vilão central · Confirmado</span>
        <h1>Doutor Destino</h1>
        <p class="sub">Victor von Doom, interpretado por Robert Downey Jr.</p>
        <div class="cta"><button class="btn primary" data-video>▶ Trailer</button><a class="btn" href="#quadrinhos">Nos quadrinhos</a>${shareBtn('destino')}</div>
      </div>
    </section>

    <div class="d-wrap">
      <article class="d-main">
        <h2 class="d-h">Quem é</h2>
        ${D.quem.map((t) => `<p class="txt">${t}</p>`).join('')}

        <h2 class="d-h" id="quadrinhos">Nos quadrinhos</h2>
        <div class="tl">${D.quadrinhos.map((q, i) => `<div class="ev"><b>${String(i + 1).padStart(2, '0')}</b><div><h5>${q.t}</h5><p>${q.x}</p></div></div>`).join('')}</div>
        <div class="galeria">
          ${D.galeria.map((g) => `<figure><img src="${gal(g.f)}" alt="${g.c}" /><figcaption>${g.c}</figcaption></figure>`).join('')}
        </div>

        <h2 class="d-h">No cinema</h2>
        <div class="tl">${D.mcu.map((m) => `<div class="ev"><b>${m.d}</b><div><h5>${m.t}</h5><p>${m.x}</p></div></div>`).join('')}</div>

        <h2 class="d-h">Rumores e teorias</h2>
        <div class="teorias">
          ${D.teorias.map((t) => `<div class="teoria"><span class="st">${t.s}</span><h5>${t.t}</h5><p>${t.x}</p></div>`).join('')}
        </div>
        <p class="muted aviso">${D.aviso}</p>
      </article>

      <aside class="d-side">
        <div class="poster"><div class="bg"><span class="ini">DD</span>${photo(c)}</div></div>
        <dl class="ficha">${D.ficha.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
      </aside>
    </div>
    ${videoBlock()}
    ${footer()}`;
  bindVideo();
  bindShare();
}

/* ---------- linha do tempo (horizontal) + detalhe ---------- */
function openObra(slug) {
  const t = timeline.find((x) => x[4] === slug);
  const o = obras[slug];
  if (!t || !o) return;
  const [d, titulo, tipo] = t;
  const pers = (o.pers || []).filter(isVisible).map((id) => characterMap[id]);
  const box = document.createElement('div');
  box.className = 'modal';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', titulo);
  box.innerHTML = `
    <div class="panel">
      <button class="x" aria-label="Fechar">✕</button>
      <div class="mposter"><img src="${BASE}img/obra/${slug}.jpg" alt="${titulo}" /></div>
      <div class="mbody">
        <p class="mmeta">${dataBR(d)} · ${tipo}</p>
        <h2>${titulo}</h2>
        ${o.p.map((x) => `<p>${x}</p>`).join('')}
        <div class="liga"><h4>Ligação com Doomsday</h4><p>${o.liga}</p></div>
        ${pers.length ? `<div class="chips">${pers.map((c) => `<a href="${link(c)}">${c.nome}</a>`).join('')}</div>` : ''}
      </div>
    </div>`;
  const close = () => { box.remove(); document.body.classList.remove('lock'); document.removeEventListener('keydown', esc); };
  const esc = (e) => e.key === 'Escape' && close();
  box.addEventListener('click', (e) => { if (e.target === box || e.target.classList.contains('x') || e.target.closest('.chips a')) close(); });
  document.addEventListener('keydown', esc);
  document.body.classList.add('lock');
  document.body.appendChild(box);
  box.querySelector('.x').focus();
}

function timelinePage() {
  setTitle('Desde Ultimato');
  const now = new Date().toISOString().slice(0, 7);
  let ano = '', hojeMarcado = false;
  const itens = timeline.map(([d, t, tipo, s, slug]) => {
    const y = d.slice(0, 4);
    let pre = '';
    if (y !== ano) { ano = y; pre += `<div class="year"><span>${y}</span></div>`; }
    if (!hojeMarcado && d > now && new Date() < RELEASE) { hojeMarcado = true; pre += '<div class="hoje"><i></i><span>Hoje</span></div>'; }
    const final = slug === 'doomsday';
    return `${pre}
      <article class="tcard${final ? ' final' : ''}" data-slug="${slug}" tabindex="0" role="button" aria-label="Ver detalhes: ${t}">
        <div class="mark"><i></i><span>${dataBR(d)}</span></div>
        <div class="tposter"><img src="${BASE}img/obra/${slug}.jpg" alt="${t}" loading="lazy" onerror="this.remove()" /></div>
        <h5>${t}</h5><small>${tipo}</small>
        <p>${s}</p>
        <span class="more">Ver detalhes →</span>
      </article>`;
  }).join('');
  app.innerHTML = `${nav('linha')}
    <section class="page-head">
      <h1>Desde Ultimato</h1>
      <p class="sub">Clique em uma obra para ver o que aconteceu e o que muda para Doomsday.</p>
      <div class="cta" style="margin-top:18px">${shareBtn('desde-ultimato')}</div>
    </section>
    <section class="hwrap">
      <button class="arrow l" aria-label="Anterior">‹</button>
      <div class="htrack" tabindex="0">${itens}</div>
      <button class="arrow r" aria-label="Próximo">›</button>
    </section>
    ${videoBlock()}
    ${footer()}`;
  bindVideo();
  bindShare();
  const tr = app.querySelector('.htrack');
  const step = () => Math.max(300, tr.clientWidth * 0.8);
  app.querySelector('.arrow.l').addEventListener('click', () => tr.scrollBy({ left: -step(), behavior: 'smooth' }));
  app.querySelector('.arrow.r').addEventListener('click', () => tr.scrollBy({ left: step(), behavior: 'smooth' }));
  tr.addEventListener('keydown', (e) => {
    const card = e.target.closest?.('.tcard');
    if ((e.key === 'Enter' || e.key === ' ') && card) { e.preventDefault(); openObra(card.dataset.slug); return; }
    if (e.key === 'ArrowRight') tr.scrollBy({ left: 280, behavior: 'smooth' });
    if (e.key === 'ArrowLeft') tr.scrollBy({ left: -280, behavior: 'smooth' });
  });
  // arrastar com o mouse; clique só abre o detalhe se não houve arrasto
  let down = false, sx = 0, sl = 0, dragged = false;
  tr.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; dragged = false; sx = e.clientX; sl = tr.scrollLeft; });
  window.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - sx;
    if (Math.abs(dx) > 5) { dragged = true; tr.classList.add('drag'); }
    tr.scrollLeft = sl - dx;
  });
  window.addEventListener('pointerup', () => { down = false; tr.classList.remove('drag'); });
  tr.addEventListener('click', (e) => {
    const card = e.target.closest('.tcard');
    if (!card || dragged) { dragged = false; return; }
    openObra(card.dataset.slug);
  });
}

/* ---------- créditos ---------- */
async function creditsPage() {
  setTitle('Créditos');
  app.innerHTML = `${nav('')}
    <section class="page-head"><h1>Créditos</h1>
      <p class="sub">Pôsteres, logos e imagens de personagens e de quadrinhos: © Marvel Studios / Disney, obtidos do MCU Wiki e do Marvel Database (Fandom), só para uso pessoal; não publique sem licença. Vídeo: canal oficial Marvel Entertainment. Fotos de atores: licença livre (Wikimedia Commons), abaixo.</p></section>
    <section class="tl wide" id="cr"><p class="muted">Carregando…</p></section>${footer()}`;
  try {
    const d = await (await fetch(`${BASE}img/CREDITOS.json`)).json();
    document.getElementById('cr').innerHTML = Object.entries(d).map(([id, x]) => `<div class="ev"><b>${characterMap[id]?.heroi || id}</b><div><h5>${x.ator}</h5><p>${x.licenca || ''} · ${x.autor || 'autor n/d'} · <a href="${x.pagina}" target="_blank" rel="noopener">fonte</a></p></div></div>`).join('');
  } catch { document.getElementById('cr').innerHTML = '<p class="muted">Sem créditos.</p>'; }
}

function notFound() {
  setTitle('Página não encontrada');
  app.innerHTML = `${nav('')}<section class="page-head"><h1>Não encontrado</h1><p class="sub">Essa página não existe.</p><a class="back" href="#/">← Início</a></section>`;
}

/* ---------- rotas ---------- */
function route() {
  const h = location.hash;
  if (h === '#dossie' || h === '#quadrinhos') { if (!app.firstChild) (h === '#dossie' ? home() : destinoPage()); return; } // âncoras internas
  const [, page, id] = h.split('/');
  window.scrollTo(0, 0);
  document.querySelectorAll('.modal, .lightbox').forEach((n) => n.remove());
  document.body.classList.remove('lock');
  if (!page) return home();
  if (page === 'personagem' && id) return characterPage(id);
  if (page === 'grupo' && id) return groupPage(id);
  if (page === 'linha-do-tempo' && !id) return timelinePage();
  if (page === 'destino' && !id) return destinoPage();
  if (page === 'creditos' && !id) return creditsPage();
  return notFound();
}
window.addEventListener('hashchange', route);
route();
