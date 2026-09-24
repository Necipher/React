# AGENTS.md

## Repo structure

Three independent full-stack projects in one git repo. **Not a monorepo** — no shared tooling, no workspaces.

| Project | Frontend | Backend | Backend port | DB |
|---------|----------|---------|-------------|----|
| `Microblog/` | `app/` — React 19 + Vite 8 + CSS Modules | `backend/` — Express 5, CommonJS | **5004** | PostgreSQL |
| `PTM/` | `app/` — React 19 + rolldown-vite 7 | `backend/` — Express 5, CommonJS | **8002** | JSON file |
| `RO/` | `app/` — React 19 + rolldown-vite 7 | `backend/` — Express 5, CommonJS | **8000** | JSON file |

## Commands

Each project has its own `package.json`. All frontend dirs: `npm run dev` (port 3000), `npm run build`, `npm run lint`.

```
# Microblog (backend has NO npm start — use node directly)
cd Microblog/backend && node server.js
cd Microblog/app && npm run dev

# PTM
cd PTM/backend && npm start
cd PTM/app && npm run dev

# RO
cd RO/backend && npm start
cd RO/app && npm run dev
```

No test suites, no typecheck, no CI. `npm run lint` in `app/` dirs is the only automated check. Verify changes via `npm run build`.

## Critical quirks

- **All Vite apps bind port 3000** — only run one frontend at a time.
- **Backend `node_modules` are committed to git** (~2,200 of ~2,400 tracked files). Backend dirs have no `.gitignore`.
- **PTM and RO use `rolldown-vite`** via npm alias — do not "fix" these to stock Vite.
- **Microblog backend has no `npm start`** — the test script is a stub (`exit 1`). Run `node server.js` directly.
- **All ports and API URLs are hardcoded** — no proxy, no env-driven config.
- **Mixed modules**: backends are CommonJS (`"type": "commonjs"`), frontends are ESM (`"type": "module"`).
- **Microblog's `schema.sql` is missing a `quick_status` column** that `server.js` references — returns null at runtime.
- **Microblog has a `.env` with real secrets** (`JWT_SECRET`, `DATABASE_URL`, etc.) — treat as sensitive, never print values.
- **RO's `database.json` is ~36K lines** (base64 images) — avoid large diffs. PTM's is small seed data.
- **Microblog backend** hand-rolls JWT auth, cookie parsing, and token refresh — not using standard packages for these.

## Code style
- Prefer simple, readable solutions over clever ones. If a junior dev
  couldn't follow it in one read, simplify it.
- Build for future needs but no over-engineering.
- Over-engineering is worse than under-engineering in this codebase.
  When in doubt, pick the simpler option — it's easier to add structure
  later than to remove it.
- Functions do one thing. If a function needs a comment explaining its
  sections, split it.
- Minimal comments — code should be self-explanatory through naming.
  Comment only non-obvious "why", never "what".
- No unnecessary wrapper classes, factories, or indirection layers
  unless there's a real, current reason for them.
- Match existing patterns in the codebase rather than introducing new ones.
- Flat is better than nested. Prefer early returns / guard clauses over
  deep if/else nesting.
- After finishing a change, do a deletion pass: read every line you added
  and ask "does this actually need to exist?" Remove dead code, redundant
  checks, unnecessary variables, and logic that duplicates what already
  exists. If the change still works with less, ship less.
- When I see a better or cleaner way to do something that would break or
  conflict with the rules above, I will present both approaches with their
  trade-offs so you can decide. Don't silently skip a better pattern just
  because it clashes with a rule — flag it.

## Stack conventions

### JavaScript / general
- Use `const`/`let`, never `var`.
- Prefer async/await over `.then()` chains.
- Destructure props/params where it improves readability, not everywhere reflexively.
- No default exports for anything except React components and Express route
  files — named exports elsewhere for greppability.

### React
- Function components + hooks only. No class components.
- Co-locate a component's CSS Module with the component file.
- Don't reach for `useEffect` for things that can be derived during render.
- Lift state only as high as it needs to go — no reflexive global state.

### Express / backend
- Route handlers stay thin — validation and business logic go in separate
  functions/modules, not inline in the route.
- Consistent error handling. Do not mix styles across routes.
- Validate request input explicitly at the top of the handler; fail fast.

### PostgreSQL
- Parameterized queries only — never string-concatenate SQL.
- Prefer explicit column lists (`SELECT id, name FROM ...`) over `SELECT *`.

## Planned changes
- TypeScript is being introduced incrementally — when editing files that
  are already `.ts`/`.tsx`, keep them typed; don't add TS to untouched
  `.js` files unless asked.
- A Go service may be added later — do not assume Node/Express patterns
  apply to it when it appears.