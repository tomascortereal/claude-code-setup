# Customization Guide

## After Installing

### 1. Fill in settings.json

Edit `~/.claude/settings.json` and replace the placeholder values:

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "<YOUR_LLM_GATEWAY_URL>",
    "OTEL_EXPORTER_OTLP_ENDPOINT": "<YOUR_OTEL_ENDPOINT>",
    "OTEL_RESOURCE_ATTRIBUTES": "user_name=<YOUR_USERNAME>,organization=<YOUR_ORG>,gid=<YOUR_GID>"
  }
}
```

If you don't use OTEL telemetry, you can remove those env vars entirely.

### 2. Add a Code Scanner Hook (Optional)

If your organization has a code scanning requirement (e.g., Siemens genai-codescan), add this to the `PreToolUse` hooks in `settings.json`:

```json
{
  "matcher": "Write|Edit",
  "hooks": [
    {
      "type": "command",
      "command": "uvx --from <YOUR_SCANNER_PACKAGE> <YOUR_SCANNER_COMMAND>"
    }
  ]
}
```

The scanner hook runs **before** every Write/Edit operation and can block changes that violate policy. A placeholder is included in `settings.template.json` — replace the `<YOUR_SCANNER_PACKAGE>` and `<YOUR_SCANNER_COMMAND>` with your scanner details, or remove the entry if you don't need it.

If your scanner requires authentication, set the token in `~/.claude/.env`:
```
CODE_SCAN_TOKEN=<your-token>
```

### 3. Set Up Your Memory

Create memory files in `~/.claude/memory/` to teach Claude about you:

**Communication style** (`feedback_communication_style.md`):
```markdown
---
name: Communication preferences
description: How I want Claude to communicate with me
type: feedback
---

Your preferences here (e.g., ELI5, verbose, terse, etc.)
```

**Developer profile** (`user_dev_profile.md`):
```markdown
---
name: Developer profile
description: My programming background and skill levels
type: user
---

- Primary language: ...
- Learning: ...
- Preferences: ...
```

Then add entries to `~/.claude/memory/MEMORY.md`:
```markdown
- [Communication style](feedback_communication_style.md) — your short description
- [Developer profile](user_dev_profile.md) — your short description
```

### 4. Configure Permissions (settings.local.json)

Create `~/.claude/settings.local.json` to pre-approve common tool calls:

```json
{
  "permissions": {
    "allow": [
      "WebSearch",
      "Bash(python3:*)",
      "Bash(npm install:*)",
      "Bash(pip3 install:*)"
    ]
  }
}
```

### 5. External MCP Servers (Optional)

If you use Ruflo or other MCP servers, configure them separately — they're not part of this setup since they require their own installation.

## Disabling Components

- **Disable a plugin**: Set it to `false` in `settings.json` under `enabledPlugins`
- **Disable a hook**: Remove the entry from the `hooks` section in `settings.json`
- **Remove a skill**: Delete the skill's directory from `~/.claude/skills/`
- **Remove an agent**: Delete the agent's `.md` file from `~/.claude/agents/`

### Disabled by Default

Two plugins are installed but disabled out of the box:

| Plugin | Why disabled | How to enable |
|--------|-------------|---------------|
| **greptile** | Requires a separate Greptile API key | Set `"greptile@claude-plugins-official": true` in `enabledPlugins` and configure your API key |
| **vtsls** | Redundant — `basedpyright` + `typescript-lsp` cover the same need | Set `"vtsls@claude-code-lsps": true` in `enabledPlugins` |

### Plugin Agents vs Plugin Skills

Some plugins provide **agents** (spawn via the Agent tool) rather than skills (invoke via `/slash-command`):

- **code-simplifier** — spawn with `subagent_type: "code-simplifier:code-simplifier"`
- **code-reviewer** — spawn with `subagent_type: "superpowers:code-reviewer"`
- **agent-sdk-verifier-ts/py** — spawn with `subagent_type: "agent-sdk-dev:agent-sdk-verifier-ts"` (or `-py`)
