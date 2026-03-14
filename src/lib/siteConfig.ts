// ─── Centralized Site Content Config ────────────────────────────────────────
// All text, labels, and data arrays live here so every component imports
// from one place. Change a value here → it updates everywhere.

// ─── Site Metadata ──────────────────────────────────────────────────────────
export const site = {
  title: 'Souvik Pal | Portfolio',
  description: 'A Tron-inspired retro arcade portfolio experience',
  konamiText: '★ GOD MODE ACTIVATED ★',
};

// ─── Boot Sequence ──────────────────────────────────────────────────────────
export const boot = {
  splashTitle: 'GREETINGS USER',
  splashPrompt: 'CLICK ANYWHERE TO ENTER THE GRID & KNOW MORE ABOUT SOUVIK',
  footerLabel: 'A TRON INSPIRED PORTFOLIO SYSTEM',
  idCard: {
    headerLeft: '◈ ENCOM SYSTEM',
    headerRight: 'SIGNAL ACTIVE',
    label: 'USER',
    name: 'SOUVIK PAL',
    accessDots: '●●●●●●',
    nexus: 'NEXUS: BACKEND-SYSTEMS',
    secCode: '2026-SP-0314',
    role: 'SENIOR BACKEND ENGINEER',
    roleJp: 'シニアエンジニア',
    org: 'QED42',
    orgSub: 'AI SYSTEMS',
    authText: 'AUTHORIZATION GRANTED TO THE ABOVE USER TO BUILD, DEPLOY, AND MAINTAIN ANY APPLICATION OR SYSTEM ON THE GRID. SPECIALIZING IN INTERACTIVE VISUALIZATIONS AND AI-POWERED TOOLS.',
    footer: 'PROPERTY OF THE GRID',
  },
  lines: [
    { text: '', delay: 200 },
    { text: '╔══════════════════════════════════════════════════╗', delay: 100 },
    { text: '║  TRON PORTFOLIO SYSTEM v2.0.86                   ║', delay: 100 },
    { text: '║  (c) 2026 ENCOM SYSTEMS                          ║', delay: 100 },
    { text: '╚══════════════════════════════════════════════════╝', delay: 300 },
    { text: '', delay: 100 },
    { text: '[BIOS] Initializing system memory.......... OK', delay: 150 },
    { text: '[BIOS] Detecting display adapter........... NEON-GL 4096', delay: 200 },
    { text: '[BIOS] Audio subsystem..................... WEB-AUDIO v3', delay: 150 },
    { text: '[BIOS] Input devices....................... LIGHT-CURSOR', delay: 150 },
    { text: '', delay: 100 },
    { text: '[GRID] Loading Tron grid matrix............ 1024x768', delay: 200 },
    { text: '[GRID] Spawning light cycles............... 4 ACTIVE', delay: 200 },
    { text: '[GRID] Collision avoidance................. ENABLED', delay: 150 },
    { text: '[GRID] Data pulse frequency................ 0.3Hz', delay: 150 },
    { text: '', delay: 100 },
    { text: '[PROG] Loading PROJECTS module............. 6 PROGRAMS', delay: 200 },
    { text: '[PROG] Loading HIGH SCORES module.......... 12 ENTRIES', delay: 150 },
    { text: '[PROG] Loading SKILL TREE module........... 16 NODES', delay: 150 },
    { text: '[PROG] Loading ACHIEVEMENT engine.......... 7 BADGES', delay: 150 },
    { text: '[PROG] Loading TERMINAL emulator........... READY', delay: 150 },
    { text: '[PROG] Loading TRON GAME................... STANDBY', delay: 200 },
    { text: '', delay: 100 },
    { text: '[SYS]  CRT overlay......................... ACTIVE', delay: 100 },
    { text: '[SYS]  Particle engine..................... ONLINE', delay: 100 },
    { text: '[SYS]  All systems operational.', delay: 300 },
    { text: '', delay: 100 },
    { text: '> WELCOME TO THE GRID, PLAYER 2.', delay: 500 },
    { text: '> ENTERING PORTFOLIO ENVIRONMENT...', delay: 400 },
  ],
};

