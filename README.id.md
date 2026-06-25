<p align="center">
  <img src="assets/logo.svg" alt="patdown" width="96" height="96" />
</p>

<h1 align="center">patdown</h1>

<p align="center"><b>Geledah diff-mu sebelum dikirim.</b></p>

<p align="center">
  <a href="README.md">🇺🇸 English</a> · 🇮🇩 Bahasa Indonesia · <a href="README.zh-CN.md">🇨🇳 简体中文</a>
</p>

<p align="center">
  <img src="demo.gif" alt="demo patdown" width="760" />
</p>

Skill buat coding agent kamu (Claude Code, juga Codex, Cursor, Gemini CLI,
opencode, dan apa pun yang baca file rules). Tepat sebelum agent bilang sebuah
tugas **selesai**, dia **menggeledah diff-nya sendiri** cari lubang keamanan:
secret, injection, SSRF, authz bocor, path traversal, `eval` bahaya, kripto
lemah. Yang aman dia perbaiki sendiri, sisanya dia eskalasi, dan dia **tidak mau
bilang selesai selama masih ada lubang serius.**

Sekarang banyak kode ditulis AI. Banyak yang lolos bawa kerentanan. Tempat
paling murah buat nangkepnya: di agent yang baru saja nulis kodenya, sebelum
review, sebelum CI, sebelum penyerang.

## Sebelum / Sesudah

**Tanpa patdown** — agent nulis lalu lanjut:

```ts
const stripe = new Stripe("sk_live_51H8xQ2eZ...");      // live key hardcoded
const res = await fetch(req.query.callbackUrl);          // SSRF
db.query("SELECT * FROM orders WHERE id=" + req.params.id); // SQL injection
```
> "Selesai! Endpoint pembayaran sudah jalan. ✅"

**Dengan patdown** — diff digeledah dulu:

```
patdown — 1 file berubah
  ✗ critical  payments.ts:1  Stripe live key hardcoded → dipindah ke env STRIPE_SECRET   [fixed]
  ✗ high      payments.ts:2  SSRF: callbackUrl dari user di-fetch → ditambah allow-list host  [fixed]
  ⚠ high      payments.ts:3  SQL injection di `id` — perlu query parameterized  [escalated]
  ✓ sisanya bersih (authz, path, kripto)
1 isu butuh keputusanmu sebelum ini dianggap selesai.
```

Kode sama. Kerentanannya tidak lolos keluar.

## Pasang

```bash
# macOS / Linux / WSL
curl -fsSL https://raw.githubusercontent.com/ryanda9910/patdown/main/install.sh | bash

# Windows (PowerShell)
irm https://raw.githubusercontent.com/ryanda9910/patdown/main/install.ps1 | iex
```

Cari semua coding agent yang kamu punya lalu pasang skill-nya ke masing-masing.
~10 detik, aman dijalankan ulang. Tambah `--project` buat pasang ke `.claude/`
repo ini juga. Tanpa key, tanpa akun, tanpa dependency.

Manual: salin [`skill/SKILL.md`](skill/SKILL.md) ke folder skills/rules agent kamu
(Claude Code: `~/.claude/skills/patdown/SKILL.md`).

## Yang digeledah

```
┌──────────────────────────────────────────────────────────┐
│  SECRET         api key · token · kredensial di kode/log   │
│  INJECTION      sql · shell · template/xss · eval · deser  │
│  SSRF           url dari user · metadata · redirect         │
│  AUTHZ          owner check hilang · idor · route terbuka   │
│  PATH           traversal · zip-slip · ikut symlink         │
│  KRIPTO         rng/hash lemah · tls mati · == buat token   │
│  DOS            input tak terbatas · tanpa timeout · redos   │
└──────────────────────────────────────────────────────────┘
```

Cuma audit **diff** — baris yang berubah — jadi cepat dan tidak rewel ke seluruh
repo.

## Cara kerja

Ini skill (instruksi), bukan scanner biner — jadi dia paham kode dalam konteks,
bukan cuma cocok-cocokan pola.

1. Kamu selesai satu tugas. Sebelum agent bilang "selesai", skill jalan (atau
   kamu ketik `/patdown`).
2. Dia baca diff dan jalankan checklist ke baris yang berubah.
3. **Perbaikan mekanis yang aman dia kerjakan sendiri** — parameterize query,
   pindahkan secret ke env, tambah allow-list, ganti hash lemah.
4. **Yang menyentuh intent dia eskalasi** ke kamu — setujui, perbaiki, atau skip.
5. Dia **tidak** bilang selesai selama masih ada isu critical/high yang terbuka.

Tanpa spam alarm palsu: baris yang aman tidak ditandai. Kalau diff bersih, dia
bilang dalam satu baris dan minggir.

## Jalan di

Claude Code (skill native), dan semua agent yang baca file rules/skill —
**Codex, Cursor, Gemini CLI, opencode, Aider, GitHub Copilot CLI**, dan kawan-kawan.

## Lisensi

MIT. Geledah sepuasnya.
