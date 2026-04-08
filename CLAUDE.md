# Global Instructions

## Auto-Use Integrations

CRITICAL: You have many plugins, MCP servers, skills, agent types, and teams installed. DO NOT wait for the user to mention them. Automatically use the right integration for the task at hand. Think of yourself as an orchestrator with a full toolkit — pick the best tool BEFORE the user has to tell you.

---

## 1. Code Understanding & Navigation

### Serena (MCP — semantic code tools)
USE WHEN: understanding code structure, finding definitions, tracing references, navigating architecture
- `get_symbols_overview` — scan a file's classes/functions/methods without reading the whole file
- `find_symbol` — locate a symbol by name with optional body inclusion
- `find_referencing_symbols` — find all callers/usages of a symbol (ALWAYS do this before refactoring)
- `search_for_pattern` — fast regex search across the codebase
- `replace_symbol_body`, `insert_before_symbol`, `insert_after_symbol` — precise symbolic edits
- PREFER Serena's symbolic tools over reading entire files. Get overview first, drill into specifics.

### Greptile (plugin — codebase intelligence)
USE WHEN: you need high-level codebase understanding, semantic code search beyond simple grep
- Good for "how does X work in this codebase" type questions

### LSPs: Pyright / BasedPyright / TypeScript LSP (plugins)
USE WHEN: type checking, go-to-definition, completions, diagnostics for Python or TypeScript code
- These run automatically in background — use LSP tool for hover info, diagnostics, references

### Claude-mem Smart Explore (skill: `claude-mem:smart-explore`)
USE WHEN: you need token-efficient structural code exploration using AST parsing
- Better than reading full files when you just need to understand code structure

---

## 2. Library & Framework Documentation

### Context7 (MCP — live documentation)
USE WHEN: working with ANY external library, framework, or package
- Step 1: `resolve-library-id` to find the library
- Step 2: `query-docs` to get current API docs and examples
- Do this PROACTIVELY when you see unfamiliar imports or need API details
- Always prefer this over guessing API signatures from training data

---

## 3. Browser & Web

### Playwright (MCP — browser automation)
USE WHEN: user shares a URL, testing web UIs, taking screenshots, web research, form filling
- `browser_navigate` → go to a URL
- `browser_snapshot` → get page accessibility tree (better than screenshot for understanding)
- `browser_take_screenshot` → visual capture
- `browser_click`, `browser_fill_form`, `browser_type` → interact with pages
- Use this automatically when the user pastes a URL or asks about a web page

---

## 4. Debugging & Problem Solving

### Systematic Debugging (skill: `superpowers:systematic-debugging`)
USE WHEN: any bug, test failure, unexpected behavior — BEFORE proposing fixes
- Provides structured investigation methodology
- Combine with Serena for code navigation and Context7 for library behavior

### GSD Debug (skill: `gsd:debug`)
USE WHEN: complex bugs needing persistent debug state across context resets
- Scientific method approach with checkpoints

---

## 5. Planning & Design

### Brainstorming (skill: `superpowers:brainstorming`)
USE WHEN: creating features, building components, adding functionality, modifying behavior — ANY creative work
- MUST be invoked BEFORE implementation

### Writing Plans (skill: `superpowers:writing-plans`)
USE WHEN: you have a spec or requirements for a multi-step task, before touching code

### Claude-mem Make Plan (skill: `claude-mem:make-plan`)
USE WHEN: creating detailed phased implementation plans with documentation discovery

### GSD Planning (skills: `gsd:discuss-phase`, `gsd:plan-phase`, `gsd:research-phase`)
USE WHEN: phased project execution — discuss requirements, research approach, create detailed plans

---

## 6. Implementation & Execution

### Test-Driven Development (skill: `superpowers:test-driven-development`)
USE WHEN: implementing ANY feature or bugfix — write tests first, then implementation

### Executing Plans (skill: `superpowers:executing-plans`)
USE WHEN: you have a written implementation plan to execute with review checkpoints

### Claude-mem Do (skill: `claude-mem:do`)
USE WHEN: executing a phased implementation plan using subagents

### Subagent-Driven Development (skill: `superpowers:subagent-driven-development`)
USE WHEN: executing implementation plans with independent tasks in the current session

### GSD Execute (skill: `gsd:execute-phase`)
USE WHEN: executing all plans in a GSD phase with wave-based parallelization

### GSD Quick (skill: `gsd:quick`)
USE WHEN: quick tasks that still need atomic commits and state tracking but skip optional agents

---

## 7. Code Quality & Review

