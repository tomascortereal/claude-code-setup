# Architecture

## Directory Structure (after install)

```
~/.claude/
├── CLAUDE.md                    # Global instructions ("the brain" — 299 lines)
├── settings.json                # Main config (model, hooks, plugins, env vars)
├── settings.local.json          # Local overrides (permissions — not tracked)
│
├── memory/                      # GLOBAL memory (shared across ALL projects)
│   └── MEMORY.md               # Index file (always loaded into context)
│
├── agents/                      # 21 custom agent definitions
│   └── gsd-*.md
│
├── skills/                      # 61 standalone slash commands
│   └── gsd-*/SKILL.md
│
├── hooks/                       # 8 lifecycle hooks
│   ├── global-memory-symlink.sh # SessionStart: global memory symlinks
│   ├── gsd-check-update.js      # SessionStart: GSD update check
│   ├── integration-sync.js      # SessionStart: integration sync
│   ├── gsd-context-monitor.js   # PostToolUse: context monitoring
│   ├── gsd-prompt-guard.js      # PreToolUse: prompt guard
│   ├── gsd-read-guard.js        # PreToolUse: read guard
│   ├── gsd-workflow-guard.js    # PreToolUse: workflow guard
│   └── gsd-statusline.js        # Status line
│
├── plugins/                     # 16 enabled plugins (~595 MB, installed by script)
├── get-shit-done/               # GSD framework (v1.32.0, self-installs)
├── statusline.js / .sh          # Custom status line
│
├── projects/                    # Per-project configs (memory/ → symlink to global)
├── sessions/                    # Session data
├── session-env/                 # Session environment snapshots
├── tasks/ / teams/ / todos/     # Agent team runtime state
└── debug/ / telemetry/ / cache/ # Logs and temp files
```

## Model Configuration

| Setting | Value |
|---------|-------|
| Default model | `claude-opus-4-6@default` |
| Opus | `claude-opus-4-6@default` |
| Sonnet | `claude-sonnet-4-6@default` |
| Haiku | `claude-haiku-4-5-20251001` |
| Always thinking | Enabled |
| Prompt caching | Enabled |
| Agent teams | Enabled (experimental) |

## CLAUDE.md — 15 Sections

| # | Section | Tools/Skills |
|---|---------|-------------|
| 1 | Code Understanding | Serena, Greptile, LSPs, claude-mem smart-explore |
| 2 | Library Docs | Context7 (always for external libs) |
| 3 | Browser & Web | Playwright (auto-trigger on URLs) |
| 4 | Debugging | systematic-debugging, gsd:debug |
| 5 | Planning | brainstorming, writing-plans, claude-mem:make-plan, GSD |
| 6 | Implementation | TDD, executing-plans, claude-mem:do, subagent-driven-dev, GSD |
| 7 | Code Quality | code-simplifier, code-reviewer, verification-before-completion |
| 8 | UI/UX | UI/UX Pro Max |
| 9 | Memory | claude-mem, auto-memory (global) |
| 10 | Parallel Work | Agent teams, parallel agents, worktrees |
| 11 | Recurring Tasks | Ralph Loop |
| 12 | Project Management | GSD full lifecycle |
| 13 | Configuration | update-config, automation-recommender |
| 14 | Specialized | Claude API, Agent SDK, Supabase, Arize |
| 15 | Ruflo | Agent orchestration, neural, coordination |

## Auto-Decision Rules

1. Bug reported → Serena + claude-mem + systematic-debugging BEFORE responding
2. "How do I..." → Context7 + Serena + claude-mem
3. URL shared → Playwright automatically
4. Code changes → check references + code-simplifier after
5. 2+ independent tasks → suggest Agent Teams proactively
6. External library → Context7 always
7. LLM observability → Arize skills
8. Completing work → verification + code-reviewer

## Hook Execution Order

### SessionStart
1. `global-memory-symlink.sh` — ensure global memory (fastest, runs first)
2. `gsd-check-update.js` — check for GSD updates
3. `integration-sync.js` — sync integrations

### PreToolUse (Write|Edit)
1. `gsd-prompt-guard.js` — prompt injection guard
2. `gsd-read-guard.js` — read validation guard

### PostToolUse (Bash|Edit|Write|Agent|Task)
1. `gsd-context-monitor.js` — context window monitoring

## Global Memory System

All project `memory/` directories are symlinks to `~/.claude/memory/`. The `global-memory-symlink.sh` hook runs on every session start and replaces any real `memory/` directories with symlinks, so new projects are automatically covered.
