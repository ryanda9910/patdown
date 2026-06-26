# Changelog

All notable changes to patdown are documented here.

## [0.2.0] — 2026-06-26

### Added
- **LLM / AI-app security checks.** patdown now frisks AI features your agent
  writes for **prompt injection** (untrusted input merged into prompts), **trusting
  model output** (LLM output fed into `eval`/SQL/shell without validation),
  **over-broad tools** exposed to the model, **secrets in prompts**, and missing
  output/loop bounds. Covers `skill/SKILL.md`, `docs/checklist.md`, and the README.

## [0.1.0] — 2026-06-25

First release.

### Added
- **The skill** (`skill/SKILL.md`) — audits the diff for secrets, injection,
  SSRF, broken authz/IDOR, path traversal, unsafe eval/deserialization, weak
  crypto, and DoS; fixes the safe ones, escalates the rest, and refuses to call a
  task done while a critical/high finding is open.
- **One-line installers** — `install.sh` (macOS/Linux/WSL) and `install.ps1`
  (Windows); multi-harness: Claude Code native skill plus Codex, Cursor, Gemini
  CLI; `--project` for repo-local install.
- **Docs** (`docs/`) — usage, checklist reference, install, customizing, FAQ.
- **Real runs** (`CASES.md`) — two verbatim audits from live Claude Code.
- **i18n** — `README.md` (EN), `README.id.md`, `README.zh-CN.md`.
- **Demo** — `demo.gif` (two cases) reproducible with `make-demo.sh`, no key.
- `SECURITY.md`, `CONTRIBUTING.md`, `assets/logo.svg`, GitHub Release v0.1.0.

[0.1.0]: https://github.com/ryanda9910/patdown/releases/tag/v0.1.0
