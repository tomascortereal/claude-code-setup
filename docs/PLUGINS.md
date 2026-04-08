# Plugins Reference

## Install Commands

If the install script fails for any plugin, you can install them manually:

### Official Plugins
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
```

### LSP Plugins
```bash
claude plugins install pyright --marketplace claude-code-lsps
claude plugins install basedpyright --marketplace claude-code-lsps
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

## Skills Bundled in Plugins

### Superpowers (14 skills)
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
- `/verification-before-completion` — verify work before claiming done
- `/writing-plans` — create implementation plans
- `/writing-skills` — create/edit Claude Code skills

### UI/UX Pro Max (7 skills)
- `/ui-ux-pro-max` — main UI/UX design intelligence
- `/design` — logos, icons, slides, social media graphics
- `/design-system` — design tokens, component specs
- `/ui-styling` — shadcn/ui, Tailwind, canvas
- `/brand` — brand guidelines, typography, voice
- `/banner-design` — banner sizes and styles
- `/slides` — HTML slide presentations

### Claude-mem (4 skills)
- `/do` — execute phased plans with subagents
- `/make-plan` — create detailed implementation plans
- `/mem-search` — search cross-session memory
- `/smart-explore` — token-efficient code exploration

### Arize Skills (6 skills)
- `/arize-dataset` — create/manage datasets
- `/arize-experiment` — run experiments
- `/arize-instrumentation` — add AX tracing
- `/arize-link` — generate Arize UI links
- `/arize-prompt-optimization` — optimize prompts
- `/arize-trace` — export/debug traces

### Claude Code Setup (1 skill)
- `/claude-automation-recommender` — analyze and recommend automations
