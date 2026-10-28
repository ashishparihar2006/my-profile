# Ashish Parihar — PolyThink-Style Bento Portfolio

> **High-Performance Developer Portfolio & Interactive Code Canvas** engineered with modern HTML5, CSS3, and Vanilla JavaScript. Inspired by the [PolyThink](https://www.polyth.ink/) aesthetic, featuring a pitch-black bento grid layout, interactive IDE code canvas, embedded Zsh terminal emulator, interactive logic execution mocks, reactive DOM state widgets, dual live UTC/IST clocks, and Web3Forms contact integration.

**Live Deployment**: [https://ashishparihar2006.github.io/my-profile/](https://ashishparihar2006.github.io/my-profile/)  
**GitHub Repository**: [https://github.com/ashishparihar2006/my-profile](https://github.com/ashishparihar2006/my-profile)  

---

## ⚡ Design System & Visual Architecture (PolyThink Aesthetic)

- **Canvas Background**: `#08090B` (Pitch Black)
- **Surface Bento Cards**: `#0F1217` with subtle 1px border `rgba(255, 255, 255, 0.08)`
- **Electric Cyan Primary Accent**: `#00F2FE` / `#38BDF8`
- **Dynamic Accents**: Status Green (`#10B981`), Indigo Accent (`#6366F1`), Amber Warning (`#F59E0B`)
- **Background Effects**: High-precision SVG dot-matrix grid with responsive cursor spotlight radial glow follower (`#spotlight-cursor`).
- **Typography**:
  - Display: *Space Grotesk*
  - Body / Interface: *Plus Jakarta Sans*
  - Monospace / Terminal: *JetBrains Mono*
- **Accessibility**: Full `:focus-visible` styling, touch-friendly interactive targets (min 44px), WCAG 2.2 AA contrast compliance, and full `prefers-reduced-motion` animation suppression.

---

## 🖥️ Hero Section & Interactive Code Canvas

The Hero section pairs a recruiter-focused profile overview with a PolyThink-style multi-tab interactive code canvas:

1. **Tab 1: `[01] terminal_shell.zsh`**
   - Full Zsh terminal emulator featuring safe text rendering (zero `eval()`, strict `textContent` DOM escaping).
   - Supported commands: `help`, `skills`, `projects`, `fencing`, `contact`, `clear`, `matrix`, `sudo`.
   - Arrow-key command history (`Up` / `Down`), `Tab` key autocomplete, dynamic auto-scrolling, quick-action chips, and synthesized Web Audio mechanical keyboard sounds.
   - Global shortcut: Press `T` from anywhere on the page to focus the terminal.

2. **Tab 2: `[02] fast_logic.py`**
   - Syntax-highlighted Python algorithm preview with line numbers and a one-click clipboard copy button.

3. **Tab 3: `[03] athlete_spec.json`**
   - Athletic telemetry and competitive fencing specifications (2-Time National Medalist & Khelo MP Bronze Medalist).

---

## 🧩 Bento Grid Architecture

### 1. Technical Competencies Bento
- **Python 3 & Discrete Logic**: Embedded syntax preview with interactive runtime evaluation simulator.
- **Modern Web Architecture**: Live reactive state counter widget demonstrating zero-dependency DOM event handling.
- **Unix & System Automation**: Interactive CLI test trigger showcasing shell automation workflows.

### 2. Featured Projects Bento
- **Terminal Math Solver**: Python CLI engine computing complex discrete mathematics and algorithmic graph problems. Includes interactive code preview drawer and live CLI simulator.
- **Automated System Manager**: Unix shell utility automating directory organization, disk analysis, and backup workflows. Includes collapsible code drawer and interactive dry-run runner.
- **Responsive Task Hub**: High-speed vanilla JavaScript state management dashboard with localStorage persistence.
- **Interactive Filtering**: Filter projects by `"All"`, `"CLI & Automation"`, `"Web Systems"`, and `"Algorithms"`.

### 3. High-Performance Athletic Spec
- Dedicated national athlete spec dashboard highlighting tactical parallels between competitive fencing (foil/épée) and low-latency software engineering (<180ms tactical reflex speed).

---

## 📂 Project Structure

```
PORTFOLIO/
├── index.html            # Semantic HTML5 markup, canonical links, Open Graph tags, ARIA
├── 404.html              # Custom PolyThink-styled 404 error page for GitHub Pages
├── styles.css            # PolyThink bento tokens, dot-matrix grid, spotlight, responsive breakpoints
├── script.js             # Standalone vanilla JS engine (clocks, IDE canvas, terminal, drawers, filters)
├── css/
│   └── style.css         # Mirrored stylesheet for path compatibility
├── js/
│   ├── main.js           # Supplementary scripts
│   └── terminal.js       # Supplementary terminal logic
├── .gitignore            # Ignored files (secrets.txt, *.log, .DS_Store)
└── README.md             # Documentation and usage guide
```

---

## 📬 Contact Form Configuration (Web3Forms)

The contact card connects to **Web3Forms** for serverless static form submissions on GitHub Pages:

1. Obtain a free access key at [https://web3forms.com](https://web3forms.com) using your email address.
2. In [`script.js`](script.js), update the access key:
   ```javascript
   const WEB3FORMS_ACCESS_KEY = 'YOUR_ACCESS_KEY_HERE';
   ```
3. Form submissions include client-side RFC email validation, visual loading states, and accessible status notifications.
4. Also features a one-click copy button for instant clipboard copying of `ashishparihar138@gmail.com`.

---

## 🚀 Local Development & Preview

```bash
# Option 1: Python 3 built-in HTTP server
python3 -m http.server 3000

# Option 2: Open directly in default browser
open index.html
```

---

## 🏆 Profile Details

- **Name**: Ashish Parihar
- **Institution**: First-Year Computer Science Undergraduate, Newton School of Technology / ADYPU (Pune)
- **Athletics**: 2-Time National Medalist & Khelo MP Bronze Medalist in Fencing
- **Focus Areas**: Algorithmic Logic, Unix CLI Automation, High-Performance Web Architectures
- **GitHub**: [https://github.com/ashishparihar2006](https://github.com/ashishparihar2006)
- **Email**: ashishparihar138@gmail.com
