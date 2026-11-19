import { ToggleButton, ToggleGroup, useTheme } from '@aknishi/akds-reactkit';
import { DarkModeFilledIcon, DarkModeIcon, SunnyFilledIcon, SunnyIcon } from '@aknishi/akds-icons';
import type { ComponentEntry } from './types';

function ThemeReadout() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  return (
    <ToggleGroup
      size="sm"
      value={resolvedTheme}
      onChange={(value) => {
        const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setTheme(value === system ? 'system' : value === 'dark' ? 'dark' : 'light');
      }}
    >
      <ToggleButton value="light">
        {isDark ? <SunnyIcon /> : <SunnyFilledIcon />}
        Light
      </ToggleButton>
      <ToggleButton value="dark">
        {isDark ? <DarkModeFilledIcon /> : <DarkModeIcon />}
        Dark
      </ToggleButton>
    </ToggleGroup>
  );
}

export const themeProvider: ComponentEntry = {
  slug: 'theme-provider',
  name: 'Theme provider',
  category: 'System',
  summary:
    'The light/dark theme context provider. Wrap your app root once — every akds component and token reads from it automatically.',
  sourcePath: 'packages/reactkit/src/components/ThemeProvider',
  storybookId: 'theme-provider--docs',
  preview: <ThemeReadout />,
  examples: [
    {
      title: 'Reading the current theme',
      description: "This site's own theme toggle (top right) is built with useTheme — this example reads the same context.",
      render: () => <ThemeReadout />,
      code: `function ThemeToggle() {
  // resolvedTheme is what's on screen, even while following the OS ('system').
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  return (
    <ToggleGroup
      size="sm"
      value={resolvedTheme}
      onChange={(value) => {
        // Choosing the scheme the OS already uses goes back to 'system'
        // rather than pinning it against future OS changes.
        const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setTheme(value === system ? 'system' : value === 'dark' ? 'dark' : 'light');
      }}
    >
      <ToggleButton value="light">
        {isDark ? <SunnyIcon /> : <SunnyFilledIcon />}
        Light
      </ToggleButton>
      <ToggleButton value="dark">
        {isDark ? <DarkModeFilledIcon /> : <DarkModeIcon />}
        Dark
      </ToggleButton>
    </ToggleGroup>
  );
}

<ThemeProvider>
  <ThemeToggle />
</ThemeProvider>`,
    },
  ],
  accessibilityNotes: [
    'Theme provider itself renders no DOM — it sets a data-theme attribute on the target element (document.documentElement by default) that the CSS cascade in @aknishi/akds-tokens/css responds to.',
    'The default theme is \'system\': no data-theme is set, so the tokens follow the OS through prefers-color-scheme and the page declares color-scheme: light dark, so scrollbars and native form controls match. Changes to the OS setting apply live.',
    'Any theme toggle should offer a way back to the system setting. useTheme exposes resolvedTheme (what is on screen) alongside theme, so a two-state light/dark toggle can return to \'system\' when the user picks the scheme the OS already uses.',
    'A non-root target becomes a themed subtree with its own color-scheme, tokens, background, and text color, so a light section inside a dark page stays readable.',
    'To avoid a flash of the wrong theme on load, add <meta name="color-scheme" content="light dark"> and apply any stored override to data-theme in a small inline script before your app bundle.',
  ],
  props: [
    { name: 'defaultTheme', type: "'light' | 'dark' | 'system'", default: "'system'", description: "Initial theme, used only in uncontrolled mode. 'system' follows the OS color scheme." },
    { name: 'theme', type: "'light' | 'dark' | 'system'", description: 'Controlled theme value. When provided, onThemeChange must be used to update it.' },
    { name: 'onThemeChange', type: '(theme: Theme) => void', description: 'Called when the theme changes via setTheme. Required in controlled mode.' },
    { name: 'target', type: 'HTMLElement | null', default: 'document.documentElement', description: "Element that receives data-theme. Pass null to disable DOM attribute management." },
    { name: 'children', type: 'React.ReactNode', description: 'Content rendered inside the provider. Required.' },
  ],
  doDont: [
    { do: 'Mount a single Theme provider at the root of your app.', dont: "Don't nest multiple Theme providers unless you deliberately need a scoped theme override with a custom target." },
  ],
  related: [],
};
