# Reckonwell: new website

The new website for [Reckonwell](https://www.reckonwell.com), a London accounting and outsourced financial operations firm.

> **Status:** Stage 1 of 8 complete (audit and setup). Not deployed. Work happens on `claude/intelligent-faraday-kb2332`.

## Documentation
- [`docs/project-plan.md`](docs/project-plan.md): architecture, stages, decisions needed
- [`docs/website-audit.md`](docs/website-audit.md): audit of the live site, including recovered pricing rules
- [`docs/design-system.md`](docs/design-system.md): colours, type, motion, voice
- [`docs/stages/`](docs/stages/): notes for each completed stage

## Requirements
- Node.js 20.9 or newer (developed on Node 22)
- npm

## Getting started
```bash
npm install
cp .env.example .env.local   # optional until Stage 6
npm run dev                  # http://localhost:3000
```

## Scripts
| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run test` | Unit tests (Vitest) |
| `npm run check` | All of the above, in order |

## Useful routes
- `/`: homepage (foundation version)
- `/design-system`: design tokens and components (not indexed)

## Project structure
See `docs/project-plan.md` §2.2.
