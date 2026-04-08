# Architecture

## Directory Structure (after install)

```
~/.claude/
├── CLAUDE.md                    # Global instructions ("the brain" — 299 lines)
├── settings.json                # Main config (model, hooks, plugins, env vars)
├── settings.local.json          # Local overrides (permissions — not tracked)
├── .credentials.json            # Auth credentials (not tracked)
├── .env                         # Environment variables (not tracked)
├── package.json                 # Node dependencies
├── statusline.js                # Custom status line (Node.js — model, git, context bar)
├── statusline.sh                # Custom status line (Bash fallback)
│
├── memory/                      # GLOBAL memory (shared across ALL projects)
│   └── MEMORY.md               # Index file (always loaded into context)
│
├── agents/                      # 21 custom agent definitions (all GSD framework)
│   └── gsd-*.md
│
├── skills/                      # 61 standalone slash commands (59 GSD + 2 other)
│   ├── gsd-*/SKILL.md
│   └── sync/SKILL.md
│
├── hooks/                       # 8 hook files (6 wired in settings.json)
│   ├── global-memory-symlink.sh # SessionStart: global memory symlinks
│   ├── gsd-check-update.js      # SessionStart: GSD update check
│   ├── integration-sync.js      # SessionStart: integration sync
│   ├── gsd-context-monitor.js   # PostToolUse: context monitoring
│   ├── gsd-prompt-guard.js      # PreToolUse (Write|Edit): prompt guard
│   ├── gsd-read-guard.js        # PreToolUse (Write|Edit): read guard
│   ├── gsd-workflow-guard.js    # NOT wired — available but inactive
│   └── gsd-statusline.js        # NOT a hook — used by statusLine config
│
├── plugins/                     # 17 installed, 16 enabled (~598 MB)
├── get-shit-done/               # GSD framework v1.32.0 (self-installs)
│   ├── VERSION                  # 1.32.0
│   ├── bin/gsd-tools.cjs        # CLI tool + lib/
│   ├── references/              # 20 reference documents
│   ├── templates/               # 41 template files
│   └── workflows/               # 52 workflow definitions
│
├── projects/                    # Per-project configs (memory/ → symlink to global)
├── sessions/                    # Session data
├── session-env/                 # Session environment snapshots
├── commands/                    # Custom commands (empty)
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
| Prompt caching | Enabled (`DISABLE_PROMPT_CACHING=0`) |
| Agent teams | Enabled (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`) |
| Experimental betas | Disabled (`CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1`) |
| Telemetry | Enabled (`CLAUDE_CODE_ENABLE_TELEMETRY=1`) |
| Bedrock | Disabled (`CLAUDE_CODE_USE_BEDROCK=0`) |

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

## Auto-Decision Rules (14 rules)

1. Bug reported → Serena + claude-mem + systematic-debugging BEFORE responding
2. "How do I..." → Context7 + Serena + claude-mem
3. URL shared → Playwright automatically
4. Starting non-trivial task → check superpowers skills (brainstorming, debugging, TDD)
5. Code changes → Serena `find_referencing_symbols` to check impact + code-simplifier after
6. Completing work → verification-before-completion + code-reviewer agent
7. Multiple independent tasks → dispatching-parallel-agents or Agent Teams
8. User references past work → claude-mem search
9. Frontend/UI work → ui-ux-pro-max skill
10. Complex multi-step project → GSD skills for phased management
11. External library → Context7 always
12. After writing significant code → spawn code-simplifier agent
13. LLM observability/tracing → Arize skills
14. Task has 2+ independent pieces → proactively suggest Agent Teams

## Hook Execution Order

### SessionStart (3 hooks)
1. `global-memory-symlink.sh` — ensure global memory symlinks (timeout: 5s)
2. `gsd-check-update.js` — check for GSD updates (timeout: 15s)
3. `integration-sync.js` — sync integrations (timeout: 15s)

### PreToolUse — Write|Edit (2 hooks)
1. `gsd-prompt-guard.js` — prompt injection guard (timeout: 5s)
2. `gsd-read-guard.js` — read validation guard (timeout: 5s)

Note: You can optionally add a code scanner hook here (e.g., for compliance scanning). See [CUSTOMIZATION.md](CUSTOMIZATION.md).

### PostToolUse — Bash|Edit|Write|MultiEdit|Agent|Task (1 hook)
1. `gsd-context-monitor.js` — context window monitoring (timeout: 10s)

### Not Wired (2 files exist but are not active hooks)
- `gsd-workflow-guard.js` — available for workflow validation if needed
- `gsd-statusline.js` — used by the `statusLine` config, not a lifecycle hook

## Skills Breakdown

| Source | Type | Count | Details |
|--------|------|-------|---------|
| Standalone (GSD) | skills | 59 | `/gsd-new-project`, `/gsd-execute-phase`, `/gsd-debug`, etc. |
| Standalone (other) | skills | 2 | `/sync`, `/gsd-workstreams` |
| Superpowers plugin | skills | 14 | brainstorming, TDD, debugging, code review, plans, worktrees |
| Superpowers plugin | commands | 3 | brainstorm, execute-plan, write-plan (aliases) |
| Superpowers plugin | agents | 1 | code-reviewer |
| UI/UX Pro Max plugin | skills | 7 | design, brand, slides, styling, design-system |
| Arize Skills plugin | skills | 6 | trace, experiment, instrumentation, dataset, prompt-optimization |
| Claude-mem plugin | skills | 4 | do, make-plan, mem-search, smart-explore |
| Claude Code Setup plugin | skills | 1 | claude-automation-recommender |
| Ralph Loop plugin | commands | 3 | ralph-loop, cancel-ralph, help |
| Agent SDK Dev plugin | commands | 1 | new-sdk-app |
| Agent SDK Dev plugin | agents | 2 | agent-sdk-verifier-ts, agent-sdk-verifier-py |
| Code Simplifier plugin | agents | 1 | code-simplifier |
| **Total slash commands** | | **100** | 61 standalone + 32 plugin skills + 7 plugin commands |
| **Total plugin agents** | | **4** | code-reviewer, code-simplifier, verifier-ts, verifier-py |

## Global Memory System

All project `memory/` directories are symlinks to `~/.claude/memory/`. The `global-memory-symlink.sh` hook runs on every session start and replaces any real `memory/` directories with symlinks, so new projects are automatically covered.

## Disk Usage

| Component | Size | % of total |
|-----------|------|------------|
| plugins/ | ~598 MB | 72% |
| projects/ | ~110 MB | 13% |
| telemetry/ | ~4 MB | <1% |
| get-shit-done/ | ~2 MB | <1% |
| Everything else | ~16 MB | 2% |
| **Total** | **~830 MB** | |
