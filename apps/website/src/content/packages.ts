export interface PackageEntry {
  name: string;
  tagline: string;
  description: string;
  install: string;
  usage?: string;
}

export const packages: PackageEntry[] = [
  {
    name: '@aknishi/akds-reactkit',
    tagline: 'React component library',
    description:
      'Themeable React components — Button, Combobox, Dialog, Tabs, and more — built on akds design tokens, with accessibility and keyboard support baked in.',
    install: 'npm install @aknishi/akds-reactkit',
    usage: `import { Button, ThemeProvider } from '@aknishi/akds-reactkit';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <Button appearance="solid" emphasis="accented">
        Get started
      </Button>
    </ThemeProvider>
  );
}`,
  },
  {
    name: '@aknishi/akds-tokens',
    tagline: 'Design tokens',
    description:
      'The primitive and semantic color, spacing, typography, elevation, and breakpoint tokens that power every akds component — published as CSS custom properties and typed JS/TS values.',
    install: 'npm install @aknishi/akds-tokens',
    usage: `import '@aknishi/akds-tokens/css';
import { spacing, semanticColors } from '@aknishi/akds-tokens';`,
  },
  {
    name: '@aknishi/akds-icons',
    tagline: 'Icon set',
    description:
      'SVG icon components generated from Material Symbols (Rounded), sized and colored with akds tokens.',
    install: 'npm install @aknishi/akds-icons',
    usage: `import { SearchIcon } from '@aknishi/akds-icons';

<SearchIcon size="md" />`,
  },
  {
    name: '@aknishi/create-akds-app',
    tagline: 'CLI scaffolding tool',
    description:
      'Scaffolds a new TypeScript + React + Vite app pre-wired with akds — routing, theming, and dark mode included from the first commit.',
    install: 'npx @aknishi/create-akds-app my-app',
    usage: `npx @aknishi/create-akds-app my-app
cd my-app
npm run dev`,
  },
];
