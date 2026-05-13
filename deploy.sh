#!/usr/bin/env bash
#
# Closer Gym — Vercel deploy helper
#
# Walks through:
#   1. Vercel CLI present
#   2. Authed
#   3. Project linked
#   4. ANTHROPIC_API_KEY set in Vercel
#   5. Production deploy
#
# Idempotent: safe to re-run. Won't overwrite anything you didn't approve.
#
# Usage:
#   ./deploy.sh                    # interactive
#   ./deploy.sh --skip-env-check   # if ANTHROPIC_API_KEY already set in Vercel

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_ROOT"

# Pretty output
say() { printf "\n\033[1;36m▸ %s\033[0m\n" "$1"; }
warn() { printf "\n\033[1;33m⚠  %s\033[0m\n" "$1"; }
ok()  { printf "\033[1;32m✓\033[0m %s\n" "$1"; }
err() { printf "\033[1;31m✗ %s\033[0m\n" "$1" >&2; }

SKIP_ENV_CHECK=false
for arg in "$@"; do
  case $arg in
    --skip-env-check) SKIP_ENV_CHECK=true ;;
  esac
done

# ─── 0 · Pre-flight ─────────────────────────────────────────────────────────

say "Pre-flight checks"

if [[ ! -f "package.json" ]] || ! grep -q '"next"' package.json; then
  err "This doesn't look like the closer-gym project (no Next.js package.json). Aborting."
  exit 1
fi
ok "in closer-gym root"

if ! command -v node >/dev/null 2>&1; then
  err "Node.js not installed. Install Node 20.9+ first (https://nodejs.org)."
  exit 1
fi
ok "node $(node -v)"

# Warn if uncommitted changes — but don't block (Vercel deploys what's in the working tree).
if [[ -n "$(git status --porcelain 2>/dev/null)" ]]; then
  warn "uncommitted changes present — these will be included in the deploy bundle"
  git status --short
  read -rp "Continue anyway? [y/N] " ans
  [[ "$ans" =~ ^[Yy]$ ]] || { err "Aborted."; exit 1; }
fi

# ─── 1 · Vercel CLI ─────────────────────────────────────────────────────────

say "Vercel CLI"

if ! command -v vercel >/dev/null 2>&1; then
  warn "vercel CLI not found"
  read -rp "Install globally via 'npm install -g vercel'? [y/N] " ans
  if [[ "$ans" =~ ^[Yy]$ ]]; then
    npm install -g vercel
  else
    err "Aborted. Install vercel manually and re-run."
    exit 1
  fi
fi
ok "vercel $(vercel --version)"

# ─── 2 · Auth ───────────────────────────────────────────────────────────────

say "Vercel authentication"

if ! vercel whoami >/dev/null 2>&1; then
  warn "not logged in"
  echo "  Running 'vercel login' — follow the browser prompt."
  vercel login
fi
WHO=$(vercel whoami 2>&1 | tail -1)
ok "logged in as: $WHO"

# ─── 3 · Project link ───────────────────────────────────────────────────────

say "Project link"

if [[ ! -f ".vercel/project.json" ]]; then
  warn "project not linked yet"
  echo "  Running 'vercel link' — choose existing or create new 'closer-gym'."
  vercel link
fi

if [[ -f ".vercel/project.json" ]]; then
  PROJECT_NAME=$(grep -o '"projectName":"[^"]*"' .vercel/project.json | head -1 | cut -d'"' -f4 || echo "closer-gym")
  ok "linked to: $PROJECT_NAME"
else
  err "Project link failed. Run 'vercel link' manually and re-try."
  exit 1
fi

# ─── 4 · Env var (ANTHROPIC_API_KEY) ────────────────────────────────────────

if [[ "$SKIP_ENV_CHECK" != "true" ]]; then
  say "Environment variable: ANTHROPIC_API_KEY"

  # Check if already set in Vercel production env.
  if vercel env ls production 2>/dev/null | grep -q "ANTHROPIC_API_KEY"; then
    ok "ANTHROPIC_API_KEY already present in production env"
    read -rp "  Re-set it? (paste new value, or press Enter to keep existing) [y/N] " ans
    if [[ "$ans" =~ ^[Yy]$ ]]; then
      vercel env rm ANTHROPIC_API_KEY production --yes 2>/dev/null || true
      vercel env add ANTHROPIC_API_KEY production
    fi
  else
    warn "ANTHROPIC_API_KEY not set in production env"
    echo "  About to run 'vercel env add' — paste your sk-ant-... key when prompted."
    echo "  (Vercel hides input; nothing is logged.)"
    vercel env add ANTHROPIC_API_KEY production
    ok "env var added"
  fi
fi

# ─── 5 · Deploy ─────────────────────────────────────────────────────────────

say "Production deploy"
echo "  Running 'vercel --prod'. First deploy can take ~90 seconds."

vercel --prod

# Vercel prints the URL itself. Pull it from .vercel/output or last deployment for convenience.
LATEST_URL=$(vercel ls --json 2>/dev/null | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "")
if [[ -n "$LATEST_URL" ]]; then
  ok "live at: https://$LATEST_URL"
fi

# ─── 6 · Next steps ─────────────────────────────────────────────────────────

cat <<'EOF'

──────────────────────────────────────────────────────────────────────────────
  ▸ Next steps

  • Visit the URL above and run a drill against t1-economic-buyer-cfo.
  • To add a custom domain (e.g. closer.gym):
      vercel domains add closer.gym
      → then Project Settings → Domains in the Vercel dashboard
  • Future commits to main auto-deploy IF you connected the GitHub integration
    in the Vercel dashboard. CLI deploys (this script) are manual.

  ▸ Cost watch

  Each drill session = ~50-100K Opus tokens ≈ $0.50-$1.
  Switch to Sonnet by editing MODEL in src/lib/anthropic.ts if traffic grows.

──────────────────────────────────────────────────────────────────────────────
EOF
