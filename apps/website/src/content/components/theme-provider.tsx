import { Button, useTheme } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

function ThemeReadout() {
  const { theme, setTheme } = useTheme();
  return (
    <Button appearance="bordered" emphasis="neutral" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Current theme: {theme} — toggle
    </Button>
  );
}

export const themeProvider: ComponentEntry = {
  slug: 'theme-provider',
  name: 'ThemeProvider',
  category: 'System',
  summary:
    'The light/dark theme context provider. Wrap your app root once — every akds component and token reads from it automatically.',
  sourcePath: 'packages/reactkit/src/components/ThemeProvider',
  examples: [
    {
      title: 'Reading the current theme',
      description: "This site's own theme toggle (top right) is built with useTheme — this example reads the same context.",
      render: () => <ThemeReadout />,
      code: `function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Current theme: {theme} — toggle
    </Button>
  );
}

<ThemeProvider defaultTheme="light">
  <ThemeToggle />
</ThemeProvider>`,
    },
  ],
  accessibilityNotes: [
    'ThemeProvider itself renders no DOM — it sets a data-theme attribute on the target element (document.documentElement by default) that the CSS cascade in @aknishi/akds-tokens/css responds to.',
    'Respecting the user\'s OS-level color scheme is automatic: if no data-theme is set, tokens fall back to a prefers-color-scheme media query.',
  ],
  props: [
    { name: 'defaultTheme', type: "'light' | 'dark'", default: "'light'", description: 'Initial theme, used only in uncontrolled mode.' },
    { name: 'theme', type: "'light' | 'dark'", description: 'Controlled theme value. When provided, onThemeChange must be used to update it.' },
    { name: 'onThemeChange', type: '(theme: Theme) => void', description: 'Called when the theme changes via setTheme. Required in controlled mode.' },
    { name: 'target', type: 'HTMLElement | null', default: 'document.documentElement', description: "Element that receives data-theme. Pass null to disable DOM attribute management." },
    { name: 'children', type: 'React.ReactNode', description: 'Content rendered inside the provider. Required.' },
  ],
  doDont: [
    { do: 'Mount a single ThemeProvider at the root of your app.', dont: "Don't nest multiple ThemeProviders unless you deliberately need a scoped theme override with a custom target." },
  ],
  related: [],
};
