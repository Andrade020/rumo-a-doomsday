import { characters, characterMap } from '../src/data/characters.js';
import { groups, groupMap } from '../src/data/groups.js';
let erros = 0; const err = (m) => { console.log('ERRO:', m); erros++; };
const ids = new Set();
for (const c of characters) {
  if (ids.has(c.id)) err(`id duplicado ${c.id}`); ids.add(c.id);
  for (const g of c.grupos) if (!groupMap[g]) err(`${c.id}: grupo inexistente ${g}`);
  if (!c.grupos.length) err(`${c.id}: sem grupo`);
}
for (const g of groups) for (const m of g.membros) if (!characterMap[m]) err(`${g.id}: membro inexistente ${m}`);
const semFaixa = characters.filter((c) => !groupMap[c.grupos[0]]);
console.log(`${characters.length} personagens, ${groups.length} grupos, ${erros} erros`);
process.exit(erros ? 1 : 0);
