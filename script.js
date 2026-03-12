const SoundEngine = {
  ctx: null,
  muted: localStorage.getItem("people-pager-sound-muted") === "true",

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  },

  setMuted(bool) {
    this.muted = bool;
    localStorage.setItem("people-pager-sound-muted", String(bool));
  },

  play(name) {
    if (this.muted || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    if (name === "click") {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 800;
      g.gain.value = 0.08;
      o.connect(g).connect(ctx.destination);
      o.start(now);
      o.stop(now + 0.06);
    } else if (name === "tick") {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle";
      o.frequency.value = 440;
      g.gain.value = 0.06;
      o.connect(g).connect(ctx.destination);
      o.start(now);
      o.stop(now + 0.08);
    } else if (name === "danger") {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(220, now);
      o.frequency.linearRampToValueAtTime(110, now + 0.2);
      g.gain.value = 0.12;
      o.connect(g).connect(ctx.destination);
      o.start(now);
      o.stop(now + 0.2);
    } else if (name === "victory") {
      [523, 659, 784].forEach((freq) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = freq;
        g.gain.value = 0.1;
        g.gain.linearRampToValueAtTime(0, now + 0.4);
        o.connect(g).connect(ctx.destination);
        o.start(now);
        o.stop(now + 0.4);
      });
    } else if (name === "loss") {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sawtooth";
      o.frequency.value = 180;
      g.gain.setValueAtTime(0.1, now);
      g.gain.linearRampToValueAtTime(0, now + 0.5);
      o.connect(g).connect(ctx.destination);
      o.start(now);
      o.stop(now + 0.5);
    } else if (name === "act-transition") {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(660, now);
      o.frequency.linearRampToValueAtTime(330, now + 0.3);
      g.gain.value = 0.1;
      o.connect(g).connect(ctx.destination);
      o.start(now);
      o.stop(now + 0.3);
    }
  },
};

const START_METRIC = 50;
const ACT_LENGTH = 8;
const TOTAL_ACTS = 4;
const MAX_WEEKS = ACT_LENGTH * TOTAL_ACTS;
const LEADERBOARD_LIMIT = 50;
const SIDEBAR_LEADERBOARD_LIMIT = 3;
const PROFILE_STORAGE_KEY = "people-pager-profile";
const DETAILS_STORAGE_KEY = "people-pager-ui-details";

const metricConfig = [
  { key: "team", label: "Team", tone: "team", detail: "burnout, clima e energia da squad" },
  { key: "delivery", label: "Delivery", tone: "delivery", detail: "o quanto o quarter ainda parece executável" },
  { key: "trust", label: "Trust", tone: "trust", detail: "o quanto a liderança ainda acredita no seu steering" },
  { key: "budget", label: "Budget", tone: "budget", detail: "quanto caixa e margem política ainda restam" },
];

const cards = [
  {
    id: "codex-panic",
    sprite: "exec",
    speaker: "CEO",
    role: "board panic",
    title: "O vendor agora faz o que você vende. O board quer saber por que a empresa ainda existe.",
    body: "A pergunta perdeu a delicadeza: se o modelo já entra no chat e no repo do cliente, o que exatamente a sua startup vende que não seja uma casca bonita em cima de API?",
    left: {
      label: "Pivotar a narrativa",
      summary: "Reposicionar pra orquestração, governança e fluxo humano. Menos sexy, mais defensável.",
      effects: { trust: 4, budget: 1, delivery: -2 },
      result: "A história ficou menos brilhante e mais difícil de destruir com um tweet de lançamento.",
      after(state) {
        state.flags.marketNarrative = true;
      },
    },
    right: {
      label: "Dobrar na execução",
      summary: "Manter o roadmap e tentar ganhar no braço. Se funcionar, é convicção. Se não, é teimosia.",
      effects: { delivery: 3, trust: 1, team: -3 },
      result: "A squad sentiu direção. O board ainda não decidiu se isso foi coragem ou negação.",
      after(state) {
        state.flags.productRace = true;
      },
    },
  },
  {
    id: "claude-code-deal",
    sprite: "customer",
    speaker: "Enterprise prospect",
    role: "procurement",
    title: "\"Por que eu pagaria por vocês se já uso Claude Code direto?\"",
    body: "Não foi hostil. Foi pior: foi honesto. Comercial precisa de uma resposta simples pra uma pergunta que não tem resposta simples.",
    left: {
      label: "Vender o chato",
      summary: "Puxar pra compliance, auditoria e operação real. O deal fica mais longo, mas mais difícil de morrer.",
      effects: { trust: 4, budget: 2, delivery: -2 },
      result: "A conversa virou enterprise de verdade. Menos mágica, mais planilha. O deal sobreviveu.",
      after(state) {
        state.flags.marketNarrative = true;
      },
    },
    right: {
      label: "Vender o futuro",
      summary: "Prometer mais agente, menos fricção, menos humano no loop. A engenharia vai odiar sustentar isso.",
      effects: { delivery: 2, trust: 2, budget: -3, team: -2 },
      result: "O prospect abriu a carteira. A engenharia abriu um Jira com 47 subtasks.",
      after(state) {
        state.flags.autonomyPromise = true;
      },
    },
  },
  {
    id: "token-bill",
    sprite: "finance",
    speaker: "FinOps",
    role: "weekly burn",
    title: "A conta de tokens tá subindo mais rápido que a receita. Ninguém fez besteira — ficou caro no atacado.",
    body: "Agente chama tool demais, carrega contexto demais, devolve log demais. Não teve incidente. Só a planilha perdeu a graça.",
    left: {
      label: "Cortar o gordo",
      summary: "Reduzir chamadas, comprimir memória, calar tool chatter. O produto fica menos bonito mas a margem respira.",
      effects: { budget: 6, delivery: -2, trust: -1 },
      result: "A margem voltou a fazer sentido. Alguns fluxos ficaram com cara de versão lite.",
      after(state) {
        state.flags.recallRisk = true;
      },
    },
    right: {
      label: "Segurar o tranco",
      summary: "Não mexer no produto agora. Pagar a conta e torcer pra receita alcançar o custo antes do CFO perder a paciência.",
      effects: { delivery: 2, trust: 2, budget: -5 },
      result: "A experiência ficou intacta. O budget virou uma aposta que ninguém lembra de ter feito.",
      after(state) {
        state.flags.tokenOverhang = true;
      },
    },
  },
  {
    id: "eval-gate",
    sprite: "pm",
    speaker: "ML lead",
    role: "launch prep",
    title: "O demo convence qualquer um. As evals convencem ninguém. A janela comercial tá fechando.",
    body: "Todo mundo viu o happy path funcionar. O sad path continua um mistério, e agora a pressão de go-to-market virou argumento contra prudência.",
    left: {
      label: "Travar o launch",
      summary: "Exigir barra mínima de confiabilidade antes de soltar. A janela encolhe, mas o risco também.",
      effects: { team: 2, trust: 2, delivery: -3, budget: -1 },
      result: "A conversa ficou mais adulta. A janela comercial ficou mais apertada. Escolha seu veneno.",
    },
    right: {
      label: "Soltar e rezar",
      summary: "Subir com guarda baixa e aprender com tráfego real. Se der certo, é data-driven. Se der errado, é negligência.",
      effects: { delivery: 3, trust: 1, budget: -2, team: -2 },
      result: "O produto ganhou o mundo. Agora o mundo também é seu QA involuntário.",
      after(state) {
        state.flags.evalDebt = true;
      },
    },
  },
  {
    id: "vibe-core",
    sprite: "eng",
    speaker: "Staff engineer",
    role: "core platform",
    title: "A squad tá fazendo vibe coding no caminho crítico. Ninguém combinou. Só aconteceu.",
    body: "PRs gigantes chegando cedo, com menos autoria clara e mais fé de que alguém vai entender depois. A velocity subiu. A confiança no código, nem tanto.",
    left: {
      label: "Apertar o review",
      summary: "Aceitar o ganho de velocidade, mas subir a barra de review e ownership. O time vai reclamar.",
      effects: { trust: 2, team: -1, delivery: -2 },
      result: "A regra ficou clara. Metade do time agradeceu. A outra metade atualizou o LinkedIn.",
    },
    right: {
      label: "Deixar rolar",
      summary: "Tratar como a nova forma de produzir. Ajustar depois se der ruim. Spoiler: sempre dá ruim.",
      effects: { delivery: 3, team: 1, trust: -2 },
      result: "Velocity explodiu. Autoria virou conceito filosófico. Ninguém sabe quem escreveu o quê.",
      after(state) {
        state.flags.codeEntropy = true;
        state.flags.roleDrift = true;
      },
    },
  },
  {
    id: "zero-retention",
    sprite: "customer",
    speaker: "Security lead",
    role: "enterprise buyer",
    title: "Cliente quer zero retention, audit trail e dados isolados. Fechar muda o quarter. Recusar muda a história.",
    body: "Não é feature request. É pré-requisito pra assinar. O deal é gordo, mas a cauda de compliance que vem junto vai ocupar engenharia por semanas.",
    left: {
      label: "Aceitar o deal",
      summary: "Pegar a receita e reorganizar a fila. O roadmap vira refém de um contrato.",
      effects: { trust: 3, budget: 3, delivery: -3, team: -2 },
      result: "A receita entrou. A plataforma virou uma mesa de negociação disfarçada de produto.",
      after(state) {
        state.flags.enterpriseTail = true;
      },
    },
    right: {
      label: "Segurar a arquitetura",
      summary: "Oferecer menos do que pediram e proteger o roadmap. Comercial vai sair da call com cara de velório.",
      effects: { team: 1, delivery: 1, trust: -4, budget: -1 },
      result: "O roadmap sobreviveu intacto. Comercial te adicionou numa lista mental que você não quer estar.",
    },
  },
  {
    id: "founder-tweet",
    sprite: "exec",
    speaker: "Founder",
    role: "timeline own goal",
    title: "O founder tuitou uma feature que não existe. Agora é promessa pública.",
    body: "Tem expectativa, tem inbound, e tem uma squad inteira olhando pra você tentando descobrir se tweet virou deadline.",
    left: {
      label: "Corrigir o tweet",
      summary: "Enquadrar como experimento e ganhar tempo. A internet esquece. A squad, não.",
      effects: { trust: 2, team: 2, delivery: -1 },
      result: "A correção doeu menos que o esperado. O founder aprendeu? Improvável.",
    },
    right: {
      label: "Entregar o tweet",
      summary: "Usar como deadline e reorganizar tudo em volta. Se o founder prometeu, você entrega. Custe o que custar.",
      effects: { delivery: 3, trust: 1, team: -4 },
      result: "A feature saiu. O time também quase saiu. Prioridades ficaram claras por um minuto e confusas pelo resto do quarter.",
      after(state) {
        state.flags.founderTweet = true;
      },
    },
  },
  {
    id: "prompt-caching",
    sprite: "finance",
    speaker: "Platform engineer",
    role: "cost design",
    title: "Dá pra cachear prompt e economizar, ou seguir pagando pela preguiça confortável.",
    body: "A refatoração não é heroica, mas mexe no jeito como o produto respira contexto. O ganho pode ser margem real ou só higiene cara travestida de otimização.",
    left: {
      label: "Refatorar agora",
      summary: "Mexer no fluxo pra recuperar margem. O time vai adorar mais uma mudança no meio da corrida.",
      effects: { budget: 4, trust: 1, delivery: -2, team: -1 },
      result: "Menos desperdício, mais disciplina. O time perguntou quantas vezes mais a arquitetura vai mudar esse quarter.",
      after(state) {
        state.flags.cachingRefactor = true;
      },
    },
    right: {
      label: "Pagar e fingir que não viu",
      summary: "Preservar o comportamento atual e adiar a limpeza. Semana que vem resolve. Ou a outra.",
      effects: { delivery: 2, team: 1, budget: -4 },
      result: "Nada quebrou essa semana. O CFO começou a pedir reunião semanal sobre custos. Coincidência.",
      after(state) {
        state.flags.tokenOverhang = true;
      },
    },
  },
  {
    id: "multi-model",
    sprite: "exec",
    speaker: "CTO",
    role: "vendor strategy",
    title: "O CTO quer suporte a múltiplos modelos antes da renovação de contrato. Prudência ou paranoia — você decide.",
    body: "Parece sensato até alguém ter que pagar a abstração em roadmap, operação e paciência da squad. Toda camada de compatibilidade custa mais do que o slide promete.",
    left: {
      label: "Construir a abstração",
      summary: "Preparar camada multi-model e comprar opcionalidade. Elegante no diagrama, doloroso na prática.",
      effects: { trust: 3, budget: 1, delivery: -3, team: -2 },
      result: "A arquitetura ficou flexível pro futuro. O presente ficou inflexível pra todo mundo.",
      after(state) {
        state.flags.modelSprawl = true;
      },
    },
    right: {
      label: "Apostar num provider",
      summary: "Simplificar o stack e abraçar a dependência. Mais rápido agora, mais arriscado depois.",
      effects: { delivery: 2, team: 1, trust: -2, budget: -1 },
      result: "A execução voou. A conversa sobre risco estratégico ficou mais baixa, não mais resolvida.",
      after(state) {
        state.flags.vendorLock = true;
      },
    },
  },
  {
    id: "support-agent",
    sprite: "support",
    speaker: "Head of Support",
    role: "ticket backlog",
    title: "Support quer IA respondendo ticket esse mês. A fila tá grande e a paciência tá curta.",
    body: "O pedido faz sentido. O perigo é confundir \"faz sentido\" com \"tá pronto\" só porque a dor da fila é mais visível que o risco de soltar cedo.",
    left: {
      label: "Piloto fechado",
      summary: "Humanos no loop, medir antes de abrir. Support vai achar lento. Melhor lento que viral no Twitter por motivo errado.",
      effects: { trust: 2, delivery: 1, budget: -2, team: -1 },
      result: "O piloto rodou sem incidente. Support achou devagar. Mas ninguém foi parar no Hacker News.",
    },
    right: {
      label: "Engavetar por agora",
      summary: "Segurar a ansiedade e evitar falso começo. A engenharia respira. A operação interpreta como descaso.",
      effects: { team: 2, budget: 1, trust: -3, delivery: -1 },
      result: "A engenharia respirou. Support adicionou \"IA\" na lista de coisas que engenharia promete e não entrega.",
      after(state) {
        state.flags.supportFriction = true;
      },
    },
  },
  {
    id: "benchmark-push",
    sprite: "pm",
    speaker: "Marketing",
    role: "launch narrative",
    title: "Marketing quer publicar o benchmark mais bonito da demo. Não é mentira. Também não é verdade inteira.",
    body: "O número é real — pra aquele caso, naquele dia, com aquele prompt. O debate é quanto de nuance a empresa ainda tolera perto de um launch.",
    left: {
      label: "Publicar com asterisco",
      summary: "Aceitar o benchmark mas explicar metodologia e limites. Menos viral, mais defensável.",
      effects: { trust: 3, delivery: -1, budget: 1, team: -1 },
      result: "A história ficou menos sexy e mais à prova de bala. Marketing não te agradeceu.",
    },
    right: {
      label: "Mandar bala",
      summary: "Usar a melhor narrativa possível. Se alguém questionar depois, a gente lida. Provavelmente.",
      effects: { delivery: 2, budget: 2, trust: -3, team: -2 },
      result: "A campanha viralizou. Engenharia percebeu que agora carrega a conta reputacional se alguém testar de verdade.",
      after(state) {
        state.flags.benchmarkDebt = true;
      },
    },
  },
  {
    id: "provider-outage",
    sprite: "sre",
    speaker: "On-call",
    role: "vendor outage",
    title: "O provider caiu e o seu produto levou a culpa. Cliente não distingue dependência de incompetência.",
    body: "Você pode ser transparente e degradar a experiência, ou ficar quieto e torcer pra voltar antes de alguém perceber. Spoiler: já perceberam.",
    when: (state) => state.week >= 5,
    left: {
      label: "Ser transparente",
      summary: "Mostrar que o problema é do vendor e degradar graciosamente. Honesto, mas feio.",
      effects: { trust: 3, delivery: -2, budget: -2, team: -1 },
      result: "Alguns clientes reclamaram do modo capado. Outros agradeceram por finalmente saber o que tava acontecendo.",
    },
    right: {
      label: "Ficar quieto",
      summary: "Comunicar pouco e torcer. O dashboard fica bonito. O suporte fica com histórias conflitantes pra contar.",
      effects: { delivery: 1, budget: 1, trust: -4, team: -2 },
      result: "O painel pareceu calmo. O suporte descobriu que mentir por omissão também é trabalho de engenharia.",
      after(state) {
        state.flags.outageNarrative = true;
      },
    },
  },
  {
    id: "calibration-week",
    sprite: "people",
    speaker: "People partner",
    role: "calibration",
    title: "Semana de calibração. Metade da discussão agora é sobre quem usou IA e se isso conta.",
    body: "Quem usou agente entregou mais. Quem não usou entregou melhor. Ninguém concorda sobre o que é mérito quando a máquina faz metade do trabalho.",
    when: (state) => state.week >= 7,
    left: {
      label: "Mudar o critério",
      summary: "Reescrever a conversa pra julgamento, ownership e decisão. Mais justo, mais cansativo. Costumam vir junto.",
      effects: { trust: 3, team: 2, delivery: -1 },
      result: "A avaliação ficou mais justa. A reunião ficou 3x mais longa. Ninguém reclamou. Em voz alta.",
    },
    right: {
      label: "Manter o critério",
      summary: "Não reabrir o sistema no meio do ciclo. Rápido e eficiente. Também injusto, mas isso é problema do próximo quarter.",
      effects: { delivery: 1, team: -4, trust: -2 },
      result: "A reunião acabou em 30 minutos. A sensação de injustiça vai durar 6 meses.",
      after(state) {
        state.flags.roleDrift = true;
      },
    },
  },
  {
    id: "moat-review",
    sprite: "exec",
    speaker: "Board member",
    role: "strategy review",
    title: "\"Em uma frase: o que ainda é moat?\" O board tá esperando. Não é pergunta retórica.",
    body: "A resposta que você der agora define como a empresa prioriza as próximas semanas. Não existe resposta certa. Existe a que você consegue bancar.",
    when: (state) => state.flags.marketNarrative || state.flags.productRace || state.flags.autonomyPromise,
    priority: 4,
    left: {
      label: "Operação e distribuição",
      summary: "Ancorar em workflow, dados e embedding no cliente. Menos sexy, mais real. Board costuma preferir isso mais do que admite.",
      effects: { trust: 4, budget: 1, delivery: -2 },
      result: "A resposta não brilhou. Mas ninguém conseguiu destruir em uma frase. Isso é moat.",
      after(state) {
        state.flags.marketNarrative = false;
        state.flags.autonomyPromise = false;
      },
    },
    right: {
      label: "Tech e velocidade",
      summary: "Vender diferenciação técnica própria e velocidade de produto. Bonito no slide. Agora precisa provar.",
      effects: { trust: 2, delivery: 1, budget: -2, team: -2 },
      result: "A sala comprou a ambição. Agora espera prova num ritmo que faz o quarter parecer curto demais.",
      after(state) {
        state.flags.productRace = false;
      },
    },
  },
  {
    id: "quality-fallout",
    sprite: "customer",
    speaker: "Customer success",
    role: "renewal signal",
    title: "Contas grandes perceberam queda de qualidade. Não é incidente. É pior: é tendência.",
    body: "Nenhum caso grave o bastante pra abrir post-mortem. Todos graves o bastante pra virar tópico na renovação se você ignorar por mais uma semana.",
    when: (state) =>
      state.flags.recallRisk ||
      state.flags.evalDebt ||
      state.flags.benchmarkDebt ||
      state.flags.supportFriction ||
      state.flags.outageNarrative,
    priority: 5,
    left: {
      label: "Assumir a regressão",
      summary: "Recuar, comunicar com franqueza e consertar. Dói agora mas evita surpresa na renovação.",
      effects: { trust: 4, team: 1, delivery: -2, budget: -1 },
      result: "Ninguém adorou ouvir. Mas adoraram menos imaginar que ninguém tinha percebido.",
      after(state) {
        state.flags.recallRisk = false;
        state.flags.evalDebt = false;
        state.flags.benchmarkDebt = false;
        state.flags.supportFriction = false;
        state.flags.outageNarrative = false;
      },
    },
    right: {
      label: "Consertar por baixo",
      summary: "Corrigir silenciosamente e manter a fachada. Funciona até alguém olhar de perto. E alguém sempre olha.",
      effects: { delivery: 1, budget: 1, trust: -5, team: -2 },
      result: "Você comprou uns dias de paz. O time de conta percebeu que agora faz parte do teatro.",
      after(state) {
        state.flags.quietPatch = true;
      },
    },
  },
  {
    id: "security-fallout",
    sprite: "sre",
    speaker: "Security engineer",
    role: "posture review",
    title: "Código gerado por agente vazou um segredo e puxou dependência errada pra prod. De novo.",
    body: "Nenhum caso catastrófico sozinho. O tipo de coisa que vira catastrófica quando \"a gente revisa depois\" se torna processo oficial.",
    when: (state) => state.flags.codeEntropy || state.flags.quietPatch || state.flags.securityDebt,
    priority: 5,
    left: {
      label: "Parar tudo e revisar",
      summary: "Tratar como sintoma de processo quebrado, não bug isolado. O quarter vai sentir o freio.",
      effects: { trust: 5, team: 2, delivery: -4, budget: -1 },
      result: "Engenharia sentiu que alguém tá protegendo eles. O roadmap sentiu que perdeu uma semana.",
      after(state) {
        state.flags.codeEntropy = false;
        state.flags.quietPatch = false;
        state.flags.securityDebt = false;
      },
    },
    right: {
      label: "Patch e segue",
      summary: "Resolver o caso pontual e não transformar num movimento cultural. Prático. Perigoso.",
      effects: { delivery: 2, budget: 1, trust: -4, team: -3 },
      result: "A timeline sobreviveu. A sensação de que o próximo leak é questão de tempo, também.",
      after(state) {
        state.flags.securityDebt = true;
      },
    },
  },
  {
    id: "cost-review",
    sprite: "finance",
    speaker: "CFO",
    role: "margin review",
    title: "A margem sumiu. Agora toda decisão de produto é uma decisão financeira.",
    body: "Tokens, abstrações, retries e demos caros finalmente chegaram na mesa da diretoria. Você precisa decidir o que é custo temporário e o que é a nova realidade.",
    when: (state) =>
      state.metrics.budget <= 34 ||
      state.flags.tokenOverhang ||
      state.flags.cachingRefactor ||
      state.flags.vendorLock,
    priority: 4,
    left: {
      label: "Cortar fundo",
      summary: "Proteger runway, piorar experiência onde der. A fase romântica com IA acabou.",
      effects: { budget: 8, delivery: -2, team: -3, trust: -1 },
      result: "A planilha voltou a fazer sentido. O time sentiu que a festa acabou.",
      after(state) {
        state.flags.tokenOverhang = false;
        state.flags.cachingRefactor = false;
        state.flags.vendorLock = false;
      },
    },
    right: {
      label: "Defender o investimento",
      summary: "Argumentar que cortar agora resolve a crise errada. Você precisa entregar mais do que discurso pra isso colar.",
      effects: { trust: 4, team: 1, budget: -4, delivery: 1 },
      result: "Comprou mais tempo pra tese. Agora a tese precisa funcionar, ou você vira a tese.",
      after(state) {
        state.flags.vendorLock = false;
      },
    },
  },
  {
    id: "board-pressure",
    sprite: "exec",
    speaker: "COO",
    role: "forecast review",
    title: "A liderança comprou o hype de IA. Agora quer previsibilidade de empresa adulta. Boa sorte com as duas coisas.",
    body: "Não basta parecer moderno. A diretoria quer saber se você faz promessas sem depender de magia, benchmark cherry-picked ou thread de anúncio.",
    when: (state) => state.metrics.trust <= 34 || state.flags.founderTweet || state.flags.outageNarrative,
    priority: 4,
    left: {
      label: "Mostrar a real",
      summary: "Cortar narrativa e mostrar o que cabe de verdade. Menos brilho, mais solo debaixo dos pés.",
      effects: { trust: 6, delivery: -2, team: 1 },
      result: "A conversa perdeu o glamour. Ganhou credibilidade. Num board meeting, isso é moeda forte.",
      after(state) {
        state.flags.founderTweet = false;
        state.flags.outageNarrative = false;
      },
    },
    right: {
      label: "Manter a narrativa",
      summary: "Segurar a história atual e comprar mais algumas semanas. Cada semana comprada fica mais cara.",
      effects: { delivery: 1, trust: -7, team: -1 },
      result: "Por fora ainda pareceu momentum. Por dentro, a tolerância a improviso chegou perto do zero.",
    },
  },
  {
    id: "delivery-review",
    sprite: "exec",
    speaker: "VP Product",
    role: "quarter health",
    title: "O quarter tá escorregando. Infra, AI debt e promessas de GTM estão competindo pelo mesmo time.",
    body: "Todo mundo tem uma razão boa pro atraso. O calendário não aceita razões. Só cobra datas.",
    when: (state) => state.metrics.delivery <= 34 || state.flags.enterpriseTail || state.flags.founderTweet,
    priority: 4,
    left: {
      label: "Cortar escopo",
      summary: "Entregar menos coisas, mas inteiras. Perder narrativa pra ganhar credibilidade.",
      effects: { delivery: 6, trust: 2, team: 1 },
      result: "O quarter encolheu e ficou factível. Ninguém gostou de cortar. Todo mundo gostou de entregar.",
      after(state) {
        state.flags.enterpriseTail = false;
        state.flags.founderTweet = false;
      },
    },
    right: {
      label: "Meter mais gente",
      summary: "Tentar recuperar o quarter no braço sem cortar nada. A ambição fica intacta. O time, nem tanto.",
      effects: { delivery: 3, trust: -2, team: -6 },
      result: "O roadmap ficou cheio de novo. A largura de banda humana ficou vazia de novo.",
      after(state) {
        state.flags.roleDrift = true;
      },
    },
  },
  {
    id: "role-drift",
    sprite: "people",
    speaker: "Sênior engineer",
    role: "1:1",
    title: "\"Virei revisor de IA, não engenheiro.\" A queixa não é ludita. É sobre carreira.",
    body: "É sobre quem ainda tem autoria, quem tá só aprovando output de máquina, e se o seu plano de carreira previu um futuro onde o junior é um modelo.",
    when: (state) => state.metrics.team <= 38 || state.flags.roleDrift || state.flags.modelSprawl,
    priority: 5,
    left: {
      label: "Redistribuir ownership",
      summary: "Redesenhar quem faz o quê. Perde vazão no curto prazo, mas o time volta a sentir que tem profissão ali.",
      effects: { team: 7, trust: 1, delivery: -3 },
      result: "A velocity caiu e o moral subiu. Às vezes isso é mais sustentável do que o contrário.",
      after(state) {
        state.flags.roleDrift = false;
      },
    },
    right: {
      label: "\"É fase de adaptação\"",
      summary: "Apostar que o time se acostuma. Mais algumas semanas e normaliza. Provavelmente. Talvez.",
      effects: { delivery: 2, budget: 1, team: -7, trust: -2 },
      result: "A velocidade aparente sobreviveu. Duas pessoas começaram a fazer entrevista em silêncio.",
      after(state) {
        state.flags.roleDrift = false;
      },
    },
  },
  {
    id: "migration-discount",
    sprite: "finance",
    speaker: "Procurement",
    role: "vendor offer",
    title: "Desconto gordo pra centralizar num provider só. A planilha adora. A engenharia tem perguntas.",
    body: "A oferta é real. Migrar stack no meio do quarter também é real. Pode salvar margem e explodir todo o resto.",
    when: (state) => state.week >= 8,
    left: {
      label: "Usar como alavanca",
      summary: "Negociar melhor termo sem migrar nada agora. Finesse > força bruta.",
      effects: { budget: 3, trust: 2, delivery: -1 },
      result: "Finance gostou do gesto. Engenharia agradeceu por não ter virado migração por decreto.",
    },
    right: {
      label: "Migrar tudo agora",
      summary: "Capturar a economia completa esse quarter. A planilha vai sorrir. O resto da empresa, não necessariamente.",
      effects: { budget: 5, delivery: -3, team: -4, trust: 1 },
      result: "A planilha sorriu. O resto da empresa abriu uma war room que ainda não tem nome.",
      after(state) {
        state.flags.modelSprawl = true;
      },
    },
  },
];