### Code Simplifier (plugin + agent: `code-simplifier:code-simplifier`)
USE WHEN: reviewing changed code for reuse opportunities, quality issues, efficiency
- Invoke skill `simplify` after making code changes
- Or spawn agent with `subagent_type: "code-simplifier:code-simplifier"` for autonomous review
- Focuses on recently modified code — catches over-engineering, duplication, dead code

### Code Reviewer (agent: `superpowers:code-reviewer`)
USE WHEN: a major project step has been completed — reviews against plan and coding standards
- Spawn as agent after completing a logical chunk of work

### Requesting Code Review (skill: `superpowers:requesting-code-review`)
USE WHEN: completing tasks, implementing major features, or before merging

### Receiving Code Review (skill: `superpowers:receiving-code-review`)
USE WHEN: getting feedback — requires technical rigor, not blind agreement

### Verification Before Completion (skill: `superpowers:verification-before-completion`)
USE WHEN: about to claim work is complete — run verification commands, confirm output BEFORE success claims

---

## 8. UI/UX Design & Frontend

### UI/UX Pro Max (skill: `ui-ux-pro-max:ui-ux-pro-max`)
USE WHEN: ANY frontend/UI work — design, build, review, fix, improve, optimize
- 50+ styles, 161 color palettes, 57 font pairings, 99 UX guidelines
- Supports React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui, HTML/CSS
- Use for: buttons, modals, navbars, cards, tables, forms, charts, dashboards, landing pages

### GSD UI Phase (skill: `gsd:ui-phase`)
USE WHEN: generating UI design contracts (UI-SPEC.md) for frontend phases

### GSD UI Review (skill: `gsd:ui-review`)
USE WHEN: retroactive visual audit of implemented frontend code (6-pillar scoring)

---

## 9. Memory & Cross-Session Context

### Claude-mem (plugin — persistent memory)
USE WHEN: referencing past work, checking if something was solved before, or when context seems missing
- Skill `claude-mem:mem-search` — search previous session memories
- MCP tools: `smart_search`, `search`, `timeline`, `smart_outline`, `smart_unfold`
- PROACTIVELY search when the user says "remember when...", "last time...", "we already did..."

### Auto Memory (built-in)
- Check `$HOME/.claude/projects/*/memory/` for project-specific memory
- Update memory files when learning stable patterns or preferences

---

## 10. Parallel Work & Agent Teams

### Dispatching Parallel Agents (skill: `superpowers:dispatching-parallel-agents`)
USE WHEN: facing 2+ independent tasks that can run without shared state

### Agent Teams (TeamCreate + Agent tool with team_name)
USE WHEN: complex coordinated work needing multiple agents with different roles
- PROACTIVELY SUGGEST agent teams when you detect a task has 2+ independent pieces that could run in parallel
- Don't wait for the user to ask — if a team would be faster, propose it with a quick explanation of why and how you'd split the work
- Create team → Create tasks → Spawn teammates → Assign tasks → Coordinate
- Use `subagent_type` to pick the right agent: Explore (read-only research), Plan (architecture), general-purpose (full capability), code-simplifier, code-reviewer
- Teammates communicate via SendMessage and share task lists
- Use for: full-stack features, large refactors, multi-component changes, research + implement combos

### Agent Types (spawn with Agent tool)
- `Explore` — fast read-only codebase exploration
- `Plan` — software architect for implementation strategy
- `general-purpose` — full capability agent for any task
- `code-simplifier:code-simplifier` — code quality review
- `superpowers:code-reviewer` — reviews against plan and standards
- `claude-code-guide` — answers questions about Claude Code itself
- `gsd-executor` — executes GSD plans with atomic commits
- `gsd-debugger` — investigates bugs with scientific method
- `gsd-phase-researcher` — researches implementation approaches
- `gsd-planner` — creates executable phase plans

### Git Worktrees (skill: `superpowers:using-git-worktrees`)
USE WHEN: feature work needs isolation from current workspace
- Also available: `EnterWorktree` / `ExitWorktree` tools for session-level isolation

---

## 11. Recurring Tasks & Monitoring

### Ralph Loop (skills: `ralph-loop:ralph-loop`, `ralph-loop:cancel-ralph`)
USE WHEN: user wants something to run on a recurring interval — polling, monitoring, repeated checks
- Example: "check the deploy every 5 minutes", "keep running tests"

### Loop (skill: `loop`)
USE WHEN: running a prompt or slash command on a recurring interval

---

## 12. Project Management

