// ==UserScript==
// @name         Claude Office · puente para claude.ai
// @namespace    claude-office
// @version      1.0.0
// @description  Avisa a tu Claude Office local cuando envías un mensaje en claude.ai y cuando Claude termina de responder.
// @match        https://claude.ai/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @connect      127.0.0.1
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const OFFICE = 'http://localhost:4747/event';
  const SEND_TEXT = true; // ponlo en false si no quieres que se vea el texto de tus prompts en la oficina

  const post = (ev) => {
    try {
      GM_xmlhttpRequest({
        method: 'POST', url: OFFICE, timeout: 1500,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ source: 'chat', session: location.pathname, ...ev }),
      });
    } catch (_) { /* la oficina está cerrada: no pasa nada */ }
  };

  const composer = () => document.querySelector('div[contenteditable="true"]');
  let lastPromptAt = 0;
  let streaming = false;

  function sendPrompt(text) {
    const now = Date.now();
    if (now - lastPromptAt < 1200) return; // Enter + clic del botón = un solo envío
    lastPromptAt = now;
    post({ kind: 'prompt', prompt: SEND_TEXT ? (text || '(mensaje)').trim().slice(0, 600) : '(mensaje privado)' });
  }

  // Enter dentro del cuadro de texto (fase de captura: leemos el texto antes de que se borre)
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.shiftKey || e.isComposing) return;
    const box = e.target && e.target.closest && e.target.closest('div[contenteditable="true"]');
    if (!box) return;
    const text = box.innerText.trim();
    if (text) sendPrompt(text);
  }, true);

  // Clic en el botón de enviar
  document.addEventListener('click', (e) => {
    const btn = e.target && e.target.closest && e.target.closest('button');
    if (!btn) return;
    const label = (btn.getAttribute('aria-label') || '').toLowerCase();
    if (/send|enviar|envia/.test(label)) {
      const box = composer();
      const text = box ? box.innerText.trim() : '';
      sendPrompt(text);
    }
  }, true);

  // ¿Está Claude escribiendo la respuesta?
  const isStreaming = () =>
    !!document.querySelector('[data-is-streaming="true"]') ||
    !!document.querySelector('button[aria-label*="Stop" i], button[aria-label*="Detener" i], button[aria-label*="Atura" i]');

  setInterval(() => {
    const now = isStreaming();
    if (now && !streaming && Date.now() - lastPromptAt > 4000) {
      // Respuesta que empieza sin que hayamos visto el envío (reintentar, editar…)
      post({ kind: 'prompt', prompt: 'Regenerando respuesta' });
      lastPromptAt = Date.now();
    }
    if (!now && streaming) post({ kind: 'stop' });
    streaming = now;
  }, 400);
})();
