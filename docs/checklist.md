# Checklist reference

What patdown checks the changed lines for, with a representative example and the
fix it applies or recommends. This mirrors `skill/SKILL.md`.

## Severity model

| Severity | Meaning | Examples |
|---|---|---|
| **critical** | secret leak, RCE, full auth bypass | committed live key, `eval` on user input |
| **high** | injection, SSRF, IDOR, traversal | SQLi, server-side fetch of a user URL |
| **medium** | weak crypto, missing validation | MD5 password, no input size cap |
| **low** | hardening | permissive CORS without credentials |

The hard rule blocks "done" on any unaddressed **critical** or **high**.

## 1. Secrets & credentials

Hardcoded API keys, tokens, passwords, private keys, connection strings; secrets
in logs or error messages; committed `.env`.

```js
const stripe = new Stripe("sk_live_51H8x...");   // ✗ critical
```
**Fix:** move to `process.env.STRIPE_SECRET`. If it was committed, **rotate it** —
a leaked key stays leaked in git history.

## 2. Injection

Untrusted input flowing into SQL/NoSQL, shell/`exec`, template/HTML (XSS),
`eval`/`Function`/`pickle`/`yaml.load`/deserialization, LDAP, or regex (ReDoS).

```js
db.query("SELECT * FROM orders WHERE id = " + req.params.id);   // ✗ high
```
**Fix:** parameterize — `db.query("... WHERE id = $1", [req.params.id])`.

## 3. SSRF & outbound requests

User-controlled URLs/hosts fetched server-side without an allow-list; reachable
loopback / private / link-local / cloud-metadata (`169.254.169.254`); auto-followed
redirects that skip the host check.

```js
await fetch(req.query.callbackUrl);   // ✗ high
```
**Fix:** allow-list the host, block private ranges, don't auto-follow redirects.

## 4. AuthZ / access control

Missing ownership/role check before a read or mutation; IDOR (acting on a
request-supplied id without verifying the caller may); endpoints trusting
client-supplied identity; default-open routes.

```js
const user = await db.users.findById(req.params.id);   // ⚠ high — no owner check
```
**Fix (escalated):** verify `req.user` owns `id` before the call. This is usually
escalated because the right rule depends on your model.

## 5. Path & file handling

Path traversal (`../`), unsanitized filenames, zip-slip, writing inside
user-controlled paths, following symlinks.

```js
res.sendFile("./uploads/" + req.query.file);   // ✗ high — ../ escapes
```
**Fix:** `path.basename()` then resolve and check it stays under the intended dir.

## 6. Crypto & randomness

`Math.random()` for tokens; MD5/SHA1 for passwords; hardcoded IV/salt; disabled
TLS verification; `==` token comparison instead of constant-time.

```js
Math.floor(Math.random() * 1e9).toString();   // ⚠ high — guessable token
crypto.createHash("md5").update(pw)...         // ⚠ medium — weak password hash
```
**Fix:** `crypto.randomBytes(32).toString("hex")`; bcrypt/argon2/scrypt for
passwords; `crypto.timingSafeEqual` for token compares.

## 7. Web hygiene

Reflected/stored XSS, missing output encoding, `dangerouslySetInnerHTML`/`v-html`
on untrusted data, permissive CORS (`*` with credentials), missing CSRF on
state-changing routes.

**Fix:** encode output, restrict CORS origins, add CSRF tokens.

## 8. Resource & DoS

Unbounded input (no size/row caps), unbounded loops over user data, missing
timeouts on outbound calls, regex on attacker input.

**Fix:** add caps, timeouts, and pagination.

## 9. LLM / AI-app security

For code that calls an LLM (agents, chatbots, RAG, AI features). The agent is now
writing AI apps, so it has to frisk those too.

```js
const prompt = `You are support. Answer this: ${userMessage}`;  // ⚠ high — prompt injection
const sql = await llm.complete("write SQL for: " + q);
db.query(sql);                                                  // ✗ critical — model output → SQL
```
**Catches:**
- **Prompt injection** — untrusted input (user text, web/tool output) concatenated
  into a prompt/system message with no isolation, able to override instructions.
- **Trusting model output** — LLM output fed straight into `eval`/SQL/shell/a
  redirect without validation.
- **Over-broad tools** — shell/file-write/DB tools exposed to the model with no
  allow-list or approval gate.
- **Secrets in prompts** — keys or system internals where the model or logs leak them.
- **No bound** — missing output/token cap or loop guard on the model call.

**Fix:** isolate untrusted input from instructions, validate/encode model output
before acting on it, gate dangerous tools behind an allow-list/approval, keep
secrets out of prompts, and bound the call.

---

patdown reports **real findings only**. If a changed line is fine, it is not
flagged — false alarms train people to ignore the tool.
