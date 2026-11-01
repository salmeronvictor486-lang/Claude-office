# ✳ Claude Office

Una oficina vista desde arriba llena de Claudes. Cada vez que escribes a Claude, los agentes se ponen a trabajar: caminan por la oficina, se sientan en su mesa, van al archivo, a la sala de servidores, a la pizarra… y cuando terminan, se van a por un café. Pulsa sobre cualquiera para ver qué está haciendo.

> Proyecto de fans, no oficial. Todo funciona en tu ordenador (`localhost`).

## Empezar (3 pasos)

1. **Instala Node.js** (versión LTS) desde https://nodejs.org si no lo tienes.
2. **Doble clic en `Abrir Claude Office.bat`** (en Mac, `Abrir Claude Office.command`). Se abre la oficina en el navegador. Deja la ventana negra abierta mientras la uses.
3. **Pulsa «Conectar» → «Aceptar y conectar».**
   - **Claude Code** queda conectado al momento. Ciérralo y vuelve a abrirlo, y listo.
   - **Chat de claude.ai**: se abre Tampermonkey con el botón «Instalar». Púlsalo y recarga claude.ai. Si no tienes Tampermonkey, instálalo antes desde https://www.tampermonkey.net (en Chrome, activa también «Permitir scripts de usuario» en los detalles de la extensión).

Para desconectar, vuelve a pulsar el botón (ahora pone «Conectado») → «Desconectar».

### Detalles

- El botón añade unos hooks a `~/.claude/settings.json`. Antes hace copia de seguridad y respeta los hooks que ya tengas. Funciona en la terminal, en VS Code y en la app de escritorio de Claude Code.
- Si la oficina está cerrada, Claude Code funciona igual: el hook no bloquea ni imprime nada.
- Si mueves la carpeta de sitio, vuelve a pulsar «Conectar» (los hooks guardan la ruta).
- El botón solo acepta peticiones de la propia oficina: ninguna web puede tocar tu configuración.
- claude.ai no tiene hooks: el puente detecta cuándo envías un mensaje y cuándo Claude termina. Si claude.ai cambia su web, puede dejar de funcionar. Pon `SEND_TEXT = false` en el script si no quieres que se vea el texto de tus prompts. La app de escritorio del chat no admite scripts.
- También se puede hacer a mano: `node server.js` y `npm run hooks:install` / `npm run hooks:uninstall`.

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
- `scripts/install-hooks.js`: conecta/desconecta Claude Code (lo usa el botón)
- `Abrir Claude Office.bat` / `.command`: abrir con doble clic
- `userscript/claude-office.user.js`: puente para claude.ai
