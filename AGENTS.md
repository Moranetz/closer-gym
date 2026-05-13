<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Closer Gym — north star

> The gym for closers. What chess.com did to chess, for sales.

The product is a chess.com clone for sales conversations. The chess.com UI metaphor isn't a pitch — it's the design spec. Every surface (Play / Puzzles / Lessons / Watch / Analysis) maps to chess.com's equivalent. Eval bar, move list, opening name banner, blunder markers (?, ??, ?!), ELO progression, daily puzzle — all literal ports.

## Hard rules

1. **Don't drift to closer-sparring's editorial aesthetic.** That repo is bespoke editorial / marginalia / serif. closer-gym is modern chess.com — Montserrat sans, dark `#262421` page bg, green accents `#81B64C`. The two products co-exist.
2. **The "board" is the conversation.** The transcript scrolls up the center column. The eval bar (28px wide) sits flush-left of it. The right rail holds opening banner + control toolbar + move list.
3. **Eval bar moves per move.** Every operator utterance gets detector-tagged + eval-scored. The bar's animation is the product's signature feedback.
4. **No "AI assistant" framing.** This is a gym. The bot is your opponent, not your assistant. Cluely is the cheat code; this is the gym.

## What lives where

| Concern | Path |
|---|---|
| chess.com design tokens (colors, type, layout) | `src/app/globals.css` + `src/lib/tokens.ts` |
| Persona engine (Claude API + system prompt) | `src/lib/anthropic.ts` (inherited from closer-sparring) |
| Atlas technique taxonomy | `src/lib/techniques.ts` |
| Detector (per-utterance tagging) | `src/lib/detector.ts` |
| Delta-mechanics (eval function) | `src/lib/eval.ts` |
| ELO math (Glicko-2) | `src/lib/elo.ts` |
| Persona → ELO band assignments | `src/lib/persona-elo.ts` |
