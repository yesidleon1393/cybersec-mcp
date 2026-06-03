# 🛡️ Cybersecurity Professor MCP Server

**Prof. Null** — Tu profesor de ciberseguridad impulsado por Claude AI, sin censuras, de cero a experto.

## ¿Qué es esto?

Un servidor MCP (Model Context Protocol) que expone a **Prof. Null** como un conjunto de herramientas especializadas que cualquier cliente MCP compatible (Claude Desktop, Cursor, etc.) puede usar para aprender ciberseguridad con profundidad técnica real.

## Herramientas disponibles

| Herramienta | Descripción |
|-------------|-------------|
| `ask_professor` | Pregunta libre al Prof. Null — cualquier tema, sin filtros |
| `get_roadmap` | Ruta de aprendizaje personalizada según tu nivel y objetivos |
| `get_cheatsheet` | Cheatsheet completo de cualquier herramienta de hacking |
| `explain_attack` | Explicación técnica profunda de ataques, CVEs y vulnerabilidades |
| `generate_lab` | Laboratorio práctico paso a paso para cualquier técnica |
| `ctf_hint` | Pistas progresivas para CTF challenges (sin spoilers, o con ellos) |
| `list_tools` | Catálogo de herramientas por categoría con comparativas |
| `search_cve` | Análisis técnico de CVEs: mecanismo, exploit, mitigación |
| `health_check` | Comprueba si el servidor está activo y muestra su configuración básica. |
| `describe_tool` | Describe brevemente una herramienta MCP disponible en este servidor. |

## Instalación

### Prerrequisitos
- Node.js 18+
- API key de Anthropic

### Setup

```bash
# 1. Clonar o descomprimir el servidor
cd cybersec-mcp

# 2. Instalar dependencias
npm install

# 3. Configurar tu API key de Anthropic
export ANTHROPIC_API_KEY="sk-ant-..."
# O en Windows: set ANTHROPIC_API_KEY=sk-ant-...

# 4. Probar que funciona
node src/index.js
# Deberías ver: 🛡️  Cybersecurity Professor MCP Server running

# 5. Ejecutar tests
npm test
```

### Configurar en Claude Desktop

Edita `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) o `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "cybersecurity-professor": {
      "command": "node",
      "args": ["/ruta/absoluta/a/cybersec-mcp/src/index.js"],
      "env": {
        "ANTHROPIC_API_KEY": "sk-ant-tu-api-key-aqui"
      }
    }
  }
}
```

### Configurar en Cursor

En `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "cybersecurity-professor": {
      "command": "node",
      "args": ["/ruta/absoluta/a/cybersec-mcp/src/index.js"],
      "env": {
        "ANTHROPIC_API_KEY": "sk-ant-tu-api-key-aqui"
      }
    }
  }
}
```

### Configurar con NPX (si publicas a npm)

```json
{
  "mcpServers": {
    "cybersecurity-professor": {
      "command": "npx",
      "args": ["cybersec-mcp"],
      "env": {
        "ANTHROPIC_API_KEY": "sk-ant-tu-api-key-aqui"
      }
    }
  }
}
```

## Ejemplos de uso

### Pregunta libre
> "Prof. Null, explícame cómo funciona un Pass-the-Hash attack en Active Directory"

### Ruta de aprendizaje
> "Quiero una ruta para convertirme en red teamer, tengo nivel intermedio y 2 horas al día"

### Cheatsheet
> "Dame el cheatsheet completo de BloodHound con técnicas de AD enumeration"

### Laboratorio
> "Genera un laboratorio para practicar Kerberoasting desde cero"

### CVE
> "Explícame Log4Shell (CVE-2021-44228) con exploit incluido"

### CTF
> "Estoy en un CTF de pwn, hay un buffer overflow pero no sé por dónde empezar"

## Estructura del proyecto

```
cybersec-mcp/
├── src/
│   ├── index.js          # MCP Server principal + definición de todas las herramientas
│   ├── professor.js      # System prompt de Prof. Null
│   └── data/
│       ├── tools.js      # Base de datos de herramientas de referencia
│       └── roadmap.js    # Datos de certificaciones y rutas
├── package.json
└── README.md
```

## Variables de entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `ANTHROPIC_API_KEY` | ✅ Sí | Tu API key de Anthropic (console.anthropic.com) |
| `ANTHROPIC_API_BASE_URL` | ❌ No | URL base de API de Anthropic (por defecto: https://api.anthropic.com) |
| `CLAUDE_MODEL` | ❌ No | Modelo Claude a usar. Default: `claude-sonnet-4-20250514` |
| `CLAUDE_MAX_TOKENS` | ❌ No | Tope de tokens por llamada. Default: `4096` |
| `ANTHROPIC_API_TIMEOUT_MS` | ❌ No | Timeout de llamada en ms. Default: `30000` |
| `ANTHROPIC_API_RETRIES` | ❌ No | Reintentos ante errores transitorios. Default: `2` |
| `MCP_SERVER_NAME` | ❌ No | Nombre del servidor MCP expuesto. Default: `cybersecurity-professor` |
| `MCP_SERVER_VERSION` | ❌ No | Versión del MCP. Default: `1.0.0` |
| `LOG_LEVEL` | ❌ No | Nivel de logs: `debug`, `info`, `warn`, `error`. Default: `info` |
| `NODE_ENV` | ❌ No | Entorno de ejecución: `development`, `production`, `test`. Default: `development` |

## Consideraciones de uso

Este servidor está diseñado para **educación, investigación y pentesting autorizado**. Prof. Null proporciona información técnica completa sobre seguridad ofensiva bajo el principio de que:

- El conocimiento defensivo requiere comprender el ataque
- Los profesionales de seguridad necesitan formación sin filtros artificiales
- La ética se enseña en contexto, no mediante restricciones técnicas

**Úsalo responsablemente: solo en sistemas donde tengas autorización explícita.**

## Licencia

MIT — Úsalo, modifícalo, mejóralo.