const englishCards = {
  "codex-panic": {
    title: "Codex just moved into your customer's workflow. The board is hyperventilating.",
    body: "The vendor now lives in chat, in the repo, in the CI. What exactly are you still selling that they can't get for free by Thursday?",
    left: {
      label: "Pivot the pitch",
      summary: "Reposition around orchestration and governance — things AI can't self-serve.",
      result: "The narrative held. The product now has more open questions than closed features.",
    },
    right: {
      label: "Stay the course",
      summary: "Stick to the roadmap and bet on execution speed over positioning.",
      result: "The squad felt clarity. The board still can't tell if that was vision or denial.",
    },
  },
  "claude-code-deal": {
    title: "Prospect on the call: 'Why would I pay you? I already have Claude Code.'",
    body: "Not hostile. Worse — genuinely curious. Sales is staring at you. The call ends in four minutes.",
    left: {
      label: "Sell the boring stuff",
      summary: "Pivot to compliance, audit logs, and the stuff nobody tweets about.",
      result: "The deal survived. It also aged about six months in one conversation.",
    },
    right: {
      label: "Sell the dream",
      summary: "Promise more autonomy, less friction, fewer humans in the loop.",
      result: "The prospect's eyes lit up. Engineering's eyes did the opposite.",
    },
  },
  "token-bill": {
    title: "The token bill is growing faster than revenue. Nobody broke anything — it just... grew.",
    body: "Agents calling agents calling tools calling context calling your CFO. The spreadsheet got worse through pure accumulation of reasonable decisions.",
    left: {
      label: "Cut the fat",
      summary: "Compress memory, reduce tool calls, trim the context window diet.",
      result: "Margins breathed again. Some flows now look suspiciously less magical than the demo.",
    },
    right: {
      label: "Eat the cost",
      summary: "Keep the experience intact and pray revenue catches up.",
      result: "Users noticed nothing. Budget started looking less like a plan and more like a prayer.",
    },
  },
  "eval-gate": {
    title: "The demo is flawless. The evals are a horror movie.",
    body: "Everyone saw the best case. Nobody mapped the worst case. The commercial window is open and making impatient noises.",
    left: {
      label: "Block the launch",
      summary: "Demand a minimum reliability bar before anything ships.",
      result: "The conversation got slower and more honest. The window didn't close, but it's tapping its watch.",
    },
    right: {
      label: "Ship and measure",
      summary: "Go live with lighter guardrails. Learn from production traffic.",
      result: "The product met the world sooner. The world is now an unpaid QA team.",
    },
  },
  "vibe-core": {
    title: "Your squad is vibe-coding on the critical path. Nobody voted on this.",
    body: "It just happened. PRs got bigger, faster, and authored by a statistical process. Design reviews became optional by cultural drift.",
    left: {
      label: "Tighten the reins",
      summary: "Keep the speed boost but raise the bar on review and ownership.",
      result: "The team understood. Half of them also felt like the fun part just ended.",
    },
    right: {
      label: "Let it ride",
      summary: "Treat it as the new normal and course-correct later. Maybe.",
      result: "Velocity soared. The concept of 'authorship' got thinner than a prompt template.",
    },
  },
  "zero-retention": {
    title: "Client wants zero retention, full audit trail, and data isolation. Also, they want it yesterday.",
    body: "Closing this deal saves the quarter. Saying no might define the year. Enterprise demands have a way of becoming the product.",
    left: {
      label: "Take the deal",
      summary: "Accept the enterprise wish list and reorder the entire queue around it.",
      result: "Revenue got real. The platform started looking less like a product and more like a negotiation.",
    },
    right: {
      label: "Hold the line",
      summary: "Protect the architecture. Offer less than they asked for.",
      result: "The roadmap survived intact. Sales left the call looking like they'd seen a ghost.",
    },
  },
  "founder-tweet": {
    title: "The founder shipped a feature announcement on X. The feature doesn't exist.",
    body: "Public expectation, curious inbound, and a team staring at you wondering if a tweet just became a sprint commitment.",
    left: {
      label: "Walk it back",
      summary: "Reframe the tweet as 'exploring' and quietly correct the narrative.",
      result: "The internet forgot in two hours. The squad will remember for two quarters.",
    },
    right: {
      label: "Make it real",
      summary: "Treat the tweet as a deadline. Rearrange everything around it.",
      result: "One week got extremely clear. The rest of the quarter got extremely unclear.",
    },
  },
  "prompt-caching": {
    title: "Prompt caching could save real money. The refactor could cost real sanity.",
    body: "It's not heroic work. It does change how the product talks to context and tools. The savings might be real, or they might just look clean on a slide.",
    left: {
      label: "Refactor now",
      summary: "Reshape the flow mid-sprint to chase better margins.",
      result: "The codebase got leaner. The team got one more 'strategic pivot' added to their bingo card.",
    },
    right: {
      label: "Keep paying",
      summary: "Preserve behavior. Postpone the cleanup. Hope revenue outruns cost.",
      result: "Nothing broke architecturally. The CFO started scheduling 'alignment meetings.'",
    },
  },
  "multi-model": {
    title: "CTO wants a real hedge between OpenAI and Anthropic. Before renewal.",
    body: "Sounds prudent on a slide. Every abstraction layer comes with political, technical, and emotional overhead nobody budgeted for.",
    left: {
      label: "Build the abstraction",
      summary: "Create a common layer. Buy optionality. Pay in complexity.",
      result: "The architecture gained future freedom. The present gained three new config files and a sadder team.",
    },
    right: {
      label: "Pick one and commit",
      summary: "Simplify the stack. Accept the vendor lock-in. Ship faster.",
      result: "Execution accelerated. The 'what if they raise prices' conversation went nowhere but also never left.",
    },
  },
  "support-agent": {
    title: "Support wants an AI agent on tickets. This month. Not next month. This month.",
    body: "The demand is plausible. 'Plausible' and 'ready to face a paying customer' are cousins that don't talk much.",
    left: {
      label: "Pilot internally",
      summary: "Keep humans in the loop. Measure before you expose customers to the experiment.",
      result: "The request moved without becoming a promise. Support called it slow. They also didn't get paged at 3am.",
    },
    right: {
      label: "Pump the brakes",
      summary: "Hold the anxiety. Avoid a false start that becomes a real incident.",
      result: "Engineering got air. Operations added 'AI agent' to the list of things you said would happen Soon.",
    },
  },
  "benchmark-push": {
    title: "Marketing wants to publish a benchmark. Using the one demo that actually works perfectly.",
    body: "It's not a lie. It's also not the truth. It's the kind of content that makes engineers sweat when they see it on LinkedIn.",
    left: {
      label: "Add the asterisks",
      summary: "Publish, but include methodology and honest limitations.",
      result: "The post got fewer likes and more respect. Not everyone considers that a win.",
    },
    right: {
      label: "Full send",
      summary: "Run the strongest narrative. Correct later if someone notices.",
      result: "The campaign popped off. Engineering quietly updated their resumes just in case.",
    },
  },
  "provider-outage": {
    title: "The AI provider is degraded. Your product looks broken. It's not your fault but it's your problem.",
    body: "You can expose the dependency and look honest, or hide it and look competent. Pick one.",
    left: {
      label: "Show the seams",
      summary: "Expose the vendor dependency. Degrade the experience gracefully.",
      result: "Some customers complained about reduced functionality. Others said it was the first time they understood what was happening.",
    },
    right: {
      label: "Maintain the illusion",
      summary: "Say nothing. Ride it out. Hope the provider fixes it before anyone important notices.",
      result: "The dashboard stayed calm. Support started telling three different stories about the same issue.",
    },
  },
  "calibration-week": {
    title: "Performance review week. Half the team's output was written by an LLM.",
    body: "Some shipped more with agents. Some shipped better without looking fast. Nobody agrees on what 'performance' means anymore.",
    left: {
      label: "Rewrite the rubric",
      summary: "Evaluate judgment, ownership, and decision quality — not lines shipped.",
      result: "The review got more mature and more exhausting. Those are usually the same thing.",
    },
    right: {
      label: "Keep the old rubric",
      summary: "Don't reopen the scoring system mid-cycle. That way lies madness.",
      result: "The meeting ended on time. The sense of fairness did not.",
    },
  },
  "moat-review": {
    title: "Board meeting. One question: 'What's still moat?' You get one sentence.",
    body: "Not a technical question. Not a dumb one either. Your answer rewires how the company prioritizes everything for the next quarter.",
    left: {
      label: "Workflow and data",
      summary: "Anchor the moat in operations, distribution, and customer lock-in.",
      result: "Less romantic, more actionable. The board nodded. That's the best you get from a board.",
    },
    right: {
      label: "Tech and speed",
      summary: "Sell internal R&D velocity and model-level differentiation.",
      result: "The room bought some of the ambition. It now expects proof on a timeline that doesn't include 'eventually.'",
    },
  },
  "quality-fallout": {
    title: "Enterprise accounts are noticing quality drift. Not enough for an incident. Enough for a renewal conversation.",
    body: "Nothing dramatic happened. That's the problem — it's the kind of slow degradation that shows up in churn, not in alerts.",
    left: {
      label: "Own it publicly",
      summary: "Roll back, communicate honestly, and take the reputation hit now.",
      result: "The room didn't love the honesty. They loved even less imagining nobody had noticed.",
    },
    right: {
      label: "Fix it quietly",
      summary: "Patch underneath. Keep the external narrative intact.",
      result: "You bought a few days of peace. The account team just realized they're part of the cover story now.",
    },
  },
  "security-fallout": {
    title: "Agent-generated code shipped a leaked secret and a sketchy dependency to production.",
    body: "Not catastrophic alone. Catastrophic if 'we'll review it later' just became the actual process.",
    left: {
      label: "Full stop",
      summary: "Treat it as a process failure, not a one-off bug. Pause and audit.",
      result: "Engineering felt protected. The quarter felt the emergency brake.",
    },
    right: {
      label: "Hotfix and move on",
      summary: "Fix the specific issue. Don't turn it into a crusade.",
      result: "The timeline survived. So did the ambient sense of playing with fire.",
    },
  },
  "cost-review": {
    title: "Margins are gone. Every product decision is now a finance decision.",
    body: "Tokens, retries, abstractions, and impressive demos that cost more than they earn. The romantic phase of AI adoption has a credit card bill.",
    left: {
      label: "Cut deep",
      summary: "Protect runway. Accept a worse experience wherever you can afford to.",
      result: "The bill came under control. The org realized the honeymoon is over.",
    },
    right: {
      label: "Defend the spend",
      summary: "Argue that cutting now kills the thesis before it proves itself.",
      result: "You bought more runway for the vision. Now you need to deliver something besides conviction.",
    },
  },
  "board-pressure": {
    title: "Leadership bought the AI hype. Now it wants boring, predictable, adult-company results.",
    body: "Looking modern was fun. Leadership now wants to know if you can make promises without relying on vibes, benchmarks, or Twitter threads.",
    left: {
      label: "Get honest",
      summary: "Cut the narrative noise. Show what actually works and what doesn't.",
      result: "The conversation lost its shine and gained ground. That trade is worth more than it looks.",
    },
    right: {
      label: "Buy more time",
      summary: "Hold the current story together for a few more weeks.",
      result: "From outside it still looked like momentum. Inside, the tolerance for improvisation hit zero.",
    },
  },
  "delivery-review": {
    title: "The quarter is slipping. Infra debt, AI debt, and GTM promises are all due at once.",
    body: "Everyone has a great reason for the delay. The calendar doesn't accept reasons. It only charges dates.",
    left: {
      label: "Shrink the scope",
      summary: "Cut ambition. Ship something small but complete.",
      result: "The run got smaller and more real. That matters more than it seems when the room gets loud.",
    },
    right: {
      label: "Push harder",
      summary: "Try to recover the quarter without renegotiating what was promised.",
      result: "The roadmap got fuller. The humans got emptier.",
    },
  },
  "role-drift": {
    title: "Your engineers say they've become 'agent babysitters.' They're not joking.",
    body: "This isn't a Luddite complaint. It's about judgment, career growth, and whether reviewing AI output still counts as engineering.",
    left: {
      label: "Redesign the roles",
      summary: "Redistribute ownership. Accept less throughput for more meaning.",
      result: "The team started feeling like engineers again, not prompt-output validators.",
    },
    right: {
      label: "Call it adaptation",
      summary: "Bet that the discomfort is temporary. Give it a few more weeks.",
      result: "Velocity numbers stayed pretty. The 1:1s got noticeably uglier.",
    },
  },
  "migration-discount": {
    title: "A juicy discount landed to go all-in on one provider. The catch is migrating mid-quarter.",
    body: "The savings are real. So is the risk of ripping out infrastructure while the quarter is on fire.",
    left: {
      label: "Use it as leverage",
      summary: "Negotiate better terms without actually migrating right now.",
      result: "Finance liked the play. Engineering appreciated not being voluntold into a migration.",
    },
    right: {
      label: "Migrate now",
      summary: "Capture the full savings. Accept the chaos.",
      result: "The spreadsheet looked great. The rest of the company opened a war room nobody named yet.",
    },
  },
};

