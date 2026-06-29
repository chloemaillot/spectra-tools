# Bridge DS — Claude Code Instructions

## What is this repo?
AI-powered design generation in Figma via Claude Code, 100% design system compliant.
Powered by [bridge-ds](https://github.com/noemuch/bridge-ds) + [figma-console-mcp](https://github.com/southleft/figma-console-mcp).

## Core philosophy
- **Spec-first** — No design without a validated specification
- **Figma is the output** — Everything ends as native Figma layers with bound variables
- **DS-native** — Every visual element uses design system tokens and components, never hardcoded
- **Atomic generation** — Small sequential scripts (~30-80 lines) with screenshot verification between each step

## Available skill
- `/design-workflow` — Full workflow: setup → spec → design → review → done

## Workflow
```
setup (once) → spec {name} → design → review → done
```

## Key rules
1. Always run `setup` first to build the knowledge base from your Figma DS
2. Always load registries before generating any Figma script
3. Use `setBoundVariableForPaint` for color bindings, `setBoundVariable` for float bindings
4. Use `importComponentByKeyAsync` for all DS components
5. Screenshots are COMPOSITION references only — never extract colors or spacing from them
6. Only one active spec at a time in `specs/active/`
7. Always read `references/figma-api-rules.md` before writing any Figma script

## Transport
```
Claude Code ──MCP──> figma-console-mcp ──WebSocket──> Figma Desktop
```
No local server needed. MCP configured in `~/.claude.json`.

## Project structure
```
.claude/skills/design-workflow/   # Bridge DS skill (installed by bridge-ds init)
.claude/commands/                 # Slash commands
specs/                            # Working specs (gitignored)
```
