# Install

## One line

```bash
# macOS / Linux / WSL
curl -fsSL https://raw.githubusercontent.com/ryanda9910/patdown/main/install.sh | bash

# Windows (PowerShell)
irm https://raw.githubusercontent.com/ryanda9910/patdown/main/install.ps1 | iex
```

The installer downloads `skill/SKILL.md` and drops it into every coding agent it
detects. It is idempotent — safe to re-run to update. It needs `curl` or `wget`
(macOS/Linux) and no other dependency.

## Where it installs

| Agent | Location |
|---|---|
| **Claude Code** (native skill) | `~/.claude/skills/patdown/SKILL.md` |
| Codex | `~/.codex/patdown/patdown.md` |
| Cursor | `~/.cursor/patdown/patdown.md` |
| Gemini CLI | `~/.gemini/patdown/patdown.md` |
| opencode / Aider / Copilot CLI / others | manual — see below |

Claude Code loads it as a first-class skill (auto-triggers, `/patdown`). Other
agents read it as a rules/instructions file; how strongly it auto-triggers
depends on the harness, but `/patdown` or "follow the patdown rules" always works.

## Global vs project

- **Global** (default) — installs into your home agent dirs; applies to every repo.
- **Project** — `... | bash -s -- --project` (or `install.ps1 -project`) also
  writes `./.claude/skills/patdown/SKILL.md` so the skill travels with the repo
  for your team.

## Manual install

Copy `skill/SKILL.md` into your agent's skills/rules directory:

```bash
mkdir -p ~/.claude/skills/patdown
cp skill/SKILL.md ~/.claude/skills/patdown/SKILL.md
```

For agents that use a single rules file (e.g. `AGENTS.md`), paste the contents of
`skill/SKILL.md` into it.

## Updating

Re-run the one-line installer. It overwrites the existing copy with the latest.

## Uninstalling

```bash
rm -rf ~/.claude/skills/patdown ~/.codex/patdown ~/.cursor/patdown ~/.gemini/patdown
```
(and `./.claude/skills/patdown` if you used `--project`).
