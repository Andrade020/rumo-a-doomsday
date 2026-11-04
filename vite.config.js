import { defineConfig } from 'vite';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { characters } from './src/data/characters.js';

// Endereço público do site (para links absolutos nas prévias de compartilhamento).
// Exemplo:  SITE_URL=https://meusite.com  npm run build
const SITE = (process.env.SITE_URL || '').replace(/\/$/, '');
const abs = (p) => (SITE ? `${SITE}/${p}` : p);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const NOME = 'Rumo a Doomsday';
const HOME = {
  title: `${NOME} — onde cada um está antes de Vingadores: Doomsday`,
  desc: 'Personagens, grupos e tudo o que aconteceu no MCU desde Ultimato, para chegar a Vingadores: Doomsday (18/12/2026) sabendo quem é quem.',
  image: 'og/home.jpg',
};

const tags = ({ title, desc, image, url }) => `
    <meta name="description" content="${esc(desc)}" />
    ${SITE ? `<link rel="canonical" href="${esc(url)}" />` : ''}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${NOME}" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(desc)}" />
    <meta property="og:image" content="${esc(abs(image))}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${esc(url)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(desc)}" />
    <meta name="twitter:image" content="${esc(abs(image))}" />`;

const FRASE = {
  confirmado: 'está confirmado no elenco de Vingadores: Doomsday.',
  reportado: 'é citado como possível participação em Vingadores: Doomsday, sem confirmação oficial.',
  rumor: 'aparece em rumores sobre Vingadores: Doomsday, sem confirmação oficial.',
};

// Páginas compartilháveis: cada uma ganha um endereço /p/<slug>/ com a prévia certa
// (o site usa rotas com #, que os apps de mensagem não enxergam).
function paginasCompartilhaveis() {
  const lista = [
    { slug: 'destino', hash: '#/destino', title: `Doutor Destino — ${NOME}`, desc: 'Quem é o Doutor Destino: a história nos quadrinhos, a trajetória no MCU e o que se sabe sobre Vingadores: Doomsday.', image: 'og/destino.jpg' },
    { slug: 'desde-ultimato', hash: '#/linha-do-tempo', title: `Desde Ultimato — ${NOME}`, desc: 'A linha do tempo do MCU de Vingadores: Ultimato até Doomsday, com o que cada obra muda.', image: 'og/linha-do-tempo.jpg' },
  ];
  for (const c of characters) {
    if (c.status === 'sem-info' || c.id === 'doutor-destino') continue;
    lista.push({ slug: c.id, hash: `#/personagem/${c.id}`, title: `${c.heroi} (${c.ator}) — ${NOME}`, desc: `${c.heroi}, com ${c.ator}, ${FRASE[c.status]} Veja o que aconteceu desde Ultimato.`, image: `og/${c.id}.jpg` });
  }
  return lista;
}

function metaPlugin() {
  return {
    name: 'meta-e-compartilhamento',
    transformIndexHtml(html) {
      return html.replace('<!--META-->', tags({ ...HOME, url: abs('') || '.' }));
    },
    closeBundle() {
      const out = join(process.cwd(), 'dist');
      const paginas = paginasCompartilhaveis();
      for (const p of paginas) {
        const dir = join(out, 'p', p.slug);
        mkdirSync(dir, { recursive: true });
        const url = abs(`p/${p.slug}/`);
        writeFileSync(join(dir, 'index.html'), `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(p.title)}</title>${tags({ ...p, url })}
    <meta name="theme-color" content="#06090a" />
    <meta http-equiv="refresh" content="0; url=../../${p.hash}" />
    <script>location.replace('../../${p.hash}');</script>
  </head>
  <body style="background:#06090a;color:#9aa;font-family:sans-serif"><p>Abrindo… <a href="../../${p.hash}">continuar</a></p></body>
</html>
`);
      }
      writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\n${SITE ? `Sitemap: ${SITE}/sitemap.xml\n` : ''}`);
      if (SITE) {
        const urls = [`${SITE}/`, ...paginas.map((p) => `${SITE}/p/${p.slug}/`)];
        writeFileSync(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`);
      } else {
        console.warn('\n⚠  SITE_URL não definido: as prévias de compartilhamento usam endereços relativos e não funcionam no WhatsApp/Discord/X.\n   Defina o endereço final:  SITE_URL=https://seu-site.com npm run build\n');
      }
      console.log(`✓ ${paginas.length} páginas de compartilhamento geradas em dist/p/`);
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [metaPlugin()],
});
