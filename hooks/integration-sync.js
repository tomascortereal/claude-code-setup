#!/usr/bin/env node
/**
 * Integration Sync Hook — SessionStart
 *
 * Detects new plugins, agents, MCP servers, and skills that aren't yet
 * documented in ~/.claude/CLAUDE.md. Outputs instructions for Claude
 * to update the global CLAUDE.md with routing rules.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = os.homedir();
const CLAUDE_DIR = path.join(HOME, '.claude');
const SETTINGS_PATH = path.join(CLAUDE_DIR, 'settings.json');
const CLAUDE_MD_PATH = path.join(CLAUDE_DIR, 'CLAUDE.md');
const AGENTS_DIR = path.join(CLAUDE_DIR, 'agents');
const PLUGIN_CACHE = path.join(CLAUDE_DIR, 'plugins', 'cache');
const MANIFEST_PATH = path.join(CLAUDE_DIR, 'hooks', '.integration-manifest.json');

function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function listDir(dirPath) {
  try {
    return fs.readdirSync(dirPath);
  } catch {
    return [];
  }
}

function getEnabledPlugins() {
  const settings = readJSON(SETTINGS_PATH);
  if (!settings || !settings.enabledPlugins) return [];
  return Object.entries(settings.enabledPlugins)
    .filter(([, enabled]) => enabled)
    .map(([name]) => name);
}

function getMcpServers() {
  const settings = readJSON(SETTINGS_PATH);
  if (!settings || !settings.mcpServers) return [];
  return Object.keys(settings.mcpServers);
}

function getCustomAgents() {
  // Global agents
  const globalAgents = listDir(AGENTS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => `global:${f.replace('.md', '')}`);

  // Project agents (check CWD)
  const projectAgentsDir = path.join(process.cwd(), '.claude', 'agents');
  const projectAgents = listDir(projectAgentsDir)
    .filter(f => f.endsWith('.md'))
    .map(f => `project:${f.replace('.md', '')}`);

  return [...globalAgents, ...projectAgents];
}

function getPluginSkills() {
  const skills = [];
  const marketplaces = path.join(CLAUDE_DIR, 'plugins', 'marketplaces');

  for (const marketplace of listDir(marketplaces)) {
    const mDir = path.join(marketplaces, marketplace);
    // Check for skills directories in plugins
    for (const plugin of listDir(mDir)) {
      const skillsDir = path.join(mDir, plugin, 'skills');
      if (fs.existsSync(skillsDir)) {
        for (const skill of listDir(skillsDir)) {
          skills.push(`${plugin}:${skill}`);
        }
      }
      // Also check .claude-plugin for plugin info
      const pluginJson = path.join(mDir, plugin, '.claude-plugin', 'plugin.json');
      if (fs.existsSync(pluginJson)) {
        const info = readJSON(pluginJson);
        if (info && info.name) {
          skills.push(`plugin:${info.name}`);
        }
      }
    }
    // Direct marketplace skills (e.g., superpowers)
    const directSkills = path.join(mDir, 'skills');
    if (fs.existsSync(directSkills)) {
      for (const skill of listDir(directSkills)) {
        skills.push(`${marketplace}:${skill}`);
      }
    }
  }
  return [...new Set(skills)];
}

function getExtraMarketplaces() {
  const settings = readJSON(SETTINGS_PATH);
  if (!settings || !settings.extraKnownMarketplaces) return [];
  return Object.entries(settings.extraKnownMarketplaces).map(([name, config]) => {
    const source = config.source?.repo || config.source?.source || 'unknown';
    return { name, source };
  });
}

function loadManifest() {
  return readJSON(MANIFEST_PATH) || {
    plugins: [],
    mcpServers: [],
    agents: [],
    skills: [],
    marketplaces: [],
    lastCheck: null
  };
}

function saveManifest(manifest) {
  manifest.lastCheck = new Date().toISOString();
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

function main() {
  const claudeMd = readText(CLAUDE_MD_PATH).toLowerCase();
  const manifest = loadManifest();

  // Gather current state
  const currentPlugins = getEnabledPlugins();
  const currentMcp = getMcpServers();
  const currentAgents = getCustomAgents();
  const currentSkills = getPluginSkills();
  const currentMarketplaces = getExtraMarketplaces();

  // Fuzzy check: does CLAUDE.md mention this name or a recognizable substring?
  function isMentioned(name) {
    const lower = name.toLowerCase();
    // Direct match
    if (claudeMd.includes(lower)) return true;
    // Strip common prefixes/suffixes and try base name
    const base = lower
      .replace(/^gsd-/, 'gsd')       // gsd-executor → gsdexecutor (covered by "gsd")
      .replace(/-lsp$/, '')           // pyright-lsp → pyright
      .replace(/-plugin$/, '')
      .replace(/^global:/, '')
      .replace(/^project:/, '');
    if (claudeMd.includes(base)) return true;
    // Try first meaningful segment (e.g., "pyright-lsp" → "pyright")
    const firstPart = lower.split('-')[0];
    if (firstPart.length > 3 && claudeMd.includes(firstPart)) return true;
    return false;
  }

  // Known internal agent prefixes — these come with plugins, not user-added
  const internalAgentPrefixes = ['gsd-'];

  // Find new items not in manifest AND not in CLAUDE.md
  const newPlugins = currentPlugins.filter(p => {
    const shortName = p.split('@')[0];
    return !manifest.plugins.includes(p) && !isMentioned(shortName);
  });

  const newMcp = currentMcp.filter(m =>
    !manifest.mcpServers.includes(m) && !isMentioned(m)
  );

  const newAgents = currentAgents.filter(a => {
    const name = a.split(':')[1];
    // Skip internal agents from known plugins
    if (internalAgentPrefixes.some(prefix => name.startsWith(prefix))) return false;
    return !manifest.agents.includes(a) && !isMentioned(name);
  });

  // Check for new marketplaces (third-party plugin sources)
  const newMarketplaces = currentMarketplaces.filter(m =>
    !manifest.marketplaces.map(x => x.name).includes(m.name) && !isMentioned(m.name)
  );

  // Update manifest with current state (so we track what we've seen)
  const updatedManifest = {
    plugins: [...new Set([...manifest.plugins, ...currentPlugins])],
    mcpServers: [...new Set([...manifest.mcpServers, ...currentMcp])],
    agents: [...new Set([...manifest.agents, ...currentAgents])],
    skills: [...new Set([...manifest.skills, ...currentSkills])],
    marketplaces: [...new Set([...manifest.marketplaces.map(m => m.name), ...currentMarketplaces.map(m => m.name)])].map(name => {
      const found = currentMarketplaces.find(m => m.name === name);
      return found || { name, source: 'unknown' };
    })
  };

  const hasNew = newPlugins.length > 0 || newMcp.length > 0 || newAgents.length > 0 || newMarketplaces.length > 0;

  if (hasNew) {
    const parts = ['NEW INTEGRATIONS DETECTED — not yet documented in ~/.claude/CLAUDE.md:\n'];

    if (newPlugins.length > 0) {
      parts.push('NEW PLUGINS:');
      newPlugins.forEach(p => parts.push(`  - ${p}`));
      parts.push('');
    }

    if (newMcp.length > 0) {
      parts.push('NEW MCP SERVERS:');
      newMcp.forEach(m => parts.push(`  - ${m}`));
      parts.push('');
    }

    if (newAgents.length > 0) {
      parts.push('NEW AGENTS:');
      newAgents.forEach(a => parts.push(`  - ${a}`));
      parts.push('');
    }

    if (newMarketplaces.length > 0) {
      parts.push('NEW THIRD-PARTY MARKETPLACES:');
      newMarketplaces.forEach(m => parts.push(`  - ${m.name} (source: ${m.source})`));
      parts.push('');
    }

    parts.push('ACTION REQUIRED: Read the new integration\'s documentation/tools and add appropriate');
    parts.push('routing instructions to ~/.claude/CLAUDE.md under the relevant section.');
    parts.push('Include: (1) when to use it, (2) key tools/commands, (3) add to Decision Rules if appropriate.');
    parts.push('After updating CLAUDE.md, briefly inform the user what was added.');

    console.log(parts.join('\n'));
  }

  // Always save manifest so we track current state
  saveManifest(updatedManifest);
}

main();
