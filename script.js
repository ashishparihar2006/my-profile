/**
 * ASHISH PARIHAR // POLYTHINK-STYLE INTERACTIVE ENGINE v3.0.0
 * Pure Vanilla JavaScript ES6+ (Zero external dependencies)
 * Features:
 * - Dual live UTC/IST clocks with cleanup
 * - Responsive cursor-follow spotlight radial gradient & bento card glow
 * - IDE Canvas live tab switcher ([01] Shell, [02] Fast Logic, [03] Athletics)
 * - Full Zsh terminal emulator (history, autocomplete, chips, reset, audio)
 * - Interactive runtime mock simulations (Python truth engine & reactive DOM state)
 * - Collapsible project code spec drawers & category filter chips
 * - Web3Forms serverless contact submission with inline alerts
 * - One-click clipboard copy actions with tooltips
 * - Accessible navigation, ScrollSpy, and focus-managed mobile drawer
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Dual UTC & Indian Standard Time (IST) Live Clocks
     -------------------------------------------------------------------------- */
  const utcClockEl = document.getElementById('utc-clock');
  const istClockEl = document.getElementById('ist-clock');
  const yearEl = document.getElementById('current-year');
  let clockIntervalId = null;

  function updateClocks() {
    const now = new Date();

    if (utcClockEl) {
      const uH = String(now.getUTCHours()).padStart(2, '0');
      const uM = String(now.getUTCMinutes()).padStart(2, '0');
      const uS = String(now.getUTCSeconds()).padStart(2, '0');
      utcClockEl.textContent = `UTC ${uH}:${uM}:${uS}`;
    }

    if (istClockEl) {
      try {
        const istFormatter = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        istClockEl.textContent = `IST ${istFormatter.format(now)}`;
      } catch (e) {
        const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
        const iH = String(istTime.getUTCHours()).padStart(2, '0');
        const iM = String(istTime.getUTCMinutes()).padStart(2, '0');
        const iS = String(istTime.getUTCSeconds()).padStart(2, '0');
        istClockEl.textContent = `IST ${iH}:${iM}:${iS}`;
      }
    }
  }

  function startClocks() {
    if (!clockIntervalId) {
      updateClocks();
      clockIntervalId = setInterval(updateClocks, 1000);
    }
  }

  function stopClocks() {
    if (clockIntervalId) {
      clearInterval(clockIntervalId);
      clockIntervalId = null;
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopClocks();
    else startClocks();
  });

  startClocks();

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     2. PolyThink Dot-Matrix Spotlight Cursor & Bento Card Hover Glow
     -------------------------------------------------------------------------- */
  const spotlightCursor = document.getElementById('spotlight-cursor');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (spotlightCursor && !prefersReducedMotion) {
    window.addEventListener('mousemove', (e) => {
      spotlightCursor.style.setProperty('--cursor-x', `${e.clientX}px`);
      spotlightCursor.style.setProperty('--cursor-y', `${e.clientY}px`);
    }, { passive: true });
  }

  const bentoCards = document.querySelectorAll('.bento-card');
  bentoCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* --------------------------------------------------------------------------
     3. IDE Canvas Live Tab Switcher ([01] Terminal, [02] Logic, [03] Athletics)
     -------------------------------------------------------------------------- */
  const ideTabs = document.querySelectorAll('.ide-tab');
  const tabPanels = document.querySelectorAll('.ide-tab-panel');
  const heroShellTrigger = document.getElementById('hero-shell-trigger');

  function switchIDETab(tabName) {
    ideTabs.forEach((tab) => {
      const isTarget = tab.getAttribute('data-tab') === tabName;
      tab.classList.toggle('active', isTarget);
      tab.setAttribute('aria-selected', String(isTarget));
    });

    tabPanels.forEach((panel) => {
      const panelId = `tab-panel-${tabName}`;
      panel.classList.toggle('active', panel.id === panelId);
    });

    if (tabName === 'terminal') {
      const input = document.getElementById('terminal-input');
      if (input) input.focus();
    }
  }

  ideTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      if (target) switchIDETab(target);
    });
  });

  if (heroShellTrigger) {
    heroShellTrigger.addEventListener('click', () => {
      switchIDETab('terminal');
      const ideEl = document.getElementById('interactive-ide');
      if (ideEl) ideEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* --------------------------------------------------------------------------
     4. Zsh Interactive Terminal Shell Engine
     -------------------------------------------------------------------------- */
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');
  const terminalHistory = document.getElementById('terminal-history');
  const termResetBtn = document.getElementById('term-reset-btn');
  const termAudioToggle = document.getElementById('term-audio-toggle');
  const audioIcon = document.getElementById('audio-icon');
  const quickChips = document.querySelectorAll('.cmd-chip');
  const navTermBtn = document.getElementById('nav-term-btn');
  const runInTermBtns = document.querySelectorAll('.run-in-term-btn');

  const commandHistoryList = [];
  let historyIndex = -1;
  let audioEnabled = false;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
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
    } catch (e) {}
  }

  if (termAudioToggle) {
    termAudioToggle.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      if (audioEnabled) {
        initAudio();
        audioIcon.textContent = '🔊';
        termAudioToggle.setAttribute('title', 'Terminal sound: ON');
        printOutput('', '<span class="text-emerald">[System] Sound effects ENABLED.</span>');
      } else {
        audioIcon.textContent = '🔇';
        termAudioToggle.setAttribute('title', 'Terminal sound: MUTED');
        printOutput('', '<span class="text-muted">[System] Sound effects MUTED.</span>');
      }
    });
  }

  const COMMANDS = {
    help: {
      desc: 'Display terminal command directory',
      exec: () => `
<div class="term-output-card">
  <div class="text-cyan font-bold mb-1">&gt; POLYTHINK ZSH // COMMAND DIRECTORY:</div>
  <div><span class="cmd-highlight">help</span>       - Displays this manual reference</div>
  <div><span class="cmd-highlight">about</span>      - CS undergrad @ NST / ADYPU &amp; athlete profile</div>
  <div><span class="cmd-highlight">skills</span>     - Technical competency matrix</div>
  <div><span class="cmd-highlight">projects</span>   - Featured projects (or: 'projects 1', 'projects 2', 'projects 3')</div>
  <div><span class="cmd-highlight">fencing</span>    - Competitive 2-Time National Medalist distinctions</div>
  <div><span class="cmd-highlight">contact</span>    - Transmission channels &amp; coordinates</div>
  <div><span class="cmd-highlight">matrix</span>     - Cyberpunk matrix glitch mode</div>
  <div><span class="cmd-highlight">sudo</span>       - System administrator test</div>
  <div><span class="cmd-highlight">clear</span>      - Flush terminal history buffer</div>
</div>
<div class="text-muted text-xs mt-1">Hint: Use [Up] &amp; [Down] arrow keys for history, [Tab] for autocomplete.</div>`
    },

    about: {
      desc: 'Summary of background & Newton School of Tech studies',
      exec: () => `
<div class="term-output-card">
  <div class="text-cyan font-bold mb-1">&gt; USER PROFILE: ASHISH PARIHAR</div>
  <p><strong class="text-white">Institution:</strong> Newton School of Technology / ADYPU (B.Tech CS '28)</p>
  <p><strong class="text-white">Athletics:</strong> 2-Time National Medalist &amp; Khelo MP Bronze Medalist (Fencing)</p>
  <p><strong class="text-white">Core Focus:</strong> High-Performance Software, Discrete Math, Unix Scripting, Vanilla Web</p>
  <p class="mt-2 text-secondary">
    "Bridging analytical computer science with athletic tenacity. Eliminating friction through deterministic code."
  </p>
  <div class="mt-2 text-xs">
    <a href="#about" class="text-cyan hover:underline">&gt;&gt; Jump to About Section</a>
  </div>
</div>`
    },

    skills: {
      desc: 'Show categorized technical competencies',
      exec: () => `
<div class="term-output-card">
  <div class="text-cyan font-bold mb-1">&gt; TECHNICAL SKILLS MATRIX:</div>
  <div class="mt-2">
    <span class="text-cyan font-bold">[1] Python 3 &amp; Discrete Logic:</span>
    <div class="text-xs text-secondary pl-3">&bull; Propositional Trees, Truth Tables, Time Complexity Analysis, OOP</div>
  </div>
  <div class="mt-2">
    <span class="text-emerald font-bold">[2] Web Architecture:</span>
    <div class="text-xs text-secondary pl-3">&bull; HTML5 Semantic, Modern CSS3 Bento Grid, JavaScript ES6+, DOM APIs</div>
  </div>
  <div class="mt-2">
    <span class="text-indigo font-bold">[3] Unix &amp; CLI Automation:</span>
    <div class="text-xs text-secondary pl-3">&bull; zsh/Bash scripting, Git branching hygiene, Homebrew, POSIX Coreutils</div>
  </div>
  <div class="mt-2 text-xs">
    <a href="#skills" class="text-cyan hover:underline">&gt;&gt; Jump to Bento Skills Section</a>
  </div>
</div>`
    },

    projects: {
      desc: 'Display featured technical projects',
      exec: (args) => {
        const sub = args[0] ? args[0].toLowerCase() : '';
        if (sub === '1' || sub === 'math') {
          return `
<div class="term-output-card">
  <span class="text-cyan font-bold">[01] TERMINAL MATH SOLVER</span> <span class="text-muted text-xs">(Python CLI / Discrete Math)</span>
  <p class="text-xs text-secondary mt-1">High-performance command-line solver for propositional logic, 2^n truth tables, and equivalence relations.</p>
  <div class="text-xs font-mono text-emerald mt-1">$ python3 math_solver.py --eval "(P ^ Q) -&gt; R" --truth-table</div>
  <div class="text-xs text-muted mt-2">Repo: <a href="https://github.com/ashishparihar2006" target="_blank" rel="noopener noreferrer" class="text-cyan hover:underline">github.com/ashishparihar2006</a></div>
</div>`;
        } else if (sub === '2' || sub === 'sys') {
          return `
<div class="term-output-card indigo">
  <span class="text-indigo font-bold">[02] AUTOMATED SYSTEM MANAGER</span> <span class="text-muted text-xs">(Unix zsh / Python)</span>
  <p class="text-xs text-secondary mt-1">Workstation automation suite. Cleans orphaned caches, classifies files via MIME detection, and monitors cron telemetry.</p>
  <div class="text-xs font-mono text-cyan mt-1">$ sysman --analyze --cleanup --cron-check</div>
  <div class="text-xs text-muted mt-2">Repo: <a href="https://github.com/ashishparihar2006" target="_blank" rel="noopener noreferrer" class="text-cyan hover:underline">github.com/ashishparihar2006</a></div>
</div>`;
        } else if (sub === '3' || sub === 'task') {
          return `
<div class="term-output-card emerald">
  <span class="text-emerald font-bold">[03] RESPONSIVE TASK HUB</span> <span class="text-muted text-xs">(Vanilla JS / LocalStorage)</span>
  <p class="text-xs text-secondary mt-1">Lightweight task matrix dashboard with custom event-driven reactive state and zero external dependencies.</p>
  <div class="text-xs font-mono text-indigo mt-1">&gt; TaskHub.init({ storage: 'local', fps: 60 })</div>
  <div class="text-xs text-muted mt-2">Repo: <a href="https://github.com/ashishparihar2006" target="_blank" rel="noopener noreferrer" class="text-cyan hover:underline">github.com/ashishparihar2006</a></div>
</div>`;
        }

        return `
<div class="term-output-card">
  <div class="text-cyan font-bold mb-1">&gt; FEATURED BENTO PROJECTS:</div>
  <div><strong class="text-white">1. Terminal Math Solver:</strong> Python CLI for discrete logic &amp; truth tables.</div>
  <div><strong class="text-white">2. Automated System Manager:</strong> Unix/Python scripts for system hygiene &amp; crons.</div>
  <div><strong class="text-white">3. Responsive Task Hub:</strong> Zero-dependency reactive vanilla JS dashboard.</div>
  <div class="text-xs text-muted mt-2">Run <span class="text-cyan font-mono">projects 1</span>, <span class="text-cyan font-mono">projects 2</span>, or <span class="text-cyan font-mono">projects 3</span> for deep-dive.</div>
  <div class="mt-1 text-xs">
    <a href="#projects" class="text-cyan hover:underline">&gt;&gt; Jump to Projects Bento Grid</a>
  </div>
</div>`;
      }
    },

    fencing: {
      desc: 'Display national fencing distinctions',
      exec: () => `
<div class="term-output-card indigo">
  <div class="text-indigo font-bold mb-1">&gt; ATHLETIC HONORS &amp; TACTICAL DISCIPLINE:</div>
  <p><strong class="text-white">&bull; 2-Time National Medalist</strong> (National Fencing Championships)</p>
  <p><strong class="text-white">&bull; Khelo MP Bronze Medalist</strong> (State Games)</p>
  <p><strong class="text-white">&bull; Tactical Reflex Speed:</strong> &lt; 180ms reaction cadence</p>
  <div class="mt-2 text-xs text-secondary leading-relaxed">
    "Fencing taught me that speed without precision is meaningless. Tactical anticipation on the strip mirrors anticipating concurrency edge cases in software architecture."
  </div>
  <div class="mt-2 text-xs">
    <a href="#athletics" class="text-indigo hover:underline">&gt;&gt; Jump to Athletics Section</a>
  </div>
</div>`
    },

    contact: {
      desc: 'Show verified contact details',
      exec: () => `
<div class="term-output-card emerald">
  <div class="text-emerald font-bold mb-1">&gt; VERIFIED CHANNELS:</div>
  <div><strong class="text-white">Email:</strong> <a href="mailto:ashishparihar138@gmail.com" class="text-cyan hover:underline">ashishparihar138@gmail.com</a></div>
  <div><strong class="text-white">GitHub:</strong> <a href="https://github.com/ashishparihar2006" target="_blank" rel="noopener noreferrer" class="text-cyan hover:underline">github.com/ashishparihar2006</a></div>
  <div><strong class="text-white">LinkedIn:</strong> <a href="https://linkedin.com/in/ashishparihar" target="_blank" rel="noopener noreferrer" class="text-cyan hover:underline">linkedin.com/in/ashishparihar</a></div>
  <div class="mt-2 text-xs">
    <a href="#contact" class="text-emerald hover:underline">&gt;&gt; Open Transmission Form</a>
  </div>
</div>`
    },

    matrix: {
      desc: 'Toggle cyberpunk matrix effect',
      exec: () => {
        const isMatrix = document.body.classList.toggle('matrix-mode');
        return isMatrix
          ? `<span class="text-emerald font-bold">[MATRIX PROTOCOL INITIALIZED] Reality decrypted, Neo.</span>`
          : `<span class="text-cyan">[MATRIX PROTOCOL TERMINATED] Restored pitch-black PolyThink canvas.</span>`;
      }
    },

    sudo: {
      desc: 'Privilege test easter egg',
      exec: () => `
<div class="term-output-card">
  <span class="text-danger font-bold">[SECURITY NOTICE]</span> User 'ashish' is not in sudoers file.
  This incident has been logged and reported to root administration (and Santa Claus).
</div>`
    },

    clear: {
      desc: 'Clear terminal output',
      exec: () => {
        terminalHistory.innerHTML = '';
        return null;
      }
    }
  };

  function printOutput(cmd, outputHtml) {
    if (outputHtml === null) return;

    const entry = document.createElement('div');
    entry.className = 'term-output-entry';

    if (cmd) {
      const echoDiv = document.createElement('div');
      echoDiv.className = 'term-cmd-echo';
      const promptSpan = document.createElement('span');
      promptSpan.className = 'text-cyan font-bold font-mono';
      promptSpan.textContent = 'ashish@polythink:~$ ';
      const cmdSpan = document.createElement('span');
      cmdSpan.className = 'text-white font-mono font-bold';
      cmdSpan.textContent = cmd; // strictly textContent (XSS protection)

      echoDiv.appendChild(promptSpan);
      echoDiv.appendChild(cmdSpan);
      entry.appendChild(echoDiv);
    }

    const contentDiv = document.createElement('div');
    contentDiv.className = 'term-output-content font-mono';
    contentDiv.innerHTML = outputHtml;
    entry.appendChild(contentDiv);

    terminalHistory.appendChild(entry);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function executeCommand(inputStr) {
    const rawTrimmed = (inputStr || '').trim();
    if (!rawTrimmed) return;

    commandHistoryList.push(rawTrimmed);
    historyIndex = commandHistoryList.length;

    const tokens = rawTrimmed.split(/\s+/);
    const mainCmd = tokens[0].toLowerCase();
    const args = tokens.slice(1);

    playKeyClick(true);

    if (COMMANDS[mainCmd]) {
      const output = COMMANDS[mainCmd].exec(args);
      printOutput(rawTrimmed, output);
    } else {
      const safeCmd = tokens[0].replace(/[^a-zA-Z0-9_-]/g, '');
      printOutput(
        rawTrimmed,
        `<span class="text-danger">zsh: command not found: ${safeCmd}</span>. Type <span class="cmd-highlight">help</span> for valid commands.`
      );
    }

    terminalInput.value = '';
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function resetTerminal() {
    terminalHistory.innerHTML = '';
    terminalInput.value = '';
    historyIndex = commandHistoryList.length;
    printOutput('', '<span class="text-cyan font-mono text-xs">[Terminal buffer reset to initial state. Type \'help\' for commands.]</span>');
    terminalInput.focus();
  }

  if (termResetBtn) termResetBtn.addEventListener('click', resetTerminal);

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') playKeyClick(false);

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
        const matches = Object.keys(COMMANDS).filter((c) => c.startsWith(currentVal));
        if (matches.length === 1) {
          terminalInput.value = matches[0] + ' ';
        } else if (matches.length > 1) {
          printOutput(currentVal, `<span class="text-muted">${matches.join('   ')}</span>`);
        }
      }
    });

    if (terminalBody) {
      terminalBody.addEventListener('click', () => terminalInput.focus());
    }
  }

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

  runInTermBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const cmd = btn.getAttribute('data-run');
      if (cmd) {
        switchIDETab('terminal');
        const ideEl = document.getElementById('interactive-ide');
        if (ideEl) ideEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          terminalInput.focus();
          terminalInput.value = cmd;
          executeCommand(cmd);
        }, 300);
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    const isInputActive = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
    if (!isInputActive && (e.key === 't' || e.key === 'T')) {
      e.preventDefault();
      switchIDETab('terminal');
      const ideEl = document.getElementById('interactive-ide');
      if (ideEl) ideEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      terminalInput.focus();
    }
  });

  if (navTermBtn) {
    navTermBtn.addEventListener('click', (e) => {
      e.preventDefault();
      switchIDETab('terminal');
      const ideEl = document.getElementById('interactive-ide');
      if (ideEl) ideEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => terminalInput.focus(), 300);
    });
  }

  /* --------------------------------------------------------------------------
     5. Interactive Logic Runtime Simulations
     -------------------------------------------------------------------------- */
  // Hero Tab 2: Evaluate logic simulation
  const btnHeroRunEval = document.getElementById('btn-hero-run-eval');
  const heroEvalOutput = document.getElementById('hero-eval-output');

  if (btnHeroRunEval && heroEvalOutput) {
    btnHeroRunEval.addEventListener('click', () => {
      heroEvalOutput.classList.remove('hidden');
      heroEvalOutput.innerHTML = `
        <span class="text-emerald font-bold">[✓] EVALUATION RUNTIME (demo_solver.py):</span><br>
        &bull; State space: 8 states evaluated in 0.18ms<br>
        &bull; Expression: (P ^ Q) -&gt; (P v R) &bull; Verified: <strong>TAUTOLOGY</strong>
      `;
    });
  }

  // Bento Skills: Python Card Run Logic
  const btnRunPythonMock = document.getElementById('btn-run-python-mock');
  const pythonMockOutput = document.getElementById('python-mock-output');

  if (btnRunPythonMock && pythonMockOutput) {
    btnRunPythonMock.addEventListener('click', () => {
      pythonMockOutput.classList.remove('hidden');
      pythonMockOutput.innerHTML = `
        <span class="text-emerald font-bold">[Bitwise Logic Engine]</span> P -&gt; Q Implication Table:<br>
        | P:True, Q:True -&gt; <span class="text-emerald">True</span> | P:True, Q:False -&gt; <span class="text-danger">False</span> |<br>
        | P:False, Q:True -&gt; <span class="text-emerald">True</span> | P:False, Q:False -&gt; <span class="text-emerald">True</span> |<br>
        <span class="text-cyan">&gt; 4/4 evaluations completed in 0.12ms</span>
      `;
    });
  }

  // Bento Skills: Interactive Reactive DOM State Widget
  const counterVal = document.getElementById('counter-val');
  const storeStatus = document.getElementById('store-status');
  const btnInc = document.getElementById('btn-state-inc');
  const btnDec = document.getElementById('btn-state-dec');
  const btnReset = document.getElementById('btn-state-reset');
  let stateCount = 0;

  function updateWidget() {
    if (counterVal) counterVal.textContent = stateCount;
    if (storeStatus) {
      storeStatus.textContent = stateCount === 0 ? 'STATE: IDLE' : `STATE: ACTIVE (MUTATED #${stateCount})`;
      storeStatus.className = stateCount === 0 ? 'text-emerald font-bold' : 'text-cyan font-bold';
    }
  }

  if (btnInc) {
    btnInc.addEventListener('click', () => { stateCount++; updateWidget(); });
  }
  if (btnDec) {
    btnDec.addEventListener('click', () => { if (stateCount > 0) stateCount--; updateWidget(); });
  }
  if (btnReset) {
    btnReset.addEventListener('click', () => { stateCount = 0; updateWidget(); });
  }

  /* --------------------------------------------------------------------------
     6. Collapsible Project Code Spec Drawers
     -------------------------------------------------------------------------- */
  const drawerButtons = document.querySelectorAll('.btn-toggle-drawer');
  drawerButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const drawer = document.getElementById(targetId);
      if (!drawer) return;

      const isHidden = drawer.classList.contains('hidden');
      drawer.classList.toggle('hidden', !isHidden);
      btn.setAttribute('aria-expanded', String(isHidden));
      btn.textContent = isHidden ? '[ Close Spec ]' : '[ < > View Spec Code ]';
    });
  });

  /* --------------------------------------------------------------------------
     7. Project Category Filtering
     -------------------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');

      const filterVal = button.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = (card.getAttribute('data-category') || '').split(/\s+/);
        if (filterVal === 'all' || categories.includes(filterVal)) {
          card.classList.remove('filtered-out');
        } else {
          card.classList.add('filtered-out');
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     8. Copy Code & Copy Email Actions
     -------------------------------------------------------------------------- */
  const copyCodeButtons = document.querySelectorAll('.btn-copy-code');
  copyCodeButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const targetId = btn.getAttribute('data-code-target');
      const codeEl = document.getElementById(targetId);
      if (!codeEl) return;

      const codeText = codeEl.innerText || codeEl.textContent;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(codeText);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = codeText;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        const originalText = btn.querySelector('.copy-text') || btn;
        const prevText = originalText.textContent;
        originalText.textContent = 'Copied!';
        btn.classList.add('copied');

        setTimeout(() => {
          originalText.textContent = prevText;
          btn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy snippet: ', err);
      }
    });
  });

  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyEmailText = document.getElementById('copy-email-text');

  if (copyEmailBtn && copyEmailText) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'ashishparihar138@gmail.com';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = email;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
        copyEmailText.textContent = 'Copied!';
        copyEmailBtn.classList.add('copied');
        setTimeout(() => {
          copyEmailText.textContent = 'Copy';
          copyEmailBtn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy email:', err);
      }
    });
  }

  /* --------------------------------------------------------------------------
     9. PolyThink Serverless Web3Forms Contact Submission
     -------------------------------------------------------------------------- */
  const WEB3FORMS_ACCESS_KEY = 'YOUR_ACCESS_KEY_HERE';

  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const charCounter = document.getElementById('char-counter');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('form-submit-btn');
  const submitBtnText = document.getElementById('submit-btn-text');
  const keyInput = document.getElementById('web3forms-access-key');

  if (keyInput) keyInput.value = WEB3FORMS_ACCESS_KEY;

  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const len = messageInput.value.length;
      charCounter.textContent = `${len} / 1000`;
      if (len > 900) charCounter.classList.add('text-cyan');
      else charCounter.classList.remove('text-cyan');
    });
  }

  function validateField(inputEl, errorElId, message) {
    const errorEl = document.getElementById(errorElId);
    if (message) {
      inputEl.classList.add('is-invalid');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
      }
      return false;
    } else {
      inputEl.classList.remove('is-invalid');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.add('hidden');
      }
      return true;
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameVal = (nameInput.value || '').trim();
      const emailVal = (emailInput.value || '').trim();
      const msgVal = (messageInput.value || '').trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      let isValid = true;
      if (!nameVal || nameVal.length < 2) {
        isValid = validateField(nameInput, 'name-error', 'Please enter your name (at least 2 characters).') && isValid;
      } else {
        validateField(nameInput, 'name-error', null);
      }

      if (!emailVal || !emailRegex.test(emailVal)) {
        isValid = validateField(emailInput, 'email-error', 'Please provide a valid email address.') && isValid;
      } else {
        validateField(emailInput, 'email-error', null);
      }

      if (!msgVal || msgVal.length < 10) {
        isValid = validateField(messageInput, 'message-error', 'Message must be at least 10 characters long.') && isValid;
      } else {
        validateField(messageInput, 'message-error', null);
      }

      if (!isValid) return;

      submitBtn.disabled = true;
      submitBtnText.textContent = 'Transmitting Transmission...';
      formFeedback.className = 'form-feedback info font-mono text-xs p-3 rounded';
      formFeedback.textContent = '[TRANSMISSION] Preparing packet dispatch...';
      formFeedback.classList.remove('hidden');

      if (WEB3FORMS_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE') {
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtnText.textContent = 'Transmit Transmission';
          formFeedback.className = 'form-feedback info font-mono text-xs p-3 rounded';
          formFeedback.innerHTML = `
            <strong>[Form Validated Successfully]</strong><br>
            To receive live submissions in your inbox, set your free access key from 
            <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer" class="text-cyan underline">web3forms.com</a> 
            in <code>script.js</code>.<br>
            Direct communication: <a href="mailto:ashishparihar138@gmail.com" class="text-white underline">ashishparihar138@gmail.com</a>.
          `;
        }, 800);
        return;
      }

      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });
        const result = await response.json();

        submitBtn.disabled = false;
        submitBtnText.textContent = 'Transmit Transmission';

        if (response.status === 200 && result.success) {
          formFeedback.className = 'form-feedback success font-mono text-xs p-3 rounded';
          formFeedback.textContent = '[SUCCESS: 200 OK] Transmission delivered! I will respond promptly to ' + emailVal + '.';
          contactForm.reset();
          if (charCounter) charCounter.textContent = '0 / 1000';
        } else {
          formFeedback.className = 'form-feedback error font-mono text-xs p-3 rounded';
          formFeedback.textContent = `[ERROR] Transmission failed: ${result.message || 'Unknown error.'}`;
        }
      } catch (err) {
        submitBtn.disabled = false;
        submitBtnText.textContent = 'Transmit Transmission';
        formFeedback.className = 'form-feedback error font-mono text-xs p-3 rounded';
        formFeedback.textContent = '[NETWORK ERROR] Gateway unreachable. Please email ashishparihar138@gmail.com directly.';
      }
    });
  }

  /* --------------------------------------------------------------------------
     10. Sticky Header, ScrollSpy & Mobile Drawer Menu
     -------------------------------------------------------------------------- */
  const header = document.getElementById('site-header');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (header) header.classList.toggle('scrolled', scrollY > 30);
    if (backToTopBtn) {
      backToTopBtn.style.opacity = scrollY > 400 ? '1' : '0.4';
      backToTopBtn.style.pointerEvents = scrollY > 400 ? 'auto' : 'none';
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.remove('active');
              if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
            });
          }
        });
      },
      { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    sections.forEach((s) => navObserver.observe(s));
  }

  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-nav-menu');
  const mobileCloseBtn = document.getElementById('mobile-menu-close');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileToggle && mobileMenu) {
    function toggleMobileMenu(open) {
      const isOpen = open !== undefined ? open : !mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', isOpen);
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';

      if (isOpen) {
        const first = mobileMenu.querySelector('button, a');
        if (first) first.focus();
      } else {
        mobileToggle.focus();
      }
    }

    mobileToggle.addEventListener('click', () => toggleMobileMenu());
    if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', () => toggleMobileMenu(false));
    mobileLinks.forEach((l) => l.addEventListener('click', () => toggleMobileMenu(false)));
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) toggleMobileMenu(false);
    });
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        toggleMobileMenu(false);
      }
    });
  }

  // Developer Console Badge
  console.log(
    '%c> ASHISH PARIHAR // POLYTHINK BENTO PORTFOLIO v3.0',
    'color: #00F2FE; font-weight: bold; font-size: 13px; background: #08090B; padding: 6px 12px; border: 1px solid #00F2FE; border-radius: 4px;'
  );
  console.log(
    '%cNewton School of Tech / ADYPU CS \'28 • 2-Time National Fencing Medalist',
    'color: #10B981; font-size: 11px;'
  );
})();
