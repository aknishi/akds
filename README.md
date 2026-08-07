# akds

A React design system: themeable components, design tokens, and an icon set, built as a monorepo.

## Packages

| Package | Description |
|---|---|
| [`@aknishi/akds-reactkit`](packages/reactkit) | React component library (Button, Combobox, Dialog, Tabs, etc.) |
| [`@aknishi/akds-tokens`](packages/tokens) | Design tokens, published as CSS custom properties and JS/TS values |
| [`@aknishi/akds-icons`](packages/icons) | SVG icon components generated from Material Symbols |
| [`@aknishi/create-akds-app`](packages/create-akds-app) | CLI to scaffold a new TypeScript + React + Vite app pre-wired with akds |

Apps in this repo consume the packages above rather than shipping their own copies:

- [`apps/demo`](apps/demo) — showcase of every component and its variants
- [`apps/playground`](apps/playground) — minimal sandbox for quick manual testing

## Using akds in your own project

The fastest way to start a new app is the scaffolding CLI:

```bash
npx @aknishi/create-akds-app my-app
cd my-app
npm run dev
```

To add akds to an existing app instead:

```bash
npm install @aknishi/akds-reactkit @aknishi/akds-tokens @aknishi/akds-icons
```

Wrap your app in `ThemeProvider` — it applies the design tokens' CSS and manages light/dark theme:

```tsx
import { ThemeProvider, Button } from '@aknishi/akds-reactkit';

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <Button appearance="solid" emphasis="accented">
        Get started
      </Button>
    </ThemeProvider>
  );
}
```

Icons are imported directly from `@aknishi/akds-icons` and used as standalone React components:

```tsx
import { SearchIcon } from '@aknishi/akds-icons';

<SearchIcon aria-hidden="true" />
```

See each package's README and the Storybook docs for the full component and API list.

## Working on this repo

Requires Node 18+ and npm.

```bash
npm install       # install and link all workspace packages
npm run build     # build every package (turbo, respects dependency order)
npm run dev       # run all packages/apps in watch mode
```

Common tasks:

```bash
npm run storybook                        # component explorer + docs, at localhost:6006
npm run typecheck                        # typecheck every package
npm run lint                             # lint every package
npm run test:run --workspace=packages/reactkit  # run reactkit's test suite
```

To work on the demo app against local package changes, build the package you changed (e.g. `npm run build` from `packages/reactkit`) and restart the demo's dev server, or use `npm run dev` at the root to keep packages rebuilding on change.

### Repo layout

```
packages/
  reactkit/     component library source, tests, Storybook stories
  tokens/       design tokens (source of truth) + generated CSS/JS output
  icons/        generated icon components (do not hand-edit, see icons package README)
  create-akds-app/  scaffolding CLI + app template
apps/
  demo/         showcase app for manual verification
  playground/   minimal sandbox app
```

### Releasing

Version bumps and changelogs are managed with [Changesets](https://github.com/changesets/changesets):

```bash
npm run changeset   # record a change
npm run version     # apply pending changesets, bump versions
npm run release     # build and publish to the registry
```

## Demo

[https://www.akds-storybook.com](https://www.akds-storybook.com)
