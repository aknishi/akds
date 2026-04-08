import React from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeContextValue {
  /** The currently active theme. */
  theme: Theme;
  /** Sets the active theme. */
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = React.createContext<ThemeContextValue>({
  theme: 'light',
  setTheme: () => {},
});
