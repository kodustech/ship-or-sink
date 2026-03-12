window.PEOPLE_PAGER_RARE_SCENARIOS = [
  {
    id: "shadow-roadmap",
    sprite: "exec",
    speaker: "Founder",
    role: "side quest",
    rarity: "rare",
    unlockKey: "career-run-1",
    actMin: 2,
    difficulty: 4,
    priority: 4,
    title: "O founder chamou de \"side quest\". Já tem canal, emoji e expectativa.",
    body: "A feature não entrou no roadmap. Só começou a existir socialmente. Se você matar cedo, vira bloqueio. Se aceitar, vira precedente.",
    left: {
      label: "Dar nome ao desvio",
      summary: "Você assume que existe custo político e corta antes de virar sistema paralelo.",
      effects: { trust: 2, team: 1, delivery: -2 },
      result: "Ficou explícito que nem todo entusiasmo vira prioridade. Metade da empresa chamou isso de maturidade. A outra metade, de travar o jogo.",
      after(state) {
        state.flags.roadmapSplit = false;
      },
    },
    right: {
      label: "Absorver por fora",
      summary: "Você deixa viver em paralelo e torce para não contaminar o core.",
      effects: { delivery: 1, trust: -2, team: -3 },
      result: "A side quest ganhou ar de inevitável. A engenharia entendeu que basta aparecer contexto suficiente para nascer outro produto.",
      after(state) {
        state.flags.roadmapSplit = true;
        state.flags.founderBypass = true;
      },
    },
    en: {
      title: "The founder called it a side quest. It already has a channel, emoji, and expectation.",
      body: "The feature never entered the roadmap. It just started existing socially. Kill it early and you look blocking. Accept it and it becomes precedent.",
      left: {
        label: "Name the detour",
        summary: "You make the political cost explicit and cut it before it becomes a parallel system.",
        result: "It became clear that not every burst of enthusiasm becomes priority. Half the company called it maturity. The other half called it slowdown.",
      },
      right: {
        label: "Absorb it sideways",
        summary: "You let it live in parallel and hope it does not contaminate the core.",
        result: "The side quest started feeling inevitable. Engineering learned that enough context can always spawn another product.",
      },
    },
  },
  {
    id: "salary-band-leak",
    sprite: "people",
    speaker: "People partner",
    role: "comp leak",
    rarity: "rare",
    unlockKey: "career-run-2",
    actMin: 2,
    difficulty: 4,
    priority: 4,
    title: "Uma planilha de faixa salarial vazou no chat errado.",
    body: "Ninguém perguntou se é real. Já foram direto para a pergunta mais cara: então por que eu estou aqui embaixo?",
    left: {
      label: "Abrir a lógica",
      summary: "Você expõe critério, contexto e incoerência antes que a ficção faça isso por você.",
      effects: { team: 2, trust: 1, budget: -2 },
      result: "A conversa ficou brutal, mas adulta. Transparência não barateia folha. Só barateia cinismo.",
      after(state) {
        state.flags.compTension = false;
        state.flags.fairnessDebt = false;
      },
    },
    right: {
      label: "Fechar o incêndio",
      summary: "Você trata como vazamento isolado e tenta impedir que a thread vire tribunal.",
      effects: { delivery: 1, trust: -2, team: -3 },
      result: "A crise saiu da timeline. Entrou no corredor. Esse tipo de silêncio costuma ter perna longa.",
      after(state) {
        state.flags.compTension = true;
        state.flags.fairnessDebt = true;
      },
    },
    en: {
      title: "A salary-band spreadsheet leaked into the wrong chat.",
      body: "Nobody asked if it was real. They jumped straight to the expensive question: then why am I down here?",
      left: {
        label: "Open the logic",
        summary: "You expose criteria, context, and inconsistency before fiction does it for you.",
        result: "The conversation got brutal, but adult. Transparency does not make comp cheaper. It only makes cynicism cheaper.",
      },
      right: {
        label: "Seal the fire",
        summary: "You treat it as an isolated leak and try to stop the thread from becoming a tribunal.",
        result: "The crisis left the timeline and entered the hallway. That kind of silence tends to travel.",
      },
    },
  },
  {
    id: "vp-skip",
    sprite: "exec",
    speaker: "VP Product",
    role: "skip-level",
    rarity: "rare",
    unlockKey: "career-trust-scar",
    actMin: 3,
    difficulty: 4,
    priority: 5,
    title: "A VP fez skip-level com sua squad sem te avisar.",
    body: "A conversa veio embrulhada como curiosidade. O efeito real foi outro: agora todo mundo mede quem de fato opera acima de você.",
    left: {
      label: "Pedir alinhamento",
      summary: "Você trata o bypass como problema de sistema, não como ofensa pessoal.",
      effects: { trust: 2, team: 1, delivery: -1 },
      result: "A fronteira ficou mais clara. Você não recuperou poder; recuperou legibilidade.",
      after(state) {
        state.flags.authorityCrack = false;
        state.flags.founderBypass = false;
      },
    },
    right: {
      label: "Fingir normalidade",
      summary: "Você evita parecer inseguro e engole a erosão de papel.",
      effects: { delivery: 1, trust: -3, team: -2 },
      result: "A sala seguiu educada. Sua função ficou um pouco mais opcional do que estava ontem.",
      after(state) {
        state.flags.authorityCrack = true;
      },
    },
    en: {
      title: "A VP ran skip-levels with your squad without telling you.",
      body: "It was framed as curiosity. The actual effect was different: now everyone is measuring who truly operates above you.",
      left: {
        label: "Ask for alignment",
        summary: "You treat the bypass as a system problem, not a personal insult.",
        result: "The boundary became clearer. You did not regain power; you regained legibility.",
      },
      right: {
        label: "Pretend it is normal",
        summary: "You avoid looking insecure and swallow the erosion of role.",
        result: "The room stayed polite. Your function became slightly more optional than it was yesterday.",
      },
    },
  },
  {
    id: "cost-kill-switch",
    sprite: "finance",
    speaker: "CFO",
    role: "cost kill-switch",
    rarity: "rare",
    unlockKey: "career-budget-scar",
    actMin: 3,
    difficulty: 4,
    priority: 5,
    title: "Finanças quer um kill switch para toda chamada cara de IA até sexta.",
    body: "Não é uma review de arquitetura. É o jeito da empresa dizer que seu produto deixou de parecer experimento simpático e começou a parecer linha de custo.",
    left: {
      label: "Aceitar a trava",
      summary: "Você preserva runway e assume um produto menos encantador por um tempo.",
      effects: { budget: 4, trust: 1, delivery: -2, team: -1 },
      result: "A empresa voltou a respirar planilha. O produto perdeu um pouco da magia que vendia o pitch.",
      after(state) {
        state.flags.tokenOverhang = false;
      },
    },
    right: {
      label: "Defender o fluxo",
      summary: "Você protege a experiência e tenta ganhar tempo político.",
      effects: { delivery: 2, trust: -1, budget: -4, team: -1 },
      result: "O uso ficou bonito por mais uma semana. O CFO agora conhece seu nome pelos motivos errados.",
      after(state) {
        state.flags.tokenOverhang = true;
      },
    },
    en: {
      title: "Finance wants a kill switch for every expensive AI call by Friday.",
      body: "This is not an architecture review. It is the company telling you the product stopped looking like a charming experiment and started looking like a cost line.",
      left: {
        label: "Take the switch",
        summary: "You protect runway and accept a less magical product for a while.",
        result: "The company started breathing spreadsheet again. The product lost some of the magic that sold the pitch.",
      },
      right: {
        label: "Defend the flow",
        summary: "You protect the experience and try to buy political time.",
        result: "Usage looked beautiful for one more week. The CFO now knows your name for the wrong reasons.",
      },
    },
  },
  {
    id: "survivor-guilt",
    sprite: "people",
    speaker: "Senior engineer",
    role: "retention spiral",
    rarity: "rare",
    unlockKey: "career-team-scar",
    actMin: 4,
    difficulty: 5,
    priority: 5,
    title: "Quem ficou começou a perguntar se jogar certo ainda compensa neste time.",
    body: "Não foi uma rebelião. Foi pior. A conversa veio baixa, racional e com cara de gente atualizando plano B em silêncio.",
    left: {
      label: "Abrir a ferida",
      summary: "Você nomeia a perda, o desgaste e o que a gestão tolerou tarde demais.",
      effects: { team: 3, trust: 1, delivery: -2 },
      result: "A squad não saiu feliz. Saiu menos sozinha. Às vezes isso já segura a borda.",
      after(state) {
        state.flags.attritionRisk = false;
        state.flags.layoffWhisper = false;
      },
    },
    right: {
      label: "Proteger o sprint",
      summary: "Você empurra a conversa emocional para depois da próxima entrega.",
      effects: { delivery: 2, team: -4, trust: -1 },
      result: "A sprint seguiu limpa. O vínculo afetivo com a empresa, não.",
      after(state) {
        state.flags.attritionRisk = true;
        state.flags.cultureCrack = true;
      },
    },
    en: {
      title: "The people who stayed started asking whether playing fair still pays off here.",
      body: "It was not a rebellion. Worse. The tone was low, rational, and sounded like people quietly updating their plan B.",
      left: {
        label: "Open the wound",
        summary: "You name the loss, the wear, and what management tolerated too late.",
        result: "The squad did not leave happy. It left less alone. Sometimes that is enough to hold the edge.",
      },
      right: {
        label: "Protect the sprint",
        summary: "You push the emotional conversation past the next delivery.",
        result: "The sprint stayed clean. The emotional bond with the company did not.",
      },
    },
  },
  {
    id: "demo-day-incident",
    sprite: "sre",
    speaker: "Solutions engineer",
    role: "live demo",
    rarity: "rare",
    unlockKey: "career-first-win",
    actMin: 4,
    difficulty: 5,
    priority: 5,
    when: (state) => state.flags.benchmarkDebt || state.flags.founderTweet || state.flags.autonomyPromise,
    title: "A demo mais importante do quarter caiu ao vivo com o cliente mais barulhento na sala.",
    body: "Agora você escolhe qual verdade sacrificar primeiro: confiança imediata, narrativa comercial ou tempo de engenharia para apagar o teatro.",
    left: {
      label: "Narrar o tombo",
      summary: "Você conduz o incidente ao vivo e transforma constrangimento em transparência.",
      effects: { trust: 3, team: 1, delivery: -2, budget: -1 },
      result: "Ninguém chamou de elegante. Muita gente chamou de adulto. Às vezes é o máximo disponível.",
      after(state) {
        state.flags.outageNarrative = false;
      },
    },
    right: {
      label: "Prometer conserto rápido",
      summary: "Você compra tempo comercial e manda engenharia correr atrás do palco.",
      effects: { delivery: 2, trust: -2, team: -3, budget: -2 },
      result: "A call terminou viva. A noite do time também.",
      after(state) {
        state.flags.outageNarrative = true;
        state.flags.managerHeroics = true;
      },
    },
    en: {
      title: "The most important demo of the quarter fell apart live with the loudest customer in the room.",
      body: "Now you choose which truth to sacrifice first: immediate trust, commercial narrative, or engineering time spent cleaning up theater.",
      left: {
        label: "Narrate the fall",
        summary: "You lead the incident live and turn embarrassment into transparency.",
        result: "Nobody called it elegant. A lot of people called it adult. Sometimes that is the ceiling.",
      },
      right: {
        label: "Promise a quick fix",
        summary: "You buy commercial time and send engineering to run after the stage.",
        result: "The call stayed alive. So did your team's night.",
      },
    },
  },
];
