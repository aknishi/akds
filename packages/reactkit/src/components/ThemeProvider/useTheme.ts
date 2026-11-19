import React from 'react';
import { ThemeContext } from './ThemeContext';
import type { ThemeContextValue } from './ThemeContext';

/**
 * Returns the selected theme, the resolved (rendered) scheme, and a setter
 * from the nearest `ThemeProvider`. Falls back to `'system'` / `'light'` and a
 * no-op setter if used outside a provider.
 */
export function useTheme(): ThemeContextValue {
  return React.useContext(ThemeContext);
}
