# Real runs

These are **actual patdown runs in Claude Code** (not mockups) on planted-vuln
code. Reproduce any of them: install the skill, make the change, run `/patdown`.

---

## Case 1 — payments endpoint

The diff the agent "finished":

```js
const stripe = new Stripe("sk_live_51H8xQ2eZvKYlo2C9kR3al...");   // hardcoded live key
const r = await fetch(req.query.callbackUrl);                      // user-controlled URL
const order = await db.query("SELECT * FROM orders WHERE id = " + req.params.id); // string-built query
```

patdown's report:

```
patdown — 1 changed file
  ✗ critical  payments.js:2  hardcoded Stripe LIVE key → move to STRIPE_SECRET env, rotate now (already leaked in git)
  ✗ high      payments.js:8  SQL injection: req.params.id concatenated → parameterize ($1, [req.params.id])
  ✗ high      payments.js:6  SSRF: fetch(req.query.callbackUrl), no allow-list → reaches loopback/private/169.254.169.254
  ✓ rest clean (paths, crypto, authz, dos)
3 issues need your call before this is done.
```

It also caught what a diff-only checklist could miss: the leaked key **is already
in git history**, so it told you to rotate it, not just move it.

---

## Case 2 — user profile + auth helpers

The diff:

```js
crypto.createHash("md5").update(pw).digest("hex");          // password hash
Math.floor(Math.random() * 1e9).toString();                 // reset token
await db.users.findById(req.params.id);                     // returned to caller
res.sendFile("./uploads/" + req.query.file);                // user-supplied filename
```

patdown's report:

```
patdown — 1 changed file
  ⚠ high      users.js:14  path traversal: sendFile("./uploads/"+req.query.file) → path.basename() + resolve+prefix check
  ⚠ high      users.js:5   weak RNG: resetToken() uses Math.random(), guessable → crypto.randomBytes(32).toString("hex")
  ⚠ high      users.js:9   IDOR: getProfile returns db user by req.params.id, no owner check → verify req.user owns id
  ⚠ medium    users.js:4   weak crypto: MD5 for password hash, fast + unsalted → bcrypt/argon2/scrypt
  ✓ rest clean (secrets, injection, SSRF, CORS/CSRF)
4 issues need your call. NOT done — 3 high unaddressed.
```

Four different vuln classes in eight lines, none of which a secret-scanner or a
naive linter would all catch — an IDOR looks like a perfectly normal DB call.

---

Both runs were `claude -p "… use your patdown skill on the git diff …"` in report
mode. In normal use the safe, mechanical fixes are applied in place and only the
judgment calls (the IDOR, the authz rule) are escalated.
