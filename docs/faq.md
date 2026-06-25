# FAQ

### Is this a replacement for SAST / a security review?

No. It's a cheap first pass at the point where fixing is free — inside the agent
that just wrote the code. Keep your SAST, dependency scanning, and human review.
patdown reduces what reaches them.

### How is it different from a linter or a CI scanner?

A linter pattern-matches and misses logic bugs — an IDOR looks like a perfectly
normal DB call, and a missing authz check has no syntactic signature. CI catches
issues after you've pushed. patdown runs inside the agent that has the full
intent and the diff, before the work is even called done, and it fixes in place.
Use it **with** those tools, not instead of them.

### Will it slow me down?

It audits only the diff, only at the "done" moment, and stays quiet when the diff
is clean (one `✓` line). The cost is one short review pass on the lines you just
changed.

### Does it spam false positives?

It's instructed not to: clean lines are not flagged, and it's told never to
invent a vulnerability. If it's too chatty or too quiet for your taste, tune the
checklist or the severity gate ([customizing](customizing.md)).

### Does it send my code anywhere?

No. patdown is instructions your existing agent follows. Your code goes wherever
your agent already sends it (your LLM provider) and nowhere new. patdown adds no
network calls, no telemetry, no account.

### What languages does it support?

The vulnerability classes are universal; the shipped examples are JS/TS-flavored.
For other stacks, swap the example idioms in `SKILL.md` so the model anchors on
your language ([customizing](customizing.md)).

### Which agents does it work in?

Claude Code as a native skill (auto-triggers, `/patdown`), plus Codex, Cursor,
Gemini CLI, opencode, Aider, and GitHub Copilot CLI via their rules files. See
[install](install.md).

### It missed something / flagged something wrong.

Open an issue with the diff and the report. The checklist is a living file —
real misses become new checklist items.

### Can my team share one config?

Yes — `--project` install commits a tuned skill into the repo so everyone gets
the same checks. See [install](install.md) and [customizing](customizing.md).
