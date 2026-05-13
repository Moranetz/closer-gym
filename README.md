# Closer Gym

> The gym for closers. What chess.com did to chess, for sales.

A sparring app for sales conversations, modeled after chess.com. Solve daily puzzles for free, study master games, earn a closing ELO. Optional Pro mode adds free-text bot sparring against fifteen adversarial buyer personas.

**Cluely is the cheat code. We built the gym.**

**Status:** v0.1 pre-release. Free tier is fully offline. Pro tier is BYO Anthropic API key.

---

## Free vs Pro

### Free — no API key required
- **Daily Drill puzzle** — deterministic by date, 30-second timer
- **20+ themed positions** — budget, procurement, stall, renewal, multi-stakeholder, endgame, cold open
- **Puzzle ELO + streak** — local Glicko-2, separate rating from games
- **Master games** archive (v0.2)
- **Lessons** tree (v0.2)
- **Local detector** — regex-based Atlas-tagger, ~70% accuracy, runs in-browser

### Pro — bring your own Anthropic key
- **Full bot ladder** — 15 adversarial buyer personas, ELO 1200–2400
- **Free-text play** — open conversation (no multiple choice), Claude responds in character
- **Live LLM detector** — ~85% tagging accuracy per turn
- **Upload your real calls** to Analysis (audio → STT → tagged transcript → engine report)
- **LLM-graded scorecard** at end of session
- Cost: ~$0.50/game on your Anthropic API
- **v0.2:** hosted Pro tier replaces BYO key

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind v4
- Anthropic Claude (`claude-opus-4-5`) — persona simulation, scoring, LLM detector (Pro)
- Pure regex / heuristic detector for Free
- localStorage persistence (sessions never leave your browser)
- Vercel-ready

## Run locally

```bash
# Free tier only:
npm install
npm run dev
# → http://localhost:3000  → solve daily puzzles, browse, no key needed

# Pro tier (adds bot ladder):
cp .env.example .env.local
# add ANTHROPIC_API_KEY=sk-ant-…
npm run dev
```

## Architecture

```
src/
├── app/
│   ├── layout.tsx              — chess.com-style top nav + sidebar shell
│   ├── page.tsx                — home hub (Daily Drill + Play hero + tabs)
│   ├── play/                   — bot ladder + live game (Pro)
│   │   ├── page.tsx            — persona picker sorted by ELO
│   │   └── [personaId]/
│   │       ├── page.tsx        — pre-game intent registration
│   │       └── session/[id]/
│   │           ├── page.tsx    — the chess.com play screen
│   │           └── review/     — post-game analysis + blunder markers
│   ├── puzzles/                — single-position drills + daily puzzle (FREE)
│   │   ├── page.tsx            — puzzle index + Daily Drill hero
│   │   └── [puzzleId]/         — solve screen
│   ├── lessons/                — curriculum lesson tree (v0.2)
│   ├── watch/                  — master games archive (v0.2)
│   ├── analysis/               — upload + engine report (Pro, v0.2)
│   └── api/
│       ├── persona-turn        — Claude API for buyer responses (Pro)
│       ├── score               — end-of-session scoring (Pro)
│       └── detect              — per-utterance LLM tagging (Pro)
└── lib/
    ├── personas.ts             — 15 buyer personas
    ├── persona-elo.ts          — ELO band assignments + locking
    ├── techniques.ts           — 35 Atlas-taxonomy techniques
    ├── puzzles.ts              — puzzle schema
    ├── puzzle-library.ts       — 20 hand-authored positions
    ├── puzzle-storage.ts       — solved set + streak + puzzle Glicko state
    ├── detector.ts             — LLM detector (Pro, /api/detect)
    ├── detector-local.ts       — regex detector (Free, in-browser)
    ├── eval.ts                 — delta-mechanics eval function
    ├── elo.ts                  — Glicko-2 rating math
    ├── tokens.ts               — chess.com design tokens + ELO bands
    ├── anthropic.ts            — Claude client wrapper
    ├── storage.ts              — localStorage session + rating persistence
    └── types.ts                — Persona, Session, Scorecard
```

## ELO + titles

Three separate ratings: **Game**, **Puzzle**, **Analysis**. Titles:

```
Patzer → Class D → Class C → Class B → Class A Closer
       → Expert → Master → International Master → Grandmaster Closer
```

Rating is meaningless until earned — no self-report, no quiz.

## Honest limits · v0.1

- **LLM-driven persona ≠ real buyer** (Pro).
- **Local detector is regex-based** (~70% accuracy vs LLM detector's ~85%). Some operator turns will be tagged "neutral" when a human would tag them.
- **Eval function v1 is heuristic** — calibrated against Atlas literature, not learned from win/loss labels.
- **Local-only persistence.** Sessions and ratings live in `localStorage`.

## License

MIT — see `LICENSE`.
