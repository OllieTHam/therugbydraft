# The Rugby Draft — Project Source of Truth

This file is read automatically by Claude Code and should be treated as the
single source of truth for how this project is built. GitHub issues should
reference this file ("see CLAUDE.md") rather than repeating these rules.

## Project Overview

**What:** The Rugby Draft is a browser-based Premiership rugby draft and season
simulator. Players take turns drafting from a pool of real club players to
build a squad, then simulate matches using an engine that weighs position
ratings, international caps, and team balance. The current live mode is called "Prem 20-0" — an unbeaten 18-game league season plus playoffs, a perfect 20-0 record (the literal score, not the brand name).

**Stack:** React + Vite + Tailwind CSS, plain JavaScript (not TypeScript —
see below), static JSON player data, deployed on Vercel free tier. No
backend, no authentication, and no persistence in v1.

**Domain:** therugbydraft.app (registered via Namecheap)
**Repo:** github.com/OllieTHam/therugbydraft

## Language: JavaScript, not TypeScript

This project uses plain JavaScript (`.jsx`), not TypeScript. This was a
deliberate decision, not a default — full TypeScript's learning curve isn't
worth taking on for this project's size and the way it's being built.

Use JSDoc comments to document data shapes, especially:
- The player data structure (`src/data/players.placeholder.json` and any
  successor file)
- The match engine's inputs/outputs (once Issue 3 is implemented)

Example:
```js
/**
 * @typedef {Object} Player
 * @property {string}   name
 * @property {string}   club
 * @property {string[]} positions
 * @property {number}   overall
 * @property {number}   intlCaps
 */
```

## Player position tags

The canonical position tags used in `positions` arrays and squad validation are
these 12 values (see `src/data/validation.js` — `REQUIRED_POSITIONS`):

```
Loosehead Prop  Tighthead Prop  Hooker
Lock            Flanker         Number 8
Scrum-half      Fly-half
Inside Centre   Outside Centre
Wing            Fullback
```

**Key design decisions:**
- `positions` is an unordered array — there is no "primary" position.
  A player who can play both centres has `["Inside Centre", "Outside Centre"]`.
- **Flanker** replaces both "Blindside Flanker" and "Openside Flanker".
  There is no in-game distinction; two Flanker-tagged players are needed per squad.
- **Wing** replaces both "Left Wing" and "Right Wing" for the same reason.
  Two Wing-tagged players are needed per squad.
- **Inside Centre / Outside Centre remain split** — these are genuinely different
  skill profiles and the engine treats them separately.
- Lock also requires two players per squad (unchanged from original design).

## Testing: Vitest + React Testing Library (already configured)

Testing infrastructure already exists in this repo (`npm test` runs Vitest).
Don't re-set this up.

**TDD requirement — applies selectively:**
- **Logic-heavy issues** (draft rules, match simulation engine,
  scoring/rating calculations): write a failing test FIRST, then implement
  until it passes. This includes Issue 3 (match engine) and any future
  scoring/balance logic.
- **UI/page issues** (Settings, layout, navigation, styling): no test-first
  requirement. Build it, verify manually in the browser. A simple "renders
  without crashing" test is optional, not required.

If unsure which category an issue falls into, default to treating it as
logic-heavy.

## Logging

No formal logging system for v1 — there's no backend to monitor, so most
logging advice aimed at servers doesn't apply yet.

When building the match engine (Issue 3) specifically, add temporary
`console.log` statements at key calculation steps to make the logic visible
while building and debugging. These don't need to be production-grade and
can be removed once the engine works.

Revisit this decision when persistence/leaderboard (Supabase) is added in a
later version — that's when proper logging becomes worth setting up.

## Working principles (non-negotiable)

1. **One issue at a time.** Always confirm the output of the current issue
   before moving to the next. Don't bundle multiple issues into one prompt.
2. **GitHub issues need plain-English descriptions**, not just titles.
   Anyone unfamiliar with the codebase should be able to read an issue and
   understand what's being asked for.
3. **Decomposition.** Break each feature into the smallest reasonable piece
   before building. If a single prompt would require touching many files or
   making many assumptions, split it further.
4. **DRY.** Don't duplicate logic (e.g. rating calculations, position lists)
   across files — centralize it once and reuse it.
5. **Plain JS + JSDoc**, not TypeScript (see above).
6. **Confirm OS-specific behaviour before assuming command syntax** — Ollie
   is on Windows.

## Model guidance

- **Sonnet:** routine build work, UI pages, planning discussions.
- **Opus:** complex logic and engine design — specifically Issue 3 (match
  simulation engine) and Issue 4 (season simulator & league table), plus any future scoring/balance logic. Flag explicitly
  when a model switch is needed, in both Claude Code and the planning
  project.

## Known environment gotchas (Windows)

- GitHub CLI (`gh`) requires a full VS Code restart to be recognised after
  install.
- Claude Code must be exited before running update commands.
- Compound bash commands using `cd` will prompt for manual approval in
  Claude Code — this is expected security behaviour, not a bug.

## ## GitHub issue numbering

GitHub issue numbers do NOT follow a fixed offset from project issue
numbers. This broke during initial issue creation (a failed batch run
left some project issues uncreated, and GitHub never reuses numbers,
so later issues filled gaps rather than lining up). The issue TITLE
(e.g. "Issue 6: Draft logic") is the source of truth for project
numbering — never assume project Issue N is GitHub #N or #N+1. When
referring to an issue, use the title or look up its actual number on
GitHub; don't compute it.

## Out of scope for v1 (do not build unless explicitly asked)

- Authentication / user accounts
- Any backend or database (Supabase, etc.)
- Persistence of any kind
- Leaderboard

These are planned for v2/v3 once the core draft + simulation loop works.
Revisit this file's testing/logging guidance when they're added.

## Backlog context (reference only, not to be built unprompted)

- v2/v3: Six Nations mode, World Cup mode, full-league draft mode (all 10
  Premiership clubs drafted from historical squads)
- Leaderboard + Supabase persistence deferred until the leaderboard ships

## Before closing any issue — check this file

Before marking any issue as complete, check whether the work done changes
something this file currently assumes. Common triggers:
- Adding TypeScript, a backend, a database, persistence, or authentication
- Changing the testing approach (e.g. moving to full TDD everywhere)
- Changing the logging approach
- Anything that moves a feature out of "Out of scope for v1" above

If any of those apply, update the relevant section of this file as part of
that issue, before closing it. Don't leave it for later — an out-of-date
CLAUDE.md will cause future issues to be built on wrong assumptions.

---
*Last updated: 22 June 2026. Keep this file current — it should reflect
present reality, not history. Update it whenever a decision in this document
changes.*
