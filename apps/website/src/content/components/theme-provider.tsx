import { ToggleButton, ToggleGroup, useTheme } from '@aknishi/akds-reactkit';
import { DarkModeFilledIcon, DarkModeIcon, SunnyFilledIcon, SunnyIcon } from '@aknishi/akds-icons';
import type { ComponentEntry } from './types';

function ThemeReadout() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <ToggleGroup size="sm" value={isDark ? 'dark' : 'light'} onChange={(value) => setTheme(value === 'dark' ? 'dark' : 'light')}>
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
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <ToggleGroup size="sm" value={isDark ? 'dark' : 'light'} onChange={(value) => setTheme(value === 'dark' ? 'dark' : 'light')}>
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

<ThemeProvider defaultTheme="light">
  <ThemeToggle />
</ThemeProvider>`,
    },
  ],
  accessibilityNotes: [
    'Theme provider itself renders no DOM — it sets a data-theme attribute on the target element (document.documentElement by default) that the CSS cascade in @aknishi/akds-tokens/css responds to.',
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
    { do: 'Mount a single Theme provider at the root of your app.', dont: "Don't nest multiple Theme providers unless you deliberately need a scoped theme override with a custom target." },
  ],
  related: [],
};
