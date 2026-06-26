# Contributing

patdown is one file of instructions (`skill/SKILL.md`) plus docs and an
installer. Contributions that make the audit sharper or the install smoother are
welcome.

## Good contributions

- **A missed vulnerability class.** If patdown didn't catch something in a real
  diff, open an issue with the diff and the report, or a PR adding a concise
  checklist item to `skill/SKILL.md`.
- **A false positive.** Same — show the flagged line and why it's fine. We'd
  rather tighten the checklist than train people to ignore it.
- **A new harness.** If your agent reads a rules file we don't install to yet,
  add it to `install.sh` / `install.ps1`.
- **A translation.** New `README.<lang>.md` files are welcome; add the link to
  the language row.

## Style for `skill/SKILL.md`

- Keep each checklist item **one or two lines, concrete, with the fix**. The
  model follows specific instructions far better than vague ones.
- Don't add noise. Every item should catch a real class that a secret-scanner or
  a linter would miss; breadth at the cost of false positives is a net loss.
- Preserve the contract: audit the **diff only**, fix safe/mechanical, escalate
  intent, refuse "done" on unaddressed critical/high.

## Commits

This repo uses [Conventional Commits](https://www.conventionalcommits.org).
Format: `<type>(<scope>)?: <subject>` — types: `feat`, `fix`, `docs`, `style`,
`refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

```
feat(skill): add a new check
docs: clarify the install steps
fix: handle empty diff
```

CI lints every PR's commits (`.github/workflows/commitlint.yml`). To catch issues
before you push, enable the dep-free local hook once:

```bash
git config core.hooksPath .githooks
```

## Testing a change

Plant a vulnerable diff, install your edited skill (`bash install.sh --project`
in a scratch repo), and run it in a real agent (`/patdown` or
`claude -p "use your patdown skill on the git diff"`). See [CASES.md](CASES.md)
for the format. Include the before/after in your PR.

## Reporting a vulnerability in patdown itself

See [SECURITY.md](SECURITY.md). Email the maintainer; don't open a public issue
for an undisclosed vulnerability.

## License

By contributing you agree your work is licensed under the project's MIT license.