const cardMetadata = window.PEOPLE_PAGER_CARD_METADATA || {};
const extraScenarios = window.PEOPLE_PAGER_EXTRA_SCENARIOS || [];
const arcDefinitions = window.PEOPLE_PAGER_ARCS || [];
const arcScenarios = window.PEOPLE_PAGER_ARC_SCENARIOS || [];
const characterPools = window.PEOPLE_PAGER_CHARACTER_POOLS || {};
const origins = window.PEOPLE_PAGER_ORIGINS || [];
const perks = window.PEOPLE_PAGER_PERKS || [];
const rareScenarios = window.PEOPLE_PAGER_RARE_SCENARIOS || [];

cards.forEach((card) => {
  Object.assign(card, cardMetadata[card.id] || {});
});

cards.push(...extraScenarios.map(({ en, ...card }) => card));
cards.push(...arcScenarios.map(({ en, ...card }) => card));
cards.push(...rareScenarios.map(({ en, ...card }) => card));
Object.assign(
  englishCards,
  Object.fromEntries([...extraScenarios, ...arcScenarios, ...rareScenarios].map(({ id, en }) => [id, en]))
);

const uiCopy = {
  pt: {
    htmlLang: "pt-BR",
    title: "Ship or Sink - Chat Ops",
    description: "Jogo de decisões para engineering managers em uma interface inspirada em Slack.",
    workspace: "Workspace",
    channel: "Canal",
    channelSubtitle: "thread de decisões",
    week: "Semana",
    score: "Score",
    best: "Recorde",
    streak: "Streak",
    language: "Idioma",
    sound: "Som",
    soundOn: "ON",
    soundOff: "OFF",
    dailySeed: "Desafio do dia",
    dailySeedOn: "ON",
    dailySeedOff: "OFF",
    settingsButton: "Config",
    settingsKicker: "Config",
    settingsTitle: "Ajustes",
    settingsCopy: "Muda idioma e preferências sem derrubar a run.",
    runStatus: "Status",
    build: "Build",
    perks: "Perks",
    noPerks: "Nenhum perk ativo.",
    leaderboard: "Ranking",
    leaderboardEmpty: "Nenhuma run salva.",
    viewFullRanking: "Ver ranking completo",
    rankingKicker: "Hall",
    rankingTitle: "Ranking",
    rankingFilterAll: "Todas",
    rankingFilterDaily: "Hoje",
    rankingFilterCountry: "Meu país",
    rankingEmpty: "Nenhuma run nesse filtro.",
    reset: "Nova run",
    chatSubtitle: "Stakeholders mandam mensagem. Você decide como responder.",
    quickReplies: "Suas opções",
    chooseReply: "Como você responde?",
    composerHint: "Tecle 1 ou 2. Sem spoiler de impacto.",
    leftKey: "1",
    rightKey: "2",
    you: "Você",
    youRole: "engineering manager",
    decisionTag: "decisão",
    system: "Sistema",
    outcomeTag: "resultado",
    runSaved: "Salva",
    saveRun: "Salvar",
    close: "Fechar",
    origin: "Origem",
    chooseOrigin: "Quem você é?",
    chooseOriginCopy: "Escolha uma origem. O resto desbloqueia jogando.",
    selectedOrigin: "Escolhido",
    startingEdge: "Bônus inicial",
    passiveLabel: "Passiva",
    careerFile: "Carreira & unlocks",
    careerRuns: "Runs",
    careerWins: "Clears",
    careerLegacies: "Legados",
    careerRareSeen: "Raras vistas",
    careerUnlocks: "Próximos unlocks",
    careerAllUnlocked: "Tudo desbloqueado. Agora é grind por score, legados e threads raras.",
    summaryUnlocks: "Novo unlock",
    locked: "Trancado",
    rareThread: "rara",
    signal: "Sinal",
    detailsOn: "Detalhes",
    detailsOff: "Foco",
    startRun: "Iniciar",
    perkDraft: "Draft de perk",
    choosePerk: "Escolha um perk",
    choosePerkCopy: "Novo ato. Escolha um upgrade pra build.",
    managerName: "Nome",
    managerNameFallback: "Gestor anônimo",
    summaryKicker: "Legado",
    summaryScore: "Score",
    summaryWeeks: "Semanas",
    summaryLegacy: "Legado",
    summaryTitleWin: "Quarter sobrevivido",
    summaryTitleLose: "Fim de run",
    summaryCopyWin: "Você fechou as 32 semanas. Registre o nome e entre pro ranking.",
    summaryCopyLose: "A run acabou. Registre o nome se quiser guardar o legado.",
    intro:
      "Quarter começou. Stakeholders vão aparecer aqui. Não deixe nenhuma barra chegar a zero.",
    resetPrompt: "Aperte Nova run pra tentar de novo.",
    endedLeft: "Fim de jogo",
    endedRight: "Jogar de novo",
    endedLeftSummary: "As barras finais ficaram na sidebar.",
    endedRightSummary: "Nova run, novas pressões.",
    scoreUnit: "pts",
    actLabel: "Ato",
    runSavedNote: "Run salva no ranking.",
    perkUnlocked: "Perk ativo",
    tooltipPressure: "Pressão",
    tooltipFlags: "Flags",
    tooltipNoPressure: "Sem pressão",
    history: "Log",
    historyTitle: "Log de decisões",
    historyKicker: "Log",
    historyEmpty: "Nenhuma decisão ainda.",
    share: "Copiar",
    shareCopied: "Copiado!",
    shareDownload: "Baixar PNG",
    outcomeShort: {
      victory: "quarter fechado",
      team: "time colapsou",
      delivery: "delivery colapsou",
      trust: "confiança colapsou",
      budget: "budget colapsou",
    },
    legacies: {
      steadyHand: "Mão Firme",
      teamShield: "Escudo do Time",
      boardWhisperer: "Ouvido da Diretoria",
      runwaySurgeon: "Cirurgião de Runway",
      shipMaxxer: "Viciado em Ship",
      chaosConductor: "Maestro do Caos",
      tradeoffKeeper: "Guardião de Trade-off",
    },
    runState: {
      stable: "estável",
      warning: "alerta",
      danger: "crítico",
    },
    metrics: {
      team: { label: "Time", detail: "burnout, moral e energia da squad" },
      delivery: { label: "Delivery", detail: "o quarter ainda parece factível?" },
      trust: { label: "Confiança", detail: "a liderança ainda confia no seu steering?" },
      budget: { label: "Budget", detail: "quanto de caixa e margem política ainda resta" },
    },
    gameOver: {
      team: "GAME OVER — o time colapsou. Burnout venceu.",
      delivery: "GAME OVER — delivery travou. O quarter virou promessa vazia.",
      trust: "GAME OVER — a confiança acabou. A liderança passou por cima de você.",
      budget: "GAME OVER — budget zerou. Sua autonomia virou contenção.",
      victory: "QUARTER FECHADO — você atravessou as 32 semanas sem perder nenhuma barra.",
    },
    tutorialNext: "Próximo",
    tutorialSkip: "Pular",
    tutorialSteps: [
      { target: ".metric-ribbon", text: "Suas quatro barras. Se qualquer uma zerar, acabou." },
      { target: "#week-counter", text: "Semana atual. Sobreviva 32 pra fechar o quarter." },
      { target: "#timeline", text: "Progresso da run. A intensidade sobe a cada ato." },
      { target: ".composer__choices", text: "Duas opções por rodada. O impacto só aparece depois." },
      { target: "#status-chip", text: "Status geral. Quando ficar vermelho, qualquer erro mata." },
    ],
  },
  en: {
    htmlLang: "en",
    title: "Ship or Sink - Chat Ops",
    description: "Decision game for engineering managers in a Slack-inspired interface.",
    workspace: "Workspace",
    channel: "Channel",
    channelSubtitle: "decision thread",
    week: "Week",
    score: "Score",
    best: "Best",
    streak: "Streak",
    language: "Language",
    sound: "Sound",
    soundOn: "ON",
    soundOff: "OFF",
    dailySeed: "Daily seed",
    dailySeedOn: "ON",
    dailySeedOff: "OFF",
    settingsButton: "Settings",
    settingsKicker: "Config",
    settingsTitle: "Run settings",
    settingsCopy: "Adjust language and interface preferences without resetting the run.",
    runStatus: "Run status",
    build: "Build",
    perks: "Perks",
    noPerks: "No active perks yet.",
    leaderboard: "Ranking",
    leaderboardEmpty: "No saved runs yet.",
    viewFullRanking: "View full ranking",
    rankingKicker: "Hall",
    rankingTitle: "Ranking",
    rankingFilterAll: "All",
    rankingFilterDaily: "Today",
    rankingFilterCountry: "My country",
    rankingEmpty: "No runs match this filter.",
    reset: "Reset run",
    chatSubtitle: "Stakeholders show up here. You respond as the engineering manager.",
    quickReplies: "Quick replies",
    chooseReply: "Choose your reply",
    composerHint: "Press 1 or 2. Hidden consequences.",
    leftKey: "1",
    rightKey: "2",
    you: "You",
    youRole: "engineering manager",
    decisionTag: "decision",
    system: "System",
    outcomeTag: "outcome",
    runSaved: "Run saved",
    saveRun: "Save run",
    close: "Close",
    origin: "Origin",
    chooseOrigin: "Choose your manager",
    chooseOriginCopy: "Pick an origin. The rest unlocks as you play.",
    selectedOrigin: "Your pick",
    startingEdge: "Starting edge",
    passiveLabel: "Trait",
    careerFile: "Career and unlocks",
    careerRuns: "Runs",
    careerWins: "Clears",
    careerLegacies: "Legacies",
    careerRareSeen: "Rare seen",
    careerUnlocks: "Next unlocks",
    careerAllUnlocked: "Every build-affecting unlock is already open. The grind now is score, legacies, and rare threads.",
    summaryUnlocks: "Unlocked now",
    locked: "Locked",
    rareThread: "rare thread",
    signal: "Signal",
    detailsOn: "Show details",
    detailsOff: "Focus mode",
    startRun: "Start run",
    perkDraft: "Perk draft",
    choosePerk: "Pick one advantage",
    choosePerkCopy: "The run entered a new act. Choose an upgrade for the build.",
    managerName: "Manager name",
    managerNameFallback: "Nameless manager",
    summaryKicker: "Legacy",
    summaryScore: "Score",
    summaryWeeks: "Weeks",
    summaryLegacy: "Marked as",
    summaryTitleWin: "Quarter survived",
    summaryTitleLose: "Run finished",
    summaryCopyWin: "You made it through all 32 weeks. This manager can now enter the leaderboard.",
    summaryCopyLose: "The run ended. If you want, record the manager name and the legacy they left behind.",
    intro: "Quarter started. Stakeholders will show up in this channel. Keep Team, Delivery, Trust, and Budget alive.",
    resetPrompt: "Use Reset run to open another quarter thread.",
    endedLeft: "Run ended",
    endedRight: "Reset to play",
    endedLeftSummary: "The final bars are still recorded in the sidebar.",
    endedRightSummary: "Another run reshuffles the quarter pressures.",
    scoreUnit: "score",
    actLabel: "Act",
    runSavedNote: "Run recorded in the local leaderboard.",
    perkUnlocked: "Perk active",
    tooltipPressure: "Active pressure",
    tooltipFlags: "Flags",
    tooltipNoPressure: "No extra pressure",
    history: "History",
    historyTitle: "Decision history",
    historyKicker: "Log",
    historyEmpty: "No decisions recorded yet.",
    share: "Share",
    shareCopied: "Copied!",
    shareDownload: "Download image",
    outcomeShort: {
      victory: "quarter survived",
      team: "team collapse",
      delivery: "delivery collapse",
      trust: "trust collapse",
      budget: "budget collapse",
    },
    legacies: {
      steadyHand: "Steady Hand",
      teamShield: "Team Shield",
      boardWhisperer: "Board Whisperer",
      runwaySurgeon: "Runway Surgeon",
      shipMaxxer: "Ship Maxxer",
      chaosConductor: "Chaos Conductor",
      tradeoffKeeper: "Keeper of Trade-offs",
    },
    runState: {
      stable: "stable",
      warning: "warning",
      danger: "danger",
    },
    metrics: {
      team: { label: "Team", detail: "burnout, morale, and squad energy" },
      delivery: { label: "Delivery", detail: "how executable the quarter still looks" },
      trust: { label: "Trust", detail: "how much leadership still believes your steering" },
      budget: { label: "Budget", detail: "how much cash and political margin are still left" },
    },
    gameOver: {
      team: "GAME OVER: the team collapsed. Burnout won your run.",
      delivery: "GAME OVER: the quarter lost too much traction and turned into an empty promise.",
      trust: "GAME OVER: executive trust ran out and leadership started operating above you.",
      budget: "GAME OVER: budget dried up and your autonomy got traded for containment.",
      victory: "RUN COMPLETE: you crossed the whole quarter without letting any bar implode.",
    },
    tutorialNext: "Next",
    tutorialSkip: "Skip",
    tutorialSteps: [
      { target: ".metric-ribbon", text: "These are your metrics. If any reaches zero, the run ends." },
      { target: "#week-counter", text: "This tracks the current week. There are 32 weeks total." },
      { target: "#timeline", text: "The progress bar shows how far you are. Each color is a different act." },
      { target: ".composer__choices", text: "Choose between two replies. Each decision affects your metrics." },
      { target: "#status-chip", text: "Status shows the overall run health. Watch when it changes to warning." },
    ],
  },
};

const cardsById = Object.fromEntries(cards.map((card) => [card.id, card]));
const arcsById = Object.fromEntries(arcDefinitions.map((arc) => [arc.id, arc]));
const originsById = Object.fromEntries(origins.map((origin) => [origin.id, origin]));
const perksById = Object.fromEntries(perks.map((perk) => [perk.id, perk]));
const defaultUnlockedOriginIds = ["people-coach", "delivery-hawk", "systems-thinker"].filter((id) => originsById[id]);
const defaultUnlockedPerkIds = [
  "skip-levels",
  "roadmap-buffer",
  "board-script",
  "finops-routine",
  "bench-depth",
  "incident-drill",
  "cost-guardrails",
  "staff-council",
  "ops-ritual",
].filter((id) => perksById[id]);
const avatarCache = new Map();

const unlockRules = {
  "career-run-1": {
    test: (profile) => profile.runsCompleted >= 1,
    pt: "Complete 1 run, mesmo perdendo.",
    en: "Complete 1 run, even if you lose.",
  },
  "career-run-2": {
    test: (profile) => profile.runsCompleted >= 2,
    pt: "Complete 2 runs.",
    en: "Complete 2 runs.",
  },
  "career-three-runs": {
    test: (profile) => profile.runsCompleted >= 3,
    pt: "Complete 3 runs.",
    en: "Complete 3 runs.",
  },
  "career-act-3": {
    test: (profile) => profile.highestWeek >= 16,
    pt: "Chegue ao Ato 3 pelo menos uma vez.",
    en: "Reach Act 3 at least once.",
  },
  "career-first-win": {
    test: (profile) => profile.wins >= 1,
    pt: "Feche as 32 semanas uma vez.",
    en: "Clear all 32 weeks once.",
  },
  "career-budget-scar": {
    test: (profile) => profile.collapseCounts.budget >= 1 || profile.discoveredLegacies.includes("runwaySurgeon"),
    pt: "Quebre Budget uma vez ou deixe o legado Cirurgião de Runway.",
    en: "Collapse Budget once or leave the Runway Surgeon legacy.",
  },
  "career-team-scar": {
    test: (profile) => profile.collapseCounts.team >= 1 || profile.discoveredLegacies.includes("teamShield"),
    pt: "Quebre Team uma vez ou deixe o legado Escudo do Time.",
    en: "Collapse Team once or leave the Team Shield legacy.",
  },
  "career-trust-scar": {
    test: (profile) => profile.collapseCounts.trust >= 1 || profile.discoveredLegacies.includes("boardWhisperer"),
    pt: "Quebre Trust uma vez ou deixe o legado Sussurrador do Board.",
    en: "Collapse Trust once or leave the Board Whisperer legacy.",
  },
  "career-runway-guardian": {
    test: (profile) => profile.highestWeek >= 16 || profile.collapseCounts.budget >= 1,
    pt: "Chegue ao Ato 3 ou quebre Budget uma vez.",
    en: "Reach Act 3 or collapse Budget once.",
  },
  "career-exec-diplomat": {
    test: (profile) =>
      profile.runsCompleted >= 2 || profile.collapseCounts.trust >= 1 || profile.discoveredLegacies.includes("boardWhisperer"),
    pt: "Complete 2 runs ou prove que já sangrou em Trust.",
    en: "Complete 2 runs or prove you already bled on Trust.",
  },
  "career-retention-fund": {
    test: (profile) => profile.runsCompleted >= 1,
    pt: "Complete 1 run.",
    en: "Complete 1 run.",
  },
  "career-firebreak": {
    test: (profile) => profile.collapseCounts.team >= 1 || profile.discoveredLegacies.includes("teamShield"),
    pt: "Quebre Team uma vez ou deixe o legado Escudo do Time.",
    en: "Collapse Team once or leave the Team Shield legacy.",
  },
  "career-quarter-story": {
    test: (profile) => profile.wins >= 1,
    pt: "Feche uma run completa.",
    en: "Clear one full run.",
  },
};

function createDefaultProfile() {
  return {
    version: 1,
    runsStarted: 0,
    runsCompleted: 0,
    savedRuns: 0,
    wins: 0,
    totalScore: 0,
    highestWeek: 0,
    bestRunScore: 0,
    discoveredLegacies: [],
    unlockedOrigins: [...defaultUnlockedOriginIds],
    unlockedPerks: [...defaultUnlockedPerkIds],
    seenRareCards: [],
    collapseCounts: {
      team: 0,
      delivery: 0,
      trust: 0,
      budget: 0,
      victory: 0,
    },
  };
}

function uniqueStringList(values, fallback = []) {
  if (!Array.isArray(values)) {
    return [...fallback];
  }

  return [...new Set(values.filter((value) => typeof value === "string"))];
}

function normalizeProfile(profile) {
  const base = createDefaultProfile();
  const normalized = {
    ...base,
    ...(profile && typeof profile === "object" ? profile : {}),
    unlockedOrigins: uniqueStringList(profile?.unlockedOrigins, base.unlockedOrigins).filter((id) => originsById[id]),
    unlockedPerks: uniqueStringList(profile?.unlockedPerks, base.unlockedPerks).filter((id) => perksById[id]),
    discoveredLegacies: uniqueStringList(profile?.discoveredLegacies),
    seenRareCards: uniqueStringList(profile?.seenRareCards).filter((id) => cardsById[id]),
    collapseCounts: {
      ...base.collapseCounts,
      ...(profile?.collapseCounts && typeof profile.collapseCounts === "object" ? profile.collapseCounts : {}),
    },
  };

  if (normalized.unlockedOrigins.length === 0) {
    normalized.unlockedOrigins = [...base.unlockedOrigins];
  }

  if (normalized.unlockedPerks.length === 0) {
    normalized.unlockedPerks = [...base.unlockedPerks];
  }

  return normalized;
}

function isUnlockRuleMet(unlockKey, profile) {
  if (!unlockKey) {
    return true;
  }

  const rule = unlockRules[unlockKey];
  return rule ? rule.test(profile) : false;
}

function applyProfileUnlocks(profile) {
  const newUnlocks = [];

  origins.forEach((origin) => {
    if (!origin.unlockKey || profile.unlockedOrigins.includes(origin.id) || !isUnlockRuleMet(origin.unlockKey, profile)) {
      return;
    }

    profile.unlockedOrigins.push(origin.id);
    newUnlocks.push({ kind: "origin", id: origin.id });
  });

  perks.forEach((perk) => {
    if (!perk.unlockKey || profile.unlockedPerks.includes(perk.id) || !isUnlockRuleMet(perk.unlockKey, profile)) {
      return;
    }

    profile.unlockedPerks.push(perk.id);
    newUnlocks.push({ kind: "perk", id: perk.id });
  });

  return newUnlocks;
}

function loadProfile() {
  try {
    const stored = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || "null");
    const profile = normalizeProfile(stored);
    applyProfileUnlocks(profile);
    return profile;
  } catch {
    return normalizeProfile(null);
  }
}

function saveProfile() {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(state.profile));
  } catch {
    return;
  }
}

function getFirstUnlockedOriginId(profile) {
  return origins.find((origin) => profile.unlockedOrigins.includes(origin.id))?.id || origins[0]?.id || null;
}

