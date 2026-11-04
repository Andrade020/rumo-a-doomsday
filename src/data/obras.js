// Detalhe de cada obra da linha do tempo (aparece ao clicar no card).
// p = parágrafos · liga = ligação com Doomsday · pers = ids de personagens (só aparecem os que estão no site)

export const obras = {
  ultimato: {
    p: [
      'Cinco anos depois do Estalo de Thanos, os Vingadores que restaram (Steve Rogers, Tony Stark, Natasha Romanoff, Thor, Bruce Banner, Clint Barton, James Rhodes, Nebula e Rocket) descobrem com Scott Lang que o Reino Quântico permite viajar no tempo. O plano: recolher as Joias do Infinito no passado e desfazer o Estalo.',
      'Funciona, mas custa caro. Natasha morre em Vormir para conseguir a Joia da Alma, e Tony morre ao usar as Joias para desintegrar o exército de Thanos. Steve devolve as Joias a cada época e decide ficar no passado, ao lado de Peggy Carter. Ele reaparece idoso e entrega o escudo a Sam Wilson.',
      'Dois efeitos explicam boa parte do que veio depois: uma versão de Loki, de 2012, escapa com a Tesseract durante a missão (ponto de partida da série Loki), e Thor deixa Nova Asgard com Valquíria para viajar com os Guardiões da Galáxia.',
    ],
    liga: 'É a origem das histórias de multiverso do MCU e o último filme com Tony e Natasha vivos. O retorno de Steve Rogers, com Chris Evans, foi anunciado para Doomsday.',
    pers: ['steve-rogers', 'sam-wilson', 'thor', 'scott-lang'],
  },
  wandavision: {
    p: [
      'Sozinha depois da perda de Visão, Wanda Maximoff cria em Westview, Nova Jersey, uma realidade em forma de sitcom que atravessa várias décadas da TV americana. Nela, vive com um Visão recriado e com os gêmeos Billy e Tommy.',
      'A agente da S.W.O.R.D. Monica Rambeau tenta entender o fenômeno e ganha poderes ao atravessar a barreira. Agatha Harkness, que se passava por vizinha, revela-se a bruxa por trás de parte da trama e quer o poder de Wanda.',
      'Wanda desfaz o feitiço, perde a família e assume o nome de Feiticeira Escarlate. A cena final a mostra estudando o Darkhold, o livro proibido que a leva ao segundo filme do Doutor Estranho. Em paralelo, a S.W.O.R.D. reconstrói o corpo de Visão, o Visão Branco.',
    ],
    liga: 'Mostra como Wanda se tornou uma ameaça de escala cósmica. Não há anúncio oficial dela em Doomsday.',
    pers: ['wanda-maximoff', 'monica-rambeau'],
  },
  fatws: {
    p: [
      'Sam Wilson entrega o escudo do Capitão América a um museu, mas o governo dos EUA o repassa a John Walker. Sam e Bucky Barnes, que mal se suportavam, se unem para enfrentar os Flag Smashers, um grupo que quer manter o mundo como era durante o Blip.',
      'A série revisita o legado do símbolo: Isaiah Bradley, soldado negro usado como cobaia do mesmo soro de Steve, mostra a Sam o lado sombrio do escudo. Walker perde o controle, mata um Flag Smasher em público e é destituído do título.',
      'No fim, Sam aceita o escudo. Zemo, o vilão de Guerra Civil, reaparece, e a cena pós-créditos revela Sharon Carter como a Power Broker. Valentina Allegra de Fontaine, futura diretora da CIA, surge pela primeira vez.',
    ],
    liga: 'Sam, Bucky e Walker reaparecem em Thunderbolts* e estão confirmados em Doomsday.',
    pers: ['sam-wilson', 'bucky-barnes', 'john-walker'],
  },
  loki1: {
    p: [
      'A variante de Loki que escapou com a Tesseract em 2012 é capturada pela TVA (Autoridade de Variância Temporal), agência que protege a "Linha do Tempo Sagrada", a única que, segundo ela, deveria existir. Mobius M. Mobius o recruta para ajudar a caçar outra variante perigosa: Sylvie.',
      'Os dois descobrem que os Guardiões do Tempo são uma farsa. A TVA foi criada por Aquele Que Permanece, que evitou guerras entre universos eliminando qualquer linha do tempo diferente. Sylvie o mata, e o multiverso se abre.',
      'Ao fim da temporada, Loki vê estátuas de várias versões de Kang, o Conquistador. É aqui que o MCU planta o vilão que seria o centro da Saga do Multiverso.',
    ],
    liga: 'Loki está confirmado em Doomsday. Mobius e Ouroboros, da TVA, são reportados.',
    pers: ['loki', 'mobius'],
  },
  'viuva-negra': {
    p: [
      'O filme se passa entre Guerra Civil e Guerra Infinita. Natasha Romanoff, foragida do governo, volta ao passado: a Sala Vermelha, programa de espiãs que a treinou. Ela se reúne com Yelena Belova, sua irmã de criação, e com Alexei Shostakov (Guardião Vermelho) e Melina Vostokoff.',
      'A "família" destrói a base de Dreykov, chefe da Sala Vermelha, e liberta as outras Viúvas. Na cena pós-créditos, já depois de Ultimato, Yelena visita o túmulo de Natasha e é recrutada por Valentina, que lhe aponta Clint Barton como culpado pela morte da irmã.',
    ],
    liga: 'Yelena e o Guardião Vermelho, protagonistas de Thunderbolts*, estão confirmados em Doomsday.',
    pers: ['yelena-belova', 'red-guardian'],
  },
  'shang-chi': {
    p: [
      'Xu Shang-Chi, manobrista em San Francisco, é arrastado de volta à vida que escondia: seu pai, Wenwu, comanda os Dez Anéis, uma organização milenar que usa anéis de poder para controlar um império secreto. Com a amiga Katy e a irmã Xialing, ele tenta impedir Wenwu de invadir Ta Lo, a aldeia mística de sua mãe.',
      'Shang-Chi derrota o pai e herda os Dez Anéis. Xialing assume a organização criminosa.',
      'A cena pós-créditos mais interessante para Doomsday reúne Wong, Carol Danvers e Bruce Banner analisando os anéis: eles estão emitindo um sinal, e os personagens não sabem ao certo para onde. O público costuma ler isso como indício de outros universos ou de uma ameaça vinda de fora da Terra, mas o filme não explica.',
    ],
    liga: 'Simu Liu está confirmado em Doomsday.',
    pers: ['shang-chi'],
  },
  eternos: {
    p: [
      'Sete mil anos atrás, os Celestiais criaram os Eternos, seres quase imortais enviados à Terra para combater os Deviantes. Eles vivem escondidos entre os humanos até que os Deviantes reaparecem e Sersi reúne o grupo.',
      'A grande revelação: a "Emergência", o nascimento de um Celestial chamado Tiamut dentro da Terra, destruiria o planeta. Os Eternos discutem se devem impedir. Ikaris, que trai o grupo, morre, e Tiamut é petrificado; o corpo permanece no Oceano Índico e depois vira a Ilha Celestial de Capitão América: Admirável Mundo Novo.',
      'O desfecho deixa em aberto o julgamento da humanidade por Arishem, o Celestial. Na cena pós-créditos, Dane Whitman, o Cavaleiro Negro, aparece num dilema ligado à espada de sua família.',
    ],
    liga: 'Sem anúncio para Doomsday. A Ilha Celestial importa para Admirável Mundo Novo e para a disputa pela adamantium.',
    pers: [],
  },
  gaviao: {
    p: [
      'Em Nova York, perto do Natal, Clint Barton só quer voltar para casa e passar as festas com os filhos. Kate Bishop, uma jovem arqueira, o envolve ao vestir o antigo traje de Ronin e se meter com o crime organizado.',
      'Yelena Belova, contratada por Valentina, chega para vingar Natasha e acusa Clint pela morte dela. A trama revela Wilson Fisk, o Rei do Crime, como o chefe por trás da máfia. No fim, Clint e Kate se acertam e ela herda o legado de Gavião Arqueiro.',
    ],
    liga: 'Valentina, Yelena e Fisk, que reaparecem em Thunderbolts* e Demolidor: Renascido, aparecem aqui.',
    pers: ['yelena-belova'],
  },
  nwh: {
    p: [
      'Depois que Mysterio revela a identidade de Peter Parker ao mundo, Peter pede ajuda ao Doutor Estranho: um feitiço para que todos esqueçam quem ele é. Peter interrompe o feitiço várias vezes, e o resultado abre buracos no multiverso.',
      'Vilões de outras realidades aparecem: Doutor Octopus, Duende Verde, Electro, Homem-Areia e Lagarto, de versões anteriores do Homem-Aranha. Peter decide curá-los em vez de deixá-los morrer, com a ajuda de outras versões de si mesmo (Tobey Maguire e Andrew Garfield).',
      'Para consertar tudo, Strange lança um feitiço que apaga Peter da memória de todos. Peter perde os amigos e ainda vê Tia May morrer durante o filme.',
    ],
    liga: 'É o primeiro filme do MCU a mostrar o multiverso aberto, e o ponto de partida de Homem-Aranha: Novo Dia (2026), que se passa antes de Doomsday.',
    pers: ['peter-parker', 'doutor-estranho'],
  },
  dsmm: {
    p: [
      'Doutor Estranho conhece America Chavez, uma adolescente capaz de abrir portais entre universos. Um demônio a persegue, e Strange procura ajuda em Wanda Maximoff, sem saber que ela quer o poder de America para reencontrar seus filhos.',
      'O filme visita outros universos, como a Terra-838, onde os Illuminati incluem Mordo, a Capitã Carter, Reed Richards (John Krasinski) e o Professor X (Patrick Stewart). Wanda elimina todos eles, e Strange precisa de uma versão de si mesmo, corrompida pelo Darkhold, para detê-la.',
      'Wanda se sacrifica destruindo o Darkhold. Na cena pós-créditos, Clea, uma feiticeira de outra dimensão, aparece para avisar sobre as incursões, a colisão entre universos.',
    ],
    liga: 'As "incursões" citadas por Clea são o tipo de ameaça multiversal de Doomsday. Patrick Stewart, que apareceu aqui como Xavier de outra Terra, está no elenco do novo filme.',
    pers: ['doutor-estranho', 'wanda-maximoff', 'professor-x'],
  },
  thor4: {
    p: [
      'Thor, tentando se aposentar do heroísmo, viaja com os Guardiões da Galáxia e volta à ativa para enfrentar Gorr, o Carniceiro de Deuses, que mata deuses depois que o seu próprio ignorou a morte de sua filha.',
      'Jane Foster, doente de câncer, empunha o Mjolnir e vira a Poderosa Thor, mas o martelo a enfraquece enquanto a cura. O filme termina com Gorr pedindo à Eternidade que reviva a filha, Love. Gorr morre, e Thor adota Love.',
      'Jane morre e é recebida em Valhalla. Na cena pós-créditos, Zeus (Russell Crowe) promete vingança contra Thor.',
    ],
    liga: 'Chris Hemsworth está confirmado em Doomsday. India Rose Hemsworth, que faz Love, é citada em relatos.',
    pers: ['thor'],
  },
  bpwf: {
    p: [
      'Depois da morte de T\'Challa, Wakanda tenta se proteger. Quando uma máquina que detecta vibranium aparece no oceano, Namor, rei do reino subaquático de Talokan, exige que Wakanda lhe entregue a inventora, ou haverá guerra.',
      'Shuri, que perdeu o irmão e a mãe, Ramonda, toma a Erva em forma de coração e assume o manto de Pantera Negra para enfrentar Namor. Riri Williams (Ironheart), inventora do detector, é apresentada no filme.',
      'Na cena pós-créditos, Shuri visita o Haiti e conhece o filho de T\'Challa, Toussaint.',
    ],
    liga: 'Letitia Wright, Winston Duke, Tenoch Huerta (Namor), Mabel Cadena (Namora) e Alex Livinalli (Attuma) estão confirmados em Doomsday.',
    pers: ['shuri', 'mbaku', 'namor', 'namora', 'attuma'],
  },
  quantumania: {
    p: [
      'Scott Lang, Hope van Dyne, Hank Pym, Janet van Dyne e Cassie Lang são sugados para o Reino Quântico, onde Janet viveu por décadas e conheceu Kang, o Conquistador, exilado lá.',
      'Kang quer sair do Reino Quântico para voltar a conquistar. A família Lang o enfrenta com a ajuda de moradores e rebeldes e o derrota, mas o filme deixa claro que existem muitas versões dele.',
      'As cenas pós-créditos mostram o Conselho dos Kangs. A Fase 5 caminhava para um filme chamado Vingadores: A Dinastia Kang. Depois que o ator Jonathan Majors foi dispensado, em dezembro de 2023, a Marvel trocou o vilão principal por Victor von Doom, e o filme virou Doomsday.',
    ],
    liga: 'Paul Rudd e Kathryn Newton (Cassie) estão confirmados em Doomsday.',
    pers: ['scott-lang', 'cassie-lang'],
  },
  gotg3: {
    p: [
      'Rocket é gravemente ferido por Adam Warlock, enviado pelo Alto Evolucionário, o cientista que o criou. Para salvá-lo, os Guardiões precisam achar o código que desativa o mecanismo que o mantém em risco.',
      'O filme conta a infância de Rocket e como ele foi criado e maltratado nos laboratórios do Alto Evolucionário. A equipe vence o vilão e resgata dezenas de animais. Nebula, Drax e Mantis seguem seus caminhos, Peter Quill volta à Terra para ver o avô, e Rocket assume a liderança da nova equipe.',
    ],
    liga: 'Nenhum Guardião foi anunciado em Doomsday.',
    pers: [],
  },
  loki2: {
    p: [
      'A TVA se desfaz: com Aquele Que Permanece fora de cena, as linhas do tempo se ramificam sem controle. Loki sofre de "time slipping", e Mobius, Hunter B-15 e os outros tentam salvar a agência.',
      'A busca leva ao Tear do Tempo, o mecanismo que sustenta a TVA. Ouroboros (O.B.), o engenheiro, ajuda, e uma versão de Kang, Victor Timely, está no meio da trama.',
      'No fim, Loki assume o trono e passa a sustentar o multiverso com a Árvore Sagrada da Realidade, como o "Deus das Histórias".',
    ],
    liga: 'Tom Hiddleston está confirmado em Doomsday. Owen Wilson (Mobius) e Ke Huy Quan (Ouroboros) são reportados.',
    pers: ['loki', 'mobius', 'ouroboros'],
  },
  marvels: {
    p: [
      'Carol Danvers, Monica Rambeau e Kamala Khan passam a trocar de lugar sempre que usam seus poderes, por causa de uma ligação quântica criada por Dar-Benn, uma Kree que busca vingança em nome do seu povo.',
      'Com a ajuda de Nick Fury, elas viajam por planetas como Aladna, onde as pessoas se comunicam cantando, e enfrentam Dar-Benn. A relação entre Carol e Monica, que cresceu sem ela, é o centro emocional do filme.',
      'Na cena do meio dos créditos, Monica aparece em um universo alternativo e encontra Hank McCoy, o Fera (Kelsey Grammer), uma referência direta aos X-Men dos filmes da Fox.',
    ],
    liga: 'Kelsey Grammer está confirmado em Doomsday. Kamala e Monica aparecem em rumores.',
    pers: ['fera', 'kamala-khan', 'monica-rambeau'],
  },
  dpwl: {
    p: [
      'A TVA recruta Wade Wilson para uma missão: salvar o universo da Fox onde Logan morreu. Wade tenta convencer outro Logan a ajudá-lo, e os dois acabam no Vazio, local fora do tempo governado por Cassandra Nova, irmã do Professor X.',
      'No Vazio, eles se juntam a heróis esquecidos de outras franquias, como Blade, Elektra e Gambit (Channing Tatum), e enfrentam Cassandra. Há ainda uma participação de Chris Evans como Johnny Storm, o Tocha Humana da Fox.',
      'O filme abre o MCU a mutantes e a versões de heróis de outros estúdios. Tatum, que há anos tentava fazer um filme do Gambit, é um dos nomes confirmados em Doomsday.',
    ],
    liga: 'Marco da chegada dos heróis da Fox. Gambit está confirmado; Wolverine e Deadpool seguem em rumor.',
    pers: ['gambit', 'wolverine', 'deadpool'],
  },
  bnw: {
    p: [
      'Sam Wilson e Joaquin Torres recuperam itens roubados no México e logo descobrem que o novo presidente, Thaddeus Ross, quer reformar os Vingadores e criar um tratado para dividir a adamantium achada na Ilha Celestial, formada quando o Celestial Tiamut surgiu no Oceano Índico.',
      'Uma conspiração entra em cena: o Dr. Samuel Sterns, o Líder, que ganhou inteligência com o sangue de Bruce Banner, manipula mentes com tecnologia e música. Ross, exposto à radiação gama, vira o Hulk Vermelho e destrói parte da Casa Branca antes de ser contido por Sam.',
      'No fim, Isaiah Bradley é inocentado, o tratado é assinado e Torres é convidado aos Vingadores. Na cena pós-créditos, Sterns, preso, avisa Sam sobre ameaças vindas de outros mundos.',
    ],
    liga: 'Sam e Torres estão confirmados em Doomsday, e Bucky faz uma ponta neste filme. O aviso de Sterns sobre "outros mundos" liga o filme ao multiverso.',
    pers: ['sam-wilson', 'joaquin-torres', 'bucky-barnes'],
  },
  dd1: {
    p: [
      'Depois da morte de Foggy Nelson, assassinado por Bullseye, Matt Murdock abandona o Demolidor e tenta combater a injustiça como advogado. Wilson Fisk, ex-Rei do Crime, é eleito prefeito de Nova York.',
      'Os dois se enfrentam em frentes opostas: Fisk com política e poder, Matt com a lei e com o passado. No meio, surge Muse, um serial killer ligado à terapeuta Heather Glenn, que vira comissária de saúde mental de Fisk. A série também traz Frank Castle, o Justiceiro, e Hector Ayala, o Tigre Branco.',
    ],
    liga: 'Sem anúncio para Doomsday.',
    pers: [],
  },
  tbolts: {
    p: [
      'Valentina Allegra de Fontaine, diretora da CIA, manda Yelena, John Walker, Ava Starr e Antonia Dreykov (a Treinadora) para um cofre secreto, numa armadilha para que se matem e destruam as provas do Projeto Sentinela. Ava mata Antonia, e o grupo encontra um homem amnésico, Bob Reynolds.',
      'Bob é o Sentinela, e seu alter ego sombrio, o Vazio, cobre Nova York de escuridão e prende as pessoas nas suas piores memórias. Yelena e os outros entram na mente dele e o salvam, abraçando-o e dizendo que acreditam nele.',
      'Pressionada, Valentina apresenta o time como os Novos Vingadores, aproveitando o nome. A cena pós-créditos pula 14 meses: os Novos Vingadores disputam a marca com os Vingadores de Sam, e a Torre detecta uma nave extradimensional marcada com um grande número 4.',
    ],
    liga: 'Os 14 meses desta cena são o intervalo que a premissa oficial de Doomsday usa. Todos os principais, menos Valentina, estão confirmados.',
    pers: ['yelena-belova', 'bucky-barnes', 'john-walker', 'ava-starr', 'red-guardian', 'sentry'],
  },
  ironheart: {
    p: [
      'Riri Williams, expulsa do MIT, volta a Chicago ainda em luto pela melhor amiga e pelo padrasto. Para financiar sua armadura, une-se a Parker Robbins, o Capuz, líder de uma gangue de ladrões que usa um manto misterioso.',
      'Riri cria uma IA a partir da memória de Natalie, a amiga morta: a N.A.T.A.L.I.E. Conforme os roubos ficam violentos e o manto corrompe Parker, ela perde a armadura e a IA, mas recomeça com a ajuda da família.',
      'No final, tira o manto de Parker, mas faz um acordo com Mephisto, o demônio ligado ao manto, para trazer Natalie de volta. A cena do meio dos créditos mostra Parker procurando ajuda com as Stanton, uma família de magos.',
    ],
    liga: 'Sem anúncio para Doomsday.',
    pers: [],
  },
  ff: {
    p: [
      'Em 1964, na Terra-828, um mundo retrofuturista, o Quarteto Fantástico (Reed Richards, Sue Storm, Johnny Storm e Ben Grimm) é celebrado há quatro anos, desde que ganhou poderes no espaço. Sue está grávida, e a Terra recebe a visita da Surfista Prateada, arauto de Galactus.',
      'Galactus quer o bebê de Sue por causa do poder cósmico que sentiu nele. Franklin nasce durante a fuga do Quarteto. Reed planeja mover a Terra com pontes de teletransporte, e Shalla-Bal, a Surfista, trai Galactus e o empurra por um portal. Sue morre pelo esforço, mas é revivida por Franklin.',
      'A cena do meio dos créditos pula quatro anos: Sue lê para Franklin, sai para buscar outro livro e volta para ver o filho com um homem de capa verde que segura uma máscara de metal: Victor von Doom.',
    ],
    liga: 'O Quarteto inteiro está confirmado em Doomsday, junto de Franklin e H.E.R.B.I.E. Esta cena é a primeira aparição de Doom no MCU.',
    pers: ['reed-richards', 'sue-storm', 'johnny-storm', 'ben-grimm', 'franklin', 'herbie', 'doutor-destino'],
  },
  wonderman: {
    p: [
      'Simon Williams, um ator em dificuldades, perde um papel e a namorada no mesmo dia. Descobre que tem poderes iônicos e entra na mira do Departamento de Controle de Danos (DODC), que passa a vigiá-lo.',
      'Ao lado de Trevor Slattery (Ben Kingsley), o ex-"Mandarim", ele disputa um papel no remake de Wonder Man e vê seus poderes saírem do controle. A série brinca com a indústria do cinema e apresenta a "Cláusula Doorman", que proíbe pessoas com superpoderes de trabalhar em Hollywood.',
      'Slattery assume a culpa por uma explosão e é preso; Simon invade o DODC para libertá-lo.',
    ],
    liga: 'Sem ligação direta com Doomsday.',
    pers: [],
  },
  dd2: {
    p: [
      'Fisk impõe lei marcial em Nova York e caça vigilantes com a Força-Tarefa Anti-Vigilantes. Matt vai à clandestinidade e reúne aliados, entre eles Jessica Jones, para resistir.',
      'No fim da temporada, Matt revela publicamente que é o Demolidor. A terceira e última temporada, prevista para março de 2027, começa com Matt preso e Fisk exilado, e tem Luke Cage, Danny Rand (Punho de Ferro) e Elektra no elenco.',
    ],
    liga: 'Sem anúncio para Doomsday.',
    pers: [],
  },
  bnd: {
    p: [
      'Quatro anos depois do feitiço do Doutor Estranho, ninguém se lembra de Peter Parker. Ele protege Nova York sozinho, longe dos Vingadores. O estresse faz seus poderes evoluírem, e ele encontra Jean Grey, uma jovem telepata em busca da irmã desaparecida.',
      'O elenco inclui Zendaya, Jacob Batalon, Jon Bernthal (Justiceiro), Florence Pugh (Yelena), Mark Ruffalo (Hulk) e Michael Mando (Escorpião). O filme foi lançado em 31 de julho de 2026 e se passa antes de Doomsday.',
    ],
    liga: 'Tom Holland aparece em relatos para Doomsday, sem confirmação oficial.',
    pers: ['peter-parker', 'yelena-belova', 'bruce-banner'],
  },
  visionquest: {
    p: [
      'Depois de ser ressuscitado em WandaVision, Visão (Paul Bettany) vive escondido e tenta entender quem é, conversando com IAs dentro da sua programação, como F.R.I.D.A.Y., J.A.R.V.I.S. e E.D.I.T.H. Quando colocam uma recompensa pela cabeça dele, ele foge com um adolescente que pode ser seu filho reencarnado.',
      'A série traz Ultron (James Spader) de volta e foi criada por Terry Matalas. Estreou em 13 de outubro de 2026, com oito episódios e final em novembro.',
    ],
    liga: 'Visão não foi anunciado para Doomsday.',
    pers: [],
  },
  doomsday: {
    p: [
      'Catorze meses depois de Thunderbolts*, com o multiverso em colapso, heróis de três universos se reúnem contra o Doutor Destino: os Vingadores, Wakandanos e Novos Vingadores da Terra-616, o Quarteto Fantástico da Terra-828 e os X-Men da Terra-10005.',
      'Os irmãos Russo dirigem, com roteiro de Michael Waldron, Stephen McFeely, Chris McKenna e Erik Sommers. Robert Downey Jr. interpreta o vilão. A estreia é em 16/12/2026 no Reino Unido e em 18/12/2026 nos EUA; a sequência, Vingadores: Guerras Secretas, está marcada para 17/12/2027.',
    ],
    liga: 'Tudo o que está nesta linha do tempo leva até aqui.',
    pers: ['doutor-destino', 'steve-rogers', 'thor'],
  },
};