// ─── Hero Section ───────────────────────────────────────────────────────────
export const hero = {
  subtitle: 'SYSTEM ONLINE — WELCOME TO THE GRID',
  title: 'SOUVIK PAL',
  tagline: '◆ PLAYER ONE ◆',
  scrollCue: '[ SCROLL TO BEGIN ]',
};

// ─── Navigation ─────────────────────────────────────────────────────────────
export const navigation = {
  items: [
    { id: 'hero', label: 'HOME' },
    { id: 'terminal', label: 'TERMINAL' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'blogs', label: 'BLOGS' },
  ],
  gameButtonLabel: 'GAME',
};

// ─── Terminal ───────────────────────────────────────────────────────────────
export const terminal = {
  sectionTitle: '— ABOUT PLAYER ONE —',
  windowTitle: 'TRON TERMINAL',
  windowHint: 'type "help" to begin',

  welcomeLines: [
    { type: 'success' as const, text: 'TRON TERMINAL v2.0' },
    { type: 'output' as const, text: '' },
    { type: 'success' as const, text: 'Available commands:' },
    { type: 'success' as const, text: '  about         Get to know about the player' },
    { type: 'success' as const, text: '  ls projects   Browse all projects' },
    { type: 'success' as const, text: '  ls blogs      Browse all blog posts' },
    { type: 'success' as const, text: '  play          Launch the Tron mini-game' },
    { type: 'success' as const, text: '  help          See all available commands' },
    { type: 'output' as const, text: '' },
    { type: 'success' as const, text: 'Type a command and press Enter to execute.' },
    { type: 'output' as const, text: '' },
  ],

  helpText: `Available commands:

  help          Show this help message
  about         Display user bio
  whoami        Who are you?
  ls projects   List all projects
  ls blogs      List all blog posts
  cat readme    Read the README
  play          Launch Tron Game
  matrix        Toggle matrix effect
  uptime        Show system uptime
  date          Current date/time
  clear         Clear terminal

Tip: Use ↑/↓ arrows for command history`,

  aboutText: 
  `   ╔════════════════════════════════════════╗
   ║          IDENTITY DISC — BIO           ║
   ╠════════════════════════════════════════╣
   ║                                        ║
   ║  Name:     SOUVIK PAL                  ║
   ║  Role:     SENIOR BE ENGINEER          ║
   ║  Level:    SENIOR                      ║
   ║  Base:     The Grid                    ║
   ║                                        ║
   ║  Specializations:                      ║
   ║  ├─ ARTIFICIAL INTELLIGENCE            ║
   ║  ├─ DRUPAL                             ║
   ║  ├─ PHP                                ║
   ║  └─ AWS                                ║
   ║                                        ║
   ║  Current Quest:                        ║
   ║  Building tools that make complex      ║
   ║  concepts visually intuitive.          ║
   ║                                        ║
   ╚════════════════════════════════════════╝`,

  whoamiText: 'PLAYER ONE — SOUVIK PAL — Level: SENIOR BACKEND ENGINEER',

  projectsList: `INSTALLED PROGRAMS:
─────────────────────────────────────────
  [01] Claude Visualizations    ONLINE
  [02] Git Visualizations       ONLINE
  [03] DevOps Visualizations    ONLINE
  [04] Event Horizon            LOADING
  [05] MCP Memory Server        LOADING
  [06] ???                      LOCKED
─────────────────────────────────────────
  Total: 6 programs | 3 online`,

  blogsList: `TRANSMISSION LOG — 12 ENTRIES:
─────────────────────────────────────────
  01. Building RAG Pipelines That Work
  02. Prompt Engineering for Code Gen
  03. Vector Databases for Developers
  04. Containerization Beyond Docker
  05. Monolith to Microservices
  06. Transformer Architecture Visually
  07. Git Internals: Objects & Refs
  08. The MCP Revolution
  09. K8s Networking Demystified
  10. CLI Tools That Devs Love
  11. Open Source: Beginner's Playbook
  12. Drupal and Headless CMS
─────────────────────────────────────────`,

  skillsText: `SKILL MATRIX:
─────────────────────────────────────────
  BACKEND  ████████████████████  5/5
  ├─ Drupal, Python

  BACKEND   ████████████████░░░░  4/5
  ├─ Next.js, TypeScript, CSS

  DEVOPS    ████████████████░░░░  4/5
  ├─ Docker, K8s, CI/CD, Git

  AI / ML   ████████████████░░░░  4/5
  ├─ LLMs, RAG, PyTorch, MCP
─────────────────────────────────────────`,

  readmeText: `# TRON PORTFOLIO SYSTEM v2.0

Welcome to the Grid, Program.

This portfolio is an interactive experience
inspired by the TRON universe. Navigate using
the mouse, keyboard, or this terminal.

## Features
- Interactive Tron grid with light cycles
- Playable Tron mini-game (type 'play')
- Full audio experience

## Easter Eggs
There are hidden features. Explore to find
them. Hint: think classic gaming codes...

## Credits
Built with Next.js, TypeScript, and Canvas.
Designed for the Grid.

END OF FILE`,

  lsOutput: 'projects/  blogs/  skills/  about.txt  readme.md  game.exe',
  launchingGame: 'Launching TRON GAME...',
  matrixEnabled: 'Matrix effect enabled. Welcome to the real world.',
  matrixDisabled: 'Matrix effect disabled.',
  sudoError: 'Nice try, Program. Access denied.',
  notFoundPrefix: 'Command not found:',
  notFoundSuffix: 'Type "help" for available commands.',
};

