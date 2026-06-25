# Usage

## When patdown runs

**Automatically.** The skill triggers right before your agent reports a coding
task as complete — any "done / finished / this should work / ✅" moment that
touched code. You don't have to ask for it; that's the point. The agent frisks
its own diff and only then signs off (or stops and asks).

**On demand.** Type `/patdown` to audit the current diff at any time, or
`/patdown <file>` / `/patdown <range>` to scope it.

## What it looks at

The **diff only** — the lines you just added or changed (`git diff`, or the
files edited this session). It does not re-scan the whole repo, so it stays fast
and doesn't nag about pre-existing code you didn't touch.

## The report

```
patdown — N changed file(s)
  ✗ critical  src/api/user.ts:42  hardcoded Stripe key → moved to STRIPE_SECRET env   [fixed]
  ✗ high      src/fetch.ts:18     SSRF: user url fetched, no allow-list → added guard  [fixed]
  ⚠ high      src/orders.ts:90    IDOR: getOrder(id) has no owner check — needs your rule  [escalated]
  ✓ rest clean (secrets, injection, paths, crypto)
1 issue needs your call before this is done.
```

Each finding has: a **severity**, the **file:line**, a one-line description, the
**action taken** (`[fixed]` or `[escalated]`), and the fix. Clean categories are
summarized on the `✓` line. No false-alarm spam — a line that's fine is not
flagged.

## Fixed vs escalated

- **`[fixed]`** — a safe, mechanical change the agent applied itself: move a
  secret to an env var, parameterize a query, add an allow-list, swap a weak
  hash, add a size cap, encode output.
- **`[escalated]`** — anything that touches intent or behavior and can't be
  fixed without knowing the requirement: an authz model decision, a schema
  change, removing a feature. The agent describes it and asks you to **approve /
  fix / skip**.

## The hard rule

patdown will **not** report a task as done while a **critical or high** finding
in your diff is unaddressed (neither fixed nor explicitly accepted by you). If
the diff is clean, it says so in one line and finishes.

## Report-only mode

If you want the audit without edits (for review, CI notes, or a demo), ask for
it: "run patdown but don't edit, just produce the report." Everything is then
`[flagged]` instead of `[fixed]`. This is how the [real runs](../CASES.md) were
captured.
