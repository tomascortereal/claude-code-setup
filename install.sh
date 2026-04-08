#!/bin/bash
set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="$HOME/.claude"

echo -e "${GREEN}=== Claude Code Setup Installer ===${NC}"
echo ""

# ─── Pre-flight checks ───────────────────────────────────────────────────────

if ! command -v claude &> /dev/null; then
    echo -e "${RED}Error: 'claude' CLI not found. Install Claude Code first:${NC}"
    echo "  npm install -g @anthropic-ai/claude-code"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: 'node' not found. Install Node.js 18+ first.${NC}"
    exit 1
fi

# ─── Backup existing setup ───────────────────────────────────────────────────

if [ -d "$CLAUDE_DIR" ]; then
    BACKUP_DIR="$HOME/.claude-backup-$(date +%Y%m%d-%H%M%S)"
    echo -e "${YELLOW}Existing ~/.claude/ found. Backing up to $BACKUP_DIR${NC}"
    cp -r "$CLAUDE_DIR" "$BACKUP_DIR"
fi

mkdir -p "$CLAUDE_DIR"

# ─── Copy core files ─────────────────────────────────────────────────────────

echo "Copying CLAUDE.md (global instructions)..."
cp "$SCRIPT_DIR/CLAUDE.md" "$CLAUDE_DIR/CLAUDE.md"

echo "Copying agents (21 agent definitions)..."
mkdir -p "$CLAUDE_DIR/agents"
cp "$SCRIPT_DIR/agents/"*.md "$CLAUDE_DIR/agents/"

echo "Copying skills (61 slash commands)..."
mkdir -p "$CLAUDE_DIR/skills"
cp -r "$SCRIPT_DIR/skills/"* "$CLAUDE_DIR/skills/"

echo "Copying hooks (8 lifecycle hooks)..."
mkdir -p "$CLAUDE_DIR/hooks"
cp "$SCRIPT_DIR/hooks/"* "$CLAUDE_DIR/hooks/"
chmod +x "$CLAUDE_DIR/hooks/"*.sh

echo "Copying statusline..."
cp "$SCRIPT_DIR/statusline.js" "$CLAUDE_DIR/statusline.js"
cp "$SCRIPT_DIR/statusline.sh" "$CLAUDE_DIR/statusline.sh"
chmod +x "$CLAUDE_DIR/statusline.sh"

# ─── Setup global memory ─────────────────────────────────────────────────────

echo "Setting up global memory directory..."
mkdir -p "$CLAUDE_DIR/memory"
if [ ! -f "$CLAUDE_DIR/memory/MEMORY.md" ]; then
    cp "$SCRIPT_DIR/memory/MEMORY.md" "$CLAUDE_DIR/memory/MEMORY.md"
fi

# ─── Settings ─────────────────────────────────────────────────────────────────

if [ ! -f "$CLAUDE_DIR/settings.json" ]; then
    echo -e "${YELLOW}Creating settings.json from template...${NC}"
    cp "$SCRIPT_DIR/settings.template.json" "$CLAUDE_DIR/settings.json"
    echo -e "${YELLOW}  >>> IMPORTANT: Edit ~/.claude/settings.json to fill in your values:${NC}"
    echo "      - ANTHROPIC_BASE_URL (your LLM gateway URL)"
    echo "      - OTEL_EXPORTER_OTLP_ENDPOINT (your OTEL endpoint)"
    echo "      - OTEL_RESOURCE_ATTRIBUTES (your username, org, gid)"
else
    echo "settings.json already exists, skipping (won't overwrite your config)"
fi

# ─── Install plugins ─────────────────────────────────────────────────────────

echo ""
echo -e "${GREEN}Installing plugins...${NC}"
echo "(This may take a few minutes)"
echo ""

# Official plugins
OFFICIAL_PLUGINS=(
    "serena"
    "context7"
    "playwright"
    "superpowers"
    "code-simplifier"
    "ralph-loop"
    "typescript-lsp"
    "pyright-lsp"
    "supabase"
    "agent-sdk-dev"
    "claude-code-setup"
)

for plugin in "${OFFICIAL_PLUGINS[@]}"; do
    echo "  Installing $plugin..."
    claude plugins install "$plugin" 2>/dev/null || echo "    (already installed or unavailable)"
done

# LSP plugins
echo "  Installing pyright LSP..."
claude plugins install pyright --marketplace claude-code-lsps 2>/dev/null || echo "    (already installed or unavailable)"
echo "  Installing basedpyright LSP..."
claude plugins install basedpyright --marketplace claude-code-lsps 2>/dev/null || echo "    (already installed or unavailable)"

# Third-party plugins
echo "  Installing ui-ux-pro-max..."
claude plugins install ui-ux-pro-max --marketplace ui-ux-pro-max-skill 2>/dev/null || echo "    (already installed or unavailable)"
echo "  Installing claude-mem..."
claude plugins install claude-mem --marketplace thedotmack 2>/dev/null || echo "    (already installed or unavailable)"
echo "  Installing arize-skills..."
claude plugins install arize-skills --marketplace Arize-ai-arize-skills 2>/dev/null || echo "    (already installed or unavailable)"

# ─── Install GSD framework ───────────────────────────────────────────────────

echo ""
echo -e "${GREEN}Installing GSD (Get Stuff Done) framework...${NC}"
if [ ! -d "$CLAUDE_DIR/get-shit-done" ]; then
    # GSD installs itself via its skill — trigger it on first use
    echo "  GSD will self-install on first /gsd-help invocation."
else
    echo "  GSD already installed (v$(cat "$CLAUDE_DIR/get-shit-done/VERSION" 2>/dev/null || echo 'unknown'))"
fi

# ─── Create required directories ─────────────────────────────────────────────

mkdir -p "$CLAUDE_DIR/projects"
mkdir -p "$CLAUDE_DIR/sessions"
mkdir -p "$CLAUDE_DIR/tasks"
mkdir -p "$CLAUDE_DIR/teams"
mkdir -p "$CLAUDE_DIR/todos"
mkdir -p "$CLAUDE_DIR/debug"
mkdir -p "$CLAUDE_DIR/backups"
mkdir -p "$CLAUDE_DIR/cache"

# ─── Done ─────────────────────────────────────────────────────────────────────

echo ""
echo -e "${GREEN}=== Installation complete! ===${NC}"
echo ""
echo "Next steps:"
echo "  1. Edit ~/.claude/settings.json — fill in placeholder values (<YOUR_...>)"
echo "  2. Run 'claude' to start a session and verify everything works"
echo "  3. Your first session will trigger the memory symlink hook automatically"
echo ""
echo "Installed:"
echo "  - 21 agents"
echo "  - 61 standalone skills + 33 plugin skills + 7 plugin commands"
echo "  - 8 lifecycle hooks"
echo "  - 16 plugins"
echo "  - Global memory system"
echo "  - Custom statusline"
echo ""
echo -e "${YELLOW}Tip: Run /gsd-help in Claude Code to bootstrap the GSD framework.${NC}"
