# Ashish Parihar — Personal Portfolio

> **Production-Grade Cyber-Minimalist Developer Portfolio** engineered with modern HTML5, CSS3, and Vanilla JavaScript. Features an interactive terminal emulator, high-DPI canvas particle network, Apple/Linear-inspired spotlight card glow effects, interactive project category filters, dual live UTC/IST clocks, and Web3Forms contact form integration.

**Live Deployment**: [https://ashishparihar2006.github.io/my-profile/](https://ashishparihar2006.github.io/my-profile/)  
**GitHub Repository**: [https://github.com/ashishparihar2006/my-profile](https://github.com/ashishparihar2006/my-profile)  

---

## ⚡ Design System & Color Palette

- **Base Background**: `#0D0F12`
- **Secondary Background**: `#15191F`
- **Surface Elevation**: `#1A1F27` / `#202732`
- **Electric Cyan Primary Accent**: `#00F2FE` (with subtle neon box-shadows and radial glows)
- **Primary Text**: `#F5F7FA` (contrast ratio > 15:1 against base)
- **Secondary Text**: `#A5AFBD` (contrast ratio ~8:1, WCAG 2.2 AA compliant)
- **Dynamic Accents**: Neon Emerald (`#00F5A0`), Neon Purple (`#B026FF`), Electric Blue (`#4FACFE`)
- **Typography**:
  - Display: *Space Grotesk*
  - Body: *Inter*
  - Code & Terminal: *JetBrains Mono*
- **Accessibility**: Full `:focus-visible` styling, touch-accessible button targets (min 44px), reduced-motion media query support (`prefers-reduced-motion`).

---

## 🖥️ Interactive Embedded Terminal (`js/terminal.js`)

Located in the Hero section, this standalone terminal component simulates a Unix zsh shell with safe DOM rendering (zero `eval()`, strict `textContent` echo sanitization):

- **Supported Commands**:
  - `help` — List command directory and syntax
  - `about` — Background, CS studies, and competitive mindset
  - `skills` — Categorized technical competencies
  - `projects` — Featured repositories (or deep-dive: `projects 1`, `projects 2`, `projects 3`)
  - `fencing` — National athletic honors & tactical parallels
  - `contact` — Verified contact channels and social profiles
  - `theme` — Toggle background HTML5 canvas particle network
  - `matrix` — Easter egg toggle for cyberpunk matrix aesthetic
  - `sudo` — Playful security notice
  - `clear` — Wipe terminal buffer
- **Terminal Capabilities**:
  - **History Navigation**: Use `Up` and `Down` arrow keys to cycle through past commands.
  - **Tab Autocompletion**: Autocompletes commands when pressing `Tab`.
  - **Quick Action Chips**: One-tap quick commands for mobile and desktop.
  - **Synthesized Audio**: Web Audio API mechanical keyboard sound effects (toggleable via the 🔊/🔇 button, muted by default).
  - **Reset Control**: One-click terminal reset button restoring a clean initial state.
  - **Global Shortcut**: Press `T` from anywhere on the page to focus the terminal.

---

## 📂 Project Architecture

```
PORTFOLIO/
├── index.html            # Semantic HTML5 markup, canonical links, Open Graph tags, ARIA
├── 404.html              # Custom terminal-styled 404 error page for GitHub Pages
├── css/
│   └── style.css         # Custom tokens, responsive layout, neon glow animations, focus-visible
├── js/
│   ├── main.js           # Clocks, high-DPI canvas, scrollspy, copy code, filters, Web3Forms
│   └── terminal.js       # Safe terminal emulator with history and autocompletion
├── .gitignore            # Ignored files (secrets.txt, *.log, .DS_Store)
└── README.md             # Documentation and usage guide
```

---

## 📬 Contact Form Configuration (Web3Forms)

The contact form is built for GitHub Pages static hosting using **Web3Forms**:

1. Generate a free access key at [https://web3forms.com](https://web3forms.com) (enter your email address).
2. Open [`js/main.js`](js/main.js) and locate the configuration constant:
   ```javascript
   const WEB3FORMS_ACCESS_KEY = 'YOUR_ACCESS_KEY_HERE';
   ```
3. Replace `'YOUR_ACCESS_KEY_HERE'` with your actual key (e.g. `'a1b2c3d4-e5f6-7890-...'`).
4. Commit and push the change. Form submissions will immediately be forwarded to your email with spam protection.

---

## 🚀 Local Preview

```bash
# Option 1: Python 3 built-in server
python3 -m http.server 3000

# Option 2: Open directly in browser
open index.html
```

---

## 🏆 Profile Highlights

- **Name**: Ashish Parihar
- **Role**: First-Year Computer Science Student & Aspiring Software Developer
- **Athletics**: 2-Time National Medalist & Khelo MP Bronze Medalist in Fencing
- **Focus**: Algorithmic Problem Solving, Unix Terminal Automation, Clean Web Systems
- **GitHub**: [https://github.com/ashishparihar2006](https://github.com/ashishparihar2006)
- **Email**: ashishparihar138@gmail.com
