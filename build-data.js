window.PEOPLE_PAGER_ORIGINS = [
  {
    id: "people-coach",
    sprite: "people",
    startingMetrics: { team: 6 },
    perActShield: { metric: "team", amount: 2 },
    pt: {
      name: "People Coach",
      summary: "Começa com o time mais estável.",
      passive: "A primeira perda de Team em cada ato é reduzida em 2.",
    },
    en: {
      name: "People Coach",
      summary: "Starts with a steadier team.",
      passive: "The first Team loss each act is reduced by 2.",
    },
  },
  {
    id: "delivery-hawk",
    sprite: "eng",
    startingMetrics: { delivery: 6 },
    perActShield: { metric: "delivery", amount: 2 },
    pt: {
      name: "Delivery Hawk",
      summary: "Entra com mais fôlego operacional.",
      passive: "A primeira perda de Delivery em cada ato é reduzida em 2.",
    },
    en: {
      name: "Delivery Hawk",
      summary: "Starts with more delivery momentum.",
      passive: "The first Delivery loss each act is reduced by 2.",
    },
  },
  {
    id: "exec-diplomat",
    sprite: "exec",
    unlockKey: "career-exec-diplomat",
    startingMetrics: { trust: 6 },
    perActShield: { metric: "trust", amount: 2 },
    pt: {
      name: "Exec Diplomat",
      summary: "Lida melhor com alinhamento para cima.",
      passive: "A primeira perda de Trust em cada ato é reduzida em 2.",
    },
    en: {
      name: "Exec Diplomat",
      summary: "Handles executive alignment better.",
      passive: "The first Trust loss each act is reduced by 2.",
    },
  },
  {
    id: "runway-guardian",
    sprite: "finance",
    unlockKey: "career-runway-guardian",
    startingMetrics: { budget: 6 },
    perActShield: { metric: "budget", amount: 2 },
    pt: {
      name: "Runway Guardian",
      summary: "Começa com mais gordura financeira.",
      passive: "A primeira perda de Budget em cada ato é reduzida em 2.",
    },
    en: {
      name: "Runway Guardian",
      summary: "Starts with more financial cushion.",
      passive: "The first Budget loss each act is reduced by 2.",
    },
  },
  {
    id: "systems-thinker",
    sprite: "manager",
    startingMetrics: { team: 2, delivery: 2, trust: 2, budget: 2 },
    actStartBonus: { metric: "lowest", amount: 2 },
    pt: {
      name: "Systems Thinker",
      summary: "Não brilha numa barra só, mas entra equilibrado.",
      passive: "No início de cada ato, a barra mais fraca ganha +2.",
    },
    en: {
      name: "Systems Thinker",
      summary: "Does not spike one bar, but starts balanced.",
      passive: "At the start of each act, your weakest bar gains +2.",
    },
  },
];