const avatarPalettes = {
  exec: {
    skin: ["#f4c7a1", "#eab694", "#d8a07f"],
    hair: ["#2b2521", "#4c3328", "#7a5938"],
    shirt: ["#d88f30", "#c66b2e", "#8f4a1d"],
    bg: "#2b313c",
  },
  finance: {
    skin: ["#f1c9aa", "#d8ad89", "#b98569"],
    hair: ["#4c2f20", "#6f4a33", "#231913"],
    shirt: ["#5e8d78", "#486d5d", "#2f5041"],
    bg: "#243038",
  },
  pm: {
    skin: ["#f2c8a8", "#ddb28b", "#bc8c67"],
    hair: ["#36281f", "#71503a", "#a8734b"],
    shirt: ["#5f7cf0", "#4460ca", "#2f438f"],
    bg: "#29314a",
  },
  eng: {
    skin: ["#f0caa7", "#d6ae86", "#b98966"],
    hair: ["#2d231b", "#5d4633", "#1b1613"],
    shirt: ["#4ea472", "#327557", "#22513d"],
    bg: "#21322c",
  },
  sre: {
    skin: ["#f2c5a0", "#deab84", "#ba835c"],
    hair: ["#27211d", "#5c4a3b", "#91806b"],
    shirt: ["#3a8e83", "#2c6b63", "#1f4b45"],
    bg: "#203239",
  },
  people: {
    skin: ["#f4ceb0", "#ddb08e", "#b78464"],
    hair: ["#2e2321", "#6a5146", "#9f6b51"],
    shirt: ["#8d6db8", "#6d5491", "#4f3a69"],
    bg: "#2f2b3f",
  },
  customer: {
    skin: ["#f4cab0", "#dfb18b", "#be8664"],
    hair: ["#30211a", "#6a4532", "#19110d"],
    shirt: ["#4f8d87", "#3d6f6b", "#2d524f"],
    bg: "#233238",
  },
  support: {
    skin: ["#efc5a4", "#d7a683", "#b47a58"],
    hair: ["#231a15", "#5a4334", "#87634a"],
    shirt: ["#5f7cf0", "#4660b6", "#324488"],
    bg: "#273048",
  },
  manager: {
    skin: ["#f2c8a0", "#ddb08a", "#bc845f"],
    hair: ["#231b16", "#5d4838", "#8d6a52"],
    shirt: ["#2e7af0", "#2159b1", "#163c78"],
    bg: "#1f2e40",
  },
};

const avatarRoleSpecs = {
  exec: {
    accessory: "tie",
    garment: "lapel",
    accent: "#f6ddb2",
  },
  finance: {
    accessory: "glasses",
    garment: "vest",
    accent: "#d7ebde",
  },
  pm: {
    accessory: "earpiece",
    garment: "lapel",
    accent: "#d9defe",
  },
  eng: {
    accessory: "lanyard",
    garment: "hoodie",
    accent: "#d2ecdc",
  },
  sre: {
    accessory: "headset",
    garment: "hoodie",
    accent: "#cee9e5",
  },
  people: {
    accessory: "pin",
    garment: "cardigan",
    accent: "#eadcf7",
  },
  customer: {
    accessory: "headset",
    garment: "blazer",
    accent: "#d6ece8",
  },
  support: {
    accessory: "headset",
    garment: "zip",
    accent: "#d8e0ff",
  },
  manager: {
    accessory: "badge",
    garment: "lapel",
    accent: "#dbe7ff",
  },
};

const initialProfile = loadProfile();
const initialOriginId = getFirstUnlockedOriginId(initialProfile);

const state = {
  locale: loadLocale(),
  detailsMode: loadDetailsMode(),
  week: 1,
  score: 0,
  bestScore: loadBestScore(),
  leaderboard: loadLeaderboard(),
  profile: initialProfile,
  originId: initialOriginId,
  selectedOriginId: initialOriginId,
  activeArcIds: [],
  arcCast: {},
  perkIds: [],
  perkDraftWeeksSeen: [],
  pendingPerkIds: [],
  originShieldUsed: false,
  awaitingSetup: false,
  streak: 0,
  metrics: {},
  history: [],
  currentCard: null,
  cycleSeen: new Set(),
  recentCards: [],
  flags: {},
  styleStats: {},
  lastOutcome: "",
  lastGain: 0,
  ended: false,
  dailySeedMode: localStorage.getItem("people-pager-daily-seed") === "true",
  rng: null,
  soundMuted: localStorage.getItem("people-pager-sound-muted") === "true",
  tutorialStep: 0,
  tutorialActive: false,
  locked: false,
  gameOverReason: null,
  runWon: false,
  runSaved: false,
  finalLegacy: null,
  pendingUnlocks: [],
  signal: null,
  metricPulse: {},
};

let signalTimeoutId = 0;
let metricPulseTimeoutId = 0;

const metricIcons = {
  team: "T",
  delivery: "D",
  trust: "!",
  budget: "$",
};

const cabinetElement = document.querySelector("#cabinet");
const metaDescriptionElement = document.querySelector("#meta-description");
const workspaceLabelElement = document.querySelector("#workspace-label");
const workspaceTitleElement = document.querySelector("#workspace-title");
const settingsButtonElement = document.querySelector("#settings-button");
const weekLabelElement = document.querySelector("#week-label");
const scoreLabelElement = document.querySelector("#score-label");
const bestLabelElement = document.querySelector("#best-label");
const streakLabelElement = document.querySelector("#streak-label");
const languageLabelElement = document.querySelector("#language-label");
const localePtButton = document.querySelector("#locale-pt");
const localeEnButton = document.querySelector("#locale-en");
const runStatusLabelElement = document.querySelector("#run-status-label");
const buildLabelElement = document.querySelector("#build-label");
const originCardElement = document.querySelector("#origin-card");
const perksLabelElement = document.querySelector("#perks-label");
const perkListElement = document.querySelector("#perk-list");
const perkEmptyElement = document.querySelector("#perk-empty");
const leaderboardLabelElement = document.querySelector("#leaderboard-label");
const leaderboardListElement = document.querySelector("#leaderboard-list");
const leaderboardEmptyElement = document.querySelector("#leaderboard-empty");
const rankingToggleElement = document.querySelector("#ranking-toggle");
const rankingDialog = document.querySelector("#ranking-dialog");
const rankingListElement = document.querySelector("#ranking-list");
const rankingEmptyElement = document.querySelector("#ranking-empty");
const rankingKickerElement = document.querySelector("#ranking-kicker");
const rankingTitleElement = document.querySelector("#ranking-title");
const closeRankingButton = document.querySelector("#close-ranking-button");
const rankingFilterButtons = document.querySelectorAll(".ranking-filter");
const weekCounterElement = document.querySelector("#week-counter");
const scoreCounterElement = document.querySelector("#score-counter");
const bestCounterElement = document.querySelector("#best-counter");
const streakCounterElement = document.querySelector("#streak-counter");
const statusChipElement = document.querySelector("#status-chip");
const sidebarNoteElement = document.querySelector("#sidebar-note");
const scoreGainElement = document.querySelector("#score-gain");
const metricsElement = document.querySelector("#metrics");
const metricTooltipElement = document.createElement("div");
metricTooltipElement.id = "metric-tooltip";
metricTooltipElement.className = "metric-tooltip";
metricTooltipElement.hidden = true;
document.body.appendChild(metricTooltipElement);
const threadElement = document.querySelector("#thread");
const chatChannelLabelElement = document.querySelector("#chat-channel-label");
const chatSubtitleElement = document.querySelector("#chat-subtitle");
const signalPanelElement = document.querySelector("#signal-panel");
const signalLabelElement = document.querySelector("#signal-label");
const signalCopyElement = document.querySelector("#signal-copy");
const detailsToggleElement = document.querySelector("#details-toggle");
const composerLabelElement = document.querySelector("#composer-label");
const composerTitleElement = document.querySelector("#composer-title");
const composerHintElement = document.querySelector("#composer-hint");
const leftChoiceElement = document.querySelector("#left-choice");
const rightChoiceElement = document.querySelector("#right-choice");
const leftKeyElement = document.querySelector("#left-key");
const rightKeyElement = document.querySelector("#right-key");
const leftLabelElement = document.querySelector("#left-label");
const rightLabelElement = document.querySelector("#right-label");
const leftSummaryElement = document.querySelector("#left-summary");
const rightSummaryElement = document.querySelector("#right-summary");
const leftEffectsElement = document.querySelector("#left-effects");
const rightEffectsElement = document.querySelector("#right-effects");
const restartButton = document.querySelector("#restart-button");
const runSummaryDialogElement = document.querySelector("#run-summary-dialog");
const runSummaryFormElement = document.querySelector("#run-summary-form");
const runSummaryKickerElement = document.querySelector("#run-summary-kicker");
const runSummaryTitleElement = document.querySelector("#run-summary-title");
const runSummaryCopyElement = document.querySelector("#run-summary-copy");
const runSummaryScoreLabelElement = document.querySelector("#run-summary-score-label");
const runSummaryScoreElement = document.querySelector("#run-summary-score");
const runSummaryWeekLabelElement = document.querySelector("#run-summary-week-label");
const runSummaryWeekElement = document.querySelector("#run-summary-week");
const runSummaryLegacyLabelElement = document.querySelector("#run-summary-legacy-label");
const runSummaryLegacyElement = document.querySelector("#run-summary-legacy");
const runSummaryUnlocksElement = document.querySelector("#run-summary-unlocks");
const runSummaryUnlocksLabelElement = document.querySelector("#run-summary-unlocks-label");
const runSummaryUnlocksListElement = document.querySelector("#run-summary-unlocks-list");
const runNameLabelElement = document.querySelector("#run-name-label");
const runNameInputElement = document.querySelector("#run-name-input");
const saveRunButtonElement = document.querySelector("#save-run-button");
const closeRunButtonElement = document.querySelector("#close-run-button");
const runSetupDialogElement = document.querySelector("#run-setup-dialog");
const runSetupFormElement = document.querySelector("#run-setup-form");
const runSetupKickerElement = document.querySelector("#run-setup-kicker");
const runSetupTitleElement = document.querySelector("#run-setup-title");
const runSetupCopyElement = document.querySelector("#run-setup-copy");
const setupSelectionLabelElement = document.querySelector("#setup-selection-label");
const setupSelectionCardElement = document.querySelector("#setup-selection-card");
const careerLabelElement = document.querySelector("#career-label");
const careerStatsElement = document.querySelector("#career-stats");
const careerUnlocksLabelElement = document.querySelector("#career-unlocks-label");
const careerUnlocksElement = document.querySelector("#career-unlocks");
const originOptionsElement = document.querySelector("#origin-options");
const startRunButtonElement = document.querySelector("#start-run-button");
const perkDialogElement = document.querySelector("#perk-dialog");
const perkFormElement = document.querySelector("#perk-form");
const perkKickerElement = document.querySelector("#perk-kicker");
const perkTitleElement = document.querySelector("#perk-title");
const perkCopyElement = document.querySelector("#perk-copy");
const perkOptionsElement = document.querySelector("#perk-options");
const settingsDialogElement = document.querySelector("#settings-dialog");
const settingsFormElement = document.querySelector("#settings-form");
const settingsKickerElement = document.querySelector("#settings-kicker");
const settingsTitleElement = document.querySelector("#settings-title");
const settingsCopyElement = document.querySelector("#settings-copy");
const closeSettingsButtonElement = document.querySelector("#close-settings-button");
const historyToggleElement = document.querySelector("#history-toggle");
const historyDialogElement = document.querySelector("#history-dialog");
const historyFormElement = document.querySelector("#history-form");
const historyKickerElement = document.querySelector("#history-kicker");
const historyTitleElement = document.querySelector("#history-title");
const historyListElement = document.querySelector("#history-list");
const closeHistoryButtonElement = document.querySelector("#close-history-button");
const soundLabelElement = document.querySelector("#sound-label");
const soundOnButton = document.querySelector("#sound-on");
const soundOffButton = document.querySelector("#sound-off");
const dailySeedLabelElement = document.querySelector("#daily-seed-label");
const dailySeedOnButton = document.querySelector("#daily-seed-on");
const dailySeedOffButton = document.querySelector("#daily-seed-off");
const timelineElement = document.querySelector("#timeline");
const sharePreviewElement = document.querySelector("#share-preview");
const shareCanvasElement = document.querySelector("#share-canvas");
const shareImageElement = document.querySelector("#share-image");
const shareButtonElement = document.querySelector("#share-button");

