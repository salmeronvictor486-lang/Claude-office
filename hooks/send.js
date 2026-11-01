#!/usr/bin/env node
/*
 * Hook de Claude Code → Claude Office.
 * Lee el JSON que Claude Code pasa por stdin y lo reenvía al servidor local.
 * Nunca escribe nada por stdout y siempre sale con código 0, así que
 * si la oficina está cerrada Claude Code sigue funcionando igual.
 */
const http = require('http');
const PORT = Number(process.env.CLAUDE_OFFICE_PORT) || 4747;

const bail = () => process.exit(0);
setTimeout(bail, 1500).unref();

let data = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', c => { data += c; });
process.stdin.on('error', bail);
process.stdin.on('end', () => {
  if (!data.trim()) return bail();
  const req = http.request({
    host: '127.0.0.1', port: PORT, path: '/hook/claude-code', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    timeout: 800,
  }, res => { res.resume(); res.on('end', bail); });
  req.on('error', bail);
  req.on('timeout', () => { req.destroy(); bail(); });
  req.end(data);
});