// ─── About Section ──────────────────────────────────────────────────────────
export const about = {
  sectionSubtitle: '— IDENTITY DISC —',
  sectionTitle: 'PLAYER STATS',
  boxHeader: {
    top:    '╔═════════════════════════════════╗',
    middle: '║   PLAYER ONE — PROGRAM ACTIVE   ║',
    bottom: '╚═════════════════════════════════╝',
  },
  bio: {
    prefix: 'A ',
    highlights: [
      'full-stack developer',
      'web technologies',
      'developer experience',
      'visually intuitive',
    ],
    text: 'senior-backend-engineer navigating the grid — building interactive visualizations, AI-powered tools, and open-source contributions. Specializing in web technologies, developer experience, and making complex concepts visually intuitive.',
  },
  stats: [
    { value: '12+', label: 'BLOG POSTS' },
    { value: '5', label: 'PROJECTS' },
    { value: '∞', label: 'CURIOSITY' },
  ],
  socialLinks: [
    { name: 'GITHUB', href: '#' },
    { name: 'LINKEDIN', href: '#' },
    { name: 'TWITTER', href: '#' },
    { name: 'EMAIL', href: '#' },
  ],
  achievementCaseTitle: '★ ACHIEVEMENT CASE ★',
};

// ─── Skill Tree ─────────────────────────────────────────────────────────────
export const skills = {
  sectionSubtitle: '— ABILITIES UNLOCKED —',
  sectionTitle: 'SKILL TREE',

  categoryColors: {
    frontend: '#00f0ff',
    backend: '#ff00de',
    devops: '#ff6a00',
    ai: '#00ff88',
  } as Record<string, string>,

  categoryLabels: {
    frontend: 'FRONTEND',
    backend: 'BACKEND',
    devops: 'DEVOPS',
    ai: 'AI / ML',
  } as Record<string, string>,

  nodes: [
    // Frontend cluster (left)
    { id: 'react', name: 'React', category: 'frontend', level: 5, x: 0.15, y: 0.25, connections: ['nextjs', 'typescript', 'css'] },
    { id: 'nextjs', name: 'Next.js', category: 'frontend', level: 5, x: 0.22, y: 0.45, connections: ['react', 'node'] },
    { id: 'typescript', name: 'TypeScript', category: 'frontend', level: 4, x: 0.08, y: 0.5, connections: ['react', 'node'] },
    { id: 'css', name: 'CSS/Tailwind', category: 'frontend', level: 5, x: 0.18, y: 0.7, connections: ['react'] },
    // Backend cluster (center-left)
    { id: 'node', name: 'Node.js', category: 'backend', level: 4, x: 0.38, y: 0.3, connections: ['typescript', 'nextjs', 'python', 'postgres'] },
    { id: 'python', name: 'Python', category: 'backend', level: 4, x: 0.45, y: 0.55, connections: ['node', 'pytorch', 'rag'] },
    { id: 'postgres', name: 'PostgreSQL', category: 'backend', level: 3, x: 0.35, y: 0.72, connections: ['node'] },
    { id: 'drupal', name: 'Drupal', category: 'backend', level: 5, x: 0.48, y: 0.78, connections: ['node', 'postgres'] },
    // DevOps cluster (center-right)
    { id: 'docker', name: 'Docker', category: 'devops', level: 4, x: 0.62, y: 0.28, connections: ['k8s', 'node', 'cicd'] },
    { id: 'k8s', name: 'Kubernetes', category: 'devops', level: 3, x: 0.72, y: 0.45, connections: ['docker', 'cicd'] },
    { id: 'cicd', name: 'CI/CD', category: 'devops', level: 4, x: 0.6, y: 0.62, connections: ['docker', 'git'] },
    { id: 'git', name: 'Git', category: 'devops', level: 5, x: 0.68, y: 0.78, connections: ['cicd'] },
    // AI cluster (right)
    { id: 'pytorch', name: 'PyTorch', category: 'ai', level: 3, x: 0.82, y: 0.22, connections: ['python', 'llm'] },
    { id: 'llm', name: 'LLMs', category: 'ai', level: 4, x: 0.9, y: 0.4, connections: ['pytorch', 'rag'] },
    { id: 'rag', name: 'RAG', category: 'ai', level: 4, x: 0.85, y: 0.6, connections: ['llm', 'python', 'mcp'] },
    { id: 'mcp', name: 'MCP', category: 'ai', level: 4, x: 0.88, y: 0.78, connections: ['rag'] },
  ],
};

