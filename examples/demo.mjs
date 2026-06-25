/**
 * Self-driving demo for the README recording (VHS). Replays two real patdown
 * runs (the reports are verbatim from Claude Code — see CASES.md). No key needed.
 * Run: node examples/demo.mjs
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const C = {
  reset: "\x1b[0m", dim: "\x1b[2m", b: "\x1b[1m",
  green: "\x1b[38;5;42m", red: "\x1b[38;5;203m", yellow: "\x1b[38;5;221m",
  grey: "\x1b[90m", cyan: "\x1b[36m", plus: "\x1b[38;5;42m",
};
async function line(s = "", d = 55) { process.stdout.write(s + "\n"); await sleep(d); }
async function type(s, speed = 11) { for (const ch of s) { process.stdout.write(ch); await sleep(speed); } process.stdout.write(C.reset + "\n"); }

async function case1() {
  await type(`${C.cyan}$${C.reset} git diff ${C.dim}payments.js${C.reset}`, 22);
  await sleep(120);
  await line(`${C.plus}+ const stripe = new Stripe("sk_live_51H8xQ2eZ...");${C.reset}`, 50);
  await line(`${C.plus}+ const r = await fetch(req.query.callbackUrl);${C.reset}`, 50);
  await line(`${C.plus}+ db.query("SELECT * FROM orders WHERE id=" + req.params.id);${C.reset}`, 50);
  await line();
  await type(`${C.cyan}$${C.reset} ${C.b}/patdown${C.reset}`, 24);
  await sleep(250);
  await line(`${C.b}patdown${C.reset} ${C.dim}— 1 changed file${C.reset}`, 250);
  await line(`  ${C.red}✗ critical${C.reset}  payments.js:2  hardcoded Stripe live key ${C.green}→ STRIPE_SECRET env (rotate — already in git)${C.reset}  ${C.green}[fixed]${C.reset}`, 320);
  await line(`  ${C.red}✗ high${C.reset}      payments.js:6  SSRF: user callbackUrl ${C.green}→ public-host allow-list${C.reset}  ${C.green}[fixed]${C.reset}`, 320);
  await line(`  ${C.yellow}⚠ high${C.reset}      payments.js:8  SQL injection on \`id\` — needs parameterized query  ${C.yellow}[escalated]${C.reset}`, 320);
  await line(`  ${C.green}✓${C.reset} rest clean`, 250);
  await line(`${C.b}1 issue needs your call before this is done.${C.reset}`, 200);
  await line();
}

async function case2() {
  await line(`${C.dim}  ── another file, different holes ──${C.reset}`, 250);
  await type(`${C.cyan}$${C.reset} ${C.b}/patdown${C.reset} ${C.dim}users.js${C.reset}`, 24);
  await sleep(250);
  await line(`${C.b}patdown${C.reset} ${C.dim}— 1 changed file${C.reset}`, 250);
  await line(`  ${C.yellow}⚠ high${C.reset}    users.js:14  path traversal: sendFile("./uploads/"+file) ${C.green}→ basename + prefix check${C.reset}  ${C.yellow}[escalated]${C.reset}`, 320);
  await line(`  ${C.yellow}⚠ high${C.reset}    users.js:5   weak token: Math.random() ${C.green}→ crypto.randomBytes(32)${C.reset}  ${C.green}[fixed]${C.reset}`, 320);
  await line(`  ${C.yellow}⚠ high${C.reset}    users.js:9   IDOR: getProfile, no owner check — verify req.user owns id  ${C.yellow}[escalated]${C.reset}`, 320);
  await line(`  ${C.yellow}⚠ medium${C.reset}  users.js:4   MD5 password hash ${C.green}→ bcrypt/argon2${C.reset}  ${C.green}[fixed]${C.reset}`, 320);
  await line(`  ${C.green}✓${C.reset} rest clean ${C.dim}(secrets, injection, SSRF)${C.reset}`, 250);
  await line(`${C.b}2 issues need your call. NOT done.${C.reset}`, 200);
  await line();
}

async function main() {
  await line(`${C.green}${C.b}  patdown${C.reset} ${C.dim}— frisk your diff before it ships  ·  real Claude Code runs${C.reset}\n`, 400);
  await case1();
  await sleep(500);
  await case2();
  await sleep(300);
  await line(`${C.dim}  your agent frisks its own diff before it says "done".${C.reset}`, 120);
  await line(`${C.green}  github.com/ryanda9910/patdown${C.reset}`, 100);
  await line();
}
main();
