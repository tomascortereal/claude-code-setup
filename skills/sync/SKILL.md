---
name: sync
description: Scan for new plugins, MCP servers, agents, and skills not yet documented in ~/.claude/CLAUDE.md. Detects new integrations and updates the cheat sheet automatically.
---

Run the integration sync check:

1. Execute this command and read the output:
```bash
node "/home/tomascortereal/.claude/hooks/integration-sync.js"
```

2. If the output is empty — everything is already documented. Tell the user "All integrations are synced."

3. If the output lists new integrations:
   - For each new plugin/MCP/agent listed, investigate what it does (check its README, plugin.json, or skill files)
   - Add a new entry to `~/.claude/CLAUDE.md` under the appropriate section with:
     - Name and type
     - USE WHEN description
     - Key tools/commands/skills it provides
     - Any prerequisites (API keys, CLI tools, etc.)
   - If it's significant, add it to the Decision Rules at the bottom
   - Re-run the sync command to verify it's now recognized
   - Tell the user what was added
