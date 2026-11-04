// Código que roda DENTRO da página do site (injetado pelo render.mjs).
// Tudo é função do tempo `t` (segundos): texto, cursor, rolagem, fita, cartão final.
// As animações CSS do site são "congeladas" e posicionadas em (t - início) para que cada quadro seja determinístico.
(() => {
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const rng = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

  let TL, D, E = {}, lastCursor = { x: 0, y: 0 };
  const animStart = new Map();
  let nameRe = null;

  window.__init = (tl, data) => {
    TL = tl; D = data;
    nameRe = new RegExp(data.names.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');
    const css = document.createElement('style');
    css.textContent = `
      html { scroll-behavior:auto !important; }
      .htrack { scroll-snap-type:none !important; cursor:none; }
      * { cursor:none !important; }
      .year, .hoje, .mark span, .slice .name small, .who, .mmeta { visibility:hidden !important; }
      .arrow { display:none !important; }
      #fx { position:fixed; inset:0; z-index:9999; pointer-events:none; overflow:hidden; font-family:'Cormorant Garamond',Georgia,serif; }
      #fx > * { position:absolute; }
      #curtain { inset:0; background:#050807; opacity:0; }
      #leak { inset:-10%; background:radial-gradient(60% 50% at 78% 20%, rgba(61,220,106,.10), transparent 70%), radial-gradient(50% 40% at 10% 95%, rgba(31,154,71,.12), transparent 70%); mix-blend-mode:screen; }
      #grain { inset:0; width:100%; height:100%; opacity:.09; mix-blend-mode:overlay; image-rendering:pixelated; }
      #vig { inset:0; background:radial-gradient(120% 95% at 50% 50%, transparent 55%, rgba(0,0,0,.62) 100%); }
      #strip { left:0; top:650px; height:360px; width:100%; opacity:0; }
      #strip .row { position:absolute; top:0; left:0; display:flex; gap:26px; padding:46px 0; background:#0a0f0d; border-top:1px solid #1d3a29; border-bottom:1px solid #1d3a29; }
      #strip .row::before, #strip .row::after { content:''; position:absolute; left:0; right:0; height:16px; background:repeating-linear-gradient(90deg, #050807 0 22px, transparent 22px 46px); }
      #strip .row::before { top:15px; } #strip .row::after { bottom:15px; }
      #strip .f { width:176px; height:264px; flex:none; background:#101a15 center/cover; border:1px solid #274a36; }
      #txt { left:0; right:0; opacity:0; }
      #txt.center { top:0; bottom:0; display:flex; align-items:center; justify-content:center; padding-bottom:230px; }
      #txt.center span { font-size:112px; font-weight:600; color:#eef3ef; letter-spacing:-.01em; text-align:center; max-width:1500px; line-height:1.05; }
      #txt.center span em { color:#3ddc6a; font-style:italic; font-weight:500; }
      #txt.lower { bottom:0; height:300px; background:linear-gradient(0deg, rgba(3,6,5,.92) 8%, transparent); display:flex; align-items:flex-end; padding:0 0 76px 110px; }
      #txt.lower span { font-size:68px; font-weight:600; color:#eef3ef; text-shadow:0 2px 24px #000; letter-spacing:-.005em; }
      #txt.lower span::before { content:''; display:inline-block; width:7px; height:52px; background:#3ddc6a; margin-right:26px; vertical-align:-8px; box-shadow:0 0 18px #3ddc6a99; }
      #prev { right:120px; top:230px; width:640px; opacity:0; background:#0d1411; border:1px solid #234633; border-radius:14px; overflow:hidden; box-shadow:0 30px 90px #000d; font-family:Inter,system-ui,sans-serif; }
      #prev img { display:block; width:100%; aspect-ratio:1200/630; object-fit:cover; }
      #prev .m { padding:16px 20px 20px; }
      #prev b { display:block; color:#eef3ef; font-size:20px; margin-bottom:6px; }
      #prev span { color:#93a79b; font-size:15px; line-height:1.45; display:block; }
      #endc { inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:34px; opacity:0; }
      #endc img { width:760px; filter:drop-shadow(0 0 40px rgba(61,220,106,.35)); }
      #endc .t { font:600 30px Cinzel,Georgia,serif; letter-spacing:.42em; color:#dfe8e2; text-transform:uppercase; opacity:0; padding-left:.42em; }
      #endc .s { font:italic 500 44px 'Cormorant Garamond',Georgia,serif; color:#3ddc6a; opacity:0; }
      #cur { left:0; top:0; width:44px; height:44px; opacity:0; filter:drop-shadow(0 3px 8px #000c); }
      #ring { left:0; top:0; width:84px; height:84px; margin:-42px 0 0 -42px; border:3px solid #3ddc6a; border-radius:50%; opacity:0; }
      #fade { inset:0; background:#030504; opacity:0; }
    `;
    document.head.appendChild(css);

    const fx = document.createElement('div'); fx.id = 'fx';
    fx.innerHTML = `
      <div id="curtain"></div><div id="leak"></div>
      <div id="strip"><div class="row"></div></div>
      <canvas id="grain" width="480" height="270"></canvas><div id="vig"></div>
      <div id="txt"><span></span></div>
      <div id="prev"><img><div class="m"><b></b><span></span></div></div>
      <div id="endc"><img src="${D.base}brand/logo.png"><div class="t"></div><div class="s"></div></div>
      <div id="cur"><svg viewBox="0 0 24 24" width="44" height="44"><path d="M3 2l7.5 19 2.7-7.8L21 10.5z" fill="#fff" stroke="#0a0f0d" stroke-width="1.4" stroke-linejoin="round"/></svg></div>
      <div id="ring"></div><div id="fade"></div>`;
    document.body.appendChild(fx);
    for (const id of ['curtain', 'leak', 'strip', 'grain', 'txt', 'prev', 'endc', 'cur', 'ring', 'fade']) E[id] = fx.querySelector('#' + id);
    E.row = fx.querySelector('#strip .row');
    // fita: pôsteres das obras, repetidos
    const frames = [...D.posters, ...D.posters, ...D.posters];
    E.row.innerHTML = frames.map((s) => `<div class="f" style="background-image:url('${D.base}img/obra/${s}.jpg')"></div>`).join('');
    E.endT = fx.querySelector('#endc .t'); E.endS = fx.querySelector('#endc .s');
    E.endT.textContent = TL.endcard.titleText; E.endS.textContent = TL.endcard.subText;
    E.prevImg = E.prev.querySelector('img'); E.prevB = E.prev.querySelector('b'); E.prevS = E.prev.querySelector('span');
    E.prevB.textContent = D.preview.title; E.prevS.textContent = D.preview.desc; E.prevImg.src = D.preview.image;
    E.txtSpan = E.txt.querySelector('span');
    E.g = E.grain.getContext('2d');
  };

  const sceneAt = (t) => TL.scenes.find((s) => t >= s.t0 && t < s.t1) || TL.scenes[TL.scenes.length - 1];

  const maskNames = () => {
    for (const el of document.querySelectorAll('#app p, #app dd, #app .sub, #app h5, #app figcaption, #app .ev, .modal p, .modal h2')) {
      if (!el.dataset.mk) { el.dataset.mk = nameRe.test(el.textContent) ? '1' : '0'; }
      if (el.dataset.mk === '1') el.style.visibility = 'hidden';
    }
  };

  const resolve = (kf) => {
    const el = document.querySelector(kf.sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width * (kf.ax ?? 0.5), y: r.top + r.height * (kf.ay ?? 0.5) };
  };

  const cursorAt = (t) => {
    for (const grp of TL.cursor) {
      const first = grp[0].t, last = grp[grp.length - 1].t;
      if (t < first - 0.4 || t > last + 0.5) continue;
      let pos = lastCursor, vis = 1;
      if (t <= first) { const p = resolve(grp[0]); if (p) pos = { x: p.x + 60, y: p.y + 40 }; vis = clamp((t - (first - 0.4)) / 0.4); }
      else {
        let i = 0; while (i < grp.length - 1 && t > grp[i + 1].t) i++;
        const a = grp[i], b = grp[Math.min(i + 1, grp.length - 1)];
        const pa = resolve(a), pb = resolve(b);
        if (pa && pb) { const k = ease(clamp((t - a.t) / Math.max(0.001, b.t - a.t))); pos = { x: lerp(pa.x, pb.x, k), y: lerp(pa.y, pb.y, k) }; }
        else if (pb) pos = pb; else if (pa) pos = pa;
        if (t > last) vis = clamp(1 - (t - last) / 0.5);
      }
      lastCursor = pos;
      return { ...pos, vis };
    }
    return null;
  };

  // aplica rolagem/estado da cena
  const scrollFor = (sc, t) => {
    if (sc.id === 'tempo') {
      const tr = document.querySelector('.htrack'), card = document.querySelector(`.tcard[data-slug='${TL.scroll.tempo.slug}']`);
      if (tr && card) {
        const s = TL.scroll.tempo, target = Math.max(0, card.offsetLeft - 1250);
        tr.scrollLeft = target * ease(clamp((t - s.t0) / (s.t1 - s.t0)));
      }
    } else if (sc.id === 'quem') {
      const d = document.getElementById('dossie');
      if (d) window.scrollTo(0, d.offsetTop - 92 + TL.scroll.quem.drift * clamp((t - sc.t0) / (sc.t1 - sc.t0)));
    } else if (sc.id === 'destino') {
      const g = document.querySelector('.galeria'), s = TL.scroll.destino;
      if (g) window.scrollTo(0, Math.max(0, g.getBoundingClientRect().top + window.scrollY - 200) * ease(clamp((t - s.t0) / (s.t1 - s.t0))));
    } else { window.scrollTo(0, 0); }
  };

  window.__pre = (t, frame) => {
    const sc = sceneAt(t);
    maskNames();
    // 1) rolagem
    scrollFor(sc, t);
    // 2) cortina preta (aberturas) + mergulho no preto entre cenas
    const dark = t < 7.6 || t >= TL.scenes.find((s) => s.id === 'fim').t0;
    E.curtain.style.opacity = dark ? 1 : 0;
    let fa = 0; for (const b of TL.fadeAt) fa = Math.max(fa, clamp(1 - Math.abs(t - b) / 0.24));
    E.fade.style.opacity = fa;
    // 3) fita de projetor
    const on = clamp((t - 1.0) / 1.6) * (1 - clamp((t - 7.0) / 0.5));
    E.strip.style.opacity = on * 0.95;
    E.row.style.transform = `translateX(${-(t * 150) % 4000 - 200}px)`;
    // 4) texto
    let cur = null; for (const x of TL.texts) if (t >= x.t0 - 0.01 && t <= x.t1) cur = x;
    if (cur) {
      const a = Math.min(clamp((t - cur.t0) / 0.4), clamp((cur.t1 - t) / 0.4));
      E.txt.className = cur.style; E.txtSpan.textContent = cur.text;
      E.txtSpan.innerHTML = cur.style === 'center' ? cur.text.replace(/(capítulo)/, '<em>$1</em>') : cur.text;
      E.txt.style.opacity = a; E.txtSpan.style.transform = `translateY(${(1 - a) * 14}px)`;
    } else E.txt.style.opacity = 0;
    // 5) prévia de compartilhamento
    const sp = TL.sharePreview; const pa = Math.min(clamp((t - sp.t0) / 0.5), clamp((sp.t1 - t) / 0.4));
    E.prev.style.opacity = pa; E.prev.style.transform = `translateX(${(1 - ease(clamp((t - sp.t0) / 0.6))) * 90}px)`;
    // 6) cartão final
    const ec = TL.endcard;
    const endOn = t >= ec.logoIn ? clamp((t - ec.logoIn) / 0.8) * (1 - clamp((t - ec.out) / 0.8)) : 0;
    E.endc.style.opacity = endOn;
    E.endT.style.opacity = clamp((t - ec.titleIn) / 0.7); E.endS.style.opacity = clamp((t - ec.subIn) / 0.7);
    // 7) cursor
    const c = cursorAt(t);
    let out = { x: lastCursor.x, y: lastCursor.y, vis: 0, ring: 0 };
    if (c) {
      out = { x: c.x, y: c.y, vis: c.vis, ring: 0 };
      E.cur.style.transform = `translate(${c.x - 8}px, ${c.y - 4}px)`; E.cur.style.opacity = c.vis;
      for (const grp of TL.cursor) for (const k of grp) if (k.click) { const d = t - k.t; if (d >= 0 && d < 0.5) out.ring = d / 0.5; }
      if (out.ring > 0) { E.ring.style.transform = `translate(${c.x}px, ${c.y}px) scale(${0.4 + out.ring * 1.1})`; E.ring.style.opacity = 1 - out.ring; } else E.ring.style.opacity = 0;
    } else { E.cur.style.opacity = 0; E.ring.style.opacity = 0; }
    // 8) grão e tremor de projetor (determinísticos pelo número do quadro)
    const r = rng(frame * 7919 + 13); const img = E.g.createImageData(480, 270);
    for (let i = 0; i < img.data.length; i += 4) { const v = 120 + r() * 135; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
    E.g.putImageData(img, 0, 0);
    E.leak.style.opacity = 0.75 + 0.25 * Math.sin(t * 1.3) + (r() - 0.5) * 0.06;
    return out;
  };

  // congela e posiciona todas as animações/transições CSS em (t - primeiro quadro em que apareceram)
  window.__post = async (t) => {
    await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)));
    for (const a of document.getAnimations()) {
      if (!animStart.has(a)) animStart.set(a, t);
      const el = a.effect && a.effect.target;
      if (el && el.closest && el.closest('#fx')) continue;
      a.pause();
      a.currentTime = Math.max(0, (t - animStart.get(a)) * 1000);
    }
  };

  window.__waitImages = () => {
    document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; });   // imagens fora da tela também
    const all = Promise.all([...document.images].map((i) => (i.complete ? 1 : new Promise((r) => { i.onload = i.onerror = r; }))));
    return Promise.race([all, new Promise((r) => setTimeout(r, 8000))]);                         // nunca trava
  };
})();
