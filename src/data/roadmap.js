/**
 * Datos de referencia para rutas de aprendizaje
 */

export const ROADMAP_DATA = {
  certifications: {
    entry: [
      { name: "eJPT", provider: "eLearnSecurity", cost_usd: 200, practical: true, recommended: true },
      { name: "CompTIA Security+", provider: "CompTIA", cost_usd: 392, practical: false },
      { name: "PNPT", provider: "TCM Security", cost_usd: 400, practical: true, recommended: true },
    ],
    mid: [
      { name: "OSCP", provider: "OffSec", cost_usd: 1499, practical: true, industry_standard: true },
      { name: "CRTO", provider: "Zero-Point Security", cost_usd: 500, practical: true, recommended: true },
      { name: "eWPTX", provider: "eLearnSecurity", cost_usd: 400, practical: true },
    ],
    advanced: [
      { name: "OSED", provider: "OffSec", cost_usd: 1499, practical: true, focus: "exploit-dev" },
      { name: "OSEP", provider: "OffSec", cost_usd: 1499, practical: true, focus: "evasion" },
      { name: "OSWE", provider: "OffSec", cost_usd: 1499, practical: true, focus: "web" },
      { name: "CRTE", provider: "AlteredSecurity", cost_usd: 249, practical: true, focus: "active-directory" },
    ],
  },
  platforms: {
    free: [
      { name: "TryHackMe", url: "tryhackme.com", level: "principiante-medio", type: "guided" },
      { name: "HackTheBox", url: "hackthebox.com", level: "medio-avanzado", type: "ctf-style" },
      { name: "PortSwigger Academy", url: "portswigger.net/web-security", level: "todos", type: "web-focused" },
      { name: "PicoCTF", url: "picoctf.org", level: "principiante", type: "ctf" },
      { name: "VulnHub", url: "vulnhub.com", level: "todos", type: "offline-vms" },
    ],
    paid: [
      { name: "HTB Pro Labs", url: "hackthebox.com", type: "full-ad-labs", recommended: true },
      { name: "TCM Security", url: "tcm-sec.com", type: "courses" },
      { name: "OffSec PEN-200", url: "offsec.com", type: "oscp-prep" },
    ],
  },
  specializations: {
    "pentester-general": {
      phases: ["networking", "linux", "scripting", "web-basics", "network-pentesting", "active-directory", "report-writing"],
      key_tools: ["nmap", "metasploit", "burpsuite", "crackmapexec", "bloodhound", "impacket"],
      certs: ["eJPT", "PNPT", "OSCP"],
    },
    "web-hacking": {
      phases: ["http-fundamentals", "owasp-top10", "burpsuite-mastery", "api-security", "advanced-web", "code-review"],
      key_tools: ["burpsuite", "ffuf", "nuclei", "sqlmap", "dalfox"],
      certs: ["eWPT", "eWPTX", "OSWE"],
      resources: ["PortSwigger Academy (gratis y excelente)"],
    },
    "red-team": {
      phases: ["pentesting-base", "c2-frameworks", "evasion", "ad-attacks", "physical", "reporting"],
      key_tools: ["cobalt-strike/havoc/sliver", "mimikatz", "bloodhound", "certify", "rubeus"],
      certs: ["CRTO", "CRTE", "OSEP"],
    },
    "malware-analysis": {
      phases: ["assembly-basics", "pe-format", "static-analysis", "dynamic-analysis", "unpacking", "yara"],
      key_tools: ["ghidra", "x64dbg", "pestudio", "capa", "yara", "volatility"],
      certs: ["GREM"],
    },
    "bug-bounty": {
      phases: ["recon-mastery", "web-hacking", "api-security", "business-logic", "disclosure-process"],
      key_tools: ["burpsuite-pro", "nuclei", "httpx", "subfinder", "ffuf"],
      platforms: ["HackerOne", "Bugcrowd", "Intigriti", "Synack"],
    },
    "exploit-dev": {
      phases: ["c-programming", "assembly", "memory-management", "stack-overflow", "heap-exploitation", "rop-chains", "kernel"],
      key_tools: ["pwntools", "gdb+pwndbg", "ghidra", "ropper"],
      certs: ["OSED", "GXPN"],
      resources: ["pwn.college", "exploit.education", "how2heap"],
    },
  },
};
