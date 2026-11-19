import type { Theme, ResolvedTheme } from './ThemeContext';

export type { Theme, ResolvedTheme };

export interface ThemeProviderProps {
  /**
   * Initial theme. Defaults to `'system'`, which follows the OS color scheme
   * (no `data-theme` attribute is set).
   */
  defaultTheme?: Theme;
  /** Controlled theme value. When provided, the provider is controlled and `onThemeChange` must be used to update it externally. */
  theme?: Theme;
  /** Called when the theme changes via `setTheme`. Only relevant in controlled mode. */
  onThemeChange?: (theme: Theme) => void;
  /**
   * The element to receive the `data-theme` attribute. Defaults to
   * `document.documentElement`. A non-root target becomes a themed subtree: it
   * gets its own `color-scheme`, tokens, background, and text color. Pass
   * `null` to disable DOM attribute management.
   */
  target?: HTMLElement | null;
  /** Content rendered inside the provider. */
  children: React.ReactNode;
}
