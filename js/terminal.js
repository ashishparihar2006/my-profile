/**
 * ASHISH PARIHAR // INTERACTIVE TERMINAL ENGINE
 * Pure vanilla JavaScript terminal emulator with command history, 
 * tab completion, synthesized audio, interactive quick chips, and rich CLI responses.
 */

(function () {
  'use strict';

  // DOM Elements
  const terminalWindow = document.getElementById('interactive-terminal');
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');
  const terminalHistory = document.getElementById('terminal-history');
  const termClearBtn = document.getElementById('term-clear-btn');
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
    if (!audioEnabled || !audioCtx) return;
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

  // Audio Toggle Button
  if (termAudioToggle) {
    termAudioToggle.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      if (audioEnabled) {
        initAudio();
        audioIcon.textContent = '🔊';
        termAudioToggle.setAttribute('title', 'Sound effects: ON (Click to mute)');
        printOutput('info', '<span class="text-emerald">[System] Terminal audio synthesized effects ENABLED.</span>');
      } else {
        audioIcon.textContent = '🔇';
        termAudioToggle.setAttribute('title', 'Sound effects: MUTED (Click to enable)');
        printOutput('info', '<span class="text-muted">[System] Terminal audio MUTED.</span>');
      }
    });
  }

  // Available Commands Dictionary
  const COMMANDS = {
    help: {
      desc: 'List all available terminal commands',
      exec: () => `
<div class="term-output-card">
  <div class="text-cyan font-bold mb-1">&gt; ASHISH_CLI // SYSTEM COMMAND REGISTRY:</div>
  <div><span class="cmd-highlight">help</span>       - Displays this manual reference</div>
  <div><span class="cmd-highlight">about</span>      - Personal summary, CS journey & philosophy</div>
  <div><span class="cmd-highlight">skills</span>     - Core technical competencies & toolchain</div>
  <div><span class="cmd-highlight">projects</span>   - Technical projects (or: 'projects 1', 'projects 2', 'projects 3')</div>
  <div><span class="cmd-highlight">fencing</span>    - Competitive athletics & national distinctions</div>
  <div><span class="cmd-highlight">contact</span>    - Transmission channels, email & social links</div>
  <div><span class="cmd-highlight">whoami</span>     - Active identity and security credentials</div>
  <div><span class="cmd-highlight">ls</span>         - List available virtual directory files</div>
  <div><span class="cmd-highlight">cat &lt;file&gt;</span>  - Read virtual file content</div>
  <div><span class="cmd-highlight">matrix</span>     - Toggle cyberpunk matrix glitch mode</div>
  <div><span class="cmd-highlight">date</span>       - Query local and UTC timestamp</div>
  <div><span class="cmd-highlight">clear</span>      - Flush terminal history buffer</div>
</div>
<div class="text-muted text-xs mt-1">Tip: Use [Up] & [Down] arrow keys for history, [Tab] for autocomplete.</div>`
    },

    about: {
      desc: 'Summary of background, CS undergrad focus, and philosophy',
      exec: () => `
<div class="term-output-card">
  <div class="text-cyan font-bold mb-1">&gt; USER PROFILE: ASHISH PARIHAR</div>
  <p><strong class="text-white">Role:</strong> First-Year Computer Science Student & Aspiring Software Developer</p>
  <p><strong class="text-white">Athletic Distinction:</strong> 2-Time National Medalist & Khelo MP Bronze Medalist (Fencing)</p>
  <p><strong class="text-white">Core Focus:</strong> Discrete Mathematics, Algorithmic Logic, Unix Terminal Systems, Modern Web</p>
  <p class="mt-2 text-secondary">
    "I believe great software emerges from the same virtues as competitive fencing: split-second precision,
    anticipation of edge cases, relentless iteration, and unshakeable discipline."
  </p>
  <div class="mt-2 text-xs text-muted">
    Navigation shortcut: <a href="#about" class="text-cyan hover:underline">&gt;&gt; Jump to About Section</a>
  </div>
</div>`
    },

    skills: {
      desc: 'List core technical competencies',
      exec: () => `
<div class="term-output-card">
  <div class="text-cyan font-bold mb-1">&gt; TECHNICAL COMPETENCY MATRIX:</div>
  
  <div class="mt-2">
    <span class="text-cyan font-bold">[1] Python (Logic & Mathematics):</span>
    <div class="text-xs text-secondary pl-3">&bull; Discrete Mathematics, Boolean Logic, Truth Tables, Graph Theory</div>
    <div class="text-xs text-secondary pl-3">&bull; CLI Architectures, AST Parsing, Algorithmic Optimization, OOP</div>
  </div>

  <div class="mt-2">
    <span class="text-emerald font-bold">[2] Web Development:</span>
    <div class="text-xs text-secondary pl-3">&bull; HTML5 Semantic Architecture, Modern CSS3 (Grid, Flexbox, Variables)</div>
    <div class="text-xs text-secondary pl-3">&bull; JavaScript ES6+ (DOM APIs, Custom State, Canvas API, Async/Await)</div>
    <div class="text-xs text-secondary pl-3">&bull; Zero-framework high framerate (60fps) responsive design</div>
  </div>

  <div class="mt-2">
    <span class="text-purple font-bold">[3] Command-Line & System Utilities:</span>
    <div class="text-xs text-secondary pl-3">&bull; Unix Shell: zsh, Bash Scripting, Pipes, POSIX Coreutils</div>
    <div class="text-xs text-secondary pl-3">&bull; Version Control: Git branching, commit hygiene, GitHub workflows</div>
    <div class="text-xs text-secondary pl-3">&bull; Package Management & Env: Homebrew, macOS/Linux environments, Vim</div>
  </div>
  
  <div class="mt-2 text-xs text-muted">
    Navigation shortcut: <a href="#skills" class="text-cyan hover:underline">&gt;&gt; Jump to Skills Section</a>
  </div>
</div>`
    },

    projects: {
      desc: 'Show featured technical projects',
      exec: (args) => {
        const sub = args[0];
        if (sub === '1' || sub === 'math') {
          return `
<div class="term-output-card">
  <span class="text-cyan font-bold">[01] TERMINAL MATH SOLVER</span> <span class="text-muted text-xs">(Python CLI / Discrete Math)</span>
  <p class="text-xs text-secondary mt-1">High-performance command-line solver for propositional logic, 2^n truth tables, set relations, and Big-O computational complexity.</p>
  <div class="text-xs font-mono text-emerald mt-1">$ python3 math_solver.py --eval "(P ^ Q) -> R" --truth-table</div>
  <div class="text-xs text-muted mt-2">Repo: github.com/ashishparihar2006/terminal-math-solver</div>
</div>`;
        } else if (sub === '2' || sub === 'sys') {
          return `
<div class="term-output-card purple">
  <span class="text-purple font-bold">[02] AUTOMATED SYSTEM MANAGER</span> <span class="text-muted text-xs">(Unix zsh / Python)</span>
  <p class="text-xs text-secondary mt-1">Intelligent workstation automation suite. Cleans orphaned caches, classifies files via MIME detection, schedules crons, and prints hardware telemetry.</p>
  <div class="text-xs font-mono text-cyan mt-1">$ sysman --analyze --cleanup --cron-check</div>
  <div class="text-xs text-muted mt-2">Repo: github.com/ashishparihar2006/automated-system-manager</div>
</div>`;
        } else if (sub === '3' || sub === 'task') {
          return `
<div class="term-output-card emerald">
  <span class="text-emerald font-bold">[03] RESPONSIVE TASK HUB</span> <span class="text-muted text-xs">(Vanilla JS / LocalStorage)</span>
  <p class="text-xs text-secondary mt-1">Ultra-lightweight task matrix dashboard with custom event-driven reactive state, offline persistence, and zero npm dependencies.</p>
  <div class="text-xs font-mono text-purple mt-1">&gt; TaskHub.init({ storage: 'local', fps: 60 })</div>
  <div class="text-xs text-muted mt-2">Repo: github.com/ashishparihar2006/responsive-task-hub</div>
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
      desc: 'National athletic distinctions & competitive mindset',
      exec: () => `
<div class="term-output-card purple">
  <div class="text-purple font-bold mb-1">&gt; ATHLETIC HONORS &amp; TACTICAL DISCIPLINE:</div>
  <p><strong class="text-white">&bull; 2-Time National Medalist</strong> (Competitive Fencing Championship)</p>
  <p><strong class="text-white">&bull; Khelo MP Bronze Medalist</strong> (State Games)</p>
  <div class="mt-2 text-xs text-secondary leading-relaxed">
    "Fencing taught me that speed without precision is meaningless. Whether countering a fleche attack
    or diagnosing a subtle concurrency bug, success demands total composure and calculated execution."
  </div>
  <div class="mt-2 text-xs">
    <a href="#athletics" class="text-purple hover:underline">&gt;&gt; Jump to Athletics Section</a>
  </div>
</div>`
    },

    athletics: {
      desc: 'Alias for fencing command',
      exec: () => COMMANDS.fencing.exec()
    },

    contact: {
      desc: 'Display contact information and links',
      exec: () => `
<div class="term-output-card emerald">
  <div class="text-emerald font-bold mb-1">&gt; TRANSMISSION CHANNELS:</div>
  <div><strong class="text-white">Email:</strong> <a href="mailto:ashishparihar138@gmail.com" class="text-cyan hover:underline">ashishparihar138@gmail.com</a></div>
  <div><strong class="text-white">GitHub:</strong> <a href="https://github.com/ashishparihar2006" target="_blank" class="text-cyan hover:underline">github.com/ashishparihar2006</a></div>
  <div><strong class="text-white">LinkedIn:</strong> <a href="https://linkedin.com/in/ashishparihar" target="_blank" class="text-cyan hover:underline">linkedin.com/in/ashishparihar</a></div>
  <div><strong class="text-white">Status:</strong> Open to Summer Internships &amp; Collaborations</div>
  <div class="mt-2 text-xs">
    <a href="#contact" class="text-emerald hover:underline">&gt;&gt; Open Web Transmission Form</a>
  </div>
</div>`
    },

    whoami: {
      desc: 'Print active session user',
      exec: () => `<span class="text-cyan font-bold">ashish_parihar</span> [UID: 1000] - 1st Year CS Undergrad &amp; National Athlete (status: active)`
    },

    ls: {
      desc: 'List directory files',
      exec: () => `
<div class="font-mono text-xs">
  <span class="text-cyan">about.txt</span>        <span class="text-emerald">skills.md</span>          <span class="text-purple">projects.json</span>
  <span class="text-amber">fencing.log</span>      <span class="text-secondary">contact.sh</span>         <span class="text-muted">LICENSE</span>
</div>
<div class="text-muted text-xs mt-1">Hint: Type <span class="text-cyan font-mono">cat about.txt</span> or <span class="text-cyan font-mono">cat fencing.log</span> to inspect.</div>`
    },

    cat: {
      desc: 'Read simulated files',
      exec: (args) => {
        const file = (args[0] || '').toLowerCase();
        if (file === 'about.txt') return COMMANDS.about.exec();
        if (file === 'skills.md') return COMMANDS.skills.exec();
        if (file === 'projects.json') return COMMANDS.projects.exec([]);
        if (file === 'fencing.log') return COMMANDS.fencing.exec();
        if (file === 'contact.sh') return COMMANDS.contact.exec();
        if (!file) return `<span class="text-danger">Usage: cat &lt;filename&gt;. Try: cat about.txt</span>`;
        return `<span class="text-danger">cat: ${file}: No such file or directory. Try 'ls' to list files.</span>`;
      }
    },

    date: {
      desc: 'Display current system date & time',
      exec: () => {
        const now = new Date();
        return `<span class="text-cyan font-mono">${now.toUTCString()} (Local: ${now.toLocaleTimeString()})</span>`;
      }
    },

    echo: {
      desc: 'Print arguments to terminal output',
      exec: (args) => args.join(' ') || ''
    },

    clear: {
      desc: 'Clear the terminal output',
      exec: () => {
        terminalHistory.innerHTML = '';
        return null;
      }
    },

    history: {
      desc: 'Show previously executed commands',
      exec: () => {
        if (!commandHistoryList.length) return 'No commands in history.';
        return commandHistoryList.map((c, i) => `<span class="text-muted">${i + 1}</span>  ${c}`).join('<br>');
      }
    },

    matrix: {
      desc: 'Toggle cyberpunk green matrix glitch theme',
      exec: () => {
        document.body.classList.toggle('matrix-mode');
        const active = document.body.classList.contains('matrix-mode');
        return active 
          ? `<span class="text-emerald font-bold">[MATRIX PROTOCOL ACTIVATED] Wake up, Neo...</span>`
          : `<span class="text-cyan">[MATRIX PROTOCOL DEACTIVATED] Restoring standard dark palette.</span>`;
      }
    },

    sudo: {
      desc: 'Execute command with elevated privileges',
      exec: (args) => `
<span class="text-danger font-bold">[SECURITY ALERT]</span> ashish is not in the sudoers file.
This incident will be reported to Santa Claus and root administrators.`
    },

    exit: {
      desc: 'Exit interactive terminal',
      exec: () => `Session cannot be terminated. You are in read-only web view.`
    }
  };

  // Print output to terminal DOM
  function printOutput(cmd, outputHtml) {
    if (outputHtml === null) return; // For commands like 'clear'

    const entry = document.createElement('div');
    entry.className = 'term-output-entry';

    let contentHtml = '';
    if (cmd) {
      contentHtml += `
        <div class="term-cmd-echo">
          <span class="text-cyan font-bold font-mono">ashish@portfolio:~$</span>
          <span class="text-white font-mono font-bold">${escapeHtml(cmd)}</span>
        </div>`;
    }

    contentHtml += `<div class="term-output-content font-mono">${outputHtml}</div>`;
    entry.innerHTML = contentHtml;

    terminalHistory.appendChild(entry);
    scrollTerminalToBottom();
  }

  function scrollTerminalToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, function (m) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }[m];
    });
  }

  // Execute Command Logic
  function executeCommand(inputStr) {
    const rawTrimmed = inputStr.trim();
    if (!rawTrimmed) return;

    // Push to history
    commandHistoryList.push(rawTrimmed);
    historyIndex = commandHistoryList.length;

    // Parse tokens
    const tokens = rawTrimmed.split(/\s+/);
    const mainCmd = tokens[0].toLowerCase();
    const args = tokens.slice(1);

    playKeyClick(true);

    if (COMMANDS[mainCmd]) {
      const output = COMMANDS[mainCmd].exec(args);
      printOutput(rawTrimmed, output);
    } else {
      printOutput(
        rawTrimmed,
        `<span class="text-danger">zsh: command not found: ${escapeHtml(mainCmd)}</span>. Type <span class="cmd-highlight">help</span> for valid commands.`
      );
    }

    terminalInput.value = '';
    scrollTerminalToBottom();
  }

  // Handle Input Key Events (Enter, Up, Down, Tab)
  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      // Mechanical typing click sound
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
          // Move cursor to end
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

    // Keep terminal input focused when clicking anywhere in terminal body
    if (terminalBody) {
      terminalBody.addEventListener('click', () => {
        terminalInput.focus();
      });
    }
  }

  // Clear button in header
  if (termClearBtn) {
    termClearBtn.addEventListener('click', () => {
      executeCommand('clear');
      terminalInput.focus();
    });
  }

  // Quick Chips Buttons
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

  // Run in Terminal Buttons across the page (Project cards)
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

  // Global Keyboard Shortcut: 'T' to focus terminal, 'P' for projects
  window.addEventListener('keydown', (e) => {
    const isInputActive = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
    if (!isInputActive) {
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        terminalWindow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        terminalInput.focus();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        const projectsSec = document.getElementById('projects');
        if (projectsSec) projectsSec.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  // Nav terminal shortcut button
  if (navTermBtn) {
    navTermBtn.addEventListener('click', (e) => {
      e.preventDefault();
      terminalWindow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => terminalInput.focus(), 300);
    });
  }

  // Expose global execution if needed
  window.TerminalApp = {
    execute: executeCommand,
    focus: () => terminalInput && terminalInput.focus()
  };
})();
