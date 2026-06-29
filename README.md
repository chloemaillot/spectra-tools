# Spectra Tools

A spec-first workflow for designers using **Claude Code** to generate Figma designs from natural language, with strict design system compliance.

> Status: alpha. Public-facing scaffold for the [bridge-ds](https://github.com/noemuch/bridge-ds) framework, adapted to designer-friendly workflows.

## What this is

A set of **Claude Code skills, slash commands, and action references** that let you go from spec → Figma design without leaving the terminal, while staying 100% DS-compliant (bound variables, real components, no hardcoded values).

## Why

Design system adoption keeps breaking when designers prototype outside the system. The usual loop:

1. Designer writes a spec or wireframe
2. Designer pulls components from Figma, but eyeballs values when in doubt
3. Tokens drift, hex values get pasted in, the DS slowly erodes

This workflow forces every visual decision to flow through the registries built from your DS, so the output is always DS-native by construction.

## Workflow

```
setup (once)  →  spec {name}  →  design  →  review  →  done
```

| Command | Purpose |
|---------|---------|
| `setup` | Extract your Figma DS into a local knowledge base (components, tokens, text styles, assets) |
| `spec {name}` | Write a component or screen specification, validated against your DS |
| `design` | Generate the Figma design from the active spec via MCP |
| `review` | Validate the generated design against spec, tokens, and visual fidelity |
| `done` | Archive the spec and close |
| `drop` | Abandon with preserved learnings |

## Requirements

- [Claude Code](https://claude.com/claude-code) (CLI)
- [bridge-ds](https://github.com/noemuch/bridge-ds) — the underlying design generation framework
- [figma-console-mcp](https://github.com/southleft/figma-console-mcp) — MCP transport between Claude Code and Figma Desktop
- Figma Desktop (the MCP talks to the Desktop app, not the web app)

## Setup

1. Clone this repo into your working directory:
   ```bash
   git clone https://github.com/chloemaillot/spectra-tools.git
   cd spectra-tools
   ```

2. Install `bridge-ds` and `figma-console-mcp` per their docs.

3. Open the directory in Claude Code:
   ```bash
   claude
   ```

4. Run `setup` to extract your design system into the local knowledge base:
   ```
   /design-workflow setup
   ```

The setup step will read your Figma library and populate:
- `references/knowledge-base/registries/*.json` — component, variable, and text-style registries
- `references/knowledge-base/guides/*.md` — Claude-generated guides (color usage, typography, components)

Both are **gitignored** so each user has their own DS knowledge base.

## Repo structure

```
.claude/
├── commands/
│   └── design-workflow.md       # Slash command entry point
└── skills/
    └── design-workflow/
        ├── SKILL.md             # Top-level skill
        └── references/
            ├── actions/         # Per-command action prompts
            ├── figma-api-rules.md
            ├── onboarding.md    # Setup procedure
            ├── quality-gates.md # Validation gates
            └── knowledge-base/  # DS-specific data (gitignored)
specs/                           # Working specs (gitignored)
scripts/
└── build-registry.js            # Helper to rebuild components.json from Figma API dumps
```

## Helper script

`scripts/build-registry.js` rebuilds the components registry from raw Figma MCP tool-result files. Useful when your DS evolves.

```bash
FIGMA_FILE_KEY=<your-library-key> \
TOOL_RESULTS_DIR=<path-to-mcp-tool-results> \
node scripts/build-registry.js
```

## Philosophy

1. **Spec-first** — No design without a validated specification
2. **Figma is the output** — Everything ends as native Figma layers with bound variables
3. **DS-native** — Every visual element uses design system tokens and components, never hardcoded
4. **Composability over configuration** — Simple building blocks beat mega-components
5. **Iterative** — Design → review → refine until right
6. **Atomic** — Small sequential scripts (~30–80 lines) with visual verification between each step

## License

MIT
