# Claude Code Setup

My full Claude Code configuration — agents, skills, hooks, plugins, and global instructions.

## What's Included

| Component | Count | Description |
|-----------|-------|-------------|
| **CLAUDE.md** | 1 | Global instructions (15 sections, 14 auto-decision rules) |
| **Agents** | 21 | Specialized agent definitions (GSD framework) |
| **Skills** | 61 | Standalone slash commands |
| **Plugin Skills** | 33 + 7 commands | Skills bundled inside plugins |
| **Hooks** | 8 | Lifecycle automation (SessionStart, PreToolUse, PostToolUse) |
| **Plugins** | 16 | Installed via the install script |

## Quick Install

```bash
git clone https://github.com/tomascortereal/claude-code-setup.git
cd claude-code-setup
./install.sh
```

Then edit `~/.claude/settings.json` to fill in your personal values (API URL, OTEL endpoint, etc.).

## Plugins

### Official (claude-plugins-official)
- **serena** — semantic code navigation (LSP-based)
- **context7** — live library/framework documentation
- **playwright** — browser automation
- **superpowers** — brainstorming, TDD, debugging, parallel agents, code review, plans
- **code-simplifier** — code quality review
- **ralph-loop** — recurring task loops
- **typescript-lsp** / **pyright-lsp** — language servers
- **supabase** — database/auth/storage
- **agent-sdk-dev** — Claude Agent SDK scaffolding
- **claude-code-setup** — automation recommender

### Third-Party
- **ui-ux-pro-max** ([nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)) — 50+ styles, 161 palettes, 99 UX guidelines
- **claude-mem** ([thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)) — persistent cross-session memory
- **arize-skills** ([Arize-ai/arize-skills](https://github.com/Arize-ai/arize-skills)) — LLM observability, tracing, experiments

### LSPs (claude-code-lsps)
- **pyright** / **basedpyright** — Python type checking

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full directory tree, model config, hook details, and how everything fits together.

## Hooks

| Hook | Trigger | What it does |
|------|---------|-------------|
| `global-memory-symlink.sh` | SessionStart | Ensures all project memory dirs symlink to global `~/.claude/memory/` |
| `gsd-check-update.js` | SessionStart | Checks for GSD framework updates |
| `integration-sync.js` | SessionStart | Syncs plugin/MCP integrations |
| `gsd-context-monitor.js` | PostToolUse | Monitors context window usage |
| `gsd-prompt-guard.js` | PreToolUse (Write\|Edit) | Guards against prompt injection |
| `gsd-read-guard.js` | PreToolUse (Write\|Edit) | Validates reads before edits |
| `gsd-workflow-guard.js` | PreToolUse | Workflow validation |
| `gsd-statusline.js` | — | Status line updates |

## Global Memory

Memory is **global** (shared across all projects), not project-scoped. The `global-memory-symlink.sh` hook runs on every session start to ensure new projects automatically use the shared memory at `~/.claude/memory/`.

## Customization

After installing, you'll want to:

1. **`settings.json`** — Set your `ANTHROPIC_BASE_URL`, OTEL endpoint, and resource attributes
2. **`CLAUDE.md`** — Adjust the decision rules and tool preferences to match your workflow
3. **`memory/`** — Add your own memory files (communication preferences, dev profile, etc.)

## Requirements

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed
- Node.js 18+
- Git
