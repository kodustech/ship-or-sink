# People & Pager

Jogo de decisões para engineering managers em uma interface inspirada em Slack.

## O que tem agora

- Campanha de 32 semanas dividida em 4 atos
- Pressao crescente de run, com custo acumulado e follow-ups
- Deck com 63 cartas
- Mais foco em people management, carreira, performance, on-call, alinhamento, arquitetura e política interna
- Arcos recorrentes com personagens sorteados por run
- Cada partida ativa um subconjunto diferente desses arcos
- Curva de atos mais clara: setup, alinhamento, política e trade-offs finais
- Leitura mais curta no chat, com copy mais seca
- Escolha de origem antes da run, com bonus inicial e passiva propria
- Draft de perks aleatorias no início dos atos 2, 3 e 4
- Score, best score e streak
- Save da run no final com nome do gestor
- Leaderboard local com score, semanas e legado do gestor
- Thread com stakeholders e respostas rápidas
- Troca de idioma entre PT-BR e EN sem resetar a run
- Consequências escondidas nas escolhas
- Cartas mais ambiguas com temas atuais de AI e startup
- Follow-ups condicionais
- HUD com quatro barras
- Sidebar de score, status e reset
- Controles por clique e teclado

## Como a run termina

- Game over quando `Team`, `Delivery`, `Trust` ou `Budget` chegam a `0`
- Vitoria quando você fecha as `32` semanas
- No fim, você pode salvar o nome do gestor e registrar o legado dele no leaderboard local

## Como rodar

Abra o `index.html` no navegador.

Se preferir servir via HTTP:

```bash
python3 -m http.server 8080
```

Depois acesse `http://localhost:8080`.
