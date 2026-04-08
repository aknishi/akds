import type { Theme } from './ThemeContext';

export type { Theme };

export interface ThemeProviderProps {
  /** Initial theme. Defaults to `'light'`. */
  defaultTheme?: Theme;
  /** Controlled theme value. When provided, the provider is controlled and `onThemeChange` must be used to update it externally. */
  theme?: Theme;
  /** Called when the theme changes via `setTheme`. Only relevant in controlled mode. */
  onThemeChange?: (theme: Theme) => void;
  /** The element to receive the `data-theme` attribute. Defaults to `document.documentElement`. Pass `null` to disable DOM attribute management. */
  target?: HTMLElement | null;
  /** Content rendered inside the provider. */
  children: React.ReactNode;
}
