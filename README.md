# ✳ Claude Office

Una oficina vista desde arriba llena de Claudes. Cada vez que escribes a Claude, los agentes se ponen a trabajar: caminan por la oficina, se sientan en su mesa, van al archivo, a la sala de servidores, a la pizarra… y cuando terminan, se van a por un café. Pulsa sobre cualquiera para ver qué está haciendo.

> Proyecto de fans, no oficial. Todo funciona en tu ordenador (`localhost`).

## Arrancar

Necesitas Node 18 o superior. No hay dependencias que instalar.

```bash
node server.js
```

Abre **http://localhost:4747**. Si abres `index.html` sin el servidor, se ve en modo demo.

## Conectar Claude Code

Instala los hooks una vez (hace copia de tu `~/.claude/settings.json` y respeta los hooks que ya tengas):

```bash
npm run hooks:install
```

Reinicia Claude Code. Funciona en la terminal, en VS Code y en la app de escritorio. Para quitarlos:

```bash
npm run hooks:uninstall
```

Si la oficina está cerrada, Claude Code funciona igual: el hook no bloquea ni imprime nada.

## Conectar el chat de claude.ai

claude.ai no tiene hooks, así que se usa un userscript:

1. Instala la extensión **Tampermonkey** en tu navegador.
2. Crea un script nuevo y pega el contenido de `userscript/claude-office.user.js`.
3. Cuando envías un mensaje en claude.ai, «Chat» se pone a trabajar, y cuando Claude termina de responder, lo celebra.

Si no quieres que el texto de tus prompts aparezca en la oficina, pon `SEND_TEXT = false` en el script. Ojo: si claude.ai cambia su web, el script puede dejar de detectar los mensajes. La app de escritorio de Claude (el chat) no admite userscripts.

## Quién hace qué

| Agente | Se activa con | Dónde trabaja |
|---|---|---|
| **Code** | Tus prompts en Claude Code | Su mesa, y reparte el trabajo (verás volar los papeles) |
| **Chat** | Tus mensajes en claude.ai | Su mesa |
| **Lector** | `Read`, `Grep`, `Glob` | El archivo |
| **Editor** | `Edit` (mesa), `Write` (impresora) | Su mesa / impresora |
| **Terminal** | `Bash` | La sala de servidores |
| **Web** | `WebSearch`, `WebFetch` | El puesto web |
| **Plan** | `TodoWrite`, modo plan | La pizarra (escribe tu lista de tareas real) |
| **Conector** | Herramientas MCP (`mcp__…`) | El panel de conectores |
| **Becarios** | Subagentes (`Task` / `Agent`) | Entran por la puerta, se sientan en una mesa libre y se van al acabar |

Cuando Claude Code te pide permiso, «Code» levanta la mano ✋ hasta que respondes.

## Enviar eventos desde otros sitios (n8n, scripts…)

```bash
curl -X POST localhost:4747/event -H "Content-Type: application/json" \
  -d '{"source":"chat","kind":"prompt","prompt":"Nuevo lead de la web"}'
```

Tipos (`kind`): `prompt`, `tool_start`, `tool_end`, `stop`, `notify`, `message`. Con `"agent":"Terminal"` y `"text":"…"` haces hablar a un agente concreto.

## Archivos

- `index.html`: la oficina (un solo archivo, también funciona en el móvil)
- `server.js`: servidor local sin dependencias (SSE)
- `hooks/send.js`: hook que reenvía los eventos de Claude Code
- `scripts/install-hooks.js`: instalador de los hooks
- `userscript/claude-office.user.js`: puente para claude.ai
