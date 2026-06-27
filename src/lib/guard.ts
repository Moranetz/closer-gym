import { NextResponse } from "next/server";

// Best-effort serverless guard for the paid Anthropic routes. Without this,
// the endpoints forward arbitrary client input to the org's ANTHROPIC_API_KEY
// with no cap — an open cost-drain. This ships statelessly (no infra):
//   - input-size caps  → a per-request cost ceiling
//   - optional origin allowlist (set ALLOWED_ORIGINS="https://your.site")
//   - a best-effort per-IP burst limit (per warm instance)
// Robust rate-limiting across instances needs a shared store (e.g. Upstash);
// add that before a high-traffic launch. This is the no-infra hardening.

const MAX_TURNS = 60;       // conversation/context length cap
const MAX_CHARS = 8000;     // single free-text field cap
const WINDOW_MS = 60_000;
const MAX_REQ = 30;         // per IP per window (best-effort)

const hits = new Map<string, { n: number; t: number }>();

interface GuardOpts {
  turns?: unknown;
  text?: unknown;
}

export function guard(req: Request, opts: GuardOpts = {}): NextResponse | null {
  // 1. origin allowlist — only enforced when configured, so it never breaks
  //    the legit same-origin client until you opt in via env.
  const allowed = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (allowed.length > 0) {
    const origin = req.headers.get("origin") || "";
    if (origin && !allowed.includes(origin)) {
      return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
    }
  }

  // 2. input-size caps — the cost ceiling.
  if (Array.isArray(opts.turns) && opts.turns.length > MAX_TURNS) {
    return NextResponse.json({ error: "Conversation too long" }, { status: 413 });
  }
  if (typeof opts.text === "string" && opts.text.length > MAX_CHARS) {
    return NextResponse.json({ error: "Input too long" }, { status: 413 });
  }

  // 3. best-effort per-IP burst limit (per warm serverless instance).
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.t > WINDOW_MS) {
    hits.set(ip, { n: 1, t: now });
  } else {
    rec.n += 1;
    if (rec.n > MAX_REQ) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }
  }

  return null;
}
