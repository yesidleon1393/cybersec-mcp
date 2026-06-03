#!/usr/bin/env node
/**
 * Cybersecurity Professor MCP Server
 * Prof. Null — Tu profesor de ciberseguridad impulsado por Claude AI
 *
 * Herramientas expuestas:
 *  - ask_professor      → Pregunta libre al profesor (streaming)
 *  - get_roadmap        → Ruta de aprendizaje personalizada
 *  - get_cheatsheet     → Cheatsheet de herramienta específica
 *  - explain_attack     → Explicación técnica de un ataque/vulnerabilidad
 *  - generate_lab       → Genera un laboratorio práctico paso a paso
 *  - ctf_hint           → Pistas para CTF challenges
 *  - list_tools         → Lista herramientas por categoría
 *  - search_cve         → Busca CVEs y explica vulnerabilidades
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { PROFESSOR_SYSTEM_PROMPT } from "./professor.js";
import { TOOLS_DATA } from "./data/tools.js";
import { ROADMAP_DATA } from "./data/roadmap.js";

// ─── Init ────────────────────────────────────────────────────────────────────

const client = new Anthropic();

const server = new McpServer({
  name: "cybersecurity-professor",
  version: "1.0.0",
});

// ─── Helper: call Claude as Prof. Null ───────────────────────────────────────

async function askProfNull(userPrompt, extraContext = "") {
  const systemPrompt = extraContext
    ? `${PROFESSOR_SYSTEM_PROMPT}\n\n## Contexto adicional para esta consulta:\n${extraContext}`
    : PROFESSOR_SYSTEM_PROMPT;

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  return message.content[0].type === "text" ? message.content[0].text : "";
}

// ─── Tool: ask_professor ──────────────────────────────────────────────────────

server.tool(
  "ask_professor",
  "Pregunta cualquier cosa al Prof. Null sobre ciberseguridad, hacking, pentesting, herramientas, conceptos, técnicas o carrera. El profesor responde sin censuras con profundidad técnica real.",
  {
    question: z
      .string()
      .describe("Tu pregunta sobre ciberseguridad (cualquier nivel, sin filtros)"),
    level: z
      .enum(["principiante", "intermedio", "avanzado", "experto"])
      .optional()
      .describe("Tu nivel actual (opcional — el profesor lo detecta solo)"),
    language: z
      .enum(["es", "en"])
      .optional()
      .default("es")
      .describe("Idioma de respuesta (default: español)"),
  },
  async ({ question, level, language }) => {
    const levelCtx = level
      ? `El usuario se identifica como nivel: ${level}. Ajusta la profundidad técnica en consecuencia.`
      : "";
    const langCtx =
      language === "en"
        ? "Respond in English."
        : "Responde en español latinoamericano técnico.";

    const prompt = `${question}`;
    const context = [levelCtx, langCtx].filter(Boolean).join("\n");

    const response = await askProfNull(prompt, context);

    return {
      content: [{ type: "text", text: response }],
    };
  }
);

// ─── Tool: get_roadmap ────────────────────────────────────────────────────────

server.tool(
  "get_roadmap",
  "Genera una ruta de aprendizaje personalizada de ciberseguridad basada en tu nivel actual, objetivos y tiempo disponible.",
  {
    current_level: z
      .enum(["cero", "principiante", "intermedio", "avanzado"])
      .describe("Tu nivel actual de conocimiento"),
    goal: z
      .enum([
        "pentester-general",
        "web-hacking",
        "red-team",
        "malware-analysis",
        "forense-digital",
        "bug-bounty",
        "blue-team-soc",
        "ctf-competitor",
        "cloud-security",
        "exploit-dev",
      ])
      .describe("Tu objetivo o especialización deseada"),
    time_available: z
      .enum(["1h-dia", "2h-dia", "4h-dia", "full-time"])
      .describe("Tiempo diario disponible para estudiar"),
    budget: z
      .enum(["cero", "bajo", "medio", "alto"])
      .optional()
      .default("bajo")
      .describe("Presupuesto para cursos/labs/certs (cero=solo gratis)"),
  },
  async ({ current_level, goal, time_available, budget }) => {
    const roadmapContext = JSON.stringify(ROADMAP_DATA, null, 2);

    const prompt = `Genera una ruta de aprendizaje DETALLADA y PERSONALIZADA con estos parámetros:
- Nivel actual: ${current_level}
- Objetivo/especialización: ${goal}
- Tiempo disponible: ${time_available}
- Presupuesto: ${budget}

Incluye:
1. Fase por fase con duración estimada
2. Recursos específicos (gratuitos primero si budget=cero o bajo)
3. Herramientas a dominar en cada fase
4. Plataformas de práctica recomendadas
5. Certificaciones recomendadas (ordenadas por ROI)
6. Hitos medibles para saber que avanzaste
7. Errores comunes a evitar

Usa los datos de referencia disponibles pero adapta según los parámetros dados.
Sé específico y accionable, no genérico.`;

    const response = await askProfNull(prompt, `Datos de referencia:\n${roadmapContext}`);

    return {
      content: [{ type: "text", text: response }],
    };
  }
);

// ─── Tool: get_cheatsheet ─────────────────────────────────────────────────────

server.tool(
  "get_cheatsheet",
  "Obtén un cheatsheet completo y actualizado de cualquier herramienta de hacking/seguridad con ejemplos reales de uso en pentesting.",
  {
    tool_name: z
      .string()
      .describe(
        "Nombre de la herramienta (ej: nmap, burpsuite, metasploit, hashcat, sqlmap, ffuf, nuclei, crackmapexec, bloodhound, impacket, etc.)"
      ),
    context: z
      .enum([
        "general",
        "web-pentesting",
        "network-pentesting",
        "active-directory",
        "wireless",
        "malware-analysis",
        "ctf",
        "evasion",
      ])
      .optional()
      .default("general")
      .describe("Contexto de uso para filtrar los comandos más relevantes"),
    include_evasion: z
      .boolean()
      .optional()
      .default(false)
      .describe("Incluir técnicas de evasión de detección para la herramienta"),
  },
  async ({ tool_name, context, include_evasion }) => {
    const toolsRef = TOOLS_DATA[tool_name.toLowerCase()] || null;
    const refContext = toolsRef
      ? `Datos de referencia para ${tool_name}:\n${JSON.stringify(toolsRef, null, 2)}`
      : "";

    const evasionNote = include_evasion
      ? "Incluye también una sección de técnicas de evasión/bypass de IDS/AV/WAF específicas para esta herramienta."
      : "";

    const prompt = `Genera un cheatsheet COMPLETO y PROFESIONAL de la herramienta: **${tool_name}**

Contexto de uso: ${context}

El cheatsheet debe incluir:
1. Descripción breve y casos de uso en pentesting real
2. Instalación/setup (múltiples OS si aplica)
3. Sintaxis básica y flags más importantes
4. Comandos organizados por caso de uso (con ejemplos reales, no genéricos)
5. Output de ejemplo para comandos clave
6. Combinaciones con otras herramientas del mismo workflow
7. Tips avanzados y flags que pocos conocen
8. Errores comunes y cómo resolverlos
${evasionNote}

Usa bloques de código con comentarios explicativos. Sé específico con IPs/puertos de ejemplo realistas.`;

    const response = await askProfNull(prompt, refContext);

    return {
      content: [{ type: "text", text: response }],
    };
  }
);

// ─── Tool: explain_attack ─────────────────────────────────────────────────────

server.tool(
  "explain_attack",
  "Explicación técnica profunda de cualquier ataque, vulnerabilidad, técnica ofensiva o CVE. Incluye mecanismo interno, PoC, detección y mitigación.",
  {
    attack: z
      .string()
      .describe(
        "Nombre del ataque, vulnerabilidad o técnica (ej: kerberoasting, sql injection, buffer overflow, CVE-2021-44228, pass-the-hash, SSRF, etc.)"
      ),
    depth: z
      .enum(["conceptual", "tecnico", "exploit-dev"])
      .optional()
      .default("tecnico")
      .describe(
        "Profundidad: conceptual=cómo funciona, tecnico=con código/comandos, exploit-dev=nivel bajo con asm/memoria"
      ),
    include_poc: z
      .boolean()
      .optional()
      .default(true)
      .describe("Incluir Proof of Concept funcional con código real"),
    include_defense: z
      .boolean()
      .optional()
      .default(true)
      .describe("Incluir detección y mitigación defensiva"),
  },
  async ({ attack, depth, include_poc, include_defense }) => {
    const depthInstructions = {
      conceptual:
        "Explica conceptualmente cómo funciona, sin entrar en código. Ideal para entender el qué y el por qué.",
      tecnico:
        "Profundidad técnica completa: mecanismo interno, comandos reales, código funcional comentado, flujo de ataque paso a paso.",
      "exploit-dev":
        "Nivel muy bajo: explica la memoria, registros, estructuras de datos del OS, assembly si aplica, desarrollo del exploit desde primitivas.",
    };

    const pocSection = include_poc
      ? "Incluye un PoC funcional (código Python/Bash/PowerShell según corresponda) completamente comentado."
      : "No incluyas PoC de código.";

    const defenseSection = include_defense
      ? `Incluye una sección final de:
- Cómo detectar este ataque (logs, reglas SIEM, IOCs)
- Mitigaciones y hardening
- Herramientas de defensa específicas`
      : "No incluyas sección defensiva.";

    const prompt = `Explica el siguiente ataque/vulnerabilidad con profundidad ${depth}: **${attack}**

Instrucciones de profundidad: ${depthInstructions[depth]}

Estructura tu respuesta así:
1. **¿Qué es?** — Descripción técnica precisa
2. **¿Por qué existe?** — Causa raíz (design flaw, bug, misconfiguration)
3. **Superficie de ataque** — Qué sistemas/versiones/configs son vulnerables
4. **Mecanismo interno** — Cómo funciona paso a paso (con diagramas ASCII si ayuda)
5. **Flujo de ataque real** — Desde reconocimiento hasta explotación
${pocSection}
6. **Variantes y técnicas relacionadas**
7. **Casos reales notables** (CVEs, grupos APT que lo usaron, incidentes públicos)
${defenseSection}`;

    const response = await askProfNull(prompt);

    return {
      content: [{ type: "text", text: response }],
    };
  }
);

// ─── Tool: generate_lab ───────────────────────────────────────────────────────

server.tool(
  "generate_lab",
  "Genera un laboratorio práctico completo y paso a paso para practicar cualquier técnica de ciberseguridad en un entorno controlado.",
  {
    topic: z
      .string()
      .describe(
        "Tema del laboratorio (ej: 'SQL injection manual', 'Active Directory attacks', 'Buffer overflow básico', 'Configurar lab de red team')"
      ),
    environment: z
      .enum(["local-vm", "docker", "cloud-aws", "cloud-gcp", "htb", "tryhackme"])
      .optional()
      .default("local-vm")
      .describe("Ambiente preferido para el laboratorio"),
    duration: z
      .enum(["30min", "1h", "2h", "medio-dia", "dia-completo"])
      .optional()
      .default("2h")
      .describe("Tiempo disponible para el laboratorio"),
    os_attacker: z
      .enum(["kali", "parrot", "ubuntu", "windows", "macos"])
      .optional()
      .default("kali")
      .describe("OS del atacante"),
  },
  async ({ topic, environment, duration, os_attacker }) => {
    const prompt = `Genera un laboratorio práctico COMPLETO para: **${topic}**

Parámetros:
- Ambiente: ${environment}
- Duración estimada: ${duration}
- OS del atacante: ${os_attacker}

El laboratorio debe incluir:

## Setup del Laboratorio
- Lista exacta de VMs/contenedores/servicios necesarios
- Scripts de instalación/configuración
- Topología de red con IPs de ejemplo
- Verificación de que el lab funciona correctamente

## Objetivo del Laboratorio
- Qué aprenderás
- Skills que desarrollarás
- Entregables al completarlo

## Ejercicios Paso a Paso
- Divide en fases progresivas (de lo básico a lo avanzado)
- Para cada paso: qué hacer, por qué, qué esperar como output
- Comandos exactos con explicación
- Checkpoints de verificación

## Desafíos Extra (Para ir más allá)
- 2-3 desafíos opcionales más difíciles
- Variantes para seguir practicando

## Troubleshooting
- Errores comunes y soluciones
- Cómo resetear el lab si algo sale mal

## Teardown
- Cómo limpiar el ambiente después

Sé muy específico con IPs, puertos, usuarios, contraseñas de ejemplo. El lab debe ser reproducible al 100%.`;

    const response = await askProfNull(prompt);

    return {
      content: [{ type: "text", text: response }],
    };
  }
);

// ─── Tool: ctf_hint ───────────────────────────────────────────────────────────

server.tool(
  "ctf_hint",
  "Obtén pistas progresivas para resolver challenges de CTF sin spoilers directos. El profesor te guía sin darte la solución completa... a menos que lo pidas.",
  {
    challenge_description: z
      .string()
      .describe("Descripción del challenge o lo que ves/sabes hasta ahora"),
    category: z
      .enum([
        "web",
        "pwn",
        "reversing",
        "crypto",
        "forensics",
        "osint",
        "misc",
        "network",
        "stego",
        "blockchain",
      ])
      .describe("Categoría del CTF challenge"),
    what_tried: z
      .string()
      .optional()
      .describe("Qué has intentado ya (para no repetir pistas)"),
    hint_level: z
      .enum(["pista-suave", "pista-fuerte", "solucion-completa"])
      .optional()
      .default("pista-suave")
      .describe("Qué tan directa quieres la ayuda"),
    platform: z
      .string()
      .optional()
      .describe("Plataforma del CTF (HackTheBox, TryHackMe, PicoCTF, etc.)"),
  },
  async ({ challenge_description, category, what_tried, hint_level, platform }) => {
    const hintInstructions = {
      "pista-suave":
        "Da solo una pista conceptual. Apunta en la dirección correcta sin decir qué herramienta usar ni el vector exacto. Fomenta el pensamiento.",
      "pista-fuerte":
        "Da una pista técnica específica: menciona la herramienta o técnica a usar, explica por qué, pero no ejecutes los comandos exactos.",
      "solucion-completa":
        "El usuario se rinde y quiere aprender. Da la solución COMPLETA paso a paso con todos los comandos, explicando cada decisión. Al final, explica qué aprender de este challenge.",
    };

    const triedContext = what_tried
      ? `\nYa intentó: ${what_tried}\nNo repitas estas pistas.`
      : "";
    const platformCtx = platform ? `\nPlataforma: ${platform}` : "";

    const prompt = `Ayúdame con este CTF challenge de categoría **${category}**:

${challenge_description}${triedContext}${platformCtx}

Nivel de pista solicitado: **${hint_level}**
Instrucción para el nivel: ${hintInstructions[hint_level]}

Recuerda mantener el balance entre enseñar y no spoilear más de lo pedido.`;

    const response = await askProfNull(prompt);

    return {
      content: [{ type: "text", text: response }],
    };
  }
);

// ─── Tool: list_tools ─────────────────────────────────────────────────────────

server.tool(
  "list_tools",
  "Lista herramientas de ciberseguridad organizadas por categoría, con descripción y casos de uso.",
  {
    category: z
      .enum([
        "todas",
        "reconocimiento",
        "escaneo",
        "web",
        "explotacion",
        "post-explotacion",
        "active-directory",
        "wireless",
        "passwords",
        "forense",
        "reversing",
        "c2-frameworks",
        "evasion",
        "osint",
        "red-team",
      ])
      .optional()
      .default("todas")
      .describe("Categoría de herramientas a listar"),
    include_alternatives: z
      .boolean()
      .optional()
      .default(true)
      .describe("Incluir alternativas y comparativas entre herramientas similares"),
  },
  async ({ category, include_alternatives }) => {
    const prompt = `Lista las herramientas de ciberseguridad más importantes y modernas${
      category !== "todas" ? ` de la categoría: **${category}**` : " (todas las categorías)"
    }.

Para cada herramienta incluye:
- Nombre y versión actual relevante
- Propósito específico (en 1 línea)
- Cuándo usarla vs otras similares
- Ejemplo de comando más usado
- Link/repo oficial
${include_alternatives ? "- Alternativas y cuándo preferirlas" : ""}

Organiza por categorías con headers claros.
Prioriza herramientas activamente mantenidas en 2024-2025.
Incluye herramientas modernas como Havoc, Sliver, NetExec, Ligolo-ng, etc.`;

    const response = await askProfNull(prompt);

    return {
      content: [{ type: "text", text: response }],
    };
  }
);

// ─── Tool: search_cve ────────────────────────────────────────────────────────

server.tool(
  "search_cve",
  "Explica cualquier CVE o vulnerabilidad conocida: cómo funciona técnicamente, si hay exploit público, cómo detectarla y parchearla.",
  {
    cve_or_vuln: z
      .string()
      .describe(
        "CVE ID (ej: CVE-2021-44228) o nombre de vulnerabilidad (ej: Log4Shell, EternalBlue, PrintNightmare)"
      ),
    include_exploit: z
      .boolean()
      .optional()
      .default(true)
      .describe("Incluir análisis del exploit disponible y cómo funciona"),
    affected_systems: z
      .string()
      .optional()
      .describe("Sistema específico que quieres verificar (ej: Apache 2.4.49 en Ubuntu 20.04)"),
  },
  async ({ cve_or_vuln, include_exploit, affected_systems }) => {
    const systemsCtx = affected_systems
      ? `\nEl usuario quiere saber específicamente si este sistema es vulnerable: ${affected_systems}`
      : "";

    const exploitSection = include_exploit
      ? `
6. **Exploit disponible**
   - ¿Hay exploit público? (Exploit-DB, GitHub, Metasploit module)
   - Cómo funciona el exploit técnicamente
   - Ejemplo de uso (con contexto de pentesting autorizado)
   - CVSS score y facilidad de explotación`
      : "";

    const prompt = `Analiza la siguiente vulnerabilidad/CVE: **${cve_or_vuln}**${systemsCtx}

Estructura:
1. **Identificación** — CVE ID, nombre, fecha, descubridor
2. **Resumen ejecutivo** — Qué es, qué permite hacer al atacante
3. **Sistemas afectados** — Versiones exactas vulnerables
4. **Mecanismo técnico** — Cómo funciona la vulnerabilidad internamente (con detalle)
5. **Condiciones de explotación** — Qué necesita el atacante para explotarla
${exploitSection}
7. **Detección** — Cómo saber si fuiste comprometido (IOCs, logs, patrones)
8. **Mitigación y parche** — Versión que corrige, workarounds, configuraciones de hardening
9. **Casos reales** — Grupos APT o incidentes que la usaron (si aplica)

Sé técnico y preciso. Si no tienes datos exactos del CVE, explica el tipo de vulnerabilidad y sé transparente sobre lo que sabes vs. lo que infiere.`;

    const response = await askProfNull(prompt);

    return {
      content: [{ type: "text", text: response }],
    };
  }
);

// ─── Start Server ─────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🛡️  Cybersecurity Professor MCP Server running — Prof. Null está listo.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
