window.PEOPLE_PAGER_CARD_METADATA = {
  "codex-panic": { actMin: 1, difficulty: 2 },
  "claude-code-deal": { actMin: 1, difficulty: 2 },
  "token-bill": { actMin: 1, difficulty: 2 },
  "eval-gate": { actMin: 1, difficulty: 2 },
  "vibe-core": { actMin: 1, difficulty: 2 },
  "support-agent": { actMin: 1, difficulty: 2 },
  "founder-tweet": { actMin: 1, difficulty: 2 },
  "prompt-caching": { actMin: 1, difficulty: 2 },
  "multi-model": { actMin: 2, difficulty: 3 },
  "zero-retention": { actMin: 2, difficulty: 3 },
  "benchmark-push": { actMin: 2, difficulty: 3 },
  "provider-outage": { actMin: 2, difficulty: 3 },
  "calibration-week": { actMin: 2, difficulty: 3 },
  "moat-review": { actMin: 3, difficulty: 4, priority: 4 },
  "quality-fallout": { actMin: 3, difficulty: 4, priority: 5 },
  "security-fallout": { actMin: 3, difficulty: 4, priority: 5 },
  "cost-review": { actMin: 3, difficulty: 4, priority: 4 },
  "board-pressure": { actMin: 3, difficulty: 4, priority: 4 },
  "delivery-review": { actMin: 4, difficulty: 5, priority: 5 },
  "role-drift": { actMin: 4, difficulty: 5, priority: 5 },
  "migration-discount": { actMin: 4, difficulty: 5, priority: 4 },
};

