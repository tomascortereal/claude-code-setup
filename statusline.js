#!/usr/bin/env node
// Minimal statusline: model + dir + branch (line 1), context bar (line 2)
const { execSync } = require('child_process');
const path = require('path');

let input = '';
const guard = setTimeout(() => process.exit(0), 3000);
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  clearTimeout(guard);
  try {
    const data = JSON.parse(input);
    const model = data.model?.display_name || 'Claude';
    const dir = data.workspace?.current_dir || process.cwd();
    const home = require('os').homedir();
    // Show ~/relative/path instead of just the last folder
    const shortDir = dir.startsWith(home) ? '~' + dir.slice(home.length) : dir;
    const pct = Math.floor(data.context_window?.used_percentage || 0);

    const CYAN = '\x1b[36m';
    const GREEN = '\x1b[32m';
    const YELLOW = '\x1b[33m';
    const RED = '\x1b[31m';
    const RESET = '\x1b[0m';

    // Git branch when in a repo
    let branch = '';
    try {
      execSync('git rev-parse --git-dir', { cwd: dir, stdio: 'ignore' });
      const b = execSync('git branch --show-current', {
        cwd: dir,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore']
      }).trim();
      if (b) branch = ' | \uD83C\uDF3F ' + b;
    } catch (e) {
      // not a git repo, skip
    }

    // Line 1: model + directory + branch
    console.log(CYAN + '[' + model + ']' + RESET + ' \uD83D\uDCC2 ' + shortDir + branch);

    // Line 2: color-coded context bar
    let barColor = GREEN;
    if (pct >= 90) barColor = RED;
    else if (pct >= 70) barColor = YELLOW;

    const filled = Math.floor(pct / 10);
    const bar = '\u2588'.repeat(filled) + '\u2591'.repeat(10 - filled);
    console.log(barColor + bar + RESET + ' ' + pct + '%');
  } catch (e) {
    // silent fail
  }
});
