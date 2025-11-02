Top-level

- `.vscode/` — editor settings (optional)
- `public/` — static public assets
- `index.html` — app HTML entry
- `vite.config.ts` — Vite configuration and aliases
- `package.json` — scripts and dependencies
- `components.json` — component generator config
- `tsconfig*.json` — TypeScript configuration files

src/

- `src/main.tsx` — React bootstrap (mounts `App`)
- `src/App.tsx` — root React component
- `src/index.css` — Tailwind + global styles
- `src/assets/` — static assets (images, fonts)
- `src/components/`
  - `common/` — small shared components
  - `ui/` — design-system primitives (e.g. `button.tsx`)
- `src/configs/` — configuration helpers
- `src/constants/` — app-wide constants
- `src/hooks/` — custom React hooks
- `src/layouts/`
  - `admin/` — admin layout components
  - `user/` — user layout components
- `src/lib/` — library helpers (e.g. `src/lib/utils.ts`)
- `src/pages/` — route/page components
- `src/providers/` — React contexts and providers
- `src/routes/` — route definitions
- `src/schemas/` — validation schemas (zod)
- `src/stores/` — Zustand or other state stores
- `src/styles/` — design tokens, theme files
- `src/utils/` — general utilities

Representative files referenced in this tree:

- `src/components/ui/button.tsx` — Button primitive and `buttonVariants`
- `src/lib/utils.ts` — `cn(...)` helper wrapping `clsx` + `twMerge`
- `vite.config.ts` — path aliases (e.g. `@` -> `./src`)

## Tech stack (concise)

- Framework: React (entry: `src/main.tsx`, root: `src/App.tsx`)
- Bundler / Dev server: Vite (`vite.config.ts`)
- Language: TypeScript (`tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`)
- Styling: Tailwind CSS (`src/index.css`)
- Class utilities: `clsx` + `tailwind-merge` (helper: `src/lib/utils.ts`)
- Component utilities: `class-variance-authority` (`buttonVariants`), Radix primitives (where used), `lucide-react` for icons
- State management: Zustand (in `src/stores/`)
- Validation: Zod (`src/schemas/`)
- Tooling: ESLint (`eslint.config.js`), Prettier (if present), Vite React SWC plugin (`@vitejs/plugin-react-swc` in `vite.config.ts`)