window.PEOPLE_PAGER_EXTRA_SCENARIOS = [
  {
    id: "skip-level-friction",
    sprite: "people",
    speaker: "Designer",
    role: "skip-level",
    actMin: 1,
    difficulty: 1,
    title: "Uma designer disse no skip-level que um sênior corta os juniors em toda review",
    body: "Ela não pediu escalação formal. Só perguntou se falar alto ainda vale a pena neste time.",
    left: {
      label: "Intervir cedo",
      summary: "Você trata como sinal de cultura agora, mesmo sem processo formal aberto.",
      effects: { team: 3, trust: 1, delivery: -1 },
      result: "O time leu proteção. O sênior leu que a régua social ficou menos opcional.",
      after(state) {
        state.flags.cultureCrack = false;
      },
    },
    right: {
      label: "Ajustar em privado",
      summary: "Você evita barulho público e tenta corrigir a dinâmica por fora.",
      effects: { delivery: 1, trust: -1, team: -2 },
      result: "A semana ficou limpa. A designer não saiu da conversa mais segura.",
      after(state) {
        state.flags.cultureCrack = true;
      },
    },
    en: {
      title: "A designer said in skip-levels that a senior keeps cutting juniors off in reviews",
      body: "She did not ask for a formal escalation. She only asked whether speaking up is still worth it on this team.",
      left: {
        label: "Step in early",
        summary: "You treat it as a culture signal now, even without a formal process.",
        result: "The team read protection. The senior read that the social bar is less optional now.",
      },
      right: {
        label: "Handle it privately",
        summary: "You avoid a public scene and try to correct the dynamic offstage.",
        result: "The week stayed clean. The designer did not leave the conversation feeling safer.",
      },
    },
  },
  {
    id: "high-performer-poach",
    sprite: "eng",
    speaker: "Director",
    role: "staffing ask",
    actMin: 1,
    difficulty: 2,
    title: "Outra área quer pegar sua melhor engenheira para destravar um projeto do founder",
    body: "Se você segurar, parece territorial. Se liberar, seu quarter fica bem mais fino do que o plano admitia.",
    left: {
      label: "Brigar para manter",
      summary: "Você protege a squad atual e assume o desgaste político disso.",
      effects: { team: 2, delivery: 2, trust: -2 },
      result: "Seu time sentiu cobertura. A liderança passou a te ler como menos flexível.",
    },
    right: {
      label: "Liberar com plano",
      summary: "Você patrocina a mudança e reorganiza ownership depois.",
      effects: { trust: 3, budget: 1, delivery: -2, team: -2 },
      result: "Você ganhou capital político. O vazio técnico ficou bem concreto na squad.",
      after(state) {
        state.flags.staffingGap = true;
      },
    },
    en: {
      title: "Another org wants to borrow your strongest engineer to unblock a founder project",
      body: "If you keep her, you look territorial. If you let her go, your quarter gets much thinner than the plan admitted.",
      left: {
        label: "Fight to keep her",
        summary: "You protect the current squad and accept the political friction.",
        result: "Your team felt covered. Leadership started reading you as less flexible.",
      },
      right: {
        label: "Release with a plan",
        summary: "You sponsor the move and reorganize ownership afterward.",
        result: "You gained political capital. The technical gap became very concrete inside the squad.",
      },
    },
  },
  {
    id: "hiring-freeze",
    sprite: "finance",
    speaker: "CFO",
    role: "headcount freeze",
    actMin: 1,
    difficulty: 2,
    title: "Entrou freeze de contratação e o backfill do time evaporou",
    body: "Ninguém mudou o roadmap junto com isso. Só mudaram a suposição escondida que fazia o plano fechar.",
    left: {
      label: "Reduzir escopo",
      summary: "Você corta entrega antes de queimar quem ficou.",
      effects: { delivery: 2, trust: 2, budget: 1, team: 1 },
      result: "O quarter ficou menor e mais defensável. Nem todo mundo gostou da visibilidade perdida.",
    },
    right: {
      label: "Manter o plano",
      summary: "Você segura a ambição e tenta fazer menos gente render igual.",
      effects: { delivery: 3, trust: -2, team: -3 },
      result: "No papel, o plano sobreviveu. Nas pessoas, ele ficou mais caro do que parecia.",
      after(state) {
        state.flags.hiringFreeze = true;
      },
    },
    en: {
      title: "A hiring freeze landed and your backfill vanished",
      body: "Nobody changed the roadmap with it. They only changed the hidden assumption that made the plan close.",
      left: {
        label: "Cut the front",
        summary: "You renegotiate scope before renegotiating squad sanity.",
        result: "The quarter got smaller and more defensible. Not everyone liked the lost visibility.",
      },
      right: {
        label: "Stretch the team",
        summary: "You keep the current ambition and try to absorb the missing headcount with discipline.",
        result: "On paper, the plan survived. In people, it got more expensive than it looked.",
      },
    },
  },
  {
    id: "flaky-ci",
    sprite: "sre",
    speaker: "Tech lead",
    role: "build health",
    actMin: 1,
    difficulty: 1,
    title: "A CI começou a falhar do nada e todo merge agora parece um mini incidente",
    body: "Nada está totalmente parado. Tudo está um pouco mais lento, mais duvidoso e mais irritante.",
    left: {
      label: "Parar para consertar",
      summary: "Você compra atraso agora para recuperar confiança no fluxo.",
      effects: { team: 2, trust: 1, delivery: -2 },
      result: "A equipe respirou. O calendário ficou imediatamente pior.",
      after(state) {
        state.flags.reliabilityDebt = false;
      },
    },
    right: {
      label: "Contornar por enquanto",
      summary: "Você aceita ruído operacional e tenta proteger o roadmap visível.",
      effects: { delivery: 2, team: -1, trust: -1 },
      result: "A sprint andou. A sensação de qualidade do processo ficou mais fraca.",
      after(state) {
        state.flags.reliabilityDebt = true;
      },
    },
    en: {
      title: "CI started failing randomly and every merge now feels like a mini incident",
      body: "Nothing is fully blocked. Everything is slightly slower, shakier, and more irritating.",
      left: {
        label: "Stop and fix it",
        summary: "You buy delay now to recover confidence in the flow.",
        result: "The team exhaled. The calendar got worse immediately.",
      },
      right: {
        label: "Work around it",
        summary: "You accept operational noise and try to protect the visible roadmap.",
        result: "The sprint moved. The sense of process quality got weaker.",
      },
    },
  },
  {
    id: "underperformer-window",
    sprite: "people",
    speaker: "People partner",
    role: "performance signal",
    actMin: 1,
    difficulty: 2,
    title: "Você tem um caso claro de baixa performance, mas o timing coincide com entrega crítica",
    body: "Mexer agora toma energia gerencial. Não mexer vira mensagem para o resto da squad.",
    left: {
      label: "Abrir conversa difícil",
      summary: "Você encara o problema no momento em que ele ainda é reversível.",
      effects: { team: 2, trust: 2, delivery: -1 },
      result: "A discussão doeu, mas deixou a régua mais clara para todo mundo.",
      after(state) {
        state.flags.performanceDebt = false;
      },
    },
    right: {
      label: "Esconder no backlog",
      summary: "Você evita o atrito imediato e empurra o assunto para depois da entrega.",
      effects: { delivery: 1, team: -3, trust: -2 },
      result: "Você comprou algumas semanas de paz. O resto do time percebeu o que aconteceu.",
      after(state) {
        state.flags.performanceDebt = true;
      },
    },
    en: {
      title: "You have a clear underperformance case, but the timing overlaps a critical delivery",
      body: "Acting now costs managerial energy. Not acting sends a message to the rest of the squad.",
      left: {
        label: "Open the hard talk",
        summary: "You face the problem while it is still reversible.",
        result: "The discussion hurt, but it made the bar clearer for everyone else.",
      },
      right: {
        label: "Hide it in the backlog",
        summary: "You avoid the immediate friction and push it past the delivery.",
        result: "You bought a few weeks of peace. The rest of the team noticed what happened.",
      },
    },
  },
  {
    id: "oncall-resentment",
    sprite: "sre",
    speaker: "Sênior engineer",
    role: "on-call drift",
    actMin: 1,
    difficulty: 2,
    title: "As mesmas duas pessoas estão carregando quase toda a dor do on-call",
    body: "Elas ainda não pediram para sair da escala. Só pararam de fingir que isso é sustentável.",
    left: {
      label: "Espalhar a carga",
      summary: "Você treina mais gente e aceita queda temporária de vazão.",
      effects: { team: 3, trust: 1, delivery: -2 },
      result: "A justiça melhorou antes da eficiência. Ainda assim, o time notou.",
      after(state) {
        state.flags.oncallDebt = false;
      },
    },
    right: {
      label: "Compensar quem segura",
      summary: "Você premia quem aguenta a barra e preserva a especialização.",
      effects: { delivery: 2, budget: -2, team: -3 },
      result: "A operação se manteve de pé. A sensação de time único ficou menor.",
      after(state) {
        state.flags.oncallDebt = true;
      },
    },
    en: {
      title: "The same two people are carrying almost all of the on-call pain",
      body: "They have not asked off the rotation yet. They just stopped pretending it is sustainable.",
      left: {
        label: "Spread the load",
        summary: "You train more people and accept a temporary drop in flow.",
        result: "Fairness improved before efficiency did. The team noticed anyway.",
      },
      right: {
        label: "Pay the heroes",
        summary: "You reward the people holding the line and preserve specialization.",
        result: "Operations stayed upright. The feeling of being one team got smaller.",
      },
    },
  },
  {
    id: "pm-priority-thrash",
    sprite: "pm",
    speaker: "PM",
    role: "weekly planning",
    actMin: 1,
    difficulty: 2,
    title: "Produto mudou prioridade três vezes na mesma semana e chama isso de adaptação",
    body: "Cada mudança isolada faz sentido. O conjunto delas já começou a parecer falta de contrato.",
    left: {
      label: "Forcar acordo semanal",
      summary: "Você sobe a conversa e exige uma janela mínima sem thrash.",
      effects: { trust: 3, delivery: 1, team: -1 },
      result: "A operação ganhou contorno. A relação com produto ficou menos macia.",
      after(state) {
        state.flags.scopeThrash = false;
      },
    },
    right: {
      label: "Seguir no improviso",
      summary: "Você tenta ganhar velocidade aceitando a volatilidade como custo normal.",
      effects: { delivery: 2, team: -2, trust: -2 },
      result: "No curto prazo pareceu agilidade. No time, pareceu falta de direção.",
      after(state) {
        state.flags.scopeThrash = true;
      },
    },
    en: {
      title: "Product changed priority three times in the same week and called it adaptation",
      body: "Each change makes sense on its own. Together they already look like the absence of a contract.",
      left: {
        label: "Force a weekly pact",
        summary: "You escalate and demand a minimum window without thrash.",
        result: "Operations gained shape. The relationship with product got less soft.",
      },
      right: {
        label: "Ride the improvisation",
        summary: "You try to gain speed by accepting volatility as normal cost.",
        result: "In the short term it looked agile. To the team, it looked directionless.",
      },
    },
  },
  {
    id: "principal-spike",
    sprite: "eng",
    speaker: "Principal engineer",
    role: "architecture bet",
    actMin: 1,
    difficulty: 2,
    title: "Seu principal quer duas semanas para um spike de arquitetura antes de comprometer o desenho",
    body: "Se ele estiver certo, evita retrabalho grande. Se estiver errado, você queimou tempo caro em tese elegante.",
    left: {
      label: "Comprar o spike",
      summary: "Você protege tempo de pensamento e aceita atraso visível.",
      effects: { trust: 2, team: 1, delivery: -2 },
      result: "A discussão técnica ficou mais honesta. O quarter ficou menos previsivel.",
      after(state) {
        state.flags.platformBet = true;
      },
    },
    right: {
      label: "Ir incremental",
      summary: "Você prefere aprender com implementacao pequena em produção.",
      effects: { delivery: 2, trust: -1, team: -1 },
      result: "A agenda andou. A arquitetura entrou em modo promessa futura.",
    },
    en: {
      title: "Your principal wants two weeks for an architecture spike before committing to the design",
      body: "If they are right, you avoid major rework. If not, you burned expensive time on an elegant thesis.",
      left: {
        label: "Buy the spike",
        summary: "You protect thinking time and accept visible delay.",
        result: "The technical discussion got more honest. The quarter got less predictable.",
      },
      right: {
        label: "Go incremental",
        summary: "You prefer learning from a small implementation in production.",
        result: "The agenda moved. The architecture entered future-promise mode.",
      },
    },
  },
  {
    id: "demo-tax",
    sprite: "pm",
    speaker: "Sales",
    role: "demo load",
    actMin: 2,
    difficulty: 2,
    title: "Pre-venda descobriu que seus seniors fazem demos muito melhores do que qualquer script",
    body: "Agora toda oportunidade importante quer tempo da engenharia, não só do comercial.",
    left: {
      label: "Revezar as demos",
      summary: "Você distribui demos pela equipe e aceita algum risco de consistência.",
      effects: { team: 1, delivery: -1, trust: 2 },
      result: "A dependência de poucas pessoas diminuiu. A mensagem ficou menos polida.",
    },
    right: {
      label: "Proteger os builders",
      summary: "Você limita a presença da engenharia e deixa o comercial carregar mais narrativa.",
      effects: { team: 2, delivery: 1, trust: -2 },
      result: "A squad preservou foco. O funil ficou menos convencente nas deals grandes.",
      after(state) {
        state.flags.demoTax = true;
      },
    },
    en: {
      title: "Pre-sales discovered your seniors give much better demos than any script",
      body: "Now every serious opportunity wants engineering time, not just sales time.",
      left: {
        label: "Rotate the spotlight",
        summary: "You spread demos across the team and accept some consistency risk.",
        result: "Dependency on a few people dropped. The message got less polished.",
      },
      right: {
        label: "Protect the builders",
        summary: "You limit engineering presence and let sales carry more of the narrative.",
        result: "The squad kept focus. The funnel got less convincing on big deals.",
      },
    },
  },
  {
    id: "salary-freeze",
    sprite: "finance",
    speaker: "People partner",
    role: "comp review",
    actMin: 2,
    difficulty: 3,
    title: "Merit budget encolheu e agora só dá para reconhecer uma parte do que foi prometido",
    body: "Não existe solução justa. Só diferentes formas de distribuir ressentimento.",
    left: {
      label: "Concentrar em poucos",
      summary: "Você protege os casos mais fortes e aceita deixar o resto esperando.",
      effects: { trust: 1, budget: 2, team: -3 },
      result: "Algumas pessoas se sentiram reconhecidas. Outras entenderam exatamente o sinal.",
      after(state) {
        state.flags.compTension = true;
      },
    },
    right: {
      label: "Espalhar fino",
      summary: "Você tenta preservar a coesao mesmo sem mover muito a realidade.",
      effects: { team: 1, trust: -2, budget: -1 },
      result: "Ninguém ficou devastado. Ninguém saiu realmente convencido.",
    },
    en: {
      title: "Merit budget shrank and now you can only recognize a slice of what was promised",
      body: "There is no fair answer. Only different ways to distribute resentment.",
      left: {
        label: "Concentrate on a few",
        summary: "You protect the strongest cases and accept leaving the rest waiting.",
        result: "Some people felt recognized. Others understood the signal very clearly.",
      },
      right: {
        label: "Spread it thin",
        summary: "You try to preserve cohesion even without moving reality very much.",
        result: "Nobody felt crushed. Nobody left truly convinced either.",
      },
    },
  },
  {
    id: "authority-crack",
    sprite: "eng",
    speaker: "Staff engineer",
    role: "planning room",
    actMin: 2,
    difficulty: 3,
    title: "Um staff discordou das estimativas do time no meio do planning e a sala travou",
    body: "Ele pode estar certo. O problema é que agora a dúvida técnica virou problema de autoridade.",
    left: {
      label: "Alinhar depois",
      summary: "Você preserva a sala e trata a divergência em privado com calma.",
      effects: { trust: 2, team: 1, delivery: -1 },
      result: "O planning terminou sem explodir. A questão de fundo não sumiu.",
      after(state) {
        state.flags.authorityCrack = false;
      },
    },
    right: {
      label: "Resolver na hora",
      summary: "Você enfrenta a discordancia publicamente para não perder comando.",
      effects: { delivery: 1, trust: -3, team: -2 },
      result: "A sala viu definicao. Também viu fratura.",
      after(state) {
        state.flags.authorityCrack = true;
      },
    },
    en: {
      title: "A staff engineer challenged the team estimates mid-planning and the room froze",
      body: "They may be right. The problem is the technical doubt just became an authority problem.",
      left: {
        label: "Align afterward",
        summary: "You preserve the room and handle the disagreement privately with care.",
        result: "Planning finished without exploding. The underlying issue did not disappear.",
      },
      right: {
        label: "Settle it live",
        summary: "You confront the disagreement publicly so you do not lose command.",
        result: "The room saw decisiveness. It also saw a fracture.",
      },
    },
  },
  {
    id: "reorg-rumor",
    sprite: "people",
    speaker: "Recruiter",
    role: "hallway signal",
    actMin: 2,
    difficulty: 2,
    title: "Chegou rumor de reorganizacao antes de chegar comunicação oficial",
    body: "Seu time não quer detalhes. Quer calibrar se ainda dá para confiar no que você não sabe.",
    left: {
      label: "Contar o que sabe",
      summary: "Você admite limite de informação, mas divide contexto real.",
      effects: { team: 2, trust: 1, delivery: -1 },
      result: "A transparencia acalmou parte do ruido. Também abriu mais perguntas do que respostas.",
      after(state) {
        state.flags.reorgWhispers = false;
      },
    },
    right: {
      label: "Esperar o anúncio",
      summary: "Você evita especulação e segura a mensagem até ter script oficial.",
      effects: { delivery: 1, team: -3, trust: -2 },
      result: "Nada vazou da sua parte. A ansiedade vazou do mesmo jeito.",
      after(state) {
        state.flags.reorgWhispers = true;
      },
    },
    en: {
      title: "A reorg rumor arrived before any official communication",
      body: "Your team does not want details. It wants to calibrate whether they can still trust you around what you do not know.",
      left: {
        label: "Share what you know",
        summary: "You admit the limits of your information but give the real context you have.",
        result: "Transparency calmed some of the noise. It also opened more questions than answers.",
      },
      right: {
        label: "Wait for the announcement",
        summary: "You avoid speculation and hold the message until the official script arrives.",
        result: "Nothing leaked from your side. The anxiety leaked anyway.",
      },
    },
  },
  {
    id: "single-point-failure",
    sprite: "eng",
    speaker: "Sênior engineer",
    role: "ownership gap",
    actMin: 2,
    difficulty: 2,
    title: "Só uma pessoa entende a área que mais trava o quarter",
    body: "Todo mundo sabe o risco. A discussão agora é se vale pagar o custo antes do desastre ou depois.",
    left: {
      label: "Parar para parear",
      summary: "Você cria redundância agora e paga a conta no calendário.",
      effects: { team: 1, trust: 1, delivery: -2 },
      result: "A dependência diminuiu um pouco. O quarter perdeu velocidade imediatamente.",
      after(state) {
        state.flags.docsGap = false;
      },
    },
    right: {
      label: "Seguir com o especialista",
      summary: "Você deixa a pessoa mais rapida continuar carregando o trecho crítico.",
      effects: { delivery: 2, team: -2, trust: -1 },
      result: "A execução ficou mais eficiente. O risco ficou ainda mais concentrado.",
      after(state) {
        state.flags.docsGap = true;
      },
    },
    en: {
      title: "Only one person understands the área blocking the quarter the most",
      body: "Everyone knows the risk. The discussion is whether to pay the cost before the disaster or after it.",
      left: {
        label: "Pause to pair",
        summary: "You create redundancy now and pay for it in the calendar.",
        result: "Dependency shrank a bit. The quarter lost speed immediately.",
      },
      right: {
        label: "Keep the expert on it",
        summary: "You let the fastest person keep carrying the critical path.",
        result: "Execution got more efficient. Risk got even more concentrated.",
      },
    },
  },
  {
    id: "qa-gap",
    sprite: "support",
    speaker: "Support lead",
    role: "defect flow",
    actMin: 2,
    difficulty: 3,
    title: "Os bugs pequenos estão virando fila de suporte porque ninguém é dono da qualidade na última milha",
    body: "Não existe incidente único para justificar mudança. Existe erosão constante.",
    left: {
      label: "Criar dono interno",
      summary: "Você tira tempo de feature para montar disciplina de teste e release.",
      effects: { team: 1, trust: 1, delivery: -2 },
      result: "A base ficou menos improvisada. O roadmap ficou mais apertado.",
      after(state) {
        state.flags.qaDebt = false;
      },
    },
    right: {
      label: "Absorver no suporte",
      summary: "Você trata a fricção como custo operacional e não como mudança estrutural.",
      effects: { delivery: 1, budget: 1, trust: -2, team: -2 },
      result: "Nada grande parou. O produto ficou lentamente mais cansativo de defender.",
      after(state) {
        state.flags.qaDebt = true;
      },
    },
    en: {
      title: "Small bugs are turning into support queues because nobody owns quality in the last mile",
      body: "There is no single incident dramatic enough to justify change. There is constant erosion.",
      left: {
        label: "Create an internal owner",
        summary: "You take time from features to build release and test discipline.",
        result: "The base got less improvised. The roadmap got tighter.",
      },
      right: {
        label: "Absorb it in support",
        summary: "You treat the friction as operating cost instead of structural change.",
        result: "Nothing big stopped. The product got slowly more exhausting to defend.",
      },
    },
  },
  {
    id: "remote-policy",
    sprite: "exec",
    speaker: "COO",
    role: "policy push",
    actMin: 3,
    difficulty: 3,
    when: (state) => state.week >= 16,
    title: "A liderança quer mais dias de escritório porque acha que a colaboração piorou",
    body: "Pode até melhorar alinhamento. Também pode ser só um jeito caro de sinalizar controle.",
    left: {
      label: "Aceitar a regra",
      summary: "Você aceita a mudança e tenta limitar o dano prático na squad.",
      effects: { trust: 2, delivery: 1, team: -4 },
      result: "A diretoria sentiu alinhamento. O time sentiu que perdeu autonomia.",
      after(state) {
        state.flags.policyDebt = true;
      },
    },
    right: {
      label: "Defender flexibilidade",
      summary: "Você protege o contrato social do time e assume o atrito com cima.",
      effects: { team: 3, trust: -3, delivery: -1 },
      result: "A squad leu convicção. A liderança leu resistencia.",
      after(state) {
        state.flags.policyDebt = false;
      },
    },
    en: {
      title: "Leadership wants more office days because it thinks collaboration got worse",
      body: "It may improve alignment. It may also be an expensive way to signal control.",
      left: {
        label: "Buy the policy",
        summary: "You accept the change and try to limit the practical damage to the squad.",
        result: "Leadership felt alignment. The team felt autonomy slipping away.",
      },
      right: {
        label: "Defend flexibility",
        summary: "You protect the team's social contract and accept the friction upward.",
        result: "The squad read conviction. Leadership read resistance.",
      },
    },
  },
  {
    id: "performance-signal",
    sprite: "people",
    speaker: "People partner",
    role: "calibration conflict",
    actMin: 3,
    difficulty: 4,
    when: (state) => state.week >= 17,
    title: "Na calibração, o engenheiro mais vistoso não é o mais confiável do time",
    body: "Se você premiar o brilho, passa um sinal. Se premiar consistência, pode parecer que puniu ambição.",
    left: {
      label: "Reconhecer confiabilidade",
      summary: "Você ancora a avaliação em critério, manutenção e previsibilidade.",
      effects: { team: 3, trust: 1, delivery: -1 },
      result: "A discussão ficou menos glamour e mais justa. Nem todo mundo gosta desse espelho.",
      after(state) {
        state.flags.fairnessDebt = false;
      },
    },
    right: {
      label: "Premiar impacto visível",
      summary: "Você valoriza quem mexeu mais a percepcao externa do quarter.",
      effects: { delivery: 2, trust: 1, team: -4 },
      result: "A narrativa ficou coerente com o que a diretoria viu. O time leu outra licao.",
      after(state) {
        state.flags.fairnessDebt = true;
      },
    },
    en: {
      title: "In calibration, the most visible engineer is not the most reliable one on the team",
      body: "If you reward flash, you send one signal. If you reward consistency, it may look like you punished ambition.",
      left: {
        label: "Recognize reliability",
        summary: "You anchor the evaluation in judgment, maintenance, and predictability.",
        result: "The discussion got less glamorous and more fair. Not everyone likes that mirror.",
      },
      right: {
        label: "Reward visible impact",
        summary: "You value the person who moved external perception the most this quarter.",
        result: "The story stayed coherent with what leadership saw. The team learned a different lesson.",
      },
    },
  },
  {
    id: "blame-postmortem",
    sprite: "sre",
    speaker: "CTO",
    role: "postmortem review",
    actMin: 3,
    difficulty: 4,
    priority: 4,
    when: (state) =>
      state.week >= 18 &&
      (state.flags.reliabilityDebt ||
        state.flags.qaDebt ||
        state.flags.securityDebt ||
        state.flags.outageNarrative ||
        state.flags.quietPatch),
    title: "No postmortem, a diretoria quer saber quem tomou a decisão ruim",
    body: "A pergunta parece eficiência. O risco é transformar aprendizado em teatro defensivo.",
    left: {
      label: "Proteger o rito",
      summary: "Você segura o postmortem como ferramenta de sistema, não de culpa.",
      effects: { team: 3, trust: -1, delivery: -1 },
      result: "O time sentiu cobertura. Parte da liderança saiu achando o processo macio demais.",
      after(state) {
        state.flags.blameCulture = false;
      },
    },
    right: {
      label: "Nomear o dono",
      summary: "Você oferece um responsavel claro para conter ansiedade executiva.",
      effects: { trust: 2, delivery: 1, team: -5 },
      result: "A sala ganhou um nome. O time perdeu um pouco de franqueza.",
      after(state) {
        state.flags.blameCulture = true;
      },
    },
    en: {
      title: "In the postmortem, leadership wants to know who made the bad call",
      body: "The question sounds efficient. The risk is turning learning into defensive theater.",
      left: {
        label: "Protect the ritual",
        summary: "You defend the postmortem as a system tool, not a blame tool.",
        result: "The team felt covered. Part of leadership walked away thinking the process was too soft.",
      },
      right: {
        label: "Name the owner",
        summary: "You give leadership a clear person to contain executive anxiety.",
        result: "The room got a name. The team lost a bit of honesty.",
      },
    },
  },
  {
    id: "manager-hands-on",
    sprite: "eng",
    speaker: "Staff engineer",
    role: "delivery slip",
    actMin: 3,
    difficulty: 4,
    when: (state) => state.week >= 18 && (state.metrics.delivery <= 42 || state.flags.scopeThrash),
    title: "Você conseguiria destravar o trecho crítico se voltasse a programar por duas semanas",
    body: "A tentação é real porque provavelmente daria certo. A pergunta é o que quebra ao seu redor quando você some da gestão.",
    left: {
      label: "Continuar gerindo",
      summary: "Você protege coordenação, contexto e tomada de decisão, mesmo com atraso.",
      effects: { trust: 2, team: 2, delivery: -2 },
      result: "A maquina continuou tendo alguem no leme. O calendário não gostou.",
      after(state) {
        state.flags.managerHeroics = false;
      },
    },
    right: {
      label: "Entrar no codigo",
      summary: "Você usa sua antiga alavanca individual para salvar o curto prazo.",
      effects: { delivery: 3, trust: -1, team: -3 },
      result: "A frente andou. O resto da operação ficou mais dependente de você do que antes.",
      after(state) {
        state.flags.managerHeroics = true;
      },
    },
    en: {
      title: "You could unblock the critical path if you personally started coding again for two weeks",
      body: "The temptation is real because it would probably work. The question is what breaks around you when management goes dark.",
      left: {
        label: "Keep managing",
        summary: "You protect coordination, context, and decision quality even with delay.",
        result: "The machine kept someone at the helm. The calendar did not like it.",
      },
      right: {
        label: "Jump into the code",
        summary: "You use your old individual leverage to save the short term.",
        result: "The front moved. The rest of the operation became more dependent on you than before.",
      },
    },
  },
  {
    id: "contractor-cut",
    sprite: "finance",
    speaker: "Finance",
    role: "cost line",
    actMin: 3,
    difficulty: 3,
    when: (state) => state.week >= 19,
    title: "Finance quer cortar contractors antes do fim do quarter",
    body: "Eles custam caro. Também carregam partes do trabalho que ninguém interno tem largura de banda para absorver limpo.",
    left: {
      label: "Cortar agora",
      summary: "Você protege margem e aceita reorganizar a fila em cima da hora.",
      effects: { budget: 4, trust: 1, delivery: -2, team: -2 },
      result: "A planilha melhorou. O time herdou mais coisa do que capacidade.",
      after(state) {
        state.flags.contractorRisk = true;
      },
    },
    right: {
      label: "Segurar até o fim",
      summary: "Você preserva continuidade operacional e empurra a conversa financeira.",
      effects: { delivery: 2, team: 1, budget: -4, trust: -1 },
      result: "A execução agradeceu. O budget ficou mais vulneravel ao próximo review.",
      after(state) {
        state.flags.contractorRisk = false;
      },
    },
    en: {
      title: "Finance wants to cut contractors before the quarter ends",
      body: "They are expensive. They also carry parts of the work no internal person has clean bandwidth to absorb.",
      left: {
        label: "Cut them now",
        summary: "You protect margin and accept a last-minute queue reshuffle.",
        result: "The spreadsheet improved. The team inherited more than it could cleanly absorb.",
      },
      right: {
        label: "Keep them through the end",
        summary: "You preserve operational continuity and push the financial conversation.",
        result: "Execution was grateful. Budget became more vulnerable to the next review.",
      },
    },
  },
  {
    id: "scope-triangle",
    sprite: "exec",
    speaker: "VP Product",
    role: "quarter trade-off",
    actMin: 4,
    difficulty: 5,
    when: (state) => state.week >= 24,
    title: "Você não consegue fechar o quarter com enterprise, confiabilidade e equipe saudável ao mesmo tempo",
    body: "Agora a escolha não é entre bom e ruim. É entre qual perda você aceita assinar embaixo.",
    left: {
      label: "Largar enterprise",
      summary: "Você protege base e previsibilidade, mesmo queimando narrativa comercial.",
      effects: { delivery: 3, team: 1, trust: -3, budget: -1 },
      result: "A engenharia sentiu ar. O comercial leu recuo na hora mais barulhenta.",
      after(state) {
        state.flags.roadmapSplit = false;
      },
    },
    right: {
      label: "Empurrar mais uma vez",
      summary: "Você tenta segurar a promessa inteira e paga a conta em pessoas e limpeza.",
      effects: { trust: 2, budget: 2, delivery: -2, team: -4 },
      result: "A história externa sobreviveu mais um pouco. Por dentro, o desgaste ficou bem menos escondido.",
      after(state) {
        state.flags.roadmapSplit = true;
      },
    },
    en: {
      title: "You cannot finish the quarter with enterprise asks, reliability, and a healthy team at the same time",
      body: "This is no longer a choice between good and bad. It is a choice about which loss you are willing to sign.",
      left: {
        label: "Cut the enterprise front",
        summary: "You protect the base and predictability even if it burns sales narrative.",
        result: "Engineering felt air return. Sales read it as retreat at the loudest moment.",
      },
      right: {
        label: "Push one more time",
        summary: "You try to keep the whole promise alive and pay for it in people and cleanup.",
        result: "The external story survived a little longer. Internally, the wear got much less hidden.",
      },
    },
  },
  {
    id: "top-performer-offer",
    sprite: "eng",
    speaker: "Top engineer",
    role: "retention risk",
    actMin: 4,
    difficulty: 5,
    priority: 5,
    when: (state) =>
      state.week >= 25 &&
      (state.metrics.team <= 42 ||
        state.flags.oncallDebt ||
        state.flags.promoDebt ||
        state.flags.cultureCrack ||
        state.flags.managerHeroics),
    title: "Sua pessoa mais forte apareceu com oferta externa e disse que ainda quer ficar, se fizer sentido",
    body: "Segurar pode contaminar referencia interna. Deixar ir pode desmontar um quarto da capacidade real do time.",
    left: {
      label: "Contraproposta forte",
      summary: "Você sinaliza o quanto aquela pessoa importa, mesmo comprando precedente caro.",
      effects: { team: 2, delivery: 1, budget: -4, trust: -1 },
      result: "Você segurou a pessoa. O resto do time passou a reler o proprio valor de mercado.",
      after(state) {
        state.flags.attritionRisk = false;
      },
    },
    right: {
      label: "Deixar sair bem",
      summary: "Você protege coerência cultural e redistribui ownership na marra.",
      effects: { trust: 2, budget: 1, delivery: -2, team: -3 },
      result: "A saida ficou elegante. O vazio operacional não.",
      after(state) {
        state.flags.attritionRisk = true;
      },
    },
    en: {
      title: "Your strongest engineer showed up with an external offer and said they would still stay if it made sense",
      body: "Keeping them may distort internal reference points. Letting them go may remove a quarter of the team's real capacity.",
      left: {
        label: "Make a strong counter",
        summary: "You signal how much they matter, even if it buys an expensive precedent.",
        result: "You kept the person. The rest of the team started rereading their own market value.",
      },
      right: {
        label: "Let them leave well",
        summary: "You protect cultural coherence and redistribute ownership by force.",
        result: "The exit stayed elegant. The operational hole did not.",
      },
    },
  },
  {
    id: "founder-skip-level",
    sprite: "exec",
    speaker: "Founder",
    role: "direct message",
    actMin: 4,
    difficulty: 5,
    when: (state) => state.week >= 25 && (state.flags.founderTweet || state.metrics.trust <= 44),
    title: "O founder começou a mandar DM direto para ICs pedindo prioridade paralela",
    body: "Ignorar isso destrava curto prazo para ele. Normalizar isso desmonta seu sistema de alinhamento.",
    left: {
      label: "Redirecionar o fluxo",
      summary: "Você compra uma conversa desconfortavel para proteger a cadeia de decisão.",
      effects: { trust: 2, team: 1, delivery: -1 },
      result: "O founder não adorou. O time percebeu que ainda existe um sistema.",
      after(state) {
        state.flags.founderBypass = false;
      },
    },
    right: {
      label: "Deixar passar",
      summary: "Você preserva velocidade política agora e tenta remendar coerência depois.",
      effects: { delivery: 1, trust: -4, team: -2 },
      result: "Algumas coisas andaram mais rápido. O resto da organização ficou sem saber qual fila vale.",
      after(state) {
        state.flags.founderBypass = true;
      },
    },
    en: {
      title: "The founder started DMing ICs directly with side priorities",
      body: "Ignoring it unlocks short-term speed for them. Normalizing it breaks your alignment system.",
      left: {
        label: "Redirect the flow",
        summary: "You buy an uncomfortable conversation to protect the decision chain.",
        result: "The founder did not love it. The team noticed there is still a system.",
      },
      right: {
        label: "Let it slide",
        summary: "You preserve political speed now and try to patch coherence later.",
        result: "Some things moved faster. The rest of the org stopped knowing which queue mattered.",
      },
    },
  },
  {
    id: "promo-freeze",
    sprite: "people",
    speaker: "People partner",
    role: "promotion freeze",
    actMin: 4,
    difficulty: 5,
    when: (state) => state.week >= 26,
    title: "Tem uma promoção claramente merecida, mas o ciclo veio com freeze parcial",
    body: "Negar agora protege consistência financeira. Aprovar agora protege credibilidade gerencial.",
    left: {
      label: "Promover mesmo assim",
      summary: "Você defende o caso e aceita o atrito institucional.",
      effects: { team: 3, trust: -2, budget: -3 },
      result: "A pessoa sentiu justiça. O resto da empresa ganhou um precedente difícil.",
      after(state) {
        state.flags.promoDebt = false;
      },
    },
    right: {
      label: "Segurar com narrativa",
      summary: "Você promete revisitar logo e tenta manter a pessoa comprada na história.",
      effects: { trust: 1, budget: 1, team: -4 },
      result: "A planilha agradeceu. A relação com aquela pessoa ficou mais frágil do que a mensagem admitiu.",
      after(state) {
        state.flags.promoDebt = true;
      },
    },
    en: {
      title: "There is a clearly deserved promotion, but the cycle arrived with a partial freeze",
      body: "Denying it now protects financial consistency. Approving it now protects managerial credibility.",
      left: {
        label: "Promote anyway",
        summary: "You defend the case and accept the institutional friction.",
        result: "The person felt justice. The rest of the company got a difficult precedent.",
      },
      right: {
        label: "Delay with a story",
        summary: "You promise to revisit it soon and try to keep the person bought into the narrative.",
        result: "The spreadsheet was grateful. Your relationship with that person got more fragile than the message admitted.",
      },
    },
  },
  {
    id: "layoff-whisper",
    sprite: "finance",
    speaker: "CFO",
    role: "private warning",
    actMin: 4,
    difficulty: 5,
    priority: 5,
    when: (state) =>
      state.week >= 27 && (state.metrics.budget <= 34 || state.flags.tokenOverhang || state.flags.contractorRisk),
    title: "O CFO avisou em privado que, se a margem não reagir, alguem vai perder gente",
    body: "A escolha agora é onde concentrar o dano: no portfolio ou na capacidade humana.",
    left: {
      label: "Oferecer corte",
      summary: "Você protege a companhia antes que a companhia corte por cima.",
      effects: { budget: 5, trust: 1, team: -6 },
      result: "Você ganhou tempo financeiro. O time perdeu parte do pacto emocional com a liderança.",
      after(state) {
        state.flags.layoffWhisper = true;
      },
    },
    right: {
      label: "Defender o time",
      summary: "Você tenta salvar pessoas cortando ambição, não cabecas.",
      effects: { team: 2, delivery: -3, trust: -2, budget: -2 },
      result: "O time viu lealdade. A diretoria viu um plano mais fraco do que precisava ouvir.",
      after(state) {
        state.flags.layoffWhisper = false;
      },
    },
    en: {
      title: "The CFO warned you privately that if margin does not recover, someone will lose headcount",
      body: "The choice now is where to concentrate the damage: in the portfolio or in human capacity.",
      left: {
        label: "Volunteer a cut",
        summary: "You protect the company before the company cuts from above.",
        result: "You bought financial time. The team lost part of its emotional pact with leadership.",
      },
      right: {
        label: "Defend the team",
        summary: "You try to save people by cutting ambition, not heads.",
        result: "The team saw loyalty. Leadership saw a weaker plan than it wanted to hear.",
      },
    },
  },
];
