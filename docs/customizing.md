# Customizing

patdown is a single file of instructions: `skill/SKILL.md` (installed at
`~/.claude/skills/patdown/SKILL.md`). Edit that file to change behavior — no
build, no code.

## Add or remove checks

The checklist lives under "The pat-down" in `SKILL.md`. Add a numbered item for
a class you care about (framework-specific auth, a banned internal API, PII in
logs), or delete one you don't. Keep each item one or two lines and concrete —
the model follows specific instructions better than vague ones.

```md
9. **PII in logs** — emails, phone numbers, full names, or tokens written to
   console/log sinks. Redact before logging.
```

## Change the severity gate

The default hard rule blocks "done" on unaddressed **critical or high**. To make
it stricter (also block medium) or looser (only critical), edit "The hard rule"
section:

```md
Do not report the task as done while a critical, high, or medium finding is
unaddressed.
```

## Scope: diff vs whole repo

By default patdown audits **only the diff** (fast, low-noise). To make it sweep
the whole file or project on demand, tell it so when you invoke it: "patdown the
entire src/ directory, not just the diff." For a permanent change, edit the
"What to look at" line in `SKILL.md`.

## Auto-fix vs report-only

By default it applies safe mechanical fixes and escalates the rest. For a
review-only posture (CI, audits), change the "What to do with findings" section
to "flag everything, never edit" — or just ask per-run: "report only, no edits."

## Language / stack notes

The checklist is language-agnostic in intent but the examples are JS/TS-flavored.
For a Python/Go/Rust shop, swap the example idioms (e.g. `yaml.load` →
`yaml.safe_load`, `pickle`, `os/exec`, `unsafe`) so the model anchors on your
stack. The vulnerability classes are the same everywhere.

## Project-specific rules

Use `--project` install to commit a tuned `./.claude/skills/patdown/SKILL.md`
into a repo. Your team then gets the same checklist, including any internal rules
you added, without each person configuring it.
