#!/usr/bin/env node
/*
 * Conecta (o desconecta) Claude Office con Claude Code añadiendo hooks en ~/.claude/settings.json.
 * Hace copia de seguridad antes de tocar nada, no duplica entradas y respeta tus otros hooks.
 * Lo usa el botón «Conectar» de la oficina y también se puede lanzar a mano:
 *   node scripts/install-hooks.js            → conectar
 *   node scripts/install-hooks.js --uninstall → desconectar
 */
const fs = require('fs');
const os = require('os');
const path = require('path');

const settingsPath = () => path.join(os.homedir(), '.claude', 'settings.json');
const sendPath = path.resolve(__dirname, '..', 'hooks', 'send.js').replace(/\\/g, '/');
const command = `node "${sendPath}"`;
const MARK = 'hooks/send.js';
const EVENTS = ['SessionStart', 'UserPromptSubmit', 'PreToolUse', 'PostToolUse', 'Notification', 'Stop', 'SubagentStop', 'SessionEnd'];
const WITH_MATCHER = new Set(['PreToolUse', 'PostToolUse']);

const isOurs = h => h && typeof h.command === 'string' && (h.command === command || h.command.includes('/' + MARK + '"'));

function read() {
  const p = settingsPath();
  if (!fs.existsSync(p)) return {};
  const raw = fs.readFileSync(p, 'utf8');
  try { return raw.trim() ? JSON.parse(raw) : {}; } catch (_) {
    throw new Error(`${p} no es JSON válido. Arréglalo a mano y vuelve a probar.`);
  }
}

// ¿Están puestos nuestros hooks (y apuntan a esta carpeta)?
function status() {
  let settings;
  try { settings = read(); } catch (e) { return { installed: false, error: e.message, settingsPath: settingsPath() }; }
  const groups = (settings.hooks && settings.hooks.UserPromptSubmit) || [];
  const cmds = groups.flatMap(g => (g.hooks || []).filter(isOurs).map(h => h.command));
  return { installed: cmds.length > 0, current: cmds.includes(command), settingsPath: settingsPath() };
}

function setHooks(enable) {
  const p = settingsPath();
  const settings = read();
  let backup = null;
  if (fs.existsSync(p)) { backup = `${p}.bak-${Date.now()}`; fs.copyFileSync(p, backup); }
  else fs.mkdirSync(path.dirname(p), { recursive: true });

  settings.hooks = settings.hooks || {};
  for (const ev of Object.keys(settings.hooks)) {
    if (!Array.isArray(settings.hooks[ev])) continue;
    settings.hooks[ev] = settings.hooks[ev]
      .map(group => ({ ...group, hooks: (group.hooks || []).filter(h => !isOurs(h)) }))
      .filter(group => group.hooks.length > 0);
    if (settings.hooks[ev].length === 0) delete settings.hooks[ev];
  }
  if (enable) {
    for (const ev of EVENTS) {
      const group = { hooks: [{ type: 'command', command, timeout: 5 }] };
      if (WITH_MATCHER.has(ev)) group.matcher = '*';
      (settings.hooks[ev] = settings.hooks[ev] || []).push(group);
    }
  }
  if (Object.keys(settings.hooks).length === 0) delete settings.hooks;
  fs.writeFileSync(p, JSON.stringify(settings, null, 2) + '\n');
  return { ...status(), backup };
}

module.exports = { install: () => setHooks(true), uninstall: () => setHooks(false), status, command };

if (require.main === module) {
  const off = process.argv.includes('--uninstall');
  try {
    const r = off ? setHooks(false) : setHooks(true);
    if (r.backup) console.log(`  Copia de seguridad: ${r.backup}`);
    console.log(off ? '✔ Claude Office desconectada de Claude Code.'
      : `✔ Conectada. Hooks en ${r.settingsPath}\n  Reinicia Claude Code para que los cargue.`);
  } catch (e) { console.error('✖ ' + e.message); process.exit(1); }
}
