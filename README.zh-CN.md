<p align="center">
  <img src="assets/logo.svg" alt="patdown" width="96" height="96" />
</p>

<h1 align="center">patdown</h1>

<p align="center"><b>代码提交前，先搜一遍身。</b></p>

<p align="center">
  <a href="README.md">🇺🇸 English</a> · <a href="README.id.md">🇮🇩 Bahasa Indonesia</a> · 🇨🇳 简体中文
</p>

<p align="center">
  <img src="demo.gif" alt="patdown 演示" width="760" />
</p>

一个给编码 agent 用的技能（Claude Code，也支持 Codex、Cursor、Gemini CLI、
opencode，以及任何读取规则文件的工具）。在 agent 准备说任务**完成**之前，它会
**给自己的 diff 搜一遍身**，查找安全漏洞：硬编码密钥、注入、SSRF、越权、路径穿越、
危险的 `eval`、弱加密。能安全修的它自己修，其余的上报给你，并且**只要还有真正的高危
问题没处理，它就不会说"完成"。**

现在很多代码都是 AI 写的，其中不少带着漏洞就上线了。最省事的拦截点，就是刚写完代码的
那个 agent——在 code review 之前，在 CI 之前，在攻击者之前。

## 前 / 后对比

**没有 patdown** —— agent 写完就走：

```ts
const stripe = new Stripe("sk_live_51H8xQ2eZ...");      // 硬编码 live key
const res = await fetch(req.query.callbackUrl);          // SSRF
db.query("SELECT * FROM orders WHERE id=" + req.params.id); // SQL 注入
```
> "搞定！支付接口已接好。✅"

**有了 patdown** —— 先给 diff 搜身：

```
patdown — 1 个文件改动
  ✗ critical  payments.ts:1  硬编码 Stripe live key → 已移到 STRIPE_SECRET 环境变量   [已修复]
  ✗ high      payments.ts:2  SSRF：抓取用户传入的 callbackUrl → 已加公网 host 白名单  [已修复]
  ⚠ high      payments.ts:3  `id` 存在 SQL 注入 —— 需要参数化查询  [已上报]
  ✓ 其余干净（越权、路径、加密）
有 1 个问题需要你确认后才算完成。
```

同样的代码，漏洞没有溜出门。

## 安装

```bash
# macOS / Linux / WSL
curl -fsSL https://raw.githubusercontent.com/ryanda9910/patdown/main/install.sh | bash

# Windows (PowerShell)
irm https://raw.githubusercontent.com/ryanda9910/patdown/main/install.ps1 | iex
```

它会找出你装的每个编码 agent，把技能装进每一个。约 10 秒，可重复运行。加上
`--project` 还会装进当前仓库的 `.claude/`。无需密钥、无需账号、无依赖。

手动安装：把 [`skill/SKILL.md`](skill/SKILL.md) 复制到你的 agent 的 skills/rules
目录（Claude Code：`~/.claude/skills/patdown/SKILL.md`）。

## 搜身范围

```
┌──────────────────────────────────────────────────────────┐
│  密钥        代码/日志里的 api key · token · 凭据           │
│  注入        sql · shell · 模板/xss · eval · 反序列化       │
│  SSRF        用户可控 url · 元数据 · 重定向                  │
│  越权        缺少属主校验 · idor · 开放路由                  │
│  路径        穿越 · zip-slip · 跟随软链                      │
│  加密        弱 rng/hash · 关闭 tls · 用 == 比对 token       │
│  DOS         无界输入 · 无超时 · redos                       │
└──────────────────────────────────────────────────────────┘
```

只审 **diff**——改动的那几行——所以又快又不会对整个仓库唠叨。

## 工作原理

它是一个技能（指令），不是扫描器二进制——所以它结合上下文理解代码，而不是死板地匹配模式。

1. 你写完一个任务。在 agent 说"完成"之前，技能介入（或你输入 `/patdown`）。
2. 它读取 diff，对改动的行逐项过检查清单。
3. **安全、机械的修复它自己来**——参数化查询、把密钥移到环境变量、加白名单、换掉弱哈希。
4. **涉及业务意图的它上报给你**——批准、修改，或跳过。
5. 只要还有 critical/high 问题没处理，它就**不会**说完成。

没有误报刷屏：干净的行不会被标记。如果 diff 是干净的，它一句话说明，然后让开。

## 支持的工具

Claude Code（原生技能），以及任何加载规则/技能文件的 agent ——
**Codex、Cursor、Gemini CLI、opencode、Aider、GitHub Copilot CLI** 等等。

## 许可证

MIT。随便搜身。
