import React from 'react';

/**
 * `'system'` follows the OS color scheme (no `data-theme` attribute is set);
 * `'light'` and `'dark'` pin the scheme regardless of the OS setting.
 */
export type Theme = 'light' | 'dark' | 'system';

/** The color scheme actually rendered: a `'system'` theme resolved via the OS setting. */
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextValue {
  /** The selected theme, including `'system'`. */
  theme: Theme;
  /** The scheme currently rendered. Tracks OS changes while `theme` is `'system'`. */
  resolvedTheme: ResolvedTheme;
  /** Sets the active theme. Pass `'system'` to go back to following the OS. */
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = React.createContext<ThemeContextValue>({
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => {},
});
