# Ship or Sink

Decision game for engineering managers in a Slack-inspired interface.

## What's in it

- 32-week campaign split into 4 acts
- Escalating run pressure with accumulated costs and follow-ups
- Deck with 63+ cards
- Focus on people management, career, performance, on-call, alignment, architecture and internal politics
- Recurring arcs with characters randomized per run
- Each run activates a different subset of arcs
- Clear act curve: setup, alignment, politics and final trade-offs
- Short chat-style copy
- Origin selection before each run with unique starting bonus and passive
- Random perk draft at the start of acts 2, 3 and 4
- Score, best score and streak tracking
- Run save with manager name
- Local leaderboard with score, weeks survived and manager legacy
- Stakeholder thread with quick replies
- Language toggle between PT-BR and EN without resetting the run
- Hidden consequences in choices
- Ambiguous cards with current AI and startup themes
- Conditional follow-ups
- HUD with four metric bars
- Sidebar with score, status and reset
- Click and keyboard controls

## How a run ends

- Game over when `Team`, `Delivery`, `Trust` or `Budget` reaches `0`
- Victory when you survive all `32` weeks
- At the end you can save your manager name and register their legacy on the local leaderboard

## How to run

Open `index.html` in the browser.

To serve via HTTP:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.
