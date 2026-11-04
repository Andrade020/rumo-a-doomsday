# Imagens dos personagens

Coloque aqui uma imagem por personagem, com o **id** do personagem como nome:

`steve-rogers.jpg`, `sam-wilson.jpg`, `shuri.jpg` ...

(Lista de ids em `src/data/characters.js`.) Formato retrato (~3:4), .jpg.
Para grupos use `grupo-<id>.jpg` (opcional). Se o arquivo não existir, o app mostra um retrato provisório.
Use apenas imagens oficiais/licenciadas (press kits da Marvel/Disney).

## Dicas para o layout em faixas
- A imagem é exibida em faixas verticais lado a lado: use foto **vertical (retrato)**, com o rosto no **terço superior** (o corte é centralizado no topo).
- Tamanho sugerido: ~800×1200 px, JPG.
- Rode `node scripts/imagens.mjs` na raiz do projeto para ver quais ainda faltam.

## Estrutura atual
- `char/<id>.png` — pôsteres/imagens dos personagens (MCU Wiki, © Marvel/Disney; uso pessoal).
- `<id>.jpg` e `cut/<id>.png` — fotos de atores (Wikimedia Commons) e recortes.
- O app mostra personagem primeiro e cai para o ator (botão "Imagem" na página inicial).
- Visão e Valquíria não têm imagem de personagem; ficam com a foto do ator.
