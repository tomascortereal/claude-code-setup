# Claude Code Setup

My full Claude Code configuration — agents, skills, hooks, plugins, and global instructions.

## How It Works

```
 YOU  -->  prompt  -->  CLAUDE CODE CLI
+------------------------------------------------------------------+
|                                                                   |
|  CLAUDE.md ("the brain")          settings.json (config)          |
|  14 auto-decision rules           model, plugins, hooks,         |
|  that pick the right tools         env vars, telemetry            |
|                                                                   |
|  Rules auto-select the right combination of tools for the task   |
|           |                                                       |
|           v                                                       |
|  +--------------------------------------------------------+      |
|  |  Skills (100)    Agents (25)    Plugins (17)            |      |
|  |  /slash cmds     spawned        MCP servers:            |      |
|  |  for workflows   workers for    Serena, Context7,       |      |
|  |  (TDD, debug,    parallel       Playwright, Supabase,   |      |
|  |   planning...)   tasks          claude-mem, ...         |      |
|  +--------------------------------------------------------+      |
|           |                                                       |
|  +--------------------------------------------------------+      |
|  |  Hooks: security scan before edits, context monitoring  |      |
|  |  Memory: your preferences + dev profile (global)        |      |
|  +--------------------------------------------------------+      |
+------------------------------------------------------------------+
```

For the full visual walkthrough with component details, see [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md).

## What's Included

| Component | Count | Description |
|-----------|-------|-------------|
| **CLAUDE.md** | 1 | Global instructions (15 sections, 14 auto-decision rules) |
| **Agents** | 21 | Specialized agent definitions (GSD framework) |
| **Standalone Skills** | 61 | Slash commands (59 GSD + 2 other) |
| **Plugin Skills** | 32 | Skills bundled inside 5 plugins |
| **Plugin Commands** | 7 | Commands bundled inside 3 plugins |
| **Plugin Agents** | 4 | Agent definitions bundled inside 3 plugins |
| **Total Slash Commands** | **100** | All available slash commands (61 + 32 + 7) |
| **Hooks** | 8 | Lifecycle automation (SessionStart, PreToolUse, PostToolUse) |
| **Plugins** | 17 installed (16 enabled) | Installed via the install script |

## Quick Install

```bash
git clone https://github.com/tomascortereal/claude-code-setup.git
cd claude-code-setup
./install.sh
```

Then edit `~/.claude/settings.json` to fill in your personal values (API URL, OTEL endpoint, etc.).

## Plugins

### Official (claude-plugins-official) — 11 plugins
| Plugin | Description |
|--------|-------------|
| **serena** | Semantic code navigation (LSP-based symbols, references, edits) |
| **context7** | Live library/framework documentation |
| **playwright** | Browser automation (navigate, click, screenshot, snapshot) |
| **superpowers** (v5.0.7) | Brainstorming, TDD, debugging, parallel agents, code review, plans (14 skills) |
| **code-simplifier** | Code quality review agent |
| **ralph-loop** | Recurring task loops |
| **typescript-lsp** | TypeScript language server |
| **pyright-lsp** | Python language server |
| **supabase** | Database/auth/storage/edge functions |
| **agent-sdk-dev** | Claude Agent SDK scaffolding |
| **claude-code-setup** | Automation recommender |
| **greptile** | Codebase intelligence (disabled by default) |

### Third-Party — 3 plugins
| Plugin | Source | Description |
|--------|--------|-------------|
| **ui-ux-pro-max** (v2.0.1) | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | 50+ styles, 161 palettes, 99 UX guidelines (7 skills) |
| **claude-mem** (v10.5.5) | [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | Persistent cross-session memory (4 skills) |
| **arize-skills** (v0.1.0) | [Arize-ai/arize-skills](https://github.com/Arize-ai/arize-skills) | LLM observability, tracing, experiments (6 skills) |

### LSPs ([Piebald-AI/claude-code-lsps](https://github.com/Piebald-AI/claude-code-lsps)) — 3 plugins
| Plugin | Description |
|--------|-------------|
| **pyright** (v0.1.0) | Python type checking |
| **basedpyright** (v0.1.0) | Enhanced Python type checking |
| **vtsls** (v0.1.0) | TypeScript/JavaScript (disabled by default) |

## How It Works

See [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) for a visual walkthrough of how all the pieces fit together — with diagrams showing the request flow, component breakdown, and how tools get selected automatically.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full directory tree, model config, hook details, and exact counts.

## Hooks

8 hook files, 6 wired in `settings.json`:

| Hook | Trigger | What it does |
|------|---------|-------------|
| `global-memory-symlink.sh` | SessionStart | Ensures all project memory dirs symlink to global `~/.claude/memory/` |
| `gsd-check-update.js` | SessionStart | Checks for GSD framework updates |
| `integration-sync.js` | SessionStart | Syncs plugin/MCP integrations |
| `gsd-context-monitor.js` | PostToolUse (Bash\|Edit\|Write\|Agent\|Task) | Monitors context window usage |
| `gsd-prompt-guard.js` | PreToolUse (Write\|Edit) | Guards against prompt injection |
| `gsd-read-guard.js` | PreToolUse (Write\|Edit) | Validates reads before edits |
| `gsd-workflow-guard.js` | _(not wired)_ | Workflow validation (available but not active) |
| `gsd-statusline.js` | _(not wired as hook)_ | Used by statusLine config, not a lifecycle hook |

## Global Memory

Memory is **global** (shared across all projects), not project-scoped. The `global-memory-symlink.sh` hook runs on every session start to ensure new projects automatically use the shared memory at `~/.claude/memory/`.

## Customization

After installing, you'll want to:

1. **`settings.json`** — Set your `ANTHROPIC_BASE_URL`, OTEL endpoint, and resource attributes
2. **`CLAUDE.md`** — Adjust the decision rules and tool preferences to match your workflow
3. **`memory/`** — Add your own memory files (communication preferences, dev profile, etc.)

See [docs/CUSTOMIZATION.md](docs/CUSTOMIZATION.md) for detailed guidance.

## Requirements

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed
- Node.js 18+
- Git
