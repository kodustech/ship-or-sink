window.PEOPLE_PAGER_CHARACTER_POOLS = {
  pm: ["Lia", "Nora", "Mina", "Eva", "Bia"],
  staff: ["Rafa", "Maya", "Noa", "Davi", "Iris"],
  people: ["Clara", "Sara", "Nina", "Jo", "Elisa"],
  sre: ["Gabi", "Tess", "Rui", "Enzo", "Nina"],
  exec: ["Theo", "Ayla", "Bruno", "Elena", "Caio"],
  senior: ["Leo", "Sofia", "Caio", "Maya", "Luca"],
};

window.PEOPLE_PAGER_ARCS = [
  { id: "pm-friction", poolKey: "pm", sprite: "pm" },
  { id: "staff-friction", poolKey: "staff", sprite: "eng" },
  { id: "growth-friction", poolKey: "people", sprite: "people" },
  { id: "reliability-friction", poolKey: "sre", sprite: "sre" },
  { id: "founder-friction", poolKey: "exec", sprite: "exec" },
  { id: "retention-friction", poolKey: "senior", sprite: "eng" },
];

window.PEOPLE_PAGER_ARC_SCENARIOS = [
  {
    id: "pm-friction-a1",
    arcId: "pm-friction",
    role: "planning",
    actMin: 1,
    difficulty: 2,
    priority: 3,
    title: "O PM jurou que este é o último ajuste do sprint. De novo.",
    body: "Todo pedido vem com contexto, urgência e figurinha de cliente. O sprint já parece um doc colaborativo.",
    left: {
      label: "Fechar a janela",
      summary: "Você pede uma semana de contrato real com o time.",
      effects: { trust: 2, delivery: 1, team: -1 },
      result: "A squad voltou a acreditar no board. Produto passou a te chamar de pouco colaborativo.",
      after(state) {
        state.flags.arcPmGuard = true;
        state.flags.arcPmChaos = false;
      },
    },
    right: {
      label: "Abrir exceção",
      summary: "Você compra paz com produto e vende caos para dentro.",
      effects: { delivery: 2, team: -2, trust: -2 },
      result: "Por fora pareceu parceria. Por dentro pareceu feature factory com branding agile.",
      after(state) {
        state.flags.arcPmChaos = true;
        state.flags.arcPmGuard = false;
        state.flags.scopeThrash = true;
      },
    },
    en: {
      title: "The PM wants to reshuffle the sprint again.",
      body: "Each request makes sense. Together they destroy rhythm.",
      left: {
        label: "Close the window",
        summary: "You ask for one week without thrash.",
        result: "The queue gained shape. The relationship lost softness.",
      },
      right: {
        label: "Take the change",
        summary: "You buy total flexibility for now.",
        result: "The week looked agile. The team read contract collapse.",
      },
    },
  },
  {
    id: "pm-friction-a3",
    arcId: "pm-friction",
    role: "customer date",
    actMin: 3,
    difficulty: 4,
    priority: 4,
    when: (state) => state.flags.arcPmGuard || state.flags.arcPmChaos,
    title: "O PM prometeu uma data numa call em que engenharia nem estava.",
    body: "Agora a pergunta não é o que cabe. É se você mata a fantasia na frente do cliente ou dentro do time.",
    left: {
      label: "Reduzir na cara dura",
      summary: "Você reabre escopo antes que o time pague a ficção.",
      effects: { delivery: 2, trust: 2, team: 1, budget: -1 },
      result: "A conta grande ouviu uma verdade feia. Seu time ouviu que ainda existe gestão.",
      after(state) {
        state.flags.arcPmGuard = false;
        state.flags.arcPmChaos = false;
        state.flags.scopeThrash = false;
      },
    },
    right: {
      label: "Salvar a cena",
      summary: "Você segura a promessa e torce para throughput virar milagre.",
      effects: { delivery: 2, trust: -2, team: -4 },
      result: "A data continuou viva no CRM. O time virou a variável de ajuste.",
      after(state) {
        state.flags.arcPmChaos = false;
        state.flags.roadmapSplit = true;
      },
    },
    en: {
      title: "The PM already gave a date to a large account.",
      body: "Now the negotiation became your operating problem.",
      left: {
        label: "Come back smaller",
        summary: "You reopen scope before breaking the team.",
        result: "The truth hurt early. That is usually cheaper.",
      },
      right: {
        label: "Try to hit it all",
        summary: "You keep the promise and push the bill inward.",
        result: "The date stayed alive. Human bandwidth did not.",
      },
    },
  },
  {
    id: "staff-friction-a1",
    arcId: "staff-friction",
    role: "planning room",
    actMin: 1,
    difficulty: 2,
    priority: 3,
    title: "Seu staff derrubou a estimativa no planning com um 'isso aqui não fecha'.",
    body: "Talvez ele esteja certo. O problema é que agora a sala compara lucidez técnica com autoridade gerencial.",
    left: {
      label: "Resolver no 1:1",
      summary: "Você encerra a discussão pública e leva pro particular.",
      effects: { trust: 2, team: 1, delivery: -1 },
      result: "O planning terminou civilizado. A temperatura do 1:1 subiu uns cinco graus.",
      after(state) {
        state.flags.arcStaffCrack = false;
      },
    },
    right: {
      label: "Confrontar na hora",
      summary: "Você responde ali mesmo pra não perder autoridade.",
      effects: { delivery: 1, trust: -3, team: -2 },
      result: "A sala viu comando. Também viu que comando é uma palavra cara.",
      after(state) {
        state.flags.arcStaffCrack = true;
        state.flags.authorityCrack = true;
      },
    },
    en: {
      title: "Your staff engineer tore down the team estimate in planning.",
      body: "They may be right. The room is now measuring authority, not just technical judgment.",
      left: {
        label: "Take it offline",
        summary: "You preserve the room and align in private.",
        result: "The meeting ended intact. The tension stayed stored.",
      },
      right: {
        label: "Settle it live",
        summary: "You buy the conflict in public so you do not lose command.",
        result: "The room saw decisiveness. It also saw a crack.",
      },
    },
  },
  {
    id: "staff-friction-a4",
    arcId: "staff-friction",
    role: "1:1",
    actMin: 4,
    difficulty: 5,
    priority: 5,
    when: (state) => state.flags.arcStaffCrack || state.flags.platformBet || state.metrics.trust <= 42,
    title: "Seu staff avisou que vai parar de ser o adulto funcional da sala.",
    body: "Se ele recuar, o clima melhora e a qualidade da decisão cai junto. O famoso alinhamento barato.",
    left: {
      label: "Redistribuir o atrito",
      summary: "Você espalha critério e aceita perder velocidade.",
      effects: { team: 2, trust: 1, delivery: -2 },
      result: "Parou de existir um único para-raio. O quarter sentiu.",
      after(state) {
        state.flags.arcStaffCrack = false;
        state.flags.platformBet = false;
      },
    },
    right: {
      label: "Cobrar lealdade",
      summary: "Você pede menos fricção pública e mais disciplina de palco.",
      effects: { delivery: 1, trust: -3, team: -3 },
      result: "A sala ficou mais limpa. A confiança, menos.",
      after(state) {
        state.flags.attritionRisk = true;
      },
    },
    en: {
      title: "Your staff engineer said they are tired of being the annoying adult in the room.",
      body: "If they step back, the friction goes away. So does the judgment.",
      left: {
        label: "Spread the weight",
        summary: "You redistribute the conflict and accept slower motion.",
        result: "The function stopped living in one person.",
      },
      right: {
        label: "Demand alignment",
        summary: "You ask for less public friction and more room loyalty.",
        result: "The friction got quieter. The distance did not.",
      },
    },
  },
  {
    id: "growth-friction-a1",
    arcId: "growth-friction",
    role: "career check-in",
    actMin: 1,
    difficulty: 2,
    priority: 3,
    title: "No 1:1, uma pessoa forte perguntou: \"o que falta de verdade para eu subir?\"",
    body: "Se você responder com continua assim, ela traduz como não tenho coragem de te dizer.",
    left: {
      label: "Dar régua real",
      summary: "Você abre critério de verdade mesmo sem prometer timing.",
      effects: { team: 2, trust: 1, delivery: -1 },
      result: "A conversa ficou mais adulta e um pouco menos confortável.",
      after(state) {
        state.flags.arcGrowthDebt = false;
      },
    },
    right: {
      label: "Ganhar tempo",
      summary: "Você entrega narrativa, carinho e zero compromisso verificável.",
      effects: { delivery: 1, team: -2, trust: -1 },
      result: "Ninguem brigou. A dívida entrou no roadmap invisivel.",
      after(state) {
        state.flags.arcGrowthDebt = true;
        state.flags.promoDebt = true;
      },
    },
    en: {
      title: "A strong engineer asked what is truly missing for the next level.",
      body: "A vague answer buys short peace and long debt.",
      left: {
        label: "Give the real bar",
        summary: "You make the criteria explicit even without promising timing.",
        result: "The conversation got more adult and less comfortable.",
      },
      right: {
        label: "Promise it later",
        summary: "You keep the case in narrative territory.",
        result: "Nothing exploded today. The issue did not die.",
      },
    },
  },
  {
    id: "growth-friction-a4",
    arcId: "growth-friction",
    role: "offer risk",
    actMin: 4,
    difficulty: 5,
    priority: 5,
    when: (state) => state.flags.arcGrowthDebt || state.flags.promoDebt || state.flags.fairnessDebt,
    title: "A mesma pessoa chegou com oferta externa e um \"prefiro ficar, mas preciso acreditar\".",
    body: "Agora não é mais conversa de carreira. É teste A/B de credibilidade gerencial.",
    left: {
      label: "Pagar coerência",
      summary: "Você corrige a distorção agora e aceita o precedente caro.",
      effects: { team: 2, trust: -1, budget: -4 },
      result: "Você reteve a pessoa. O resto do time abriu uma aba mental chamada entendi o jogo.",
      after(state) {
        state.flags.arcGrowthDebt = false;
        state.flags.promoDebt = false;
      },
    },
    right: {
      label: "Perder sem teatro",
      summary: "Você protege critério e aceita o buraco operacional.",
      effects: { trust: 2, budget: 1, delivery: -2, team: -3 },
      result: "A história ficou limpa no all-hands. O backlog ficou bem menos elegante.",
      after(state) {
        state.flags.attritionRisk = true;
      },
    },
    en: {
      title: "The same person showed up with an external offer and very little patience.",
      body: "This is no longer about feedback. It is about credibility.",
      left: {
        label: "Pay for coherence",
        summary: "You recognize the case and buy an expensive precedent.",
        result: "You kept the person. The rest of the squad recalculated everything.",
      },
      right: {
        label: "Accept the exit",
        summary: "You protect the rule and accept losing capacity.",
        result: "The story stayed clean. The hole did not.",
      },
    },
  },
  {
    id: "reliability-friction-a1",
    arcId: "reliability-friction",
    role: "build health",
    actMin: 1,
    difficulty: 2,
    priority: 3,
    title: "SRE soltou um já estamos chamando sorte de processo.",
    body: "Nada caiu em prod do jeito cinematográfico. Só ficou tudo meio radioativo.",
    left: {
      label: "Parar para sanear",
      summary: "Você compra atraso para voltar a confiar no caminho feliz.",
      effects: { team: 2, trust: 1, delivery: -2 },
      result: "O fluxo respirou. O quarter encolheu.",
      after(state) {
        state.flags.arcReliabilityDebt = false;
        state.flags.reliabilityDebt = false;
      },
    },
    right: {
      label: "Empilhar workaround",
      summary: "Você protege feature e trata erosão como taxa de entrega.",
      effects: { delivery: 2, trust: -1, team: -1 },
      result: "A fila andou. A base começou a te odiar em silêncio.",
      after(state) {
        state.flags.arcReliabilityDebt = true;
        state.flags.reliabilityDebt = true;
      },
    },
    en: {
      title: "Your SRE said the team is treating noise as normal.",
      body: "Nothing broke all the way. Almost everything got slightly worse.",
      left: {
        label: "Pause and clean it",
        summary: "You buy delay to recover the base.",
        result: "The flow breathed. The quarter shrank.",
      },
      right: {
        label: "Absorb the noise",
        summary: "You protect features and treat erosion as normal cost.",
        result: "The queue moved. The base lost dignity.",
      },
    },
  },
  {
    id: "reliability-friction-a3",
    arcId: "reliability-friction",
    role: "postmortem",
    actMin: 3,
    difficulty: 4,
    priority: 4,
    when: (state) => state.flags.arcReliabilityDebt || state.flags.quietPatch || state.flags.outageNarrative,
    title: "SRE falou que já tem deploy ruim sendo vendido como trade-off consciente.",
    body: "Esse é o momento em que cultura vira só um nome educado para hábito ruim repetido.",
    left: {
      label: "Segurar o ritual",
      summary: "Você trata o problema como sistema, não como culpado da semana.",
      effects: { team: 3, trust: -1, delivery: -1 },
      result: "A honestidade sobreviveu. A paciência do topo, um pouco menos.",
      after(state) {
        state.flags.arcReliabilityDebt = false;
        state.flags.quietPatch = false;
      },
    },
    right: {
      label: "Escolher um culpado",
      summary: "Você da um nome ao problema para a sala respirar agora.",
      effects: { trust: 2, delivery: 1, team: -4 },
      result: "O call terminou mais leve. O time saiu menor.",
      after(state) {
        state.flags.blameCulture = true;
      },
    },
    en: {
      title: "SRE said the team is already hiding bad deploys behind narrative.",
      body: "It still looks like an exception. This is usually how it becomes culture.",
      left: {
        label: "Protect the ritual",
        summary: "You treat the problem as systemic, not personal blame.",
        result: "Candor survived. Not all executive patience did.",
      },
      right: {
        label: "Give it a name",
        summary: "You offer one clear culprit to reduce anxiety.",
        result: "The room got relief. The team lost safety.",
      },
    },
  },
  {
    id: "founder-friction-a2",
    arcId: "founder-friction",
    role: "announcement",
    actMin: 2,
    difficulty: 3,
    priority: 3,
    title: "O founder quer anunciar piloto antes de existir algo que sobreviva a uma demo hostil.",
    body: "Não é só hype. É backlog paralelo nascendo por screenshot.",
    left: {
      label: "Chamar de experimento",
      summary: "Você compra opcionalidade pública e menos ressaca interna.",
      effects: { trust: 2, team: 1, delivery: -1 },
      result: "A promessa ficou menos sexy e muito mais defensável.",
      after(state) {
        state.flags.arcFounderPressure = false;
      },
    },
    right: {
      label: "Deixar vender",
      summary: "Você compra atenção agora e terceiriza o custo para a engenharia futura.",
      effects: { delivery: 2, trust: -2, team: -2 },
      result: "LinkedIn gostou. O time abriu outra fila sem admitir.",
      after(state) {
        state.flags.arcFounderPressure = true;
        state.flags.founderTweet = true;
      },
    },
    en: {
      title: "The founder wants to announce a pilot before the design is settled.",
      body: "It is not just hype. It is also a parallel queue being born.",
      left: {
        label: "Call it an experiment",
        summary: "You protect public optionality.",
        result: "The story became less explosive and more governable.",
      },
      right: {
        label: "Let the promise fly",
        summary: "You buy attention now and rely on execution later.",
        result: "The market heard it. The team inherited the bill.",
      },
    },
  },
  {
    id: "founder-friction-a4",
    arcId: "founder-friction",
    role: "direct DM",
    actMin: 4,
    difficulty: 5,
    priority: 5,
    when: (state) => state.flags.arcFounderPressure || state.flags.founderTweet || state.flags.founderBypass,
    title: "Agora o founder manda DM direto para IC quando acha a fila lenta.",
    body: "No curto prazo parece velocidade. No longo parece que você virou middleware humano.",
    left: {
      label: "Puxar de volta",
      summary: "Você compra desconforto politico para salvar o sistema.",
      effects: { trust: 2, team: 1, delivery: -1 },
      result: "Ficou pior no topo por 48 horas e melhor no resto da org.",
      after(state) {
        state.flags.arcFounderPressure = false;
        state.flags.founderBypass = false;
      },
    },
    right: {
      label: "Deixar rolar",
      summary: "Você preserva velocidade política e aceita que processo virou sugestão.",
      effects: { delivery: 1, trust: -4, team: -2 },
      result: "Algumas coisas sairam mais rápido. A cadeia de decisão saiu bem pior.",
      after(state) {
        state.flags.founderBypass = true;
      },
    },
    en: {
      title: "Now the founder is DMing ICs directly.",
      body: "Short-term speed rises. The alignment system falls.",
      left: {
        label: "Redirect the flow",
        summary: "You buy discomfort to save the system.",
        result: "The conversation got worse at the top and better everywhere else.",
      },
      right: {
        label: "Let it slide",
        summary: "You protect political speed and lose coherence.",
        result: "Some things moved. The system became optional.",
      },
    },
  },
  {
    id: "retention-friction-a2",
    arcId: "retention-friction",
    role: "scope ask",
    actMin: 2,
    difficulty: 3,
    priority: 3,
    title: "Sua pessoa mais forte não quer elogio em 1:1. Quer escopo que mude o jogo.",
    body: "Promessa vaga aqui costuma virar atualizacao de LinkedIn em algumas semanas.",
    left: {
      label: "Abrir escopo real",
      summary: "Você entrega ownership de verdade, com risco e visibilidade.",
      effects: { team: 2, delivery: 1, trust: -1 },
      result: "A pessoa sentiu aposta. A estrutura ficou mais dependente dela.",
      after(state) {
        state.flags.arcRetentionStretch = true;
      },
    },
    right: {
      label: "Manter como está",
      summary: "Você protege a estrutura atual e compra ressentimento silencioso.",
      effects: { delivery: 1, trust: 1, team: -2 },
      result: "A semana ficou estavel. O mercado continuou aberto.",
      after(state) {
        state.flags.arcRetentionDebt = true;
      },
    },
    en: {
      title: "Your strongest person wants real scope, not praise.",
      body: "A vague promise here usually turns into a market conversation elsewhere.",
      left: {
        label: "Give broader ownership",
        summary: "You give real risk together with visibility.",
        result: "The person felt invested in. The structure got thinner.",
      },
      right: {
        label: "Hold the shape",
        summary: "You protect the current structure and buy resentment.",
        result: "The week got more stable. The conversation did not.",
      },
    },
  },
  {
    id: "retention-friction-a4",
    arcId: "retention-friction",
    role: "offer risk",
    actMin: 4,
    difficulty: 5,
    priority: 5,
    when: (state) => state.flags.arcRetentionDebt || state.flags.arcRetentionStretch || state.flags.attritionRisk || state.metrics.team <= 42,
    title: "Chegou oferta externa para quem segura metade da sua run e um terço da sanidade coletiva.",
    body: "Qualquer resposta vira política salarial, narrativa de futuro e folclore de corredor ao mesmo tempo.",
    left: {
      label: "Fazer contraproposta",
      summary: "Você segura capacidade e compra um precedente caro.",
      effects: { team: 2, delivery: 1, budget: -4, trust: -1 },
      result: "Você reteve a pessoa. O resto do time abriu outra calculadora.",
      after(state) {
        state.flags.arcRetentionDebt = false;
        state.flags.attritionRisk = false;
      },
    },
    right: {
      label: "Deixar sair bem",
      summary: "Você protege coerência e aceita o rombo operacional.",
      effects: { trust: 2, budget: 1, delivery: -2, team: -3 },
      result: "A saida ficou elegante. O quarter ficou bem mais fino.",
      after(state) {
        state.flags.attritionRisk = true;
      },
    },
    en: {
      title: "An external offer landed for the person carrying the run the most.",
      body: "Every answer now teaches the whole team how to read value and future.",
      left: {
        label: "Make a counter",
        summary: "You keep capacity and buy an expensive precedent.",
        result: "You retained the person. The rest of the team opened another calculator.",
      },
      right: {
        label: "Let them leave well",
        summary: "You protect coherence and accept the hole.",
        result: "The exit stayed elegant. The run got thinner.",
      },
    },
  },
];