// ─── Projects Section ───────────────────────────────────────────────────────
export const projects = {
  sectionSubtitle: '— SELECT YOUR PROGRAM —',
  sectionTitle: 'OS PROJECTS',
  items: [
    {
      num: '01', status: 'ONLINE', statusClass: '',
      title: 'CLAUDE VISUALIZATIONS',
      tagline: 'Interactive visual explorations of AI and machine learning concepts. Understand neural networks, transformers, and embeddings through animated simulations.',
      tech: ['NEXT.JS', 'REACT', 'CANVAS', 'AI/ML'],
      link: '#', cta: 'PLAY',
    },
    {
      num: '02', status: 'ONLINE', statusClass: '',
      title: 'GIT VISUALIZATIONS',
      tagline: 'Master Git through interactive visual guides. Watch branches merge, commits flow, and rebases unfold in real-time animated diagrams.',
      tech: ['NEXT.JS', 'REACT', 'SVG', 'GIT'],
      link: '#', cta: 'PLAY',
    },
    {
      num: '03', status: 'ONLINE', statusClass: '',
      title: 'DEVOPS VISUALIZATIONS',
      tagline: 'Explore CI/CD pipelines, container orchestration, and infrastructure concepts through hands-on interactive visual simulations.',
      tech: ['NEXT.JS', 'REACT', 'DOCKER', 'K8S'],
      link: '#', cta: 'PLAY',
    },
    {
      num: '04', status: 'LOADING...', statusClass: 'coming-soon',
      title: 'EVENT HORIZON',
      tagline: 'RAG-powered code intelligence platform. Search, analyze, and understand large codebases using AI-driven semantic search and context retrieval.',
      tech: ['PYTHON', 'RAG', 'LLM', 'VECTOR DB'],
      link: '#', cta: 'COMING SOON',
    },
    {
      num: '05', status: 'LOADING...', statusClass: 'coming-soon',
      title: 'MCP MEMORY SERVER',
      tagline: 'Persistent memory layer for AI assistants using the Model Context Protocol. Store, retrieve, and reason over conversation history.',
      tech: ['NODE.JS', 'MCP', 'SQLITE', 'AI'],
      link: '#', cta: 'COMING SOON',
    },
    {
      num: '06', status: 'EMPTY SLOT', statusClass: 'coming-soon',
      title: 'NEXT PROJECT',
      tagline: 'This program slot is available. New project initializing...',
      tech: ['???'],
      link: '#', cta: 'LOCKED', locked: true,
    },
  ],
};

