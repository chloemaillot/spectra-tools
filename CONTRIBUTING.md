# Contributing

Thanks for considering a contribution. The repo is small and intentional, but useful improvements (better skill prompts, more action references, better quality gates) are welcome.

## Local setup

```bash
git clone https://github.com/chloemaillot/spectra-tools.git
cd spectra-tools
```

You'll also need:
- [Claude Code](https://claude.com/claude-code)
- [bridge-ds](https://github.com/noemuch/bridge-ds)
- [figma-console-mcp](https://github.com/southleft/figma-console-mcp)
- Figma Desktop

Then run the setup once to extract your own design system:

```
claude
/design-workflow setup
```

Your DS data lands in `.claude/skills/design-workflow/references/knowledge-base/`,
which is gitignored, so different users keep separate knowledge bases.

## Scope of contributions

Welcome:
- Improvements to the skill prompts (`SKILL.md`, action references)
- New quality gates or validation rules
- Better Figma API rules
- Documentation, examples, screenshots
- Tooling around `scripts/build-registry.js`

Out of scope:
- Adding DS-specific content to the repo (your tokens, components, screenshots): those belong in your own gitignored knowledge base
- Anything that ties this repo to a specific brand or Figma file

## Commits and PRs

- Conventional prefixes preferred: `feat:`, `fix:`, `docs:`, `chore:`, `ci:`
- One logical change per PR
- Update README if you change user-facing behavior

## License

By contributing, you agree your contributions will be licensed under the MIT License.