function mulberry32(seed) {
  return function() {
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function getDailySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function initRng() {
  if (state.dailySeedMode) {
    state.rng = mulberry32(getDailySeed());
  } else {
    state.rng = Math.random;
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function shuffle(list) {
  const clone = [...list];

  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor((state.rng || Math.random)() * (index + 1));
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }

  return clone;
}

function loadBestScore() {
  try {
    return Number(localStorage.getItem("people-pager-best-score")) || 0;
  } catch {
    return 0;
  }
}

function saveBestScore() {
  try {
    localStorage.setItem("people-pager-best-score", String(state.bestScore));
  } catch {
    return;
  }
}

function loadLocale() {
  try {
    const stored = localStorage.getItem("people-pager-locale");

    if (stored === "pt" || stored === "en") {
      return stored;
    }
  } catch {
    return getBrowserLocale();
  }

  return getBrowserLocale();
}

function saveLocale() {
  try {
    localStorage.setItem("people-pager-locale", state.locale);
  } catch {
    return;
  }
}

function loadDetailsMode() {
  try {
    return localStorage.getItem(DETAILS_STORAGE_KEY) === "expanded";
  } catch {
    return false;
  }
}

function saveDetailsMode() {
  try {
    localStorage.setItem(DETAILS_STORAGE_KEY, state.detailsMode ? "expanded" : "compact");
  } catch {
    return;
  }
}

function loadLeaderboard() {
  try {
    const stored = JSON.parse(localStorage.getItem("people-pager-leaderboard") || "[]");

    if (!Array.isArray(stored)) {
      return [];
    }

    return stored
      .filter((entry) => entry && typeof entry === "object")
      .map((entry) => ({
        name: typeof entry.name === "string" ? entry.name : "",
        score: Number(entry.score) || 0,
        weeks: Number(entry.weeks) || 0,
        legacyKey: typeof entry.legacyKey === "string" ? entry.legacyKey : "tradeoffKeeper",
        originId: typeof entry.originId === "string" ? entry.originId : origins[0]?.id || null,
        reason: typeof entry.reason === "string" ? entry.reason : "team",
        won: Boolean(entry.won),
        country: typeof entry.country === "string" ? entry.country : null,
        savedAt: Number(entry.savedAt) || Date.now(),
      }))
      .sort(sortLeaderboardEntries)
      .slice(0, LEADERBOARD_LIMIT);
  } catch {
    return [];
  }
}

function saveLeaderboard() {
  try {
    localStorage.setItem(
      "people-pager-leaderboard",
      JSON.stringify(state.leaderboard.slice(0, LEADERBOARD_LIMIT))
    );
  } catch {
    return;
  }
}

function getBrowserLocale() {
  return navigator.language && navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en";
}

function getCountryFlag() {
  try {
    const lang = navigator.language || navigator.languages?.[0] || "";
    const parts = lang.split("-");
    const region = parts.length > 1 ? parts[parts.length - 1].toUpperCase() : null;
    if (!region || region.length !== 2) return null;
    const codePoints = [...region].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65);
    return String.fromCodePoint(...codePoints);
  } catch {
    return null;
  }
}

function getUi() {
  return uiCopy[state.locale];
}

function getMetricCopy(metricKey) {
  return getUi().metrics[metricKey];
}

function getCardCopy(card) {
  if (state.locale !== "en") {
    return card;
  }

  const translated = englishCards[card.id];

  if (!translated) {
    return card;
  }

  return {
    ...card,
    ...translated,
    left: {
      ...card.left,
      ...translated.left,
    },
    right: {
      ...card.right,
      ...translated.right,
    },
  };
}

function getGameOverCopy(reasonKey) {
  return getUi().gameOver[reasonKey] || "";
}

function getOrigin() {
  return originsById[state.originId] || origins[0] || null;
}

function getPerk(perkId) {
  return perksById[perkId] || null;
}

function getArcSpeaker(card) {
  if (!card?.arcId) {
    return card?.speaker || "";
  }

  return state.arcCast[card.arcId]?.speaker || card.speaker || "";
}

function getBuildCopy(entry) {
  if (!entry) {
    return null;
  }

  return entry[state.locale] || entry.pt || entry.en || null;
}

function getOriginStartCopy(origin) {
  if (!origin) {
    return "";
  }

  const entries = Object.entries(origin.startingMetrics || {}).filter(([, value]) => value > 0);

  if (entries.length === 0) {
    return "";
  }

  if (entries.length === metricConfig.length) {
    const amount = entries[0]?.[1] || 0;
    return state.locale === "pt" ? `+${amount} em todas as barras` : `+${amount} to all bars`;
  }

  return entries
    .map(([metricKey, value]) => `+${value} ${getMetricCopy(metricKey).label}`)
    .join(state.locale === "pt" ? " e " : " and ");
}

function getUnlockRequirementCopy(unlockKey) {
  if (!unlockKey) {
    return "";
  }

  const rule = unlockRules[unlockKey];
  return rule ? rule[state.locale] || rule.pt || rule.en || "" : "";
}

function isOriginUnlocked(originId) {
  return state.profile.unlockedOrigins.includes(originId);
}

function isPerkUnlocked(perkId) {
  return state.profile.unlockedPerks.includes(perkId);
}

function getUnlockDisplay(unlock) {
  if (!unlock) {
    return null;
  }

  if (unlock.kind === "origin") {
    const origin = originsById[unlock.id];
    const copy = getBuildCopy(origin);
    return copy
      ? {
          kind: unlock.kind,
          name: copy.name,
          detail: copy.passive,
        }
      : null;
  }

  if (unlock.kind === "perk") {
    const perk = perksById[unlock.id];
    const copy = getBuildCopy(perk);
    return copy
      ? {
          kind: unlock.kind,
          name: copy.name,
          detail: copy.effect,
        }
      : null;
  }

  return null;
}

function getUpcomingUnlocks(limit = 3) {
  const buildUnlocks = [
    ...origins
      .filter((origin) => origin.unlockKey && !state.profile.unlockedOrigins.includes(origin.id))
      .map((origin) => ({ kind: "origin", id: origin.id, unlockKey: origin.unlockKey })),
    ...perks
      .filter((perk) => perk.unlockKey && !state.profile.unlockedPerks.includes(perk.id))
      .map((perk) => ({ kind: "perk", id: perk.id, unlockKey: perk.unlockKey })),
  ];

  return buildUnlocks.slice(0, limit);
}

function countUnlockedRareThreads() {
  return rareScenarios.filter((card) => isUnlockRuleMet(card.unlockKey, state.profile)).length;
}

function getLegacyLabel(legacyKey) {
  return getUi().legacies[legacyKey] || getUi().legacies.tradeoffKeeper;
}

function getActThemeCopy(act = getAct()) {
  const copy = {
    pt: {
      1: "setup e fricção",
      2: "alinhamento e promessas",
      3: "política e people debt",
      4: "trade-offs sem resposta limpa",
    },
    en: {
      1: "setup and friction",
      2: "alignment and promises",
      3: "politics and people debt",
      4: "no-clean-answer trade-offs",
    },
  };

  return copy[state.locale][act];
}

function initStyleStats() {
  return {
    teamCare: 0,
    teamDamage: 0,
    deliveryPush: 0,
    deliveryTax: 0,
    trustWork: 0,
    trustDamage: 0,
    budgetGuard: 0,
    budgetSpend: 0,
    hardCalls: 0,
    leftChoices: 0,
    rightChoices: 0,
  };
}

function initMetrics() {
  return metricConfig.reduce((metrics, metric) => {
    metrics[metric.key] = START_METRIC;
    return metrics;
  }, {});
}

function applyStartingOrigin(originId) {
  const origin = originsById[originId] || origins[0] || null;

  if (!origin) {
    return;
  }

  Object.entries(origin.startingMetrics || {}).forEach(([metricKey, value]) => {
    state.metrics[metricKey] = clamp(state.metrics[metricKey] + value, 0, 100);
  });
}

function resetGame(originId = getFirstUnlockedOriginId(state.profile)) {
  initRng();
  const safeOriginId = isOriginUnlocked(originId) ? originId : getFirstUnlockedOriginId(state.profile);
  state.originId = safeOriginId;
  state.selectedOriginId = safeOriginId;
  state.week = 1;
  state.score = 0;
  state.streak = 0;
  state.metrics = initMetrics();
  applyStartingOrigin(safeOriginId);
  state.history = [];
  state.activeArcIds = [];
  state.arcCast = {};
  state.currentCard = null;
  state.cycleSeen = new Set();
  state.recentCards = [];
  state.flags = {};
  state.styleStats = initStyleStats();
  state.perkIds = [];
  state.perkDraftWeeksSeen = [];
  state.pendingPerkIds = [];
  state.originShieldUsed = false;
  state.awaitingSetup = false;
  state.lastOutcome = getUi().intro;
  state.lastGain = 0;
  state.ended = false;
  state.locked = false;
  state.gameOverReason = null;
  state.runWon = false;
  state.runSaved = false;
  state.finalLegacy = null;
  state.pendingUnlocks = [];
  state.signal = null;
  state.metricPulse = {};
}

function formatCounter(value, size = 3) {
  return String(value).padStart(size, "0");
}

function compactText(text, maxLength = 92) {
  if (!text) {
    return "";
  }

  const trimmed = text.trim();
  const sentenceMatch = trimmed.match(/^(.+?[.!?])(\s|$)/);
  const firstSentence = sentenceMatch ? sentenceMatch[1].trim() : trimmed;

  if (firstSentence.length <= maxLength) {
    return firstSentence;
  }

  return `${firstSentence.slice(0, maxLength - 3).trim()}...`;
}

function pushSignal(copy, tone = "info", duration = 1600) {
  state.signal = { copy, tone };
  renderSignal();

  window.clearTimeout(signalTimeoutId);
  signalTimeoutId = window.setTimeout(() => {
    state.signal = null;
    renderSignal();
  }, duration);
}

function triggerMetricPulse(delta) {
  state.metricPulse = Object.fromEntries(Object.entries(delta).filter(([, value]) => value !== 0));
  if (Object.values(delta).some((v) => v <= -6)) {
    SoundEngine.play("danger");
  }
  renderMetrics();

  window.clearTimeout(metricPulseTimeoutId);
  metricPulseTimeoutId = window.setTimeout(() => {
    state.metricPulse = {};
    renderMetrics();
  }, 400);
}

function pickFromList(list, seed, offset = 0) {
  return list[(seed + offset) % list.length];
}

function hashString(value) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function createAvatarSvg(name, sprite = "exec") {
  const seed = hashString(`${name}-${sprite}`);
  const palette = avatarPalettes[sprite] || avatarPalettes.exec;
  const roleSpec = avatarRoleSpecs[sprite] || avatarRoleSpecs.exec;
  const skin = pickFromList(palette.skin, seed, 0);
  const hair = pickFromList(palette.hair, seed, 1);
  const shirt = pickFromList(palette.shirt, seed, 2);
  const shirtShadow = pickFromList(palette.shirt, seed, 3);
  const shirtMid = pickFromList(palette.shirt, seed, 4);
  const accent = roleSpec.accent;
  const line = "#10161f";
  const eye = "#17202c";
  const bg = palette.bg;
  const panel = seed % 2 === 0 ? "#111b28" : "#152033";
  const highlight = seed % 3 === 0 ? accent : shirtMid;
  const blush = pickFromList(["#d88879", "#c37b69", "#c36b64"], seed, 6);
  const hairVariant = seed % 4;
  const faceVariant = Math.floor(seed / 7) % 3;
  const mouthVariant = Math.floor(seed / 13) % 3;
  const browTilt = Math.floor(seed / 17) % 3;
  const eyeY = 28 + (faceVariant === 2 ? 1 : 0);
  const clipId = `clip-${sprite}-${seed.toString(16)}`;

  const faceShapes = [
    "M22 18 C25 14 39 14 42 18 L44 27 C44 35 39 41 32 41 C25 41 20 35 20 27 Z",
    "M21 17 C24 13 40 13 43 18 L44 29 C44 36 38 42 32 42 C26 42 20 36 20 29 Z",
    "M23 18 C26 14 38 14 41 18 L43 28 C43 35 38 40 32 40 C26 40 21 35 21 28 Z",
  ];

  const hairBackShapes = [
    "M18 20 C20 10 44 10 46 20 L46 31 C44 25 39 21 32 21 C25 21 20 25 18 31 Z",
    "M19 18 C23 9 45 11 45 23 L45 32 C42 25 37 21 31 21 C25 21 21 24 19 30 Z",
    "M18 19 C21 11 43 10 46 20 L46 34 C43 27 38 24 32 24 C26 24 21 27 18 33 Z",
    "M18 21 C19 11 44 10 46 18 L46 30 C43 24 38 21 32 21 C26 21 21 24 18 30 Z",
  ];

  const hairFrontShapes = [
    "M21 19 C25 14 38 14 43 19 C38 16 35 16 32 16 C29 16 25 17 21 19 Z",
    "M22 19 C28 13 40 14 44 19 C40 17 37 16 32 17 C28 17 25 18 22 19 Z",
    "M20 20 C24 16 39 14 43 17 C41 20 37 22 33 22 C28 22 24 21 20 20 Z",
    "M22 18 C26 12 39 13 43 18 C39 16 36 15 31 15 C27 15 24 16 22 18 Z",
  ];

  const leftBrow = browTilt === 0 ? "M24 24 L29 23" : browTilt === 1 ? "M24 23 L29 24" : "M24 24 L29 24";
  const rightBrow = browTilt === 0 ? "M35 23 L40 24" : browTilt === 1 ? "M35 24 L40 23" : "M35 24 L40 24";
  const mouthPath =
    mouthVariant === 0 ? "M28 35 C30 37 34 37 36 35" : mouthVariant === 1 ? "M28 36 L36 36" : "M28 35 C30 34 34 34 36 35";

  const outfitBase = `<path d="M15 60 C17 49 24 43 32 43 C40 43 47 49 49 60 Z" fill="${shirtShadow}" />`;

  const outfitVariants = {
    lapel: `
      <path d="M19 60 C20 52 24 47 32 47 C40 47 44 52 45 60 Z" fill="${shirt}" />
      <path d="M25 47 L31 56 L27 60 L22 52 Z" fill="${accent}" />
      <path d="M39 47 L33 56 L37 60 L42 52 Z" fill="${accent}" />
    `,
    vest: `
      <path d="M19 60 C20 51 24 46 32 46 C40 46 44 51 45 60 Z" fill="${shirt}" />
      <path d="M27 46 L32 54 L37 46 Z" fill="${accent}" />
      <path d="M30 54 H34 V60 H30 Z" fill="${accent}" />
    `,
    hoodie: `
      <path d="M18 60 C19 51 24 45 32 45 C40 45 45 51 46 60 Z" fill="${shirt}" />
      <path d="M23 46 C25 43 28 42 32 42 C36 42 39 43 41 46 L39 52 C37 49 35 48 32 48 C29 48 27 49 25 52 Z" fill="${shirtMid}" />
      <path d="M29 51 L28 58" stroke="${accent}" stroke-width="1.8" stroke-linecap="round" />
      <path d="M35 51 L36 58" stroke="${accent}" stroke-width="1.8" stroke-linecap="round" />
    `,
    cardigan: `
      <path d="M18 60 C19 51 24 46 32 46 C40 46 45 51 46 60 Z" fill="${shirt}" />
      <path d="M31 46 L29 60 H25 L27 46 Z" fill="${accent}" />
      <path d="M33 46 L37 46 L39 60 H35 Z" fill="${accent}" />
    `,
    blazer: `
      <path d="M18 60 C19 51 24 46 32 46 C40 46 45 51 46 60 Z" fill="${shirt}" />
      <path d="M24 47 L31 55 L28 60 L22 51 Z" fill="${accent}" />
      <rect x="36" y="52" width="5" height="2" rx="1" fill="${accent}" />
    `,
    zip: `
      <path d="M18 60 C19 51 24 46 32 46 C40 46 45 51 46 60 Z" fill="${shirt}" />
      <path d="M32 46 V60" stroke="${accent}" stroke-width="2" stroke-linecap="round" />
      <rect x="30" y="52" width="4" height="4" rx="2" fill="${accent}" />
    `,
  };

  const accessoryVariants = {
    tie: `
      <path d="M30 45 H34 L35 49 L32 53 L29 49 Z" fill="${line}" />
      <path d="M30 53 L34 53 L35 60 H29 Z" fill="${highlight}" />
    `,
    glasses: `
      <rect x="22" y="${eyeY - 4}" width="8" height="6" rx="3" fill="none" stroke="${accent}" stroke-width="1.8" />
      <rect x="34" y="${eyeY - 4}" width="8" height="6" rx="3" fill="none" stroke="${accent}" stroke-width="1.8" />
      <path d="M30 ${eyeY - 1} H34" stroke="${accent}" stroke-width="1.6" stroke-linecap="round" />
    `,
    earpiece: `
      <circle cx="43" cy="29" r="3" fill="${accent}" />
      <path d="M43 32 C42 35 39 37 36 38" stroke="${accent}" stroke-width="1.6" stroke-linecap="round" fill="none" />
    `,
    lanyard: `
      <path d="M26 47 C28 50 29 53 30 57" stroke="${accent}" stroke-width="2" stroke-linecap="round" fill="none" />
      <path d="M38 47 C36 50 35 53 34 57" stroke="${accent}" stroke-width="2" stroke-linecap="round" fill="none" />
      <rect x="29" y="56" width="6" height="4" rx="1.5" fill="${accent}" />
    `,
    headset: `
      <path d="M22 29 C22 20 26 16 32 16 C38 16 42 20 42 29" stroke="${accent}" stroke-width="2" stroke-linecap="round" fill="none" />
      <path d="M42 30 C42 34 40 37 36 38" stroke="${accent}" stroke-width="1.8" stroke-linecap="round" fill="none" />
      <circle cx="22" cy="30" r="2.4" fill="${accent}" />
      <circle cx="42" cy="30" r="2.4" fill="${accent}" />
    `,
    pin: `
      <circle cx="39" cy="54" r="3.5" fill="${accent}" />
      <path d="M39 51.8 V56.2" stroke="${line}" stroke-width="1.2" stroke-linecap="round" />
      <path d="M36.8 54 H41.2" stroke="${line}" stroke-width="1.2" stroke-linecap="round" />
    `,
    badge: `
      <rect x="37" y="51" width="7" height="9" rx="2" fill="${accent}" />
      <rect x="39" y="53" width="3" height="1.5" rx="0.75" fill="${line}" />
    `,
  };

  const stageShape = `
    <rect x="4" y="4" width="56" height="56" rx="13" fill="${bg}" />
    <path d="M4 47 C15 42 24 41 32 44 C40 47 49 45 60 37 V60 H4 Z" fill="${panel}" />
    <circle cx="${46 + (seed % 6)}" cy="${18 + (seed % 5)}" r="${9 + (seed % 3)}" fill="${highlight}" fill-opacity="0.16" />
    <path d="M10 11 H26" stroke="${accent}" stroke-width="3" stroke-linecap="round" stroke-opacity="0.45" />
  `;

  const faceX = faceVariant === 1 ? 31.5 : 32;
  const leftEyeX = faceVariant === 2 ? 27 : 26.5;
  const rightEyeX = faceVariant === 0 ? 37.5 : 37;

  const faceBlock = `
    <circle cx="20" cy="29" r="3.2" fill="${skin}" />
    <circle cx="44" cy="29" r="3.2" fill="${skin}" />
    <path d="${hairBackShapes[hairVariant]}" fill="${hair}" />
    <path d="${faceShapes[faceVariant]}" fill="${skin}" stroke="${line}" stroke-width="1.2" stroke-linejoin="round" />
    <path d="${hairFrontShapes[hairVariant]}" fill="${hair}" />
    <path d="${leftBrow}" stroke="${line}" stroke-width="1.6" stroke-linecap="round" />
    <path d="${rightBrow}" stroke="${line}" stroke-width="1.6" stroke-linecap="round" />
    <circle cx="${leftEyeX}" cy="${eyeY}" r="1.6" fill="${eye}" />
    <circle cx="${rightEyeX}" cy="${eyeY}" r="1.6" fill="${eye}" />
    <path d="M32 29 V33" stroke="${line}" stroke-width="1.3" stroke-linecap="round" />
    <path d="${mouthPath}" stroke="${line}" stroke-width="1.5" stroke-linecap="round" fill="none" />
    <circle cx="26" cy="33" r="1.8" fill="${blush}" fill-opacity="0.42" />
    <circle cx="38" cy="33" r="1.8" fill="${blush}" fill-opacity="0.42" />
    <rect x="28" y="39" width="8" height="7" rx="3.5" fill="${skin}" />
  `;

  const shapes = `
    <defs>
      <clipPath id="${clipId}">
        <rect x="4" y="4" width="56" height="56" rx="13" />
      </clipPath>
    </defs>
    <rect width="64" height="64" rx="16" fill="#08101a" />
    <rect x="3" y="3" width="58" height="58" rx="14" fill="#0d1623" stroke="${accent}" stroke-width="2" />
    <g clip-path="url(#${clipId})">
      ${stageShape}
      ${outfitBase}
      ${outfitVariants[roleSpec.garment] || outfitVariants.lapel}
      ${faceBlock}
      ${accessoryVariants[roleSpec.accessory] || ""}
      <path d="M18 60 H46" stroke="${line}" stroke-width="1.4" stroke-linecap="round" opacity="0.4" />
      <circle cx="${faceX}" cy="13" r="1.5" fill="${accent}" fill-opacity="0.75" />
    </g>
  `;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-hidden="true">
      ${shapes}
    </svg>
  `.trim();
}

function getAvatarUrl(name, sprite = "exec") {
  const key = `${sprite}:${name}`;

  if (!avatarCache.has(key)) {
    const svg = createAvatarSvg(name, sprite);
    avatarCache.set(key, `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`);
  }

  return avatarCache.get(key);
}

function createWeekDivider(week, fresh = false) {
  const ui = getUi();
  const divider = document.createElement("div");
  divider.className = `thread-divider${fresh ? " thread-divider--fresh" : ""}`;
  divider.innerHTML = `
    <span class="thread-divider__line" aria-hidden="true"></span>
    <span class="thread-divider__label">${ui.week} ${formatCounter(week)}</span>
    <span class="thread-divider__line" aria-hidden="true"></span>
  `;
  return divider;
}

function metricSeverity(value) {
  if (value <= 20) {
    return "danger";
  }

  if (value <= 35) {
    return "warning";
  }

  return "stable";
}

function getAct() {
  return clamp(Math.ceil(state.week / ACT_LENGTH), 1, TOTAL_ACTS);
}

function getRunState() {
  const levels = metricConfig.map((metric) => metricSeverity(state.metrics[metric.key]));

  if (levels.includes("danger")) {
    return "danger";
  }

  if (levels.includes("warning")) {
    return "warning";
  }

  return "stable";
}

function updateStaticCopy() {
  const ui = getUi();

  document.documentElement.lang = ui.htmlLang;
  document.title = ui.title;
  metaDescriptionElement.setAttribute("content", ui.description);
  workspaceLabelElement.textContent = ui.workspace;
  workspaceTitleElement.textContent = "Ship or Sink";
  settingsButtonElement.textContent = ui.settingsButton;
  weekLabelElement.textContent = ui.week;
  scoreLabelElement.textContent = ui.score;
  bestLabelElement.textContent = ui.best;
  streakLabelElement.textContent = ui.streak;
  languageLabelElement.textContent = ui.language;
  runStatusLabelElement.textContent = ui.runStatus;
  buildLabelElement.textContent = ui.build;
  perksLabelElement.textContent = ui.perks;
  perkEmptyElement.textContent = ui.noPerks;
  leaderboardLabelElement.textContent = ui.leaderboard;
  leaderboardEmptyElement.textContent = ui.leaderboardEmpty;
  rankingToggleElement.textContent = ui.viewFullRanking;
  restartButton.textContent = ui.reset;
  chatChannelLabelElement.textContent = ui.channel;
  chatSubtitleElement.textContent = ui.chatSubtitle;
  signalLabelElement.textContent = ui.signal;
  detailsToggleElement.textContent = state.detailsMode ? ui.detailsOff : ui.detailsOn;
  detailsToggleElement.setAttribute("aria-pressed", String(state.detailsMode));
  composerLabelElement.textContent = ui.quickReplies;
  composerTitleElement.textContent = ui.chooseReply;
  composerHintElement.textContent = ui.composerHint;
  leftKeyElement.textContent = ui.leftKey;
  rightKeyElement.textContent = ui.rightKey;
  runSummaryKickerElement.textContent = ui.summaryKicker;
  runSummaryScoreLabelElement.textContent = ui.summaryScore;
  runSummaryWeekLabelElement.textContent = ui.summaryWeeks;
  runSummaryLegacyLabelElement.textContent = ui.summaryLegacy;
  runSummaryUnlocksLabelElement.textContent = ui.summaryUnlocks;
  runNameLabelElement.textContent = ui.managerName;
  runNameInputElement.placeholder = ui.managerNameFallback;
  saveRunButtonElement.textContent = state.runSaved ? ui.runSaved : ui.saveRun;
  closeRunButtonElement.textContent = ui.close;
  shareButtonElement.textContent = ui.share;
  runSetupKickerElement.textContent = ui.origin;
  runSetupTitleElement.textContent = ui.chooseOrigin;
  runSetupCopyElement.textContent = ui.chooseOriginCopy;
  setupSelectionLabelElement.textContent = ui.selectedOrigin;
  careerLabelElement.textContent = ui.careerFile;
  careerUnlocksLabelElement.textContent = ui.careerUnlocks;
  startRunButtonElement.textContent = ui.startRun;
  perkKickerElement.textContent = ui.perkDraft;
  perkTitleElement.textContent = ui.choosePerk;
  perkCopyElement.textContent = ui.choosePerkCopy;
  settingsKickerElement.textContent = ui.settingsKicker;
  settingsTitleElement.textContent = ui.settingsTitle;
  settingsCopyElement.textContent = ui.settingsCopy;
  closeSettingsButtonElement.textContent = ui.close;
  historyToggleElement.textContent = ui.history;
  historyKickerElement.textContent = ui.historyKicker;
  historyTitleElement.textContent = ui.historyTitle;
  closeHistoryButtonElement.textContent = ui.close;
  localePtButton.setAttribute("aria-pressed", String(state.locale === "pt"));
  localeEnButton.setAttribute("aria-pressed", String(state.locale === "en"));
  soundLabelElement.textContent = ui.sound;
  soundOnButton.textContent = ui.soundOn;
  soundOffButton.textContent = ui.soundOff;
  soundOnButton.setAttribute("aria-pressed", String(!state.soundMuted));
  soundOffButton.setAttribute("aria-pressed", String(state.soundMuted));
  dailySeedLabelElement.textContent = ui.dailySeed;
  dailySeedOnButton.textContent = ui.dailySeedOn;
  dailySeedOffButton.textContent = ui.dailySeedOff;
  dailySeedOnButton.setAttribute("aria-pressed", String(state.dailySeedMode));
  dailySeedOffButton.setAttribute("aria-pressed", String(!state.dailySeedMode));
}

function statusCopy() {
  const act = getAct();

  if (state.awaitingSetup) {
    return state.locale === "pt"
      ? "Escolha a origem do gestor para iniciar a run."
      : "Choose the manager origin to start the run.";
  }

  if (state.pendingPerkIds.length > 0 && !state.currentCard && !state.ended) {
    return state.locale === "pt"
      ? "Novo ato. Escolha uma vantagem para continuar a run."
      : "New act. Choose a perk to continue the run.";
  }

  if (state.ended) {
    if (state.runSaved) {
      return `${getUi().runSavedNote} ${getUi().actLabel} ${act}/${TOTAL_ACTS}.`;
    }

    return state.locale === "pt"
      ? `Run encerrada no ${getUi().actLabel.toLowerCase()} ${act}/${TOTAL_ACTS}. Salve o nome do gestor para marcar a run.`
      : `Run ended in ${getUi().actLabel.toLowerCase()} ${act}/${TOTAL_ACTS}. Save the manager name to mark the run.`;
  }

  const criticalMetric = metricConfig.find((metric) => metricSeverity(state.metrics[metric.key]) === "danger");

  if (criticalMetric) {
    return state.locale === "pt"
      ? `${getUi().actLabel} ${act}/${TOTAL_ACTS} - ${getActThemeCopy(act)}. ${getMetricCopy(criticalMetric.key).label} está prestes a colapsar.`
      : `${getUi().actLabel} ${act}/${TOTAL_ACTS} - ${getActThemeCopy(act)}. ${getMetricCopy(criticalMetric.key).label} is close to collapse.`;
  }

  const warningMetric = metricConfig.find((metric) => metricSeverity(state.metrics[metric.key]) === "warning");

  if (warningMetric) {
    return state.locale === "pt"
      ? `${getUi().actLabel} ${act}/${TOTAL_ACTS} - ${getActThemeCopy(act)}. ${getMetricCopy(warningMetric.key).label} entrou no amarelo.`
      : `${getUi().actLabel} ${act}/${TOTAL_ACTS} - ${getActThemeCopy(act)}. ${getMetricCopy(warningMetric.key).label} is in the yellow.`;
  }

  return state.locale === "pt"
    ? `${getUi().actLabel} ${act}/${TOTAL_ACTS} - ${getActThemeCopy(act)}. As quatro barras ainda estão respirando.`
    : `${getUi().actLabel} ${act}/${TOTAL_ACTS} - ${getActThemeCopy(act)}. All four bars are still breathing.`;
}

function updateHud() {
  const ui = getUi();

  weekCounterElement.textContent = formatCounter(state.week);
  scoreCounterElement.textContent = formatCounter(state.score, 6);
  bestCounterElement.textContent = formatCounter(state.bestScore, 6);
  streakCounterElement.textContent = `x${state.streak}`;
  scoreGainElement.textContent = state.lastGain > 0 ? `+${formatCounter(state.lastGain, 3)}` : "+000";
  sidebarNoteElement.textContent = statusCopy();

  const runState = getRunState();
  statusChipElement.textContent = ui.runState[runState];
  statusChipElement.classList.toggle("status-chip--warning", runState === "warning");
  const wasDanger = statusChipElement.classList.contains("status-chip--danger");
  statusChipElement.classList.toggle("status-chip--danger", runState === "danger");
  if (runState === "danger" && !wasDanger) {
    statusChipElement.classList.add("status-chip--pulse");
  } else if (runState !== "danger") {
    statusChipElement.classList.remove("status-chip--pulse");
  }
  statusChipElement.classList.toggle("status-chip--interactive", state.ended && !state.runSaved);
  statusChipElement.tabIndex = state.ended && !state.runSaved ? 0 : -1;
  statusChipElement.setAttribute("role", state.ended && !state.runSaved ? "button" : "status");
  statusChipElement.setAttribute(
    "title",
    state.ended && !state.runSaved
      ? state.locale === "pt"
        ? "Clique para salvar a run"
        : "Click to save the run"
      : ""
  );
  cabinetElement.classList.toggle("slack-shell--warning", runState === "warning");
  cabinetElement.classList.toggle("slack-shell--danger", runState === "danger");
}

function sortLeaderboardEntries(a, b) {
  return b.score - a.score || Number(b.won) - Number(a.won) || b.weeks - a.weeks || b.savedAt - a.savedAt;
}

const RANK_MEDALS = ["🥇", "🥈", "🥉"];

function buildLeaderboardRow(entry, index) {
  const origin = originsById[entry.originId] || null;
  const originCopy = getBuildCopy(origin);
  const flag = entry.country || "";
  const medal = RANK_MEDALS[index] || `#${formatCounter(index + 1, 2)}`;
  const row = document.createElement("article");
  row.className = "leaderboard-entry" + (index === 0 ? " leaderboard-entry--top" : "");
  row.innerHTML = `
    <div class="leaderboard-entry__top">
      <span class="leaderboard-entry__rank">${medal}</span>
      <strong class="leaderboard-entry__name">${flag ? flag + " " : ""}${entry.name}</strong>
      <span class="leaderboard-entry__score">${formatCounter(entry.score, 6)}</span>
    </div>
    <div class="leaderboard-entry__bottom">
      <span class="leaderboard-entry__legacy">${getLegacyLabel(entry.legacyKey)}${originCopy ? ` · ${originCopy.name}` : ""}</span>
      <span class="leaderboard-entry__meta">W${formatCounter(entry.weeks)} · ${getUi().outcomeShort[entry.reason] || entry.reason}</span>
    </div>
  `;
  return row;
}

function renderLeaderboard() {
  leaderboardListElement.innerHTML = "";
  const entries = [...state.leaderboard].sort(sortLeaderboardEntries).slice(0, SIDEBAR_LEADERBOARD_LIMIT);

  leaderboardEmptyElement.hidden = entries.length > 0;
  rankingToggleElement.hidden = state.leaderboard.length === 0;

  entries.forEach((entry, index) => {
    leaderboardListElement.append(buildLeaderboardRow(entry, index));
  });
}

let activeRankingFilter = "all";

function getDayKey(timestamp) {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getFilteredRankingEntries(filter) {
  const all = [...state.leaderboard].sort(sortLeaderboardEntries);
  if (filter === "daily") {
    const today = getDayKey(Date.now());
    return all.filter((e) => getDayKey(e.savedAt) === today);
  }
  if (filter === "country") {
    const myFlag = getCountryFlag();
    if (!myFlag) return all;
    return all.filter((e) => e.country === myFlag);
  }
  return all;
}

function renderRankingDialog() {
  const ui = getUi();
  rankingKickerElement.textContent = ui.rankingKicker;
  rankingTitleElement.textContent = ui.rankingTitle;

  const filterLabels = { all: ui.rankingFilterAll, daily: ui.rankingFilterDaily, country: ui.rankingFilterCountry };
  rankingFilterButtons.forEach((btn) => {
    const f = btn.dataset.filter;
    btn.textContent = filterLabels[f] || f;
    btn.classList.toggle("ranking-filter--active", f === activeRankingFilter);
  });

  rankingListElement.innerHTML = "";
  const entries = getFilteredRankingEntries(activeRankingFilter);
  rankingEmptyElement.hidden = entries.length > 0;

  entries.forEach((entry, index) => {
    rankingListElement.append(buildLeaderboardRow(entry, index));
  });
}

function openRankingDialog() {
  activeRankingFilter = "all";
  renderRankingDialog();
  rankingDialog.showModal();
}

function renderBuild() {
  const origin = getOrigin();
  const originCopy = getBuildCopy(origin);

  if (origin && originCopy) {
    originCardElement.innerHTML = `
      <div class="origin-card__top">
        <div class="origin-card__avatar">
          <img src="${getAvatarUrl(originCopy.name, origin.sprite || "manager")}" alt="${originCopy.name}" />
        </div>
        <div>
          <strong class="origin-card__name">${originCopy.name}</strong>
          <p class="origin-card__summary">${originCopy.summary}</p>
        </div>
      </div>
      <p class="origin-card__effect">${originCopy.passive}</p>
    `;
  } else {
    originCardElement.innerHTML = `<p class="sidebar-note">${getUi().chooseOriginCopy}</p>`;
  }

  perkListElement.innerHTML = "";
  perkEmptyElement.hidden = state.perkIds.length > 0;

  state.perkIds.forEach((perkId) => {
    const perk = getPerk(perkId);
    const perkCopy = getBuildCopy(perk);

    if (!perk || !perkCopy) {
      return;
    }

    const item = document.createElement("article");
    item.className = "perk-chip";
    item.innerHTML = `
      <strong class="perk-chip__name">${perkCopy.name}</strong>
      <span class="perk-chip__effect">${perkCopy.effect}</span>
    `;
    perkListElement.append(item);
  });
}

function renderCareer() {
  const ui = getUi();
  const stats = [
    { label: ui.careerRuns, value: formatCounter(state.profile.runsCompleted) },
    { label: ui.careerWins, value: formatCounter(state.profile.wins) },
    { label: ui.careerLegacies, value: formatCounter(state.profile.discoveredLegacies.length) },
    { label: ui.careerRareSeen, value: `${formatCounter(state.profile.seenRareCards.length)}/${formatCounter(rareScenarios.length)}` },
  ];

  careerStatsElement.innerHTML = "";

  stats.forEach((entry) => {
    const item = document.createElement("article");
    item.className = "career-stat";
    item.innerHTML = `
      <span class="career-stat__label">${entry.label}</span>
      <strong class="career-stat__value">${entry.value}</strong>
    `;
    careerStatsElement.append(item);
  });

  const upcoming = getUpcomingUnlocks();
  careerUnlocksElement.innerHTML = "";

  if (upcoming.length === 0) {
    const item = document.createElement("article");
    item.className = "unlock-item unlock-item--hint";
    item.innerHTML = `<strong class="unlock-item__name">${ui.careerAllUnlocked}</strong>`;
    careerUnlocksElement.append(item);
    return;
  }

  upcoming.forEach((unlock) => {
    const display = getUnlockDisplay(unlock);

    if (!display) {
      return;
    }

    const item = document.createElement("article");
    item.className = "unlock-item unlock-item--hint";
    item.innerHTML = `
      <span class="unlock-item__tag">${unlock.kind === "origin" ? ui.origin : ui.perkDraft}</span>
      <strong class="unlock-item__name">${display.name}</strong>
      <span class="unlock-item__detail">${getUnlockRequirementCopy(unlock.unlockKey)}</span>
    `;
    careerUnlocksElement.append(item);
  });
}

function getDefaultSignal() {
  const ui = getUi();

  if (state.awaitingSetup) {
    return {
      tone: "info",
      copy: state.locale === "pt" ? "SETUP // escolha a origem do gestor" : "SETUP // choose the manager origin",
    };
  }

  if (state.currentCard?.rarity === "rare") {
    return {
      tone: "reward",
      copy: `${ui.rareThread.toUpperCase()} // ${getCardCopy(state.currentCard).title}`,
    };
  }

  if (state.pendingPerkIds.length > 0) {
    return {
      tone: "reward",
      copy: `${ui.perkDraft.toUpperCase()} // ${ui.choosePerkCopy}`,
    };
  }

  if (state.ended) {
    return {
      tone: state.runWon ? "reward" : "danger",
      copy: getGameOverCopy(state.gameOverReason),
    };
  }

  const criticalMetric = metricConfig.find((metric) => metricSeverity(state.metrics[metric.key]) === "danger");

  if (criticalMetric) {
    return {
      tone: "danger",
      copy:
        state.locale === "pt"
          ? `${ui.actLabel.toUpperCase()} ${getAct()}/${TOTAL_ACTS} // ${getMetricCopy(criticalMetric.key).label} ${formatCounter(
              state.metrics[criticalMetric.key]
            )} // RISCO DE COLAPSO`
          : `${ui.actLabel.toUpperCase()} ${getAct()}/${TOTAL_ACTS} // ${getMetricCopy(criticalMetric.key).label} ${formatCounter(
              state.metrics[criticalMetric.key]
            )} // MELTDOWN RISK`,
    };
  }

  const warningMetric = metricConfig.find((metric) => metricSeverity(state.metrics[metric.key]) === "warning");

  if (warningMetric) {
    return {
      tone: "warning",
      copy:
        state.locale === "pt"
          ? `${ui.actLabel.toUpperCase()} ${getAct()}/${TOTAL_ACTS} // ${getActThemeCopy(getAct())} // ${getMetricCopy(
              warningMetric.key
            ).label} sob pressão`
          : `${ui.actLabel.toUpperCase()} ${getAct()}/${TOTAL_ACTS} // ${getActThemeCopy(getAct())} // ${getMetricCopy(
              warningMetric.key
            ).label} under pressure`,
    };
  }

  return {
    tone: "info",
    copy: `${ui.actLabel.toUpperCase()} ${getAct()}/${TOTAL_ACTS} // ${getActThemeCopy(getAct())}`,
  };
}

function renderSignal() {
  const signal = state.signal || getDefaultSignal();

  signalPanelElement.className = `signal-panel signal-panel--${signal.tone}`;
  signalCopyElement.textContent = signal.copy;
}

function renderTimeline() {
  timelineElement.innerHTML = "";
  for (let i = 1; i <= 32; i++) {
    const seg = document.createElement("div");
    const act = Math.ceil(i / 8);
    seg.className = "timeline__seg";
    seg.dataset.act = act;
    if (i <= state.week) seg.classList.add("timeline__seg--done");
    if (i === state.week) seg.classList.add("timeline__seg--current");
    if (i % 8 === 0) seg.classList.add("timeline__seg--act-end");
    timelineElement.appendChild(seg);
  }
}

function renderDetailsMode() {
  cabinetElement.classList.toggle("slack-shell--details", state.detailsMode);
}

function renderSetupDialog() {
  originOptionsElement.innerHTML = "";

  origins.forEach((origin) => {
    const originCopy = getBuildCopy(origin);
    const button = document.createElement("button");
    button.type = "button";
    const unlocked = isOriginUnlocked(origin.id);
    const selected = state.selectedOriginId === origin.id && unlocked;
    button.className = `roster-portrait${unlocked ? "" : " roster-portrait--locked"}${selected ? " roster-portrait--active" : ""}`;
    button.dataset.originId = origin.id;
    button.setAttribute("aria-pressed", String(selected));
    button.disabled = !unlocked;
    button.innerHTML = `
      <div class="roster-portrait__avatar">
        <img src="${getAvatarUrl(originCopy.name, origin.sprite || "manager")}" alt="${originCopy.name}" />
      </div>
      <strong class="roster-portrait__name">${originCopy.name}</strong>
      <span class="roster-portrait__edge">${unlocked ? getOriginStartCopy(origin) : ""}</span>
      ${!unlocked ? `<span class="roster-portrait__lock">${getUi().locked}</span>` : ""}
    `;
    originOptionsElement.append(button);
  });

  const selectedOrigin = originsById[state.selectedOriginId] || null;
  const selectedOriginCopy = getBuildCopy(selectedOrigin);
  const hasValidSelection = Boolean(selectedOrigin && selectedOriginCopy && isOriginUnlocked(selectedOrigin.id));

  if (hasValidSelection) {
    setupSelectionCardElement.innerHTML = `
      <div class="setup-hero__avatar">
        <img src="${getAvatarUrl(selectedOriginCopy.name, selectedOrigin.sprite || "manager")}" alt="${selectedOriginCopy.name}" />
      </div>
      <div class="setup-hero__info">
        <strong class="setup-hero__name">${selectedOriginCopy.name}</strong>
        <p class="setup-hero__summary">${selectedOriginCopy.summary}</p>
        <div class="setup-hero__stats">
          <div class="setup-hero__stat">
            <span class="setup-hero__stat-label">${getUi().startingEdge}</span>
            <strong class="setup-hero__stat-value">${getOriginStartCopy(selectedOrigin)}</strong>
          </div>
          <div class="setup-hero__stat">
            <span class="setup-hero__stat-label">${getUi().passiveLabel}</span>
            <p class="setup-hero__stat-detail">${selectedOriginCopy.passive}</p>
          </div>
        </div>
      </div>
    `;
  } else {
    setupSelectionCardElement.innerHTML = `<p class="setup-hero__empty">${getUi().chooseOriginCopy}</p>`;
  }

  startRunButtonElement.disabled = !hasValidSelection;
}

function renderPerkDialog() {
  perkOptionsElement.innerHTML = "";

  state.pendingPerkIds.filter((perkId) => isPerkUnlocked(perkId)).forEach((perkId) => {
    const perk = getPerk(perkId);
    const perkCopy = getBuildCopy(perk);

    if (!perk || !perkCopy) {
      return;
    }

    const button = document.createElement("button");
    button.type = "submit";
    button.value = perkId;
    button.className = "perk-option";
    button.innerHTML = `
      <strong class="perk-option__name">${perkCopy.name}</strong>
      <p class="perk-option__summary">${perkCopy.summary}</p>
      <span class="perk-option__effect">${perkCopy.effect}</span>
    `;
    perkOptionsElement.append(button);
  });
}

function renderMetrics() {
  metricsElement.innerHTML = "";

  metricConfig.forEach((metric) => {
    const metricCopy = getMetricCopy(metric.key);
    const value = state.metrics[metric.key];
    const pulse = state.metricPulse[metric.key];
    const chip = document.createElement("article");
    chip.className = `metric-chip metric-chip--${metricSeverity(value)}${pulse > 0 ? " metric-chip--impact-up" : ""}${
      pulse < 0 ? " metric-chip--impact-down" : ""
    }`;
    chip.innerHTML = `
      <div class="metric-chip__top">
        <span class="metric-chip__label">${metricIcons[metric.key]} ${metricCopy.label}</span>
        <strong class="metric-chip__value">${formatCounter(value)}</strong>
      </div>
      <div class="metric-chip__track" aria-hidden="true">
        <div class="metric-chip__fill metric-chip__fill--${metric.key}" style="width: ${value}%"></div>
      </div>
      <span class="metric-chip__state">${metricCopy.detail}</span>
    `;

    chip.addEventListener("mouseenter", (event) => {
      const ui = getUi();
      const pressure = getPressureEffects();
      const pressureValue = pressure[metric.key] || 0;
      const flagKeys = metricFlagMap[metric.key] || [];
      const activeFlags = flagKeys.filter((key) => state.flags[key]);

      let html = `<div class="metric-tooltip__title">${metricCopy.label}: ${formatCounter(value)}</div>`;
      html += `<div class="metric-tooltip__detail">${metricCopy.detail}</div>`;

      if (pressureValue !== 0) {
        html += `<div class="metric-tooltip__pressure">${ui.tooltipPressure}: ${pressureValue > 0 ? "+" : ""}${pressureValue}</div>`;
      } else {
        html += `<div class="metric-tooltip__pressure">${ui.tooltipNoPressure}</div>`;
      }

      if (activeFlags.length > 0) {
        html += `<div class="metric-tooltip__flags">${ui.tooltipFlags}: ${activeFlags.join(", ")}</div>`;
      }

      metricTooltipElement.innerHTML = html;
      metricTooltipElement.hidden = false;
      metricTooltipElement.style.left = `${event.clientX + 12}px`;
      metricTooltipElement.style.top = `${event.clientY + 12}px`;
    });

    chip.addEventListener("mousemove", (event) => {
      metricTooltipElement.style.left = `${event.clientX + 12}px`;
      metricTooltipElement.style.top = `${event.clientY + 12}px`;
    });

    chip.addEventListener("mouseleave", () => {
      metricTooltipElement.hidden = true;
    });

    metricsElement.append(chip);
  });
}

function createMessage({
  type,
  speaker = null,
  role = "",
  sprite = "exec",
  title,
  body,
  gain = null,
  fresh = false,
  active = false,
  rare = false,
}) {
  const ui = getUi();
  const item = document.createElement("div");
  item.className = `message message--${type}${fresh ? " message--fresh" : ""}${active ? " message--active" : ""}${
    rare ? " message--rare" : ""
  }`;

  if (type === "incoming") {
    item.innerHTML = `
      <div class="message__avatar message__avatar--${sprite}">
        <img src="${getAvatarUrl(speaker, sprite)}" alt="${speaker}" />
      </div>
      <div class="message__bubble">
        <div class="message__header">
          <strong class="message__speaker">${speaker}</strong>
          <span class="message__badge">${role}</span>
          ${rare ? `<span class="message__badge message__badge--rare">${ui.rareThread}</span>` : ""}
        </div>
        <strong class="message__title">${title}</strong>
        <p class="message__body">${body}</p>
      </div>
    `;
    return item;
  }

  if (type === "outgoing") {
    const origin = getOrigin();
    const originCopy = getBuildCopy(origin);
    item.innerHTML = `
      <div class="message__bubble">
        <div class="message__header">
          <span class="message__badge message__badge--reply">${ui.decisionTag}</span>
        </div>
        <strong class="message__decision">${title}</strong>
      </div>
      <div class="message__avatar message__avatar--manager">
        <img src="${getAvatarUrl(originCopy?.name || ui.youRole, origin?.sprite || "manager")}" alt="${ui.you}" />
      </div>
    `;
    return item;
  }

  item.innerHTML = `
    <div class="message__bubble">
      <div class="message__header">
        <strong class="message__speaker">${ui.system}</strong>
        <span class="message__badge message__badge--system">${ui.outcomeTag}</span>
      </div>
      <p class="message__body">${body}</p>
      ${gain !== null ? `<span class="message__gain">+${formatCounter(gain, 3)} ${ui.scoreUnit}</span>` : ""}
    </div>
  `;
  return item;
}

function renderThread() {
  threadElement.innerHTML = "";
  let lastRenderedWeek = null;

  if (state.history.length === 0) {
    const origin = getOrigin();
    const originCopy = getBuildCopy(origin);
    const introCopy =
      origin && originCopy
        ? `${getUi().intro} ${getUi().origin}: ${originCopy.name}. ${originCopy.passive}`
        : getUi().intro;
    threadElement.append(createWeekDivider(state.week, true));
    lastRenderedWeek = state.week;
    threadElement.append(
      createMessage({
        type: "system",
        body: introCopy,
      })
    );
  }

  state.history
    .slice(-6)
    .forEach((entry) => {
      if (entry.kind === "perk") {
        if (lastRenderedWeek !== entry.week) {
          threadElement.append(createWeekDivider(entry.week));
          lastRenderedWeek = entry.week;
        }

        threadElement.append(
          createMessage({
            type: "system",
            body: `${getUi().perkUnlocked}: ${entry.name}. ${entry.effect}`,
          })
        );
        return;
      }

      if (entry.kind === "act") {
        if (lastRenderedWeek !== entry.week) {
          threadElement.append(createWeekDivider(entry.week));
          lastRenderedWeek = entry.week;
        }

        threadElement.append(
          createMessage({
            type: "system",
            body: entry.body,
          })
        );
        return;
      }

      const card = getCardCopy(cardsById[entry.cardId]);
      const rawCard = cardsById[entry.cardId];
      const speaker = getArcSpeaker(rawCard) || card.speaker;

      if (lastRenderedWeek !== entry.week) {
        threadElement.append(createWeekDivider(entry.week));
        lastRenderedWeek = entry.week;
      }

      threadElement.append(
        createMessage({
          type: "incoming",
          speaker,
          role: card.role,
          sprite: rawCard.sprite,
          title: card.title,
          body: card.body,
          rare: rawCard.rarity === "rare",
        })
      );
      threadElement.append(
        createMessage({
          type: "outgoing",
          title: card[entry.choiceSide].label,
        })
      );
      threadElement.append(
        createMessage({
          type: "system",
          body: card[entry.choiceSide].result,
          gain: entry.gain,
        })
      );
    });

  if (state.ended) {
    threadElement.append(
      createMessage({
        type: "system",
        body:
          `${getGameOverCopy(state.gameOverReason)} ${getUi().score} ${formatCounter(state.score, 6)}. ` +
          `${getUi().summaryLegacy}: ${getLegacyLabel(state.finalLegacy)}. ${getUi().resetPrompt}`,
        fresh: true,
      })
    );
    threadElement.scrollTop = threadElement.scrollHeight;
    return;
  }

  if (state.currentCard) {
    const currentCard = getCardCopy(state.currentCard);
    const speaker = getArcSpeaker(state.currentCard) || currentCard.speaker;

    if (lastRenderedWeek !== state.week) {
      threadElement.append(createWeekDivider(state.week, true));
      lastRenderedWeek = state.week;
    }

    threadElement.append(
      createMessage({
        type: "incoming",
        speaker,
        role: currentCard.role,
        sprite: state.currentCard.sprite,
        title: currentCard.title,
        body: compactText(currentCard.body, 110),
        fresh: true,
        active: true,
        rare: state.currentCard.rarity === "rare",
      })
    );
  }

  threadElement.scrollTop = threadElement.scrollHeight;
}

function getWeakestMetricKey() {
  return metricConfig.reduce((lowest, metric) => {
    if (!lowest) {
      return metric.key;
    }

    return state.metrics[metric.key] < state.metrics[lowest] ? metric.key : lowest;
  }, null);
}

function cardAllowed(card) {
  const act = getAct();
  const actMin = card.actMin || 1;
  const actMax = card.actMax || TOTAL_ACTS;

  if (card.arcId && !state.activeArcIds.includes(card.arcId)) {
    return false;
  }

  if (act < actMin || act > actMax) {
    return false;
  }

  if (card.unlockKey && !isUnlockRuleMet(card.unlockKey, state.profile)) {
    return false;
  }

  if (typeof card.when === "function" && !card.when(state)) {
    return false;
  }

  return true;
}

function getCardPool() {
  let pool = cards.filter((card) => !state.cycleSeen.has(card.id) && cardAllowed(card));

  if (pool.length === 0) {
    state.cycleSeen.clear();
    pool = cards.filter((card) => cardAllowed(card));
  }

  const noRecent = pool.filter((card) => !state.recentCards.includes(card.id));

  if (noRecent.length > 0) {
    pool = noRecent;
  }

  return pool;
}

function focusPoolByAct(pool) {
  const act = getAct();
  const latePool = pool.filter((card) => (card.actMin || 1) >= Math.max(1, act - 1));
  const arcPool = latePool.filter((card) => card.arcId);

  if (arcPool.length >= 2) {
    return shuffle([...arcPool, ...latePool.filter((card) => !card.arcId)]).slice(0, Math.min(latePool.length, 12));
  }

  if (latePool.length >= 4) {
    return latePool;
  }

  const currentActPool = pool.filter((card) => (card.actMin || 1) === act);

  if (currentActPool.length >= 2) {
    return currentActPool;
  }

  return pool;
}

function cardTouchesMetric(card, metricKey) {
  return Boolean(card.left.effects[metricKey]) || Boolean(card.right.effects[metricKey]);
}

function pickNextCard() {
  const pool = focusPoolByAct(getCardPool());

  if (pool.length === 0) {
    state.currentCard = null;
    return;
  }

  const act = getAct();
  const weakestMetric = getWeakestMetricKey();

  const scored = pool.map((card) => {
    const priority = (card.priority || 1) * 10;
    const difficulty = (card.difficulty || 1) * 3;
    const actMin = card.actMin || 1;
    const actBias = actMin === act ? 12 : actMin === act - 1 ? 6 : 2;
    const pressureBias = cardTouchesMetric(card, weakestMetric) ? 2 : 0;
    const rarityBias = card.rarity === "rare" ? 7 : 0;
    const noise = (state.rng || Math.random)() * 4;

    return {
      card,
      score: priority + difficulty + actBias + pressureBias + rarityBias + noise,
    };
  });

  scored.sort((left, right) => right.score - left.score);
  state.currentCard = scored[0].card;
}

function renderChoices() {
  const ui = getUi();

  if (state.awaitingSetup) {
    leftChoiceElement.disabled = true;
    rightChoiceElement.disabled = true;
    leftLabelElement.textContent = ui.chooseOrigin;
    rightLabelElement.textContent = ui.startRun;
    leftSummaryElement.textContent = ui.chooseOriginCopy;
    rightSummaryElement.textContent = ui.chooseOriginCopy;
    leftEffectsElement.innerHTML = "";
    rightEffectsElement.innerHTML = "";
    return;
  }

  if (!state.currentCard && state.pendingPerkIds.length > 0) {
    leftChoiceElement.disabled = true;
    rightChoiceElement.disabled = true;
    leftLabelElement.textContent = ui.perkDraft;
    rightLabelElement.textContent = ui.choosePerk;
    leftSummaryElement.textContent = ui.choosePerkCopy;
    rightSummaryElement.textContent = ui.choosePerkCopy;
    leftEffectsElement.innerHTML = "";
    rightEffectsElement.innerHTML = "";
    return;
  }

  if (state.ended || !state.currentCard) {
    leftChoiceElement.disabled = true;
    rightChoiceElement.disabled = true;
    leftLabelElement.textContent = ui.endedLeft;
    rightLabelElement.textContent = ui.endedRight;
    leftSummaryElement.textContent = ui.endedLeftSummary;
    rightSummaryElement.textContent = ui.endedRightSummary;
    leftEffectsElement.innerHTML = "";
    rightEffectsElement.innerHTML = "";
    return;
  }

  const card = getCardCopy(state.currentCard);
  leftChoiceElement.disabled = false;
  rightChoiceElement.disabled = false;
  leftChoiceElement.title = card.left.summary;
  rightChoiceElement.title = card.right.summary;
  leftLabelElement.textContent = card.left.label;
  rightLabelElement.textContent = card.right.label;
  leftSummaryElement.textContent = card.left.summary;
  rightSummaryElement.textContent = card.right.summary;
  leftEffectsElement.innerHTML = "";
  rightEffectsElement.innerHTML = "";
}

function render() {
  updateStaticCopy();
  renderDetailsMode();
  updateHud();
  renderSignal();
  renderTimeline();
  renderBuild();
  renderCareer();
  renderLeaderboard();
  renderMetrics();
  renderThread();
  renderChoices();
  renderSetupDialog();
  renderPerkDialog();
  renderRunSummaryDialog();
}

function getBuildItems() {
  return [getOrigin(), ...state.perkIds.map((perkId) => getPerk(perkId))].filter(Boolean);
}

function resolveMetricChange(metricKey, value, source = "choice") {
  if (value >= 0) {
    return value;
  }

  let adjusted = value;
  const origin = getOrigin();

  if (
    origin &&
    origin.perActShield &&
    origin.perActShield.metric === metricKey &&
    !state.originShieldUsed &&
    source !== "perk"
  ) {
    adjusted = Math.min(0, adjusted + origin.perActShield.amount);
    state.originShieldUsed = true;
  }

  getBuildItems().forEach((item) => {
    if (item.mitigation?.[metricKey]) {
      adjusted = Math.min(0, adjusted + item.mitigation[metricKey]);
    }

    if (source === "pressure" && item.pressureMitigation?.[metricKey]) {
      adjusted = Math.min(0, adjusted + item.pressureMitigation[metricKey]);
    }
  });

  return adjusted;
}

function applyEffects(effects, source = "choice") {
  const applied = {};

  Object.entries(effects).forEach(([metricKey, value]) => {
    const resolved = resolveMetricChange(metricKey, value, source);
    state.metrics[metricKey] = clamp(state.metrics[metricKey] + resolved, 0, 100);
    applied[metricKey] = (applied[metricKey] || 0) + resolved;
  });

  return applied;
}

function mergeMetricDelta(...chunks) {
  return chunks.reduce((merged, chunk) => {
    Object.entries(chunk || {}).forEach(([metricKey, value]) => {
      merged[metricKey] = (merged[metricKey] || 0) + value;
    });
    return merged;
  }, {});
}

function applyActStartBonuses() {
  getBuildItems().forEach((item) => {
    if (!item.actStartBonus) {
      return;
    }

    const targetMetric = item.actStartBonus.metric === "lowest" ? getWeakestMetricKey() : item.actStartBonus.metric;

    if (!targetMetric) {
      return;
    }

    applyEffects({ [targetMetric]: item.actStartBonus.amount }, "perk");
  });
}

function handleActTransition() {
  SoundEngine.play("act-transition");
  state.originShieldUsed = false;
  applyActStartBonuses();
}

function drawPerkOptions() {
  const available = perks.filter((perk) => isPerkUnlocked(perk.id) && !state.perkIds.includes(perk.id));
  const pool = available.length >= 3 ? shuffle(available).slice(0, 3) : shuffle(available).slice(0, Math.min(3, available.length));
  state.pendingPerkIds = pool.map((perk) => perk.id);
}

function pickCharacterName(poolKey, usedNames) {
  const pool = characterPools[poolKey] || ["Alex"];
  const available = pool.filter((name) => !usedNames.has(name));
  const pickFrom = available.length > 0 ? available : pool;
  const chosen = shuffle(pickFrom)[0];
  usedNames.add(chosen);
  return chosen;
}

function setupRunArcs() {
  const selected = shuffle(arcDefinitions).slice(0, Math.min(4, arcDefinitions.length));
  const usedNames = new Set();

  state.activeArcIds = selected.map((arc) => arc.id);
  state.arcCast = Object.fromEntries(
    selected.map((arc) => [
      arc.id,
      {
        speaker: pickCharacterName(arc.poolKey, usedNames),
        sprite: arc.sprite,
      },
    ])
  );
}

function shouldOfferPerkDraft() {
  const hasUnlockedPerkAvailable = perks.some((perk) => isPerkUnlocked(perk.id) && !state.perkIds.includes(perk.id));

  return (
    hasUnlockedPerkAvailable &&
    state.week > 1 &&
    state.week < MAX_WEEKS &&
    (state.week - 1) % ACT_LENGTH === 0 &&
    !state.perkDraftWeeksSeen.includes(state.week)
  );
}

function openDialog(dialogElement) {
  if (typeof dialogElement.showModal === "function" && !dialogElement.open) {
    dialogElement.showModal();
    return;
  }

  dialogElement.setAttribute("open", "open");
}

function closeDialog(dialogElement) {
  if (typeof dialogElement.close === "function" && dialogElement.open) {
    dialogElement.close();
    return;
  }

  dialogElement.removeAttribute("open");
}

function openSetupDialog() {
  closeSettingsDialog();
  closePerkDialog();
  closeRunSummaryDialog();
  state.selectedOriginId = isOriginUnlocked(state.selectedOriginId) ? state.selectedOriginId : getFirstUnlockedOriginId(state.profile);
  state.originId = state.selectedOriginId;
  state.awaitingSetup = true;
  state.locked = true;
  render();
  openDialog(runSetupDialogElement);
}

function closeSetupDialog() {
  closeDialog(runSetupDialogElement);
}

function openPerkDialog() {
  closeSettingsDialog();
  state.locked = true;
  render();
  openDialog(perkDialogElement);
}

function closePerkDialog() {
  closeDialog(perkDialogElement);
}

function renderHistoryDialog() {
  const ui = getUi();
  historyListElement.innerHTML = "";

  const choices = state.history.filter((entry) => !entry.kind);

  if (choices.length === 0) {
    const empty = document.createElement("p");
    empty.className = "sidebar-note";
    empty.textContent = ui.historyEmpty;
    historyListElement.appendChild(empty);
    return;
  }

  choices.forEach((entry) => {
    const card = cardsById[entry.cardId];
    const copy = getCardCopy(card);
    const side = copy[entry.choiceSide];

    const article = document.createElement("article");
    article.className = "history-entry";

    const weekSpan = document.createElement("span");
    weekSpan.className = "history-entry__week";
    weekSpan.textContent = "W" + entry.week;

    const choiceStrong = document.createElement("strong");
    choiceStrong.className = "history-entry__choice";
    choiceStrong.textContent = side.label;

    const deltasSpan = document.createElement("span");
    deltasSpan.className = "history-entry__deltas";
    if (side.effects) {
      Object.entries(side.effects).forEach(([key, value]) => {
        const mc = getMetricCopy(key);
        const delta = document.createElement("span");
        delta.className = value >= 0 ? "history-delta--pos" : "history-delta--neg";
        delta.textContent = (value >= 0 ? "+" : "") + value + " " + mc.label;
        deltasSpan.appendChild(delta);
      });
    }

    const gainSpan = document.createElement("span");
    gainSpan.className = "history-entry__gain";
    gainSpan.textContent = "+" + entry.gain;

    article.appendChild(weekSpan);
    article.appendChild(choiceStrong);
    article.appendChild(deltasSpan);
    article.appendChild(gainSpan);
    historyListElement.appendChild(article);
  });
}

function openHistoryDialog() {
  if (runSetupDialogElement.open || perkDialogElement.open || runSummaryDialogElement.open) {
    return;
  }

  renderHistoryDialog();
  openDialog(historyDialogElement);
}

function closeHistoryDialog() {
  closeDialog(historyDialogElement);
}

function openSettingsDialog() {
  if (runSetupDialogElement.open || perkDialogElement.open || runSummaryDialogElement.open) {
    return;
  }

  openDialog(settingsDialogElement);
}

function closeSettingsDialog() {
  closeDialog(settingsDialogElement);
}

function unlockPerk(perkId) {
  const perk = getPerk(perkId);
  const perkCopy = getBuildCopy(perk);

  if (!perk || !perkCopy || state.perkIds.includes(perkId)) {
    return;
  }

  state.perkIds.push(perkId);
  state.pendingPerkIds = [];
  state.perkDraftWeeksSeen.push(state.week);

  if (perk.immediate) {
    applyEffects(perk.immediate, "perk");
  }

  if (perk.immediateScore) {
    state.score += perk.immediateScore;
    maybeUpdateBestScore();
  }

  state.history.push({
    kind: "perk",
    week: state.week,
    perkId,
    name: perkCopy.name,
    effect: perkCopy.effect,
  });

  pushSignal(
    state.locale === "pt" ? `VANTAGEM ATIVA // ${perkCopy.name}` : `PERK ACTIVE // ${perkCopy.name}`,
    "reward"
  );
}

function trackChoiceStyle(choice, side) {
  const effects = choice.effects;
  state.styleStats[side === "left" ? "leftChoices" : "rightChoices"] += 1;

  if ((effects.team || 0) > 0) {
    state.styleStats.teamCare += effects.team;
  }

  if ((effects.team || 0) < 0) {
    state.styleStats.teamDamage += Math.abs(effects.team);
  }

  if ((effects.delivery || 0) > 0) {
    state.styleStats.deliveryPush += effects.delivery;
  }

  if ((effects.delivery || 0) < 0) {
    state.styleStats.deliveryTax += Math.abs(effects.delivery);
  }

  if ((effects.trust || 0) > 0) {
    state.styleStats.trustWork += effects.trust;
  }

  if ((effects.trust || 0) < 0) {
    state.styleStats.trustDamage += Math.abs(effects.trust);
  }

  if ((effects.budget || 0) > 0) {
    state.styleStats.budgetGuard += effects.budget;
  }

  if ((effects.budget || 0) < 0) {
    state.styleStats.budgetSpend += Math.abs(effects.budget);
  }

  const negativeCount = Object.values(effects).filter((value) => value < 0).length;

  if (negativeCount >= 2) {
    state.styleStats.hardCalls += 1;
  }
}

const metricFlagMap = {
  team: ["roleDrift", "cultureCrack", "performanceDebt", "oncallDebt", "compTension", "fairnessDebt", "managerHeroics", "attritionRisk", "promoDebt", "layoffWhisper"],
  delivery: ["reliabilityDebt", "scopeThrash", "platformBet", "docsGap", "qaDebt", "staffingGap", "enterpriseTail", "modelSprawl", "roadmapSplit", "hiringFreeze"],
  trust: ["founderTweet", "outageNarrative", "quietPatch", "authorityCrack", "reorgWhispers", "blameCulture", "founderBypass", "policyDebt"],
  budget: ["tokenOverhang", "contractorRisk", "securityException", "demoTax", "hiringFreeze"],
};

function countActiveFlags(flagKeys) {
  return flagKeys.reduce((total, key) => total + (state.flags[key] ? 1 : 0), 0);
}

function getPressureEffects() {
  const pressure = {};
  const act = getAct();
  const weakestMetric = getWeakestMetricKey();

  if (act >= 2) {
    pressure.delivery = (pressure.delivery || 0) - 1;
  }

  if (act >= 3) {
    pressure[weakestMetric] = (pressure[weakestMetric] || 0) - 1;
  }

  if (act >= 4) {
    const rotatingMetric = state.week % 2 === 0 ? "budget" : "trust";
    pressure[rotatingMetric] = (pressure[rotatingMetric] || 0) - 1;
  }

  const teamFlagPressure = countActiveFlags([
    "roleDrift",
    "cultureCrack",
    "performanceDebt",
    "oncallDebt",
    "compTension",
    "fairnessDebt",
    "managerHeroics",
    "attritionRisk",
    "promoDebt",
    "layoffWhisper",
  ]);

  if (teamFlagPressure > 0) {
    pressure.team = (pressure.team || 0) - 1 - (act >= 4 && teamFlagPressure >= 3 ? 1 : 0);
  }

  const deliveryFlagPressure = countActiveFlags([
    "reliabilityDebt",
    "scopeThrash",
    "platformBet",
    "docsGap",
    "qaDebt",
    "staffingGap",
    "enterpriseTail",
    "modelSprawl",
    "roadmapSplit",
    "hiringFreeze",
  ]);

  if (deliveryFlagPressure > 0) {
    pressure.delivery = (pressure.delivery || 0) - 1 - (act >= 4 && deliveryFlagPressure >= 3 ? 1 : 0);
  }

  const trustFlagPressure = countActiveFlags([
    "founderTweet",
    "outageNarrative",
    "quietPatch",
    "authorityCrack",
    "reorgWhispers",
    "blameCulture",
    "founderBypass",
    "policyDebt",
  ]);

  if (trustFlagPressure > 0) {
    pressure.trust = (pressure.trust || 0) - 1 - (act >= 4 && trustFlagPressure >= 2 ? 1 : 0);
  }

  const budgetFlagPressure = countActiveFlags([
    "tokenOverhang",
    "contractorRisk",
    "securityException",
    "demoTax",
    "hiringFreeze",
  ]);

  if (budgetFlagPressure > 0) {
    pressure.budget = (pressure.budget || 0) - 1 - (act >= 4 && budgetFlagPressure >= 2 ? 1 : 0);
  }

  return Object.fromEntries(Object.entries(pressure).filter(([, value]) => value !== 0));
}

function getActBonus() {
  if (state.week % ACT_LENGTH !== 0) {
    return 0;
  }

  return 40 + getAct() * 30;
}

function computeGain() {
  const safeBars = Object.values(state.metrics).filter((value) => value >= 28 && value <= 72).length;

  if (safeBars >= 3) {
    state.streak += 1;
  } else {
    state.streak = 0;
  }

  return 90 + safeBars * 15 + state.streak * 20 + Math.floor(state.week / 3) * 5 + getActBonus();
}

function maybeUpdateBestScore() {
  if (state.score > state.bestScore) {
    state.bestScore = state.score;
    saveBestScore();
  }
}

function collapseReason() {
  if (state.metrics.team <= 0) {
    return "team";
  }

  if (state.metrics.delivery <= 0) {
    return "delivery";
  }

  if (state.metrics.trust <= 0) {
    return "trust";
  }

  if (state.metrics.budget <= 0) {
    return "budget";
  }

  return null;
}

function computeLegacyKey() {
  const values = Object.values(state.metrics);
  const lowestMetric = Math.min(...values);
  const highestMetric = Math.max(...values);
  const {
    teamCare,
    teamDamage,
    deliveryPush,
    trustWork,
    budgetGuard,
    hardCalls,
    budgetSpend,
  } = state.styleStats;

  if (state.runWon && lowestMetric >= 34 && highestMetric - lowestMetric <= 18) {
    return "steadyHand";
  }

  if (teamCare >= deliveryPush + 4 && teamCare >= trustWork && teamDamage <= teamCare + 2) {
    return "teamShield";
  }

  if (budgetGuard >= deliveryPush + 3 && budgetGuard >= teamCare) {
    return "runwaySurgeon";
  }

  if (trustWork >= deliveryPush + 2 && trustWork >= teamCare) {
    return "boardWhisperer";
  }

  if (deliveryPush >= Math.max(teamCare, trustWork, budgetGuard) && teamDamage >= teamCare) {
    return "shipMaxxer";
  }

  if (hardCalls >= 6 || budgetSpend + teamDamage >= 18) {
    return "chaosConductor";
  }

  return "tradeoffKeeper";
}

function pushRecentCard(cardId) {
  state.recentCards.push(cardId);

  if (state.recentCards.length > 4) {
    state.recentCards.shift();
  }
}

function flashGain() {
  scoreGainElement.classList.remove("gain-pill--flash");
  void scoreGainElement.offsetWidth;
  scoreGainElement.classList.add("gain-pill--flash");
}

function renderRunSummaryDialog() {
  if (!state.ended || !state.finalLegacy) {
    saveRunButtonElement.disabled = false;
    runSummaryUnlocksElement.hidden = true;
    return;
  }

  const ui = getUi();
  runSummaryTitleElement.textContent = state.runWon ? ui.summaryTitleWin : ui.summaryTitleLose;
  runSummaryCopyElement.textContent = state.runWon ? ui.summaryCopyWin : ui.summaryCopyLose;
  runSummaryScoreElement.textContent = formatCounter(state.score, 6);
  runSummaryWeekElement.textContent = formatCounter(state.week);
  runSummaryLegacyElement.textContent = getLegacyLabel(state.finalLegacy);
  saveRunButtonElement.textContent = state.runSaved ? ui.runSaved : ui.saveRun;
  saveRunButtonElement.disabled = state.runSaved;
  runSummaryUnlocksListElement.innerHTML = "";
  runSummaryUnlocksElement.hidden = state.pendingUnlocks.length === 0;

  state.pendingUnlocks.forEach((unlock) => {
    const display = getUnlockDisplay(unlock);

    if (!display) {
      return;
    }

    const item = document.createElement("article");
    item.className = "unlock-item unlock-item--new";
    item.innerHTML = `
      <span class="unlock-item__tag">${unlock.kind === "origin" ? ui.origin : ui.perkDraft}</span>
      <strong class="unlock-item__name">${display.name}</strong>
      <span class="unlock-item__detail">${display.detail}</span>
    `;
    runSummaryUnlocksListElement.append(item);
  });
}

function generateShareCard() {
  const ctx = shareCanvasElement.getContext("2d");
  const W = 600;
  const H = 400;
  const mono = 'ui-monospace, SFMono-Regular, Menlo, monospace';
  const sans = 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  const accent = "#58c4ff";
  const barColors = { team: "#5fdd8b", delivery: "#58c4ff", trust: "#f6be59", budget: "#ff6f5e" };

  ctx.fillStyle = "#070b12";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = accent;
  ctx.font = `bold 18px ${mono}`;
  ctx.textAlign = "center";
  ctx.fillText("PEOPLE & PAGER", W / 2, 30);

  const ui = getUi();
  const outcome = state.runWon ? ui.summaryTitleWin : ui.summaryTitleLose;
  ctx.fillStyle = "#b1bfce";
  ctx.font = `14px ${sans}`;
  ctx.fillText(outcome, W / 2, 60);

  ctx.fillStyle = "#e7eef8";
  ctx.font = `bold 28px ${mono}`;
  ctx.textAlign = "left";
  ctx.fillText(formatCounter(state.score, 6), 40, 100);
  ctx.textAlign = "right";
  ctx.fillText(`${formatCounter(state.week)} / 32`, W - 40, 100);

  ctx.textAlign = "left";
  ctx.fillStyle = "#7c8da1";
  ctx.font = `12px ${sans}`;
  ctx.fillText(ui.summaryScore, 40, 115);
  ctx.textAlign = "right";
  ctx.fillText(ui.summaryWeeks, W - 40, 115);

  ctx.textAlign = "center";
  ctx.fillStyle = accent;
  ctx.font = `bold 14px ${sans}`;
  ctx.fillText(getLegacyLabel(state.finalLegacy), W / 2, 145);

  const origin = getOrigin();
  const originCopy = getBuildCopy(origin);
  if (originCopy) {
    ctx.fillStyle = "#7c8da1";
    ctx.font = `12px ${sans}`;
    ctx.fillText(originCopy.name, W / 2, 165);
  }

  const barX = 40;
  const barW = W - 80;
  const barH = 24;
  const gap = 10;
  let barY = 200;

  metricConfig.forEach((metric) => {
    const value = state.metrics[metric.key] ?? 0;
    const color = barColors[metric.key];
    const metricCopy = getMetricCopy(metric.key);

    ctx.fillStyle = "#1a2233";
    ctx.fillRect(barX, barY, barW, barH);

    ctx.fillStyle = color;
    ctx.fillRect(barX, barY, (barW * value) / 100, barH);

    ctx.fillStyle = "#e7eef8";
    ctx.font = `bold 12px ${sans}`;
    ctx.textAlign = "left";
    ctx.fillText(metricCopy.label, barX, barY - 4);

    ctx.textAlign = "right";
    ctx.font = `12px ${mono}`;
    ctx.fillText(String(value), barX + barW, barY - 4);

    barY += barH + gap;
  });

  ctx.fillStyle = "#7c8da1";
  ctx.font = `10px ${sans}`;
  ctx.textAlign = "center";
  ctx.fillText("Ship or Sink - shiporsink.com", W / 2, 380);
}

function renderShareCard() {
  generateShareCard();
  const dataUrl = shareCanvasElement.toDataURL("image/png");
  shareImageElement.src = dataUrl;
  shareImageElement.hidden = false;
  sharePreviewElement.hidden = false;
}

function copyShareCard() {
  const ui = getUi();

  shareCanvasElement.toBlob((blob) => {
    if (!blob) {
      return;
    }

    navigator.clipboard
      .write([new ClipboardItem({ "image/png": blob })])
      .then(() => {
        shareButtonElement.textContent = ui.shareCopied;
        setTimeout(() => {
          shareButtonElement.textContent = ui.share;
        }, 1500);
      })
      .catch(() => {
        const link = document.createElement("a");
        link.download = "people-and-pager-result.png";
        link.href = shareCanvasElement.toDataURL("image/png");
        link.click();
      });
  }, "image/png");
}

function openRunSummaryDialog() {
  if (!state.ended || !state.finalLegacy) {
    return;
  }

  renderRunSummaryDialog();
  renderShareCard();

  if (typeof runSummaryDialogElement.showModal === "function" && !runSummaryDialogElement.open) {
    runSummaryDialogElement.showModal();
    runNameInputElement.focus();
    runNameInputElement.select();
    return;
  }

  runSummaryDialogElement.setAttribute("open", "open");
  runNameInputElement.focus();
  runNameInputElement.select();
}

function closeRunSummaryDialog() {
  closeDialog(runSummaryDialogElement);
}

function markRareCardSeen(cardId) {
  if (!cardId || state.profile.seenRareCards.includes(cardId)) {
    return;
  }

  state.profile.seenRareCards.push(cardId);
  saveProfile();
}

function recordRunInProfile(reason) {
  state.profile.runsCompleted += 1;
  state.profile.totalScore += state.score;
  state.profile.highestWeek = Math.max(state.profile.highestWeek, state.week);
  state.profile.bestRunScore = Math.max(state.profile.bestRunScore, state.score);

  if (reason === "victory") {
    state.profile.wins += 1;
    state.profile.collapseCounts.victory += 1;
  } else if (state.profile.collapseCounts[reason] !== undefined) {
    state.profile.collapseCounts[reason] += 1;
  }

  if (state.finalLegacy && !state.profile.discoveredLegacies.includes(state.finalLegacy)) {
    state.profile.discoveredLegacies.push(state.finalLegacy);
  }

  state.pendingUnlocks = applyProfileUnlocks(state.profile);
  saveProfile();
}

function saveCompletedRun(name) {
  if (!state.ended || state.runSaved || !state.finalLegacy) {
    return;
  }

  const fallback = getUi().managerNameFallback;
  const normalizedName = (name || "").trim().slice(0, 24) || fallback;

  state.leaderboard = [
    {
      name: normalizedName,
      score: state.score,
      weeks: state.week,
      legacyKey: state.finalLegacy,
      originId: state.originId,
      reason: state.gameOverReason,
      won: state.runWon,
      country: getCountryFlag(),
      savedAt: Date.now(),
    },
    ...state.leaderboard,
  ]
    .sort(sortLeaderboardEntries)
    .slice(0, LEADERBOARD_LIMIT);

  state.runSaved = true;
  state.profile.savedRuns += 1;
  saveProfile();
  saveLeaderboard();
  render();
}

function finishRun(reason, won = false) {
  SoundEngine.play(won ? "victory" : "loss");
  state.ended = true;
  state.locked = false;
  state.gameOverReason = reason;
  state.runWon = won;
  state.runSaved = false;
  state.finalLegacy = computeLegacyKey();
  recordRunInProfile(reason);
  state.lastOutcome = getGameOverCopy(reason);
  state.lastGain = 0;
  state.currentCard = null;
  render();
  pushSignal(
    state.pendingUnlocks.length > 0
      ? state.locale === "pt"
        ? `CARREIRA // ${state.pendingUnlocks.length} novo(s) unlock(s)`
        : `CAREER // ${state.pendingUnlocks.length} new unlock(s)`
      : getGameOverCopy(reason),
    won || state.pendingUnlocks.length > 0 ? "reward" : "danger",
    2200
  );
  openRunSummaryDialog();
}


function resolveChoice(side) {
  const card = state.currentCard;
  const choice = card[side];
  const localizedCard = getCardCopy(card);
  const previousAct = getAct();

  trackChoiceStyle(choice, side);
  const choiceDelta = applyEffects(choice.effects, "choice");

  if (typeof choice.after === "function") {
    choice.after(state);
  }

  const pressureEffects = getPressureEffects();
  let pressureDelta = {};

  if (Object.keys(pressureEffects).length > 0) {
    pressureDelta = applyEffects(pressureEffects, "pressure");
  }

  const mergedDelta = mergeMetricDelta(choiceDelta, pressureDelta);
  triggerMetricPulse(mergedDelta);

  if (Object.values(mergedDelta).some((v) => v <= -6)) {
    cabinetElement.classList.add("shake");
    window.setTimeout(() => cabinetElement.classList.remove("shake"), 400);
  }

  const gain = computeGain();
  SoundEngine.play("tick");
  state.score += gain;
  state.lastGain = gain;
  state.lastOutcome = localizedCard[side].result;
  state.history.push({
    week: state.week,
    cardId: card.id,
    choiceSide: side,
    gain,
  });

  state.cycleSeen.add(card.id);
  pushRecentCard(card.id);
  if (card.rarity === "rare") {
    markRareCardSeen(card.id);
  }
  maybeUpdateBestScore();
  flashGain();

  const reason = collapseReason();

  if (reason) {
    finishRun(reason);
    return;
  }

  if (state.week >= MAX_WEEKS) {
    finishRun("victory", true);
    return;
  }

  state.week += 1;
  const nextAct = getAct();

  function continueAfterTransition() {
    if (shouldOfferPerkDraft()) {
      drawPerkOptions();
      state.currentCard = null;
      render();
      pushSignal(
        state.locale === "pt" ? `DRAFT DE VANTAGEM // escolha um upgrade para a build` : `PERK DRAFT // choose one build upgrade`,
        "reward"
      );
      openPerkDialog();
      return;
    }

    pickNextCard();
    render();
    state.locked = false;
  }

  if (nextAct > previousAct) {
    handleActTransition();
    state.history.push({
      kind: "act",
      week: state.week,
      body:
        state.locale === "pt"
          ? `${getUi().actLabel} ${nextAct}/${TOTAL_ACTS}: ${getActThemeCopy(nextAct)}. A run ficou mais cara.`
          : `${getUi().actLabel} ${nextAct}/${TOTAL_ACTS}: ${getActThemeCopy(nextAct)}. The run just got more expensive.`,
    });
    pushSignal(
      state.locale === "pt"
        ? `ATO ${nextAct}/${TOTAL_ACTS} // ${getActThemeCopy(nextAct)} // a pressão base subiu`
        : `ACT ${nextAct}/${TOTAL_ACTS} // ${getActThemeCopy(nextAct)} // baseline pressure increased`,
      nextAct >= 4 ? "danger" : "warning"
    );
  }

  continueAfterTransition();
}

function choose(side) {
  if (state.ended || state.locked || !state.currentCard) {
    return;
  }

  SoundEngine.init();
  SoundEngine.play("click");
  state.locked = true;
  const choiceElement = side === "left" ? leftChoiceElement : rightChoiceElement;

  choiceElement.classList.add("reply-card--selected");

  window.setTimeout(() => {
    choiceElement.classList.remove("reply-card--selected");
    resolveChoice(side);
  }, 140);
}

function handleKeydown(event) {
  if (runSummaryDialogElement.open || runSetupDialogElement.open || perkDialogElement.open || settingsDialogElement.open || historyDialogElement.open) {
    return;
  }

  if (state.ended && (event.key === "r" || event.key === "R")) {
    openSetupDialog();
    return;
  }

  if (state.ended || event.repeat) {
    return;
  }

  if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A" || event.key === "1") {
    choose("left");
  }

  if (event.key === "ArrowRight" || event.key === "d" || event.key === "D" || event.key === "2") {
    choose("right");
  }
}

function setLocale(locale) {
  if (locale !== "pt" && locale !== "en") {
    return;
  }

  if (state.locale === locale) {
    return;
  }

  state.locale = locale;
  saveLocale();
  render();
}

function toggleDetailsMode() {
  state.detailsMode = !state.detailsMode;
  saveDetailsMode();
  render();
}

function startTutorial() {
  state.tutorialStep = 1;
  state.tutorialActive = true;
  renderTutorialStep();
}

function renderTutorialStep() {
  const existing = document.querySelector(".tutorial-overlay");
  if (existing) existing.remove();

  if (state.tutorialStep === 0 || !state.tutorialActive) return;

  const steps = getUi().tutorialSteps;
  const step = steps[state.tutorialStep - 1];
  if (!step) return;

  const targetEl = document.querySelector(step.target);
  if (!targetEl) return;

  const rect = targetEl.getBoundingClientRect();

  const overlay = document.createElement("div");
  overlay.className = "tutorial-overlay";

  const spotlight = document.createElement("div");
  spotlight.className = "tutorial-spotlight";
  spotlight.style.top = rect.top - 4 + "px";
  spotlight.style.left = rect.left - 4 + "px";
  spotlight.style.width = rect.width + 8 + "px";
  spotlight.style.height = rect.height + 8 + "px";

  const tooltip = document.createElement("div");
  tooltip.className = "tutorial-tooltip";
  const tooltipHeight = 120;
  const spaceBelow = window.innerHeight - rect.bottom;
  if (spaceBelow < tooltipHeight + 16) {
    tooltip.style.bottom = window.innerHeight - rect.top + 12 + "px";
  } else {
    tooltip.style.top = rect.bottom + 12 + "px";
  }
  tooltip.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - 328)) + "px";

  const text = document.createElement("p");
  text.className = "tutorial-tooltip__text";
  text.textContent = step.text;

  const actions = document.createElement("div");
  actions.className = "tutorial-tooltip__actions";

  const skipBtn = document.createElement("button");
  skipBtn.className = "tutorial-tooltip__skip";
  skipBtn.type = "button";
  skipBtn.textContent = getUi().tutorialSkip;
  skipBtn.addEventListener("click", () => endTutorial());

  const nextBtn = document.createElement("button");
  nextBtn.className = "tutorial-tooltip__next";
  nextBtn.type = "button";
  nextBtn.textContent = state.tutorialStep >= steps.length ? getUi().tutorialSkip : getUi().tutorialNext;
  nextBtn.addEventListener("click", () => {
    state.tutorialStep += 1;
    if (state.tutorialStep > steps.length) {
      endTutorial();
    } else {
      renderTutorialStep();
    }
  });

  actions.appendChild(skipBtn);
  actions.appendChild(nextBtn);
  tooltip.appendChild(text);
  tooltip.appendChild(actions);
  overlay.appendChild(spotlight);
  overlay.appendChild(tooltip);
  document.body.appendChild(overlay);
}

