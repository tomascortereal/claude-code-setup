# How It All Works

## The Big Picture

```
 YOU
  |
  |  "fix the login bug"
  v
+------------------------------------------------------------------+
|                        CLAUDE CODE CLI                            |
|                                                                   |
|  +------------------+    +------------------------------------+   |
|  |    CLAUDE.md     |    |          settings.json             |   |
|  |   ("the brain")  |    |   model, env vars, hooks config,  |   |
|  |                  |    |   plugins, statusline, telemetry   |   |
|  |  15 sections of  |    +------------------------------------+   |
|  |  auto-decision   |                                             |
|  |  rules that tell |    +------------------------------------+   |
|  |  Claude WHAT to  |    |       settings.local.json          |   |
|  |  use and WHEN    |    |   permissions (allow-list rules)   |   |
|  +------------------+    +------------------------------------+   |
|           |                                                       |
|           | "bug reported? use Serena + debugging skill"          |
|           v                                                       |
|  +--------------------------------------------------------+      |
|  |              TOOL SELECTION (automatic)                 |      |
|  |                                                         |      |
|  |  The 14 decision rules in CLAUDE.md tell Claude which   |      |
|  |  combination of tools to use based on what you asked.   |      |
|  |  You don't pick tools — Claude picks them for you.      |      |
|  +--------------------------------------------------------+      |
|           |                                                       |
|           v                                                       |
|  +--------------------------------------------------------+      |
|  |                    EXECUTION LAYER                      |      |
|  |                                                         |      |
|  |  Skills (/slash commands)  ----+                        |      |
|  |  Agents (spawned workers)  ----+----> do the work       |      |
|  |  Plugins (MCP servers)     ----+                        |      |
|  |  Built-in tools (Read,Edit,Bash,etc)                    |      |
|  +--------------------------------------------------------+      |
|           |                                                       |
|           v                                                       |
|  +--------------------------------------------------------+      |
|  |                    HOOKS (lifecycle)                     |      |
|  |                                                         |      |
|  |  SessionStart: setup memory symlinks, check updates     |      |
|  |  PreToolUse:   security scan before every file edit     |      |
|  |  PostToolUse:  monitor context window usage             |      |
|  +--------------------------------------------------------+      |
|           |                                                       |
|           v                                                       |
|  +--------------------------------------------------------+      |
|  |                    MEMORY (global)                      |      |
|  |                                                         |      |
|  |  ~/.claude/memory/MEMORY.md  (always loaded)            |      |
|  |  Knows your preferences, role, past decisions           |      |
|  |  Shared across ALL projects via symlinks                |      |
|  +--------------------------------------------------------+      |
+------------------------------------------------------------------+
```

## Component Breakdown

### 1. CLAUDE.md = The Brain

Think of it like a job description for Claude. It says:

> "When someone reports a bug, use Serena to understand the code + search memory for past issues + use the systematic-debugging skill BEFORE even responding."

There are **14 rules** like this. They cover every common scenario so Claude knows what to do without you telling it.

### 2. Skills = Actions Claude Can Take

Skills are like apps on your phone. Each one does one thing well.

```
/gsd-new-project     --> set up a new project with phases
/systematic-debugging --> structured bug investigation
/brainstorming       --> creative ideation before coding
/ui-ux-pro-max       --> design UI components
/mem-search          --> search past session memory
```

**Where they come from:**

```
~/.claude/skills/          61 standalone skills (mostly GSD framework)
     +
~/.claude/plugins/         32 plugin skills + 7 plugin commands
     =
                           100 total slash commands
```

### 3. Agents = Workers Claude Can Spawn

Agents are like hiring temporary specialists. Claude spawns them for specific jobs and they report back.

```
YOU: "review this code and check for security issues"

CLAUDE (orchestrator):
  |
  +---> spawns code-reviewer agent -----> reviews code quality
  |
  +---> spawns Explore agent -----------> searches for patterns
  |
  +---> results come back, Claude synthesizes
```

**Where they come from:**

```
~/.claude/agents/          21 standalone agents (GSD framework)
     +
~/.claude/plugins/          4 plugin agents
     =
                           25 total agent definitions
```

### 4. Plugins = Power-Ups

Plugins add capabilities Claude doesn't have natively. They run as MCP servers (background processes that Claude talks to).

```
+-------------------+     +-------------------+     +-------------------+
|     Serena        |     |     Context7      |     |    Playwright     |
|  code navigation  |     |  library docs     |     |  browser control  |
|  find symbols     |     |  API references   |     |  screenshots      |
|  trace references |     |  code examples    |     |  form filling     |
+-------------------+     +-------------------+     +-------------------+

+-------------------+     +-------------------+     +-------------------+
|   Superpowers     |     |   UI/UX Pro Max   |     |    Claude-mem     |
|  14 workflow      |     |  design system    |     |  cross-session    |
|  skills (TDD,     |     |  50+ styles       |     |  memory search    |
|  debugging, etc)  |     |  161 palettes     |     |  AST exploration  |
+-------------------+     +-------------------+     +-------------------+

              ... and 11 more plugins (17 total)
```

### 5. Hooks = Automatic Triggers

Hooks are scripts that run at specific moments, like event listeners.

```
SESSION STARTS
  |
  +--> global-memory-symlink.sh   (ensure memory is global)
  +--> gsd-check-update.js        (check for GSD updates)
  +--> integration-sync.js        (sync new plugins)

BEFORE EVERY FILE EDIT
  |
  +--> genai-codescan             (security scan)
  +--> gsd-prompt-guard.js        (prompt injection check)
  +--> gsd-read-guard.js          (read validation)

AFTER EVERY TOOL USE
  |
  +--> gsd-context-monitor.js     (track context window usage)
```

### 6. Memory = What Claude Remembers

Memory files teach Claude about YOU across sessions.

```
~/.claude/memory/
  |
  +--> MEMORY.md                   (index, always loaded)
  +--> feedback_communication_style.md  (how you want Claude to talk)
  +--> user_dev_profile.md         (your skills, languages, level)
```

**Global via symlinks:** Every project's `memory/` directory is a symlink to `~/.claude/memory/`, so Claude remembers you everywhere.

```
~/.claude/projects/project-A/memory/  -->  ~/.claude/memory/
~/.claude/projects/project-B/memory/  -->  ~/.claude/memory/
~/.claude/projects/project-C/memory/  -->  ~/.claude/memory/
```

## How a Request Flows

```
YOU: "there's a bug in the auth middleware"

1. CLAUDE.md rule #1 fires:
   "User reports a problem --> Serena + claude-mem + systematic-debugging"

2. Claude automatically:
   a. Uses Serena to find the auth middleware code (symbols, references)
   b. Searches claude-mem for past auth issues
   c. Invokes /systematic-debugging skill for structured investigation

3. Hooks fire along the way:
   - PreToolUse: security scan before any edits
   - PostToolUse: context monitor tracks usage

4. Memory is consulted:
   - "This user prefers ELI5 explanations"
   - "This user is a Python dev, go easy on TypeScript"

5. Claude responds with a diagnosis, having done all the research
   BEFORE saying anything — no guessing.
```

## File Sizes

```
What takes up space:

  plugins/    598 MB  [==========================================] 72%
  projects/   110 MB  [========]                                   13%
  GSD          2 MB   []                                            <1%
  everything   16 MB  [=]                                           2%
  else
              ------
  Total:      ~830 MB
```
