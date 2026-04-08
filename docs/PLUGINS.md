# Plugins Reference

## Summary

**17 plugins installed, 16 enabled, 2 disabled** (greptile, vtsls)

## Install Commands

If the install script fails for any plugin, you can install them manually:

### Official Plugins (11 plugins)
```bash
claude plugins install serena
claude plugins install context7
claude plugins install playwright
claude plugins install superpowers
claude plugins install code-simplifier
claude plugins install ralph-loop
claude plugins install typescript-lsp
claude plugins install pyright-lsp
claude plugins install supabase
claude plugins install agent-sdk-dev
claude plugins install claude-code-setup
claude plugins install greptile        # Optional — disabled by default
```

### LSP Plugins ([Piebald-AI/claude-code-lsps](https://github.com/Piebald-AI/claude-code-lsps))
```bash
claude plugins install pyright --marketplace claude-code-lsps
claude plugins install basedpyright --marketplace claude-code-lsps
claude plugins install vtsls --marketplace claude-code-lsps    # Optional — disabled by default
```

### Third-Party Plugins
```bash
claude plugins install ui-ux-pro-max --marketplace ui-ux-pro-max-skill
claude plugins install claude-mem --marketplace thedotmack
claude plugins install arize-skills --marketplace Arize-ai-arize-skills
```

## Third-Party Marketplace Config

These are configured in `settings.json` under `extraKnownMarketplaces`:

| Marketplace ID | GitHub Repo |
|---------------|-------------|
| `ui-ux-pro-max-skill` | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) |
| `thedotmack` | [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) |
| `Arize-ai-arize-skills` | [Arize-ai/arize-skills](https://github.com/Arize-ai/arize-skills) |
| `claude-code-lsps` | [Piebald-AI/claude-code-lsps](https://github.com/Piebald-AI/claude-code-lsps) |

## Disabled Plugins

| Plugin | Why disabled |
|--------|-------------|
| **greptile** | Semantic codebase intelligence — requires separate API key setup |
| **vtsls** | TypeScript/JS language server — basedpyright + typescript-lsp cover the same need |

To enable: set to `true` in `settings.json` under `enabledPlugins`.

## Skills Bundled in Plugins (32 skills + 7 commands + 4 agents)

### Superpowers v5.0.7 (14 skills)
- `/brainstorming` — creative ideation before implementation
- `/dispatching-parallel-agents` — run 2+ independent tasks in parallel
- `/executing-plans` — execute written plans with review checkpoints
- `/finishing-a-development-branch` — branch integration (merge, PR, cleanup)
- `/receiving-code-review` — handle incoming code review feedback
- `/requesting-code-review` — request review before merging
- `/subagent-driven-development` — execute plans with subagents
- `/systematic-debugging` — structured bug investigation
- `/test-driven-development` — TDD workflow
- `/using-git-worktrees` — isolated feature work
- `/using-superpowers` — meta-skill: how to use superpowers
- `/verification-before-completion` — verify work before claiming done
- `/writing-plans` — create implementation plans
- `/writing-skills` — create/edit Claude Code skills

### UI/UX Pro Max v2.0.1 (7 skills)
- `/ui-ux-pro-max` — main UI/UX design intelligence
- `/design` — logos, icons, slides, social media graphics
- `/design-system` — design tokens, component specs, Tailwind integration
- `/ui-styling` — shadcn/ui, Tailwind, canvas design system
- `/brand` — brand guidelines, typography, voice, visual identity
- `/banner-design` — banner sizes and styles
- `/slides` — HTML slide presentations

### Claude-mem v10.5.5 (4 skills)
- `/do` — execute phased plans with subagents
- `/make-plan` — create detailed implementation plans
- `/mem-search` — search cross-session memory
- `/smart-explore` — token-efficient AST-based code exploration

### Arize Skills v0.1.0 (6 skills)
- `/arize-dataset` — create/manage datasets and examples
- `/arize-experiment` — run experiments against datasets
- `/arize-instrumentation` — add AX tracing to apps (two-phase)
- `/arize-link` — generate deep links to Arize UI
- `/arize-prompt-optimization` — optimize prompts using trace data
- `/arize-trace` — export/debug traces and spans

### Claude Code Setup v1.0.0 (1 skill)
- `/claude-automation-recommender` — analyze codebase and recommend automations

## Commands Bundled in Plugins (7 total)

### Ralph Loop v1.0.0 (3 commands)
- `/ralph-loop` — start a recurring task loop
- `/cancel-ralph` — cancel a running loop
- `/help` — ralph-loop usage help

### Agent SDK Dev (1 command)
- `/new-sdk-app` — scaffold a new Claude Agent SDK application

### Superpowers v5.0.7 (3 commands — aliases)
- `/brainstorm` — alias for `/brainstorming`
- `/execute-plan` — alias for `/executing-plans`
- `/write-plan` — alias for `/writing-plans`

## Agents Bundled in Plugins (4 total)

### Agent SDK Dev (2 agents)
- `agent-sdk-verifier-ts` — verify TypeScript Agent SDK apps
- `agent-sdk-verifier-py` — verify Python Agent SDK apps

### Code Simplifier v1.0.0 (1 agent)
- `code-simplifier` — review code for quality, reuse, dead code

### Superpowers v5.0.7 (1 agent)
- `code-reviewer` — review code against plan and standards
