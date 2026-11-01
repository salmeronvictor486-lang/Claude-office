# ✳ Claude Office

Una oficina vista desde arriba llena de Claudes. Cada vez que escribes a Claude, los agentes se ponen a trabajar: caminan por la oficina, se sientan en su mesa, van al archivo, a la sala de servidores, a la pizarra… y cuando terminan, se van a por un café. Pulsa sobre cualquiera para ver qué está haciendo.

> Proyecto de fans, no oficial. Todo funciona en tu ordenador: nada sale de `localhost`.

## Índice

1. [Instalación y primera vez](#1-instalación-y-primera-vez)
   - [Windows](#-windows--primera-vez)
   - [Linux](#-linux--primera-vez)
2. [Ya lo tengo instalado: volver a usarlo](#2-ya-lo-tengo-instalado-volver-a-usarlo)
   - [Windows](#-windows--volver-a-usarlo)
   - [Linux](#-linux--volver-a-usarlo)
3. [Conectar también el chat de claude.ai (opcional)](#3-conectar-también-el-chat-de-claudeai-opcional)
4. [Actualizar a la última versión](#4-actualizar-a-la-última-versión)
5. [Si algo no funciona](#5-si-algo-no-funciona)
6. [Desconectar o desinstalar](#6-desconectar-o-desinstalar)
7. [Quién hace qué en la oficina](#7-quién-hace-qué-en-la-oficina)

---

## 1. Instalación y primera vez

Esto solo se hace **una vez**. Tardas unos 10 minutos.

### 🪟 Windows · primera vez

**Paso 1. Instala Node.js** (es lo que hace funcionar la oficina)

1. Entra en https://nodejs.org/es
2. Descarga la versión **LTS** (el botón grande de la izquierda).
3. Abre el archivo descargado y pulsa **Siguiente** en todo hasta **Finalizar**.

**Paso 2. Instala Git** (para descargar el proyecto)

1. Entra en https://git-scm.com/download/win
2. Descarga el instalador y pulsa **Next** en todo hasta **Finish**.

**Paso 3. Abre PowerShell**

Pulsa la tecla **Windows**, escribe `PowerShell` y pulsa **Enter**. Se abre una ventana azul o negra donde se escriben los comandos.

Comprueba que Node está instalado escribiendo esto y pulsando **Enter**:

```bash
node -v
```

Tiene que salir algo como `v22.x.x`. Si dice que no lo reconoce, cierra PowerShell, vuelve a abrirlo y prueba otra vez.

**Paso 4. Descarga el proyecto**

Escribe estos comandos **uno a uno**, pulsando **Enter** después de cada uno:

```bash
cd $HOME
```

```bash
git clone -b claude/busy-edison-6azmx5 https://github.com/salmeronvictor486-lang/Claude-office.git
```

Como el repositorio es privado, se abrirá una ventana para **iniciar sesión en GitHub**. Inicia sesión y autoriza. Al terminar tendrás la carpeta `C:\Users\TU_USUARIO\Claude-office`.

**Paso 5. Abre la oficina**

1. Abre el **Explorador de archivos** y entra en `C:\Users\TU_USUARIO\Claude-office`.
2. Haz **doble clic** en **`Abrir Claude Office.bat`**.
   - Si Windows dice «Windows protegió su PC», pulsa **Más información** → **Ejecutar de todas formas**.
3. Se abre una **ventana negra** y, a los pocos segundos, el navegador con la oficina.
   - Si el navegador no se abre solo, entra en **http://localhost:4747**.

⚠️ **No cierres la ventana negra.** Mientras esté abierta, la oficina funciona.

**Paso 6. Conecta tu Claude**

1. En la oficina aparece la ventana **«Claude Office quiere conectarse a tu Claude»**.
   - Si no aparece, pulsa el botón negro **«Conectar»** de arriba a la derecha.
2. Pulsa **«Aceptar y conectar»**.
3. En la fila «Claude Code» tiene que poner **«Conectado»** en verde.
4. Si se abre una pestaña de Tampermonkey y no lo tienes instalado, ciérrala por ahora: el chat es opcional (lo tienes en el [apartado 3](#3-conectar-también-el-chat-de-claudeai-opcional)).

**Paso 7. Reinicia Claude Code y pruébalo**

1. Si tenías Claude Code abierto, **ciérralo**.
2. Ábrelo de nuevo y escríbele cualquier cosa.
3. Mira la oficina: **«Code»** se pone a trabajar y reparte tareas al resto. 🎉

---

### 🐧 Linux · primera vez

Los comandos son para **Ubuntu / Debian** (y derivadas como Linux Mint o Pop!_OS).

**Paso 1. Abre una terminal**

Pulsa **Ctrl + Alt + T**.

**Paso 2. Comprueba si tienes Node.js**

```bash
node -v
```

- Si sale `v18` o un número **mayor** → salta al **paso 4**.
- Si no sale nada, o sale un número menor → sigue con el paso 3.

**Paso 3. Instala Node.js y Git**

Escribe estos comandos **uno a uno**. Te pedirá tu contraseña de Linux: al escribirla no se ven los caracteres, es normal.

```bash
sudo apt update
```

```bash
sudo apt install -y curl git
```

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
```

```bash
sudo apt install -y nodejs
```

Comprueba que ha funcionado (tiene que salir `v22.x.x`):

```bash
node -v
```

**Paso 4. Descarga el proyecto**

```bash
cd ~
```

```bash
git clone -b claude/busy-edison-6azmx5 https://github.com/salmeronvictor486-lang/Claude-office.git
```

Como el repositorio es privado, te pedirá:

- **Username**: tu usuario de GitHub.
- **Password**: **no** es tu contraseña, es un **token**. Para crearlo:
  1. En GitHub, entra en tu foto → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token (classic)**.
  2. Ponle un nombre, marca la casilla **`repo`** y pulsa **Generate token**.
  3. Copia el token y pégalo en la terminal con **Ctrl + Shift + V** (no se verá nada al pegarlo) y pulsa **Enter**.

**Paso 5. Abre la oficina**

```bash
cd ~/Claude-office
```

```bash
node server.js
```

Se abre el navegador con la oficina. Si no se abre, entra en **http://localhost:4747**.

⚠️ **No cierres esta terminal.** Mientras esté abierta, la oficina funciona.

**Paso 6. Conecta tu Claude**

1. En la oficina aparece la ventana **«Claude Office quiere conectarse a tu Claude»**.
   - Si no aparece, pulsa el botón negro **«Conectar»** de arriba a la derecha.
2. Pulsa **«Aceptar y conectar»**.
3. En la fila «Claude Code» tiene que poner **«Conectado»** en verde.
4. Si se abre una pestaña de Tampermonkey y no lo tienes instalado, ciérrala por ahora: el chat es opcional (lo tienes en el [apartado 3](#3-conectar-también-el-chat-de-claudeai-opcional)).

**Paso 7. Reinicia Claude Code y pruébalo**

1. Si tenías Claude Code abierto, ciérralo (escribe `/exit` o pulsa **Ctrl + C** dos veces).
2. Abre **otra terminal** (Ctrl + Alt + T) y arranca Claude Code:

   ```bash
   claude
   ```

3. Escríbele cualquier cosa y mira la oficina: **«Code»** se pone a trabajar. 🎉

**Paso 8 (recomendado). Atajo para abrirla con una palabra**

Ejecuta esto **una sola vez**:

```bash
echo "alias oficina='cd ~/Claude-office && node server.js'" >> ~/.bashrc && source ~/.bashrc
```

A partir de ahora, para abrir la oficina solo tendrás que escribir `oficina`.

---

## 2. Ya lo tengo instalado: volver a usarlo

Lo que tienes que hacer **cada vez que enciendas el ordenador** y quieras ver la oficina. No hace falta volver a conectar nada: la conexión se queda guardada.

### 🪟 Windows · volver a usarlo

1. Abre la carpeta **`C:\Users\TU_USUARIO\Claude-office`**.
2. Haz **doble clic** en **`Abrir Claude Office.bat`**.
3. Se abre la ventana negra y el navegador con la oficina (si no, entra en **http://localhost:4747**).
4. Comprueba arriba a la derecha que pone **● En directo** y **● Conectado**.
5. Abre **Claude Code** (o claude.ai) y trabaja como siempre. Los agentes se moverán solos.
6. Para cerrar la oficina, cierra la ventana negra.

💡 **Truco:** haz clic derecho en `Abrir Claude Office.bat` → **Enviar a** → **Escritorio (crear acceso directo)**. Así la abres desde el escritorio con doble clic.

### 🐧 Linux · volver a usarlo

1. Abre una terminal con **Ctrl + Alt + T**.
2. Arranca la oficina:

   ```bash
   cd ~/Claude-office && node server.js
   ```

   O, si hiciste el atajo del paso 8:

   ```bash
   oficina
   ```

3. Se abre el navegador con la oficina (si no, entra en **http://localhost:4747**).
4. Comprueba arriba a la derecha que pone **● En directo** y **● Conectado**.
5. Abre **Claude Code** en **otra terminal** (`claude`), o claude.ai, y trabaja como siempre.
6. Para cerrar la oficina, pulsa **Ctrl + C** en la terminal donde la abriste.

> ✅ **Orden importante:** primero abre la oficina y **después** Claude Code. Si Claude Code ya estaba abierto y los agentes no se mueven, ciérralo y vuelve a abrirlo.

---

## 3. Conectar también el chat de claude.ai (opcional)

Sirve para que el agente **«Chat»** trabaje cuando escribes en **claude.ai desde el navegador**. No funciona en la app de escritorio del chat.

**Paso 1. Instala la extensión Tampermonkey**

- **Chrome / Chromium / Edge / Brave:**
  1. Busca «Tampermonkey» en la Chrome Web Store y pulsa **Añadir a Chrome**.
  2. Escribe `chrome://extensions` en la barra de direcciones y pulsa **Enter**.
  3. En Tampermonkey pulsa **Detalles** y activa **«Permitir scripts de usuario»**. Si esa opción no aparece, activa **«Modo de desarrollador»** arriba a la derecha.
- **Firefox:** instala Tampermonkey desde https://addons.mozilla.org. No hace falta nada más.

**Paso 2. Instala el puente**

1. Con la oficina abierta, pulsa **«Conectado»** (o **«Conectar»**) arriba a la derecha.
2. En la fila **«Chat de claude.ai»** pulsa **«Instalar»**.
3. Se abre una pestaña de Tampermonkey: pulsa **«Instalar»**.

**Paso 3. Pruébalo**

1. Abre (o recarga) **https://claude.ai** y envía un mensaje.
2. Si Tampermonkey te pregunta si permites la conexión, pulsa **«Permitir siempre»**.
3. Mira la oficina: **«Chat»** se pone a trabajar y, en la ventana de «Conectar», la fila del chat pasa a **«Conectado»**.

> 🔒 Si no quieres que el texto de tus mensajes se vea en la oficina, abre el script en Tampermonkey y cambia `SEND_TEXT = true` por `SEND_TEXT = false`.

---

## 4. Actualizar a la última versión

Cierra la oficina (cierra la ventana negra o pulsa **Ctrl + C**) y luego:

**Windows (PowerShell):**

```bash
cd $HOME\Claude-office
```

```bash
git pull
```

**Linux (terminal):**

```bash
cd ~/Claude-office
```

```bash
git pull
```

Vuelve a abrir la oficina y recarga el navegador con **Ctrl + Shift + R**.

---

## 5. Si algo no funciona

| Qué pasa | Qué hacer |
|---|---|
| Arriba pone **«Sin conexión»** | La ventana negra / terminal de la oficina está cerrada. Vuelve a abrirla ([apartado 2](#2-ya-lo-tengo-instalado-volver-a-usarlo)). Comprueba también que estás en **http://localhost:4747** y no abriendo `index.html` con doble clic. |
| **No aparece la ventana de conectar** | Solo sale sola la primera vez. Pulsa el botón **«Conectar»** de arriba a la derecha. |
| **Los agentes no se mueven al usar Claude Code** | Cierra Claude Code y vuelve a abrirlo **con la oficina ya abierta**. Comprueba que en «Conectar» pone «Claude Code · Conectado». |
| Pone **«Conectado desde otra carpeta»** | Has movido o renombrado la carpeta. Pulsa **«Conectar»** otra vez. |
| Sale **«address already in use»** o **«ya estaba abierta»** | La oficina ya está abierta en otra ventana. Entra en **http://localhost:4747**. |
| **`node` no se reconoce** (Windows) | Cierra PowerShell y vuelve a abrirlo. Si sigue igual, reinstala Node.js (paso 1). |
| **`git clone` da error de contraseña** (Linux) | Tienes que pegar el **token**, no tu contraseña de GitHub (paso 4). |
| El chat de claude.ai no mueve a «Chat» | Revisa que Tampermonkey tenga activado «Permitir scripts de usuario», que el script esté activado y recarga claude.ai. |

---

## 6. Desconectar o desinstalar

- **Desconectar Claude Code:** en la oficina pulsa **«Conectado»** → **«Desconectar»**. Claude Code vuelve a quedar como estaba.
- **Quitar el puente del chat:** en Tampermonkey, elimina el script «Claude Office · puente para claude.ai».
- **Borrar todo:** después de desconectar, borra la carpeta `Claude-office`.

> El botón «Conectar» añade unos hooks en `~/.claude/settings.json` (en Windows, `C:\Users\TU_USUARIO\.claude\settings.json`). Antes de tocar nada hace una copia de seguridad y respeta los hooks que ya tuvieras. Si la oficina está cerrada, Claude Code funciona igual.

---

## 7. Quién hace qué en la oficina

| Agente | Se activa cuando… | Dónde trabaja |
|---|---|---|
| **Code** | Escribes en Claude Code | Su mesa, y reparte el trabajo (verás volar los papeles) |
| **Chat** | Escribes en claude.ai | Su mesa |
| **Lector** | Claude lee o busca en tu código (`Read`, `Grep`, `Glob`) | El archivo |
| **Editor** | Claude edita (`Edit`) o crea archivos (`Write`) | Su mesa / la impresora |
| **Terminal** | Claude ejecuta comandos (`Bash`) | La sala de servidores |
| **Web** | Claude busca o lee en internet | El puesto web |
| **Plan** | Claude hace una lista de tareas o un plan | La pizarra (escribe tu lista real) |
| **Conector** | Claude usa herramientas MCP (n8n, Drive…) | El panel de conectores |
| **Becarios** | Claude lanza subagentes | Entran por la puerta, trabajan y se van al acabar |

Cuando Claude Code te pide permiso, **«Code» levanta la mano ✋** hasta que respondes. Al terminar un encargo celebra «¡Listo!» y suele ir a por un café ☕.

Sin conexión (por ejemplo, abriendo `index.html` directamente) se ve en **modo demo**, y abajo a la derecha puedes simular prompts.

---

### Para curiosos

**Enviar eventos desde otros sitios (n8n, scripts…):**

```bash
curl -X POST localhost:4747/event -H "Content-Type: application/json" -d '{"source":"chat","kind":"prompt","prompt":"Nuevo lead de la web"}'
```

Tipos (`kind`): `prompt`, `tool_start`, `tool_end`, `stop`, `notify`, `message`. Con `"agent":"Terminal"` y `"text":"…"` haces hablar a un agente concreto.

**Archivos del proyecto:**

- `index.html`: la oficina (un solo archivo, también funciona en el móvil).
- `server.js`: servidor local sin dependencias.
- `Abrir Claude Office.bat` / `Abrir Claude Office.command`: abrir con doble clic (Windows / Mac).
- `hooks/send.js`: hook que reenvía los eventos de Claude Code a la oficina.
- `scripts/install-hooks.js`: conecta/desconecta Claude Code (lo usa el botón «Conectar»). A mano: `npm run hooks:install` / `npm run hooks:uninstall`.
- `userscript/claude-office.user.js`: puente para claude.ai.