function endTutorial() {
  state.tutorialStep = 0;
  state.tutorialActive = false;
  const overlay = document.querySelector(".tutorial-overlay");
  if (overlay) overlay.remove();
}

function startGame(originId = state.selectedOriginId || state.originId || getFirstUnlockedOriginId(state.profile)) {
  initRng();
  closeSettingsDialog();
  closeSetupDialog();
  closePerkDialog();
  closeRunSummaryDialog();
  state.profile.runsStarted += 1;
  saveProfile();
  resetGame(originId);
  setupRunArcs();
  pickNextCard();
  render();

  if (state.profile.runsStarted === 1) {
    setTimeout(() => startTutorial(), 600);
  }
}

function selectOrigin(originId) {
  if (!originsById[originId] || !isOriginUnlocked(originId)) {
    return;
  }

  state.selectedOriginId = originId;
  state.originId = originId;
  render();
}

runSummaryFormElement.addEventListener("submit", (event) => {
  event.preventDefault();
  const action = event.submitter?.value;

  if (action === "save") {
    saveCompletedRun(runNameInputElement.value);
  }

  if (action === "save" || action === "close") {
    closeRunSummaryDialog();
  }
});

runSetupFormElement.addEventListener("submit", (event) => {
  event.preventDefault();

  if (state.selectedOriginId) {
    startGame(state.selectedOriginId);
  }
});

