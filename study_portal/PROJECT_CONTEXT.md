# PROJECT_CONTEXT: CEH v12 Hacker Portal

## 1. Overview
This project is a high-performance, responsive static website designed to serve as a comprehensive study portal for the CEH v12 (Certified Ethical Hacker) certification. The project ingests raw text lab notes (`ModuleX.txt`) and transforms them into a structured, searchable, and aesthetically themed web interface.

The project is designed to be maintained by AI agents, ensuring UI consistency across all modules through template-driven architecture.

## 2. Technical Architecture
- **Language:** HTML5, CSS3, JavaScript (vanilla).
- **Automation:** Python (executed via Hermes Agent tool).
- **Architecture:** 
  - **Master Template (`layout.html` logic):** A centralized skeleton defining the `<nav>`, `<main>`, `<script>`, and `<head>` elements.
  - **CSS Design System (`style.css`):** Shared across all pages.
  - **Page Assembly:** Content is injected into the master template at runtime/generation, ensuring UI updates are propagated across the entire site instantly.

## 3. UI/UX Design System (The "CRT Hacker" Aesthetic)
The portal is designed for high readability in security environments, emphasizing a "Hacker-OS" aesthetic.

- **Theme Engine:** Supports both Dark (CRT Green) and Light (Warm Paper) themes.
- **Theme Persistence:** Theme preference is stored in the user's browser `localStorage`.
- **CSS Classes:**
  - `.window`: Main content container.
  - `.module-header`: Page title area.
  - `.section-card`: Grouping for lab tasks.
  - `.tool-tag`: Highlight for tool names (e.g., Nmap, Metasploit).
  - `pre > code`: Styling for terminal commands (pink/magenta).
- **Effects:** CSS scanline effect on body, glassmorphism for nav.

## 4. SOP: Standard Operating Procedure for New Modules
When adding a new module (e.g., Module 05), follow these steps strictly to avoid UI fragmentation:

### Step 1: Ingestion
Read the raw file to understand the content.
```python
from hermes_tools import read_file
# Always read fully to satisfy safety requirements
read_file("Module5.txt")
```

### Step 2: Content Transformation
Extract the content into a semantic HTML string. Use the following structure:
```html
<div class="module-header">
    <span>CEH v12 - Module 05</span>
    <h2>[Module Title]</h2>
</div>

<section class="lab-task">
    <h3>[Task Name]</h3>
    <div class="section-card">
        <span class="tool-tag">[Tool Name]</span>
        <pre><code>[Command 1]
[Command 2]</code></pre>
    </div>
</section>
```

### Step 3: Page Assembly & Generation
Use the established Python helper to inject the content into the global template.

```python
from hermes_tools import write_file, read_file

# Define the Master Layout Template
LAYOUT_TEMPLATE = """...[Layout Content]..."""

def generate_page(title, content):
    return LAYOUT_TEMPLATE.replace("{{TITLE}}", title).replace("{{CONTENT}}", content)

# Define Content
MOD_X_CONTENT = "..." # Extracted HTML Fragment

# Write Page
write_file("study_portal/module_0X.html", generate_page("Module X", MOD_X_CONTENT))
```

## 5. Agent Rules & Personality
- **Maintain Consistency:** Never write HTML/CSS directly into module files. Always use the assembly logic.
- **Exhaustiveness:** Extract **every** command, script argument, and technique mentioned in the raw `ModuleX.txt` file. Do not summarize commands away; the user needs a technical reference.
- **Safety First:** When using `write_file`, always `read_file` the target first to satisfy the safety check in the kernel.
- **User Persona:** The user prefers terse, action-first answers; engineering depth over toy demos; copy-pasteable code.
- **File System:** Maintain all work under `/mnt/windows/CEH Practical/study_portal/`.

## 6. Repository File Manifest
- `/index.html`: Dashboard with progress tracking.
- `/module_02.html`: Footprinting/Recon.
- `/module_03.html`: Network Scanning.
- `/module_04.html`: Enumeration.
- `/module_05.html`: Vulnerability Analysis.
- `/module_06.html`: System Hacking.
- `/module_07.html`: Malware Threats.
- `/module_08.html`: Sniffing.
- `/module_09.html`: Social Engineering.
- `/module_10.html`: Denial-of-Service.
- `/module_11.html`: Session Hijacking.
- `/module_12.html`: Evading IDS, Firewalls, and Honeypots.
- `/module_13.html`: Hacking Web Servers.
- `/module_14.html`: Hacking Web Applications.
- `/module_15.html`: SQL Injection.
- `cheat_sheet.html`: Consolidated command reference across all modules.
- `/style.css`: Global Design System.
- `/README.md`: Public-facing repo documentation.
- `/PROJECT_CONTEXT.md`: This file.

## 7. Troubleshooting & Debugging
- **Refusing to Overwrite:** If a tool call refuses to overwrite, it means the kernel state doesn't have the file loaded. Call `read_file()` on the target first.
- **NameError:** If module content variables (`MOD_XX_CONTENT`) are missing, it means the kernel session was reset. Re-read the module source file and re-define the content variable before generating the page.
- **UI Breaks:** Ensure CSS variables in `style.css` are updated for both `[data-theme="light"]` and default `:root`.

## 8. Style Guide & CSS Class Reference
| Class | Description |
| :--- | :--- |
| `.window` | CRT-styled window container |
| `.module-header` | Page Title Section |
| `.section-card` | Logical content section |
| `.tool-tag` | Small badge for tool names |
| `pre > code` | Monospaced block for commands |
| `.content-body` | Main content area container |

## 9. Future Roadmap
1. Continue ingesting remaining modules (16-20).
2. Implement search functionality using a simple JSON index in the future.
3. Optimize CSS for mobile responsiveness.
4. Improve command block copy-to-clipboard functionality.

---
*End of Context Document.*
