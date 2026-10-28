# Ashish Parihar — Personal Portfolio

> **Cyber-Minimalist Dark Mode Portfolio Website** engineered with modern HTML5, CSS3, and Vanilla JavaScript. Features a live interactive terminal emulator, canvas particle constellation, Apple/Linear-inspired spotlight card glow effects, and responsive layout.

---

## ⚡ Visual Theme & Design System

- **Deep Charcoal Canvas**: `#0D0F12` with elevated surface tones (`#13171D`, `#171C24`)
- **Electric Cyan Primary Accent**: `#00F2FE` (with soft neon box-shadows and radial glows)
- **Dynamic Accents**: Neon Emerald (`#00F5A0`), Neon Purple (`#B026FF`), Electric Blue (`#4FACFE`)
- **Typography Stack**:
  - Display: *Space Grotesk*
  - Body: *Inter*
  - Code & Terminal: *JetBrains Mono*
- **Zero Framework Bloat**: 100% vanilla JavaScript ES6+, native CSS Grid/Flexbox, and hardware-accelerated CSS transforms.

---

## 🖥️ Interactive Embedded Terminal (`js/terminal.js`)

Located directly inside the Hero Section, the terminal allows visitors to explore Ashish's background through a Unix-style command line interface:

- **Supported Commands**:
  - `help` — List command directory
  - `about` — Background, CS journey, and philosophy
  - `skills` — Technical competencies and proficiency matrix
  - `projects` — Featured repositories (or `projects 1`, `projects 2`, `projects 3`)
  - `fencing` / `athletics` — National fencing distinctions and mental discipline
  - `contact` — Email, LinkedIn, GitHub, and transmission channels
  - `whoami` — Active session user credentials
  - `ls` — Simulated virtual directory listing
  - `cat <file>` — Read virtual file contents (`cat about.txt`, `cat fencing.log`, etc.)
  - `matrix` — Easter egg toggle for cyberpunk green matrix mode
  - `date` — Query real-time UTC and local clock
  - `clear` — Wipe terminal buffer
- **User Experience Highlights**:
  - **History Navigation**: Use `Up` and `Down` arrow keys to cycle through past commands.
  - **Tab Auto-Completion**: Type `pro` and hit `[Tab]` to complete `projects`.
  - **Quick Action Chips**: Mobile-friendly tap-to-run pill buttons.
  - **Synthesized Audio**: Web Audio API mechanical keyboard sound effects with mute toggle.
  - **Global Shortcut**: Press `T` from anywhere on the page to focus the terminal.

---

## 📂 Project Architecture

```
PORTFOLIO/
├── index.html            # Semantic HTML5 structure & accessible ARIA markup
├── css/
│   └── style.css         # Custom tokens, responsive layout, neon glow animations
├── js/
│   ├── main.js           # Particle canvas, spotlight cursor tracking, scrollspy, contact form
│   └── terminal.js       # Interactive Unix CLI emulator engine
└── README.md             # Documentation and usage guide
```

---

## 🚀 Quick Start / Local Preview

To launch and preview locally on any machine:

```bash
# Option 1: Python 3 built-in server
python3 -m http.server 3000

# Option 2: Node npx serve
npx serve .

# Option 3: Simply double-click index.html in your browser!
```

---

## 🏆 Profile Highlights

- **Name**: Ashish Parihar
- **Role**: First-Year Computer Science Student & Aspiring Software Developer
- **Athletics**: 2-Time National Medalist & Khelo MP Bronze Medalist in Fencing
- **Focus**: Algorithmic Problem Solving, Unix Terminal Automation, Clean Web Systems
- **GitHub**: [https://github.com/ashishparihar2006](https://github.com/ashishparihar2006)
- **Email**: ashishparihar138@gmail.com
