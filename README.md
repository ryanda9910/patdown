<p align="center">
  <img src="assets/logo.svg" alt="patdown" width="96" height="96" />
</p>

<h1 align="center">patdown</h1>

<p align="center"><b>Frisk your diff before it ships.</b></p>

<p align="center">
  <img alt="license" src="https://img.shields.io/badge/license-MIT-34D399" />
  <img alt="skill" src="https://img.shields.io/badge/Claude%20Code-skill-34D399" />
  <img alt="harness" src="https://img.shields.io/badge/also-Codex%20·%20Cursor%20·%20Gemini%20·%20opencode-blue" />
  <img alt="install" src="https://img.shields.io/badge/install-one%20line-34D399" />
</p>

<p align="center">
  <img src="demo.gif" alt="patdown demo" width="760" />
</p>

A skill for your coding agent (Claude Code — also Codex, Cursor, Gemini CLI,
opencode, and anything that reads a rules file). Right before the agent says a
task is **done**, it **pats down its own diff** for security holes — secrets,
injection, SSRF, broken authz, path traversal, unsafe `eval`, weak crypto —
fixes the safe ones, escalates the rest, and **won't sign off while a real one
is still open.**

AI writes a lot of code now. A lot of it ships vulnerabilities. The agent that
wrote it is the cheapest place to catch them — before review, before CI, before
an attacker.

## Before / After

**Without patdown** — the agent writes it and moves on:

```ts
const stripe = new Stripe("sk_live_51H8xQ2eZ...");      // hardcoded live key
const res = await fetch(req.query.callbackUrl);          // SSRF
db.query("SELECT * FROM orders WHERE id=" + req.params.id); // SQL injection
```
> "Done! Payments endpoint is wired up. ✅"

**With patdown** — it frisks the diff first:

```
patdown — 1 changed file
  ✗ critical  payments.ts:1  hardcoded Stripe live key → moved to STRIPE_SECRET env   [fixed]
  ✗ high      payments.ts:2  SSRF: user callbackUrl fetched → added public-host allow-list  [fixed]
  ⚠ high      payments.ts:3  SQL injection on `id` — needs a parameterized query  [escalated]
  ✓ rest clean (authz, paths, crypto)
1 issue needs your call before this is done.
```

Same code. The vulns don't make it out the door.

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/ryanda9910/patdown/main/install.sh | bash
```

Finds every coding agent you have and installs the skill into each. ~10 seconds,
safe to re-run. Add `--project` to also install into the current repo's
`.claude/`. No key, no account, no dependency.

Manual: copy [`skill/SKILL.md`](skill/SKILL.md) into your agent's skills/rules
directory (Claude Code: `~/.claude/skills/patdown/SKILL.md`).

## What it frisks

```
┌──────────────────────────────────────────────────────────┐
│  SECRETS        api keys · tokens · creds in code/logs     │
│  INJECTION      sql · shell · template/xss · eval · deser  │
│  SSRF           user-controlled urls · metadata · redirects │
│  AUTHZ          missing owner check · idor · open routes    │
│  PATHS          traversal · zip-slip · symlink follow       │
│  CRYPTO         weak rng/hash · disabled tls · == on tokens │
│  DOS            unbounded input · no timeouts · redos        │
└──────────────────────────────────────────────────────────┘
```

It audits **only the diff** — the lines that changed — so it stays fast and
doesn't nag about the whole repo.

## How it works

It's a skill (plain instructions), not a scanner binary — so it understands the
code in context instead of pattern-matching.

1. You finish a coding task. Before the agent reports "done", the skill kicks in
   (or you run `/patdown`).
2. It reads the diff and runs the checklist against the changed lines.
3. **Safe, mechanical fixes it applies itself** — parameterize the query, move
   the secret to env, add the allow-list, swap the weak hash.
4. **Anything that touches intent it escalates** to you — approve, fix, or skip.
5. It does **not** call the task done while a critical/high issue is unaddressed.

No false-alarm spam: clean lines aren't flagged. If the diff is clean, it says so
in one line and gets out of the way.

## Works in

Claude Code (native skill), and any agent that loads a rules/skill file —
**Codex, Cursor, Gemini CLI, opencode, Aider, GitHub Copilot CLI**, and friends.
The installer drops the skill into each one it finds.

## Why a skill, not a CI scanner

CI catches it after you pushed. A linter pattern-matches and misses logic bugs
(an IDOR looks like a normal DB call). patdown rides inside the agent that *just
wrote the code* — it has the full intent and the diff, and it fixes in place.
Use it **with** your scanner, not instead of it.

## License

MIT. Frisk freely.