// ─── Blogs Section ──────────────────────────────────────────────────────────
export const blogs = {
  sectionSubtitle: '— TRANSMISSION LOG —',
  sectionTitle: 'BLOGS',
  columnHeaders: { rank: 'RNK', title: 'TITLE', date: 'DATE' },
  items: [
    { title: 'Building RAG Pipelines That Actually Work', date: '2026.03' },
    { title: 'The Art of Prompt Engineering for Code Generation', date: '2026.02' },
    { title: 'Why Every Developer Needs to Understand Vector Databases', date: '2026.02' },
    { title: 'Containerization Beyond Docker: A Deep Dive', date: '2026.01' },
    { title: 'From Monolith to Microservices: Lessons Learned', date: '2026.01' },
    { title: 'Understanding Transformer Architecture Visually', date: '2025.12' },
    { title: 'Git Internals: How Objects and References Work', date: '2025.11' },
    { title: 'The MCP Revolution: AI Tools That Talk to Each Other', date: '2025.10' },
    { title: 'Kubernetes Networking Demystified', date: '2025.09' },
    { title: 'Writing CLI Tools That Developers Love', date: '2025.08' },
    { title: 'Open Source Contributions: A Beginner\'s Playbook', date: '2025.07' },
    { title: 'Drupal and Headless CMS: The Modern Stack', date: '2025.06' },
  ],
};

// ─── Footer ─────────────────────────────────────────────────────────────────
export const footer = {
  text: '© 2026 PLAYER ONE — END OF LINE',
};

// ─── Achievements ───────────────────────────────────────────────────────────
export const achievements = {
  toastHeader: '★ ACHIEVEMENT UNLOCKED ★',
  items: [
    { id: 'first_click', name: 'FIRST CLICK', description: 'Clicked for the first time', icon: '👆', unlocked: false },
    { id: 'explorer', name: 'EXPLORER', description: 'Scrolled to the bottom', icon: '🗺', unlocked: false },
    { id: 'hacker', name: 'HACKER', description: 'Opened the dev console', icon: '💀', unlocked: false },
    { id: 'god_mode', name: 'GOD MODE', description: 'Entered the Konami code', icon: '⬆', unlocked: false },
    { id: 'gamer', name: 'GAMER', description: 'Played the mini-game', icon: '🎮', unlocked: false },
    { id: 'terminal_jockey', name: 'TERMINAL JOCKEY', description: 'Used 5+ terminal commands', icon: '⌨', unlocked: false },
    { id: 'audiophile', name: 'AUDIOPHILE', description: 'Turned on the audio', icon: '♪', unlocked: false },
  ],
};

// ─── Audio Toggle ───────────────────────────────────────────────────────────
export const audio = {
  toggleLabelOn: '♪ AUDIO ON',
  toggleLabelOff: '♪ AUDIO OFF',
};

// ─── HUD Elements ───────────────────────────────────────────────────────────
export const hud = {
  playersOnlineLabel: 'PLAYERS ONLINE:',
  creditsLabel: 'CREDITS:',
  insertCoinLabel: 'INSERT COIN',
};