### GSD (Get Stuff Done — full project lifecycle)
USE WHEN: managing multi-phase projects, tracking progress, phased execution
- `gsd:progress` — check project progress and route to next action
- `gsd:new-project` — initialize new project with deep context gathering
- `gsd:plan-phase` — create detailed phase plans
- `gsd:execute-phase` — execute plans with wave-based parallelization
- `gsd:autonomous` — run all remaining phases autonomously
- `gsd:stats` — project statistics
- `gsd:verify-work` — validate built features through UAT
- `gsd:add-todo`, `gsd:check-todos` — todo management
- `gsd:note` — zero-friction idea capture
- `gsd:pause-work` / `gsd:resume-work` — session handoff
- `gsd:map-codebase` — analyze codebase with parallel mapper agents

---

## 13. Configuration & Setup

### Update Config (skill: `update-config`)
USE WHEN: user wants to configure Claude Code settings, hooks, permissions, env vars
- Use for: "allow X", "add permission", "set up a hook", automated behaviors

### Claude Automation Recommender (skill: `claude-code-setup:claude-automation-recommender`)
USE WHEN: user asks how to optimize their Claude Code setup, wants automation recommendations

### Claude Code Guide (agent: `claude-code-guide`)
USE WHEN: user asks "Can Claude...", "Does Claude...", "How do I..." about Claude Code features

---

## 14. Specialized

### Claude API (skill: `claude-api`)
USE WHEN: building apps with Claude API or Anthropic SDK — code imports `anthropic` or `@anthropic-ai/sdk`

### Agent SDK Dev (skill: `agent-sdk-dev:new-sdk-app`)
USE WHEN: creating new Claude Agent SDK applications
- Verifier agents: `agent-sdk-dev:agent-sdk-verifier-ts`, `agent-sdk-dev:agent-sdk-verifier-py`

### Supabase (plugin)
USE WHEN: working with Supabase — database, auth, storage, edge functions

### Arize Skills (plugin: `arize-skills@Arize-ai-arize-skills`)
USE WHEN: LLM observability, tracing, experiments, prompt optimization — anything related to monitoring/debugging LLM apps in production
- Skills: `arize-trace` — export and debug traces/spans by ID or session
- Skills: `arize-instrumentation` — add Arize AX tracing to an app (two-phase: analyze codebase, then instrument)
- Skills: `arize-dataset` — create/manage/download datasets and examples
- Skills: `arize-experiment` — run experiments against datasets
- Skills: `arize-prompt-optimization` — optimize prompts using trace data and meta-prompting
- Skills: `arize-link` — generate deep links to Arize UI
- Requires: `ax` CLI + `ARIZE_API_KEY` and `ARIZE_SPACE_ID` env vars

### Finishing a Branch (skill: `superpowers:finishing-a-development-branch`)
USE WHEN: implementation is complete, tests pass, deciding how to integrate (merge, PR, cleanup)

### Writing Skills (skill: `superpowers:writing-skills`)
USE WHEN: creating or editing Claude Code skills

---

## 15. Ruflo MCP Server (advanced orchestration)

Ruflo provides agent orchestration, memory, workflows, browser, analysis, coordination, and neural tools.
USE WHEN: you need capabilities beyond what other tools provide:
- `agent_spawn`, `agent_pool` — agent management
- `memory_store`, `memory_retrieve`, `memory_search` — persistent memory
- `workflow_create`, `workflow_execute` — workflow automation
- `browser_*` — alternative browser automation
- `analyze_diff`, `analyze_file-risk` — code analysis
- `embeddings_*` — vector embeddings and similarity search
- `neural_*` — pattern detection and prediction
- `coordination_*` — multi-agent coordination
- `task_*` — task management

---

## Decision Rules (follow these automatically)

1. **User reports a problem** → Serena (code context) + claude-mem (past issues) + systematic-debugging skill BEFORE responding
2. **User asks "how do I..."** → Context7 (library docs) + Serena (existing patterns) + claude-mem (past solutions)
3. **User shares a URL** → Playwright to browse it
4. **Starting any non-trivial task** → check superpowers skills (brainstorming, debugging, TDD)
5. **Making code changes** → Serena's `find_referencing_symbols` to check impact + code-simplifier after
6. **Completing work** → verification-before-completion skill + code-reviewer agent
7. **Multiple independent tasks** → dispatching-parallel-agents or Agent Teams
8. **User references past work** → claude-mem search
9. **Frontend/UI work** → ui-ux-pro-max skill
10. **Complex multi-step project** → GSD skills for phased management
11. **External library usage** → Context7 for docs, ALWAYS
12. **After writing significant code** → spawn code-simplifier agent to review
13. **LLM app observability/tracing/debugging** → Arize skills (trace, experiment, prompt-optimization)
14. **Task has 2+ independent pieces** → PROACTIVELY suggest Agent Teams, explain the split and why it's faster

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
