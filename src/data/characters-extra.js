// Personagens adicionais (mesmo esquema de characters.js).
export const extra = [
  // ---------- Guardiões da Galáxia ----------
  {
    id: 'peter-quill', nome: 'Peter Quill', heroi: 'Senhor das Estrelas', ator: 'Chris Pratt',
    grupos: ['guardioes'], status: 'sem-info', cor: '#c1272d',
    antes: 'Humano criado no espaço por Ravagers; líder dos Guardiões e filho de Ego.',
    depois: [
      [2019, 'Ultimato', 'Volta do Estalo; a versão de Gamora de 2014 não o conhece.'],
      [2022, 'Especial de Natal dos Guardiões', 'Mantis e Drax tentam dar a Quill um Natal na Terra, com Kevin Bacon de presente; Mantis revela ser meia-irmã dele.'],
      [2023, 'Guardiões da Galáxia Vol. 3', 'Ajuda a salvar Rocket do Alto Evolucionário e deixa a liderança; volta à Terra para reencontrar o avô.'],
    ],
    agora: 'De volta à Terra.', doomsday: 'Sem anúncio.',
  },
  {
    id: 'rocket', nome: 'Rocket', heroi: 'Rocket Raccoon', ator: 'Bradley Cooper (voz)',
    grupos: ['guardioes'], status: 'sem-info', cor: '#b36b1f',
    antes: 'Mercenário geneticamente alterado, mestre de armas e engenharia.',
    depois: [[2023, 'Guardiões Vol. 3', 'Sua origem é revelada; vence o Alto Evolucionário e passa a liderar uma nova equipe, com Kraglin, Cosmo, Adam Warlock, Blurp, Phyla-Vell e Groot.']],
    agora: 'Líder dos Guardiões.', doomsday: 'Sem anúncio.',
  },
  {
    id: 'nebula', nome: 'Nebula', heroi: 'Nebulosa', ator: 'Karen Gillan',
    grupos: ['guardioes'], status: 'sem-info', cor: '#2a6aa8',
    antes: 'Filha adotiva de Thanos; ajudou a derrotá-lo em Ultimato.',
    depois: [[2023, 'Guardiões Vol. 3', 'Decide ficar em Knowhere e liderar a recuperação do lugar.']],
    agora: 'Em Knowhere.', doomsday: 'Sem anúncio.',
  },
  {
    id: 'gamora', nome: 'Gamora', heroi: 'Gamora', ator: 'Zoe Saldaña',
    grupos: ['guardioes'], status: 'sem-info', cor: '#2c8a5c',
    antes: 'Filha adotiva de Thanos, morta em Vormir.',
    depois: [
      [2019, 'Ultimato', 'A Gamora de 2014 permanece no presente depois que a Nebula de 2014 é derrotada, sem lembrar do que viveu com Quill.'],
      [2023, 'Guardiões Vol. 3', 'Reencontra Quill, mas não são mais um casal. Junta-se aos Ravagers.'],
    ],
    agora: 'Com os Ravagers.', doomsday: 'Sem anúncio.',
  },
  {
    id: 'groot', nome: 'Groot', heroi: 'Groot', ator: 'Vin Diesel (voz)',
    grupos: ['guardioes'], status: 'sem-info', cor: '#5a7a2a',
    antes: 'Árvore alienígena que se sacrificou na Guerra Infinita.',
    depois: [[2023, 'Guardiões Vol. 3', 'Integra a nova equipe de Rocket.']],
    agora: 'Nos Guardiões.', doomsday: 'Sem anúncio.',
  },
  {
    id: 'drax', nome: 'Drax', heroi: 'Drax', ator: 'Dave Bautista',
    grupos: ['guardioes'], status: 'sem-info', cor: '#a02020',
    antes: 'Guerreiro em luta por vingança.',
    depois: [[2023, 'Guardiões Vol. 3', 'Aceita a paternidade e ajuda as crianças resgatadas.']],
    agora: 'Sai da equipe.', doomsday: 'Sem anúncio.',
  },
  {
    id: 'mantis', nome: 'Mantis', heroi: 'Mantis', ator: 'Pom Klementieff',
    grupos: ['guardioes'], status: 'sem-info', cor: '#2f8a6a',
    antes: 'Empata criada por Ego.',
    depois: [[2022, 'Especial de Natal dos Guardiões', 'Revela-se meia-irmã de Quill.']],
    agora: 'Sai da equipe.', doomsday: 'Sem anúncio.',
  },
  {
    id: 'adam-warlock', nome: 'Adam Warlock', heroi: 'Adam Warlock', ator: 'Will Poulter',
    grupos: ['guardioes'], status: 'sem-info', cor: '#d6a318',
    antes: 'Criado pelos Soberanos.',
    depois: [[2023, 'Guardiões Vol. 3', 'Passa a apoiar os Guardiões.']],
    agora: 'Com Rocket.', doomsday: 'Sem anúncio.',
  },

  // ---------- Wakanda / místicos ----------
  {
    id: 'okoye', nome: 'Okoye', heroi: 'Dora Milaje', ator: 'Danai Gurira',
    grupos: ['wakanda'], status: 'sem-info', cor: '#b32020',
    antes: 'Líder da Dora Milaje e Vingadora.',
    depois: [[2022, 'Wakanda Para Sempre', 'Luta contra Talokan e apoia Shuri.']],
    agora: 'Leal a Wakanda.', doomsday: 'Sem anúncio.',
  },
  {
    id: 'namora', nome: 'Namora', heroi: 'Namora', ator: 'Mabel Cadena',
    grupos: ['wakanda'], status: 'confirmado', cor: '#1a8a8a',
    antes: 'Guerreira de Talokan.',
    depois: [[2022, 'Wakanda Para Sempre', 'Participa da busca pela criadora do detector de vibranium.']],
    agora: 'Aliada de Namor.', doomsday: 'Confirmada.',
  },
  {
    id: 'attuma', nome: 'Attuma', heroi: 'Attuma', ator: 'Alex Livinalli',
    grupos: ['wakanda'], status: 'confirmado', cor: '#1a6a6a',
    antes: 'General de Talokan.',
    depois: [[2022, 'Wakanda Para Sempre', 'Luta ao lado de Namor.']],
    agora: 'Em Talokan.', doomsday: 'Confirmado.',
  },
  {
    id: 'wong', nome: 'Wong', heroi: 'Wong', ator: 'Benedict Wong',
    grupos: ['misticos'], status: 'sem-info', cor: '#b36e1f',
    antes: 'Mestre de Kamar-Taj e bibliotecário.',
    depois: [
      [2021, 'Shang-Chi (pós-créditos)', 'Investiga os Dez Anéis com Carol e Banner.'],
      [2022, 'Multiverso da Loucura', 'Participa do combate contra Wanda.'],
    ],
    agora: 'Mestre das Artes Místicas em Kamar-Taj.', doomsday: 'Sem anúncio.',
  },
  {
    id: 'america-chavez', nome: 'America Chavez', heroi: 'Miss América', ator: 'Xochitl Gomez',
    grupos: ['jovens-herois', 'misticos'], status: 'sem-info', cor: '#2f5fd0',
    antes: 'Jovem capaz de abrir portais no multiverso.',
    depois: [[2022, 'Multiverso da Loucura', 'É perseguida por Wanda e treinada em Kamar-Taj.']],
    agora: 'Em treinamento.', doomsday: 'Sem anúncio.',
  },
  {
    id: 'agatha-harkness', nome: 'Agatha Harkness', heroi: 'Agatha', ator: 'Kathryn Hahn',
    grupos: ['misticos'], status: 'sem-info', cor: '#6a2a8a',
    antes: '—',
    depois: [
      [2021, 'WandaVision', 'É a vilã da série; Wanda a derrota.'],
      [2024, 'Agatha Desde Sempre', 'Série própria sobre sua jornada pela Estrada das Bruxas.'],
    ],
    agora: 'Ligada a Wanda.', doomsday: 'Sem anúncio.',
  },

  // ---------- Jovens heróis ----------
  {
    id: 'kate-bishop', nome: 'Kate Bishop', heroi: 'Gavião Arqueiro', ator: 'Hailee Steinfeld',
    grupos: ['jovens-herois'], status: 'sem-info', cor: '#8a2a8a',
    antes: '—',
    depois: [[2021, 'Gavião Arqueiro', 'Torna-se discípula de Clint e herda o manto.']],
    agora: 'Heroína solo.', doomsday: 'Sem anúncio.',
  },
  {
    id: 'riri-williams', nome: 'Riri Williams', heroi: 'Coração de Ferro', ator: 'Dominique Thorne',
    grupos: ['jovens-herois'], status: 'sem-info', cor: '#d0332a',
    antes: '—',
    depois: [
      [2022, 'Wakanda Para Sempre', 'Primeira aparição.'],
      [2025, 'Ironheart', 'Enfrenta o Capuz e faz um pacto com Mephisto.'],
    ],
    agora: 'Gênia em Chicago.', doomsday: 'Sem anúncio.',
  },
  {
    id: 'jean-grey', nome: 'Jean Grey', heroi: 'Jean Grey', ator: 'Sadie Sink',
    grupos: ['xmen', 'jovens-herois'], status: 'sem-info', cor: '#a02152',
    antes: '—',
    depois: [[2026, 'Homem-Aranha: Novo Dia', 'Jovem telepata em busca da irmã Sara.']],
    agora: 'Vinculada a Peter.', doomsday: 'Sem anúncio.',
  },

  // ---------- TVA ----------
  {
    id: 'mobius', nome: 'Mobius M. Mobius', heroi: 'Mobius', ator: 'Owen Wilson',
    grupos: ['tva'], status: 'reportado', cor: '#d98324',
    antes: '—',
    depois: [
      [2021, 'Loki T1', 'Analista da TVA que treina Loki.'],
      [2023, 'Loki T2', 'Ajuda a manter a TVA unida.'],
    ],
    agora: 'Na TVA.', doomsday: 'Reportado.',
  },
  {
    id: 'ouroboros', nome: 'Ouroboros', heroi: 'O.B.', ator: 'Ke Huy Quan',
    grupos: ['tva'], status: 'reportado', cor: '#2c8a5c',
    antes: '—',
    depois: [[2023, 'Loki T2', 'Engenheiro da TVA.']],
    agora: 'Na TVA.', doomsday: 'Reportado.',
  },

  // ---------- Vingadores / aliados ----------
  {
    id: 'nick-fury', nome: 'Nick Fury', heroi: 'Nick Fury', ator: 'Samuel L. Jackson',
    grupos: ['vingadores'], status: 'sem-info', cor: '#333',
    antes: 'Fundador da iniciativa Vingadores.',
    depois: [
      [2019, 'Longe de Casa', 'O Fury visto na tela era o Skrull Talos, enquanto o verdadeiro estava no espaço.'],
      [2023, 'Invasão Secreta', 'Enfrenta os Skrulls rebeldes de Gravik; retorna à Terra.'],
      [2023, 'Os Marvels', 'Junto a Carol e à equipe.'],
    ],
    agora: 'Na S.A.B.E.R.', doomsday: 'Sem anúncio.',
  },
  {
    id: 'valquiria', nome: 'Valquíria', heroi: 'Valquíria', ator: 'Tessa Thompson',
    grupos: ['vingadores'], status: 'sem-info', cor: '#4a7fc4',
    antes: 'Guerreira de Asgard.',
    depois: [
      [2019, 'Ultimato', 'Torna-se rainha de Nova Asgard.'],
      [2022, 'Thor: Amor e Trovão', 'Lidera Nova Asgard e luta contra Gorr.'],
    ],
    agora: 'Rainha de Nova Asgard.', doomsday: 'Sem anúncio.',
  },
  {
    id: 'hope-van-dyne', nome: 'Hope van Dyne', heroi: 'Vespa', ator: 'Evangeline Lilly',
    grupos: ['vingadores'], status: 'sem-info', cor: '#d6a318',
    antes: 'Heroína com tecnologia Pym.',
    depois: [[2023, 'Quantumania', 'Participa da luta contra Kang.']],
    agora: 'Ao lado de Scott.', doomsday: 'Sem anúncio.',
  },
  {
    id: 'jane-foster', nome: 'Jane Foster', heroi: 'Poderosa Thor', ator: 'Natalie Portman',
    grupos: ['vingadores'], status: 'sem-info', cor: '#d6b020',
    antes: 'Cientista, ex-namorada de Thor.',
    depois: [[2022, 'Amor e Trovão', 'Como Poderosa Thor, morre de câncer ao ser apoiada pelo Mjolnir; vai para Valhalla.']],
    agora: 'Em Valhalla.', doomsday: 'Sem anúncio.',
  },

  // ---------- Novos Vingadores ----------
  {
    id: 'valentina', nome: 'Valentina Allegra de Fontaine', heroi: 'Val', ator: 'Julia Louis-Dreyfus',
    grupos: ['novos-vingadores'], status: 'sem-info', cor: '#8a2a2a',
    antes: '—',
    depois: [
      [2021, 'Falcão e o Soldado Invernal', 'Aparece como agente enigmática.'],
      [2025, 'Thunderbolts*', 'Diretora da CIA; apresenta o time como Novos Vingadores.'],
    ],
    agora: 'Controla a narrativa pública.', doomsday: 'Sem anúncio.',
  },

  // ---------- Quarteto ----------
  {
    id: 'franklin', nome: 'Franklin Richards', heroi: 'Franklin', ator: 'Elenco infantil',
    grupos: ['quarteto'], status: 'confirmado', cor: '#2f84c4',
    antes: '—',
    depois: [
      [2025, 'Primeiros Passos', 'Nasce com poder cósmico imenso.'],
      [2025, 'Pós-créditos', 'Aparece diante de uma figura de máscara e capa verde.'],
    ],
    agora: 'Filho de Reed e Sue.', doomsday: 'Confirmado.',
  },
  {
    id: 'herbie', nome: 'H.E.R.B.I.E.', heroi: 'H.E.R.B.I.E.', ator: 'Matthew Wood (voz)',
    grupos: ['quarteto'], status: 'confirmado', cor: '#5a7a8a',
    antes: '—',
    depois: [[2025, 'Primeiros Passos', 'Robô assistente do Quarteto.']],
    agora: 'Com o Quarteto.', doomsday: 'Confirmado.',
  },
  {
    id: 'surfista-prateada', nome: 'Shalla-Bal', heroi: 'Surfista Prateada', ator: 'Julia Garner',
    grupos: ['quarteto'], status: 'sem-info', cor: '#aab4c8',
    antes: '—',
    depois: [[2025, 'Primeiros Passos', 'Ex-arauto de Galactus; empurra-o pelo portal.']],
    agora: 'Desaparece pelo portal.', doomsday: 'Sem anúncio.',
  },

  // ---------- Eternos ----------
  {
    id: 'sersi', nome: 'Sersi', heroi: 'Sersi', ator: 'Gemma Chan',
    grupos: ['eternos'], status: 'sem-info', cor: '#2a8a5a',
    antes: '—',
    depois: [[2021, 'Eternos', 'Lidera os Eternos contra os Deviantes e Arishem.']],
    agora: 'Na Terra.', doomsday: 'Sem anúncio.',
  },
  {
    id: 'dane-whitman', nome: 'Dane Whitman', heroi: 'Cavaleiro Negro', ator: 'Kit Harington',
    grupos: ['eternos'], status: 'sem-info', cor: '#2a2a3a',
    antes: '—',
    depois: [[2021, 'Eternos', 'Aparece na cena pós-créditos como o novo Cavaleiro Negro.']],
    agora: 'Em Londres.', doomsday: 'Sem anúncio.',
  },

  // ---------- Heróis de rua e vilões ----------
  {
    id: 'jessica-jones', nome: 'Jessica Jones', heroi: 'Jessica Jones', ator: 'Krysten Ritter',
    grupos: ['herois-de-rua'], status: 'sem-info', cor: '#6a4aa8',
    antes: 'Detetive com superforça (Netflix).',
    depois: [[2026, 'Demolidor: Renascido T2', 'Une-se a Matt na resistência.']],
    agora: 'Em Nova York.', doomsday: 'Sem anúncio.',
  },
  {
    id: 'thaddeus-ross', nome: 'Thaddeus Ross', heroi: 'Hulk Vermelho', ator: 'Harrison Ford',
    grupos: ['viloes'], status: 'sem-info', cor: '#a02020',
    antes: 'General perseguidor do Hulk.',
    depois: [[2025, 'Admirável Mundo Novo', 'Presidente dos EUA; vira Hulk Vermelho e acaba preso no Raft.']],
    agora: 'Prisioneiro.', doomsday: 'Sem anúncio.',
  },
  {
    id: 'samuel-sterns', nome: 'Samuel Sterns', heroi: 'O Líder', ator: 'Tim Blake Nelson',
    grupos: ['viloes'], status: 'sem-info', cor: '#3f9142',
    antes: 'Cientista exposto ao sangue de Banner.',
    depois: [[2025, 'Admirável Mundo Novo', 'Mente por trás da conspiração; avisa Sam sobre ameaças de outros mundos.']],
    agora: 'Preso.', doomsday: 'Sem anúncio.',
  },
  {
    id: 'kang', nome: 'Nathaniel Richards', heroi: 'Kang, o Conquistador', ator: 'Jonathan Majors',
    grupos: ['viloes'], status: 'sem-info', cor: '#4a2a8a',
    antes: '—',
    depois: [
      [2021, 'Loki T1', 'Aquele Que Permanece, uma variante.'],
      [2023, 'Quantumania', 'Tenta conquistar o Reino Quântico e acaba derrotado.'],
    ],
    agora: 'Substituído pelo Destino como vilão principal.', doomsday: 'Sem anúncio.',
  },
  {
    id: 'thanos', nome: 'Thanos', heroi: 'Thanos', ator: 'Josh Brolin',
    grupos: ['viloes'], status: 'sem-info', cor: '#7a4a9a',
    antes: 'Titã que queria equilibrar o universo.',
    depois: [[2019, 'Ultimato', 'Thor o decapita em 2018; a versão de 2014 é desintegrada no estalo de Tony.']],
    agora: 'Morto.', doomsday: 'Sem anúncio.',
  },
  {
    id: 'galactus', nome: 'Galactus', heroi: 'Galactus', ator: 'Ralph Ineson',
    grupos: ['viloes'], status: 'sem-info', cor: '#8a2a8a',
    antes: '—',
    depois: [[2025, 'Primeiros Passos', 'Marca a Terra; é levado pelo portal.']],
    agora: 'Preso em outro lugar.', doomsday: 'Sem anúncio.',
  },
];
