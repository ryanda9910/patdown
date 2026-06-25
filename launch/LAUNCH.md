# patdown launch kit

Copy-paste posts for launch day. Plain, honest, no hype. Post the demo.gif with each.
Best order: Show HN in the morning (US), then Threads + X, then Reddit a few hours later.

---

## Show HN

**Title:**
```
Show HN: Patdown, a coding-agent skill that security-checks its own diff
```

**Body:**
```
I kept noticing that when an AI coding agent finishes a task, it will happily
leave a hardcoded key or an unparameterized query in the diff and still say
"done, this should work." The agent that just wrote the code is the cheapest
place to catch that, so I made a skill that runs right before it claims done.

It reads only the diff and checks the changed lines for the usual stuff:
secrets, injection, SSRF, broken access control, path traversal, unsafe eval,
weak crypto. Safe mechanical fixes it applies itself (move the secret to an env
var, parameterize the query). Anything that needs a judgment call it flags and
asks you. It will not sign off while a high severity issue is still open.

It is instructions, not a scanner binary, so it reasons about the code in
context instead of grepping for patterns. An IDOR looks like a normal DB call to
a linter; the agent has the intent.

Works in Claude Code as a native skill, plus Codex, Cursor, Gemini CLI and
opencode through their rules files. One line to install, no key or account.

It is not a replacement for real SAST or a security review. It is a cheap first
pass at the point where fixing is still free. Would love feedback on the
checklist and what it misses.

https://github.com/ryanda9910/patdown
```

---

## Threads (Bahasa Indonesia)

```
Bikin skill kecil buat coding agent (Claude Code, Cursor, Codex, dll).

Tiap agent AI selesai nulis kode, sering banget dia tinggalin hardcoded key atau
query rawan SQL injection, terus santai bilang "udah, harusnya jalan".

patdown jalan tepat sebelum dia bilang selesai. Dia geledah diff-nya sendiri:
secret, injection, SSRF, akses kontrol bocor, path traversal. Yang aman dia
perbaiki sendiri, yang butuh keputusan dia tanya kamu. Gak mau bilang selesai
kalau masih ada lubang serius.

Open source, MIT, sebaris buat pasang.

github.com/ryanda9910/patdown
```

---

## X / Twitter (thread, #buildinpublic)

```
1/ AI agents write code fast and leave security holes in the diff, then say
"done, should work."

So I made patdown: a skill that frisks the agent's own diff before it can claim
a task is finished.

Open source. One line to install. 🔎

2/ It reads only the changed lines and checks for secrets, injection, SSRF,
broken authz, path traversal, unsafe eval, weak crypto.

Safe fixes it applies itself. Judgment calls it escalates to you. It will not
say "done" while a high severity issue is open.

3/ Why a skill and not a linter:

a linter pattern-matches and misses logic bugs. An IDOR looks like a normal DB
call. The agent that wrote it has the full intent, so it catches what grep cannot.

4/ Works in Claude Code, Codex, Cursor, Gemini CLI, opencode.

curl -fsSL https://raw.githubusercontent.com/ryanda9910/patdown/main/install.sh | bash

github.com/ryanda9910/patdown
```

---

## Reddit (r/ClaudeAI, r/ChatGPTCoding)

**Title:**
```
I made a Claude Code skill that audits its own diff for security bugs before it says "done"
```

**Body:**
```
Quick thing I built. When an agent finishes a task it tends to leave stuff like
a hardcoded key or a string-built SQL query in the diff and still report it as
done. I wanted it caught at the point where fixing is free, by the agent that
just wrote it.

patdown runs right before the agent claims done (or on /patdown). It checks only
the changed lines for secrets, injection, SSRF, broken access control, path
traversal, unsafe eval, and weak crypto. Safe mechanical fixes it does itself,
anything that needs a real decision it flags for you, and it refuses to sign off
while a high severity issue is open.

It is a skill (plain instructions), so it understands the code in context rather
than matching patterns like a linter would. Works in Claude Code natively, plus
Codex, Cursor, Gemini CLI and opencode through their rules files. MIT, one line
to install, no account.

Not a replacement for proper SAST, just a cheap first pass. Curious what checks
you would add.

github.com/ryanda9910/patdown
```

---

## Notes

- Pin the demo.gif to each post; it carries the pitch.
- Reply fast to the first comments (HN/Reddit ranking rewards early engagement).
- If HN gains traction, do not also spam X with "we are on HN" until it sticks.
- Honest framing wins the security crowd: "first pass, not a replacement for SAST."