originOptionsElement.addEventListener("click", (event) => {
  const button = event.target.closest("[data-origin-id]");

  if (!button) {
    return;
  }

  selectOrigin(button.dataset.originId);
});

perkFormElement.addEventListener("submit", (event) => {
  event.preventDefault();
  const perkId = event.submitter?.value;

  if (!perkId) {
    return;
  }

  unlockPerk(perkId);
  closePerkDialog();
  pickNextCard();
  render();
  state.locked = false;
});

settingsFormElement.addEventListener("submit", (event) => {
  event.preventDefault();
  closeSettingsDialog();
});

runSetupDialogElement.addEventListener("cancel", (event) => event.preventDefault());
perkDialogElement.addEventListener("cancel", (event) => event.preventDefault());
settingsDialogElement.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeSettingsDialog();
});
historyToggleElement.addEventListener("click", () => { SoundEngine.init(); openHistoryDialog(); });
rankingToggleElement.addEventListener("click", () => { SoundEngine.init(); openRankingDialog(); });
rankingFilterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    activeRankingFilter = btn.dataset.filter;
    renderRankingDialog();
    SoundEngine.play("click");
  });
});
rankingDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  rankingDialog.close();
});
document.querySelector("#ranking-form").addEventListener("submit", (event) => {
  event.preventDefault();
  rankingDialog.close();
});
historyFormElement.addEventListener("submit", (event) => {
  event.preventDefault();
  closeHistoryDialog();
});
historyDialogElement.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeHistoryDialog();
});

