#!/usr/bin/env node
/*
 * Añade (o quita con --uninstall) los hooks de Claude Office en ~/.claude/settings.json
 * Hace copia de seguridad antes de tocar nada y no duplica entradas.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');

const uninstall = process.argv.includes('--uninstall');
const settingsPath = path.join(os.homedir(), '.claude', 'settings.json');
const sendPath = path.resolve(__dirname, '..', 'hooks', 'send.js').replace(/\\/g, '/');
const command = `node "${sendPath}"`;
const MARK = 'hooks/send.js';
const EVENTS = ['SessionStart', 'UserPromptSubmit', 'PreToolUse', 'PostToolUse', 'Notification', 'Stop', 'SubagentStop', 'SessionEnd'];
const WITH_MATCHER = new Set(['PreToolUse', 'PostToolUse']);

let settings = {};
if (fs.existsSync(settingsPath)) {
  const raw = fs.readFileSync(settingsPath, 'utf8');
  try { settings = raw.trim() ? JSON.parse(raw) : {}; } catch (e) {
    console.error(`✖ ${settingsPath} no es JSON válido. Arréglalo a mano y vuelve a probar.`);
    process.exit(1);
  }
  const backup = `${settingsPath}.bak-${Date.now()}`;
  fs.copyFileSync(settingsPath, backup);
  console.log(`  Copia de seguridad: ${backup}`);
} else {
  fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
}

settings.hooks = settings.hooks || {};
const isOurs = h => h && typeof h.command === 'string' && (h.command === command || h.command.includes('/' + MARK + '"'));

// Quita cualquier entrada nuestra anterior
for (const ev of Object.keys(settings.hooks)) {
  if (!Array.isArray(settings.hooks[ev])) continue;
  settings.hooks[ev] = settings.hooks[ev]
    .map(group => ({ ...group, hooks: (group.hooks || []).filter(h => !isOurs(h)) }))
    .filter(group => group.hooks.length > 0);
  if (settings.hooks[ev].length === 0) delete settings.hooks[ev];
}

if (!uninstall) {
  for (const ev of EVENTS) {
    const group = { hooks: [{ type: 'command', command, timeout: 5 }] };
    if (WITH_MATCHER.has(ev)) group.matcher = '*';
    (settings.hooks[ev] = settings.hooks[ev] || []).push(group);
  }
}
if (Object.keys(settings.hooks).length === 0) delete settings.hooks;

fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
console.log(uninstall
  ? '✔ Hooks de Claude Office eliminados.'
  : `✔ Hooks instalados en ${settingsPath}\n  Comando: ${command}\n  Reinicia Claude Code para que los cargue.`);
