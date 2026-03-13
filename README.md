# TRON PORTFOLIO SYSTEM v2.0

> An immersive, Tron-inspired retro arcade portfolio experience built with Next.js, React, and TypeScript.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

## Overview

A fully interactive developer portfolio designed as a retro arcade experience set in the TRON universe. Features a system boot sequence, interactive terminal, playable Tron mini-game, skill tree visualization, achievement system, and Konami code easter egg — all wrapped in a CRT monitor aesthetic with neon glow effects.

## Features

### Boot Sequence
BIOS-style system initialization with progress bar, boot messages, and a CRT power-on transition into the main site.

### Interactive Terminal
A working command-line interface with command history, arrow key navigation, and responses for:
- `about` — ASCII art identity disc
- `skills` — Skill matrix with progress bars
- `ls projects` / `ls blogs` — Browse content
- `play` — Launch the Tron mini-game
- `matrix` — Toggle Matrix rain effect
- `help`, `whoami`, `uptime`, `date`, `clear`

### Playable Tron Game
A light cycle game with AI opponent. Steer with arrow keys or WASD, avoid walls and trails, survive to score points. Includes high score tracking and game-over state.

### Skill Tree
Canvas-based interactive network graph with 16 skill nodes across 4 categories (Frontend, Backend, DevOps, AI/ML), connected edges, hover tooltips, and animated pulse effects.

### Achievement System
7 unlockable badges triggered by user interactions:
- First Click, Explorer, Hacker, God Mode, Gamer, Terminal Jockey, Audiophile

### Easter Eggs
- Konami Code activates God Mode with a particle burst
- Dev console detection
- Hidden terminal commands

### Audio
Synthesized sound effects via Web Audio API for hover, click, navigate, crash, and score events. Background music toggle.

### Visual Effects
- CRT scanline overlay with vignette
- Custom cursor with click animations
- Neon glow text shadows (cyan, magenta, orange)
- Scroll-triggered derez reveal animations
- Glitch clip animation on hero title
- Particle system

## Tech Stack

- **Framework:** Next.js 16 (Turbopack)
- **UI:** React 19, TypeScript 5
- **Styling:** Tailwind CSS 4, CSS custom properties, CSS animations
- **Rendering:** HTML5 Canvas (skill tree, Tron game, background light cycles)
- **Audio:** Web Audio API
- **Fonts:** Orbitron, Press Start 2P, Share Tech Mono, JetBrains Mono

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main page — orchestrates all sections
│   ├── layout.tsx         # Root layout
│   └── globals.css        # All styles, animations, and effects
├── components/
│   ├── BootSequence.tsx   # System boot animation
│   ├── HeroSection.tsx    # Hero title with glitch animation
│   ├── Terminal.tsx        # Interactive terminal emulator
│   ├── SkillTree.tsx       # Canvas skill network graph
│   ├── ProjectsSection.tsx # Project cards grid
│   ├── BlogsSection.tsx    # Blog entries table
│   ├── AboutSection.tsx    # Player stats & achievements
│   ├── TronGame.tsx        # Playable light cycle game
│   ├── TronCanvas.tsx      # Background light cycle animation
│   ├── Navigation.tsx      # Scroll-tracking nav bar
│   ├── CRTOverlay.tsx      # CRT screen effect
│   ├── CustomCursor.tsx    # Custom cursor
│   ├── ParticleSystem.tsx  # Particle effects
│   ├── AudioToggle.tsx     # Audio on/off
│   ├── AchievementToast.tsx # Achievement notifications
│   ├── PlayersOnline.tsx   # HUD element
│   ├── CreditsCounter.tsx  # HUD element
│   └── Footer.tsx          # Footer
├── hooks/
│   ├── useAudio.ts         # Web Audio API sound synthesis
│   ├── useKonamiCode.ts    # Konami code detection
│   └── useAchievements.ts  # Achievement state management
└── lib/
    ├── siteConfig.ts       # Centralized content configuration
    ├── lightCycle.ts        # Light cycle physics & rendering
    └── gameAI.ts            # Tron game AI opponent logic
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
git clone <repo-url>
cd portfolio-tron
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

## Configuration

All site content (text, labels, project data, blog entries, skill nodes, achievements) is centralized in `src/lib/siteConfig.ts`. Update values there to customize the portfolio.

## License

MIT
