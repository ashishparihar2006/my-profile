/**
 * ASHISH PARIHAR // PRODUCTION TERMINAL ENGINE v2.0.0
 * Standalone Vanilla JavaScript terminal component.
 * Features:
 * - Safe DOM rendering (zero eval(), textContent sanitization)
 * - Required commands: help, about, skills, projects, fencing, contact, clear, theme, sudo, matrix
 * - Up/Down command history
 * - Tab autocompletion
 * - Quick-command chips
 * - Automatic output scrolling
 * - Terminal reset button
 * - Optional synthesized Web Audio (Off by default)
 * - Reduced-motion compliance
 */

(function () {
  'use strict';

  // DOM Elements
  const terminalWindow = document.getElementById('interactive-terminal');
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');
  const terminalHistory = document.getElementById('terminal-history');
  const termResetBtn = document.getElementById('term-reset-btn');
  const termAudioToggle = document.getElementById('term-audio-toggle');
  const audioIcon = document.getElementById('audio-icon');
  const quickChips = document.querySelectorAll('.cmd-chip');
  const navTermBtn = document.getElementById('nav-term-btn');
  const runInTermBtns = document.querySelectorAll('.run-in-term-btn');

  // Terminal State
  const commandHistoryList = [];
  let historyIndex = -1;
  let audioEnabled = false;
  let audioCtx = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize Web Audio API for mechanical key clicks (Zero external files needed)
  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playKeyClick(isEnter = false) {
    if (!audioEnabled || prefersReducedMotion) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = isEnter ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(isEnter ? 420 : 800 + Math.random() * 200, audioCtx.currentTime);
      
      gain.gain.setValueAtTime(isEnter ? 0.08 : 0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + (isEnter ? 0.09 : 0.04));
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + (isEnter ? 0.1 : 0.05));
    } catch (e) {
      // Audio playback fails silently if blocked
    }
  }

  // Audio Toggle Button (Sound off by default)
  if (termAudioToggle) {
    termAudioToggle.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      if (audioEnabled) {
        initAudio();
        audioIcon.textContent = '🔊';
        termAudioToggle.setAttribute('title', 'Sound effects: ON (Click to mute)');
        termAudioToggle.setAttribute('aria-label', 'Sound effects are on. Click to mute.');
        printOutput('', '<span class="text-emerald">[System] Terminal audio effects ENABLED.</span>');
      } else {
        audioIcon.textContent = '🔇';
        termAudioToggle.setAttribute('title', 'Sound effects: MUTED (Click to enable)');
        termAudioToggle.setAttribute('aria-label', 'Sound effects are muted. Click to enable.');
        printOutput('', '<span class="text-muted">[System] Terminal audio MUTED.</span>');
      }
    });
  }

  // Predefined Commands Registry
  const COMMANDS = {
    help: {
      desc: 'Display available commands and descriptions',
      exec: () => `
<div class="term-output-card">
  <div class="text-cyan font-bold mb-1">&gt; ASHISH_CLI // COMMAND DIRECTORY:</div>
  <div><span class="cmd-highlight">help</span>       - Displays this manual reference</div>
  <div><span class="cmd-highlight">about</span>      - Background, CS studies &amp; discipline philosophy</div>
  <div><span class="cmd-highlight">skills</span>     - Categorized technical competencies</div>
  <div><span class="cmd-highlight">projects</span>   - Technical projects (or: 'projects 1', 'projects 2', 'projects 3')</div>
  <div><span class="cmd-highlight">fencing</span>    - Competitive athletics &amp; national medal distinctions</div>
  <div><span class="cmd-highlight">contact</span>    - Verified communication channels &amp; social links</div>
  <div><span class="cmd-highlight">theme</span>      - Toggle background canvas particle network</div>
  <div><span class="cmd-highlight">matrix</span>     - Toggle cyberpunk matrix aesthetic</div>
  <div><span class="cmd-highlight">sudo</span>       - Administrative privileges test</div>
  <div><span class="cmd-highlight">clear</span>      - Flush terminal history buffer</div>
</div>
<div class="text-muted text-xs mt-1">Navigation tip: Use [Up] &amp; [Down] arrow keys for history, [Tab] for autocomplete.</div>`
    },

    about: {
      desc: 'Display verified background and introduction',
      exec: () => `
<div class="term-output-card">
  <div class="text-cyan font-bold mb-1">&gt; USER PROFILE: ASHISH PARIHAR</div>
  <p><strong class="text-white">Role:</strong> First-Year Computer Science Undergraduate &amp; Software Developer</p>
  <p><strong class="text-white">Athletics:</strong> 2-Time National Medalist &amp; Khelo MP Bronze Medalist (Fencing)</p>
  <p><strong class="text-white">Focus:</strong> Discrete Mathematics, Algorithmic Logic, Unix Automation, Modern Web</p>
  <p class="mt-2 text-secondary">
    "Engineering software at the intersection of mathematical logic and high-performance terminal systems.
    Channeling the tactical precision and composure of competitive fencing into clean, maintainable code."
  </p>
  <div class="mt-2 text-xs">
    <a href="#about" class="text-cyan hover:underline">&gt;&gt; Jump to About Section</a>
  </div>
</div>`
    },

    skills: {
      desc: 'Show categorized technical skills',
      exec: () => `
<div class="term-output-card">
  <div class="text-cyan font-bold mb-1">&gt; TECHNICAL COMPETENCY MATRIX:</div>
  
  <div class="mt-2">
    <span class="text-cyan font-bold">[1] Python (Logic &amp; Mathematics):</span>
    <div class="text-xs text-secondary pl-3">&bull; Discrete Mathematics, Propositional Logic, Truth Tables</div>
    <div class="text-xs text-secondary pl-3">&bull; Algorithmic Optimization, CLI Architectures, OOP Design</div>
  </div>

  <div class="mt-2">
    <span class="text-emerald font-bold">[2] Web Development:</span>
    <div class="text-xs text-secondary pl-3">&bull; HTML5 Semantic Architecture, Modern CSS3 (Grid, Flexbox, Variables)</div>
    <div class="text-xs text-secondary pl-3">&bull; JavaScript ES6+ (DOM APIs, Custom Reactive State, Canvas API)</div>
    <div class="text-xs text-secondary pl-3">&bull; Zero-framework high framerate (60fps) responsive design</div>
  </div>

  <div class="mt-2">
    <span class="text-purple font-bold">[3] Command-Line &amp; System Utilities:</span>
    <div class="text-xs text-secondary pl-3">&bull; Unix Shell: zsh, Bash Scripting, Pipes, POSIX Coreutils</div>
    <div class="text-xs text-secondary pl-3">&bull; Version Control: Git branching, commit hygiene, GitHub workflows</div>
    <div class="text-xs text-secondary pl-3">&bull; Package Management &amp; Environment: Homebrew, macOS/Linux environments, Vim</div>
  </div>
  
  <div class="mt-2 text-xs">
    <a href="#skills" class="text-cyan hover:underline">&gt;&gt; Jump to Skills Section</a>
  </div>
</div>`
    },

    projects: {
      desc: 'Display project summaries and valid links',
      exec: (args) => {
        const sub = args[0] ? args[0].toLowerCase() : '';
        if (sub === '1' || sub === 'math') {
          return `
<div class="term-output-card">
  <span class="text-cyan font-bold">[01] TERMINAL MATH SOLVER</span> <span class="text-muted text-xs">(Python CLI / Discrete Math)</span>
  <p class="text-xs text-secondary mt-1">High-performance command-line solver for propositional logic, 2^n truth tables, set relations, and algorithmic complexity.</p>
  <div class="text-xs font-mono text-emerald mt-1">$ python3 math_solver.py --eval "(P ^ Q) -&gt; R" --truth-table</div>
  <div class="text-xs text-muted mt-2">Status: Active Prototype &bull; Developer: <a href="https://github.com/ashishparihar2006" target="_blank" rel="noopener noreferrer" class="text-cyan hover:underline">github.com/ashishparihar2006</a></div>
</div>`;
        } else if (sub === '2' || sub === 'sys') {
          return `
<div class="term-output-card purple">
  <span class="text-purple font-bold">[02] AUTOMATED SYSTEM MANAGER</span> <span class="text-muted text-xs">(Unix zsh / Python)</span>
  <p class="text-xs text-secondary mt-1">Workstation automation suite. Cleans orphaned caches, classifies files via MIME detection, schedules crons, and prints hardware telemetry.</p>
  <div class="text-xs font-mono text-cyan mt-1">$ sysman --analyze --cleanup --cron-check</div>
  <div class="text-xs text-muted mt-2">Status: Active Utility &bull; Developer: <a href="https://github.com/ashishparihar2006" target="_blank" rel="noopener noreferrer" class="text-cyan hover:underline">github.com/ashishparihar2006</a></div>
</div>`;
        } else if (sub === '3' || sub === 'task') {
          return `
<div class="term-output-card emerald">
  <span class="text-emerald font-bold">[03] RESPONSIVE TASK HUB</span> <span class="text-muted text-xs">(Vanilla JS / LocalStorage)</span>
  <p class="text-xs text-secondary mt-1">Lightweight task matrix dashboard with custom event-driven reactive state, offline persistence, and zero external dependencies.</p>
  <div class="text-xs font-mono text-purple mt-1">&gt; TaskHub.init({ storage: 'local', fps: 60 })</div>
  <div class="text-xs text-muted mt-2">Status: Active Prototype &bull; Developer: <a href="https://github.com/ashishparihar2006" target="_blank" rel="noopener noreferrer" class="text-cyan hover:underline">github.com/ashishparihar2006</a></div>
</div>`;
        }

        return `
<div class="term-output-card">
  <div class="text-cyan font-bold mb-1">&gt; FEATURED TECHNICAL PROJECTS:</div>
  <div><strong class="text-white">1. Terminal Math Solver:</strong> Python CLI for discrete logic &amp; truth tables.</div>
  <div><strong class="text-white">2. Automated System Manager:</strong> Unix/Python scripts for system hygiene &amp; crons.</div>
  <div><strong class="text-white">3. Responsive Task Hub:</strong> Zero-dependency reactive vanilla JS dashboard.</div>
  <div class="text-xs text-muted mt-2">Run <span class="text-cyan font-mono">projects 1</span>, <span class="text-cyan font-mono">projects 2</span>, or <span class="text-cyan font-mono">projects 3</span> for deep-dive.</div>
  <div class="mt-1 text-xs">
    <a href="#projects" class="text-cyan hover:underline">&gt;&gt; Jump to Visual Projects Section</a>
  </div>
</div>`;
      }
    },

    fencing: {
      desc: 'Display verified fencing achievements',
      exec: () => `
<div class="term-output-card purple">
  <div class="text-purple font-bold mb-1">&gt; ATHLETIC HONORS &amp; TACTICAL DISCIPLINE:</div>
  <p><strong class="text-white">&bull; 2-Time National Medalist</strong> (National Fencing Championships)</p>
  <p><strong class="text-white">&bull; Khelo MP Bronze Medalist</strong> (State Games)</p>
  <div class="mt-2 text-xs text-secondary leading-relaxed">
    "Fencing taught me that speed without precision is meaningless. Whether countering an opponent
    or diagnosing a concurrency bottleneck, success demands total composure and calculated execution."
  </div>
  <div class="mt-2 text-xs">
    <a href="#athletics" class="text-purple hover:underline">&gt;&gt; Jump to Athletics Section</a>
  </div>
</div>`
    },

    contact: {
      desc: 'Show verified contact details and social links',
      exec: () => `
<div class="term-output-card emerald">
  <div class="text-emerald font-bold mb-1">&gt; VERIFIED TRANSMISSION CHANNELS:</div>
  <div><strong class="text-white">Email:</strong> <a href="mailto:ashishparihar138@gmail.com" class="text-cyan hover:underline">ashishparihar138@gmail.com</a></div>
  <div><strong class="text-white">GitHub:</strong> <a href="https://github.com/ashishparihar2006" target="_blank" rel="noopener noreferrer" class="text-cyan hover:underline">github.com/ashishparihar2006</a></div>
  <div><strong class="text-white">LinkedIn:</strong> <a href="https://linkedin.com/in/ashishparihar" target="_blank" rel="noopener noreferrer" class="text-cyan hover:underline">linkedin.com/in/ashishparihar</a></div>
  <div><strong class="text-white">Status:</strong> Open to Summer Internships &amp; Collaborations</div>
  <div class="mt-2 text-xs">
    <a href="#contact" class="text-emerald hover:underline">&gt;&gt; Open Web Transmission Form</a>
  </div>
</div>`
    },

    theme: {
      desc: 'Toggle optional background canvas effects',
      exec: () => {
        const isCanvasDisabled = document.body.classList.toggle('canvas-disabled');
        return isCanvasDisabled
          ? `<span class="text-muted">[Theme] HTML5 Canvas particle background: <strong class="text-danger">DISABLED</strong>. Minimalist mode active.</span>`
          : `<span class="text-cyan">[Theme] HTML5 Canvas particle background: <strong class="text-emerald">ENABLED</strong>.</span>`;
      }
    },

    sudo: {
      desc: 'Display a harmless playful Easter egg',
      exec: () => `
<div class="term-output-card">
  <span class="text-danger font-bold">[SECURITY NOTICE]</span> User 'ashish' is not in the sudoers file.
  This incident has been logged and reported to root administration (and Santa Claus).
</div>`
    },

    matrix: {
      desc: 'Toggle a lightweight Matrix-style effect',
      exec: () => {
        const isMatrix = document.body.classList.toggle('matrix-mode');
        return isMatrix
          ? `<span class="text-emerald font-bold">[MATRIX PROTOCOL INITIALIZED] Welcome to the construct, Neo.</span>`
          : `<span class="text-cyan">[MATRIX PROTOCOL TERMINATED] Restored cyber-minimalist dark mode.</span>`;
      }
    },

    clear: {
      desc: 'Clear terminal output',
      exec: () => {
        terminalHistory.innerHTML = '';
        return null;
      }
    }
  };

  // Safe DOM Rendering for output
  function printOutput(cmd, outputHtml) {
    if (outputHtml === null) return;

    const entry = document.createElement('div');
    entry.className = 'term-output-entry';

    if (cmd) {
      const echoDiv = document.createElement('div');
      echoDiv.className = 'term-cmd-echo';
      
      const promptSpan = document.createElement('span');
      promptSpan.className = 'text-cyan font-bold font-mono';
      promptSpan.textContent = 'ashish@portfolio:~$ ';
      
      const cmdSpan = document.createElement('span');
      cmdSpan.className = 'text-white font-mono font-bold';
      cmdSpan.textContent = cmd; // Strictly textContent (prevents XSS)

      echoDiv.appendChild(promptSpan);
      echoDiv.appendChild(cmdSpan);
      entry.appendChild(echoDiv);
    }

    const contentDiv = document.createElement('div');
    contentDiv.className = 'term-output-content font-mono';
    // Trusted HTML from predefined COMMANDS
    contentDiv.innerHTML = outputHtml;
    entry.appendChild(contentDiv);

    terminalHistory.appendChild(entry);
    scrollTerminalToBottom();
  }

  function scrollTerminalToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  // Safe Command Execution
  function executeCommand(inputStr) {
    const rawTrimmed = (inputStr || '').trim();
    if (!rawTrimmed) return;

    // Push to history
    commandHistoryList.push(rawTrimmed);
    historyIndex = commandHistoryList.length;

    // Parse command tokens (case-insensitive command parsing)
    const tokens = rawTrimmed.split(/\s+/);
    const mainCmd = tokens[0].toLowerCase();
    const args = tokens.slice(1);

    playKeyClick(true);

    if (COMMANDS[mainCmd]) {
      const output = COMMANDS[mainCmd].exec(args);
      printOutput(rawTrimmed, output);
    } else {
      // Safe sanitization for unknown command
      const safeCmd = tokens[0].replace(/[^a-zA-Z0-9_-]/g, '');
      printOutput(
        rawTrimmed,
        `<span class="text-danger">zsh: command not found: ${safeCmd}</span>. Type <span class="cmd-highlight">help</span> for valid commands.`
      );
    }

    terminalInput.value = '';
    scrollTerminalToBottom();
  }

  // Reset Terminal
  function resetTerminal() {
    terminalHistory.innerHTML = '';
    terminalInput.value = '';
    historyIndex = commandHistoryList.length;
    printOutput('', '<span class="text-cyan font-mono text-xs">[Terminal buffer reset to initial state. Type \'help\' for commands.]</span>');
    terminalInput.focus();
  }

  if (termResetBtn) {
    termResetBtn.addEventListener('click', resetTerminal);
  }

  // Keyboard navigation & autocomplete
  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
        playKeyClick(false);
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        executeCommand(terminalInput.value);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistoryList.length > 0 && historyIndex > 0) {
          historyIndex--;
          terminalInput.value = commandHistoryList[historyIndex];
          setTimeout(() => terminalInput.setSelectionRange(terminalInput.value.length, terminalInput.value.length), 0);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistoryList.length - 1) {
          historyIndex++;
          terminalInput.value = commandHistoryList[historyIndex];
        } else {
          historyIndex = commandHistoryList.length;
          terminalInput.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const currentVal = terminalInput.value.trim().toLowerCase();
        if (!currentVal) return;

        const cmdNames = Object.keys(COMMANDS);
        const matches = cmdNames.filter((c) => c.startsWith(currentVal));

        if (matches.length === 1) {
          terminalInput.value = matches[0] + ' ';
        } else if (matches.length > 1) {
          printOutput(currentVal, `<span class="text-muted">${matches.join('   ')}</span>`);
        }
      }
    });

    if (terminalBody) {
      terminalBody.addEventListener('click', () => {
        terminalInput.focus();
      });
    }
  }

  // Quick Chips
  quickChips.forEach((chip) => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        terminalInput.value = cmd;
        executeCommand(cmd);
        terminalInput.focus();
      }
    });
  });

  // Run in terminal buttons from project cards
  runInTermBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const cmd = btn.getAttribute('data-run');
      if (cmd) {
        terminalWindow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          terminalInput.focus();
          terminalInput.value = cmd;
          executeCommand(cmd);
        }, 350);
      }
    });
  });

  // Global Keyboard Shortcut: 'T' to focus terminal
  window.addEventListener('keydown', (e) => {
    const isInputActive = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
    if (!isInputActive) {
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        terminalWindow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        terminalInput.focus();
      }
    }
  });

  if (navTermBtn) {
    navTermBtn.addEventListener('click', (e) => {
      e.preventDefault();
      terminalWindow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => terminalInput.focus(), 300);
    });
  }

  // Export clean public API
  window.PortfolioTerminal = {
    execute: executeCommand,
    reset: resetTerminal,
    focus: () => terminalInput && terminalInput.focus()
  };
})();
