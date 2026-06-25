---
name: patdown
description: >-
  Pat down your own diff for security holes before claiming a coding task is
  done. Triggers automatically when you are about to report work complete (or on
  /patdown). Audits only what changed for secrets, injection, SSRF, broken
  authz, path traversal, unsafe eval/deserialization, and weak crypto — applies
  the safe fixes, escalates the rest, and refuses to say "done" while a
  high-severity issue is unaddressed.
---

# patdown — frisk your diff before it ships

You just wrote or changed code. Before you tell the user it's done, **pat it
down**. AI-written code ships vulnerabilities at a high rate; your job is to
catch yours in your own diff, not let a human (or an attacker) find them later.

## When to run

- **Automatically**, right before you would say a coding task is complete,
  merged, or ready — any "done / finished / this should work / ✅" moment that
  touched code.
- **On demand** when the user types `/patdown` (audit the current diff or a
  named file/range).

Audit the **diff only** — the lines you added or changed (`git diff`, or the
files you just edited). Do not re-audit the whole repo; stay scoped and fast.

## The pat-down (run every check against the changed lines)

1. **Secrets & credentials** — hardcoded API keys, tokens, passwords, private
   keys, connection strings; secrets in logs, error messages, or committed
   `.env`. Anything that should be an env var or vault reference.
2. **Injection** — untrusted input flowing into: SQL/NoSQL (string-built
   queries → must be parameterized), shell/`exec`/`spawn`, template/HTML
   (XSS), `eval`/`Function`/`pickle`/`yaml.load`/deserialization, LDAP, regex
   (ReDoS), and prompt construction.
3. **SSRF & outbound requests** — user-controlled URLs/hosts fetched
   server-side without an allow-list; reachable loopback / private /
   link-local / cloud-metadata (169.254.169.254) targets; auto-followed
   redirects that skip the host check.
4. **AuthZ / access control** — missing ownership/role check before a read or
   mutation; IDOR (acting on an id from the request without verifying the caller
   may); endpoints that trust client-supplied identity; default-open routes.
5. **Path & file handling** — path traversal (`../`), unsanitized filenames,
   zip-slip, writing inside user-controlled paths, following symlinks.
6. **Crypto & randomness** — `Math.random()`/weak RNG for tokens; MD5/SHA1 for
   passwords (use bcrypt/argon2); hardcoded IV/salt; disabled TLS verification;
   `==` token comparison instead of constant-time.
7. **Web hygiene** — reflected/stored XSS, missing output encoding, `dangerously
   SetInnerHTML`/`v-html` on untrusted data, permissive CORS (`*` with
   credentials), missing CSRF protection on state-changing routes.
8. **Resource & DoS** — unbounded input (no size/row caps), unbounded loops over
   user data, missing timeouts on outbound calls, regex on attacker input.

Severity: **critical** (secret leak, RCE, auth bypass), **high** (injection,
SSRF, IDOR), **medium** (weak crypto, missing validation), **low** (hardening).

## What to do with findings

- **Apply the safe, mechanical fix yourself** — parameterize the query, move the
  secret to an env var, add the allow-list/host check, swap the weak hash, add
  the size cap, encode the output. State each fix in the report.
- **Escalate anything that touches intent or behavior** — an authz model
  decision, a schema change, removing a feature, anything you can't fix without
  guessing the requirement. Describe the issue, the risk, and 1–2 options; ask
  the user to **approve / fix / skip**.
- **Never invent a vulnerability.** If a line is fine, don't flag it. False
  alarms train people to ignore you.

## The hard rule

Do **not** report the task as done while a **critical or high** finding in your
diff is unaddressed (neither fixed nor explicitly accepted by the user). If
everything is clean, say so in one line and finish.

## Report format

```
patdown — N changed file(s)
  ✗ critical  src/api/user.ts:42  hardcoded Stripe key → moved to STRIPE_SECRET env  [fixed]
  ✗ high      src/fetch.ts:18     SSRF: user url fetched, no host allow-list → added isPublicHost() guard  [fixed]
  ⚠ high      src/orders.ts:90    IDOR: getOrder(id) has no owner check — needs your authz rule  [escalated]
  ✓ rest clean (secrets, injection, paths, crypto)
1 issue needs your call before this is done.
```

Be terse. Real findings only. Fix what's safe, flag what isn't, and don't sign
off on shipped vulns.
