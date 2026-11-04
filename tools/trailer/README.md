# Vídeo promocional — ferramentas

Um comando regenera tudo (a partir da raiz do projeto):

```
python tools/trailer/make.py
```

Saída em `dist/trailer/`: `trailer_master.mp4` (qualidade máxima) e `trailer_leve.mp4` (≤ 30 MB).
Requisitos: Node, Python 3 com `numpy`, `scipy` e `imageio-ffmpeg` (ou `ffmpeg` no PATH), Google Chrome, e `npm install` dentro de `tools/trailer/` (instala `playwright-core`).
Atenção: `npm run build` apaga a pasta `dist/`; por isso o `make.py` roda o build primeiro e só depois grava o vídeo.

## Como funciona

| Arquivo | Papel |
|---|---|
| `timeline.json` | **Única fonte de tempo.** Cenas, textos, cursor, rolagens, impactos, cliques, acordes. Lida pelo render e pelo áudio. |
| `render.mjs` | Para cada quadro (30 por segundo) posiciona o **site real** (build do repositório) no instante `t`, congela as animações CSS em `t − início` e captura com Playwright. Os quadros vão por pipe ao ffmpeg. Não há gravação de tela. |
| `stage.js` | Roda dentro da página: sobreposições (fita de projetor, textos, cursor, grão, cartão final) e controle determinístico do tempo. |
| `audio.py` | Trilha original, sintetizada em numpy/scipy (sem samples). Impactos, whooshes, cliques e o riser caem nos instantes da timeline. |
| `make.py` | Orquestra: valida o tempo de leitura dos textos → build → render → áudio → `loudnorm` em duas passadas (−14 LUFS, pico real ≤ −1,5 dBTP) → versões master e leve. |

## O que é real e o que é simulado
- **Real:** todas as telas (linha do tempo, faixas de personagens, janela de detalhe, filtros, página do Doutor Destino, botão de copiar link). São o build do site. O movimento (expansão ao passar o mouse, abertura da janela) é o CSS do próprio site, com o tempo controlado quadro a quadro; os cliques e o hover são eventos reais do navegador.
- **Sobreposições (desenhadas em código):** cursor, fita de projetor, textos, grão, vinheta e cartão final. A prévia de compartilhamento usa as tags e a imagem reais geradas pelo build.
- **Ocultação de nomes:** durante a captura, trechos que contêm nomes de pessoas (atores, criadores) e as datas são ocultados por CSS/JS no render; o site em si não é alterado.

## Áudio
Original e sintetizado: drone e pad (sawtooth detunada com filtro), arpejo pluck, tiques de projetor (ruído filtrado), impactos (seno com queda de altura + ruído), riser (ruído com banda varrendo + tom) e reverb por convolução com resposta sintetizada. As medições de loudness e pico são feitas por análise (ffmpeg `loudnorm`); o áudio não foi ouvido durante a produção.

## Ajustes comuns
- Textos, tempos, cursor e cortes: `timeline.json` (o `make.py` recusa textos curtos demais para a leitura).
- Mudou algo no site? Basta rodar `make.py` de novo: o vídeo usa o build atual.