leftChoiceElement.addEventListener("click", () => choose("left"));
rightChoiceElement.addEventListener("click", () => choose("right"));
settingsButtonElement.addEventListener("click", () => { SoundEngine.init(); openSettingsDialog(); });
detailsToggleElement.addEventListener("click", () => { SoundEngine.init(); toggleDetailsMode(); });
localePtButton.addEventListener("click", () => setLocale("pt"));
localeEnButton.addEventListener("click", () => setLocale("en"));
soundOnButton.addEventListener("click", () => {
  state.soundMuted = false;
  SoundEngine.setMuted(false);
  updateStaticCopy();
});
soundOffButton.addEventListener("click", () => {
  state.soundMuted = true;
  SoundEngine.setMuted(true);
  updateStaticCopy();
});
dailySeedOnButton.addEventListener("click", () => {
  state.dailySeedMode = true;
  localStorage.setItem("people-pager-daily-seed", "true");
  initRng();
  updateStaticCopy();
});
dailySeedOffButton.addEventListener("click", () => {
  state.dailySeedMode = false;
  localStorage.setItem("people-pager-daily-seed", "false");
  initRng();
  updateStaticCopy();
});
statusChipElement.addEventListener("click", () => {
  if (state.ended && !state.runSaved) {
    openRunSummaryDialog();
  }
});
statusChipElement.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && state.ended && !state.runSaved) {
    event.preventDefault();
    openRunSummaryDialog();
  }
});
restartButton.addEventListener("click", () => { SoundEngine.init(); openSetupDialog(); });
shareButtonElement.addEventListener("click", () => copyShareCard());
window.addEventListener("keydown", handleKeydown);

resetGame(getFirstUnlockedOriginId(state.profile));
render();
openSetupDialog();
