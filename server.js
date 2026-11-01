#!/usr/bin/env node
/*
 * Claude Office — servidor local (sin dependencias)
 *  - Sirve la oficina (index.html)
 *  - Recibe eventos de Claude Code (hooks) en  POST /hook/claude-code
 *  - Recibe eventos genéricos (userscript de claude.ai, n8n, curl…) en  POST /event
 *  - Los emite en directo a la oficina por Server-Sent Events en  GET /events
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const hooks = require('./scripts/install-hooks');

const PORT = Number(process.env.PORT) || 4747;
const HOST = process.env.HOST || '127.0.0.1';
const KINDS = new Set(['ping', 'prompt', 'tool_start', 'tool_end', 'stop', 'notify', 'subagent_stop', 'session_start', 'session_end', 'message']);

const clients = new Set();
const recent = [];
const lastSeen = {};
let seq = 0;

const clip = (v, n = 300) => (typeof v === 'string' ? (v.length > n ? v.slice(0, n) + '…' : v) : undefined);
const time = () => new Date().toLocaleTimeString('es-ES', { hour12: false });

function broadcast(ev) {
  lastSeen[ev.source] = Date.now();
  if (ev.kind === 'ping') return; // solo avisa de que el puente está vivo
  ev.id = ++seq;
  ev.ts = ev.ts || Date.now();
  recent.push(ev);
  if (recent.length > 60) recent.shift();
  const line = `data: ${JSON.stringify(ev)}\n\n`;
  for (const res of clients) res.write(line);
  const what = ev.tool || clip(ev.prompt, 50) || clip(ev.message || ev.text, 50) || '';
  console.log(`[${time()}] ${String(ev.source).padEnd(5)} ${ev.kind.padEnd(13)} ${what}`);
}

// Solo nos quedamos con los campos útiles del input de cada herramienta
function pickDetail(input) {
  if (!input || typeof input !== 'object') return {};
  const d = {};
  for (const k of ['file_path', 'notebook_path', 'path', 'pattern', 'glob', 'command', 'description', 'url', 'query', 'subagent_type']) {
    if (typeof input[k] === 'string') d[k] = clip(input[k], 240);
  }
  if (Array.isArray(input.todos)) {
    d.todos = input.todos.slice(0, 12).map(t => ({ content: clip(String(t.content || t.activeForm || ''), 80), status: t.status }));
  }
  if (Array.isArray(input.edits)) d.edits = input.edits.length;
  return d;
}

// Traduce el JSON de los hooks de Claude Code a eventos de la oficina
function fromClaudeCode(h) {
  const base = { source: 'code', session: clip(h.session_id, 64), project: h.cwd ? path.basename(h.cwd) : undefined };
  switch (h.hook_event_name) {
    case 'UserPromptSubmit': return { ...base, kind: 'prompt', prompt: clip(h.prompt, 600) };
    case 'PreToolUse': return { ...base, kind: 'tool_start', tool: h.tool_name, toolUseId: h.tool_use_id, detail: pickDetail(h.tool_input) };
    case 'PostToolUse': return { ...base, kind: 'tool_end', tool: h.tool_name, toolUseId: h.tool_use_id, ok: !(h.tool_response && h.tool_response.is_error) };
    case 'Stop': return { ...base, kind: 'stop' };
    case 'SubagentStop': return { ...base, kind: 'subagent_stop' };
    case 'Notification': return { ...base, kind: 'notify', message: clip(h.message, 200) };
    case 'SessionStart': return { ...base, kind: 'session_start' };
    case 'SessionEnd': return { ...base, kind: 'session_end' };
    default: return null;
  }
}

// Eventos genéricos: { source, kind, prompt?, tool?, detail?, message?, text?, agent? }
function sanitize(e) {
  if (!e || typeof e !== 'object' || !KINDS.has(e.kind)) return null;
  return {
    source: clip(String(e.source || 'chat'), 20),
    kind: e.kind,
    prompt: clip(e.prompt, 600),
    tool: clip(e.tool, 80),
    toolUseId: clip(e.toolUseId, 80),
    detail: e.detail && typeof e.detail === 'object' ? pickDetail(e.detail) : undefined,
    message: clip(e.message, 200),
    text: clip(e.text, 200),
    agent: clip(e.agent, 40),
    session: clip(e.session, 120),
    ok: e.ok !== false,
  };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > 1e6) { reject(new Error('too big')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Private-Network': 'true',
};

// Las acciones que tocan tu configuración solo se aceptan desde la propia oficina
function fromOffice(req) {
  const origin = req.headers.origin;
  if (!origin) return true; // curl o scripts locales
  try { const u = new URL(origin); return ['localhost', '127.0.0.1'].includes(u.hostname) && Number(u.port) === PORT; } catch (_) { return false; }
}
function apiStatus() {
  return { code: { ...hooks.status(), lastSeen: lastSeen.code || null }, chat: { lastSeen: lastSeen.chat || null }, now: Date.now() };
}
function json(res, code, data) { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(data)); }

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'OPTIONS') { res.writeHead(204, CORS); return res.end(); }

  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
    fs.readFile(path.join(__dirname, 'index.html'), (err, buf) => {
      if (err) { res.writeHead(500); return res.end('No encuentro index.html'); }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(buf);
    });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/events') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive', ...CORS });
    res.write('retry: 2000\n\n');
    res.write(`data: ${JSON.stringify({ kind: 'hello', history: recent.slice(-40) })}\n\n`);
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/status') return json(res, 200, apiStatus());

  if (req.method === 'POST' && (url.pathname === '/api/connect/code' || url.pathname === '/api/disconnect/code')) {
    if (!fromOffice(req) || !/json/.test(req.headers['content-type'] || '')) return json(res, 403, { ok: false, error: 'Solo desde la oficina' });
    try {
      const r = url.pathname.endsWith('/connect/code') ? hooks.install() : hooks.uninstall();
      console.log(`[${time()}] Claude Code ${r.installed ? 'conectado' : 'desconectado'} (${r.settingsPath})`);
      return json(res, 200, { ok: true, ...apiStatus() });
    } catch (e) { return json(res, 500, { ok: false, error: e.message }); }
  }

  // Tampermonkey detecta las URLs .user.js y ofrece «Instalar» con un clic
  if (req.method === 'GET' && url.pathname === '/claude-office.user.js') {
    fs.readFile(path.join(__dirname, 'userscript', 'claude-office.user.js'), (err, buf) => {
      if (err) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(buf);
    });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json', ...CORS });
    return res.end(JSON.stringify({ ok: true, clients: clients.size, events: seq }));
  }

  if (req.method === 'POST' && (url.pathname === '/hook/claude-code' || url.pathname === '/event')) {
    try {
      const raw = await readBody(req);
      const data = raw ? JSON.parse(raw) : {};
      const list = Array.isArray(data) ? data : [data];
      for (const item of list) {
        const ev = url.pathname === '/event' ? sanitize(item) : fromClaudeCode(item);
        if (ev) broadcast(ev);
      }
      res.writeHead(200, { 'Content-Type': 'application/json', ...CORS });
      return res.end('{"ok":true}');
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json', ...CORS });
      return res.end(JSON.stringify({ ok: false, error: e.message }));
    }
  }

  res.writeHead(404, CORS);
  res.end('Not found');
});

setInterval(() => { for (const res of clients) res.write(': ping\n\n'); }, 20000);

const OFFICE_URL = `http://localhost:${PORT}`;
function openBrowser() {
  if (process.env.NO_OPEN) return;
  const [cmd, args] = process.platform === 'win32' ? ['cmd', ['/c', 'start', '""', OFFICE_URL]]
    : process.platform === 'darwin' ? ['open', [OFFICE_URL]] : ['xdg-open', [OFFICE_URL]];
  try { spawn(cmd, args, { detached: true, stdio: 'ignore', windowsHide: true }).on('error', () => {}).unref(); } catch (_) {}
}

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.log(`\n  ✳  Claude Office ya estaba abierta: ${OFFICE_URL}\n`);
    openBrowser();
    setTimeout(() => process.exit(0), 300);
  } else throw err;
});

server.listen(PORT, HOST, () => {
  console.log(`\n  ✳  Claude Office abierta en  ${OFFICE_URL}`);
  console.log('     Pulsa «Conectar» en la oficina y acepta. Deja esta ventana abierta.\n');
  setTimeout(() => { if (clients.size === 0) openBrowser(); }, 1200);
});
