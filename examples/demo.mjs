/**
 * Self-driving demo for the README recording (VHS). No agent/API needed — it
 * replays a representative patdown run: a diff with two real vuln classes, then
 * the skill's report (one fixed, one fixed, one escalated). Run: tsx examples/demo.ts
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const C = {
  reset: "\x1b[0m", dim: "\x1b[2m", b: "\x1b[1m",
  green: "\x1b[38;5;42m", red: "\x1b[38;5;203m", yellow: "\x1b[38;5;221m",
  grey: "\x1b[90m", cyan: "\x1b[36m", plus: "\x1b[38;5;42m", minus: "\x1b[38;5;203m",
};

async function line(s = "", d = 60) { process.stdout.write(s + "\n"); await sleep(d); }
async function type(s, _color = C.reset, speed = 12) {
  // stream the (already-colored) string char by char; do NOT wrap each char,
  // that would shred any embedded ANSI escape sequences.
  for (const ch of s) { process.stdout.write(ch); await sleep(speed); }
  process.stdout.write(C.reset + "\n");
}

async function main() {
  await type(`${C.cyan}$${C.reset} git diff`, C.reset, 24);
  await sleep(150);
  await line(`${C.grey}--- a/src/payments.ts${C.reset}`, 30);
  await line(`${C.grey}+++ b/src/payments.ts${C.reset}`, 30);
  await line(`${C.plus}+ const stripe = new Stripe("sk_live_51H8xQ2eZvKYlo2C9k3...");${C.reset}`, 60);
  await line(`${C.plus}+ const res = await fetch(req.query.callbackUrl);${C.reset}`, 60);
  await line(`${C.plus}+ return db.query("SELECT * FROM orders WHERE id=" + req.params.id);${C.reset}`, 60);
  await line();
  await sleep(400);

  await type(`${C.cyan}$${C.reset} ${C.b}/patdown${C.reset}`, C.reset, 26);
  await sleep(300);
  await line(`${C.dim}  patting down the diff…${C.reset}`, 700);
  await line();

  await line(`${C.b}patdown${C.reset} ${C.dim}— 1 changed file${C.reset}`, 250);
  await line(`  ${C.red}✗ critical${C.reset}  payments.ts:1  hardcoded Stripe live key ${C.green}→ moved to STRIPE_SECRET env${C.reset}  ${C.green}[fixed]${C.reset}`, 350);
  await line(`  ${C.red}✗ high${C.reset}      payments.ts:2  SSRF: user callbackUrl fetched ${C.green}→ added public-host allow-list${C.reset}  ${C.green}[fixed]${C.reset}`, 350);
  await line(`  ${C.yellow}⚠ high${C.reset}      payments.ts:3  SQL injection on \`id\` — needs a parameterized query ${C.yellow}[escalated]${C.reset}`, 350);
  await line(`  ${C.green}✓${C.reset} rest clean ${C.dim}(authz, paths, crypto)${C.reset}`, 300);
  await line();
  await line(`${C.b}1 issue needs your call before this is done.${C.reset}`, 200);
  await line();
  await sleep(500);
  await line(`${C.dim}  your agent frisks its own diff before it says "done".${C.reset}`, 150);
  await line(`${C.green}  github.com/ryanda9910/patdown${C.reset}`, 100);
  await line();
}
main();
