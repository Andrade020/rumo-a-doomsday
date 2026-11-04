// Uso: node scripts/imagens.mjs   -> lista quais imagens existem e quais faltam em public/img/
import { characters } from '../src/data/characters.js';
import { existsSync } from 'node:fs';

let ok = 0;
const faltam = [];
for (const c of characters) {
  if (existsSync(new URL(`../public/img/${c.id}.jpg`, import.meta.url))) ok++;
  else faltam.push(c);
}
console.log(`Com imagem: ${ok}/${characters.length}\n\nFaltam (arquivo -> personagem):`);
for (const c of faltam) console.log(`  ${c.id}.jpg  ->  ${c.heroi} (${c.ator})`);