window.PEOPLE_PAGER_PERKS = [
  {
    id: "skip-levels",
    immediate: { team: 4 },
    mitigation: { team: 1 },
    pt: {
      name: "Termômetro da base",
      summary: "Você ouve o andar de baixo antes da crise virar pauta.",
      effect: "Ganha +4 Team. Perdas futuras de Team são reduzidas em 1.",
    },
    en: {
      name: "Floor thermometer",
      summary: "You hear the ground floor before the crisis becomes an agenda item.",
      effect: "Gain +4 Team. Future Team losses are reduced by 1.",
    },
  },
  {
    id: "roadmap-buffer",
    immediate: { delivery: 4 },
    mitigation: { delivery: 1 },
    pt: {
      name: "Gordura no plano",
      summary: "Seu roadmap tem folga real, não só fé no throughput.",
      effect: "Ganha +4 Delivery. Perdas futuras de Delivery são reduzidas em 1.",
    },
    en: {
      name: "Slack in the plan",
      summary: "Your roadmap has real room, not just faith in throughput.",
      effect: "Gain +4 Delivery. Future Delivery losses are reduced by 1.",
    },
  },
  {
    id: "board-script",
    immediate: { trust: 4 },
    mitigation: { trust: 1 },
    pt: {
      name: "Roteiro pro board",
      summary: "Sua história pra cima fica mais difícil de desmontar.",
      effect: "Ganha +4 Trust. Perdas futuras de Trust são reduzidas em 1.",
    },
    en: {
      name: "Board playbook",
      summary: "Your upward narrative gets much harder to punch holes in.",
      effect: "Gain +4 Trust. Future Trust losses are reduced by 1.",
    },
  },
  {
    id: "finops-routine",
    immediate: { budget: 4 },
    mitigation: { budget: 1 },
    pt: {
      name: "Olho no caixa",
      summary: "Você pega vazamento antes de virar pauta com o CFO.",
      effect: "Ganha +4 Budget. Perdas futuras de Budget são reduzidas em 1.",
    },
    en: {
      name: "Eye on the bill",
      summary: "You catch leaks before they become a CFO conversation.",
      effect: "Gain +4 Budget. Future Budget losses are reduced by 1.",
    },
  },
  {
    id: "bench-depth",
    immediate: { team: 2, delivery: 2 },
    pt: {
      name: "Banco de reservas",
      summary: "Mais gente assume sem travar o resto. Bus factor subiu.",
      effect: "Ganha +2 Team e +2 Delivery.",
    },
    en: {
      name: "Deeper bench",
      summary: "More people can carry weight. Bus factor just improved.",
      effect: "Gain +2 Team and +2 Delivery.",
    },
  },
  {
    id: "incident-drill",
    immediate: { trust: 2, delivery: 2 },
    pressureMitigation: { trust: 1 },
    pt: {
      name: "Simulacro de incêndio",
      summary: "Quando aperta, a comunicação não derrete junto.",
      effect: "Ganha +2 Trust e +2 Delivery. Pressão recorrente em Trust cai 1.",
    },
    en: {
      name: "Fire drill",
      summary: "When things go sideways, communication doesn't melt with them.",
      effect: "Gain +2 Trust and +2 Delivery. Recurring Trust pressure drops by 1.",
    },
  },
  {
    id: "cost-guardrails",
    immediate: { budget: 2, delivery: 1 },
    pressureMitigation: { budget: 1 },
    pt: {
      name: "Freio de mão no gasto",
      summary: "Ainda é caro, mas pelo menos você sabe onde tá indo.",
      effect: "Ganha +2 Budget e +1 Delivery. Pressão recorrente em Budget cai 1.",
    },
    en: {
      name: "Spending guardrails",
      summary: "Still expensive, but at least you know where it's going.",
      effect: "Gain +2 Budget and +1 Delivery. Recurring Budget pressure drops by 1.",
    },
  },
  {
    id: "staff-council",
    immediate: { team: 2, trust: 1 },
    actStartBonus: { metric: "team", amount: 1 },
    pt: {
      name: "Conselho de guerra",
      summary: "Você divide o peso com quem aguenta, não só com quem aparece.",
      effect: "Ganha +2 Team e +1 Trust. No início de cada ato, Team ganha +1.",
    },
    en: {
      name: "War council",
      summary: "You share the weight with people who can carry, not just those who show up.",
      effect: "Gain +2 Team and +1 Trust. At the start of each act, Team gains +1.",
    },
  },
  {
    id: "ops-ritual",
    immediate: { delivery: 2, trust: 1 },
    pressureMitigation: { delivery: 1 },
    pt: {
      name: "Ritual de trincheira",
      summary: "Sua semana fica menos refém de qualquer DM urgente.",
      effect: "Ganha +2 Delivery e +1 Trust. Pressão recorrente em Delivery cai 1.",
    },
    en: {
      name: "Trench ritual",
      summary: "Your week gets less hostage to every urgent DM.",
      effect: "Gain +2 Delivery and +1 Trust. Recurring Delivery pressure drops by 1.",
    },
  },
  {
    id: "retention-fund",
    unlockKey: "career-retention-fund",
    immediate: { team: 1, budget: 3 },
    pt: {
      name: "Caixa de retenção",
      summary: "Dinheiro separado pra quando alguém bom vier com oferta externa.",
      effect: "Ganha +1 Team e +3 Budget.",
    },
    en: {
      name: "Retention war chest",
      summary: "Money set aside for when a good person shows up with an outside offer.",
      effect: "Gain +1 Team and +3 Budget.",
    },
  },
  {
    id: "firebreak",
    unlockKey: "career-firebreak",
    immediate: { team: 2 },
    pressureMitigation: { team: 1 },
    pt: {
      name: "Zona livre de reunião",
      summary: "Blocos protegidos. O time consegue pensar sem ser interrompido.",
      effect: "Ganha +2 Team. Pressão recorrente em Team cai 1.",
    },
    en: {
      name: "Meeting-free zone",
      summary: "Protected blocks. The team can think without being interrupted.",
      effect: "Gain +2 Team. Recurring Team pressure drops by 1.",
    },
  },
  {
    id: "quarter-story",
    unlockKey: "career-quarter-story",
    immediate: { trust: 2, budget: 2 },
    immediateScore: 80,
    pt: {
      name: "Narrativa do quarter",
      summary: "Sua história pra cima fica convincente mesmo sem resolver tudo embaixo.",
      effect: "Ganha +2 Trust, +2 Budget e +080 score.",
    },
    en: {
      name: "Quarter narrative",
      summary: "Your story upward holds together even when the basement is messy.",
      effect: "Gain +2 Trust, +2 Budget, and +080 score.",
    },
  },
  {
    id: "shadow-roadmap",
    unlockKey: "career-first-win",
    immediate: { delivery: 1, trust: 2 },
    mitigation: { trust: 1 },
    pt: {
      name: "Shadow Roadmap",
      summary: "Você compra folga política sem prometer mais data do que devia.",
      effect: "Ganha +1 Delivery, +2 Trust. Perdas futuras de Trust são reduzidas em 1.",
    },
    en: {
      name: "Shadow Roadmap",
      summary: "You buy political room without promising more date than you should.",
      effect: "Gain +1 Delivery, +2 Trust. Future Trust losses are reduced by 1.",
    },
  },
  {
    id: "budget-circuit-breaker",
    unlockKey: "career-budget-scar",
    immediate: { budget: 3, team: 1 },
    pressureMitigation: { budget: 1 },
    pt: {
      name: "Budget Circuit Breaker",
      summary: "Você monta um limite duro antes de virar crise de caixa em toda review.",
      effect: "Ganha +3 Budget e +1 Team. Pressão recorrente em Budget cai 1.",
    },
    en: {
      name: "Budget Circuit Breaker",
      summary: "You set a hard limit before burn-rate panic reaches every review.",
      effect: "Gain +3 Budget and +1 Team. Recurring Budget pressure drops by 1.",
    },
  },
  {
    id: "staff-backchannel",
    unlockKey: "career-three-runs",
    immediate: { team: 2, trust: 1 },
    actStartBonus: { metric: "trust", amount: 1 },
    pt: {
      name: "Staff Backchannel",
      summary: "Você para de descobrir tensão estrutural só quando ela já virou sala de guerra.",
      effect: "Ganha +2 Team e +1 Trust. No início de cada ato, Trust ganha +1.",
    },
    en: {
      name: "Staff Backchannel",
      summary: "You stop discovering structural tension only after it becomes a war room.",
      effect: "Gain +2 Team and +1 Trust. At the start of each act, Trust gains +1.",
    },
  },
];
