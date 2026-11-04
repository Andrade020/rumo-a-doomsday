# Catálogo Vingadores: Doomsday

Catálogo em texto de grupos e personagens do MCU (e de universos relacionados), montado como preparação para *Vingadores: Doomsday* (EUA: 18/12/2026). Etapas planejadas: **1) texto (esta fase)** → 2) imagens → 3) site clicável por personagem.

Dados coletados em 01/11/2026, principalmente via Wikipédia (EN) e imprensa especializada. Veja `fontes.md`.

## Índice

| Arquivo | Conteúdo |
|---|---|
| `01-doomsday-visao-geral.md` | Informações oficiais do filme: elenco confirmado, equipe, datas, premissa, marketing |
| `02-cronologia-mcu.md` | Filmes, séries e especiais por fase, com datas |
| `03-grupos.md` | Grupos/equipes: Vingadores, Novos Vingadores, Thunderbolts, Quarteto Fantástico, X-Men, Wakanda, Guardiões etc. |
| `04-personagens-vingadores-e-aliados.md` | Fichas: Vingadores clássicos, Capitão América/Sam, Thor, Loki, Homem-Formiga etc. |
| `05-personagens-novos-vingadores-e-thunderbolts.md` | Yelena, Bucky, Walker, Ghost, Red Guardian, Sentinela/Void, Valentina etc. |
| `06-personagens-quarteto-e-xmen.md` | Quarteto Fantástico (Terra-828), X-Men (Terra-10005 / Fox), Deadpool & Wolverine |
| `07-personagens-wakanda-mistico-urbano.md` | Wakanda, místicos, heróis de rua (Netflix/Disney+), jovens heróis |
| `08-viloes-e-ameacas.md` | Doutor Destino, Kang, Thanos, Galactus, Fisk etc. |
| `09-rumores-e-nao-confirmados.md` | Personagens citados em rumores (**apenas nomes e status, sem spoilers de enredo**) |
| `fontes.md` | Fontes e grau de confiabilidade |

## Legenda de status

- ✅ **Confirmado**: anunciado oficialmente pela Marvel/Disney ou visto em material oficial.
- 🟡 **Reportado**: citado por imprensa confiável, sem confirmação oficial.
- 🔶 **Rumor**: origem em insiders/vazamentos, não verificado.
- ❔ **Sem informação**.

## Política de spoilers

- Eventos de obras **já lançadas** estão descritos (é o objetivo: "o que aconteceu até agora").
- Vazamentos sobre *Doomsday* e *Secret Wars* foram lidos como contexto, mas **o enredo vazado não é reproduzido**. Em `09-rumores-e-nao-confirmados.md` constam apenas nomes e status.

## Avisos de qualidade dos dados

- Pesquisa mostrou **divergências entre fontes** (contagem de elenco, nomes confirmados, datas). Onde há conflito, marquei.
- Dados de 2026 vieram de resumos da Wikipédia; vale revisar antes de publicar no site.

---
## App web (Vite)

```
npm install
npm run dev                                   # servidor local
SITE_URL=https://seu-site.com npm run build   # gera dist/ (pronto para publicar)
node scripts/validar.mjs                      # checa ids/grupos dos dados
```

### Prévia ao compartilhar o link
- `public/og/` tem uma imagem 1200×630 para o início, o Doutor Destino, a linha do tempo e cada personagem (`python scripts/gerar_og.py`).
- O build cria `dist/p/<slug>/index.html` com as tags certas para cada página; os botões **Copiar link** usam esses endereços. O site usa rotas com `#`, que apps de mensagem não enxergam, por isso essas páginas existem.
- **Defina `SITE_URL`** ao fazer o build. Sem ele as prévias usam endereços relativos e não funcionam fora do navegador.

### Imagens
- Originais pesados ficam em `arquivo-original/` (não são publicados). `python scripts/otimizar_imagens.py` gera as versões leves em `public/img/`.
- Dados em `src/data/` (`characters.js`, `characters-extra.js`, `groups.js`, `timeline.js`, `obras.js`, `destino.js`, `texto.js`).
- Pôsteres, logos e arte de quadrinhos são © Marvel Studios / Disney, só para uso pessoal.

## Aviso legal
Projeto de fã, sem fins comerciais e sem qualquer vínculo com a Marvel ou a Disney. Nomes, personagens, logos, pôsteres e arte de quadrinhos são © Marvel / Disney e aparecem aqui apenas para identificar e comentar as obras; não são cobertos pela licença do código (MIT). Fotos de atores: Wikimedia Commons, com licenças e créditos em `public/img/CREDITOS.json`. Se você é titular de direitos e deseja a remoção de algum material, abra uma issue.

## Autor
Criado por **Lucas Andrade**. Conheça mais do meu trabalho em **https://andrade020.github.io/**.
A arte de capa e de compartilhamento do site foi gerada com IA por mim (personagens © Marvel / Disney).
