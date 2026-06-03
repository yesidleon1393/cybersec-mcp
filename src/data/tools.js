/**
 * Datos de referencia para herramientas
 * Usado como contexto adicional en get_cheatsheet
 */

export const TOOLS_DATA = {
  nmap: {
    name: "Nmap",
    category: "escaneo",
    repo: "https://nmap.org",
    description: "Network scanner - reconocimiento y enumeración de hosts, puertos y servicios",
    key_flags: [
      "-sS (SYN scan, stealth)",
      "-sV (version detection)",
      "-O (OS detection)",
      "-p- (all ports)",
      "-A (aggressive)",
      "--min-rate (velocidad)",
      "-f (fragment packets)",
      "-D RND:10 (decoy)",
    ],
    common_scripts: ["vuln", "smb-enum-shares", "http-title", "ssl-heartbleed", "dns-brute"],
  },
  metasploit: {
    name: "Metasploit Framework",
    category: "explotacion",
    repo: "https://github.com/rapid7/metasploit-framework",
    description: "Framework de explotación y post-explotación más completo del mercado",
    key_commands: ["search", "use", "info", "show options", "set", "run", "sessions"],
  },
  burpsuite: {
    name: "Burp Suite",
    category: "web",
    repo: "https://portswigger.net/burp",
    description: "Proxy y suite para pentesting de aplicaciones web",
    key_features: ["Proxy", "Repeater", "Intruder", "Scanner (Pro)", "Decoder", "Comparer"],
  },
  hashcat: {
    name: "Hashcat",
    category: "passwords",
    repo: "https://github.com/hashcat/hashcat",
    description: "Password cracker GPU-acelerado más rápido del mundo",
    attack_modes: {
      0: "Dictionary",
      1: "Combinator",
      3: "Brute-force mask",
      6: "Hybrid dict+mask",
      7: "Hybrid mask+dict",
    },
    common_hashes: {
      0: "MD5",
      100: "SHA1",
      1000: "NTLM",
      1800: "sha512crypt",
      2500: "WPA2",
      5600: "NetNTLMv2",
      13100: "Kerberoast",
      18200: "AS-REP",
    },
  },
  sqlmap: {
    name: "SQLMap",
    category: "web",
    repo: "https://github.com/sqlmapproject/sqlmap",
    description: "Automatización de detección y explotación de SQL injection",
  },
  ffuf: {
    name: "ffuf",
    category: "web",
    repo: "https://github.com/ffuf/ffuf",
    description: "Web fuzzer rápido escrito en Go - directorios, parámetros, subdomains",
  },
  nuclei: {
    name: "Nuclei",
    category: "escaneo",
    repo: "https://github.com/projectdiscovery/nuclei",
    description: "Scanner de vulnerabilidades basado en templates YAML - muy rápido y extensible",
  },
  crackmapexec: {
    name: "CrackMapExec / NetExec",
    category: "active-directory",
    repo: "https://github.com/Pennyw0rth/NetExec",
    description:
      "Swiss army knife para pentesting de Active Directory y redes Windows. NetExec es el fork activo.",
  },
  bloodhound: {
    name: "BloodHound",
    category: "active-directory",
    repo: "https://github.com/BloodHoundAD/BloodHound",
    description:
      "Análisis de relaciones en AD para encontrar caminos de ataque hacia Domain Admin",
  },
  impacket: {
    name: "Impacket",
    category: "active-directory",
    repo: "https://github.com/fortra/impacket",
    description: "Suite Python para protocolos de red Windows: SMB, LDAP, Kerberos, etc.",
    key_scripts: [
      "GetUserSPNs.py (Kerberoasting)",
      "GetNPUsers.py (AS-REP)",
      "secretsdump.py (DCSync/SAM)",
      "psexec.py",
      "wmiexec.py",
      "smbclient.py",
    ],
  },
  "aircrack-ng": {
    name: "Aircrack-ng",
    category: "wireless",
    repo: "https://www.aircrack-ng.org",
    description: "Suite completa para auditoría de redes WiFi - captura, inyección, cracking",
  },
  wireshark: {
    name: "Wireshark",
    category: "network",
    repo: "https://www.wireshark.org",
    description: "Analizador de protocolos de red - captura y análisis de tráfico",
  },
  ghidra: {
    name: "Ghidra",
    category: "reversing",
    repo: "https://github.com/NationalSecurityAgency/ghidra",
    description: "Framework de ingeniería inversa de la NSA - gratuito y muy potente",
  },
  havoc: {
    name: "Havoc C2",
    category: "c2",
    repo: "https://github.com/HavocFramework/Havoc",
    description:
      "Framework C2 moderno y open source - alternativa a Cobalt Strike con evasión avanzada",
  },
  sliver: {
    name: "Sliver",
    category: "c2",
    repo: "https://github.com/BishopFox/sliver",
    description: "Framework C2 open source de BishopFox - implants en Go, muy evasivo",
  },
  ligolo: {
    name: "Ligolo-ng",
    category: "tunneling",
    repo: "https://github.com/nicocha30/ligolo-ng",
    description:
      "Tunneling avanzado para pivoting - más limpio y potente que chisel en muchos casos",
  },
  responder: {
    name: "Responder",
    category: "network",
    repo: "https://github.com/lgandx/Responder",
    description: "LLMNR/NBT-NS/mDNS poisoner para capturar hashes NTLMv2 en redes internas",
  },
  certipy: {
    name: "Certipy",
    category: "active-directory",
    repo: "https://github.com/ly4k/Certipy",
    description: "Tool para encontrar y explotar misconfigs en Active Directory Certificate Services (ADCS)",
  },
};
