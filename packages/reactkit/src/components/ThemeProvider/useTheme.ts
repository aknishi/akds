import React from 'react';
import { ThemeContext } from './ThemeContext';
import type { ThemeContextValue } from './ThemeContext';

/**
 * Returns the current theme and a setter from the nearest `ThemeProvider`.
 * Falls back to `'light'` and a no-op setter if used outside a provider.
 */
export function useTheme(): ThemeContextValue {
  return React.useContext(ThemeContext);
}
